import { useState, useEffect, useMemo } from "react";
import {
  LayoutDashboard,
  RefreshCw,
  Save,
  Plus,
  Edit2,
  Trash2,
  Check,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Globe,
  Zap,
  Search,
  FileJson,
  Copy,
  Download,
  X,
  Settings,
  ExternalLink,
  Building2,
  Users,
  Briefcase,
  Heart,
  FileSpreadsheet,
  TrendingUp,
  DollarSign,
  Activity,
  ChevronRight,
  Server,
  Database,
} from "lucide-react";
import { API_BASE_URL as API_URL } from "../../config/api";

// ============================================================================
// BRAND COLORS
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
};

// ============================================================================
// TYPES
// ============================================================================

interface DashboardItem {
  id: string;
  path: string;
  label: string;
  type: string;
  provider: string;
  key?: string;
  bi?: any;
  app?: any;
}

interface DashboardGroup {
  id: string;
  label: string;
  items: DashboardItem[];
}

interface DashboardPrimary {
  id: string;
  label: string;
  groups: DashboardGroup[];
}

interface DashboardCategory {
  id: string;
  label: string;
  primaries: DashboardPrimary[];
}

interface DashboardMenu {
  version: number;
  generatedAt: string;
  categories: DashboardCategory[];
}

interface ParsedDashboard {
  id: string;
  primaryCategory: string;
  secondaryCategory: string;
  lob: string;
  reportType: string;
  provider: string;
  type: string;
  bi?: any;
  app?: any;
  key?: string;
  // For editing - store parent IDs
  categoryId: string;
  primaryId: string;
  groupId: string;
}

interface InventoryStats {
  totalDashboards: number;
  categoriesCount: number;
  providers: { powerbi: number; internal: number; external: number };
  menuVersion: number;
}

type ViewMode = "editor" | "json";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const extractLOB = (label: string, key?: string): string => {
  const labelLower = label.toLowerCase();
  if (labelLower === "commercial" || labelLower.includes("commercial"))
    return "Commercial";
  if (labelLower === "medicaid") return "Medicaid";
  if (labelLower === "medicare") return "Medicare";
  if (labelLower === "fgs") return "FGS";
  if (labelLower.includes("excel pivot")) return "Excel Pivots";

  if (key) {
    if (key.includes("_COMM")) return "Commercial";
    if (key.includes("_MEDD")) return "Medicaid";
    if (key.includes("_MEDC")) return "Medicare";
    if (key.includes("_FGS")) return "FGS";
    if (key.includes("_EP")) return "Excel Pivots";
  }

  return "Other";
};

const extractReportType = (key?: string): string => {
  if (key) {
    if (key.includes("VISUAL")) return "Visual";
    if (key.includes("MTRX")) return "Matrix";
    if (key.includes("CVD")) return "CVD";
    if (key.includes("CCON")) return "CCON";
    if (key.includes("ONC")) return "Oncology";
    if (key.includes("CPTN")) return "Capitation";
    if (key.includes("REST")) return "Restated";
  }
  return "Report";
};

const getLOBColor = (
  lob: string,
): { bg: string; text: string; light: string } => {
  switch (lob) {
    case "Commercial":
      return { bg: BRAND.navy, text: BRAND.white, light: BRAND.paleNavy };
    case "Medicaid":
      return { bg: BRAND.mediumNavy, text: BRAND.white, light: BRAND.paleNavy };
    case "Medicare":
      return { bg: BRAND.turquoise, text: BRAND.white, light: BRAND.paleCyan };
    case "FGS":
      return { bg: BRAND.terraCotta, text: BRAND.white, light: "#FBEAE7" };
    case "Excel Pivots":
      return { bg: BRAND.cyan, text: BRAND.textDark, light: BRAND.paleCyan };
    default:
      return { bg: "#6B7280", text: BRAND.white, light: "#F3F4F6" };
  }
};

const getLOBIcon = (lob: string) => {
  const cls = "w-4 h-4";
  switch (lob) {
    case "Commercial":
      return <Building2 className={cls} />;
    case "Medicaid":
      return <Heart className={cls} />;
    case "Medicare":
      return <Users className={cls} />;
    case "FGS":
      return <Briefcase className={cls} />;
    case "Excel Pivots":
      return <FileSpreadsheet className={cls} />;
    default:
      return <LayoutDashboard className={cls} />;
  }
};

