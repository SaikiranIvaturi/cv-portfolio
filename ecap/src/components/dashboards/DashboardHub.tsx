//horizontal cards Dashboard

import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Button,
  IconButton,
  Stack,
  Paper,
  Card,
  CardContent,
  CardActions,
  Chip,
  Avatar,
  alpha,
  Tabs,
  Tab,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Search,
  LayoutDashboard,
  ChevronRight,
  ChevronDown,
  X,
  TrendingUp,
  Heart,
  PiggyBank,
  Zap,
  BarChart3,
} from "lucide-react";
import { API_BASE_URL as API_URL } from "../../config/api";
import PowerBIEmbed from "../powerbi/PowerBIEmbed";
import ExternalAppEmbed from "../powerbi/ExternalAppEmbed";

interface Dashboard {
  id: string;
  title: string;
  category: string;
  categoryId: string;
  lob: string;
  icon: string;
  url: string;
  type: "powerbi" | "external" | "internal";
  key?: string;
  workspace_id?: string;
  report_id?: string;
  description?: string;
  isActive?: boolean;
  priority?: "high" | "medium" | "low";
  rating?: number;
  openMode?: "embed" | "newTab";
}

interface Category {
  id: string;
  label: string;
  icon: string;
  dashboards: Dashboard[];
}

interface DashboardsHubProps {
  onNavigate: (page: string) => void;
  onCollapseNav?: () => void;
}

const categoryIcons: Record<string, any> = {
  "trends-and-insights": TrendingUp,
  "trend-insights": TrendingUp,
  "ideation-and-interventions": Zap,
  "quality-and-health-equity": Heart,
  savings: PiggyBank,
  "intelligent-inquiry": BarChart3,
};

const categoryColors: Record<string, string> = {
  "trends-and-insights": "#E1EDFF",
  "trend-insights": "#E1EDFF",
  "ideation-and-interventions": "#D9F5F5",
  "quality-and-health-equity": "#FBEAE7",
  savings: "#B2EBEA",
  "intelligent-inquiry": "#E3F4FD",
};

const categoryAccentColors: Record<string, string> = {
  "trends-and-insights": "#2861BB",
  "trend-insights": "#2861BB",
  "ideation-and-interventions": "#00BB8A",
  "quality-and-health-equity": "#E3725F",
  savings: "#66D6D6",
  "intelligent-inquiry": "#6A97DF",
};

// LOB-specific colors for reports (lightest shades from color families)
const lobColors: Record<string, string> = {
  commercial: "#E1EDFF",
  medicare: "#E1EDFF",
  medicaid: "#E1EDFF",
  fgs: "#E1EDFF",
  all: "#E1EDFF",
  "excel pivots": "#E1EDFF",
  "specialty pharmacy": "#E1EDFF",
  "speciality pharmacy": "#E1EDFF",
  main: "#E1EDFF",
};

// LOB-specific text colors (darkest shades from same color families)
const lobTextColors: Record<string, string> = {
  commercial: "#1A3673",
  medicare: "#1A3673",
  medicaid: "#1A3673",
  fgs: "#1A3673",
  all: "#1A3673",
  "excel pivots": "#1A3673",
  "specialty pharmacy": "#1A3673",
  "speciality pharmacy": "#1A3673",
  main: "#1A3673",
};

// LOB-specific accent colors for borders and indicators
const lobAccentColors: Record<string, string> = {
  commercial: "#1A3673",
  medicare: "#1A3673",
  medicaid: "#1A3673",
  fgs: "#1A3673",
  all: "#1A3673",
  "excel pivots": "#1A3673",
  "specialty pharmacy": "#1A3673",
  "speciality pharmacy": "#1A3673",
  main: "#1A3673",
};

// Rotating color palette for report buttons (position-based, not LOB-based)
const reportColorPalette: string[] = [
  "#E1EDFF",
  "#E1EDFF",
  "#E1EDFF",
  "#E1EDFF",
  "#E1EDFF",
];

const reportTextColorPalette: string[] = [
  "#1A3673",
  "#1A3673",
  "#1A3673",
  "#1A3673",
  "#1A3673",
];

