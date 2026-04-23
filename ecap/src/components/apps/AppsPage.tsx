import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Skeleton,
  Chip,
  Paper,
  Popper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  Fade,
  Container,
  Stack,
  Divider,
  Tooltip,
  CircularProgress,
  Alert,
  AlertTitle,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Search,
  AppWindow,
  ExternalLink,
  X,
  RefreshCw,
  Lightbulb,
  Heart,
  Globe,
  Zap,
  BarChart3,
  PieChart,
  Eye,
  Cloud,
  Filter,
  TrendingUp,
  Users,
  Clock,
  Sparkles,
  Brain,
  Target,
  TrendingUp as Analytics,
  Database,
  Shield,
  Layers,
  Activity,
  LineChart,
  Settings,
  Briefcase,
  FileText,
  Gauge,
  SquareCode,
  Telescope,
  Scale,
  Star,
  History,
  Bookmark,
  ArrowUp,
  ArrowDown,
  Grid3X3,
  List,
  Command,
  Keyboard,
} from "lucide-react";
import { API_CONFIG } from "../../config";
const API_URL = API_CONFIG.BASE_URL;
import ExternalAppEmbed from "../powerbi/ExternalAppEmbed";
import appMetadata from "./apps_metadata.json";

// ============================================================================
// STYLED COMPONENTS
// ============================================================================
const GradientBox = styled(Box)(({ theme }) => ({
  background: "#FFFFFF",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  position: "relative",
  overflow: "visible",
}));

const HeaderContent = styled(Box)(({ theme }) => ({
  position: "relative",
  background: "#FFFFFF",
  borderBottom: "1px solid #E5E7EB",
  padding: theme.spacing(1, 3),
}));

const SearchTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "#FFFFFF",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#1A3673",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#1A3673",
      boxShadow: "0 0 0 2px rgba(26, 54, 115, 0.1)",
    },
  },
}));

const FilterButton = styled(IconButton)<{ active?: boolean }>(
  ({ theme, active }) => ({
    padding: theme.spacing(1),
    borderRadius: "8px",
    border: "1px solid #E5E7EB",
    backgroundColor: active ? "#EFF6FF" : "#FFFFFF",
    color: active ? "#2861BB" : "#6B7280",
    "&:hover": {
      backgroundColor: active ? "#DBEAFE" : "#FFFFFF",
      borderColor: "#44B8F3",
    },
  }),
);

const AppCard = styled(Card)(() => ({
  borderRadius: "16px",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.22s ease",
  background: "#FFFFFF",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  cursor: "pointer",
  border: "1px solid #E5E7EB",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
  },
}));

const SuggestionsPopper = styled(Popper)(({ theme }) => ({
  zIndex: 1300,
  "& .MuiPaper-root": {
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    border: "1px solid #E5E7EB",
    maxHeight: "200px",
    overflow: "auto",
  },
}));

// ============================================================================
// BRAND COLORS & GRADIENTS
// ============================================================================
const BRAND = {
  navy: "#1A3673",
  mediumNavy: "#2861BB",
  paleNavy: "#E1EDFF",
  cyan: "#44B8F3",
  paleCyan: "#E3F4FD",
  turquoise: "#00BBBA",
  terraCotta: "#E3725F",
  textDark: "#231E33",
  white: "#FFFFFF",
  gradients: {
    primary: "linear-gradient(135deg, #1A3673 0%, #2861BB 100%)",
    secondary: "linear-gradient(135deg, #44B8F3 0%, #00BBBA 100%)",
    accent: "linear-gradient(135deg, #00BBBA 0%, #E3725F 100%)",
    soft: "linear-gradient(135deg, #E1EDFF 0%, #E3F4FD 100%)",
    allApps:
      "linear-gradient(135deg, #1A3673 0%, #2861BB 18%, #44B8F3 38%, #00BBBA 58%, #8FD4F8 78%, #E3725F 100%)",
  },
};

