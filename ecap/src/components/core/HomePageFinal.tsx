/**
 * Modern Premium SaaS-Style Homepage
 * Redesigned with clean, minimal, and professional UI following modern UX principles
 */

import React, { useState, useEffect, useRef } from "react";
import { Box, Card, Typography, Chip, IconButton, Button } from "@mui/material";
import {
  Target,
  MoreVertical,
  Users,
  Activity,
  CreditCard,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { MultiYearMemberMonthsChart } from "./ChartComponents";
import InsightModal from "../modals/InsightModal";
import KPIDetailModal from "../modals/KPIDetailModal";
import { FlashCard } from "../../types";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchDashboardData } from "../../store/dashboardSlice";

// Import reusable components
import InsightsGrid from "./InsightsGrid";
import HomeSidebar from "./HomeSidebar";
import FilterBar from "./FilterBar";
import KPISection from "./KPISection";
import { KPISectionShimmer, ChartShimmer } from "./ShimmerEffects";

// Mock announcements data
const mockAnnouncements = [
  {
    title: "System Maintenance Scheduled",
    content:
      "Planned maintenance window on Sunday 2:00-4:00 AM EST for performance improvements.",
    date: "Apr 12, 2026",
    type: "Maintenance",
  },
  {
    title: "New Dashboard Features",
    content:
      "Enhanced analytics and improved data visualization tools now available.",
    date: "Apr 10, 2026",
    type: "Feature",
  },
  {
    title: "Security Update Required",
    content:
      "Please update your password and enable two-factor authentication by end of week.",
    date: "Apr 8, 2026",
    type: "Important",
  },
];

interface HomePageRefactoredProps {
  onNavigate: (page: string) => void;
  onChatWithCard?: (card: FlashCard) => void;
  role?: string;
}

