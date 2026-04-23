import { useState, memo } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Heart,
  Search,
  Info,
  DollarSign,
  Users,
  FileBarChart,
  Lightbulb,
  Clock,
  Lock,
  Link2,
  BarChart3,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Layers,
  Network,
} from "lucide-react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Stack,
  Chip,
} from "@mui/material";
import { FlashCard as FlashCardType } from "../../../types";
import InsightModal from "../../modals/InsightModal";

/* ── Brand tokens ─────────────────────────────────────────────────────────── */
const C = {
  navy: "#1A3673",
  navyDeep: "#231E33",
  navyMid: "#2861BB",
  navyLight: "#6A97DF",
  paleNavy: "#E1EDFF",
  cyan: "#44B8F3",
  cyanMid: "#8FD4F8",
  paleCyan: "#E3F4FD",
  turquoise: "#00BBBA",
  turquoiseLight: "#65D6D6",
  terraCotta: "#E3725F",
  terraLight: "#EEAA9F",
  textDark: "#231E33",
  white: "#FFFFFF",
};

/* ── Helpers ──────────────────────────────────────────────────────────────── */
const priorityConfig = (priority: string, isReal: boolean) => {
  if (isReal)
    return { color: C.turquoise, bg: "rgba(0,187,186,.08)", label: "Verified" };
  switch (priority) {
    case "high":
      return { color: C.terraCotta, bg: "rgba(227,114,95,.07)", label: "High" };
    case "medium":
      return { color: C.navyMid, bg: "rgba(40,97,187,.06)", label: "Medium" };
    default:
      return { color: C.turquoise, bg: "rgba(0,187,186,.06)", label: "Low" };
  }
};

type TimeSeriesKey = "rolling_3" | "rolling_6" | "rolling_12" | "ytd";
const tsLabels: Record<TimeSeriesKey, string> = {
  rolling_3: "3M",
  rolling_6: "6M",
  rolling_12: "12M",
  ytd: "YTD",
};

interface EnhancedFlashCardV2Props {
  card: FlashCardType;
  onClick: () => void;
  onAskAI?: (e: React.MouseEvent) => void;
  onChatWithCard?: (card: FlashCardType) => void;
  onViewActionPlan?: (card: FlashCardType) => void;
  onToggleFavorite?: () => void;
  viewMode?: "simple" | "detailed";
}

/* ════════════════════════════════════════════════════════════════════════════
   COMPONENT
   ════════════════════════════════════════════════════════════════════════════ */