const CARD_COLOR_PALETTE = [
  "#1A3673",
  "#1A3673",
  "#1A3673",
  "#1A3673",
  "#1A3673",
  "#1A3673",
  "#1A3673",
  "#1A3673",
  "#1A3673",
  "#1A3673",
];

// Card background color
const CARD_BACKGROUND = "#E3F4FD"; // Light Cyan for all cards

const hexToRgba = (hex: string, alpha = 1) => {
  const sanitized = hex.replace("#", "");
  const bigint = parseInt(sanitized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const getPaletteColor = (index: number) =>
  CARD_COLOR_PALETTE[index % CARD_COLOR_PALETTE.length];

// Get app-specific capabilities (3 points each)
const getAppCapabilities = (appName: string) => {
  const name = appName.toLowerCase();

  if (name.includes("ideation")) {
    return [
      {
        title: "AI-Powered Analysis",
        description:
          "Comprehensive analysis of benefits, contracts, and corrections",
      },
      {
        title: "Market Intelligence",
        description: "Detailed competitor analysis and market insights",
      },
      {
        title: "RAG Engine",
        description: "AI-driven retrieval system for intelligent insights",
      },
    ];
  }

  if (name.includes("dashboard") || name.includes("executive")) {
    return [
      {
        title: "Real-time Analytics",
        description: "Live data visualization and performance metrics",
      },
      {
        title: "Executive Reporting",
        description: "High-level summaries and strategic insights",
      },
      {
        title: "Custom KPIs",
        description: "Configurable key performance indicators",
      },
    ];
  }

  if (name.includes("tracking") || name.includes("impact")) {
    return [
      {
        title: "Performance Monitoring",
        description: "Track key metrics and outcomes in real-time",
      },
      {
        title: "Impact Assessment",
        description: "Measure and analyze program effectiveness",
      },
      {
        title: "Trend Analysis",
        description: "Identify patterns and forecast future performance",
      },
    ];
  }

  if (name.includes("intelligence") || name.includes("program")) {
    return [
      {
        title: "Data Integration",
        description: "Seamless connection to multiple data sources",
      },
      {
        title: "Predictive Analytics",
        description: "Advanced forecasting and trend prediction",
      },
      {
        title: "Automated Insights",
        description: "AI-generated recommendations and alerts",
      },
    ];
  }

  if (name.includes("comparison") || name.includes("policy")) {
    return [
      {
        title: "Comparative Analysis",
        description: "Side-by-side policy and cost comparisons",
      },
      {
        title: "Regulatory Compliance",
        description: "Ensure adherence to healthcare regulations",
      },
      {
        title: "Cost Optimization",
        description: "Identify savings opportunities and efficiencies",
      },
    ];
  }

  if (name.includes("competitive") || name.includes("market")) {
    return [
      {
        title: "Market Research",
        description: "Comprehensive competitor and market analysis",
      },
      {
        title: "Benchmarking",
        description: "Compare performance against industry standards",
      },
      {
        title: "Strategic Planning",
        description: "Data-driven strategic recommendations",
      },
    ];
  }

  // Default capabilities for other apps
  return [
    {
      title: "Data Processing",
      description: "Efficient handling and analysis of large datasets",
    },
    {
      title: "User Interface",
      description: "Intuitive and user-friendly interface design",
    },
    {
      title: "Integration Ready",
      description: "Seamless integration with existing systems",
    },
  ];
};

// ============================================================================
// CUSTOM HOOKS
// ============================================================================
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// ============================================================================
// COMPONENTS
// ============================================================================
const AppCardSkeleton = React.memo(() => (
  <Card
    sx={{
      borderRadius: "16px",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      background: "#FFFFFF",
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      border: "1px solid #E5E7EB",
    }}
  >
    {/* Color accent bar */}
    <Skeleton variant="rectangular" width="100%" height={4} />

    {/* Content */}
    <Box sx={{ p: 1.2 }}>
      {/* Header row: icon + name + launch button */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.75 }}>
        <Skeleton
          variant="rounded"
          width={32}
          height={32}
          sx={{ borderRadius: "8px", flexShrink: 0, bgcolor: "transparent" }}
        />
        <Skeleton
          variant="text"
          sx={{
            flex: 1,
            height: "0.88rem",
            fontSize: "0.88rem",
          }}
        />
        <Skeleton
          variant="rounded"
          width={26}
          height={26}
          sx={{ borderRadius: "6px", flexShrink: 0 }}
        />
      </Stack>

      {/* Description - 2 lines to match actual card */}
      <Box sx={{ minHeight: "2.2rem", mb: 1 }}>
        <Skeleton
          variant="text"
          width="100%"
          height="0.70rem"
          sx={{ mb: 0.25 }}
        />
        <Skeleton variant="text" width="85%" height="0.70rem" />
      </Box>

      {/* Footer: category + SSO + provider */}
      <Stack direction="row" alignItems="center" spacing={0.75}>
        <Skeleton variant="text" width={60} height="0.7rem" />
        <Skeleton
          variant="rounded"
          width={32}
          height={18}
          sx={{ borderRadius: "9px" }}
        />
        <Box sx={{ flex: 1 }} />
        <Skeleton variant="text" width={40} height="0.65rem" />
      </Stack>
    </Box>
  </Card>
));

const UsageDashboard = React.memo(
  ({
    appUsage,
    favorites,
    recentlyUsed,
    apps,
  }: {
    appUsage: Record<string, { lastUsed: Date; count: number }>;
    favorites: Set<string>;
    recentlyUsed: string[];
    apps: App[];
  }) => {
    const insights = useMemo(() => {
      const totalUsage = Object.values(appUsage).reduce(
        (sum, usage) => sum + usage.count,
        0,
      );
      const mostUsedEntry = Object.entries(appUsage).sort(
        ([, a], [, b]) => b.count - a.count,
      )[0];
      const mostUsedApp = mostUsedEntry
        ? apps.find((app) => app.id === mostUsedEntry[0])
        : null;

      return {
        totalUsage,
        favoriteCount: favorites.size,
        recentActivity: recentlyUsed.length,
        mostUsedApp: mostUsedApp?.name || "None",
      };
    }, [appUsage, favorites, recentlyUsed, apps]);

    if (insights.totalUsage === 0) return null;

    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl mb-6 border border-blue-100">
        <div className="flex items-center gap-2 mb-4">
          <Analytics className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Your Usage Insights</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {insights.totalUsage}
            </div>
            <div className="text-xs text-gray-600">Total Opens</div>
          </div>
          {/* Favorites metric commented out */}
          {/* <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{insights.favoriteCount}</div>
          <div className="text-xs text-gray-600">Favorites</div>
        </div> */}
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {insights.recentActivity}
            </div>
            <div className="text-xs text-gray-600">Recent Apps</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-purple-600 truncate">
              {insights.mostUsedApp}
            </div>
            <div className="text-xs text-gray-600">Most Used</div>
          </div>
        </div>
      </div>
    );
  },
);

