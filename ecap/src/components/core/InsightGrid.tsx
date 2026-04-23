import { Box, Typography, CircularProgress } from "@mui/material";
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
          <CircularProgress
            size={28}
            thickness={3}
            sx={{ color: "#1A3673", opacity: 0.6 }}
          />
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
            sx={{
              color: "#E3725F",
              fontFamily: "Open Sans",
              fontSize: "12px",
              letterSpacing: "0.01em",
            }}
          >
            {error}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            overflow: "hidden",
            backgroundColor: "#FFFFFF",
            borderRadius: "8px",
            border: "1px solid #E8EDF5",
            boxShadow: "0 1px 6px rgba(26, 54, 115, 0.07)",
          }}
        >
          {(insightCards.length > 0 ? insightCards : flashCards)
            .slice(0, 5)
            .map((card, cardIdx, arr) => {
              const trendValue =
                "trend_label" in card
                  ? card.trend_label
                  : (card as any).trend || "";
              const isPositive =
                trendValue.includes("+") ||
                trendValue === "up" ||
                trendValue.includes("↑");

              // Brand-aligned accent colors — turquoise for positive, terra cotta for negative
              const accentColor = isPositive ? "#00BBBA" : "#E3725F";
              const trendBg = isPositive
                ? "rgba(0,187,186,0.09)"
                : "rgba(227,114,95,0.09)";
              const trendTextColor = isPositive ? "#028283" : "#B94A3A";
              const isLast = cardIdx === arr.length - 1;

              const lobLabel =
                "lineOfBusiness" in card
                  ? (card as any).lineOfBusiness
                  : (card as FlashCard).line_of_business || "";

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
                    display: "flex",
                    alignItems: "center",
                    height: "62px",
                    pl: "12px",
                    pr: "10px",
                    position: "relative",
                    cursor: "pointer",
                    borderLeft: "3px solid transparent",
                    borderBottom: isLast ? "none" : "1px solid #F0F4FA",
                    transition:
                      "background-color 0.18s ease, border-left-color 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#F7FAFD",
                      borderLeftColor: accentColor,
                    },
                  }}
                >
                  {/* Rank Ordinal */}
                  <Typography
                    sx={{
                      fontSize: "9.5px",
                      fontWeight: 700,
                      color: "#C8D5E4",
                      fontFamily: "Open Sans",
                      letterSpacing: "0.06em",
                      width: "18px",
                      flexShrink: 0,
                      mr: "10px",
                      userSelect: "none",
                      lineHeight: 1,
                    }}
                  >
                    {String(cardIdx + 1).padStart(2, "0")}
                  </Typography>

                  {/* Title + LOB Badge */}
                  <Box sx={{ width: "148px", flexShrink: 0, mr: "12px" }}>
                    {lobLabel && (
                      <Typography
                        component="span"
                        sx={{
                          display: "inline-block",
                          fontSize: "7.5px",
                          fontWeight: 700,
                          letterSpacing: "0.09em",
                          textTransform: "uppercase",
                          backgroundColor: "#E1EDFF",
                          color: "#1A3673",
                          borderRadius: "3px",
                          px: "5px",
                          py: "1.5px",
                          fontFamily: "Open Sans",
                          lineHeight: 1,
                          mb: "3px",
                        }}
                      >
                        {lobLabel}
                      </Typography>
                    )}
                    <Typography
                      sx={{
                        fontSize: "11.5px",
                        fontWeight: 700,
                        color: "#1A3673",
                        fontFamily: "Open Sans",
                        lineHeight: 1.25,
                        letterSpacing: "-0.01em",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "block",
                      }}
                    >
                      {card.title}
                    </Typography>
                  </Box>

                  {/* KPI Metrics */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: "20px",
                      alignItems: "center",
                      flex: 1,
                      mr: "10px",
                    }}
                  >
                    {/* Primary KPI */}
                    <Box>
                      <Typography
                        sx={{
                          fontSize: "8px",
                          fontWeight: 700,
                          color: "#9EB3C8",
                          fontFamily: "Open Sans",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          lineHeight: 1,
                          mb: "3px",
                        }}
                      >
                        {"description" in card
                          ? (card as any).description
                          : "metric_label" in card
                            ? card.metric_label
                            : "Paid PMPM"}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#1C2B4A",
                          fontFamily: "Open Sans",
                          lineHeight: 1,
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {"metric_value" in card
                          ? card.metric_value
                          : (card as any).value}
                      </Typography>
                    </Box>

                    {/* Secondary KPI */}
                    {((card as any).kpi2_value ||
                      ("kpis" in card && card.kpis?.admits_per_1000) ||
                      ("kpis" in card &&
                        card.kpis?.npar_claims_per_1000)) && (
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "8px",
                            fontWeight: 700,
                            color: "#9EB3C8",
                            fontFamily: "Open Sans",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            lineHeight: 1,
                            mb: "3px",
                          }}
                        >
                          {(card as any).kpi2_label ||
                            ("kpis" in card && card.kpis?.admits_per_1000
                              ? "Admits/K"
                              : "") ||
                            ("kpis" in card &&
                            card.kpis?.npar_claims_per_1000
                              ? "NPAR Claims/K"
                              : "") ||
                            ""}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "13px",
                            fontWeight: 700,
                            color: "#1C2B4A",
                            fontFamily: "Open Sans",
                            lineHeight: 1,
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {(card as any).kpi2_value ||
                            ("kpis" in card && card.kpis?.admits_per_1000) ||
                            ("kpis" in card &&
                              card.kpis?.npar_claims_per_1000) ||
                            ""}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Trend Pill */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                      backgroundColor: trendBg,
                      borderRadius: "5px",
                      px: "7px",
                      py: "4px",
                      mr: "8px",
                      flexShrink: 0,
                    }}
                  >
                    {isPositive ? (
                      <TrendingUp
                        size={10}
                        color={trendTextColor}
                        strokeWidth={2.5}
                      />
                    ) : (
                      <TrendingDown
                        size={10}
                        color={trendTextColor}
                        strokeWidth={2.5}
                      />
                    )}
                    {trendValue && (
                      <Typography
                        sx={{
                          fontSize: "9px",
                          fontWeight: 700,
                          color: trendTextColor,
                          fontFamily: "Open Sans",
                          letterSpacing: "0.02em",
                          lineHeight: 1,
                        }}
                      >
                        {trendValue}
                      </Typography>
                    )}
                  </Box>

                  {/* Navigate Arrow */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "26px",
                      height: "26px",
                      borderRadius: "5px",
                      flexShrink: 0,
                      color: "#B0C0D4",
                      transition: "all 0.18s ease",
                      "&:hover": {
                        backgroundColor: "#E1EDFF",
                        color: "#1A3673",
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
                    <ChevronRight size={14} strokeWidth={2.5} />
                  </Box>
                </Box>
              );
            })}
        </Box>
      )}

      {/* Detail modal */}
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
