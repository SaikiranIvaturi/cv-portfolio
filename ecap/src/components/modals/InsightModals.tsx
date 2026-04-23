import {
  X,
  TrendingUp,
  Activity,
  AlertCircle,
  MessageCircle,
  Users,
  FileBarChart,
  DollarSign,
  Calculator,
  Network,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";
import { FlashCard } from "../../types";
import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Stack,
  Modal,
} from "@mui/material";

type TimeSeriesKey = "rolling_3" | "rolling_6" | "rolling_12" | "ytd";

interface InsightModalProps {
  card: FlashCard;
  isOpen: boolean;
  onClose: () => void;
  onChatWithCard?: (card: FlashCard) => void;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
}

// Structured Deep Dive Data
interface StateData {
  title: string;
  overview: string;
  sections: {
    title: string;
    description?: string;
    table: {
      headers: string[];
      rows: (string | number)[][];
    };
  }[];
}

const DEEP_DIVE_STATE_DATA: Record<string, StateData> = {
  ME: {
    title: "ME Authorization Summary",
    overview:
      "Maine (ME) accounts for 1,899 authorizations out of a national total of 141,851, representing 1.34% of all national authorizations. Of these, 46.87% require a Medical Necessity review.",
    sections: [
      {
        title: "Service Driver Distribution (ME)",
        table: {
          headers: ["Service Type", "Number of Authorizations", "Percentage"],
          rows: [
            ["Inpatient Medical / Surgical", "1,205", "63.45%"],
            ["Inpatient Behavioral Health", "527", "27.75%"],
            ["Inpatient OB Delivery / Newborn", "146", "7.69%"],
            ["Nursing Facility", "27", "1.42%"],
            ["Total", "1,899", "100%"],
          ],
        },
      },
      {
        title: "Authorization Status Mix (ME)",
        table: {
          headers: ["Status", "Number of Authorizations", "Percentage"],
          rows: [
            ["Approved", "1,736", "91.42%"],
            ["Partial", "135", "7.11%"],
            ["Not Approved", "24", "1.26%"],
            ["No Decision", "4", "0.21%"],
            ["Total", "1,899", "100%"],
          ],
        },
      },
      {
        title: "Approval Details",
        description: "Of the 1,736 approved authorizations:",
        table: {
          headers: ["Approval Type", "Count", "Percentage of Approved"],
          rows: [
            ["Medical Necessity Approvals", "1,693", "97.52%"],
            ["Other Approvals", "43", "2.48%"],
            ["Total Approved", "1,736", "100%"],
          ],
        },
      },
      {
        title: "Denial and Appeal Summary",
        description: "Of the 24 denied authorizations:",
        table: {
          headers: ["Category", "Count", "Percentage"],
          rows: [
            ["Appealed", "1", "4.17%"],
            ["– Overturned", "0", "0.00%"],
            ["– Upheld", "1", "4.17%"],
            ["Not Appealed", "23", "95.83%"],
            ["Total Denied", "24", "100%"],
          ],
        },
      },
    ],
  },
  CO: {
    title: "CO Authorization Summary",
    overview:
      "Colorado (CO) accounts for 5,898 authorizations out of a national total of 141,851, representing 4.16% of all national authorizations. Of these, 41.88% require a Medical Necessity review.",
    sections: [
      {
        title: "Service Driver Distribution (CO)",
        table: {
          headers: ["Service Type", "Number of Authorizations", "Percentage"],
          rows: [
            ["Inpatient Medical / Surgical", "3,850", "65.28%"],
            ["Inpatient Behavioral Health", "1,469", "24.91%"],
            ["Inpatient OB Delivery / Newborn", "524", "8.88%"],
            ["Nursing Facility", "60", "1.02%"],
            ["Total", "5,898", "100%"],
          ],
        },
      },
      {
        title: "Authorization Status Mix (CO)",
        table: {
          headers: ["Status", "Number of Authorizations", "Percentage"],
          rows: [
            ["Approved", "5,221", "88.52%"],
            ["Partial", "485", "8.22%"],
            ["Not Approved", "138", "2.34%"],
            ["No Decision", "52", "0.88%"],
            ["Total", "5,898", "100%"],
          ],
        },
      },
      {
        title: "Approval Details",
        description: "Of the 5,221 approved authorizations:",
        table: {
          headers: ["Approval Type", "Count", "Percentage of Approved"],
          rows: [
            ["Medical Necessity Approvals", "5,113", "97.93%"],
            ["Administrative Approvals", "8", "0.15%"],
            ["Total Approved", "5,221", "100%"],
          ],
        },
      },
      {
        title: "Denial and Appeal Summary",
        description: "Of the 138 denied authorizations:",
        table: {
          headers: ["Category", "Count", "Percentage"],
          rows: [
            ["Appealed", "18", "13.04%"],
            ["– Overturned", "3", "2.17%"],
            ["– Upheld", "15", "10.87%"],
            ["Not Appealed", "120", "86.96%"],
            ["Total Denied", "138", "100%"],
          ],
        },
      },
    ],
  },
};

// DRG Drivers structured data
const DEEP_DIVE_DRG_DATA = {
  title: "Top DRG Drivers – At a Glance",
  sections: [
    {
      title: "Highest Volume DRG",
      content:
        "Vaginal Delivery without Sterilization or D&C without CC/MCC – 4,093 auths (2.89%)",
    },
    {
      title: "OB Dominance",
      content:
        "All Vaginal Delivery and Cesarean Section DRGs are 100% IP OB Delivery / Newborn–driven",
    },
    {
      title: "Medical Necessity Review (MN)",
      items: [
        "Lowest MN mix: Vaginal Delivery without CC/MCC (24.65%)",
        "Highest MN mix: Ungroupable (79.67%)",
      ],
    },
    {
      title: "Approval Rates",
      items: [
        "Range from 76.64% to 87.96% across DRGs",
        "Majority of approvals are Medical Necessity–based (≈52%–99%)",
      ],
    },
    {
      title: "Denials & Appeals",
      items: [
        "Denial rates are low (≈1.5%–2.8%)",
        "Appeals are minimal and rarely overturned",
      ],
    },
    {
      title: "Operational Watchlist",
      content:
        "Ungroupable DRG stands out due to high MN review (79.67%) and highest appeal rate (33.33%)",
    },
  ],
};

// Top Providers structured data
const DEEP_DIVE_TOP_PROVIDERS_DATA = {
  title: "Top Provider Drivers – Snapshot",
  sections: [
    {
      title: "Top Volume Provider",
      content: "CedarsSinai Medical Center – 912 auths (0.64%)",
    },
    {
      title: "Approval Performance",
      items: [
        "All providers show strong approval rates, ranging from 79.65% to 94.79%",
        "Denials remain low (≤4%) across all providers",
      ],
    },
    {
      title: "Medical Necessity (MN) Review Mix",
      items: [
        "Highest MN mix: CedarsSinai (82.89%) and John Peter Smith (80.15%)",
        "Lowest MN mix: Emory Hillandale (14.91%) and Grady (17.64%)",
      ],
    },
    {
      title: "Service Driver Trend",
      items: [
        "IP Medical/Surgical dominates all providers (64%–96%)",
        "IP OB Delivery is moderate; IP BH is minimal to low",
      ],
    },
    {
      title: "Denials & Appeals",
      items: [
        "Appeals are rare and no overturned cases observed",
        "Only CedarsSinai shows minor appeal activity (2 upheld)",
      ],
    },
    {
      title: "Operational Watchpoints",
      items: [
        "CedarsSinai & John Peter Smith: High MN review burden",
        "Grady Memorial: Elevated partial rate (18.41%) compared to peers",
      ],
    },
  ],
};