function EnhancedFlashCardV2({
  card,
  onClick,
  onChatWithCard,
  onViewActionPlan,
  onToggleFavorite,
  viewMode = "simple",
}: EnhancedFlashCardV2Props) {
  /* ── State ────────────────────────────────────────────────────────────── */
  const [isFavorite, setIsFavorite] = useState(() => {
    const favorites = JSON.parse(
      localStorage.getItem("favoriteInsights") || "[]",
    );
    return favorites.includes(card.id) || card.is_favorite || false;
  });
  const [isExpanded, setIsExpanded] = useState(viewMode === "detailed");
  const [showRCA, setShowRCA] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedTimeSeries, setSelectedTimeSeries] =
    useState<TimeSeriesKey>("rolling_3");

  const isRealData =
    (card.id === "insight-001" || card.id === "insight-012") &&
    card.data_source === "production";
  const prio = priorityConfig(card.priority, isRealData);

  /* ── Event handlers ───────────────────────────────────────────────────── */
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const handleFavoriteToggle = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const next = !isFavorite;
    setIsFavorite(next);
    const favorites = JSON.parse(
      localStorage.getItem("favoriteInsights") || "[]",
    );
    if (next) {
      if (!favorites.includes(card.id)) favorites.push(card.id);
    } else {
      const i = favorites.indexOf(card.id);
      if (i > -1) favorites.splice(i, 1);
    }
    localStorage.setItem("favoriteInsights", JSON.stringify(favorites));
  };

  /* ── KPI resolver per category ────────────────────────────────────────── */
  const handleExport = async (
    e: React.MouseEvent,
    format: "excel" | "csv" | "pdf",
  ) => {
    e.stopPropagation();
    setShowExportMenu(false);
    try {
      if (format === "pdf") {
        const pdfContent = generatePDFContent(card);
        const cleanTitle = card.title
          .replace(/[^a-z0-9\s-]/gi, "")
          .replace(/\s+/g, "_");
        const fileName = `${cleanTitle}.pdf`;
        const htmlContent = generatePDFHTML(pdfContent, card);
        const container = document.createElement("div");
        container.innerHTML = htmlContent;
        container.style.position = "absolute";
        container.style.left = "-9999px";
        container.style.width = "800px";
        document.body.appendChild(container);
        html2canvas(container, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
        })
          .then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            pdf.addImage(
              imgData,
              "PNG",
              imgX,
              10,
              imgWidth * ratio,
              imgHeight * ratio,
            );
            pdf.save(fileName);
            document.body.removeChild(container);
          })
          .catch((error) => {
            document.body.removeChild(container);
            throw error;
          });
      } else {
        const cleanTitle = card.title
          .replace(/[^a-z0-9\s-]/gi, "")
          .replace(/\s+/g, "_");
        alert(
          `✅ ${format.toUpperCase()} Export Ready!\n\nFile: ${cleanTitle}.${format}`,
        );
      }
    } catch (error) {
      alert(
        `❌ Download Failed\n\nError: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      console.error("Export error:", error);
    }
  };

  const generatePDFContent = (c: FlashCardType) => ({
    header: {
      title: c.title,
      category: c.category,
      lob: c.line_of_business,
      priority: c.priority,
      snapDate: c.snap_date,
      incurredMonthEnd: c.incurred_month_end,
    },
    kpis: c.kpis || c.time_series?.rolling_3,
    variance: c.time_series?.variance,
    keyInsights: c.llm_summary || c.insights,
    rootCause: {
      level1: c.level1_root_cause,
      level2: c.level2_correlation_analysis,
    },
    recommendations: c.recommended_actions,
    detectionDetails: {
      detected: c.created_at || c.detected_at,
      updated: c.updated_at,
      snapDate: c.snap_date,
      incurredMonthEnd: c.incurred_month_end,
    },
  });

  const generatePDFHTML = (pdfContent: any, c: FlashCardType) => {
    const kpis = pdfContent.kpis || {};
    const variance = pdfContent.variance || {};
    const vBadge = (key: string, invert = false) => {
      const v = variance[key];
      if (!v) return "";
      const up = parseFloat(v) >= 0;
      const good = invert ? !up : up;
      return `<div style="font-size:12px;font-weight:600;margin-top:5px;color:${good ? "#059669" : "#DC2626"}">${up ? "↑" : "↓"} ${Math.abs(parseFloat(v)).toFixed(1)}%</div>`;
    };
    const kpiBox = (
      label: string,
      value: string,
      vKey: string,
      color: string,
      invert = false,
    ) =>
      `<div style="background:#F8FBFF;padding:15px;border-radius:8px;border:1px solid #E1EDFF"><div style="font-size:11px;color:#6B7280;margin-bottom:5px">${label}</div><div style="font-size:18px;font-weight:bold;color:${color}">${value || "N/A"}</div>${vBadge(vKey, invert)}</div>`;

    let kpisHTML = "";
    if (c.category === "IP Med/Surg") {
      kpisHTML = `<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:15px;margin:20px 0">${kpiBox("PMPM Paid", kpis.pmpm_paid, "pmpm_paid_pct", C.navy)}${kpiBox("PMPM Allowed", kpis.pmpm_allowed, "pmpm_allowed_pct", "#D97706")}${kpiBox("CMI", kpis.cmi, "cmi_pct", "#059669", true)}${kpiBox("Admits/K", kpis.admits_per_1000, "admits_per_1000_pct", "#DC2626")}${kpiBox("Cost/Admit", kpis.allowed_cost_per_admit, "allowed_cost_per_admit_pct", "#0284C7")}</div>`;
    } else if (
      c.category === "IP Auth" ||
      c.category === "Outpatient Authorization"
    ) {
      kpisHTML = `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:15px;margin:20px 0">${kpiBox("Prior Auth PMPM", kpis.prior_auth_pmpm, "prior_auth_pmpm_pct", C.navy)}${kpiBox("Auth Claim CNT", kpis.auth_claim_count, "auth_claim_count_pct", C.terraCotta)}${kpiBox("Auth per K", kpis.auth_per_1000, "auth_per_1000_pct", C.turquoise)}${kpiBox("Admits per K", kpis.admits_per_1000, "admits_per_1000_pct", "#9333EA")}</div>`;
    }

    let insightsHTML = "";
    if (c.llm_summary)
      insightsHTML = `<div style="white-space:pre-wrap;line-height:1.6">${c.llm_summary}</div>`;
    else if (c.insights?.length)
      insightsHTML = c.insights
        .map(
          (ins, i) =>
            `<div style="margin-bottom:10px"><strong>${i + 1}.</strong> ${ins}</div>`,
        )
        .join("");

    let rcaHTML = "";
    if (c.level1_root_cause) {
      rcaHTML = `<div style="margin-bottom:20px"><h3 style="color:${C.navy};font-size:16px;margin-bottom:10px">Why is this happening?</h3><p style="line-height:1.6;margin-bottom:15px">${c.level1_root_cause.primary_cause}</p>${c.level1_root_cause.contributing_factors?.length ? `<h4 style="color:${C.navy};font-size:14px;margin-bottom:8px">Contributing Factors:</h4><ul style="line-height:1.8">${c.level1_root_cause.contributing_factors.map((f) => `<li>${f}</li>`).join("")}</ul>` : ""}</div>`;
      if (c.level2_correlation_analysis?.correlations) {
        rcaHTML += `<div><h3 style="color:${C.navy};font-size:16px;margin-bottom:10px">What patterns explain this?</h3>${c.level2_correlation_analysis.correlations.map((corr) => `<div style="margin-bottom:20px;padding:15px;background:#F9FAFB;border-left:3px solid #6366F1;border-radius:4px"><h4 style="color:#4338CA;font-size:14px;margin-bottom:8px;font-weight:600">${corr.finding}</h4><p style="line-height:1.6;color:#4B5563;margin-bottom:12px">${corr.explainability}</p>${corr.evidence_claims?.length ? `<div style="margin-top:10px;padding:10px;background:white;border-radius:4px;border:1px solid #E5E7EB"><div style="font-size:11px;font-weight:600;color:#374151;margin-bottom:6px">Evidence – Claims:</div><ul style="margin:0;padding-left:20px;line-height:1.6">${corr.evidence_claims.map((cl) => `<li style="font-size:11px;color:#6B7280;margin-bottom:4px">${cl}</li>`).join("")}</ul></div>` : ""}${corr.evidence_external?.length ? `<div style="margin-top:10px;padding:10px;background:#EEF2FF;border-left:2px solid #6366F1;border-radius:4px"><div style="font-size:11px;font-weight:600;color:#4338CA;margin-bottom:6px">Evidence (external):</div>${corr.evidence_external.map((ev) => `<div style="margin-bottom:8px"><div style="font-size:10px;color:#6B7280;margin-bottom:2px">${ev.description}</div><a href="${ev.url}" target="_blank" style="font-size:11px;color:#2563EB;text-decoration:underline">📎 ${ev.label}</a></div>`).join("")}</div>` : ""}</div>`).join("")}</div>`;
      }
    }

    let recsHTML = "";
    if (c.recommended_actions?.length)
      recsHTML = c.recommended_actions
        .map(
          (a, i) =>
            `<div style="margin-bottom:12px;padding:12px;background:#FFFFFF;border-radius:6px;border:1px solid #E5E7EB"><strong style="color:${C.navy}">${i + 1}.</strong> ${a}</div>`,
        )
        .join("");

    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${c.title}</title><style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;padding:40px;color:#1F2937;line-height:1.6;max-width:900px;margin:0 auto}h1{color:white;font-size:28px;margin:0;font-weight:700}h2{color:${C.navy};font-size:18px;margin-top:30px;margin-bottom:15px;border-bottom:2px solid #E5E7EB;padding-bottom:8px}.header{background:linear-gradient(135deg,#1E40AF,#3B82F6);color:white;padding:25px 30px;border-radius:12px;margin-bottom:30px;box-shadow:0 4px 6px rgba(0,0,0,.1)}.metadata{display:flex;flex-wrap:wrap;gap:12px;margin-top:15px;font-size:12px}.metadata span{background:rgba(255,255,255,.25);padding:6px 14px;border-radius:6px;font-weight:500}</style></head><body><div class="header"><h1>${c.title}</h1><div class="metadata"><span>📊 ${c.category}</span><span>🏢 ${c.line_of_business}</span>${c.snap_date ? `<span>📅 SNAP: ${c.snap_date}</span>` : ""}${c.incurred_month_end ? `<span>📅 Incurred: ${c.incurred_month_end}</span>` : ""}</div></div><div><h2>📊 Key Performance Indicators</h2>${kpisHTML}</div><div><h2>💡 Key Insights</h2>${insightsHTML}</div><div><h2>🔍 Root Cause Analysis</h2>${rcaHTML}</div><div><h2>✅ Recommended Actions</h2>${recsHTML}</div><div style="margin-top:40px;padding-top:20px;border-top:2px solid #E5E7EB;font-size:12px;color:#6B7280"><p><strong>Detection Details:</strong></p><p>Detected: ${formatDate(c.created_at || c.detected_at)}</p><p>Updated: ${formatDate(c.updated_at)}</p>${c.snap_date ? `<p>SNAP Date: ${c.snap_date}</p>` : ""}${c.incurred_month_end ? `<p>Incurred Month End: ${c.incurred_month_end}</p>` : ""}<p style="margin-top:15px">Generated: ${new Date().toLocaleString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p></div></body></html>`;
  };

  const handleShare = async (e: React.MouseEvent, method: "email" | "api") => {
    e.stopPropagation();
    setShowShareMenu(false);
    if (method === "email") {
      const subject = encodeURIComponent(`Cost of Care Insight: ${card.title}`);
      const kpis = card.kpis || card.time_series?.rolling_3;
      const variance = card.time_series?.variance;
      let kpisSection = "";
      if (card.category === "IP Med/Surg" && kpis) {
        const vf = (key: string) => {
          const v = variance?.[key];
          return v
            ? ` (${parseFloat(v) >= 0 ? "↑" : "↓"}${Math.abs(parseFloat(v)).toFixed(1)}%)`
            : "";
        };
        kpisSection = `KEY METRICS\n• PMPM Paid: ${kpis.pmpm_paid || "N/A"}${vf("pmpm_paid_pct")}\n• PMPM Allowed: ${kpis.pmpm_allowed || "N/A"}${vf("pmpm_allowed_pct")}\n• CMI: ${kpis.cmi || "N/A"}${vf("cmi_pct")}\n• Admits/K: ${kpis.admits_per_1000 || "N/A"}${vf("admits_per_1000_pct")}\n• Cost/Admit: ${kpis.allowed_cost_per_admit || "N/A"}${vf("allowed_cost_per_admit_pct")}`;
      } else {
        kpisSection = `KEY METRICS\n• ${card.metric_label}: ${card.metric_value}\n• ${card.trend_label}: ${card.trend}\n• Category: ${card.category}\n• Line of Business: ${card.line_of_business}`;
      }
      const insightsSection = card.llm_summary
        ? `KEY INSIGHTS\n${card.llm_summary}`
        : card.insights?.length
          ? `KEY INSIGHTS\n${card.insights
              .slice(0, 3)
              .map((ins, i) => `${i + 1}. ${ins}`)
              .join("\n")}`
          : "";
      let rcaSection = "";
      if (card.level1_root_cause) {
        rcaSection = `\nROOT CAUSE ANALYSIS\n\nWhy is this happening?\n${card.level1_root_cause.primary_cause}`;
        if (card.level1_root_cause.contributing_factors?.length)
          rcaSection += `\n\nContributing Factors:\n${card.level1_root_cause.contributing_factors
            .slice(0, 3)
            .map((f, i) => `${i + 1}. ${f}`)
            .join("\n")}`;
      }
      const detectionSection = `\nDETECTION DETAILS\n• Detected: ${formatDate(card.created_at || card.detected_at)}${card.snap_date ? `\n• SNAP Date: ${card.snap_date}` : ""}${card.incurred_month_end ? `\n• Incurred Month End: ${card.incurred_month_end}` : ""}`;
      const body = encodeURIComponent(
        `COST OF CARE INSIGHT REPORT\n━━━━━━━━━━━━━━━━━━━\n\n${card.title}\n\nOVERVIEW\n${card.description}\n\n${kpisSection}\n\n${insightsSection}${rcaSection}\n\nRECOMMENDATIONS\n${
          card.recommended_actions?.length
            ? card.recommended_actions
                .slice(0, 3)
                .map((a, i) => `${i + 1}. ${a}`)
                .join("\n")
            : "Review insight for detailed recommendations"
        }${detectionSection}\n\n━━━━━━━━━━━━━━━━━━━\nGenerated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}`,
      );
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    } else {
      const screenshotData = {
        id: card.id,
        title: card.title,
        category: card.category,
        lob: card.line_of_business,
        kpis: card.kpis || card.time_series?.rolling_3,
        variance: card.time_series?.variance,
        insights: card.llm_summary || card.insights,
        rootCause: card.level1_root_cause,
        recommendations: card.recommended_actions,
        snapDate: card.snap_date,
        incurredMonthEnd: card.incurred_month_end,
      };
      console.log("Screenshot/API Data:", screenshotData);
      alert(
        `✅ Screenshot/API Ready\n\nInsight: ${card.title}\n\nData captured:\n• ${Object.keys(screenshotData.kpis || {}).length} KPIs with variance\n• ${typeof screenshotData.insights === "string" ? "Summary" : screenshotData.insights?.length || 0} insights\n• Root cause analysis\n• ${screenshotData.recommendations?.length || 0} recommendations`,
      );
    }
  };

  /* ── KPI resolver per category ────────────────────────────────────────── */
  const resolveKPIs = (kpis: any) => {
    if (!kpis) return [];

    // Check for OON/Network Management categories (can contain "OON" anywhere in the name)
    if (
      card.category?.toLowerCase().includes("oon") ||
      card.category?.toLowerCase().includes("network management") ||
      card.category === "Network Management" ||
      card.category === "Out-of-Network Management"
    ) {
      return [
        {
          label: "NPAR PMPM Ratio",
          value: kpis.npar_pmpm_ratio || kpis.PMPM_RATIO || kpis.pmpm_ratio,
          icon: FileBarChart,
          color: C.navy,
          vKey: "npar_pmpm_ratio_pct",
        },
        {
          label: "NPAR Claims/1000",
          value:
            kpis.npar_claims_per_1000 ||
            kpis.NPAR_CLAIMS_PER_K ||
            kpis.npar_claims_per_k ||
            kpis.oon_per_1000,
          icon: Users,
          color: C.terraCotta,
          vKey: "npar_claims_per_1000_pct",
        },
        {
          label: "NPAR PMPM",
          value:
            kpis.npar_pmpm ||
            kpis.NPAR_PAID_PMPM ||
            kpis.npar_paid_pmpm ||
            kpis.oon_pmpm,
          icon: DollarSign,
          color: C.turquoise,
          vKey: "npar_pmpm_pct",
        },
      ];
    }

    switch (card.category) {
      case "IP Med/Surg":
        return [
          {
            label: "Paid PMPM",
            value: kpis.pmpm_paid || kpis.pmpm,
            icon: DollarSign,
            color: C.navy,
            vKey: "pmpm_paid_pct",
          },
          {
            label: "Admits/K",
            value: kpis.admits_per_1000,
            icon: Users,
            color: C.terraCotta,
            vKey: "admits_per_1000_pct",
          },
          {
            label: "Allowed PMPM",
            value: kpis.pmpm_allowed,
            icon: DollarSign,
            color: C.navyMid,
            vKey: "pmpm_allowed_pct",
          },
          {
            label: "Cost/Admit",
            value: kpis.allowed_cost_per_admit || kpis.cost_per_admit,
            icon: FileBarChart,
            color: C.turquoise,
            vKey: "allowed_cost_per_admit_pct",
          },
          {
            label: "CMI",
            value: kpis.cmi,
            icon: BarChart3,
            color: C.cyan,
            vKey: "cmi_pct",
          },
          {
            label: "OON %",
            value: kpis.oon_percentage,
            icon: Network,
            color: C.navyLight,
            vKey: "oon_percentage_pct",
          },
        ];
      case "IP Auth":
      case "IP Cardiovascular":
        return [
          {
            label: "Prior Auth PMPM",
            value: kpis.prior_auth_pmpm || kpis.pmpm,
            icon: DollarSign,
            color: C.navy,
            vKey: "prior_auth_pmpm_pct",
          },
          {
            label: "Auth per K",
            value: kpis.auth_per_1000,
            icon: Users,
            color: C.terraCotta,
            vKey: "auth_per_1000_pct",
          },
          {
            label: "Admits per K",
            value: kpis.admits_per_1000,
            icon: Users,
            color: C.turquoise,
            vKey: "admits_per_1000_pct",
          },
          {
            label: "Cost per Admit",
            value: kpis.cost_per_admit,
            icon: DollarSign,
            color: C.navyMid,
            vKey: "cost_per_admit_pct",
          },
          {
            label: "Auth Count",
            value: kpis.auth_count || kpis.claim_count,
            icon: FileBarChart,
            color: C.cyan,
            vKey: "auth_count_pct",
          },
        ];
      case "Outpatient Authorization":
      case "Outpatient Emergency":
        return [
          {
            label: "Paid PMPM",
            value: kpis.paid_pmpm,
            icon: DollarSign,
            color: C.navy,
          },
          {
            label: "Visits/1000",
            value: kpis.visits_per_1000,
            icon: Users,
            color: C.terraCotta,
          },
          {
            label: "Procedures/K",
            value: kpis.procedures_per_1000,
            icon: FileBarChart,
            color: C.turquoise,
          },
          {
            label: "Cost/Visit",
            value: kpis.cost_per_visit,
            icon: DollarSign,
            color: C.navyMid,
          },
        ];
      case "Network Management":
      case "OON":
      case "Out-of-Network Management":
        return [
          {
            label: "NPAR PMPM Ratio",
            value: kpis.npar_pmpm_ratio || kpis.PMPM_RATIO || kpis.pmpm_ratio,
            icon: FileBarChart,
            color: C.navy,
            vKey: "npar_pmpm_ratio_pct",
          },
          {
            label: "NPAR Claims/1000",
            value:
              kpis.npar_claims_per_1000 ||
              kpis.NPAR_CLAIMS_PER_K ||
              kpis.npar_claims_per_k ||
              kpis.oon_per_1000,
            icon: Users,
            color: C.terraCotta,
            vKey: "npar_claims_per_1000_pct",
          },
          {
            label: "NPAR PMPM",
            value:
              kpis.npar_pmpm ||
              kpis.NPAR_PAID_PMPM ||
              kpis.npar_paid_pmpm ||
              kpis.oon_pmpm,
            icon: DollarSign,
            color: C.turquoise,
            vKey: "npar_pmpm_pct",
          },
        ];
      default:
        return [
          {
            label: "Auth Count",
            value: kpis.auth_count || card.metric_value,
            icon: FileBarChart,
            color: C.navy,
          },
          {
            label: "Admits/1000",
            value: kpis.admits_per_1000,
            icon: Users,
            color: C.terraCotta,
          },
          {
            label: "PMPM",
            value: kpis.pmpm,
            icon: DollarSign,
            color: C.turquoise,
          },
        ];
    }
  };

  const simpleKPIs =
    card.kpis || card.time_series?.rolling_3 || card.data_points;
  const variance = card.time_series?.variance;

  /* ═══════════════════════════════════════════════════════════════════════
     SIMPLE VIEW (compact card)
     ═══════════════════════════════════════════════════════════════════════ */
  if (!isExpanded && viewMode === "simple") {
    const topKPIs = resolveKPIs(simpleKPIs).slice(0, 3);
    return (
      <>
        <Box
          onClick={() => setShowModal(true)}
          sx={{
            position: "relative",
            bgcolor: "white",
            borderRadius: "8px",
            overflow: "hidden",
            cursor: "pointer",
            transition: "all .2s cubic-bezier(.4,0,.2,1)",
            border: "1px solid #E5E7EB",
            borderTop: "3px solid #1A3673",
            boxShadow:
              "0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",
            "&:hover": {
              transform: "translateY(-3px)",
              boxShadow:
                "0 12px 40px rgba(26,54,115,.10), 0 4px 12px rgba(26,54,115,.06)",
              borderColor: "#D1D5DB",
            },
          }}
        >
          <Box sx={{ p: 1.5, pt: 1.75 }}>
            {/* Header row */}
            <Stack
              direction="row"
              spacing={1}
              alignItems="flex-start"
              sx={{ mb: 1.25 }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  color: "#1A3673",
                  fontSize: "0.875rem",
                  lineHeight: 1.4,
                  letterSpacing: "-0.01em",
                  flex: 1,
                }}
              >
                {card.title}
              </Typography>
              <ArrowUpRight
                size={14}
                color={C.navyLight}
                style={{ flexShrink: 0, marginTop: 2 }}
              />
            </Stack>

            {/* KPI strip */}
            <Box sx={{ display: "flex", gap: 1.25, mb: 0, overflow: "hidden" }}>
              {topKPIs.map((kpi, i) => {
                // Get variance for this KPI
                const varianceValue = variance?.[kpi.vKey];
                let varianceSymbol = null;
                let varianceColor = null;

                if (varianceValue) {
                  const varianceNum = parseFloat(varianceValue);
                  if (!isNaN(varianceNum)) {
                    varianceColor = varianceNum >= 0 ? "#DC2626" : "#059669";
                    varianceSymbol = varianceNum >= 0 ? "▲" : "▼";
                  }
                }

                return (
                  <Box
                    key={i}
                    sx={{
                      flex: "1 1 0",
                      py: 1,
                      px: 1,
                      borderRadius: "4px",
                      bgcolor: "#FFFFFF",
                      textAlign: "center",
                      border: "1px solid #E5E7EB",
                      minWidth: "0",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.625rem",
                        fontWeight: 500,
                        color: "#1A3673",
                        textTransform: "uppercase",
                        letterSpacing: ".05em",
                        mb: 0.5,
                        lineHeight: 1.2,
                        textAlign: "center",
                        wordBreak: "break-word",
                        hyphens: "auto",
                      }}
                    >
                      {kpi.label}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 0.5,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.875rem",
                          fontWeight: 800,
                          color: "#000000",
                          lineHeight: 1.1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {kpi.value || "N/A"}
                      </Typography>
                      {varianceSymbol && (
                        <Typography
                          component="span"
                          sx={{
                            fontSize: "0.625rem",
                            fontWeight: 600,
                            color: varianceColor,
                            lineHeight: 1,
                          }}
                        >
                          {varianceSymbol}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
        <InsightModal
          card={card}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onChatWithCard={onChatWithCard}
          isFavorite={isFavorite}
          onFavoriteToggle={handleFavoriteToggle}
        />
      </>
    );
  }

  /* ═══════════════════════════════════════════════════════════════════════
     DETAILED VIEW (full card)
     ═══════════════════════════════════════════════════════════════════════ */
  const currentKPIs = card.time_series?.[selectedTimeSeries] || card.kpis;
  const kpiList = resolveKPIs(currentKPIs);

  return (
    <Box
      sx={{
        position: "relative",
        bgcolor: "white",
        borderRadius: "10px",
        overflow: "hidden",
        transition: "all .25s cubic-bezier(.4,0,.2,1)",
        boxShadow:
          "0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",
        border: "1px solid #E5E7EB",
        borderTop: "3px solid #1A3673",
        "&:hover": {
          boxShadow:
            "0 8px 30px rgba(26,54,115,.09), 0 2px 8px rgba(26,54,115,.04)",
        },
      }}
    >
      {/* ── Header Band ── */}
      <Box
        sx={{
          px: 2.5,
          pt: 2,
          pb: 1.5,
          background: `linear-gradient(135deg, ${C.navy}08 0%, ${C.cyan}05 100%)`,
          borderBottom: "1px solid #EEF2F7",
        }}
      >
        <Stack direction="row" alignItems="flex-start" spacing={1.5}>
          {/* Priority indicator */}
          <Box
            sx={{
              mt: 0.5,
              width: 32,
              height: 32,
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: prio.bg,
              border: `1px solid ${prio.color}20`,
              flexShrink: 0,
            }}
          >
            <Layers size={15} color={prio.color} />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Title */}
            <Typography
              sx={{
                fontWeight: 700,
                color: C.navy,
                fontSize: "14px",
                lineHeight: 1.35,
                letterSpacing: "-0.01em",
                mb: 0.5,
              }}
            >
              {card.title}
            </Typography>

            {/* Meta chips */}
            <Stack
              direction="row"
              spacing={0.75}
              alignItems="center"
              flexWrap="wrap"
              useFlexGap
            >
              <Chip
                label={card.category}
                size="small"
                sx={{
                  height: 20,
                  fontSize: "9px",
                  fontWeight: 600,
                  bgcolor: C.paleNavy,
                  color: C.navyMid,
                  border: "none",
                  "& .MuiChip-label": { px: 1 },
                }}
              />
              <Chip
                label={card.line_of_business}
                size="small"
                sx={{
                  height: 20,
                  fontSize: "9px",
                  fontWeight: 600,
                  bgcolor: "#F0FDFA",
                  color: C.turquoise,
                  border: "none",
                  "& .MuiChip-label": { px: 1 },
                }}
              />
              {(card.snap_date || card.incurred_month_end) && (
                <Typography
                  sx={{
                    fontSize: "9px",
                    color: "#94A3B8",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.25,
                  }}
                >
                  <Calendar size={9} />{" "}
                  {card.snap_date || card.incurred_month_end}
                </Typography>
              )}
            </Stack>
          </Box>

          {/* Favorite + Time Series toggles */}
          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            sx={{ flexShrink: 0 }}
          >
            {(
              ["rolling_3", "rolling_6", "rolling_12", "ytd"] as TimeSeriesKey[]
            ).map((ts) => (
              <Box
                key={ts}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTimeSeries(ts);
                }}
                sx={{
                  px: 0.75,
                  py: 0.25,
                  fontSize: "8.5px",
                  fontWeight: 700,
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "all .15s",
                  userSelect: "none",
                  ...(selectedTimeSeries === ts
                    ? { bgcolor: C.navy, color: "white" }
                    : {
                        bgcolor: "#F1F5F9",
                        color: "#94A3B8",
                        "&:hover": { bgcolor: "#E2E8F0", color: C.navyMid },
                      }),
                }}
              >
                {tsLabels[ts]}
              </Box>
            ))}
            <IconButton
              onClick={handleFavoriteToggle}
              sx={{
                p: 0.5,
                ml: 0.5,
                bgcolor: isFavorite ? "#FFF0EE" : "transparent",
                "&:hover": { bgcolor: isFavorite ? "#FFE4E0" : "#F1F5F9" },
              }}
            >
              <Heart
                size={14}
                color={isFavorite ? C.terraCotta : "#CBD5E1"}
                fill={isFavorite ? C.terraCotta : "none"}
              />
            </IconButton>
          </Stack>
        </Stack>
      </Box>

      {/* ── Body ── */}
      <Box sx={{ px: 2.5, py: 2 }}>
        {/* ── KPI Grid ── */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(kpiList.length, 3)}, 1fr)`,
            gap: 1,
            mb: 2,
          }}
        >
          {kpiList.map((kpi, i) => {
            const vKey = (kpi as any).vKey;
            const vVal =
              vKey && variance?.[vKey] ? parseFloat(variance[vKey]) : null;
            return (
              <Box
                key={i}
                sx={{
                  py: 1.25,
                  px: 1.5,
                  borderRadius: "12px",
                  bgcolor: "#FAFBFD",
                  border: "1px solid #EEF2F7",
                  textAlign: "center",
                  transition: "all .2s",
                  "&:hover": {
                    bgcolor: "#F4F7FB",
                    borderColor: `${kpi.color}30`,
                  },
                }}
              >
                <Box
                  sx={{ display: "flex", justifyContent: "center", mb: 0.5 }}
                >
                  <kpi.icon size={13} color={kpi.color} />
                </Box>
                <Typography
                  sx={{
                    fontSize: "8.5px",
                    fontWeight: 600,
                    color: "#94A3B8",
                    textTransform: "uppercase",
                    letterSpacing: ".05em",
                    mb: 0.25,
                  }}
                >
                  {kpi.label}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "15px",
                    fontWeight: 800,
                    color: kpi.value ? kpi.color : "#44B8F3",
                    lineHeight: 1.2,
                  }}
                >
                  {kpi.value || "N/A"}
                </Typography>
                {vVal !== null && (
                  <Stack
                    direction="row"
                    spacing={0.25}
                    alignItems="center"
                    justifyContent="center"
                    sx={{ mt: 0.25 }}
                  >
                    {vVal >= 0 ? (
                      <TrendingUp size={9} color="#DC2626" />
                    ) : (
                      <TrendingDown size={9} color="#059669" />
                    )}
                    <Typography
                      sx={{
                        fontSize: "9px",
                        fontWeight: 600,
                        color: vVal >= 0 ? "#DC2626" : "#059669",
                      }}
                    >
                      {Math.abs(vVal).toFixed(1)}%
                    </Typography>
                  </Stack>
                )}
              </Box>
            );
          })}
        </Box>

        {/* ── Insights ── */}
        {(card.llm_summary || card.insights?.length > 0) && (
          <Box
            sx={{
              mb: 2,
              p: 1.75,
              borderRadius: "12px",
              bgcolor: "#F0F9FF",
              border: "1px solid #BAE6FD",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                left: 0,
                top: "15%",
                bottom: "15%",
                width: 3,
                borderRadius: "0 3px 3px 0",
                bgcolor: C.cyan,
              },
            }}
          >
            <Stack
              direction="row"
              spacing={0.75}
              alignItems="center"
              sx={{ mb: 0.75 }}
            >
              <Lightbulb size={13} color="#0284C7" />
              <Typography
                sx={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#0284C7",
                  textTransform: "uppercase",
                  letterSpacing: ".05em",
                }}
              >
                Key Insights
              </Typography>
            </Stack>
            {card.llm_summary ? (
              <Typography
                sx={{ fontSize: "11px", color: "#334155", lineHeight: 1.65 }}
              >
                {card.llm_summary}
              </Typography>
            ) : (
              <Stack spacing={0.5}>
                {card.insights.slice(0, 3).map((ins, i) => (
                  <Stack
                    key={i}
                    direction="row"
                    spacing={0.75}
                    alignItems="flex-start"
                  >
                    <Box
                      sx={{
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        bgcolor: C.cyan,
                        mt: "5px",
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: "11px",
                        color: "#334155",
                        lineHeight: 1.6,
                      }}
                    >
                      {ins}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            )}
          </Box>
        )}

        {/* ── Data Deep Dive (collapsible) ── */}
        <Box sx={{ mb: 1.5 }}>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setShowRCA(!showRCA);
            }}
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              px: 1.75,
              py: 1,
              borderRadius: "10px",
              textTransform: "none",
              bgcolor: showRCA ? C.turquoise : "#F0FDFA",
              color: showRCA ? "white" : C.turquoise,
              border: showRCA ? "none" : "1px solid #CCFBF1",
              fontWeight: 600,
              fontSize: "11px",
              transition: "all .2s",
              "&:hover": {
                bgcolor: showRCA ? "#009B9A" : "#E0FBF8",
              },
            }}
          >
            <Stack direction="row" spacing={0.75} alignItems="center">
              <Search size={13} />
              <span>Data Deep Dive</span>
            </Stack>
            {showRCA ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </Button>

          {showRCA && (
            <Stack spacing={1.25} sx={{ mt: 1.25 }}>
              {card.level1_root_cause && (
                <Box
                  sx={{
                    borderRadius: "12px",
                    p: 1.5,
                    bgcolor: "#F0FDFA",
                    border: "1px solid #CCFBF1",
                    position: "relative",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: "15%",
                      bottom: "15%",
                      width: 3,
                      borderRadius: "0 3px 3px 0",
                      bgcolor: C.turquoise,
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "10.5px",
                      fontWeight: 700,
                      color: "#0D9488",
                      mb: 0.5,
                    }}
                  >
                    Why is this happening?
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "11px",
                      color: "#334155",
                      lineHeight: 1.6,
                      mb: 1,
                    }}
                  >
                    {card.level1_root_cause.primary_cause}
                  </Typography>
                  {card.level1_root_cause.contributing_factors?.length > 0 && (
                    <>
                      <Typography
                        sx={{
                          fontSize: "10px",
                          fontWeight: 600,
                          color: "#475569",
                          mb: 0.5,
                        }}
                      >
                        Contributing Factors:
                      </Typography>
                      <Stack spacing={0.25}>
                        {card.level1_root_cause.contributing_factors.map(
                          (f, i) => (
                            <Typography
                              key={i}
                              sx={{
                                fontSize: "10.5px",
                                color: "#475569",
                                pl: 1,
                              }}
                            >
                              • {f}
                            </Typography>
                          ),
                        )}
                      </Stack>
                    </>
                  )}
                  {card.level1_root_cause.evidence_sources?.length > 0 && (
                    <Typography
                      sx={{ fontSize: "9px", color: "#94A3B8", mt: 1 }}
                    >
                      Based on:{" "}
                      {card.level1_root_cause.evidence_sources.join(", ")}
                    </Typography>
                  )}
                </Box>
              )}

              {card.level2_correlation_analysis && (
                <Box
                  sx={{
                    borderRadius: "12px",
                    p: 1.5,
                    bgcolor: "#F8FAFF",
                    border: "1px solid #E1EDFF",
                    position: "relative",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: "15%",
                      bottom: "15%",
                      width: 3,
                      borderRadius: "0 3px 3px 0",
                      bgcolor: C.navyMid,
                    },
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={0.5}
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
                    <Link2 size={12} color={C.navyMid} />
                    <Typography
                      sx={{
                        fontSize: "10.5px",
                        fontWeight: 700,
                        color: C.navy,
                      }}
                    >
                      What patterns explain this?
                    </Typography>
                  </Stack>
                  <Stack spacing={0.75}>
                    {card.level2_correlation_analysis.correlations.map(
                      (corr, i) => (
                        <Box
                          key={i}
                          sx={{
                            bgcolor: "white",
                            borderRadius: "8px",
                            p: 1.25,
                            border: "1px solid #EEF2F7",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "10px",
                              fontWeight: 600,
                              color: C.navyMid,
                              mb: 0.25,
                            }}
                          >
                            {corr.finding}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "10px",
                              color: "#64748B",
                              lineHeight: 1.5,
                            }}
                          >
                            → {corr.explainability}
                          </Typography>
                          {corr.evidence_url && corr.evidence_label && (
                            <Typography
                              component="a"
                              href={corr.evidence_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                fontSize: "9px",
                                color: "#2563EB",
                                textDecoration: "underline",
                                mt: 0.5,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 0.5,
                                "&:hover": { color: "#1E40AF" },
                              }}
                            >
                              📎 {corr.evidence_label}
                            </Typography>
                          )}
                        </Box>
                      ),
                    )}
                  </Stack>
                </Box>
              )}

              {!card.level1_root_cause && !card.level2_correlation_analysis && (
                <Box
                  sx={{
                    borderRadius: "12px",
                    p: 1.5,
                    bgcolor: "#F0FDFA",
                    border: "1px solid #CCFBF1",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "10.5px",
                      fontWeight: 700,
                      color: "#0D9488",
                      mb: 0.5,
                    }}
                  >
                    Why is this happening?
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "11px",
                      color: "#475569",
                      lineHeight: 1.6,
                      mb: 0.75,
                    }}
                  >
                    {card.data_points?.primary_cause ||
                      "Increased unit costs combined with utilization shifts"}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "10px",
                      fontWeight: 600,
                      color: "#475569",
                      mb: 0.5,
                    }}
                  >
                    Contributing Factors:
                  </Typography>
                  <Stack spacing={0.25}>
                    {card.root_cause_analysis?.map((cause, i) => (
                      <Typography
                        key={i}
                        sx={{ fontSize: "10.5px", color: "#475569", pl: 1 }}
                      >
                        • {cause}
                      </Typography>
                    )) || (
                      <>
                        <Typography
                          sx={{ fontSize: "10.5px", color: "#475569", pl: 1 }}
                        >
                          • Provider mix changes
                        </Typography>
                        <Typography
                          sx={{ fontSize: "10.5px", color: "#475569", pl: 1 }}
                        >
                          • Acuity increases in specific markets
                        </Typography>
                      </>
                    )}
                  </Stack>
                </Box>
              )}
            </Stack>
          )}
        </Box>

        {/* ── Recommendations (locked) ── */}
        {card.recommended_actions?.length > 0 && (
          <Box sx={{ mb: 1.5, position: "relative" }}>
            <Chip
              label="Future Release"
              sx={{
                position: "absolute",
                top: -8,
                right: -4,
                zIndex: 10,
                bgcolor: "#E3725F",
                color: "white",
                fontSize: "7.5px",
                fontWeight: 700,
                height: "auto",
                py: "2px",
                px: "4px",
              }}
            />
            <Button
              disabled
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                px: 1.75,
                py: 1,
                borderRadius: "10px",
                textTransform: "none",
                bgcolor: "#F1F5F9",
                color: "#94A3B8",
                border: "1px solid #E2E8F0",
                opacity: 0.5,
                cursor: "not-allowed",
                fontSize: "11px",
                fontWeight: 600,
              }}
            >
              <Stack direction="row" spacing={0.75} alignItems="center">
                <Lock size={13} />
                <span>Recommendations ({card.recommended_actions.length})</span>
              </Stack>
              <ChevronDown size={14} />
            </Button>
          </Box>
        )}

        {/* ── Notes placeholder ── */}
        <Box
          sx={{
            p: 1.25,
            mb: 1.5,
            borderRadius: "10px",
            bgcolor: "#FAFBFD",
            border: "1px solid #EEF2F7",
          }}
        >
          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            sx={{ mb: 0.25 }}
          >
            <Info size={11} color="#94A3B8" />
            <Typography
              sx={{
                fontSize: "9px",
                fontWeight: 700,
                color: "#64748B",
                textTransform: "uppercase",
                letterSpacing: ".04em",
              }}
            >
              Notes
            </Typography>
          </Stack>
          <Typography
            sx={{ fontSize: "9.5px", color: "#94A3B8", fontStyle: "italic" }}
          >
            No notes yet. Click "Chat about Insight" to add notes via
            conversation.
          </Typography>
        </Box>

        {/* ── Footer row ── */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 1.5 }}
        >
          <Stack
            direction="row"
            spacing={1.5}
            sx={{ fontSize: "9.5px", color: "#94A3B8" }}
          >
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Clock size={10} />
              <Typography sx={{ fontSize: "inherit" }}>
                {formatDate(card.created_at || card.detected_at)}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Calendar size={10} />
              <Typography sx={{ fontSize: "inherit" }}>
                {formatDate(card.updated_at)}
              </Typography>
            </Stack>
          </Stack>
          <Stack direction="row" spacing={0.25}>
            {[1, 2, 3, 4, 5].map((s) => (
              <IconButton
                key={s}
                onClick={(e) => handleRatingChange(e, s)}
                sx={{
                  p: 0,
                  "&:hover": { transform: "scale(1.15)" },
                  transition: "transform .15s",
                }}
              >
                <Star
                  size={11}
                  color={s <= rating ? "#FACC15" : "#E2E8F0"}
                  fill={s <= rating ? "#FACC15" : "none"}
                />
              </IconButton>
            ))}
          </Stack>
        </Stack>

        {/* ── Action bar ── */}
        <Stack direction="row" spacing={0.75}>
          <Button
            onClick={handleChatWithCard}
            sx={{
              flex: 2,
              bgcolor: C.navy,
              color: "white",
              py: 1,
              borderRadius: "10px",
              fontWeight: 600,
              fontSize: "10.5px",
              textTransform: "none",
              display: "flex",
              gap: 0.75,
              "&:hover": {
                bgcolor: C.navyMid,
                boxShadow: "0 4px 14px rgba(26,54,115,.2)",
              },
            }}
          >
            <MessageCircle size={13} />
            Chat
          </Button>

          <Box sx={{ flex: 2, position: "relative" }}>
            <Chip
              label="Future"
              sx={{
                position: "absolute",
                top: -7,
                right: -4,
                zIndex: 10,
                bgcolor: "#E3725F",
                color: "white",
                fontSize: "7px",
                fontWeight: 700,
                height: "auto",
                py: "1px",
                px: "4px",
              }}
            />
            <Button
              disabled
              sx={{
                width: "100%",
                bgcolor: "#F1F5F9",
                color: "#94A3B8",
                py: 1,
                borderRadius: "10px",
                fontWeight: 600,
                fontSize: "10.5px",
                textTransform: "none",
                display: "flex",
                gap: 0.75,
                opacity: 0.5,
              }}
            >
              <Lock size={13} />
              Actions
            </Button>
          </Box>

          {/* Export */}
          <Box sx={{ position: "relative" }}>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setShowExportMenu(!showExportMenu);
              }}
              sx={{
                bgcolor: "#F1F5F9",
                borderRadius: "10px",
                width: 36,
                height: 36,
                "&:hover": { bgcolor: "#E2E8F0" },
              }}
            >
              <Download size={14} color="#64748B" />
            </IconButton>
            {showExportMenu && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: "110%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  bgcolor: "white",
                  borderRadius: "10px",
                  boxShadow: "0 8px 30px rgba(0,0,0,.12)",
                  border: "1px solid #EEF2F7",
                  zIndex: 50,
                  minWidth: 120,
                  overflow: "hidden",
                }}
              >
                <MenuItem
                  onClick={(e) => handleExport(e, "excel")}
                  sx={{ px: 1.5, py: 0.75, fontSize: "10px", gap: 0.75 }}
                >
                  <FileSpreadsheet size={12} color="#16A34A" />
                  Excel
                </MenuItem>
                <MenuItem
                  onClick={(e) => handleExport(e, "csv")}
                  sx={{
                    px: 1.5,
                    py: 0.75,
                    fontSize: "10px",
                    gap: 0.75,
                    borderTop: "1px solid #F1F5F9",
                  }}
                >
                  <FileText size={12} color="#2563EB" />
                  CSV
                </MenuItem>
                <MenuItem
                  onClick={(e) => handleExport(e, "pdf")}
                  sx={{
                    px: 1.5,
                    py: 0.75,
                    fontSize: "10px",
                    gap: 0.75,
                    borderTop: "1px solid #F1F5F9",
                  }}
                >
                  <FileText size={12} color="#DC2626" />
                  PDF
                </MenuItem>
              </Box>
            )}
          </Box>

          {/* Share */}
          <Box sx={{ position: "relative" }}>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setShowShareMenu(!showShareMenu);
              }}
              sx={{
                bgcolor: "#F1F5F9",
                borderRadius: "10px",
                width: 36,
                height: 36,
                "&:hover": { bgcolor: "#E2E8F0" },
              }}
            >
              <Share2 size={14} color="#64748B" />
            </IconButton>
            {showShareMenu && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: "110%",
                  right: 0,
                  bgcolor: "white",
                  borderRadius: "10px",
                  boxShadow: "0 8px 30px rgba(0,0,0,.12)",
                  border: "1px solid #EEF2F7",
                  zIndex: 50,
                  minWidth: 150,
                  overflow: "hidden",
                }}
              >
                <MenuItem
                  onClick={(e) => handleShare(e, "email")}
                  sx={{ px: 1.5, py: 0.75, fontSize: "10px", gap: 0.75 }}
                >
                  <Mail size={12} color="#2563EB" />
                  Email + Screenshot
                </MenuItem>
                <MenuItem
                  onClick={(e) => handleShare(e, "api")}
                  sx={{
                    px: 1.5,
                    py: 0.75,
                    fontSize: "10px",
                    gap: 0.75,
                    borderTop: "1px solid #F1F5F9",
                  }}
                >
                  <Share2 size={12} color="#16A34A" />
                  Feed to App
                </MenuItem>
              </Box>
            )}
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

export default memo(EnhancedFlashCardV2);
