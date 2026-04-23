import { useState, useEffect } from "react";
import {
  AppWindow,
  RefreshCw,
  Save,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  CheckCircle,
  AlertCircle,
  Search,
  Download,
  Copy,
  Lightbulb,
  Heart,
  Globe,
  Zap,
  BarChart3,
  PieChart,
  Eye,
  Cloud,
  ExternalLink,
  GripVertical,
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

interface AppAuth {
  type: string;
  oktaAppId?: string;
  requiresToken?: boolean;
  adGroups?: string[]; // Active Directory Groups for authorization
}

// Environment URLs for different deployment environments
interface AppUrls {
  dev?: string;
  qa?: string;
  prod?: string;
}

// Access request configuration for documentation
interface AccessConfig {
  serviceNowUrl?: string; // ServiceNow form URL
  searchKeyword?: string; // What to search for in ServiceNow
  adGroupName?: string; // AD Group name to request
  accessInstructions?: string; // Custom instructions
}

interface App {
  id: string;
  name: string;
  description: string;
  category: string;
  provider: string;
  // OLD: url: string;
  url: string; // Legacy single URL (for backward compatibility)
  urls?: AppUrls; // NEW: Environment-specific URLs
  icon: string;
  color: string;
  auth: AppAuth;
  openMode: "embed" | "newTab" | "sameTab";
  isActive: boolean;
  order: number;
  accessConfig?: AccessConfig; // How users can request access
}

interface Provider {
  id: string;
  name: string;
  authType: string;
  icon: string;
  color: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const ICON_OPTIONS = [
  { id: "Lightbulb", label: "Lightbulb", icon: Lightbulb },
  { id: "Heart", label: "Heart", icon: Heart },
  { id: "Globe", label: "Globe", icon: Globe },
  { id: "Zap", label: "Zap", icon: Zap },
  { id: "BarChart3", label: "Chart", icon: BarChart3 },
  { id: "PieChart", label: "Pie Chart", icon: PieChart },
  { id: "Eye", label: "Eye", icon: Eye },
  { id: "Cloud", label: "Cloud", icon: Cloud },
  { id: "AppWindow", label: "App", icon: AppWindow },
];

const COLOR_OPTIONS = [
  "#F59E0B",
  "#EC4899",
  "#8B5CF6",
  "#3B82F6",
  "#10B981",
  "#EF4444",
  "#F97316",
  "#14B8A6",
  "#6366F1",
  "#84CC16",
];

const CATEGORY_OPTIONS = [
  "Analytics",
  "Quality",
  "Operations",
  "Finance",
  "Clinical",
  "Admin",
  "Other",
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getAppIcon = (iconName: string, className = "w-5 h-5") => {
  const IconComponent =
    ICON_OPTIONS.find((i) => i.id === iconName)?.icon || AppWindow;
  return <IconComponent className={className} />;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AppsAdminPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingApp, setEditingApp] = useState<App | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    appId: string;
    appName: string;
  }>({ show: false, appId: "", appName: "" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [appsRes, providersRes] = await Promise.all([
        fetch(`${API_URL}/apps`),
        fetch(`${API_URL}/apps/providers`),
      ]);

      if (appsRes.ok) {
        const data = await appsRes.json();
        setApps(data.apps || []);
      }

      if (providersRes.ok) {
        const data = await providersRes.json();
        setProviders(data.providers || []);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
      setMessage({ type: "error", text: "Failed to load apps" });
    } finally {
      setLoading(false);
    }
  };

  const saveApp = async (app: App) => {
    try {
      setSaving(true);
      const isNew = !app.id || app.id.startsWith("new-");

      // Generate a proper app ID for new apps
      const appToSave = isNew ? { ...app, id: `app-${Date.now()}` } : app;

      const url = isNew ? `${API_URL}/apps` : `${API_URL}/apps/${appToSave.id}`;
      const method = isNew ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appToSave),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setMessage({
            type: "success",
            text: `App ${isNew ? "created" : "updated"} successfully!`,
          });
          loadData();
          setEditingApp(null);
          setIsCreating(false);
        }
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save app" });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const confirmDelete = (appId: string, appName: string) => {
    setDeleteConfirm({ show: true, appId, appName });
  };

  const deleteApp = async () => {
    const { appId } = deleteConfirm;
    setDeleteConfirm({ show: false, appId: "", appName: "" });

    try {
      const response = await fetch(`${API_URL}/apps/${appId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setMessage({ type: "success", text: "App deleted successfully!" });
          await loadData();
        } else {
          setMessage({
            type: "error",
            text: result.message || "Failed to delete app",
          });
        }
      } else {
        setMessage({ type: "error", text: "Failed to delete app" });
      }
    } catch (error) {
      console.error("Delete error:", error);
      setMessage({ type: "error", text: "Failed to delete app" });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const toggleAppStatus = async (app: App) => {
    await saveApp({ ...app, isActive: !app.isActive });
  };

  const createNewApp = () => {
    const newApp: App = {
      id: `new-${Date.now()}`,
      name: "",
      description: "",
      category: "Analytics",
      provider: "internal",
      url: "",
      urls: { dev: "", qa: "", prod: "" }, // NEW: Environment-specific URLs
      icon: "AppWindow",
      color: "#3B82F6",
      auth: { type: "sso", oktaAppId: "", requiresToken: false, adGroups: [] },
      openMode: "embed",
      isActive: true,
      order: apps.length + 1,
    };
    setEditingApp(newApp);
    setIsCreating(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setMessage({ type: "success", text: "Copied to clipboard!" });
    setTimeout(() => setMessage(null), 2000);
  };

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify({ apps }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "apps-config.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Calculate stats from actual apps data
  const stats = {
    total: apps.length,
    active: apps.filter((a) => a.isActive).length,
    inactive: apps.filter((a) => !a.isActive).length,
    internal: apps.filter((a) => a.provider === "internal").length,
    external: apps.filter((a) => a.provider === "external").length,
    categories: new Set(apps.map((a) => a.category)).size,
  };

  // Filter apps
  const filteredApps = apps.filter(
    (app) =>
      !searchQuery ||
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Loading state
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <RefreshCw
            className="w-12 h-12 mx-auto mb-4 animate-spin"
            style={{ color: BRAND.navy }}
          />
          <p className="text-gray-600">Loading apps configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <AppWindow className="w-6 h-6 text-[#1A3673]" />
              Apps Administration
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage all applications in one place
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
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
              onClick={createNewApp}
              className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors flex items-center gap-2"
              style={{ backgroundColor: BRAND.turquoise }}
            >
              <Plus className="w-4 h-4" />
              Add App
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-6 gap-3 mb-4">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-gray-800">
              {stats.total}
            </div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
            <div className="text-xs text-gray-500">Active</div>
          </div>
          <div className="bg-red-50 rounded-lg p-3 text-center border border-red-200">
            <div className="text-2xl font-bold text-red-600">
              {stats.inactive}
            </div>
            <div className="text-xs text-red-500">Inactive</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.internal}
            </div>
            <div className="text-xs text-gray-500">Internal</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {stats.external}
            </div>
            <div className="text-xs text-gray-500">External</div>
          </div>
          <div className="bg-indigo-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {stats.categories}
            </div>
            <div className="text-xs text-gray-500">Categories</div>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search apps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent"
            style={{ "--tw-ring-color": BRAND.navy } as React.CSSProperties}
          />
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

      {/* Apps List */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className={`bg-white rounded-xl border overflow-hidden transition-all ${
                app.isActive
                  ? "border-gray-200 hover:shadow-md"
                  : "border-gray-200 opacity-60"
              }`}
            >
              {/* Card Header */}
              <div
                className="px-4 py-3 flex items-center gap-3"
                style={{ backgroundColor: app.color + "15" }}
              >
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: app.color + "30" }}
                >
                  <span style={{ color: app.color }}>
                    {getAppIcon(app.icon)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {app.name}
                  </h3>
                  <p className="text-xs text-gray-500">{app.category}</p>
                </div>
                <div className="flex items-center gap-1">
                  {!app.isActive && (
                    <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded">
                      Inactive
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {app.description}
                </p>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Provider:</span>
                    <span className="font-medium text-gray-700">
                      {app.provider}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Auth:</span>
                    <span
                      className={`px-1.5 py-0.5 rounded font-medium ${
                        app.auth.type === "okta"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {app.auth.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Open Mode:</span>
                    <span className="font-medium text-gray-700 flex items-center gap-1">
                      {app.openMode}
                      {app.openMode !== "embed" && (
                        <ExternalLink className="w-3 h-3" />
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 mt-3">
                  <code className="flex-1 text-[10px] bg-gray-100 px-2 py-1 rounded font-mono text-gray-600 truncate">
                    {app.url}
                  </code>
                  <button
                    onClick={() => copyToClipboard(app.url)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Copy className="w-3 h-3 text-gray-400" />
                  </button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 mt-3 border-t border-gray-100">
                  <button
                    onClick={() => setEditingApp(app)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => toggleAppStatus(app)}
                    className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                      app.isActive
                        ? "text-amber-600 hover:bg-amber-50"
                        : "text-green-600 hover:bg-green-50"
                    }`}
                  >
                    {app.isActive ? "Disable" : "Enable"}
                  </button>
                  <button
                    onClick={() => confirmDelete(app.id, app.name)}
                    className="flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredApps.length === 0 && (
          <div className="text-center py-12">
            <AppWindow className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No apps found</p>
            <button
              onClick={createNewApp}
              className="mt-4 px-4 py-2 text-sm font-medium rounded-lg text-white"
              style={{ backgroundColor: BRAND.turquoise }}
            >
              Add your first app
            </button>
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      {editingApp && (
        <AppEditorModal
          app={editingApp}
          providers={providers}
          isCreating={isCreating}
          saving={saving}
          onSave={saveApp}
          onClose={() => {
            setEditingApp(null);
            setIsCreating(false);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className="bg-red-50 px-6 py-4 border-b border-red-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Delete Application
                  </h3>
                  <p className="text-sm text-gray-600">
                    This action cannot be undone
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4">
              <p className="text-gray-700">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-900">
                  {deleteConfirm.appName}
                </span>
                ?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                This will permanently remove the application from the system.
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() =>
                  setDeleteConfirm({ show: false, appId: "", appName: "" })
                }
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteApp}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete App
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// APP EDITOR MODAL
// ============================================================================

interface AppEditorModalProps {
  app: App;
  providers: Provider[];
  isCreating: boolean;
  saving: boolean;
  onSave: (app: App) => void;
  onClose: () => void;
}

function AppEditorModal({
  app,
  providers,
  isCreating,
  saving,
  onSave,
  onClose,
}: AppEditorModalProps) {
  const [formData, setFormData] = useState<App>(app);

  const handleChange = (field: keyof App, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAuthChange = (field: keyof AppAuth, value: any) => {
    setFormData((prev) => ({
      ...prev,
      auth: { ...prev.auth, [field]: value },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold" style={{ color: BRAND.navy }}>
            {isCreating ? "Add New App" : "Edit App"}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                App Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                style={{ "--tw-ring-color": BRAND.navy } as React.CSSProperties}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                style={{ "--tw-ring-color": BRAND.navy } as React.CSSProperties}
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
              style={{ "--tw-ring-color": BRAND.navy } as React.CSSProperties}
              rows={2}
            />
          </div>

          {/* Environment URLs */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Environment URLs
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Production URL
                  </span>
                </label>
                <input
                  type="url"
                  value={formData.urls?.prod || ""}
                  onChange={(e) =>
                    handleChange("urls", {
                      ...formData.urls,
                      prod: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent font-mono text-sm"
                  style={
                    { "--tw-ring-color": BRAND.navy } as React.CSSProperties
                  }
                  placeholder="https://app.example.com/"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                    QA URL
                  </span>
                </label>
                <input
                  type="url"
                  value={formData.urls?.qa || ""}
                  onChange={(e) =>
                    handleChange("urls", {
                      ...formData.urls,
                      qa: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent font-mono text-sm"
                  style={
                    { "--tw-ring-color": BRAND.navy } as React.CSSProperties
                  }
                  placeholder="https://qa.app.example.com/"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Development URL
                  </span>
                </label>
                <input
                  type="url"
                  value={formData.urls?.dev || ""}
                  onChange={(e) =>
                    handleChange("urls", {
                      ...formData.urls,
                      dev: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent font-mono text-sm"
                  style={
                    { "--tw-ring-color": BRAND.navy } as React.CSSProperties
                  }
                  placeholder="https://dev.app.example.com/"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Configure URLs for each environment. The app will use the URL
              matching the current environment.
            </p>
          </div>

          {/* Legacy URL (for backward compatibility) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default URL{" "}
              <span className="text-xs text-gray-400">
                (fallback if no env URL set)
              </span>
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => handleChange("url", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent font-mono text-sm"
              style={{ "--tw-ring-color": BRAND.navy } as React.CSSProperties}
              placeholder="https://..."
            />
          </div>

          {/* Provider & Open Mode */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Provider
              </label>
              <select
                value={formData.provider}
                onChange={(e) => handleChange("provider", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                style={{ "--tw-ring-color": BRAND.navy } as React.CSSProperties}
              >
                {providers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Open Mode
              </label>
              <select
                value={formData.openMode}
                onChange={(e) => handleChange("openMode", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                style={{ "--tw-ring-color": BRAND.navy } as React.CSSProperties}
              >
                <option value="embed">Embed (iframe)</option>
                <option value="newTab">New Tab</option>
                <option value="sameTab">Same Tab</option>
              </select>
            </div>
          </div>

          {/* Authentication & Authorization */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Authentication & Authorization
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Auth Type
                </label>
                <select
                  value={formData.auth.type}
                  onChange={(e) => handleAuthChange("type", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={
                    { "--tw-ring-color": BRAND.navy } as React.CSSProperties
                  }
                >
                  <option value="sso">SSO</option>
                  <option value="okta">OKTA</option>
                  <option value="oauth">OAuth</option>
                  <option value="none">None</option>
                </select>
              </div>
              {formData.auth.type === "okta" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    OKTA App ID
                  </label>
                  <input
                    type="text"
                    value={formData.auth.oktaAppId || ""}
                    onChange={(e) =>
                      handleAuthChange("oktaAppId", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={
                      { "--tw-ring-color": BRAND.navy } as React.CSSProperties
                    }
                    placeholder="app-id"
                  />
                </div>
              )}
            </div>

            {/* AD Groups */}
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Active Directory Groups
              </label>
              <div className="space-y-2">
                {(formData.auth.adGroups || []).map((group, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={group}
                      onChange={(e) => {
                        const newGroups = [...(formData.auth.adGroups || [])];
                        newGroups[idx] = e.target.value;
                        handleAuthChange("adGroups", newGroups);
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                      placeholder="CN=Group,OU=Groups,DC=company,DC=com"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newGroups = (formData.auth.adGroups || []).filter(
                          (_, i) => i !== idx,
                        );
                        handleAuthChange("adGroups", newGroups);
                      }}
                      className="px-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    handleAuthChange("adGroups", [
                      ...(formData.auth.adGroups || []),
                      "",
                    ])
                  }
                  className="text-sm text-blue-600 hover:underline"
                >
                  + Add AD Group
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Users must be members of at least one group to access this app
              </p>
            </div>

            <label className="flex items-center gap-2 mt-3">
              <input
                type="checkbox"
                checked={formData.auth.requiresToken || false}
                onChange={(e) =>
                  handleAuthChange("requiresToken", e.target.checked)
                }
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-600">
                Requires token passthrough
              </span>
            </label>
          </div>

          {/* Access Request Configuration */}
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Access Request Configuration
              <span className="text-xs font-normal text-gray-500">
                (for Documentation page)
              </span>
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  ServiceNow Form URL
                </label>
                <input
                  type="url"
                  value={formData.accessConfig?.serviceNowUrl || ""}
                  onChange={(e) =>
                    handleChange("accessConfig", {
                      ...formData.accessConfig,
                      serviceNowUrl: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                  placeholder="https://elevancehealth.service-now.com/ess?id=..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Search Keyword in ServiceNow
                </label>
                <input
                  type="text"
                  value={formData.accessConfig?.searchKeyword || ""}
                  onChange={(e) =>
                    handleChange("accessConfig", {
                      ...formData.accessConfig,
                      searchKeyword: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="e.g., Network Active Directory Group User Access"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  AD Group Name to Request
                </label>
                <input
                  type="text"
                  value={formData.accessConfig?.adGroupName || ""}
                  onChange={(e) =>
                    handleChange("accessConfig", {
                      ...formData.accessConfig,
                      adGroupName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                  placeholder="e.g., EDL-MIRA-PROD or COCAI_APP_USERS_PROD"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Additional Instructions
                </label>
                <textarea
                  value={formData.accessConfig?.accessInstructions || ""}
                  onChange={(e) =>
                    handleChange("accessConfig", {
                      ...formData.accessConfig,
                      accessInstructions: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  rows={2}
                  placeholder="Any special instructions for requesting access..."
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              This info will appear in Documentation → "How to Get App Access"
              section.
            </p>
          </div>

          {/* Icon & Color */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon
              </label>
              <div className="flex flex-wrap gap-2">
                {ICON_OPTIONS.map(({ id, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleChange("icon", id)}
                    className={`p-2 rounded-lg border transition-colors ${
                      formData.icon === id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{ color: formData.color }}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleChange("color", color)}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${
                      formData.color === color
                        ? "border-gray-800 scale-110"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Active Status */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => handleChange("isActive", e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-600">
              App is active and visible to users
            </span>
          </label>
        </form>

        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            disabled={saving || !formData.name || !formData.url}
            className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            style={{ backgroundColor: BRAND.turquoise }}
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                {isCreating ? "Create App" : "Save Changes"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
