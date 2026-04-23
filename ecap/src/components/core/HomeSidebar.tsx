import { Box, Card, Typography, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { FlashCard } from "../../types";
import { fetchAutoDetectedInsights } from "../../store/insightsSlice";
import type { RootState, AppDispatch } from "../../store/store";
import InsightModal from "../modals/InsightModal";
import { transformInsightsData } from "../../utils/transformInsightsData";

interface InsightsGridProps {
  flashCards: FlashCard[];
  onNavigate: (page: string) => void;
  onCardClick?: (card: FlashCard) => void;
}

interface APIMetric {
  metric_name: string;
  value: number;
  PER_CENT: number;
}

interface APIPeriodData {
  metrics: APIMetric[];
  KEY_INSIGHT: string;
  DEEP_DIVE: string;
}

interface APIResponse {
  [lob: string]: unknown;
  Top5: string[];
  snapshot: string;
  Period: string;
}

interface InsightCard {
  id: string;
  title: string;
  value: string;
  trend: string;
  description: string;
  kpi2_label?: string;
  kpi2_value?: string;
  lineOfBusiness: string;
  category: string;
  rawData: APIMetric[];
}

export default function InsightsGrid({
  flashCards,
  onNavigate,
  onCardClick,
}: InsightsGridProps) {
  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector((state: RootState) => state.insights.data);
  const loading = useSelector((state: RootState) => state.insights.loading);
  const error = useSelector((state: RootState) => state.insights.error);
  const [insightCards, setInsightCards] = useState<InsightCard[]>([]);
  const [transformedFlashCards, setTransformedFlashCards] = useState<
    FlashCard[]
  >([]);
  const [selectedCard, setSelectedCard] = useState<FlashCard | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAutoDetectedInsights(true));
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      // Use the same transformer as the full insights page for consistency
      const allCards = transformInsightsData(data as any);
      setTransformedFlashCards(allCards);

      // Reorder cards to match the Top5 order from the API response
      const top5: string[] = (data as any).Top5 || [];
      const normCat = (s: string) => s.toLowerCase().replace(/[\s/\-_]/g, "");
      let flashCards: typeof allCards;
      if (top5.length > 0) {
        const ordered = top5
          .map((item) => {
            const [lob, cat] = item.split(" : ").map((s) => s.trim());
            return allCards.find(
              (fc) =>
                fc.line_of_business === lob &&
                normCat(fc.category).startsWith(normCat(cat)),
            );
          })
          .filter(Boolean) as typeof allCards;
        // Fill remaining slots from allCards if Top5 had mismatches
        const usedIds = new Set(ordered.map((c) => c.id));
        allCards.forEach((fc) => {
          if (!usedIds.has(fc.id) && ordered.length < 5) ordered.push(fc);
        });
        flashCards = ordered.slice(0, 5);
      } else {
        flashCards = allCards.slice(0, 5);
      }

      // Convert FlashCards to InsightCards for display
      const transformedCards = flashCards.map((card, index) => {
        // Get the primary metric label from the card's KPIs
        let primaryMetricLabel = card.metric_label;

        // Map to display labels based on category and available KPIs
        if (card.kpis) {
          const kpiKeys = Object.keys(card.kpis);
          if (kpiKeys.length > 0) {
            const primaryKpiKey = kpiKeys[0];
            // Use display label mapping
            const displayLabels: Record<string, string> = {
              // IP Med/Surg
              pmpm_paid: "Paid PMPM",
              pmpm_allowed: "Allowed PMPM",
              admits_per_1000: "Admits/K",
              allowed_cost_per_admit: "Cost/Admit",
              cmi: "CMI",
              oon_percentage: "OON %",

              // IP Auth
              prior_auth_pmpm: "Prior Auth PMPM",
              auth_per_1000: "Auth per K",
              cost_per_admit: "Cost per Admit",
              auth_count: "Auth Count",
              auth_claim_count: "Auth Claim CNT",

              // Network Management / OON
              npar_pmpm: "NPAR PMPM",
              npar_claims_per_1000: "NPAR Claims/K",
              npar_pmpm_ratio: "NPAR Ratio",
              npar_claim_amount: "NPAR Amount",
              npar_claim_count: "NPAR Claim Count",
              npar_allowed_pmpm: "NPAR Allowed PMPM",
            };

            primaryMetricLabel =
              displayLabels[primaryKpiKey] || primaryMetricLabel;
          }
        }

        // Format the value with K/M units for currency values
        const formatValueWithUnits = (value: string): string => {
          // Remove any existing currency symbols and commas
          const numericValue = parseFloat(value.replace(/[$,]/g, ""));

          // Check if it's a currency value (contains $ or is a large number)
          if (value.includes("$") || numericValue >= 1000) {
            if (numericValue >= 1000000) {
              return `$${(numericValue / 1000000).toFixed(1)}M`;
            } else if (numericValue >= 1000) {
              return `$${(numericValue / 1000).toFixed(1)}K`;
            } else if (value.includes("$")) {
              return `$${numericValue.toFixed(2)}`;
            }
          }

          return value; // Return original if not currency
        };

        const admitsRaw = card.kpis?.admits_per_1000;
        const admitsDisplay = admitsRaw != null ? String(admitsRaw) : undefined;

        const isIPMedSurg =
          card.category === "IP Med/Surg" ||
          card.title?.includes("IP Med/Surg");
        const isOON =
          card.category === "OON" ||
          card.category === "OON Network" ||
          card.title?.includes("OON");
        const isIPAuth =
          card.category === "IP Auth" ||
          card.title?.includes("IP AUTH") ||
          card.title?.includes("IP Auth");

        const pmpmPaidRaw = card.kpis?.pmpm_paid ?? card.kpis?.pmpm;
        const pmpmPaidDisplay =
          pmpmPaidRaw != null
            ? formatValueWithUnits(String(pmpmPaidRaw))
            : formatValueWithUnits(card.metric_value);

        const authCountRaw = card.kpis?.auth_count;
        const authCountDisplay =
          authCountRaw != null ? String(authCountRaw) : undefined;
        const pmpmRatioRaw =
          card.kpis?.PMPM_RATIO ??
          card.kpis?.pmpm_ratio ??
          card.kpis?.npar_pmpm_ratio;
        const pmpmRatioDisplay =
          pmpmRatioRaw != null ? String(pmpmRatioRaw) : undefined;
        const nparPaidPmpmRaw =
          card.kpis?.NPAR_PAID_PMPM ??
          card.kpis?.npar_paid_pmpm ??
          card.kpis?.npar_pmpm;
        const nparPaidPmpmDisplay =
          nparPaidPmpmRaw != null
            ? formatValueWithUnits(String(nparPaidPmpmRaw))
            : undefined;
        const nparClaimsPerKRaw =
          card.kpis?.NPAR_CLAIMS_PER_K ??
          card.kpis?.npar_claims_per_k ??
          card.kpis?.npar_claims_per_1000;
        const nparClaimsPerKDisplay =
          nparClaimsPerKRaw != null ? String(nparClaimsPerKRaw) : undefined;

        let kpi1Label = primaryMetricLabel;
        let kpi1Value = formatValueWithUnits(card.metric_value);
        let kpi2Label: string | undefined;
        let kpi2Value: string | undefined;

        if (isIPMedSurg) {
          kpi1Label = "Paid PMPM";
          kpi1Value = pmpmPaidDisplay;
          kpi2Label = "Admits/K";
          kpi2Value = admitsDisplay;
        } else if (isOON) {
          kpi1Label = "PMPM Ratio";
          kpi1Value =
            pmpmRatioDisplay ?? formatValueWithUnits(card.metric_value);
          kpi2Label = "NPAR Claims/K";
          kpi2Value = nparClaimsPerKDisplay;
        } else if (isIPAuth) {
          const priorAuthPmpmRaw = card.kpis?.prior_auth_pmpm;
          kpi1Label = "Prior Auth PMPM";
          kpi1Value =
            priorAuthPmpmRaw != null
              ? formatValueWithUnits(String(priorAuthPmpmRaw))
              : formatValueWithUnits(card.metric_value);
          const authPerKRaw = card.kpis?.auth_per_1000;
          kpi2Label = "Auth per K";
          kpi2Value = authPerKRaw != null ? String(authPerKRaw) : undefined;
        }

        return {
          id: card.id,
          title: card.title,
          value: kpi1Value,
          trend: card.trend_label,
          description: kpi1Label,
          kpi2_label: kpi2Label,
          kpi2_value: kpi2Value,
          lineOfBusiness: card.line_of_business,
          category: card.category,
          rawData: [],
        };
      });
      setInsightCards(transformedCards);
    }
  }, [data]);

  const handleCardClick = (card: InsightCard) => {
    // Create a FlashCard from the InsightCard data
    const flashCard: FlashCard = {
      id: card.id,
      title: card.title,
      category: card.category,
      priority: "medium" as const,
      status: "active" as const,
      metric_value: card.value,
      metric_label: card.title,
      trend: card.trend,
      trend_label: card.trend,
      detection_source: "auto-detected",
      line_of_business: card.lineOfBusiness,
      description: card.description,
      confidence: 85,
      insights: [card.description],
      recommended_actions: [
        "Review detailed metrics",
        "Analyze trend patterns",
      ],
      data_points: { value: card.value, trend: card.trend },
      detected_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setSelectedCard(flashCard);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", flex: 1, height: "100%" }}
    >
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress size={40} sx={{ color: "#1A3673" }} />
        </Box>
      ) : error ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Typography
            sx={{ color: "#EF4444", fontFamily: "Open Sans", fontSize: "14px" }}
          >
            {error}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            // height: '360px',
            overflow: "auto",
            backgroundColor: "#F9FAFB",
            padding: "8px",
          }}
        >
          {(insightCards.length > 0 ? insightCards : flashCards)
            .slice(0, 5)
            .map((card, _cardIdx, _arr) => {
              const trendValue =
                "trend_label" in card
                  ? card.trend_label
                  : (card as any).trend || "";
              const isPositive =
                trendValue.includes("+") ||
                trendValue === "up" ||
                trendValue.includes("↑");

              return (
                <Box
                  key={card.id}
                  onClick={() => {
                    let flashCard: FlashCard;

                    if ("metric_value" in card) {
                      flashCard = card as FlashCard;
                    } else {
                      const fullCard = transformedFlashCards.find(
                        (fc) => fc.id === (card as any).id,
                      );
                      flashCard = fullCard || (card as any);
                    }

                    if (onCardClick) {
                      onCardClick(flashCard);
                    }
                  }}
                  sx={{
                    height: "56px",
                    padding: "8px 12px",
                    backgroundColor: "white",
                    border: "1px solid #D9E1E7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                    position: "relative",
                    cursor: "pointer",
                    borderLeft: `3px solid ${isPositive ? "#16a34a" : "#dc2626"}`,
                    transition: "transform 0.15s ease, box-shadow 0.15s ease",
                    "&:hover": {
                      transform: "scale(1.015)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      zIndex: 1,
                    },
                  }}
                >
                  {/* Left Section - Title */}
                  <Box sx={{ width: "155px", flexShrink: 0 }}>
                    <Typography
                      sx={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#0059B2",
                        fontFamily: "Open Sans",
                        lineHeight: 1.2,
                      }}
                    >
                      {card.title}
                    </Typography>
                  </Box>

                  {/* Middle Section - Data Values */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 4,
                      alignItems: "center",
                      flex: 1,
                      justifyContent: "center",
                      mr: 2,
                    }}
                  >
                    {/* Primary KPI */}
                    <Box sx={{ textAlign: "left", minWidth: "80px" }}>
                      <Typography
                        sx={{
                          fontSize: "9px",
                          fontWeight: 700,
                          color: "#9CA3AF",
                          fontFamily: "Open Sans",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          lineHeight: 1.2,
                        }}
                      >
                        {"description" in card
                          ? (card as any).description
                          : "metric_label" in card
                            ? card.metric_label
                            : "Paid PMPM"}
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <Typography
                          sx={{
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "#111827",
                            fontFamily: "Open Sans",
                            lineHeight: 1.2,
                          }}
                        >
                          {"metric_value" in card
                            ? card.metric_value
                            : (card as any).value}
                        </Typography>
                        {isPositive ? (
                          <TrendingUp size={11} color="#16a34a" />
                        ) : (
                          <TrendingDown size={11} color="#dc2626" />
                        )}
                      </Box>
                    </Box>

                    {/* Secondary KPI */}
                    {((card as any).kpi2_value ||
                      ("kpis" in card && card.kpis?.admits_per_1000) ||
                      ("kpis" in card && card.kpis?.npar_claims_per_1000)) && (
                      <Box sx={{ textAlign: "left", minWidth: "80px" }}>
                        <Typography
                          sx={{
                            fontSize: "9px",
                            fontWeight: 700,
                            color: "#9CA3AF",
                            fontFamily: "Open Sans",
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                            lineHeight: 1.2,
                          }}
                        >
                          {(card as any).kpi2_label ||
                            ("kpis" in card && card.kpis?.admits_per_1000
                              ? "Admits/K"
                              : "") ||
                            ("kpis" in card && card.kpis?.npar_claims_per_1000
                              ? "NPAR Claims/K"
                              : "") ||
                            ""}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "11px",
                              fontWeight: 700,
                              color: "#111827",
                              fontFamily: "Open Sans",
                              lineHeight: 1.2,
                            }}
                          >
                            {(card as any).kpi2_value ||
                              ("kpis" in card && card.kpis?.admits_per_1000) ||
                              ("kpis" in card &&
                                card.kpis?.npar_claims_per_1000) ||
                              ""}
                          </Typography>
                          {isPositive ? (
                            <TrendingUp size={11} color="#16a34a" />
                          ) : (
                            <TrendingDown size={11} color="#dc2626" />
                          )}
                        </Box>
                      </Box>
                    )}
                  </Box>

                  {/* Right Section - Arrow Icon */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      width: "25px",
                      height: "25px",
                      borderRadius: "6px",
                      backgroundColor: "#F8FAFC",
                      border: "1px solid #E2E8F0",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        backgroundColor: "#E3F2FD",
                        borderColor: "#0059B2",
                        transform: "translateX(2px)",
                        boxShadow: "0 2px 8px rgba(0, 89, 178, 0.15)",
                      },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      let flashCard: FlashCard;

                      if ("metric_value" in card) {
                        flashCard = card as FlashCard;
                      } else {
                        const fullCard = transformedFlashCards.find(
                          (fc) => fc.id === (card as any).id,
                        );
                        flashCard = fullCard || (card as any);
                      }

                      setSelectedCard(flashCard);
                      setIsModalOpen(true);
                    }}
                  >
                    <ChevronRight size={14} color="#0059B2" strokeWidth={2.5} />
                  </Box>
                </Box>
              );
            })}
        </Box>
      )}

      {/* Modal for detailed view */}
      {selectedCard && (
        <InsightModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          card={selectedCard}
        />
      )}
    </Box>
  );
}
