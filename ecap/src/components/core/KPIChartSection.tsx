import {
  Box,
  Card,
  Chip,
  Button,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Activity,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  ChevronDown,
} from "lucide-react";
import { ReactNode, useState } from "react";
import SectionHeader from "./SectionHeader";
import { KPIData } from "./KPISection";
import { KPISectionShimmer, ChartShimmer } from "./ShimmerEffects";

interface KPIChartSectionProps {
  selectedLOB: "Commercial" | "Medicare" | "Medicaid";
  onLOBChange: (lob: "Commercial" | "Medicare" | "Medicaid") => void;
  kpiCards: KPIData[];
  onKPIClick: (kpiId: string) => void;
  chartComponent: ReactNode;
  selectedTrendTab: number;
  onTrendTabChange: (tab: number) => void;
  selectedYears: number[];
  onYearChange: (years: number[]) => void;
  isLoading?: boolean;
}

export default function KPIChartSection({
  selectedLOB,
  onLOBChange,
  kpiCards,
  onKPIClick,
  chartComponent,
  selectedTrendTab,
  onTrendTabChange,
  selectedYears,
  onYearChange,
  isLoading = false,
}: KPIChartSectionProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLOBSelect = (lob: "Commercial" | "Medicare" | "Medicaid") => {
    handleLOBChange(lob);
    handleClose();
  };

  // Function to get year chip colors matching the chart colors
  const getYearChipColor = (year: number): string => {
    const colors = {
      2020: "#E3725F", // Coral
      2021: "#00BBBA", // Teal main
      2022: "#EEAA9F", // Coral light 1
      2023: "#1A3673", // Primary main - dark blue
      2024: "#8FD4F8", // Sky blue
      2025: "#2861BB", // Blue
      2026: "#6A97DF", // Blue light 1
    };
    return colors[year as keyof typeof colors] || "#6B7280";
  };

  const handleLOBChange = (newLOB: "Commercial" | "Medicare" | "Medicaid") => {
    if (newLOB !== selectedLOB) {
      setIsTransitioning(true);
      onLOBChange(newLOB);
      // Reset transition state after animation
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  return (
    <Card
      sx={{
        mb: 0.5,
        borderRadius: "8px",
        border: "1px solid #E5E7EB",
        p: 1,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      {/* KPI Section Header with LOB Button */}
      <SectionHeader
        icon={Activity}
        title="Key Performance Indicators"
        iconBgColor="#1A3673"
        borderWidth="border-b"
        leftBadge={
          <>
            <Button
              onClick={handleClick}
              endIcon={<ChevronDown size={14} />}
              sx={{
                bgcolor: "#1A3673",
                color: "#FFFFFF",
                fontSize: "11px",
                fontWeight: 600,
                fontFamily: "Open Sans",
                textTransform: "none",
                px: 2,
                py: 0.5,
                borderRadius: "6px",
                minHeight: "auto",
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                "&:hover": {
                  bgcolor: "#2861BB",
                  boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              Filter: {selectedLOB}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "lob-button",
              }}
              PaperProps={{
                sx: {
                  mt: 0.5,
                  borderRadius: "8px",
                  boxShadow:
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                },
              }}
            >
              <MenuItem
                onClick={() => handleLOBSelect("Commercial")}
                selected={selectedLOB === "Commercial"}
                sx={{
                  fontSize: "12px",
                  fontFamily: "Open Sans",
                  py: 1,
                  px: 2,
                  "&.Mui-selected": {
                    bgcolor: "#E1EDFF",
                    "&:hover": {
                      bgcolor: "#DBEAFE",
                    },
                  },
                }}
              >
                Commercial
              </MenuItem>
              <MenuItem
                onClick={() => handleLOBSelect("Medicare")}
                selected={selectedLOB === "Medicare"}
                sx={{
                  fontSize: "12px",
                  fontFamily: "Open Sans",
                  py: 1,
                  px: 2,
                  "&.Mui-selected": {
                    bgcolor: "#E1EDFF",
                    "&:hover": {
                      bgcolor: "#DBEAFE",
                    },
                  },
                }}
              >
                Medicare
              </MenuItem>
              <MenuItem
                onClick={() => handleLOBSelect("Medicaid")}
                selected={selectedLOB === "Medicaid"}
                sx={{
                  fontSize: "12px",
                  fontFamily: "Open Sans",
                  py: 1,
                  px: 2,
                  "&.Mui-selected": {
                    bgcolor: "#E1EDFF",
                    "&:hover": {
                      bgcolor: "#DBEAFE",
                    },
                  },
                }}
              >
                Medicaid
              </MenuItem>
            </Menu>
          </>
        }
        rightContent={
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              px: 2,
              py: 0.75,
              bgcolor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "6px",
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            }}
          >
            <Typography
              sx={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#6B7280",
                fontFamily: "Open Sans",
                whiteSpace: "nowrap",
              }}
            >
              Target CoC 2026:
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "9px",
                    fontWeight: 600,
                    color: "#9CA3AF",
                    fontFamily: "Open Sans",
                    lineHeight: 1,
                  }}
                >
                  Target
                </Typography>
                <Typography
                  sx={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "#231E33",
                    fontFamily: "Open Sans",
                    lineHeight: 1.3,
                  }}
                >
                  $4.24B
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "1px",
                  height: "28px",
                  bgcolor: "#E5E7EB",
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "9px",
                    fontWeight: 600,
                    color: "#9CA3AF",
                    fontFamily: "Open Sans",
                    lineHeight: 1,
                  }}
                >
                  Achieved
                </Typography>
                <Typography
                  sx={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "#00BBBA",
                    fontFamily: "Open Sans",
                    lineHeight: 1.3,
                  }}
                >
                  $2.83B
                </Typography>
              </Box>
            </Box>
          </Box>
        }
      />

      {/* KPI Cards Grid */}
      {isLoading || kpiCards.length === 0 ? (
        <KPISectionShimmer />
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${kpiCards.length}, 1fr)`,
            gap: 1,
            mb: 1,
            opacity: isTransitioning ? 0.7 : 1,
            transform: isTransitioning ? "scale(0.98)" : "scale(1)",
            transition: "all 0.3s ease-in-out",
          }}
        >
          {kpiCards.map((kpi) => {
            const isNegative = kpi.change.includes("-");
            const isPositive =
              kpi.isNegativeGood !== undefined
                ? kpi.isNegativeGood
                  ? isNegative
                  : !isNegative
                : !isNegative;
            const TrendIcon = !isNegative ? ArrowUp : ArrowDown;
            const chipBg = isPositive
              ? "rgba(0, 187, 186, 0.15)"
              : "rgba(227, 114, 95, 0.15)";
            const chipColor = isPositive ? "#009897" : "#C95A45";

            return (
              <Card
                key={`${kpi.id}-${selectedLOB}`}
                onClick={() => kpi.hasDetails && onKPIClick(kpi.id)}
                sx={{
                  bgcolor: "#FFFFFF",
                  borderRadius: "6px",
                  border: "1px solid #E8E8E8",
                  p: 1,
                  boxShadow:
                    "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
                  cursor: kpi.hasDetails ? "pointer" : "default",
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.25,
                  minHeight: "55px",
                  transition: "box-shadow 0.2s",
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  },
                }}
              >
                {/* Label */}
                <Typography
                  sx={{
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "#6B7280",
                    fontFamily: "Open Sans",
                    lineHeight: 1.1,
                  }}
                >
                  {kpi.label}
                </Typography>

                {/* Value */}
                <Typography
                  sx={{
                    fontSize: "24px",
                    fontWeight: 300,
                    color: "#111827",
                    fontFamily: "Open Sans",
                    lineHeight: "28px",
                    letterSpacing: 0,
                  }}
                >
                  {kpi.value}
                </Typography>

                {/* Trend Chip */}
                <Box sx={{ mt: "auto" }}>
                  <Chip
                    size="small"
                    icon={<TrendIcon size={10} color={chipColor} />}
                    label={`${kpi.change} | ${kpi.changePercent}`}
                    sx={{
                      bgcolor: chipBg,
                      color: chipColor,
                      fontSize: "10px",
                      fontWeight: 600,
                      fontFamily: "Open Sans",
                      height: "20px",
                      "& .MuiChip-icon": {
                        color: chipColor,
                        marginLeft: "6px",
                        marginRight: "-2px",
                      },
                      "& .MuiChip-label": {
                        px: 1,
                      },
                    }}
                  />
                </Box>
              </Card>
            );
          })}
        </Box>
      )}

      {/* Chart Section */}
      <Card
        sx={{
          mt: 0.5,
          borderRadius: "6px",
          border: "1px solid #E5E7EB",
          p: 1,
          bgcolor: "#FFFFFF",
          boxShadow:
            "0 2px 8px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
        }}
      >
        {/* Trend heading with tabs on the same line */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            mb: 0.5,
            pb: 0.5,
            borderBottom: "1px solid #E5E7EB",
          }}
        >
          {/* Left side - Trend heading */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              minWidth: "fit-content",
            }}
          >
            <Box
              sx={{
                width: 28,
                height: 28,
                bgcolor: "#1A3673",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TrendingUp size={16} color="#FFFFFF" />
            </Box>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#231E33",
                fontFamily: "Open Sans",
                whiteSpace: "nowrap",
              }}
            >
              Trend
            </Typography>
          </Box>

          {/* Right side - Toggle Button Group for Tabs */}
          <Box
            sx={{ flex: 1, ml: 2, display: "flex", justifyContent: "flex-end" }}
          >
            <ToggleButtonGroup
              value={selectedTrendTab}
              exclusive
              onChange={(e, newValue) =>
                newValue !== null && onTrendTabChange(newValue)
              }
              sx={{
                bgcolor: "#FFFFFF",
                borderRadius: "6px",
                p: 0.375,
                boxShadow: "none",
                border: "1px solid #E5E7EB",
                flexWrap: "wrap",
                gap: 0.25,
                "& .MuiToggleButton-root": {
                  border: "none",
                  borderRadius: "5px",
                  px: 1.5,
                  py: 0.5,
                  fontSize: "9px",
                  fontWeight: 600,
                  fontFamily: "Open Sans",
                  textTransform: "none",
                  color: "#6B7280",
                  minHeight: "auto",
                  lineHeight: 1.3,
                  whiteSpace: "nowrap",
                  "&:hover": {
                    bgcolor: "#E5E7EB",
                    color: "#231E33",
                  },
                  "&.Mui-selected": {
                    bgcolor: "#1A3673",
                    color: "#FFFFFF",
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                    "&:hover": {
                      bgcolor: "#1A3673",
                      color: "#FFFFFF",
                    },
                  },
                },
              }}
            >
              <ToggleButton value={0}>Expense Paid PMPM</ToggleButton>
              <ToggleButton value={1}>Expense Allowed PMPM</ToggleButton>
              <ToggleButton value={2}>Revenue PMPM</ToggleButton>
              <ToggleButton value={3}>Gross Margin PMPM</ToggleButton>
              <ToggleButton value={4}>Member Months</ToggleButton>
              <ToggleButton value={5}>Medical Loss Ratio</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {/* Year Filter */}
        <Box
          sx={{
            mt: 0,
            mb: 1,
            p: 0.75,
            bgcolor: "#FAFBFC",
            borderRadius: "6px",
            border: "1px solid #E5E7EB",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              flexWrap: "wrap",
            }}
          >
            <Typography
              sx={{
                fontSize: "10px",
                fontWeight: 600,
                color: "#6B7280",
                fontFamily: "Open Sans",
                mr: 0.25,
              }}
            >
              Filter Years:
            </Typography>

            {/* Toggle between Last 3 Years and All Years */}
            <Chip
              label={(() => {
                const currentYear = new Date().getFullYear();
                const lastThreeYears = [
                  currentYear - 2,
                  currentYear - 1,
                  currentYear,
                ];
                const isLastThreeYears =
                  selectedYears.length === 3 &&
                  lastThreeYears.every((year) => selectedYears.includes(year));

                if (isLastThreeYears) {
                  return "All";
                } else {
                  return "Last 3";
                }
              })()}
              onClick={() => {
                const currentYear = new Date().getFullYear();
                const lastThreeYears = [
                  currentYear - 2,
                  currentYear - 1,
                  currentYear,
                ];
                const allYears = [2020, 2021, 2022, 2023, 2024, 2025, 2026];
                const isLastThreeYears =
                  selectedYears.length === 3 &&
                  lastThreeYears.every((year) => selectedYears.includes(year));

                if (isLastThreeYears) {
                  // Switch to All Years
                  onYearChange(allYears);
                } else {
                  // Switch to Last 3 Years
                  onYearChange(lastThreeYears);
                }
              }}
              sx={{
                fontSize: "9px",
                fontWeight: 700,
                fontFamily: "Open Sans",
                height: 20,
                px: 0.75,
                bgcolor: (() => {
                  const currentYear = new Date().getFullYear();
                  const lastThreeYears = [
                    currentYear - 2,
                    currentYear - 1,
                    currentYear,
                  ];
                  const isLastThreeYears =
                    selectedYears.length === 3 &&
                    lastThreeYears.every((year) =>
                      selectedYears.includes(year),
                    );
                  const allYears = [2020, 2021, 2022, 2023, 2024, 2025, 2026];
                  const isAllYears =
                    selectedYears.length === allYears.length &&
                    allYears.every((year) => selectedYears.includes(year));

                  return isLastThreeYears || isAllYears ? "#6B7280" : "#F3F4F6";
                })(),
                color: (() => {
                  const currentYear = new Date().getFullYear();
                  const lastThreeYears = [
                    currentYear - 2,
                    currentYear - 1,
                    currentYear,
                  ];
                  const isLastThreeYears =
                    selectedYears.length === 3 &&
                    lastThreeYears.every((year) =>
                      selectedYears.includes(year),
                    );
                  const allYears = [2020, 2021, 2022, 2023, 2024, 2025, 2026];
                  const isAllYears =
                    selectedYears.length === allYears.length &&
                    allYears.every((year) => selectedYears.includes(year));

                  return isLastThreeYears || isAllYears ? "#FFFFFF" : "#6B7280";
                })(),
                "&:hover": {
                  bgcolor: "#6B7280",
                  color: "#FFFFFF",
                },
              }}
            />

            {/* Individual Year Filters */}
            {[2020, 2021, 2022, 2023, 2024, 2025, 2026].map((year) => {
              const isSelected = selectedYears.includes(year);
              const partialDataYears = [2020, 2026]; // First and last years
              const isPartialData = partialDataYears.includes(year);

              return (
                <Chip
                  key={year}
                  label={isPartialData ? `${year} *` : year.toString()}
                  onClick={() => {
                    if (isSelected) {
                      onYearChange(selectedYears.filter((y) => y !== year));
                    } else {
                      onYearChange([...selectedYears, year]);
                    }
                  }}
                  sx={{
                    fontSize: "9px",
                    fontWeight: 700,
                    fontFamily: "Open Sans",
                    height: 20,
                    minWidth: 32,
                    bgcolor: isSelected ? getYearChipColor(year) : "#F3F4F6",
                    color: isSelected ? "#FFFFFF" : "#6B7280",
                    "&:hover": {
                      bgcolor: getYearChipColor(year),
                      color: "#FFFFFF",
                    },
                  }}
                />
              );
            })}

            <Typography
              sx={{
                fontSize: "8px",
                fontWeight: 400,
                color: "#9CA3AF",
                fontFamily: "Open Sans",
                fontStyle: "italic",
              }}
            >
              *Partial data
            </Typography>
          </Box>
        </Box>

        {/* Chart Display */}
        <Box sx={{ position: "relative", width: "100%" }}>
          {isLoading ? (
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: "100px",
                bgcolor: "#FAFBFC",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                overflow: "hidden",
              }}
            >
              <ChartShimmer />
            </Box>
          ) : (
            chartComponent
          )}
        </Box>
      </Card>
    </Card>
  );
}