// KPI Configuration for dynamic rendering
const KPI_CONFIG: Record<
  string,
  {
    label: string;
    icon: any;
    color: string;
    bgColor: string;
    borderColor?: string;
  }
> = {
  pmpm_paid: {
    label: "Paid PMPM",
    icon: DollarSign,
    color: "#231E33",
    bgColor: "#D9F5F5",
  },
  pmpm_allowed: {
    label: "Allowed PMPM",
    icon: DollarSign,
    color: "#231E33",
    bgColor: "#E1EDFF",
  },
  admits_per_1000: {
    label: "Admits/K",
    icon: Users,
    color: "#231E33",
    bgColor: "#E3F4FD",
  },
  allowed_cost_per_admit: {
    label: "Cost/Admit",
    icon: DollarSign,
    color: "#231E33",
    bgColor: "#FBEAE7",
  },
  cmi: { label: "CMI", icon: Calculator, color: "#231E33", bgColor: "#B2EBEA" },
  oon_percentage: {
    label: "OON %",
    icon: Network,
    color: "#231E33",
    bgColor: "#F7D5CF",
  },
  prior_auth_pmpm: {
    label: "Prior Auth PMPM",
    icon: DollarSign,
    color: "#231E33",
    bgColor: "#C7EAFB",
  },
  auth_per_1000: {
    label: "Auth per K",
    icon: Users,
    color: "#231E33",
    bgColor: "#D9F5F5",
  },
  cost_per_admit: {
    label: "Cost per Admit",
    icon: DollarSign,
    color: "#231E33",
    bgColor: "#E1EDFF",
  },
  auth_count: {
    label: "Approved Auth Count",
    icon: FileBarChart,
    color: "#231E33",
    bgColor: "#E3F4FD",
  },
  auth_claim_count: {
    label: "Auth Claim Count",
    icon: FileBarChart,
    color: "#231E33",
    bgColor: "#FBEAE7",
  },
  // OON Category Metrics
  NPAR_CLAIMS_PER_K: {
    label: "OON Claims per K",
    icon: Network,
    color: "#231E33",
    bgColor: "#B2EBEA",
  },
  PMPM_RATIO: {
    label: "OON PMPM Ratio",
    icon: Calculator,
    color: "#231E33",
    bgColor: "#F7D5CF",
  },
  NPAR_CLAIM_COUNT: {
    label: "OON Claim Count",
    icon: FileBarChart,
    color: "#231E33",
    bgColor: "#C7EAFB",
  },
  NPAR_PAID_AMT: {
    label: "OON Paid Amount",
    icon: DollarSign,
    color: "#231E33",
    bgColor: "#D9F5F5",
  },
  OVERALL_PMPM: {
    label: "Overall PMPM",
    icon: DollarSign,
    color: "#231E33",
    bgColor: "#E1EDFF",
  },
  NPAR_PAID_PMPM: {
    label: "OON Paid PMPM",
    icon: DollarSign,
    color: "#231E33",
    bgColor: "#E3F4FD",
  },
  NPAR_ALWD_PMPM: {
    label: "OON Allowed PMPM",
    icon: DollarSign,
    color: "#231E33",
    bgColor: "#FBEAE7",
  },
};

// Function to get or generate KPI config for any metric
function getKPIConfig(kpiKey: string): {
  label: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor?: string;
} {
  // Return existing config if available
  if (KPI_CONFIG[kpiKey]) {
    return KPI_CONFIG[kpiKey];
  }

  // Generate config for unknown metrics - using color palette with alternating backgrounds
  const colors = [
    "#231E33",
    "#231E33",
    "#231E33",
    "#231E33",
    "#231E33",
    "#231E33",
  ];
  const bgColors = [
    "#D9F5F5",
    "#E1EDFF",
    "#E3F4FD",
    "#FBEAE7",
    "#B2EBEA",
    "#F7D5CF",
    "#C7EAFB",
  ];
  const hashCode = kpiKey
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorIndex = hashCode % colors.length;

  // Determine icon based on metric name
  let icon = FileBarChart; // default
  const lowerKey = kpiKey.toLowerCase();
  if (
    lowerKey.includes("pmpm") ||
    lowerKey.includes("cost") ||
    lowerKey.includes("dollar") ||
    lowerKey.includes("amount")
  ) {
    icon = DollarSign;
  } else if (
    lowerKey.includes("per_k") ||
    lowerKey.includes("per k") ||
    lowerKey.includes("admits") ||
    lowerKey.includes("auth") ||
    lowerKey.includes("claims")
  ) {
    icon = Users;
  } else if (
    lowerKey.includes("percentage") ||
    lowerKey.includes("network") ||
    lowerKey.includes("oon") ||
    lowerKey.includes("ratio")
  ) {
    icon = Network;
  } else if (lowerKey.includes("index") || lowerKey.includes("cmi")) {
    icon = Calculator;
  }

  // Format label: convert snake_case to Title Case
  const label = kpiKey
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
    .trim();

  const bgColor = bgColors[colorIndex % bgColors.length];

  return {
    label,
    icon,
    color: colors[0],
    bgColor,
    borderColor: undefined,
  };
}

interface Note {
  id: string;
  user: string;
  content: string;
  timestamp: string;
  timePeriod: string; // '3M', '6M', '12M', 'YTD'
}