const reportBorderColorPalette: string[] = [
  "#1A3673",
  "#1A3673",
  "#1A3673",
  "#1A3673",
  "#1A3673",
];

export default function DashboardsHub({
  onNavigate,
  onCollapseNav,
}: DashboardsHubProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLOB, setSelectedLOB] = useState<string>("all");
  const [recentDashboards, setRecentDashboards] = useState<Dashboard[]>([]);
  const [allDashboards, setAllDashboards] = useState<Dashboard[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(
    null,
  );
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>(
    "trends-and-insights",
  );

  // Only show specific LOB filters - MUST be before any early returns
  const availableLOBs = useMemo(() => {
    // Only include these specific LOBs in the filter
    return ["all", "Commercial", "Medicare", "Medicaid", "FGS"];
  }, []);

  useEffect(() => {
    const savedRecent = localStorage.getItem("recentDashboards");
    if (savedRecent) setRecentDashboards(JSON.parse(savedRecent));
  }, []);

  // Fetch dashboards from API
  useEffect(() => {
    const fetchDashboards = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_URL}/ecap/dashboard_hub/?line_of_business=all&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`,
        );

        if (response.ok) {
          const apiResponse = await response.json();

          const categories = apiResponse.categories || [];
          const dashboards: Dashboard[] = [];
          const cats: Category[] = [];

          const savedAdminState = localStorage.getItem("dashboardAdminState");
          let adminState: Record<
            string,
            { isActive: boolean; priority?: string; rating?: number }
          > = {};

          try {
            adminState = savedAdminState ? JSON.parse(savedAdminState) : {};
          } catch (e) {
            localStorage.removeItem("dashboardAdminState");
          }

          for (const category of categories) {
            const categoryDashboards: Dashboard[] = [];

            for (const dashboard of category.dashboards || []) {
              const reports = dashboard.reports || [];

              for (const report of reports) {
                const dashboardId =
                  `${category.id}-${dashboard.id}-${report.key}`
                    .toLowerCase()
                    .replace(/\s+/g, "-");
                const isActive =
                  adminState[dashboardId]?.isActive ??
                  report.isConfigured !== false;
                if (!isActive) continue;

                let lob = "All";
                if (report.lob && report.lob !== "all") {
                  lob =
                    report.lob.charAt(0).toUpperCase() +
                    report.lob.slice(1).toLowerCase();
                } else {
                  const reportName = report.name || "";
                  if (reportName.includes("Commercial")) lob = "Commercial";
                  else if (reportName.includes("Medicare")) lob = "Medicare";
                  else if (reportName.includes("Medicaid")) lob = "Medicaid";
                  else if (reportName.includes("FGS")) lob = "FGS";
                  else if (reportName.includes("Excel Pivots"))
                    lob = "Excel Pivots";
                  else if (reportName.includes("Specialty Pharmacy"))
                    lob = "Specialty Pharmacy";
                  else if (reportName.includes("Speciality Pharmacy"))
                    lob = "Speciality Pharmacy";
                  else if (reportName.includes("Main")) lob = "Main";
                }

                const dashboardItem: Dashboard = {
                  id: dashboardId,
                  title: dashboard.name,
                  category: category.name,
                  categoryId: category.id,
                  lob: lob,
                  icon: dashboard.icon || category.icon || "LayoutDashboard",
                  url: report.url || "#",
                  type: report.url?.includes("powerbi.com")
                    ? "powerbi"
                    : "external",
                  key: report.key,
                  description: `${category.name} > ${dashboard.name} > ${report.name}`,
                  isActive: report.isConfigured !== false,
                  priority:
                    (adminState[dashboardId]?.priority as
                      | "high"
                      | "medium"
                      | "low") || "medium",
                  rating: adminState[dashboardId]?.rating || 3,
                  openMode: "newTab",
                };

                (dashboardItem as any).dashboardFamily = dashboard.name;
                (dashboardItem as any).reportName = report.name;
                (dashboardItem as any).reportKey = report.key;

                categoryDashboards.push(dashboardItem);
                dashboards.push(dashboardItem);
              }
            }

            if (categoryDashboards.length > 0) {
              const priorityOrder = { high: 0, medium: 1, low: 2 };
              const sortedDashboards = [...categoryDashboards].sort((a, b) => {
                const priorityDiff =
                  (priorityOrder[a.priority || "medium"] || 1) -
                  (priorityOrder[b.priority || "medium"] || 1);
                if (priorityDiff !== 0) return priorityDiff;
                return (b.rating || 3) - (a.rating || 3);
              });

              cats.push({
                id: category.id,
                label: category.name,
                icon: category.icon || "LayoutDashboard",
                dashboards: sortedDashboards,
              });
            }
          }

          setAllDashboards(dashboards);
          setCategories(cats);
        } else {
          console.error("API Error - Status:", response.status);
          const errorText = await response.text();
          console.error("API Error - Response:", errorText);
        }
      } catch (error) {
        console.error("Failed to fetch dashboards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboards();
  }, []);

  const filteredDashboards = useMemo(() => {
    return allDashboards.filter((d) => {
      const matchesSearch =
        searchQuery === "" ||
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ((d as any).dashboardFamily &&
          (d as any).dashboardFamily
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        ((d as any).reportName &&
          (d as any).reportName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()));

      const matchesLOB =
        selectedLOB === "all" ||
        d.lob.toLowerCase() === selectedLOB.toLowerCase() ||
        d.lob === "All" ||
        ((d as any).reportName &&
          (d as any).reportName
            .toLowerCase()
            .includes(selectedLOB.toLowerCase()));

      return matchesSearch && matchesLOB;
    });
  }, [allDashboards, searchQuery, selectedLOB]);

  const filteredCategories = useMemo(() => {
    return categories
      .map((cat) => ({
        ...cat,
        dashboards: cat.dashboards.filter((d) =>
          filteredDashboards.some((fd) => fd.id === d.id),
        ),
      }))
      .filter((cat) => cat.dashboards.length > 0);
  }, [categories, filteredDashboards]);

  // Auto-select first available category after data loads
  useEffect(() => {
    if (filteredCategories.length > 0) {
      const categoryExists = filteredCategories.some(
        (cat) => cat.id === selectedCategoryTab,
      );
      if (!categoryExists) {
        setSelectedCategoryTab(filteredCategories[0].id);
      }
    }
  }, [filteredCategories, selectedCategoryTab]);

  const handleSelectDashboard = (dashboard: Dashboard) => {
    if (dashboard.type === "internal" && dashboard.url.startsWith("/")) {
      onNavigate(dashboard.url.substring(1));
      return;
    }

    if (dashboard.openMode === "newTab") {
      window.open(dashboard.url, "_blank");
      return;
    }

    const newRecent = [
      dashboard,
      ...recentDashboards.filter((d) => d.id !== dashboard.id),
    ].slice(0, 10);
    setRecentDashboards(newRecent);
    localStorage.setItem("recentDashboards", JSON.stringify(newRecent));

    setSelectedDashboard(dashboard);
    onCollapseNav?.();
  };

  if (selectedDashboard) {
    return (
      <div className="h-[calc(100vh-64px)] w-full">
        {selectedDashboard.type === "powerbi" ? (
          <PowerBIEmbed
            url={selectedDashboard.url}
            title={selectedDashboard.title}
            workspace_id={selectedDashboard.workspace_id}
            report_id={selectedDashboard.report_id}
            onClose={() => setSelectedDashboard(null)}
          />
        ) : (
          <ExternalAppEmbed
            url={selectedDashboard.url}
            title={selectedDashboard.title}
            appKey={selectedDashboard.key || "UNKNOWN"}
            appType={selectedDashboard.type}
            platform={selectedDashboard.type}
            onClose={() => setSelectedDashboard(null)}
          />
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#FAFBFC",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack alignItems="center" spacing={3}>
          <Box
            sx={{
              width: 48,
              height: 48,
              border: "3px solid #E5E7EB",
              borderTop: "3px solid #1A3673",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              "@keyframes spin": {
                "0%": { transform: "rotate(0deg)" },
                "100%": { transform: "rotate(360deg)" },
              },
            }}
          />
          <Typography variant="h6" fontWeight={500} color="#6B7280">
            Loading Dashboard Hub
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Preparing your workspace...
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#FAFBFC",
        background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
      }}
    >
      {/* Compact Header with Search + LOB Filters */}
      <Paper
        elevation={0}
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 5,
          borderRadius: 0,
          borderBottom: "1px solid #E5E7EB",
          boxShadow: "0 2px 12px rgba(15,33,72,0.06)",
          px: 2,
          py: 0.8,
          bgcolor: "#FFFFFF",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: "100%" }}
        >
          {/* Larger Search Bar */}
          <TextField
            placeholder="Search dashboards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="medium"
            sx={{ width: "644px" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} color="#9CA3AF" />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearchQuery("")}
                    sx={{ color: "#9CA3AF", "&:hover": { color: "#6B7280" } }}
                  >
                    <X size={14} />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                borderRadius: "6px",
                bgcolor: "#FFFFFF",
                height: "38px",
                fontSize: "0.875rem",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#D1D5DB",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#C7D2FE",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1A3673",
                  borderWidth: 1,
                },
              },
            }}
          />

          {/* LOB Filter Dropdown */}
          <Select
            value={selectedLOB}
            onChange={(e) => setSelectedLOB(e.target.value)}
            size="small"
            sx={{
              minWidth: 160,
              height: 38,
              bgcolor: "#FFFFFF",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "&:hover": {
                bgcolor: "#F8FAFC",
                borderColor: "#C7D2FE",
              },
              "&.Mui-focused": {
                bgcolor: "#FFFFFF",
                borderColor: "#1A3673",
              },
              "& .MuiSelect-select": {
                py: 1,
                px: 2,
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "#1A3673",
                display: "flex",
                alignItems: "center",
              },
            }}
            IconComponent={(props) => (
              <ChevronDown
                {...props}
                size={16}
                style={{
                  position: "absolute",
                  right: 12,
                  pointerEvents: "none",
                  color: "#6B7280",
                }}
              />
            )}
            MenuProps={{
              PaperProps: {
                sx: {
                  mt: 0.5,
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(26, 54, 115, 0.15)",
                  border: "1px solid #E5E7EB",
                  "& .MuiMenuItem-root": {
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    py: 1,
                    px: 2,
                    "&:hover": {
                      bgcolor: "#F3F4F6",
                    },
                    "&.Mui-selected": {
                      bgcolor: "#E1EDFF",
                      fontWeight: 600,
                      color: "#1A3673",
                      "&:hover": {
                        bgcolor: "#E1EDFF",
                      },
                    },
                  },
                },
              },
            }}
          >
            {availableLOBs.map((lob) => (
              <MenuItem key={lob} value={lob}>
                {lob === "all" ? "All" : lob}
              </MenuItem>
            ))}
          </Select>
        </Stack>
      </Paper>

      {/* Tab-Based Category Layout */}
      <Container maxWidth="xl" sx={{ py: 2 }}>
        {/* Category Tabs */}
        <Box sx={{ mb: 3 }}>
          <Tabs
            value={selectedCategoryTab}
            onChange={(_, newValue) => setSelectedCategoryTab(newValue)}
            TabIndicatorProps={{ style: { display: "none" } }}
            sx={{
              bgcolor: "#EEF2F8",
              borderRadius: "28px",
              p: "4px",
              minHeight: "auto",
              width: "fit-content",
              "& .MuiTabs-flexContainer": { gap: "2px" },
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "#6B7280",
                minHeight: "40px",
                borderRadius: "24px",
                px: "18px",
                py: 0,
                transition: "all 0.2s ease",
                "&.Mui-selected": {
                  color: "#FFFFFF",
                  backgroundColor: "#1A3673",
                  boxShadow: "0 2px 8px rgba(26,54,115,0.25)",
                },
                "&:hover:not(.Mui-selected)": {
                  bgcolor: "#E1EDFF",
                  color: "#1A3673",
                },
              },
            }}
          >
            {filteredCategories
              .sort((a, b) => {
                const order = [
                  "trends-and-insights",
                  "ideation-and-interventions",
                  "quality-and-health-equity",
                ];
                const aIndex = order.indexOf(a.id);
                const bIndex = order.indexOf(b.id);
                return (
                  (aIndex === -1 ? 999 : aIndex) -
                  (bIndex === -1 ? 999 : bIndex)
                );
              })
              .map((cat) => {
                const CatIcon = categoryIcons[cat.id] || LayoutDashboard;
                return (
                  <Tab
                    key={cat.id}
                    label={cat.label}
                    value={cat.id}
                    icon={<CatIcon size={14} />}
                    iconPosition="start"
                  />
                );
              })}
          </Tabs>
        </Box>

        {/* Display Selected Category Content */}
        <Stack spacing={2}>
          {filteredCategories
            .filter((category) => category.id === selectedCategoryTab)
            .map((category) => {
              const CategoryIcon =
                categoryIcons[category.id] || LayoutDashboard;
              const categoryAccent =
                categoryAccentColors[category.id] || "#2861BB";
              const isExpanded = selectedCategoryTab === category.id;

              // Group dashboards by family
              const familyGroups = new Map<string, Dashboard[]>();
              category.dashboards.forEach((dashboard) => {
                const family =
                  (dashboard as any).dashboardFamily || dashboard.title;
                if (!familyGroups.has(family)) {
                  familyGroups.set(family, []);
                }
                familyGroups.get(family)!.push(dashboard);
              });

              // Check if this category needs reduced height
              const isReducedHeightCategory = [
                "ideation-and-interventions",
                "quality-and-health-equity",
              ].includes(category.id);

              return (
                <Box
                  key={category.id}
                  sx={{
                    mt: 1.5,
                    pl: 0,
                    display: "flex",
                    gap: 2,
                    "@media (max-width: 900px)": {
                      flexDirection: "column",
                    },
                  }}
                >
                  {/* Left Column */}
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    {Array.from(familyGroups.entries())
                      .filter((_, index) => index % 2 === 0)
                      .map(([family, dashboards]) => (
                        <Box key={family}>
                          {dashboards.length === 1 ? (
                            // Single report: card with icon + label + arrow
                            <Button
                              onClick={() =>
                                handleSelectDashboard(dashboards[0])
                              }
                              sx={{
                                width: isReducedHeightCategory ? "50%" : "100%",
                                p: isReducedHeightCategory ? "8px 12px" : "10px 14px",
                                borderRadius: "10px",
                                border: `1px solid ${alpha("#1A3673", 0.12)}`,
                                borderLeft: `3px solid ${categoryAccent}`,
                                bgcolor: "#FFFFFF",
                                color: "#1A3673",
                                textTransform: "none",
                                fontWeight: 600,
                                fontSize: isReducedHeightCategory
                                  ? "0.875rem"
                                  : "0.9375rem",
                                justifyContent: "space-between",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                  bgcolor: alpha(categoryAccent, 0.03),
                                  transform: "translateY(-1px)",
                                },
                              }}
                            >
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <Box
                                  sx={{
                                    width: 26,
                                    height: 26,
                                    borderRadius: "6px",
                                    backgroundColor: alpha(categoryAccent, 0.1),
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                  }}
                                >
                                  <LayoutDashboard size={12} color={categoryAccent} />
                                </Box>
                                <span>{family}</span>
                              </Stack>
                              <ChevronRight size={14} color={alpha("#1A3673", 0.35)} />
                            </Button>
                          ) : (
                            // Multiple reports: title + LOB button grid
                            <Paper
                              elevation={0}
                              sx={{
                                p: isReducedHeightCategory ? 1 : 2,
                                pb: isReducedHeightCategory ? 0.75 : 1.5,
                                borderRadius: "12px",
                                background: `linear-gradient(140deg, ${alpha(categoryAccent, 0.05)} 0%, #FFFFFF 55%)`,
                                border: `1px solid ${alpha(categoryAccent, 0.2)}`,
                                borderTop: `3px solid ${categoryAccent}`,
                                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  boxShadow: `0 4px 16px ${alpha(categoryAccent, 0.15)}, 0 1px 4px rgba(0,0,0,0.06)`,
                                  transform: "translateY(-1px)",
                                },
                              }}
                            >
                              {/* Dashboard Family Title */}
                              <Typography
                                variant="h6"
                                fontWeight={700}
                                sx={{
                                  fontSize: isReducedHeightCategory
                                    ? "0.875rem"
                                    : "0.9375rem",
                                  color: "#1A2B4A",
                                  letterSpacing: "-0.01em",
                                  mb: isReducedHeightCategory ? 0.5 : 1,
                                  pb: isReducedHeightCategory ? 0.5 : 0.75,
                                  borderBottom: `1px solid ${alpha(categoryAccent, 0.18)}`,
                                }}
                              >
                                {family}
                              </Typography>

                              {/* LOB Buttons Grid */}
                              <Grid container spacing={0.75}>
                                {dashboards.map((dashboard) => {
                                  const lobName =
                                    (dashboard as any).reportName ||
                                    dashboard.lob;

                                  return (
                                    <Grid item xs={6} key={dashboard.id}>
                                      <Button
                                        onClick={() =>
                                          handleSelectDashboard(dashboard)
                                        }
                                        sx={{
                                          width: "100%",
                                          py: isReducedHeightCategory
                                            ? 0.375
                                            : 0.625,
                                          px: isReducedHeightCategory
                                            ? 0.75
                                            : 1.25,
                                          borderRadius: "6px",
                                          border: "1px solid #E5E7EB",
                                          bgcolor: "rgba(255,255,255,0.8)",
                                          color: "#374151",
                                          textTransform: "none",
                                          fontWeight: 500,
                                          fontSize: isReducedHeightCategory
                                            ? "0.75rem"
                                            : "0.8125rem",
                                          justifyContent: "center",
                                          transition: "all 0.15s ease",
                                          "&:hover": {
                                            bgcolor: alpha(categoryAccent, 0.1),
                                            borderColor: alpha(categoryAccent, 0.5),
                                            color: categoryAccent,
                                            fontWeight: 600,
                                          },
                                        }}
                                      >
                                        {lobName}
                                      </Button>
                                    </Grid>
                                  );
                                })}
                              </Grid>
                            </Paper>
                          )}
                        </Box>
                      ))}
                  </Box>

                  {/* Right Column */}
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    {Array.from(familyGroups.entries())
                      .filter((_, index) => index % 2 === 1)
                      .map(([family, dashboards]) => (
                        <Box key={family}>
                          {dashboards.length === 1 ? (
                            // Single report: card with icon + label + arrow
                            <Button
                              onClick={() =>
                                handleSelectDashboard(dashboards[0])
                              }
                              sx={{
                                width: isReducedHeightCategory ? "50%" : "100%",
                                p: isReducedHeightCategory ? "8px 12px" : "10px 14px",
                                borderRadius: "10px",
                                border: `1px solid ${alpha("#1A3673", 0.12)}`,
                                borderLeft: `3px solid ${categoryAccent}`,
                                bgcolor: "#FFFFFF",
                                color: "#1A3673",
                                textTransform: "none",
                                fontWeight: 600,
                                fontSize: isReducedHeightCategory
                                  ? "0.875rem"
                                  : "0.9375rem",
                                justifyContent: "space-between",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                  bgcolor: alpha(categoryAccent, 0.03),
                                  transform: "translateY(-1px)",
                                },
                              }}
                            >
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <Box
                                  sx={{
                                    width: 26,
                                    height: 26,
                                    borderRadius: "6px",
                                    backgroundColor: alpha(categoryAccent, 0.1),
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                  }}
                                >
                                  <LayoutDashboard size={12} color={categoryAccent} />
                                </Box>
                                <span>{family}</span>
                              </Stack>
                              <ChevronRight size={14} color={alpha("#1A3673", 0.35)} />
                            </Button>
                          ) : (
                            // Multiple reports: title + LOB button grid
                            <Paper
                              elevation={0}
                              sx={{
                                p: isReducedHeightCategory ? 1 : 2,
                                pb: isReducedHeightCategory ? 0.75 : 1.5,
                                borderRadius: "12px",
                                background: `linear-gradient(140deg, ${alpha(categoryAccent, 0.05)} 0%, #FFFFFF 55%)`,
                                border: `1px solid ${alpha(categoryAccent, 0.2)}`,
                                borderTop: `3px solid ${categoryAccent}`,
                                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  boxShadow: `0 4px 16px ${alpha(categoryAccent, 0.15)}, 0 1px 4px rgba(0,0,0,0.06)`,
                                  transform: "translateY(-1px)",
                                },
                              }}
                            >
                              {/* Dashboard Family Title */}
                              <Typography
                                variant="h6"
                                fontWeight={700}
                                sx={{
                                  fontSize: isReducedHeightCategory
                                    ? "0.875rem"
                                    : "0.9375rem",
                                  color: "#1A2B4A",
                                  letterSpacing: "-0.01em",
                                  mb: isReducedHeightCategory ? 0.5 : 1,
                                  pb: isReducedHeightCategory ? 0.5 : 0.75,
                                  borderBottom: `1px solid ${alpha(categoryAccent, 0.18)}`,
                                }}
                              >
                                {family}
                              </Typography>

                              {/* LOB Buttons Grid */}
                              <Grid container spacing={0.75}>
                                {dashboards.map((dashboard) => {
                                  const lobName =
                                    (dashboard as any).reportName ||
                                    dashboard.lob;

                                  return (
                                    <Grid item xs={6} key={dashboard.id}>
                                      <Button
                                        onClick={() =>
                                          handleSelectDashboard(dashboard)
                                        }
                                        sx={{
                                          width: "100%",
                                          py: isReducedHeightCategory
                                            ? 0.375
                                            : 0.625,
                                          px: isReducedHeightCategory
                                            ? 0.75
                                            : 1.25,
                                          borderRadius: "6px",
                                          border: "1px solid #E5E7EB",
                                          bgcolor: "rgba(255,255,255,0.8)",
                                          color: "#374151",
                                          textTransform: "none",
                                          fontWeight: 500,
                                          fontSize: isReducedHeightCategory
                                            ? "0.75rem"
                                            : "0.8125rem",
                                          justifyContent: "center",
                                          transition: "all 0.15s ease",
                                          "&:hover": {
                                            bgcolor: alpha(categoryAccent, 0.1),
                                            borderColor: alpha(categoryAccent, 0.5),
                                            color: categoryAccent,
                                            fontWeight: 600,
                                          },
                                        }}
                                      >
                                        {lobName}
                                      </Button>
                                    </Grid>
                                  );
                                })}
                              </Grid>
                            </Paper>
                          )}
                        </Box>
                      ))}
                  </Box>
                </Box>
              );
            })}
        </Stack>

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: 12,
              px: 4,
            }}
          >
            <LayoutDashboard
              size={80}
              color="#9CA3AF"
              style={{ marginBottom: 24 }}
            />
            <Typography
              variant="h4"
              fontWeight={600}
              color="#231E33"
              sx={{ mb: 2 }}
            >
              No dashboards found
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, maxWidth: 400, mx: "auto" }}
            >
              {searchQuery
                ? `We couldn't find any dashboards matching "${searchQuery}". Try adjusting your search or filters.`
                : "No dashboards are currently available for the selected criteria."}
            </Typography>
            {searchQuery && (
              <Button
                variant="contained"
                onClick={() => setSearchQuery("")}
                sx={{
                  bgcolor: "#1A3673",
                  "&:hover": { bgcolor: "#1E40AF" },
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 500,
                  px: 4,
                  py: 1.5,
                }}
              >
                Clear Search
              </Button>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
}