// ============================================================================
// TYPES
// ============================================================================

interface AppAuth {
  type: string;
  oktaAppId?: string;
  requiresToken?: boolean;
}

interface App {
  id: string;
  name: string;
  description: string;
  category: string;
  provider: string;
  url: string;
  icon: string;
  color: string;
  auth: AppAuth;
  openMode: "embed" | "newTab" | "sameTab";
  isActive: boolean;
  order: number;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getAppIcon = (
  iconName: string,
  className = "w-6 h-6",
  appName?: string,
  color?: string,
) => {
  const iconStyle = color ? { color } : {};

  // If we have the app name, use it to determine icon
  if (appName) {
    const name = appName.toLowerCase();
    if (name.includes("ideation"))
      return <Brain className={className} style={iconStyle} />;
    if (name.includes("policy") || name.includes("comparison"))
      return <Scale className={className} style={iconStyle} />;
    if (name.includes("program") && name.includes("intelligence"))
      return <SquareCode className={className} style={iconStyle} />;
    if (name.includes("rpm"))
      return <Telescope className={className} style={iconStyle} />;
    if (name.includes("mira"))
      return <PieChart className={className} style={iconStyle} />;
  }

  // Fallback to icon name matching
  switch (iconName) {
    case "Lightbulb":
    case "lightbulb":
      return <Brain className={className} style={iconStyle} />;
    case "BarChart3":
    case "barchart3":
      return <SquareCode className={className} style={iconStyle} />;
    case "PieChart":
    case "piechart":
      return <Telescope className={className} style={iconStyle} />;
    case "Eye":
    case "eye":
      return <Scale className={className} style={iconStyle} />;
    case "Heart":
    case "heart":
      return <Heart className={className} style={iconStyle} />;
    case "Globe":
    case "globe":
      return <Globe className={className} style={iconStyle} />;
    case "Zap":
    case "zap":
      return <Zap className={className} style={iconStyle} />;
    case "Cloud":
    case "cloud":
      return <Cloud className={className} style={iconStyle} />;
    default:
      return <AppWindow className={className} style={iconStyle} />;
  }
};

const trackActivity = async (app: App, action: string = "view") => {
  try {
    await fetch(`${API_URL}/user-activity`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "current-user",
        userName: "Current User",
        action,
        resourceType: "app",
        resourceId: app.id,
        resourceName: app.name,
        provider: app.provider,
        metadata: { category: app.category, url: app.url },
      }),
    });
  } catch (error) {
    console.error("Failed to track activity:", error);
  }
};