export default function InsightModal({
  card,
  isOpen,
  onClose,
  onChatWithCard,
  isFavorite,
  onFavoriteToggle,
}: InsightModalProps) {
  const [selectedTimeSeries, setSelectedTimeSeries] =
    useState<TimeSeriesKey>("rolling_3");

  const [isActionsExpanded, setIsActionsExpanded] = useState(false);
  const [isVisualAnalysisExpanded, setIsVisualAnalysisExpanded] =
    useState(false);
  const [isDetailedBreakdownsExpanded, setIsDetailedBreakdownsExpanded] =
    useState(false);
  const [isDeepDiveCollapsed, setIsDeepDiveCollapsed] = useState(true);
  const [deepDiveTab, setDeepDiveTab] = useState<
    "state" | "drg_drivers" | "top_providers"
  >("state");
  const [selectedState, setSelectedState] = useState<string>("ME");
  const [activeKpiTab, setActiveKpiTab] = useState<
    | "auth_claim_count"
    | "cost_per_admit"
    | "prior_auth_pmpm"
    | "auths_per_k"
    | "admits_per_k"
  >("auth_claim_count");
  const [newNote, setNewNote] = useState("");
  const [allNotes, setAllNotes] = useState<Note[]>([
    {
      id: "1",
      user: "Sarah Johnson",
      content:
        "This trend aligns with our Q4 projections. We should prioritize this for next sprint.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      timePeriod: "3M",
    },
    {
      id: "2",
      user: "Mike Chen",
      content:
        "I've reviewed the data sources. Confidence level is high. Recommend immediate action.",
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
      timePeriod: "3M",
    },
    {
      id: "3",
      user: "Sarah Johnson",
      content:
        "Looking at the 6-month trend, this pattern has been consistent since Q2. Strategic implications are significant.",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
      timePeriod: "6M",
    },
    {
      id: "4",
      user: "Alex Rivera",
      content:
        "6M data shows seasonal variations we missed in shorter timeframes. This changes our approach.",
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
      timePeriod: "6M",
    },
  ]);

  if (!isOpen) return null;

  // Get current time period label
  const getCurrentTimePeriod = () => {
    return selectedTimeSeries === "rolling_3"
      ? "3M"
      : selectedTimeSeries === "rolling_6"
        ? "6M"
        : selectedTimeSeries === "rolling_12"
          ? "12M"
          : "YTD";
  };

  // Filter notes for current time period
  const notes = allNotes.filter(
    (note) => note.timePeriod === getCurrentTimePeriod(),
  );

  // Helper functions for notes
  const handleAddNote = () => {
    if (newNote.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        user: "Current User", // In real app, get from auth context
        content: newNote.trim(),
        timestamp: new Date().toISOString(),
        timePeriod: getCurrentTimePeriod(),
      };
      setAllNotes((prev) => [...prev, note]);
      setNewNote("");
    }
  };

  const formatNoteTime = (timestamp: string) => {
    const now = new Date();
    const noteTime = new Date(timestamp);
    const diffMs = now.getTime() - noteTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return noteTime.toLocaleDateString();
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Format YYYYMM to readable date (e.g., "202601" -> "Jan 2026")
  const formatSnapDate = (snapDate: string): string => {
    if (!snapDate || snapDate.length !== 6) return snapDate;
    const year = snapDate.substring(0, 4);
    const month = snapDate.substring(4, 6);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthIndex = parseInt(month, 10) - 1;
    return `${monthNames[monthIndex]} ${year}`;
  };

  // Condense date range (e.g., "Oct, Sep, Aug 2025" -> "Oct-Aug 2025")
  const condenseDateRange = (dateRange: string): string => {
    if (!dateRange) return dateRange;
    const parts = dateRange.split(",").map((p) => p.trim());
    if (parts.length < 2) return dateRange;
    const firstMonth = parts[0];
    const lastPart = parts[parts.length - 1];
    const lastMonthMatch = lastPart.match(/^([A-Za-z]+)\s+(\d{4})$/);
    if (lastMonthMatch) {
      return `${firstMonth}-${lastMonthMatch[1]} ${lastMonthMatch[2]}`;
    }
    return dateRange;
  };

  const Icon =
    card.category.toLowerCase().includes("cost") ||
    card.category.toLowerCase().includes("financial")
      ? TrendingUp
      : card.category.toLowerCase().includes("utilization")
        ? Activity
        : AlertCircle;

  const isRealData = card.data_source === "production";

  // Preprocess single-line API markdown into multi-line
  const preprocessDeepDiveText = (text: string): string => {
    let str = text
      .replace(/^\\*"*/, "")
      .replace(/"*\\*$/, "")
      .replace(/\\"/g, '"')
      .trim();
    str = str.replace(/ ###/g, "\n\n###");
    str = str.replace(/\*\*###/g, "**\n\n###");
    str = str.replace(/\)###/g, ")\n\n###");
    str = str.replace(/\.###/g, ".\n\n###");
    str = str.replace(/ ##/g, "\n\n##");
    str = str.replace(/\*\*##/g, "**\n\n##");
    str = str.replace(/\)##/g, ")\n\n##");
    str = str.replace(/\.##/g, ".\n\n##");
    if (!str.startsWith("#")) {
      str = str.replace(/^(.+?)(#\s)/, "$1\n\n$2");
    }
    str = str.replace(/ - \*\*/g, "\n- **");
    str = str.replace(/ (\d+)\. \*\*/g, "\n$1. **");
    str = str.replace(/ \*\*([A-Z])/g, "\n**$1");
    str = str.replace(/\)\*\*([A-Z])/g, ")\n**$1");
    str = str.replace(/\.\*\*([A-Z])/g, ".\n**$1");
    str = str.replace(/([a-z])\*\*([A-Z])/g, "$1\n**$2");
    // Split non-bold bullets: sentence-end + space-dash-space
    str = str.replace(/([.!?]) - /g, "$1\n- ");
    // Split non-bold numbered items: sentence-end + space + digit-dot-space
    str = str.replace(/([.!?]) (\d+)\. /g, "$1\n$2. ");
    str = str.replace(/\n{4,}/g, "\n\n");
    return str.trim();
  };

  // Render a single content line as JSX based on its markdown type
  const renderContentLine = (line: string, lineKey: number) => {
    // ### Subsection header
    if (line.startsWith("### ")) {
      return (
        <Typography
          key={lineKey}
          sx={{
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "#1A3673",
            marginTop: 2,
            marginBottom: 1,
          }}
        >
          {line.replace(/^###\s*/, "").replace(/\*\*/g, "")}
        </Typography>
      );
    }

    // Bullet point
    if (line.startsWith("- ")) {
      return (
        <Typography
          key={lineKey}
          component="div"
          sx={{
            fontSize: "0.875rem",
            color: "#374151",
            lineHeight: 1.7,
            paddingLeft: 2,
            marginBottom: 0.75,
            position: "relative",
            "&::before": {
              content: '"•"',
              position: "absolute",
              left: 0,
              color: "#44B8F3",
            },
          }}
        >
          {renderFormattedText(line.replace(/^-\s*/, ""))}
        </Typography>
      );
    }

    // Numbered list
    if (/^\d+\.\s+/.test(line)) {
      return (
        <Typography
          key={lineKey}
          component="div"
          sx={{
            fontSize: "0.875rem",
            color: "#374151",
            lineHeight: 1.7,
            paddingLeft: 3,
            marginBottom: 0.75,
            textIndent: "-1.5em",
          }}
        >
          {renderFormattedText(line)}
        </Typography>
      );
    }

    // Key-value pair
    if (line.startsWith("**")) {
      const match =
        line.match(/^\*\*([^*]+):\*\*\s*(.+)$/) ||
        line.match(/^\*\*([^*]+)\*\*:\s*(.+)$/);
      if (match) {
        const [, label, value] = match;
        return (
          <Typography
            key={lineKey}
            sx={{
              fontSize: "0.875rem",
              color: "#374151",
              lineHeight: 1.7,
              marginBottom: 0.5,
            }}
          >
            <Typography
              component="span"
              sx={{ fontWeight: 600, color: "#1A3673" }}
            >
              {label}:
            </Typography>{" "}
            {renderFormattedText(value)}
          </Typography>
        );
      }
    }

    // Bold standalone
    if (/^\*\*[^*]+\*\*$/.test(line)) {
      return (
        <Typography
          key={lineKey}
          sx={{
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "#1A3673",
            marginTop: 1.5,
            marginBottom: 0.5,
          }}
        >
          {line.replace(/\*\*/g, "")}
        </Typography>
      );
    }

    // Regular text
    return (
      <Typography
        key={lineKey}
        sx={{
          fontSize: "0.875rem",
          color: "#374151",
          lineHeight: 1.7,
          marginBottom: 0.5,
        }}
      >
        {renderFormattedText(line)}
      </Typography>
    );
  };

  // Multi-layout deep dive parser — auto-detects structure and groups into visual sections
  const parseDeepDiveReport = (text: string) => {
    const preprocessed = preprocessDeepDiveText(text);
    const lines = preprocessed
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    if (lines.length === 0) return null;

    // Group lines into sections by # and ## headers
    type Section = { title?: string; level?: number; lines: string[] };
    const sections: Section[] = [];
    let current: Section = { lines: [] };

    for (const line of lines) {
      if (/^# [^#]/.test(line)) {
        if (current.lines.length > 0 || current.title) sections.push(current);
        current = {
          title: line.replace(/^#\s*/, "").replace(/\*\*/g, ""),
          level: 1,
          lines: [],
        };
      } else if (line.startsWith("## ")) {
        if (current.lines.length > 0 || current.title) sections.push(current);
        current = {
          title: line.replace(/^##\s*/, "").replace(/\*\*/g, ""),
          level: 2,
          lines: [],
        };
      } else {
        current.lines.push(line);
      }
    }
    if (current.lines.length > 0 || current.title) sections.push(current);

    // NARRATIVE LAYOUT — no headers detected, render as clean flowing text
    const hasStructure = sections.some((s) => s.title);
    if (!hasStructure) {
      return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          {lines.map((line, i) => renderContentLine(line, i))}
        </Box>
      );
    }

    // STRUCTURED / MULTI-SECTION LAYOUT
    const elements: any[] = [];
    let key = 0;
    let sectionIdx = 0;

    sections.forEach((section) => {
      // Report title (# level)
      if (section.title && section.level === 1) {
        elements.push(
          <Box key={key++} sx={{ marginBottom: 3 }}>
            <Typography
              sx={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "#1A3673",
                letterSpacing: "-0.01em",
              }}
            >
              {section.title}
            </Typography>
            <Box
              sx={{
                width: 40,
                height: "3px",
                background: "linear-gradient(to right, #1A3673, #44B8F3)",
                borderRadius: 2,
                marginTop: 1,
              }}
            />
          </Box>,
        );
        if (section.lines.length > 0) {
          elements.push(
            <Box
              key={key++}
              sx={{
                marginBottom: 2,
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
              }}
            >
              {section.lines.map((line, i) =>
                renderContentLine(line, key * 1000 + i),
              )}
            </Box>,
          );
        }
      }
      // Section card (## level)
      else if (section.title && section.level === 2) {
        const sectionNumber = (sectionIdx + 1).toString().padStart(2, "0");
        sectionIdx++;
        elements.push(
          <Box
            key={key++}
            sx={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E1EDFF",
              borderLeft: "4px solid #1A3673",
              borderRadius: "8px",
              padding: 2.5,
              marginBottom: 1.5,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "baseline",
                gap: 1.5,
                marginBottom: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  color: "#6A97DF",
                  letterSpacing: "0.08em",
                  lineHeight: 1,
                  flexShrink: 0,
                }}
              >
                {sectionNumber}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.9375rem",
                  fontWeight: 700,
                  color: "#1A3673",
                  letterSpacing: "-0.015em",
                }}
              >
                {section.title}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              {section.lines.map((line, i) =>
                renderContentLine(line, key * 1000 + i),
              )}
            </Box>
          </Box>,
        );
      }
      // Preamble (no title) — text before first header
      else if (section.lines.length > 0) {
        const isShortPreamble =
          section.lines.length <= 3 &&
          !section.lines.some((l) => l.startsWith("- ") || /^\d+\./.test(l));

        if (isShortPreamble) {
          elements.push(
            <Box
              key={key++}
              sx={{
                borderLeft: "3px solid #44B8F3",
                backgroundColor: "#E3F4FD",
                paddingLeft: 2,
                paddingRight: 1.5,
                marginBottom: 2.5,
                paddingY: 1,
                borderRadius: "0 6px 6px 0",
              }}
            >
              {section.lines.map((line, i) => (
                <Typography
                  key={key * 1000 + i}
                  sx={{
                    fontSize: "0.875rem",
                    color: "#1A3673",
                    lineHeight: 1.75,
                  }}
                >
                  {renderFormattedText(line)}
                </Typography>
              ))}
            </Box>,
          );
        } else {
          elements.push(
            <Box
              key={key++}
              sx={{
                marginBottom: 2,
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
              }}
            >
              {section.lines.map((line, i) =>
                renderContentLine(line, key * 1000 + i),
              )}
            </Box>,
          );
        }
      }
      key++;
    });

    return <>{elements}</>;
  };

  // Function to format inline text (bold, etc.)
  const formatInlineText = (text: string) => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    // Match bold text **text** or __text__
    const boldRegex = /\*\*(.+?)\*\*|__(.+?)__/g;
    let match;

    while ((match = boldRegex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      // Add bold text
      const boldText = match[1] || match[2];
      parts.push(
        <strong key={match.index} style={{ fontWeight: 600, color: "#1A3673" }}>
          {boldText}
        </strong>,
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  // Function to format Key Insights text with structure
  const formatInsightText = (text: string) => {
    if (!text) return null;

    // Replace literal \n with actual newlines
    const normalizedText = text.replace(/\\n/g, "\n");
    const lines = normalizedText.split("\n");
    const elements: React.ReactNode[] = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      if (!trimmedLine) {
        // Skip empty lines
        return;
      }

      // Check for bullet points (-, •, *)
      const bulletMatch = line.match(/^[\s]*[-•*]\s+(.+)$/);
      if (bulletMatch) {
        elements.push(
          <Box
            key={index}
            sx={{ display: "flex", gap: 1, mb: 0.5, alignItems: "flex-start" }}
          >
            <Typography
              component="span"
              sx={{ color: "#1A3673", fontWeight: 600, minWidth: "16px" }}
            >
              •
            </Typography>
            <Typography
              component="span"
              sx={{
                fontSize: "0.875rem",
                color: "#1F2937",
                lineHeight: 1.6,
                flex: 1,
              }}
            >
              {formatInlineText(bulletMatch[1])}
            </Typography>
          </Box>,
        );
        return;
      }

      // Check for numbered lists
      const numberMatch = line.match(/^[\s]*(\d+)\.\s+(.+)$/);
      if (numberMatch) {
        elements.push(
          <Box
            key={index}
            sx={{ display: "flex", gap: 1, mb: 0.5, alignItems: "flex-start" }}
          >
            <Typography
              component="span"
              sx={{ color: "#1A3673", fontWeight: 600, minWidth: "24px" }}
            >
              {numberMatch[1]}.
            </Typography>
            <Typography
              component="span"
              sx={{
                fontSize: "0.875rem",
                color: "#1F2937",
                lineHeight: 1.6,
                flex: 1,
              }}
            >
              {formatInlineText(numberMatch[2])}
            </Typography>
          </Box>,
        );
        return;
      }

      // Check for headings (lines ending with :)
      if (trimmedLine.endsWith(":") && trimmedLine.length < 100) {
        elements.push(
          <Typography
            key={index}
            sx={{
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#1A3673",
              mb: 0.75,
              mt: index > 0 ? 1 : 0,
            }}
          >
            {trimmedLine}
          </Typography>,
        );
        return;
      }

      // Regular paragraph
      elements.push(
        <Typography
          key={index}
          sx={{
            fontSize: "0.875rem",
            color: "#1F2937",
            lineHeight: 1.6,
            mb: 0.5,
          }}
        >
          {formatInlineText(trimmedLine)}
        </Typography>,
      );
    });

    return <Box>{elements}</Box>;
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        backdropFilter: "blur(2px)",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#FFFFFF",
          borderRadius: "14px",
          boxShadow:
            "0 24px 64px rgba(10,20,50,0.18), 0 2px 8px rgba(10,20,50,0.06)",
          maxWidth: "980px",
          width: "100%",
          maxHeight: "90vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          outline: "none",
        }}
      >
        {/* ── HEADER ── */}
        <Box
          sx={{
            backgroundColor: "#FFFFFF",
            borderBottom: "1px solid #E5E7EB",
            px: "20px",
            pt: "14px",
            pb: 0,
            flexShrink: 0,
          }}
        >
          {/* Top row: icon + title + category tag + meta chips + close */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: "12px",
            }}
          >
            {/* Left: icon badge + title + category tag */}
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  backgroundColor: "#E8EFF9",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <LayoutDashboard size={15} color="#1A3673" />
              </Box>
              <Typography
                sx={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#0F172A",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.3,
                }}
              >
                {card.title}
              </Typography>
              {card.category && (
                <Box
                  sx={{
                    fontSize: "11px",
                    fontWeight: 500,
                    color: "#1A3673",
                    backgroundColor: "#E8EFF9",
                    px: "8px",
                    py: "2px",
                    borderRadius: "20px",
                    lineHeight: 1.6,
                    flexShrink: 0,
                  }}
                >
                  {card.category}
                </Box>
              )}
            </Box>

            {/* Right: meta chips + close */}
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {/* Meta chips */}
              {(card.incurred_month_end || card.snap_date) && (
                <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {card.incurred_month_end && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        backgroundColor: "#F8FAFC",
                        border: "0.5px solid #E5E7EB",
                        borderRadius: "20px",
                        px: "10px",
                        py: "3px",
                        fontSize: "11.5px",
                        color: "#6B7280",
                      }}
                    >
                      Period{" "}
                      <Box
                        component="span"
                        sx={{ color: "#374151", fontWeight: 500 }}
                      >
                        {condenseDateRange(card.incurred_month_end)}
                      </Box>
                    </Box>
                  )}
                  {card.snap_date && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        backgroundColor: "#F8FAFC",
                        border: "0.5px solid #E5E7EB",
                        borderRadius: "20px",
                        px: "10px",
                        py: "3px",
                        fontSize: "11.5px",
                        color: "#6B7280",
                      }}
                    >
                      Snapshot{" "}
                      <Box
                        component="span"
                        sx={{ color: "#374151", fontWeight: 500 }}
                      >
                        {formatSnapDate(card.snap_date)}
                      </Box>
                    </Box>
                  )}
                </Box>
              )}

              {/* Close button */}
              <Box
                onClick={onClose}
                sx={{
                  width: 30,
                  height: 30,
                  border: "none",
                  backgroundColor: "transparent",
                  borderRadius: "6px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#6B7280",
                  transition: "background .15s, color .15s",
                  "&:hover": { backgroundColor: "#F3F4F6", color: "#0F172A" },
                }}
              >
                <X size={16} />
              </Box>
            </Box>
          </Box>

          {/* Bottom row: nav tabs (left) + segmented time control (right) */}
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}
          >
            {/* Nav tabs */}
            <Box sx={{ display: "flex" }}>
              {["Overview", "Deep Dive", "Patterns", "Actions"].map((tab) => (
                <Box
                  key={tab}
                  sx={{
                    fontSize: "13px",
                    fontWeight: tab === "Overview" ? 600 : 500,
                    color: tab === "Overview" ? "#1A3673" : "#6B7280",
                    px: "16px",
                    py: "8px",
                    cursor: "default",
                    borderBottom:
                      tab === "Overview"
                        ? "2px solid #1A3673"
                        : "2px solid transparent",
                    transition: "all .18s",
                    whiteSpace: "nowrap",
                    userSelect: "none",
                    "&:hover":
                      tab !== "Overview"
                        ? { color: "#374151", backgroundColor: "#F8FAFC" }
                        : {},
                  }}
                >
                  {tab}
                </Box>
              ))}
            </Box>

            {/* Segmented time control */}
            <Box
              sx={{
                display: "flex",
                backgroundColor: "#F1F5F9",
                borderRadius: "6px",
                padding: "3px",
                gap: "2px",
                mb: "2px",
              }}
            >
              {(
                [
                  ["rolling_3", "3M"],
                  ["rolling_6", "6M"],
                  ["rolling_12", "12M"],
                  ["ytd", "YTD"],
                ] as [TimeSeriesKey, string][]
              ).map(([ts, label]) => (
                <Box
                  key={ts}
                  onClick={() => setSelectedTimeSeries(ts)}
                  sx={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "11px",
                    fontWeight: selectedTimeSeries === ts ? 600 : 500,
                    px: "12px",
                    py: "4px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    color:
                      selectedTimeSeries === ts ? "#1A3673" : "#6B7280",
                    backgroundColor:
                      selectedTimeSeries === ts ? "#FFFFFF" : "transparent",
                    boxShadow:
                      selectedTimeSeries === ts
                        ? "0 1px 3px rgba(0,0,0,0.1), 0 0 0 0.5px #E5E7EB"
                        : "none",
                    transition: "all .18s",
                    letterSpacing: "0.02em",
                    userSelect: "none",
                    "&:hover":
                      selectedTimeSeries !== ts
                        ? { color: "#374151", backgroundColor: "rgba(255,255,255,0.5)" }
                        : {},
                  }}
                >
                  {label}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* ── BODY ── */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            backgroundColor: "#F4F6FA",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            "&::-webkit-scrollbar": { width: "5px" },
            "&::-webkit-scrollbar-track": { background: "transparent" },
            "&::-webkit-scrollbar-thumb": {
              background: "#D1D5DB",
              borderRadius: "10px",
            },
          }}
        >
          {/* ── KPI GRID ── */}
          {(() => {
            const tsForPeriod = card.time_series?.[selectedTimeSeries];
            const currentKPIs =
              tsForPeriod && Object.keys(tsForPeriod).length > 0
                ? tsForPeriod
                : card.kpis;

            const variance =
              selectedTimeSeries === "rolling_3"
                ? (card.time_series as any)?.variance_rolling_3 ||
                  card.time_series?.variance
                : selectedTimeSeries === "rolling_6"
                  ? (card.time_series as any)?.variance_rolling_6 ||
                    card.time_series?.variance
                  : selectedTimeSeries === "rolling_12"
                    ? (card.time_series as any)?.variance_rolling_12 ||
                      card.time_series?.variance
                    : selectedTimeSeries === "ytd"
                      ? (card.time_series as any)?.variance_ytd ||
                        card.time_series?.variance
                      : card.time_series?.variance;

            const CATEGORY_KPI_ORDER: Record<string, string[]> = {
              "IP Med/Surg": [
                "pmpm_paid",
                "admits_per_1000",
                "pmpm_allowed",
                "allowed_cost_per_admit",
                "cmi",
                "oon_percentage",
              ],
              "IP Auth": [
                "prior_auth_pmpm",
                "auth_per_1000",
                "admits_per_1000",
                "cost_per_admit",
                "auth_count",
                "auth_claim_count",
              ],
              "OON Network": [
                "npar_pmpm_ratio",
                "npar_claims_per_1000",
                "npar_pmpm",
                "npar_claim_amount",
                "npar_claim_count",
                "npar_allowed_pmpm",
              ],
              OON: [
                "npar_pmpm_ratio",
                "npar_claims_per_1000",
                "npar_pmpm",
                "npar_claim_amount",
                "npar_claim_count",
                "npar_allowed_pmpm",
              ],
              "Network Management": [
                "npar_pmpm_ratio",
                "npar_claims_per_1000",
                "npar_pmpm",
                "npar_claim_amount",
                "npar_claim_count",
                "npar_allowed_pmpm",
              ],
            };
            const preferredOrder = CATEGORY_KPI_ORDER[card.category] || [];
            const allKpiKeys = Object.keys(currentKPIs || {});
            const filteredKeys = allKpiKeys.filter(
              (key) =>
                !key.toLowerCase().includes("emerging") &&
                !key.toLowerCase().includes("emerg") &&
                !key.toLowerCase().includes("emerging_admits"),
            );
            const kpiKeys = [...filteredKeys].sort((a, b) => {
              const ia = preferredOrder.indexOf(a);
              const ib = preferredOrder.indexOf(b);
              if (ia === -1 && ib === -1) return 0;
              if (ia === -1) return 1;
              if (ib === -1) return -1;
              return ia - ib;
            });

            if (kpiKeys.length === 0) return null;

            // KPI icon color tokens aligned to brand palette
            const kpiColorTokens: Record<string, { bg: string; iconColor: string }> = {
              pmpm_paid:              { bg: "#E1EDFF", iconColor: "#1A3673" },
              pmpm_allowed:           { bg: "#D9F5F5", iconColor: "#0E8080" },
              admits_per_1000:        { bg: "#E3F4FD", iconColor: "#0284C7" },
              allowed_cost_per_admit: { bg: "#FBEAE7", iconColor: "#B45309" },
              cmi:                    { bg: "#B2EBEA", iconColor: "#065F46" },
              oon_percentage:         { bg: "#F7D5CF", iconColor: "#9333EA" },
              prior_auth_pmpm:        { bg: "#E1EDFF", iconColor: "#1A3673" },
              auth_per_1000:          { bg: "#D9F5F5", iconColor: "#0E8080" },
              cost_per_admit:         { bg: "#FBEAE7", iconColor: "#B45309" },
              auth_count:             { bg: "#E3F4FD", iconColor: "#0284C7" },
              auth_claim_count:       { bg: "#FBEAE7", iconColor: "#B45309" },
              npar_pmpm_ratio:        { bg: "#F7D5CF", iconColor: "#9333EA" },
              npar_claims_per_1000:   { bg: "#B2EBEA", iconColor: "#065F46" },
              npar_pmpm:              { bg: "#E1EDFF", iconColor: "#1A3673" },
              npar_claim_amount:      { bg: "#D9F5F5", iconColor: "#0E8080" },
              npar_claim_count:       { bg: "#E3F4FD", iconColor: "#0284C7" },
              npar_allowed_pmpm:      { bg: "#FBEAE7", iconColor: "#B45309" },
            };

            return (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${Math.min(kpiKeys.length, 6)}, 1fr)`,
                  gap: "10px",
                }}
              >
                {kpiKeys.map((kpiKey) => {
                  const config = getKPIConfig(kpiKey);
                  const value = currentKPIs[kpiKey];
                  const varianceKey = `${kpiKey}_pct`;
                  const varianceValue = variance?.[varianceKey];
                  const token = kpiColorTokens[kpiKey] || {
                    bg: "#E3F4FD",
                    iconColor: "#0284C7",
                  };
                  const isUp =
                    varianceValue && parseFloat(varianceValue) >= 0;
                  const IconComp = config.icon;

                  return (
                    <Box
                      key={kpiKey}
                      sx={{
                        backgroundColor: "#FFFFFF",
                        border: "0.5px solid #E5E7EB",
                        borderRadius: "10px",
                        padding: "12px 14px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                        transition: "box-shadow .18s",
                        "&:hover": {
                          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                        },
                      }}
                    >
                      {/* Icon + variance */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box
                          sx={{
                            width: 26,
                            height: 26,
                            backgroundColor: token.bg,
                            borderRadius: "6px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <IconComp size={13} color={token.iconColor} />
                        </Box>
                        {varianceValue && (
                          <Box
                            sx={{
                              fontFamily: "'DM Mono', monospace, monospace",
                              fontSize: "10px",
                              fontWeight: 500,
                              px: "5px",
                              py: "2px",
                              borderRadius: "4px",
                              backgroundColor: isUp ? "#FEF2F2" : "#ECFDF5",
                              color: isUp ? "#DC2626" : "#059669",
                            }}
                          >
                            {isUp ? "↑" : "↓"}{" "}
                            {Math.abs(parseFloat(varianceValue)).toFixed(1)}%
                          </Box>
                        )}
                      </Box>

                      {/* Value */}
                      <Typography
                        sx={{
                          fontFamily: "'DM Mono', monospace, monospace",
                          fontSize: "17px",
                          fontWeight: 500,
                          color: "#0F172A",
                          letterSpacing: "-0.02em",
                          lineHeight: 1,
                        }}
                      >
                        {value || "N/A"}
                      </Typography>

                      {/* Label */}
                      <Typography
                        sx={{
                          fontSize: "11px",
                          color: "#6B7280",
                          fontWeight: 400,
                          lineHeight: 1.3,
                        }}
                      >
                        {config.label}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            );
          })()}

          {/* ── KEY INSIGHTS CARD ── */}
          <Box
            sx={{
              backgroundColor: "#FFFFFF",
              border: "0.5px solid #E5E7EB",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            {/* Card header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                px: "16px",
                py: "12px",
                borderBottom: "0.5px solid #E5E7EB",
                background: "linear-gradient(to right, #E8EFF9, transparent)",
              }}
            >
              <TrendingUp size={14} color="#1A3673" />
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#1A3673",
                  lineHeight: 1,
                }}
              >
                Key Insights
              </Typography>
              <Box
                sx={{
                  fontSize: "10px",
                  fontWeight: 500,
                  px: "7px",
                  py: "2px",
                  borderRadius: "20px",
                  backgroundColor: "#E3F4FD",
                  color: "#0284C7",
                  ml: "auto",
                  lineHeight: 1.4,
                }}
              >
                ✦ AI Summary
              </Box>
            </Box>

            {/* Card body */}
            <Box sx={{ px: "16px", py: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {(() => {
                const periodInsight =
                  selectedTimeSeries === "rolling_3"
                    ? (card.time_series as any)?.key_insight_rolling_3
                    : selectedTimeSeries === "rolling_6"
                      ? (card.time_series as any)?.key_insight_rolling_6
                      : selectedTimeSeries === "rolling_12"
                        ? (card.time_series as any)?.key_insight_rolling_12
                        : selectedTimeSeries === "ytd"
                          ? (card.time_series as any)?.key_insight_ytd
                          : card.llm_summary;

                if (periodInsight) {
                  return formatInsightText(periodInsight);
                }
                if (card.insights && card.insights.length > 0) {
                  return card.insights.map((insight, i) => (
                    <Box
                      key={i}
                      sx={{ display: "flex", gap: "10px", alignItems: "flex-start" }}
                    >
                      <Box
                        sx={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          backgroundColor: "#44B8F3",
                          flexShrink: 0,
                          mt: "7px",
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: "13.5px",
                          color: "#374151",
                          lineHeight: 1.6,
                        }}
                      >
                        {insight}
                      </Typography>
                    </Box>
                  ));
                }
                return (
                  <Typography
                    sx={{
                      fontSize: "13px",
                      color: "#9CA3AF",
                      fontStyle: "italic",
                      textAlign: "center",
                      py: "8px",
                    }}
                  >
                    No insights available for this period.
                  </Typography>
                );
              })()}
            </Box>
          </Box>

          {/* ── DEEP DIVE CARD ── */}
          <Box
            sx={{
              backgroundColor: "#FFFFFF",
              border: "0.5px solid #E5E7EB",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            {/* Deep Dive Header Bar */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: "16px",
                py: "12px",
                borderBottom: "0.5px solid #E5E7EB",
                backgroundColor: "#F8FAFC",
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Box
                  sx={{
                    width: 26,
                    height: 26,
                    borderRadius: "6px",
                    backgroundColor: "#E1EDFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Sparkles size={13} style={{ color: "#1A3673" }} />
                </Box>
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#1A3673",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Deep Dive Analysis
                </Typography>
              </Stack>
              <Typography
                sx={{
                  fontSize: "11px",
                  color: "#9CA3AF",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                National Total: 141,851 auths
              </Typography>
            </Box>

            {/* Inner Tabs */}
            <Box
              sx={{
                display: "flex",
                borderBottom: "1px solid #E5E7EB",
                backgroundColor: "#F8FAFC",
                px: "16px",
              }}
            >
              {(
                [
                  { key: "state", label: "State" },
                  { key: "drg_drivers", label: "DRG Drivers" },
                  { key: "top_providers", label: "Top Providers" },
                ] as const
              ).map((tab) => (
                <Box
                  key={tab.key}
                  onClick={() => setDeepDiveTab(tab.key)}
                  sx={{
                    px: "14px",
                    py: "10px",
                    fontSize: "12px",
                    fontWeight: deepDiveTab === tab.key ? 600 : 400,
                    color:
                      deepDiveTab === tab.key ? "#1A3673" : "#6B7280",
                    borderBottom:
                      deepDiveTab === tab.key
                        ? "2px solid #44B8F3"
                        : "2px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    whiteSpace: "nowrap",
                    "&:hover": { color: "#1A3673" },
                  }}
                >
                  {tab.label}
                </Box>
              ))}
            </Box>

            {/* Tab Content */}
            <Box sx={{ px: "16px", py: "14px" }}>
              {/* ── STATE TAB ── */}
              {deepDiveTab === "state" && (
                <Box>
                  {/* State Pill Selector */}
                  <Stack direction="row" spacing={1} sx={{ mb: "14px" }}>
                    {Object.keys(DEEP_DIVE_STATE_DATA).map((stateKey) => (
                      <Box
                        key={stateKey}
                        onClick={() => setSelectedState(stateKey)}
                        sx={{
                          px: "12px",
                          py: "5px",
                          borderRadius: "20px",
                          fontSize: "11.5px",
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                          backgroundColor:
                            selectedState === stateKey
                              ? "#1A3673"
                              : "#F1F5F9",
                          color:
                            selectedState === stateKey
                              ? "#FFFFFF"
                              : "#64748B",
                          border:
                            selectedState === stateKey
                              ? "1px solid #1A3673"
                              : "1px solid #E2E8F0",
                          "&:hover": {
                            backgroundColor:
                              selectedState === stateKey
                                ? "#1A3673"
                                : "#E8EFF9",
                          },
                        }}
                      >
                        {stateKey}
                      </Box>
                    ))}
                  </Stack>

                  {/* State Overview Block */}
                  {DEEP_DIVE_STATE_DATA[selectedState] && (
                    <Box>
                      <Box
                        sx={{
                          borderLeft: "3px solid #1A3673",
                          backgroundColor: "#E8EFF9",
                          px: "12px",
                          py: "10px",
                          borderRadius: "0 6px 6px 0",
                          mb: "14px",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "12.5px",
                            color: "#374151",
                            lineHeight: 1.6,
                          }}
                        >
                          {DEEP_DIVE_STATE_DATA[selectedState].overview}
                        </Typography>
                      </Box>

                      {/* State Data Tables */}
                      {DEEP_DIVE_STATE_DATA[selectedState].sections.map(
                        (section, si) => (
                          <Box key={si} sx={{ mb: "16px" }}>
                            <Typography
                              sx={{
                                fontSize: "11.5px",
                                fontWeight: 600,
                                color: "#1A3673",
                                mb: "6px",
                                letterSpacing: "0.02em",
                              }}
                            >
                              {section.title}
                            </Typography>
                            {section.description && (
                              <Typography
                                sx={{
                                  fontSize: "11.5px",
                                  color: "#6B7280",
                                  mb: "6px",
                                  fontStyle: "italic",
                                }}
                              >
                                {section.description}
                              </Typography>
                            )}
                            <Box
                              component="table"
                              sx={{
                                width: "100%",
                                borderCollapse: "collapse",
                                fontSize: "12px",
                              }}
                            >
                              <Box component="thead">
                                <Box component="tr">
                                  {section.table.headers.map((h, hi) => (
                                    <Box
                                      key={hi}
                                      component="th"
                                      sx={{
                                        backgroundColor: "#F8FAFC",
                                        color: "#6B7280",
                                        fontWeight: 500,
                                        fontSize: "11.5px",
                                        textAlign: hi === 0 ? "left" : "right",
                                        px: "10px",
                                        py: "7px",
                                        borderBottom: "1px solid #E5E7EB",
                                      }}
                                    >
                                      {h}
                                    </Box>
                                  ))}
                                </Box>
                              </Box>
                              <Box component="tbody">
                                {section.table.rows.map((row, ri) => {
                                  const isTotal =
                                    String(row[0]).toLowerCase() === "total";
                                  return (
                                    <Box
                                      key={ri}
                                      component="tr"
                                      sx={{
                                        backgroundColor: isTotal
                                          ? "#F8FAFC"
                                          : ri % 2 === 0
                                            ? "#FFFFFF"
                                            : "#FAFBFC",
                                        "&:hover": {
                                          backgroundColor: "#F0F4FA",
                                        },
                                      }}
                                    >
                                      {row.map((cell, ci) => (
                                        <Box
                                          key={ci}
                                          component="td"
                                          sx={{
                                            color: "#374151",
                                            fontSize: "12.5px",
                                            fontWeight: isTotal ? 600 : 400,
                                            textAlign:
                                              ci === 0 ? "left" : "right",
                                            px: "10px",
                                            py: "7px",
                                            borderBottom:
                                              ri <
                                              section.table.rows.length - 1
                                                ? "0.5px solid #F0F4FA"
                                                : "none",
                                          }}
                                        >
                                          {cell}
                                        </Box>
                                      ))}
                                    </Box>
                                  );
                                })}
                              </Box>
                            </Box>
                          </Box>
                        )
                      )}
                    </Box>
                  )}
                </Box>
              )}

              {/* ── DRG DRIVERS TAB ── */}
              {deepDiveTab === "drg_drivers" && (
                <Box>
                  <Box
                    sx={{
                      borderLeft: "3px solid #1A3673",
                      backgroundColor: "#E8EFF9",
                      px: "12px",
                      py: "10px",
                      borderRadius: "0 6px 6px 0",
                      mb: "14px",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#1A3673",
                        mb: "4px",
                      }}
                    >
                      {DEEP_DIVE_DRG_DATA.title}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {DEEP_DIVE_DRG_DATA.sections.map((section, si) => (
                      <Box key={si}>
                        <Typography
                          sx={{
                            fontSize: "11.5px",
                            fontWeight: 600,
                            color: "#374151",
                            mb: "4px",
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {section.title}
                        </Typography>
                        {section.content && (
                          <Typography
                            sx={{ fontSize: "12.5px", color: "#374151", lineHeight: 1.6 }}
                          >
                            {section.content}
                          </Typography>
                        )}
                        {section.items && (
                          <Box
                            component="ul"
                            sx={{ m: 0, pl: "18px", listStyle: "disc" }}
                          >
                            {section.items.map((item, ii) => (
                              <Box
                                key={ii}
                                component="li"
                                sx={{
                                  fontSize: "12.5px",
                                  color: "#374151",
                                  lineHeight: 1.6,
                                  mb: "2px",
                                }}
                              >
                                {item}
                              </Box>
                            ))}
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* ── TOP PROVIDERS TAB ── */}
              {deepDiveTab === "top_providers" && (
                <Box>
                  <Box
                    sx={{
                      borderLeft: "3px solid #1A3673",
                      backgroundColor: "#E8EFF9",
                      px: "12px",
                      py: "10px",
                      borderRadius: "0 6px 6px 0",
                      mb: "14px",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#1A3673",
                        mb: "4px",
                      }}
                    >
                      {DEEP_DIVE_TOP_PROVIDERS_DATA.title}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {DEEP_DIVE_TOP_PROVIDERS_DATA.sections.map((section, si) => (
                      <Box key={si}>
                        <Typography
                          sx={{
                            fontSize: "11.5px",
                            fontWeight: 600,
                            color: "#374151",
                            mb: "4px",
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {section.title}
                        </Typography>
                        {section.content && (
                          <Typography
                            sx={{ fontSize: "12.5px", color: "#374151", lineHeight: 1.6 }}
                          >
                            {section.content}
                          </Typography>
                        )}
                        {section.items && (
                          <Box
                            component="ul"
                            sx={{ m: 0, pl: "18px", listStyle: "disc" }}
                          >
                            {section.items.map((item, ii) => (
                              <Box
                                key={ii}
                                component="li"
                                sx={{
                                  fontSize: "12.5px",
                                  color: "#374151",
                                  lineHeight: 1.6,
                                  mb: "2px",
                                }}
                              >
                                {item}
                              </Box>
                            ))}
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>

          {/* Coming Soon Footnote */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              py: "10px",
            }}
          >
            <Box sx={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: "#D1D5DB" }} />
            <Typography
              sx={{
                fontSize: "11px",
                color: "#9CA3AF",
                fontStyle: "italic",
              }}
            >
              Patterns, Detailed Breakdown, and Recommended Actions coming soon
            </Typography>
            <Box sx={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: "#D1D5DB" }} />
          </Box>
        </Box>

          {/* Notes Section */}
          {/* <Box sx={{ marginTop: 4 }}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ marginBottom: 2 }}
            >
              <MessageCircle size={20} style={{ color: "#1A3673" }} />
              <Typography
                variant="h2"
                sx={{ fontWeight: "bold", color: "#111827" }}
              >
                Notes ({getCurrentTimePeriod()} data)
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#6B7280",
                  backgroundColor: "#F3F4F6",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontSize: "0.75rem",
                }}
              >
                {notes.length} notes
              </Typography>
            </Stack> */}

          {/* Notes List */}
          {/* <Box sx={{ marginBottom: 3 }}>
              {notes.map((note) => (
                <Box
                  key={note.id}
                  sx={{
                    display: "flex",
                    gap: 2,
                    marginBottom: 2,
                    padding: 2,
                    backgroundColor: "#FAFBFC",
                    borderRadius: 2,
                    border: "1px solid #E5E7EB",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      backgroundColor: "#1A3673",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    {getUserInitials(note.user)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ marginBottom: 0.5 }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          color: "#111827",
                        }}
                      >
                        {note.user}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          color: "#6B7280",
                        }}
                      >
                        {formatNoteTime(note.timestamp)}
                      </Typography>
                    </Stack>
                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        color: "#374151",
                        lineHeight: 1.5,
                      }}
                    >
                      {note.content}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box> */}

          {/* Add Note Input - Compact Design */}
          {/* <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                padding: 1.5,
                backgroundColor: "#F8FAFC",
                borderRadius: "24px",
                border: "1px solid #E2E8F0",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#F1F5F9",
                  borderColor: "#CBD5E1",
                },
                "&:focus-within": {
                  backgroundColor: "white",
                  borderColor: "#1A3673",
                  boxShadow: "0 0 0 4px rgba(26, 54, 115, 0.08)",
                },
              }}
            >
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  backgroundColor: "#1A3673",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                }}
              >
                CU
              </Avatar>
              
              <TextField
                fullWidth
                placeholder="Add your note or comment..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddNote();
                  }
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    border: "none",
                    padding: 0,
                    fontSize: "0.875rem",
                    backgroundColor: "transparent",
                    "& fieldset": {
                      border: "none",
                    },
                    "& .MuiOutlinedInput-input": {
                      padding: "8px 0",
                      color: "#334155",
                      "&::placeholder": {
                        color: "#94A3B8",
                        opacity: 1,
                      },
                    },
                  },
                }}
              />
              
              <IconButton
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: newNote.trim() ? "#1A3673" : "#E2E8F0",
                  color: newNote.trim() ? "white" : "#94A3B8",
                  "&:hover": {
                    backgroundColor: newNote.trim() ? "#2861BB" : "#CBD5E1",
                    transform: newNote.trim() ? "scale(1.05)" : "none",
                  },
                  "&:disabled": {
                    backgroundColor: "#E2E8F0",
                    color: "#94A3B8",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <Send size={16} />
              </IconButton>
            </Box>
          </Box> */}

        {/* Footer Actions */}
        <Box
          sx={{
            borderTop: "1px solid #E5E7EB",
            backgroundColor: "#FFFFFF",
            padding: 1.25,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography sx={{ fontSize: "0.75rem", color: "#9CA3AF" }}>
              Last updated:{" "}
              {new Date(card.detected_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              onClick={onClose}
              sx={{
                paddingX: 2,
                paddingY: 0.625,
                background: "#1A3673",
                "&:hover": {
                  background: "#152A5C",
                },
                color: "white",
                fontSize: "0.813rem",
                fontWeight: 600,
                borderRadius: 1,
                textTransform: "none",
                transition: "all 0.2s ease",
                minHeight: "auto",
              }}
            >
              Close
            </Button>
            {onChatWithCard && (
              <Button
                disabled={true}
                onClick={() => {
                  onChatWithCard(card);
                  onClose();
                }}
                startIcon={<MessageCircle size={14} />}
                sx={{
                  paddingX: 2,
                  paddingY: 0.625,
                  backgroundColor: "#E5E7EB",
                  border: "2px dashed #D1D5DB",
                  color: "#9CA3AF",
                  fontSize: "0.813rem",
                  fontWeight: 600,
                  borderRadius: 1,
                  textTransform: "none",
                  cursor: "not-allowed",
                  minHeight: "auto",
                  "&:hover": {
                    backgroundColor: "#E5E7EB",
                  },
                }}
              >
                Chat about Insight
              </Button>
            )}
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
}