export default function HomePage({
  onNavigate,
  onChatWithCard,
  role = "business",
}: HomePageRefactoredProps) {
  // State management
  const [selectedInsightCard, setSelectedInsightCard] =
    useState<FlashCard | null>(null);
  const [isInsightModalOpen, setIsInsightModalOpen] = useState(false);
  const [selectedKPI, setSelectedKPI] = useState<string | null>(null);
  const [isKPIModalOpen, setIsKPIModalOpen] = useState(false);
  const [selectedLOB, setSelectedLOB] = useState<
    "Commercial" | "Medicare" | "Medicaid"
  >("Commercial");
  const [selectedMetric, setSelectedMetric] =
    useState<string>("Expense Paid PMPM");

  // Redux hooks
  const dispatch = useAppDispatch();
  const {
    data: dashboardDataCache,
    loading: dashboardLoading,
    error: dashboardError,
  } = useAppSelector((state) => state.dashboard);

  // Get current LOB data from cache
  const dashboardData = dashboardDataCache[selectedLOB] || null;
  const [expandedReleases, setExpandedReleases] = useState<{
    [key: string]: boolean;
  }>({ "v1.4.3": true });
  const [isNewsCardCollapsed, setIsNewsCardCollapsed] = useState(true);
  const [activeNewsTab, setActiveNewsTab] = useState<"release" | "news">(
    "release",
  );
  const [isAnnouncementsCollapsed, setIsAnnouncementsCollapsed] =
    useState(true);
  const [isNewsExpanded, setIsNewsExpanded] = useState(false);
  const [selectedYears, setSelectedYears] = useState<number[]>([
    2023, 2024, 2025, 2026,
  ]);
  const releaseScrollRef = useRef<HTMLDivElement>(null);
  const lastExpandedVersionRef = useRef<string | null>(null);
  const newsCardRef = useRef<HTMLDivElement>(null);
  const announcementsCardRef = useRef<HTMLDivElement>(null);

  // Use static flash cards as InsightsGrid fallback
  const topFlashCards: FlashCard[] = [];

  // Fetch dashboard data on mount and when LOB changes
  useEffect(() => {
    dispatch(fetchDashboardData(selectedLOB));
  }, [dispatch, selectedLOB]);

  // Helper function to map API KPI data to KPIData format
  // ALWAYS returns exactly 3 KPIs in fixed order to maintain consistent layout
  const mapKPIData = () => {
    // Define the FIXED 3 KPIs that must always be displayed
    const FIXED_KPI_STRUCTURE = [
      {
        id: "expense_allowed_pmpm",
        label: "Expense Allowed PMPM",
        icon: BarChart3,
        bgColor: "#E1EDFF",
        iconBg: "#1A3673",
        borderColor: "#93C5FD",
        isNegativeGood: true,
      },
      {
        id: "medical_loss_ratio",
        label: "Medical Loss Ratio",
        icon: Activity,
        bgColor: "#E1EDFF",
        iconBg: "#1A3673",
        borderColor: "#93C5FD",
        isNegativeGood: false,
      },
      {
        id: "member_months",
        label: "Member Months",
        icon: Users,
        bgColor: "#E1EDFF",
        iconBg: "#1A3673",
        borderColor: "#93C5FD",
        isNegativeGood: false,
      },
    ];

    // Create a lookup map from backend data
    const backendKPIMap = new Map();
    if (
      dashboardData?.Key_Performance_indicators &&
      Array.isArray(dashboardData.Key_Performance_indicators)
    ) {
      dashboardData.Key_Performance_indicators.forEach((kpi) => {
        backendKPIMap.set(kpi.Kpi, kpi);
      });
    }

    // Map fixed structure to backend data (or show Sync Failed if missing)
    return FIXED_KPI_STRUCTURE.map((fixedKPI) => {
      const backendKPI = backendKPIMap.get(fixedKPI.id);

      if (backendKPI) {
        // Backend has this KPI - use the data
        return {
          id: fixedKPI.id,
          label: fixedKPI.label,
          value: backendKPI.value,
          change: backendKPI.difference,
          changePercent: backendKPI.difference_percent || "",
          icon: fixedKPI.icon,
          bgColor: fixedKPI.bgColor,
          iconBg: fixedKPI.iconBg,
          borderColor: fixedKPI.borderColor,
          hasDetails:
            backendKPI.brackdown !== null && backendKPI.brackdown !== undefined,
          lob: selectedLOB,
          period: dashboardData?.ending_month_year || "Current Period",
          isNegativeGood: fixedKPI.isNegativeGood,
          breakdown: backendKPI.brackdown || null,
          isSyncFailed: false,
        };
      } else {
        // Backend doesn't have this KPI - show Sync Failed
        return {
          id: fixedKPI.id,
          label: fixedKPI.label,
          value: "",
          change: "",
          changePercent: "",
          icon: fixedKPI.icon,
          bgColor: fixedKPI.bgColor,
          iconBg: fixedKPI.iconBg,
          borderColor: fixedKPI.borderColor,
          hasDetails: false,
          lob: selectedLOB,
          period: dashboardData?.ending_month_year || "Current Period",
          isNegativeGood: fixedKPI.isNegativeGood,
          breakdown: null,
          isSyncFailed: true,
        };
      }
    });
  };

  // Get KPI cards from API data
  const kpiCards = mapKPIData();

  // Event handlers
  const metrics = ["Expense Paid PMPM", "Medical Loss Ratio", "Member Months"];
  const handlePrevMetric = () => {
    const currentIndex = metrics.indexOf(selectedMetric);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : metrics.length - 1;
    setSelectedMetric(metrics[prevIndex]);
  };

  const handleNextMetric = () => {
    const currentIndex = metrics.indexOf(selectedMetric);
    const nextIndex = currentIndex < metrics.length - 1 ? currentIndex + 1 : 0;
    setSelectedMetric(metrics[nextIndex]);
  };

  const handleInsightCardClick = (card: FlashCard) => {
    setSelectedInsightCard(card);
    setIsInsightModalOpen(true);
  };

  const handleKPIClick = (kpiId: string) => {
    const kpiData = kpiCards.find((kpi) => kpi.id === kpiId);
    if (kpiData && kpiData.hasDetails) {
      setSelectedKPI(kpiId);
      setIsKPIModalOpen(true);
    }
  };

  const handleReleaseToggle = (version: string) => {
    const isExpanding = !expandedReleases[version];
    setExpandedReleases((prev) => ({ ...prev, [version]: !prev[version] }));
    if (isExpanding) {
      lastExpandedVersionRef.current = version;
    }
  };

  useEffect(() => {
    const version = lastExpandedVersionRef.current;
    if (!version) return;
    lastExpandedVersionRef.current = null;
    // Wait for MUI Collapse animation to finish (default 300ms), then scroll
    setTimeout(() => {
      const container = releaseScrollRef.current;
      const el = container?.querySelector(
        `[data-release-id="${version}"]`,
      ) as HTMLElement | null;
      if (el && container) {
        // getBoundingClientRect gives accurate position even with intermediate wrappers
        const containerRect = container.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        const scrollTarget =
          container.scrollTop + (elRect.top - containerRect.top) - 8;
        container.scrollTo({ top: scrollTarget, behavior: "smooth" });
      }
    }, 320);
  }, [expandedReleases]);

  // Check if we're loading (either initial load or LOB change)
  const isLoading = dashboardLoading;

  const handleFilterApply = (filters: {
    lob: "Commercial" | "Medicare" | "Medicaid";
  }) => {
    setSelectedLOB(filters.lob);
  };

  const handleLobChange = (lob: "Commercial" | "Medicare" | "Medicaid") => {
    setSelectedLOB(lob);
  };

  return (
    <Box
      sx={{
        bgcolor: "#F4F5F7",
        position: "relative",
      }}
    >
      {/* Filter Bar */}
      <FilterBar
        onLobChange={handleLobChange}
        onApply={handleFilterApply}
        period={dashboardData?.ending_month_year || ""}
      />

      {/* Main Content Container */}
      <Box
        sx={{
          maxWidth: "1900px",
          mx: "auto",
          px: 1,
          pb: 1,
          background: "#F4F5F7",
        }}
      >
        {/* Three Row Layout - Compact */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {/* Row 1: KPI Cards (full width) */}
          <KPISection
            selectedLOB={selectedLOB}
            onLOBChange={setSelectedLOB}
            kpiCards={kpiCards}
            onKPIClick={handleKPIClick}
            isLoading={isLoading}
            hasError={!!dashboardError}
          />

          {/* Row 2: Trends + Auto-Detected Insights (1.6fr 1fr for wider chart) */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1,
              alignItems: "stretch",
            }}
          >
            {/* Trends Card */}
            <Card
              sx={{
                borderRadius: "4px",
                background: "#FFFFFF",
                border: "none",
                boxShadow:
                  "0 2px 8px rgba(0,0,0,0.08), 0 6px 20px rgba(0,0,0,0.06)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Header: title + metric tabs */}
              <Box
                sx={{
                  px: 1.5,
                  py: 0.75,
                  background: "#FFFFFF",
                  borderBottom: "1px solid #F0F0F0",
                  flexShrink: 0,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#1A3673",
                      fontFamily: "Open Sans",
                    }}
                  >
                    Trends
                  </Typography>
                  {/* Metric tabs */}
                  <Box sx={{ display: "flex", gap: 1.5 }}>
                    {(
                      [
                        "Expense Paid PMPM",
                        "Medical Loss Ratio",
                        "Member Months",
                      ] as const
                    ).map((metric) => (
                      <Box
                        key={metric}
                        onClick={() => setSelectedMetric(metric)}
                        sx={{
                          fontSize: "12px",
                          fontWeight: selectedMetric === metric ? 600 : 500,
                          color:
                            selectedMetric === metric ? "#1A3673" : "#6B7280",
                          fontFamily: "Open Sans",
                          pb: 0.5,
                          borderBottom:
                            selectedMetric === metric
                              ? "2px solid #1A3673"
                              : "2px solid transparent",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          "&:hover": {
                            color: "#1A3673",
                            borderBottomColor:
                              selectedMetric === metric ? "#1A3673" : "#CBD5E1",
                          },
                        }}
                      >
                        {metric}
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
              {/* Chart body with side arrows */}
              <Box
                sx={{
                  flex: 1,
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  minHeight: 0,
                  overflow: "hidden",
                }}
              >
                {/* Left Arrow */}
                <Box
                  onClick={handlePrevMetric}
                  sx={{
                    position: "absolute",
                    left: 4,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 26,
                    height: 26,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    borderRadius: "0px",
                    bgcolor: "#FFFFFF",
                    border: "1px solid #E1EDFF",
                    boxShadow: "0 1px 4px rgba(26,54,115,0.08)",
                    zIndex: 2,
                    transition: "all 0.2s",
                    "&:hover": { bgcolor: "#EFF6FF", borderColor: "#44B8F3" },
                  }}
                >
                  <ChevronLeft size={13} color="#231E33" />
                </Box>
                {/* Chart */}
                <Box
                  sx={{
                    flex: 1,
                    px: 3,
                    py: 0.5,
                    minHeight: 0,
                    overflow: "hidden",
                  }}
                >
                  {dashboardError ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        gap: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "12px",
                          color: "#dc2626",
                          fontWeight: 700,
                          fontFamily: "Open Sans",
                        }}
                      >
                        Chart Data Sync Failed
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "10px",
                          color: "#666666",
                          fontFamily: "Open Sans",
                          textAlign: "center",
                        }}
                      >
                        Unable to load trend data
                      </Typography>
                      {/* <Button 
                        onClick={() => dispatch(fetchDashboardData(selectedLOB))}
                        variant="text"
                        sx={{ 
                          fontSize: '10px', 
                          textTransform: 'none',
                          color: '#0059B2',
                          padding: 0,
                          minWidth: 'auto',
                          fontFamily: 'Open Sans'
                        }}
                      >
                        Retry
                      </Button> */}
                    </Box>
                  ) : isLoading ? (
                    <ChartShimmer />
                  ) : (
                    <MultiYearMemberMonthsChart
                      selectedYears={selectedYears}
                      selectedLOB={selectedLOB}
                      dashboardData={dashboardData}
                      selectedMetric={selectedMetric}
                      onYearToggle={(year) => {
                        setSelectedYears((prev) =>
                          prev.includes(year)
                            ? prev.filter((y) => y !== year)
                            : [...prev, year],
                        );
                      }}
                      onMetricChange={setSelectedMetric}
                    />
                  )}
                </Box>
                {/* Right Arrow */}
                <Box
                  onClick={handleNextMetric}
                  sx={{
                    position: "absolute",
                    right: 4,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 26,
                    height: 26,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    borderRadius: "0px",
                    bgcolor: "#FFFFFF",
                    border: "1px solid #E1EDFF",
                    boxShadow: "0 1px 4px rgba(26,54,115,0.08)",
                    zIndex: 2,
                    transition: "all 0.2s",
                    "&:hover": { bgcolor: "#EFF6FF", borderColor: "#44B8F3" },
                  }}
                >
                  <ChevronRight size={13} color="#231E33" />
                </Box>
              </Box>
              {/* Dot indicators */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 0.75,
                  pb: 0.5,
                  flexShrink: 0,
                }}
              >
                {(
                  [
                    "Expense Paid PMPM",
                    "Medical Loss Ratio",
                    "Member Months",
                  ] as const
                ).map((metric) => (
                  <Box
                    key={metric}
                    onClick={() => setSelectedMetric(metric)}
                    sx={{
                      width: selectedMetric === metric ? 18 : 8,
                      height: 8,
                      borderRadius: "999px",
                      bgcolor:
                        selectedMetric === metric ? "#1A3673" : "#CBD5E1",
                      cursor: "pointer",
                      transition: "all 0.25s ease",
                    }}
                  />
                ))}
              </Box>
            </Card>

            {/* Auto-Detected Insights Card */}
            <Card
              sx={{
                borderRadius: "4px",
                background: "#FFFFFF",
                border: "none",
                boxShadow:
                  "0 2px 8px rgba(0,0,0,0.08), 0 6px 20px rgba(0,0,0,0.06)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  px: 1.5,
                  py: 0.75,
                  background: "#FFFFFF",
                  borderBottom: "1px solid #F0F0F0",
                  flexShrink: 0,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#1A3673",
                      fontFamily: "Open Sans",
                    }}
                  >
                    Auto-Detected Insights
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => onNavigate("insights")}
                    sx={{
                      fontSize: "10px",
                      fontWeight: 500,
                      textTransform: "none",
                      borderColor: "#1A3673",
                      color: "#1A3673",
                      fontFamily: "Open Sans",
                      minWidth: "auto",
                      px: 1,
                      py: 0.25,
                      height: 22,
                      "&:hover": { borderColor: "#44B8F3", bgcolor: "#E1EDFF" },
                    }}
                  >
                    View All
                  </Button>
                </Box>
              </Box>
              <Box
                sx={{
                  p: 1.5,
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <InsightsGrid
                  flashCards={topFlashCards}
                  onNavigate={onNavigate}
                  onCardClick={handleInsightCardClick}
                />
              </Box>
            </Card>
          </Box>

          {/* Bottom Section: News & Announcements */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1.5,
              alignItems: "start",
            }}
          >
            {/* Release Notes & Latest News (Combined, collapsible) */}
            <Card
              ref={newsCardRef}
              sx={{
                borderRadius: "4px",
                background: "#FFFFFF",
                border: "none",
                boxShadow:
                  "0 2px 8px rgba(0,0,0,0.08), 0 6px 20px rgba(0,0,0,0.06)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Header — click to collapse/expand */}
              <Box
                onClick={() => {
                  const opening = isNewsCardCollapsed;
                  setIsNewsCardCollapsed(!isNewsCardCollapsed);
                  if (opening) {
                    setTimeout(() => {
                      newsCardRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }, 50);
                  }
                }}
                sx={{
                  px: 1.5,
                  py: 0.75,
                  background: "#FFFFFF",
                  borderBottom: isNewsCardCollapsed
                    ? "none"
                    : "1px solid #F0F0F0",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                {/* Tab switcher */}
                <Box
                  sx={{ display: "flex", gap: 1 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {(["release", "news"] as const).map((tab) => (
                    <Box
                      key={tab}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveNewsTab(tab);
                        if (isNewsCardCollapsed) setIsNewsCardCollapsed(false);
                      }}
                      sx={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#1A3673",
                        fontFamily: "Open Sans",
                        letterSpacing: "0.01em",
                        px: 0.5,
                        py: 0.25,
                        borderBottom:
                          activeNewsTab === tab && !isNewsCardCollapsed
                            ? "2px solid #1A3673"
                            : "2px solid transparent",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        "&:hover": { borderBottomColor: "#1A3673" },
                      }}
                    >
                      {tab === "release" ? "Release Notes" : "Latest News"}
                    </Box>
                  ))}
                </Box>
                <ChevronDown
                  size={14}
                  color="#6B7280"
                  style={{
                    transform: isNewsCardCollapsed
                      ? "rotate(0deg)"
                      : "rotate(180deg)",
                    transition: "transform 0.2s ease",
                    flexShrink: 0,
                  }}
                />
              </Box>
              {/* Content — hidden when collapsed */}
              {!isNewsCardCollapsed && (
                <Box
                  ref={releaseScrollRef}
                  sx={{ p: 1, overflowY: "auto", maxHeight: 280 }}
                >
                  <HomeSidebar
                    onNavigate={onNavigate}
                    isNewsExpanded={isNewsExpanded}
                    onNewsExpandToggle={() =>
                      setIsNewsExpanded(!isNewsExpanded)
                    }
                    expandedReleases={expandedReleases}
                    onReleaseToggle={handleReleaseToggle}
                    showOnlyReleaseNotes={activeNewsTab === "release"}
                    showOnlyLatestNews={activeNewsTab === "news"}
                  />
                </Box>
              )}
            </Card>

            {/* Leadership Notes */}
            <Card
              ref={announcementsCardRef}
              sx={{
                borderRadius: "4px",
                background: "#FFFFFF",
                border: "none",
                boxShadow:
                  "0 2px 8px rgba(0,0,0,0.08), 0 6px 20px rgba(0,0,0,0.06)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                onClick={() => {
                  const opening = isAnnouncementsCollapsed;
                  setIsAnnouncementsCollapsed(!isAnnouncementsCollapsed);
                  if (opening) {
                    setTimeout(() => {
                      announcementsCardRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }, 50);
                  }
                }}
                sx={{
                  px: 1.5,
                  py: 1,
                  background: "#FFFFFF",
                  borderBottom: isAnnouncementsCollapsed
                    ? "none"
                    : "1px solid #F0F0F0",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#1A3673",
                    fontFamily: "Open Sans",
                    letterSpacing: "0.01em",
                  }}
                >
                  Notes
                </Typography>
                <ChevronDown
                  size={14}
                  color="#6B7280"
                  style={{
                    transform: isAnnouncementsCollapsed
                      ? "rotate(0deg)"
                      : "rotate(180deg)",
                    transition: "transform 0.2s ease",
                    flexShrink: 0,
                  }}
                />
              </Box>
            </Card>
          </Box>
        </Box>
      </Box>

      {/* Global Animations */}
      <Box
        component="style"
        sx={{
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-20px)" },
          },
        }}
      />

      {/* Modals */}
      {isInsightModalOpen && selectedInsightCard && (
        <InsightModal
          card={selectedInsightCard}
          isOpen={isInsightModalOpen}
          onClose={() => {
            console.log("Closing InsightModal");
            setIsInsightModalOpen(false);
            setSelectedInsightCard(null);
          }}
          onChatWithCard={(card) => {
            console.log("Chat with card:", card);
            // Handle chat functionality - could navigate to chat page or open chat interface
          }}
          isFavorite={false}
          onFavoriteToggle={() => {
            console.log("Toggle favorite for card:", selectedInsightCard?.id);
            // Handle favorite toggle functionality
          }}
        />
      )}

      {isKPIModalOpen && selectedKPI && (
        <KPIDetailModal
          isOpen={isKPIModalOpen}
          onClose={() => setIsKPIModalOpen(false)}
          kpiData={kpiCards.find((kpi) => kpi.id === selectedKPI) || null}
          endingMonthYear={dashboardData?.ending_month_year || ""}
        />
      )}
    </Box>
  );
}