const getAppStats = (apps: App[]) => {
  const categories = new Set(apps.map((a) => a.category));
  const providers = new Set(apps.map((a) => a.provider));
  const oktaApps = apps.filter((a) => a.auth.type === "okta").length;

  return {
    totalApps: apps.length,
    categories: categories.size,
    providers: providers.size,
    oktaApps,
    embeddedApps: apps.filter((a) => a.openMode === "embed").length,
  };
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface AppsPageProps {
  onCollapseNav?: () => void;
}

const AppsPage: React.FC<AppsPageProps> = ({ onCollapseNav }) => {
  const [apps, setApps] = useState<App[]>([]);
  const [appColorMap, setAppColorMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>([]);
  const [appUsage, setAppUsage] = useState<
    Record<string, { lastUsed: Date; count: number }>
  >({});
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"name" | "lastUsed" | "category">(
    "name",
  );
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showRecentOnly, setShowRecentOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const searchInputRef = useRef<HTMLInputElement>(null);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    fetchApps();
    loadUserPreferences();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "k":
            e.preventDefault();
            searchInputRef.current?.focus();
            break;
          /* case 'f':
            e.preventDefault();
            setShowFavoritesOnly(!showFavoritesOnly);
            break;
          case 'r':
            e.preventDefault();
            setShowRecentOnly(!showRecentOnly);
            break; */
        }
      }
      if (e.key === "Escape") {
        setSearchQuery("");
        // setShowFavoritesOnly(false);
        // setShowRecentOnly(false);
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [showFavoritesOnly, showRecentOnly]);

  const getCurrentUserId = () => {
    // In a real app, this would come from your auth system
    // For now, we'll use a simple approach - you should replace this with actual user ID
    return localStorage.getItem("currentUserId") || "anonymous-user";
  };

  const loadUserPreferences = () => {
    const userId = getCurrentUserId();

    // Load favorites from localStorage with user-specific key
    const savedFavorites = localStorage.getItem(`appFavorites_${userId}`);
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }

    // Load recently used apps with user-specific key
    const savedRecentlyUsed = localStorage.getItem(
      `recentlyUsedApps_${userId}`,
    );
    if (savedRecentlyUsed) {
      setRecentlyUsed(JSON.parse(savedRecentlyUsed));
    }

    // Load app usage data with user-specific key
    const savedUsage = localStorage.getItem(`appUsage_${userId}`);
    if (savedUsage) {
      const usage = JSON.parse(savedUsage);
      // Convert date strings back to Date objects
      Object.keys(usage).forEach((key) => {
        usage[key].lastUsed = new Date(usage[key].lastUsed);
      });
      setAppUsage(usage);
    }
  };

  const fetchApps = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/apps`);
      if (response.ok) {
        const data = await response.json();
        const activeApps = data.apps?.filter((a: App) => a.isActive) || [];
        setApps(activeApps);
        // Create color mapping - hardcoded colors for specific apps
        const colorMap: Record<string, string> = {
          "ideation-engine": "#1A3673",
          "app-1772072523550": "#1A3673",
          "app-1772069875530": "#1A3673",
          intelliq: "#1A3673",
          "app-1772069512682": "#1A3673",
        };
        setAppColorMap(colorMap);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching apps from API:", error);
      console.log("Falling back to local app metadata");
      // Fallback to local app metadata
      const activeApps = appMetadata.apps?.filter((a: App) => a.isActive) || [];
      setApps(activeApps);
      // Create color mapping - hardcoded colors for specific apps
      const colorMap: Record<string, string> = {
        "ideation-engine": "#1A3673",
        "app-1772072523550": "#1A3673",
        "app-1772069875530": "#1A3673",
        intelliq: "#1A3673",
        "app-1772069512682": "#1A3673",
      };
      setAppColorMap(colorMap);
      setError(null); // Clear error since we have fallback data
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleFavorite = (appId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const userId = getCurrentUserId();
    const newFavorites = new Set(favorites);
    if (newFavorites.has(appId)) {
      newFavorites.delete(appId);
    } else {
      newFavorites.add(appId);
    }
    setFavorites(newFavorites);
    localStorage.setItem(
      `appFavorites_${userId}`,
      JSON.stringify([...newFavorites]),
    );
  };

  const updateAppUsage = (app: App) => {
    const userId = getCurrentUserId();
    const now = new Date();
    const newUsage = { ...appUsage };
    newUsage[app.id] = {
      lastUsed: now,
      count: (newUsage[app.id]?.count || 0) + 1,
    };
    setAppUsage(newUsage);
    localStorage.setItem(`appUsage_${userId}`, JSON.stringify(newUsage));

    // Update recently used list
    const newRecentlyUsed = [
      app.id,
      ...recentlyUsed.filter((id) => id !== app.id),
    ].slice(0, 5);
    setRecentlyUsed(newRecentlyUsed);
    localStorage.setItem(
      `recentlyUsedApps_${userId}`,
      JSON.stringify(newRecentlyUsed),
    );
  };

  const handleAppClick = async (app: App) => {
    await trackActivity(app, "launch");
    updateAppUsage(app);

    if (app.openMode === "embed") {
      setSelectedApp(app);
    } else if (app.openMode === "newTab") {
      window.open(app.url, "_blank");
    } else {
      window.location.href = app.url;
    }
  };

  const formatLastUsed = (appId: string) => {
    const usage = appUsage[appId];
    if (!usage) return null;

    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - usage.lastUsed.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Used recently";
    if (diffInHours < 24) return `Used ${diffInHours}h ago`;
    if (diffInHours < 168) return `Used ${Math.floor(diffInHours / 24)}d ago`;
    return "Used over a week ago";
  };

  // Calculate statistics
  const stats = useMemo(() => getAppStats(apps), [apps]);

  // Get unique categories
  const categories = useMemo(
    () => ["All", ...new Set(apps.map((a) => a.category))],
    [apps],
  );

  // Search suggestions
  const searchSuggestions = useMemo(() => {
    const suggestions = [
      "Analytics",
      "Intelligence",
      "Dashboard",
      "Policy",
      "Program",
    ];
    return suggestions
      .filter(
        (s) =>
          s.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) &&
          s.toLowerCase() !== debouncedSearchQuery.toLowerCase(),
      )
      .slice(0, 3);
  }, [debouncedSearchQuery]);

  // Filter and sort apps with performance optimization
  const filteredApps = useMemo(() => {
    let filtered = apps.filter((app) => {
      const matchesSearch =
        !debouncedSearchQuery ||
        app.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        app.description
          .toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase()) ||
        app.category.toLowerCase().includes(debouncedSearchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || app.category === selectedCategory;
      const matchesFavorites = !showFavoritesOnly || favorites.has(app.id);
      const matchesRecent = !showRecentOnly || recentlyUsed.includes(app.id);

      return (
        matchesSearch && matchesCategory && matchesFavorites && matchesRecent
      );
    });

    // Sort apps
    filtered.sort((a, b) => {
      // Executive Dashboard always first
      if (a.name.toLowerCase().includes("executive dashboard")) return -1;
      if (b.name.toLowerCase().includes("executive dashboard")) return 1;

      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "category":
          return a.category.localeCompare(b.category);
        case "lastUsed":
          const aUsage = appUsage[a.id]?.lastUsed?.getTime() || 0;
          const bUsage = appUsage[b.id]?.lastUsed?.getTime() || 0;
          return bUsage - aUsage;
        default:
          return a.order - b.order;
      }
    });

    return filtered;
  }, [
    apps,
    debouncedSearchQuery,
    selectedCategory,
    showFavoritesOnly,
    showRecentOnly,
    sortBy,
    favorites,
    recentlyUsed,
    appUsage,
  ]);

  // Loading state with skeleton
  if (loading) {
    return (
      <GradientBox>
        <HeaderBox>
          <HeaderContent></HeaderContent>
        </HeaderBox>
        <Box sx={{ flex: 1, overflow: "auto" }}>
          <Container maxWidth="xl" sx={{ py: 3 }}>
            <Box
              sx={{
                borderRadius: "24px",
                p: "1px",
                background: BRAND.gradients.allApps,
                boxShadow: "0 25px 60px rgba(26, 54, 115, 0.18)",
              }}
            >
              <Paper
                sx={{
                  borderRadius: "24px",
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(4px)",
                  p: 3,
                }}
              >
                <Grid container spacing={3}>
                  {Array(6)
                    .fill(0)
                    .map((_, i) => (
                      <Grid item xs={12} md={6} xl={4} key={i}>
                        <AppCardSkeleton />
                      </Grid>
                    ))}
                </Grid>
              </Paper>
            </Box>
          </Container>
        </Box>
      </GradientBox>
    );
  }

  // Error state
  if (error) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#F8FAFB",
        }}
      >
        <Stack
          spacing={2}
          alignItems="center"
          sx={{ maxWidth: 400, textAlign: "center" }}
        >
          <X size={64} color="#EF4444" />
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#111827" }}>
            Something went wrong
          </Typography>
          <Typography variant="body2" sx={{ color: "#6B7280" }}>
            {error}
          </Typography>
          <Button
            variant="contained"
            onClick={() => fetchApps()}
            sx={{
              px: 3,
              py: 1,
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: 500,
              background: BRAND.gradients.primary,
              textTransform: "none",
              "&:hover": { boxShadow: 3 },
            }}
          >
            Try Again
          </Button>
        </Stack>
      </Box>
    );
  }

  // App viewer - use ExternalAppEmbed component (same as All Dashboards)
  if (selectedApp) {
    return (
      <Box sx={{ height: "calc(100vh - 120px)" }}>
        <ExternalAppEmbed
          url={selectedApp.url}
          title={selectedApp.name}
          appKey={selectedApp.id}
          appType="application"
          platform={selectedApp.provider}
          onClose={() => setSelectedApp(null)}
        />
      </Box>
    );
  }

  // Main view
  return (
    <GradientBox>
      {/* Enhanced Header with Gradient */}
      <HeaderBox>
        <HeaderContent>
          <Stack direction="row" alignItems="center" justifyContent="flex-end">
            <Stack direction="row" alignItems="center" spacing={1.5}>
              {/* Search with suggestions */}
              <Box sx={{ position: "relative" }}>
                <SearchTextField
                  ref={searchInputRef}
                  placeholder="Search apps..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  size="small"
                  sx={{ width: 280 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={16} color="#9CA3AF" />
                      </InputAdornment>
                    ),
                  }}
                />
                <SuggestionsPopper
                  open={Boolean(searchQuery && searchSuggestions.length > 0)}
                  anchorEl={searchInputRef.current}
                  placement="bottom-start"
                  transition
                >
                  {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={200}>
                      <Paper
                        sx={{
                          width: searchInputRef.current?.offsetWidth || 280,
                        }}
                      >
                        <MenuList>
                          {searchSuggestions.map((suggestion) => (
                            <MenuItem
                              key={suggestion}
                              onClick={() => setSearchQuery(suggestion)}
                              sx={{ py: 1, fontSize: "14px" }}
                            >
                              <Search
                                size={12}
                                style={{ marginRight: 8, color: "#9CA3AF" }}
                              />
                              {suggestion}
                            </MenuItem>
                          ))}
                        </MenuList>
                      </Paper>
                    </Fade>
                  )}
                </SuggestionsPopper>
              </Box>

              {/* Quick Actions */}
              <Stack direction="row" spacing={1}>
                {/* Favorites and Recent filters commented out */}
                {/* <Tooltip title="Show favorites only (Ctrl+F)">
                  <FilterButton
                    active={showFavoritesOnly}
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  >
                    <Star size={16} fill={showFavoritesOnly ? 'currentColor' : 'none'} />
                  </FilterButton>
                </Tooltip>
                <Tooltip title="Show recent only (Ctrl+R)">
                  <FilterButton
                    active={showRecentOnly}
                    onClick={() => setShowRecentOnly(!showRecentOnly)}
                  >
                    <History size={16} />
                  </FilterButton>
                </Tooltip> */}
              </Stack>
            </Stack>
          </Stack>
        </HeaderContent>
      </HeaderBox>

      {/* Main Content Area */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <Container maxWidth="xl" sx={{ py: 2 }}>
          {/* All Apps Section */}
          <Grid container spacing={1.5}>
            {filteredApps.map((app, index) => {
              const cardColor = appColorMap[app.id] || getPaletteColor(index);

              return (
                <Grid item xs={12} sm={6} lg={4} xl={3} key={app.id}>
                  <AppCard
                    onClick={() => handleAppClick(app)}
                    sx={{
                      "&:hover": {
                        borderColor: hexToRgba(cardColor, 0.4),
                      },
                    }}
                  >
                    {/* Color accent bar */}
                    <Box sx={{ height: 4, bgcolor: cardColor }} />

                    {/* Content */}
                    <Box sx={{ p: 1.2 }}>
                      {/* Header row: icon + name + launch */}
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ mb: 0.75 }}
                      >
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {getAppIcon(
                            app.icon,
                            "w-[16px] h-[16px]",
                            app.name,
                            cardColor,
                          )}
                        </Box>
                        <Typography
                          sx={{
                            flex: 1,
                            fontWeight: 700,
                            fontSize: "0.88rem",
                            color: "#1E293B",
                            lineHeight: 1.25,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {app.name}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAppClick(app);
                          }}
                          sx={{
                            width: 26,
                            height: 26,
                            borderRadius: "6px",
                            bgcolor: hexToRgba(cardColor, 0.1),
                            color: cardColor,
                            flexShrink: 0,
                            "&:hover": { bgcolor: cardColor, color: "#fff" },
                          }}
                        >
                          <ExternalLink size={12} />
                        </IconButton>
                      </Stack>

                      {/* Description */}
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#64748B",
                          fontSize: "0.70rem",
                          fontWeight: 500,
                          lineHeight: 1.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          minHeight: "2.2rem",
                        }}
                      >
                        {app.description}
                      </Typography>

                      {/* Footer: category + SSO */}
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={0.75}
                        sx={{ mt: 1 }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#94A3B8",
                            fontSize: "0.7rem",
                            fontWeight: 500,
                          }}
                        >
                          {app.category}
                        </Typography>
                        {app.auth.type === "okta" && (
                          <Chip
                            label="SSO"
                            size="small"
                            sx={{
                              height: 18,
                              fontSize: "0.62rem",
                              fontWeight: 700,
                              bgcolor: "#DCFCE7",
                              color: "#15803D",
                              "& .MuiChip-label": { px: 0.6 },
                            }}
                          />
                        )}
                        <Box sx={{ flex: 1 }} />
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#CBD5E1",
                            fontSize: "0.65rem",
                            textTransform: "capitalize",
                          }}
                        >
                          {app.provider}
                        </Typography>
                      </Stack>
                    </Box>
                  </AppCard>
                </Grid>
              );
            })}
          </Grid>

          {/* Enhanced Empty State */}
          {filteredApps.length === 0 && (
            <Box sx={{ textAlign: "center", py: 6 }}>
              {debouncedSearchQuery ? (
                <Stack spacing={2} alignItems="center">
                  <Search size={64} color="#D1D5DB" />
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 600, color: BRAND.navy }}
                  >
                    No apps match "{debouncedSearchQuery}"
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#6B7280" }}>
                    Try searching for something else
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ my: 2 }}>
                    {["Analytics", "Intelligence", "Dashboard"].map(
                      (suggestion) => (
                        <Chip
                          key={suggestion}
                          label={suggestion}
                          onClick={() => setSearchQuery(suggestion)}
                          sx={{
                            bgcolor: "#DBEAFE",
                            color: "#1D4ED8",
                            fontSize: "12px",
                            "&:hover": { bgcolor: "#BFDBFE" },
                            cursor: "pointer",
                          }}
                        />
                      ),
                    )}
                  </Stack>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setSearchQuery("");
                      setShowFavoritesOnly(false);
                      setShowRecentOnly(false);
                      setSelectedCategory("All");
                    }}
                    sx={{
                      px: 3,
                      py: 1,
                      borderRadius: "12px",
                      fontSize: "14px",
                      fontWeight: 500,
                      background: BRAND.gradients.primary,
                      textTransform: "none",
                      "&:hover": { boxShadow: 3 },
                    }}
                  >
                    Clear all filters
                  </Button>
                </Stack>
              ) : (
                <Stack spacing={2} alignItems="center">
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: "16px",
                      background: BRAND.gradients.soft,
                      display: "inline-block",
                    }}
                  >
                    <AppWindow size={64} color="#9CA3AF" />
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 600, color: BRAND.navy }}
                  >
                    {showFavoritesOnly
                      ? "No favorite apps yet"
                      : showRecentOnly
                        ? "No recent apps"
                        : "No apps found"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#6B7280" }}>
                    {showFavoritesOnly
                      ? "Start by marking some apps as favorites!"
                      : showRecentOnly
                        ? "Use some apps to see them here"
                        : "No applications match the selected filters"}
                  </Typography>
                  {(showFavoritesOnly || showRecentOnly) && (
                    <Button
                      variant="contained"
                      onClick={() => {
                        setShowFavoritesOnly(false);
                        setShowRecentOnly(false);
                      }}
                      sx={{
                        px: 3,
                        py: 1,
                        borderRadius: "12px",
                        fontSize: "14px",
                        fontWeight: 500,
                        background: BRAND.gradients.primary,
                        textTransform: "none",
                        "&:hover": { boxShadow: 3 },
                      }}
                    >
                      Show all apps
                    </Button>
                  )}
                </Stack>
              )}
            </Box>
          )}
        </Container>
      </Box>
    </GradientBox>
  );
};

export default AppsPage;
