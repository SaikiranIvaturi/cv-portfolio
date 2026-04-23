import { useState, useMemo, useCallback } from "react";
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Search,
  Sparkles,
  Activity,
  Shield,
  Globe,
  Network,
  Zap,
  ArrowLeft,
  Layers,
  Building2,
  HeartHandshake,
  Landmark,
  ChevronDown,
  ChevronUp,
  Grid3x3,
  List,
  Lock,
} from "lucide-react";
import EnhancedFlashCardV2 from "./enhancedFlashCard/EnhancedFlashCardV2";
import ChatContextGuide from "./ChatContextGuide";
import AIChat from "../chat/AIChat";
import { FlashCard as FlashCardType } from "../../types";
import { useInsightsAPI } from "../../hooks/useInsightsAPI";
import {
  filterFlashCards,
  defaultFilters,
  FilterState,
} from "../../utils/filters";

/* ── Theme colors (from muiTheme.ts) ──────────────────────────────────────── */
const C = {
  navy: "#1A3673",
  navyMid: "#2861BB",
  navyLight: "#6A97DF",
  cyan: "#44B8F3",
  turquoise: "#00BBBA",
  paleNavy: "#E1EDFF",
  terraCotta: "#E3725F",
  white: "#FFFFFF",
  bg: "#F8FAFB",
  surface: "#FFFFFF",
  elevated: "#F8FAFB",
  textPrimary: "#231E33",
  textSecondary: "#6B7280",
  textDisabled: "#9CA3AF",
  border: "#E5E7EB",
};

/* ── Category groups ──────────────────────────────────────────────────────── */
const GROUP_ORDER = [
  "Inpatient Medical/Surgical",
  "Inpatient Authorization",
  "Out-of-Network Management",
  "Outpatient Authorization",
  "Other Insights",
] as const;

type GroupName = (typeof GROUP_ORDER)[number];

const GROUP_META: Record<
  GroupName,
  { accent: string; label: string; icon: typeof Activity }
> = {
  "Inpatient Medical/Surgical": {
    accent: C.navy,
    label: "IP Med/Surg",
    icon: Activity,
  },
  "Inpatient Authorization": {
    accent: C.navyMid,
    label: "IP Auth",
    icon: Shield,
  },
  "Out-of-Network Management": {
    accent: C.turquoise,
    label: "OON Network",
    icon: Network,
  },
  "Outpatient Authorization": { accent: C.cyan, label: "OP Auth", icon: Globe },
  "Other Insights": { accent: C.textSecondary, label: "Other", icon: Zap },
};

/* ── LOB filter options ───────────────────────────────────────────────────── */
const LOB_OPTIONS = [
  { value: "all", label: "All", icon: Layers, color: C.navy },
  {
    value: "commercial",
    label: "Commercial",
    icon: Building2,
    color: C.navyMid,
  },
  {
    value: "medicaid",
    label: "Medicaid",
    icon: HeartHandshake,
    color: C.turquoise,
  },
  { value: "medicare", label: "Medicare", icon: Landmark, color: C.cyan },
] as const;

/* ── Component ────────────────────────────────────────────────────────────── */
interface Props {
  onNavigate?: (page: string) => void;
  variant: "grid" | "list";
  title?: string;
}