const getReportIcon = (reportType: string) => {
  const cls = "w-4 h-4";
  switch (reportType) {
    case "Visual":
      return <TrendingUp className={cls} />;
    case "Matrix":
      return <LayoutDashboard className={cls} />;
    case "CVD":
      return <Activity className={cls} />;
    case "Capitation":
      return <DollarSign className={cls} />;
    case "Restated":
      return <FileSpreadsheet className={cls} />;
    default:
      return <LayoutDashboard className={cls} />;
  }
};

const getProviderIcon = (provider: string) => {
  switch (provider) {
    case "powerbi":
      return <BarChart3 className="w-4 h-4 text-yellow-600" />;
    case "internal":
      return <Zap className="w-4 h-4 text-blue-600" />;
    case "external":
      return <Globe className="w-4 h-4 text-green-600" />;
    default:
      return <LayoutDashboard className="w-4 h-4 text-gray-600" />;
  }
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function DashboardAdminPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("editor");
  const [menuData, setMenuData] = useState<DashboardMenu | null>(null);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [jsonText, setJsonText] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [editingItem, setEditingItem] = useState<ParsedDashboard | null>(null);

  // Filters
  const [filterPrimary, setFilterPrimary] = useState<string>("All");
  const [filterSecondary, setFilterSecondary] = useState<string>("All");
  const [filterLOB, setFilterLOB] = useState<string>("All");

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/admin/dashboard-inventory`);
      if (response.ok) {
        const data = await response.json();
        setMenuData(data.menu);
        setStats(data.stats);
        setJsonText(JSON.stringify(data.menu, null, 2));
      }
    } catch (error) {
      console.error("Failed to load inventory:", error);
      setMessage({ type: "error", text: "Failed to load dashboard inventory" });
    } finally {
      setLoading(false);
    }
  };

  const saveMenu = async () => {
    try {
      setSaving(true);
      let dataToSave = menuData;

      if (viewMode === "json") {
        try {
          dataToSave = JSON.parse(jsonText);
        } catch (e) {
          setMessage({ type: "error", text: "Invalid JSON format" });
          setSaving(false);
          return;
        }
      }

      const response = await fetch(`${API_URL}/dashboard-menu`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });

      if (response.ok) {
        const result = await response.json();
        setMenuData(result.data);
        setJsonText(JSON.stringify(result.data, null, 2));
        setHasChanges(false);
        setMessage({
          type: "success",
          text: "Dashboard menu saved successfully!",
        });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save dashboard menu" });
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setMessage({ type: "success", text: "Copied to clipboard!" });
    setTimeout(() => setMessage(null), 2000);
  };

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(menuData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dashboard-menu.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Parse all dashboards into flat list with hierarchy info
  const allDashboards = useMemo((): ParsedDashboard[] => {
    if (!menuData) return [];

    const dashboards: ParsedDashboard[] = [];

    menuData.categories.forEach((category) => {
      category.primaries.forEach((primary) => {
        primary.groups.forEach((group) => {
          group.items.forEach((item) => {
            const lob = extractLOB(item.label, item.key);
            dashboards.push({
              id: item.id,
              primaryCategory: category.label,
              secondaryCategory: primary.label,
              lob,
              reportType: extractReportType(item.key),
              provider: item.provider,
              type: item.type,
              bi: item.bi,
              app: item.app,
              key: item.key,
              categoryId: category.id,
              primaryId: primary.id,
              groupId: group.id,
            });
          });
        });
      });
    });

    return dashboards;
  }, [menuData]);

  // Get unique values for filters
  const primaryCategories = useMemo(() => {
    const cats = new Set(allDashboards.map((d) => d.primaryCategory));
    return ["All", ...Array.from(cats)];
  }, [allDashboards]);

  const secondaryCategories = useMemo(() => {
    let filtered = allDashboards;
    if (filterPrimary !== "All") {
      filtered = filtered.filter((d) => d.primaryCategory === filterPrimary);
    }
    const cats = new Set(filtered.map((d) => d.secondaryCategory));
    return ["All", ...Array.from(cats)];
  }, [allDashboards, filterPrimary]);

  const lobs = useMemo(() => {
    const lobSet = new Set(allDashboards.map((d) => d.lob));
    return ["All", ...Array.from(lobSet)];
  }, [allDashboards]);

  // Filtered dashboards
  const filteredDashboards = useMemo(() => {
    let filtered = allDashboards;

    if (filterPrimary !== "All") {
      filtered = filtered.filter((d) => d.primaryCategory === filterPrimary);
    }
    if (filterSecondary !== "All") {
      filtered = filtered.filter(
        (d) => d.secondaryCategory === filterSecondary,
      );
    }
    if (filterLOB !== "All") {
      filtered = filtered.filter((d) => d.lob === filterLOB);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.primaryCategory.toLowerCase().includes(query) ||
          d.secondaryCategory.toLowerCase().includes(query) ||
          d.lob.toLowerCase().includes(query) ||
          d.reportType.toLowerCase().includes(query) ||
          (d.key && d.key.toLowerCase().includes(query)),
      );
    }

    return filtered;
  }, [allDashboards, filterPrimary, filterSecondary, filterLOB, searchQuery]);

  // Update item in menu data
  const updateItem = (
    dashboard: ParsedDashboard,
    updates: Partial<DashboardItem>,
  ) => {
    if (!menuData) return;

    const newMenuData = { ...menuData };
    const category = newMenuData.categories.find(
      (c) => c.id === dashboard.categoryId,
    );
    if (!category) return;

    const primary = category.primaries.find(
      (p) => p.id === dashboard.primaryId,
    );
    if (!primary) return;

    const group = primary.groups.find((g) => g.id === dashboard.groupId);
    if (!group) return;

    const itemIndex = group.items.findIndex((i) => i.id === dashboard.id);
    if (itemIndex === -1) return;

    group.items[itemIndex] = { ...group.items[itemIndex], ...updates };

    setMenuData(newMenuData);
    setJsonText(JSON.stringify(newMenuData, null, 2));
    setHasChanges(true);
  };

  // Delete item
  const deleteItem = (dashboard: ParsedDashboard) => {
    if (!menuData) return;
    if (!confirm(`Delete "${dashboard.lob} - ${dashboard.reportType}"?`))
      return;

    const newMenuData = { ...menuData };
    const category = newMenuData.categories.find(
      (c) => c.id === dashboard.categoryId,
    );
    if (!category) return;

    const primary = category.primaries.find(
      (p) => p.id === dashboard.primaryId,
    );
    if (!primary) return;

    const group = primary.groups.find((g) => g.id === dashboard.groupId);
    if (!group) return;

    group.items = group.items.filter((i) => i.id !== dashboard.id);

    setMenuData(newMenuData);
    setJsonText(JSON.stringify(newMenuData, null, 2));
    setHasChanges(true);
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <RefreshCw
            className="w-12 h-12 mx-auto mb-4 animate-spin"
            style={{ color: BRAND.navy }}
          />
          <p className="text-gray-600">Loading dashboard inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: BRAND.navy }}
            >
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: BRAND.navy }}>
                Dashboard Administration
              </h1>
              <p className="text-sm text-gray-500">
                {stats?.totalDashboards || 0} dashboards •{" "}
                {stats?.categoriesCount || 0} categories
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {hasChanges && (
              <span className="text-xs text-amber-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Unsaved changes
              </span>
            )}
            <button
              onClick={loadInventory}
              disabled={loading}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw
                className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
              />
            </button>
            <button
              onClick={downloadJson}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Download JSON"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={saveMenu}
              disabled={saving || !hasChanges}
              className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              style={{ backgroundColor: BRAND.navy }}
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode("editor")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                viewMode === "editor"
                  ? "bg-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              style={{ color: viewMode === "editor" ? BRAND.navy : undefined }}
            >
              <LayoutDashboard className="w-4 h-4 inline mr-2" />
              Dashboard Editor
            </button>
            <button
              onClick={() => setViewMode("json")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                viewMode === "json"
                  ? "bg-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              style={{ color: viewMode === "json" ? BRAND.navy : undefined }}
            >
              <FileJson className="w-4 h-4 inline mr-2" />
              JSON Editor
            </button>
          </div>

          {/* Stats Pills */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full flex items-center gap-1">
              <BarChart3 className="w-3 h-3" />
              {stats?.providers.powerbi || 0} PowerBI
            </span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {stats?.providers.internal || 0} Internal
            </span>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center gap-1">
              <Globe className="w-3 h-3" />
              {stats?.providers.external || 0} External
            </span>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === "editor" && (
          <div className="h-full flex">
            {/* Filters Sidebar */}
            <div className="w-56 bg-white border-r border-gray-200 p-4 flex flex-col overflow-y-auto">
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                  style={
                    { "--tw-ring-color": BRAND.navy } as React.CSSProperties
                  }
                />
              </div>

              {/* Primary Category Filter */}
              <div className="mb-4">
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                  Primary Category
                </label>
                <select
                  value={filterPrimary}
                  onChange={(e) => {
                    setFilterPrimary(e.target.value);
                    setFilterSecondary("All");
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2"
                  style={
                    { "--tw-ring-color": BRAND.navy } as React.CSSProperties
                  }
                >
                  {primaryCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Secondary Category Filter */}
              <div className="mb-4">
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                  Report Type
                </label>
                <select
                  value={filterSecondary}
                  onChange={(e) => setFilterSecondary(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2"
                  style={
                    { "--tw-ring-color": BRAND.navy } as React.CSSProperties
                  }
                >
                  {secondaryCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* LOB Filter */}
              <div className="mb-4">
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                  Line of Business
                </label>
                <div className="space-y-1">
                  {lobs.map((lob) => {
                    const lobColor = getLOBColor(lob);
                    const isSelected = filterLOB === lob;
                    const count =
                      lob === "All"
                        ? allDashboards.length
                        : allDashboards.filter((d) => d.lob === lob).length;

                    return (
                      <button
                        key={lob}
                        onClick={() => setFilterLOB(lob)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                          isSelected ? "font-medium" : "hover:bg-gray-50"
                        }`}
                        style={{
                          backgroundColor: isSelected
                            ? lob === "All"
                              ? BRAND.navy
                              : lobColor.bg
                            : undefined,
                          color: isSelected ? BRAND.white : BRAND.textDark,
                        }}
                      >
                        {lob !== "All" && (
                          <span
                            style={{
                              color: isSelected ? BRAND.white : lobColor.bg,
                            }}
                          >
                            {getLOBIcon(lob)}
                          </span>
                        )}
                        <span className="flex-1 text-left">{lob}</span>
                        <span
                          className={`text-xs ${isSelected ? "opacity-70" : "text-gray-400"}`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Clear Filters */}
              {(filterPrimary !== "All" ||
                filterSecondary !== "All" ||
                filterLOB !== "All" ||
                searchQuery) && (
                <button
                  onClick={() => {
                    setFilterPrimary("All");
                    setFilterSecondary("All");
                    setFilterLOB("All");
                    setSearchQuery("");
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Dashboard List */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing {filteredDashboards.length} of {allDashboards.length}{" "}
                  dashboards
                </p>
                <button
                  onClick={() => {
                    // TODO: Add new dashboard modal
                    alert("Add new dashboard - Coming soon");
                  }}
                  className="px-3 py-2 text-sm font-medium text-white rounded-lg flex items-center gap-2"
                  style={{ backgroundColor: BRAND.navy }}
                >
                  <Plus className="w-4 h-4" />
                  Add Dashboard
                </button>
              </div>

              {/* Dashboard Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {filteredDashboards.map((dashboard) => {
                  const lobColor = getLOBColor(dashboard.lob);

                  return (
                    <div
                      key={dashboard.id}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {/* Card Header */}
                      <div
                        className="px-3 py-2 flex items-center gap-2"
                        style={{ backgroundColor: lobColor.light }}
                      >
                        <span style={{ color: lobColor.bg }}>
                          {getLOBIcon(dashboard.lob)}
                        </span>
                        <span
                          className="font-semibold text-sm flex-1"
                          style={{ color: lobColor.bg }}
                        >
                          {dashboard.lob}
                        </span>
                        {getProviderIcon(dashboard.provider)}
                      </div>

                      {/* Card Body */}
                      <div className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                          {getReportIcon(dashboard.reportType)}
                          <span
                            className="font-medium text-sm"
                            style={{ color: BRAND.textDark }}
                          >
                            {dashboard.reportType}
                          </span>
                        </div>

                        <div className="text-xs text-gray-500 mb-2">
                          <span>{dashboard.primaryCategory}</span>
                          <ChevronRight className="w-3 h-3 inline mx-1" />
                          <span>{dashboard.secondaryCategory}</span>
                        </div>

                        {dashboard.key && (
                          <div className="flex items-center gap-1 mb-2">
                            <code className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded font-mono text-gray-600">
                              {dashboard.key}
                            </code>
                            <button
                              onClick={() => copyToClipboard(dashboard.key!)}
                              className="p-0.5 hover:bg-gray-100 rounded"
                            >
                              <Copy className="w-3 h-3 text-gray-400" />
                            </button>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-1 pt-2 border-t border-gray-100">
                          <button
                            onClick={() => setEditingItem(dashboard)}
                            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded transition-colors"
                          >
                            <Edit2 className="w-3 h-3" />
                            Edit
                          </button>
                          {dashboard.bi?.embedUrl && (
                            <a
                              href={dashboard.bi.embedUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Open
                            </a>
                          )}
                          <button
                            onClick={() => deleteItem(dashboard)}
                            className="flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredDashboards.length === 0 && (
                <div className="text-center py-12">
                  <LayoutDashboard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No dashboards found</p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="mt-2 text-sm hover:underline"
                      style={{ color: BRAND.navy }}
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {viewMode === "json" && (
          <div className="h-full p-4">
            <div className="h-full bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
              <div className="p-4 flex-1 overflow-hidden">
                <textarea
                  value={jsonText}
                  onChange={(e) => {
                    setJsonText(e.target.value);
                    setHasChanges(true);
                  }}
                  className="w-full h-full font-mono text-sm p-4 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent bg-gray-50 resize-none"
                  style={
                    { "--tw-ring-color": BRAND.navy } as React.CSSProperties
                  }
                  spellCheck={false}
                />
              </div>
              <div className="px-4 pb-4 flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  Edit the JSON directly. Changes will be validated when you
                  save.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(jsonText)}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                  <button
                    onClick={downloadJson}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Item Modal */}
      {editingItem && (
        <EditItemModal
          dashboard={editingItem}
          onSave={(updates) => {
            updateItem(editingItem, updates);
            setEditingItem(null);
          }}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
}

// ============================================================================
// EDIT ITEM MODAL
// ============================================================================

interface EditItemModalProps {
  dashboard: ParsedDashboard;
  onSave: (updates: Partial<DashboardItem>) => void;
  onClose: () => void;
}

function EditItemModal({ dashboard, onSave, onClose }: EditItemModalProps) {
  const [label, setLabel] = useState(dashboard.lob);
  const [key, setKey] = useState(dashboard.key || "");
  const [embedUrl, setEmbedUrl] = useState(
    dashboard.bi?.embedUrl || dashboard.app?.url || "",
  );
  const [provider, setProvider] = useState(dashboard.provider);

  const handleSave = () => {
    const updates: Partial<DashboardItem> = {
      label,
      key,
      provider,
    };

    if (provider === "powerbi") {
      updates.bi = { ...dashboard.bi, embedUrl };
    } else {
      updates.app = { ...dashboard.app, url: embedUrl };
    }

    onSave(updates);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold" style={{ color: BRAND.navy }}>
            Edit Dashboard
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Label (LOB)
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              style={{ "--tw-ring-color": BRAND.navy } as React.CSSProperties}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Key
            </label>
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent font-mono text-sm"
              style={{ "--tw-ring-color": BRAND.navy } as React.CSSProperties}
              placeholder="e.g., COC_VISUAL_COMM"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Provider
            </label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              style={{ "--tw-ring-color": BRAND.navy } as React.CSSProperties}
            >
              <option value="powerbi">PowerBI</option>
              <option value="internal">Internal</option>
              <option value="external">External</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {provider === "powerbi" ? "Embed URL" : "App URL"}
            </label>
            <input
              type="text"
              value={embedUrl}
              onChange={(e) => setEmbedUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent font-mono text-sm"
              style={{ "--tw-ring-color": BRAND.navy } as React.CSSProperties}
              placeholder="https://..."
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">
              <strong>Location:</strong> {dashboard.primaryCategory} →{" "}
              {dashboard.secondaryCategory}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              <strong>Report Type:</strong> {dashboard.reportType}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors flex items-center gap-2"
            style={{ backgroundColor: BRAND.navy }}
          >
            <Check className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