export default function UnifiedDashboard({ onNavigate, variant }: Props) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showChatGuide, setShowChatGuide] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set(),
  );
  const [selectedCard, setSelectedCard] = useState<FlashCardType | null>(null);
  const [viewMode, setViewMode] = useState<"simple" | "detailed">("simple");

  const { flashCards, loading, toggleFavorite } = useInsightsAPI();

  /* ── Sort & group ─────────────────────────────────────────────────────── */
  const grouped = useMemo(() => {
    const filtered = filterFlashCards(
      flashCards,
      filters,
      showFavoritesOnly,
    ).sort((a, b) => {
      const order = (c: any) => {
        const titleLower = c.title?.toLowerCase() || "";
        const categoryLower = c.category?.toLowerCase() || "";
        if (
          titleLower.includes("ip med/surg") ||
          categoryLower.includes("ip med/surg") ||
          titleLower.includes("medical/surgical") ||
          categoryLower.includes("medical/surgical")
        )
          return 1;
        if (
          titleLower.includes("ip auth") ||
          categoryLower.includes("ip auth") ||
          titleLower.includes("inpatient auth")
        )
          return 2;
        if (
          titleLower.includes("oon") ||
          titleLower.includes("out-of-network") ||
          categoryLower.includes("network management") ||
          categoryLower.includes("oon")
        )
          return 3;
        if (
          titleLower.includes("op auth") ||
          categoryLower.includes("outpatient authorization") ||
          titleLower.includes("outpatient auth")
        )
          return 4;
        return 5;
      };
      const d = order(a) - order(b);
      if (d !== 0) return d;
      const lob = (s: string) =>
        s?.toLowerCase().includes("commercial")
          ? 1
          : s?.toLowerCase().includes("medicaid")
            ? 2
            : s?.toLowerCase().includes("medicare")
              ? 3
              : 4;
      return lob(a.line_of_business) - lob(b.line_of_business);
    });

    const map: Partial<Record<GroupName, FlashCardType[]>> = {};
    filtered.forEach((card) => {
      let key: GroupName = "Other Insights";
      const titleLower = card.title?.toLowerCase() || "";
      const categoryLower = card.category?.toLowerCase() || "";
      if (
        titleLower.includes("ip med/surg") ||
        categoryLower.includes("ip med/surg") ||
        titleLower.includes("medical/surgical") ||
        categoryLower.includes("medical/surgical")
      ) {
        key = "Inpatient Medical/Surgical";
      } else if (
        titleLower.includes("ip auth") ||
        categoryLower.includes("ip auth") ||
        titleLower.includes("inpatient auth")
      ) {
        key = "Inpatient Authorization";
      } else if (
        titleLower.includes("oon") ||
        titleLower.includes("out-of-network") ||
        categoryLower.includes("network management") ||
        categoryLower.includes("oon")
      ) {
        key = "Out-of-Network Management";
      } else if (
        titleLower.includes("op auth") ||
        categoryLower.includes("outpatient authorization") ||
        titleLower.includes("outpatient auth")
      ) {
        key = "Outpatient Authorization";
      }
      if (!map[key]) map[key] = [];
      map[key]!.push(card);
    });
    return map;
  }, [flashCards, filters, showFavoritesOnly]);

  const visibleGroups = GROUP_ORDER.filter(
    (g) => (grouped[g]?.length ?? 0) > 0,
  );

  /* ── Callbacks ────────────────────────────────────────────────────────── */
  const handleChatWithCard = useCallback((card: FlashCardType) => {
    setSelectedCard(card);
    setShowChat(true);
  }, []);

  const handleActionPlan = useCallback((card: FlashCardType) => {
    alert(`Action Plan Feature - Coming Soon!\n\n${card.title}`);
  }, []);

  const updateFilter = useCallback((key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const totalInsights = useMemo(
    () =>
      (Object.values(grouped) as FlashCardType[][]).reduce(
        (s, arr) => s + (arr?.length ?? 0),
        0,
      ),
    [grouped],
  );

  const allFilteredCards = useMemo(
    () => filterFlashCards(flashCards, filters, showFavoritesOnly),
    [flashCards, filters, showFavoritesOnly],
  );

  /* ═══════════════════════════════════════════════════════════════════════
     CHAT VIEW (preserved, no visual changes needed)
     ═══════════════════════════════════════════════════════════════════════ */
  if (showChat && selectedCard) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          bgcolor: C.white,
        }}
      >
        <Box
          sx={{
            bgcolor: C.white,
            borderBottom: `1px solid ${C.border}`,
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            px: 3,
            py: 1.75,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 34,
                height: 34,
                background: `linear-gradient(135deg, ${C.navy}, ${C.navyMid})`,
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Sparkles size={16} color="white" />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: C.textPrimary,
                  lineHeight: 1.3,
                  fontFamily: "'Open Sans', sans-serif",
                }}
              >
                {selectedCard.title}
              </Typography>
              <Typography
                sx={{
                  fontSize: "11px",
                  color: C.textSecondary,
                  fontWeight: 400,
                  fontFamily: "'Open Sans', sans-serif",
                }}
              >
                {selectedCard.line_of_business} · {selectedCard.category}
              </Typography>
            </Box>
          </Box>
          <Button
            onClick={() => {
              setShowChat(false);
              setSelectedCard(null);
            }}
            startIcon={<ArrowLeft size={14} />}
            sx={{
              px: 2,
              py: 0.75,
              bgcolor: C.paleNavy,
              color: C.navy,
              border: `1px solid ${C.navyLight}40`,
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 400,
              textTransform: "none",
              fontFamily: "'Open Sans', sans-serif",
              "&:hover": { bgcolor: C.navyLight, color: C.white },
            }}
          >
            Back
          </Button>
        </Box>
        <Box sx={{ flex: 1, overflow: "hidden" }}>
          <AIChat
            selectedCard={selectedCard}
            onNavigate={onNavigate}
            isEmbedded={true}
          />
        </Box>
      </Box>
    );
  }

  /* ═══════════════════════════════════════════════════════════════════════
     MAIN VIEW
     ═══════════════════════════════════════════════════════════════════════ */
  return (
    <Box
      sx={{
        bgcolor: C.bg,
        minHeight: "100vh",
        fontFamily: "'Open Sans', sans-serif",
      }}
    >
      <Box sx={{ width: "100%" }}>
        {/* ════════ Sticky Command Bar ════════ */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 20,
            bgcolor: C.white,
            borderBottom: `1px solid ${C.border}`,
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            px: 1.5,
            py: 0.75,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            {/* Left: wordmark */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "7px",
                  background: `linear-gradient(135deg, ${C.navy}, ${C.navyMid})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Sparkles size={15} color="white" />
              </Box>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 400,
                  color: C.textPrimary,
                  letterSpacing: "-0.01em",
                  fontFamily: "'Open Sans', sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                Clinical Insights
              </Typography>
              {totalInsights > 0 && (
                <Box
                  sx={{
                    px: 0.75,
                    py: 0.2,
                    borderRadius: "5px",
                    bgcolor: C.paleNavy,
                    border: `1px solid ${C.navyLight}30`,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "10px",
                      fontWeight: 600,
                      color: C.navy,
                      fontFamily: "'Open Sans', sans-serif",
                    }}
                  >
                    {totalInsights}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Right: LOB dropdown + search */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {/* LOB dropdown */}
              <Select
                value={filters.lob}
                onChange={(e) => updateFilter("lob", e.target.value)}
                size="small"
                sx={{
                  minWidth: 140,
                  height: 34,
                  bgcolor: C.white,
                  borderRadius: "7px",
                  fontFamily: "'Open Sans', sans-serif",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: C.border,
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: C.navyLight,
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: C.navy,
                    borderWidth: "1px",
                  },
                  "& .MuiSelect-select": {
                    py: 0.5,
                    fontSize: "13px",
                    fontWeight: 400,
                    color: C.textPrimary,
                    fontFamily: "'Open Sans', sans-serif",
                  },
                }}
              >
                {LOB_OPTIONS.map(({ value, label }) => (
                  <MenuItem
                    key={value}
                    value={value}
                    sx={{
                      fontSize: "13px",
                      fontFamily: "'Open Sans', sans-serif",
                      "&.Mui-selected": {
                        bgcolor: C.paleNavy,
                        "&:hover": {
                          bgcolor: C.paleNavy,
                        },
                      },
                    }}
                  >
                    {label}
                  </MenuItem>
                ))}
              </Select>

              {/* Search */}
              <TextField
                placeholder="Search insights…"
                value={filters.searchQuery}
                onChange={(e) => updateFilter("searchQuery", e.target.value)}
                size="small"
                sx={{
                  width: 240,
                  "& .MuiOutlinedInput-root": {
                    height: 34,
                    bgcolor: C.white,
                    borderRadius: "8px",
                    "& fieldset": {
                      borderColor: C.border,
                    },
                    "&:hover fieldset": {
                      borderColor: C.navyLight,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: C.navy,
                      borderWidth: "1px",
                    },
                    input: {
                      fontSize: "13px",
                      color: C.textPrimary,
                      fontFamily: "'Open Sans', sans-serif",
                      "&::placeholder": { color: C.textDisabled },
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={16} color={C.textDisabled} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* ════════ Content ════════ */}
        <Box sx={{ px: 2, py: 1.5 }}>
          {loading ? (
            /* Loading state */
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 16,
                gap: 2.5,
              }}
            >
              <Box sx={{ display: "flex", gap: 1 }}>
                {[0, 1, 2].map((i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: C.cyan,
                      animation: "pulse 1.4s ease-in-out infinite",
                      animationDelay: `${i * 0.2}s`,
                      "@keyframes pulse": {
                        "0%, 100%": { opacity: 0.3, transform: "scale(0.8)" },
                        "50%": { opacity: 1, transform: "scale(1)" },
                      },
                    }}
                  />
                ))}
              </Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: C.textSecondary,
                  fontFamily: "'Open Sans', sans-serif",
                }}
              >
                Loading insights…
              </Typography>
            </Box>
          ) : allFilteredCards.length === 0 ? (
            /* Empty state */
            <Box
              sx={{
                textAlign: "center",
                py: 12,
                bgcolor: C.white,
                borderRadius: "12px",
                border: `1px solid ${C.border}`,
              }}
            >
              <Search
                size={32}
                color={C.textDisabled}
                style={{ marginBottom: 16 }}
              />
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: C.textPrimary,
                  fontFamily: "'Open Sans', sans-serif",
                }}
              >
                No insights match your filters
              </Typography>
              <Typography
                sx={{
                  fontSize: "13px",
                  color: C.textSecondary,
                  mt: 0.75,
                  fontFamily: "'Open Sans', sans-serif",
                }}
              >
                Try adjusting the LOB filter or search terms
              </Typography>
            </Box>
          ) : (
            /* Groups */
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {visibleGroups.map((groupName) => {
                const meta = GROUP_META[groupName];
                const GIcon = meta.icon;
                const cards = grouped[groupName] ?? [];
                const isCollapsed = collapsedSections.has(groupName);

                const toggleCollapse = () => {
                  setCollapsedSections((prev) => {
                    const newSet = new Set(prev);
                    if (newSet.has(groupName)) newSet.delete(groupName);
                    else newSet.add(groupName);
                    return newSet;
                  });
                };

                return (
                  <Box key={groupName}>
                    {/* ── Section header ── */}
                    <Box
                      onClick={toggleCollapse}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1.25,
                        cursor: "pointer",
                        userSelect: "none",
                      }}
                    >
                      {/* Icon */}
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "8px",
                          bgcolor: `${meta.accent}10`,
                          border: `1px solid ${meta.accent}30`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <GIcon
                          size={14}
                          color={meta.accent}
                          strokeWidth={2.5}
                        />
                      </Box>

                      {/* Label */}
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: C.textPrimary,
                          fontFamily: "'Open Sans', sans-serif",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {meta.label}
                      </Typography>

                      {/* Count badge */}
                      <Box
                        sx={{
                          px: 1,
                          py: 0.25,
                          borderRadius: "6px",
                          bgcolor: `${meta.accent}10`,
                          border: `1px solid ${meta.accent}20`,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "11px",
                            fontWeight: 600,
                            color: meta.accent,
                            fontFamily: "'Open Sans', sans-serif",
                          }}
                        >
                          {cards.length}
                        </Typography>
                      </Box>

                      {/* Divider */}
                      <Box sx={{ flex: 1, height: "1px", bgcolor: C.border }} />

                      {/* Collapse icon */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 24,
                          height: 24,
                          borderRadius: "6px",
                          bgcolor: C.elevated,
                          border: `1px solid ${C.border}`,
                          flexShrink: 0,
                          transition: "all 0.15s ease",
                          "&:hover": { bgcolor: C.paleNavy },
                        }}
                      >
                        {isCollapsed ? (
                          <ChevronDown
                            size={14}
                            color={C.textSecondary}
                            strokeWidth={2.5}
                          />
                        ) : (
                          <ChevronUp
                            size={14}
                            color={C.textSecondary}
                            strokeWidth={2.5}
                          />
                        )}
                      </Box>
                    </Box>

                    {/* ── Cards grid ── */}
                    {!isCollapsed && (
                      <Box
                        sx={{
                          display: "grid",
                          gap: 1.5,
                          gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            md: "repeat(4, 1fr)",
                            lg: "repeat(4, 1fr)",
                            xl: "repeat(5, 1fr)",
                          },
                        }}
                      >
                        {cards.map((card) => (
                          <EnhancedFlashCardV2
                            key={card.id}
                            card={card}
                            onClick={() => {}}
                            onChatWithCard={handleChatWithCard}
                            onViewActionPlan={handleActionPlan}
                            onToggleFavorite={() =>
                              toggleFavorite(card.id, !card.is_favorite)
                            }
                            viewMode={viewMode}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
      </Box>

      {showChatGuide && (
        <ChatContextGuide onClose={() => setShowChatGuide(false)} />
      )}
    </Box>
  );
}
