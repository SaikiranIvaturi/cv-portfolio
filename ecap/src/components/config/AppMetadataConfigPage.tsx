import { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  CheckCircle2,
  XCircle,
  Upload,
  Search,
  Copy,
} from "lucide-react";

import { API_BASE_URL as API_URL } from "../../config/api";
interface AppMetadataConfigPageProps {
  onNavigate?: (page: string) => void;
}

interface AppMetadata {
  id?: string;
  appKey: string;
  category: string;
  primaryName: string;
  module1?: string | null;
  module2?: string | null;
  displayName?: string;
  description: string;
  icon?: string;
  resourceType: string;
  url: string;
  powerbi?: {
    workspaceId?: string;
    reportId?: string;
    pageName?: string;
    embedMode?: string;
  } | null;
  requiresAuth: boolean;
  authType: string;
  permissions: string[];
  status: string;
  statusMessage?: string | null;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  visibleToRoles?: string[] | null;
  categoryVisibleToRoles?: string[] | null;
}

const resourceTypes = [
  "powerbi",
  "internal_app",
  "external_app",
  "thoughtspot",
  "api",
  "web",
];
const authTypes = ["sso", "powerbi", "api_key", "oauth", "none"];
const statuses = ["active", "coming_soon", "deprecated", "maintenance"];
const availableRoles = ["business", "developer", "admin", "architect"];
const categories = [
  "TREND & INSIGHTS",
  "IDEATION & INTERVENTIONS",
  "SAVINGS",
  "QUALITY & HEALTH EQUITY",
  "INTELLIGENT INQUIRY",
  "PLATFORM METRICS",
  "EXECUTIVE DASHBOARDS",
  "POWERBI REPORTS",
];

export default function AppMetadataConfigPage({}: AppMetadataConfigPageProps = {}) {
  const [apps, setApps] = useState<AppMetadata[]>([]);
  const [filteredApps, setFilteredApps] = useState<AppMetadata[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingApp, setEditingApp] = useState<AppMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterResourceType, setFilterResourceType] = useState("all");
  const categories = Array.from(
    new Set(apps.map((app) => app.category).filter(Boolean)),
  ).sort();

  const emptyApp: AppMetadata = {
    appKey: "",
    category: "TREND & INSIGHTS",
    primaryName: "",
    module1: null,
    module2: null,
    description: "",
    icon: "LayoutDashboard",
    resourceType: "powerbi",
    url: "",
    requiresAuth: true,
    authType: "sso",
    permissions: [],
    status: "active",
    statusMessage: null,
    isActive: true,
    isFeatured: false,
    sortOrder: 0,
    tags: [],
  };

  useEffect(() => {
    fetchApps();
  }, []);

  useEffect(() => {
    filterApps();
  }, [apps, searchQuery, filterCategory, filterResourceType]);

  const fetchApps = async () => {
    try {
      setLoading(true);
      console.log(
        "Fetching from:",
        `${API_URL}/app-metadata?active_only=false`,
      );
      const response = await fetch(`${API_URL}/app-metadata?active_only=false`);
      const data = await response.json();
      console.log("Received data:", data);
      setApps(data.apps || []);
      setError(null);
    } catch (err) {
      setError("Failed to load app metadata");
      console.error("Error loading app metadata:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterApps = () => {
    let filtered = [...apps];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.displayName?.toLowerCase().includes(query) ||
          app.primaryName.toLowerCase().includes(query) ||
          app.appKey.toLowerCase().includes(query) ||
          app.description.toLowerCase().includes(query),
      );
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((app) => app.category === filterCategory);
    }

    if (filterResourceType !== "all") {
      filtered = filtered.filter(
        (app) => app.resourceType === filterResourceType,
      );
    }

    setFilteredApps(filtered);
  };

  const handleCreate = () => {
    setEditingApp(emptyApp);
    setIsEditing(true);
  };

  const handleEdit = (app: AppMetadata) => {
    setEditingApp({ ...app });
    setIsEditing(true);
  };

  const handleDuplicate = (app: AppMetadata) => {
    const duplicated = {
      ...app,
      id: undefined,
      appKey: `${app.appKey}_COPY`,
      displayName: `${app.displayName || app.primaryName} (Copy)`,
      primaryName: `${app.primaryName} (Copy)`,
    };
    setEditingApp(duplicated);
    setIsEditing(true);
  };

  const handleBulkUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);
        const appsToImport = data.apps || data;

        if (!Array.isArray(appsToImport)) {
          alert(
            "Invalid JSON format. Expected an array of apps or {apps: [...]}",
          );
          return;
        }

        const response = await fetch(`${API_URL}/app-metadata/bulk-import`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(appsToImport),
        });

        if (!response.ok) throw new Error("Bulk import failed");

        const result = await response.json();
        alert(
          `Import complete!\nCreated: ${result.created}\nUpdated: ${result.updated}\nErrors: ${result.errors?.length || 0}`,
        );

        await fetchApps();
      } catch (err) {
        alert(
          `Import failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        );
      }
    };
    input.click();
  };

  const handleCancel = () => {
    setEditingApp(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!editingApp) return;

    try {
      if (editingApp.id) {
        const response = await fetch(
          `${API_URL}/app-metadata/${editingApp.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editingApp),
          },
        );
        if (!response.ok) throw new Error("Failed to update app");
      } else {
        const response = await fetch(`${API_URL}/app-metadata`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingApp),
        });
        if (!response.ok) throw new Error("Failed to create app");
      }

      await fetchApps();
      handleCancel();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save app");
      console.error("Error saving app:", err);
    }
  };

  const handleDelete = async (appId: string) => {
    if (!confirm("Are you sure you want to delete this app?")) return;

    try {
      const response = await fetch(`${API_URL}/app-metadata/${appId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete app");

      await fetchApps();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete app");
      console.error("Error deleting app:", err);
    }
  };

  const toggleRow = (appId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(appId)) {
      newExpanded.delete(appId);
    } else {
      newExpanded.add(appId);
    }
    setExpandedRows(newExpanded);
  };

  const hasChildren = (app: AppMetadata) => {
    // Check if app has children in metadata
    return false; // Will be populated from backend
  };

  const handleInputChange = (field: keyof AppMetadata, value: any) => {
    if (!editingApp) return;
    setEditingApp({ ...editingApp, [field]: value });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "coming_soon":
        return "bg-blue-100 text-blue-800";
      case "deprecated":
        return "bg-red-100 text-red-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getResourceTypeBadgeColor = (type: string) => {
    switch (type) {
      case "powerbi":
        return "bg-yellow-100 text-yellow-800";
      case "internal_app":
        return "bg-blue-100 text-blue-800";
      case "external_app":
        return "bg-purple-100 text-purple-800";
      case "thoughtspot":
        return "bg-orange-100 text-orange-800";
      case "api":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading app metadata...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
          <XCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-800">{error}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={filterResourceType}
            onChange={(e) => setFilterResourceType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Resource Types</option>
            {resourceTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Configured Apps
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Showing {filteredApps.length} of {apps.length} apps
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleBulkUpload}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              title="Import apps from JSON file"
            >
              <Upload className="w-5 h-5" />
              Bulk Upload
            </button>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add App
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  App Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Resource Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredApps.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    {searchQuery ||
                    filterCategory !== "all" ||
                    filterResourceType !== "all"
                      ? "No apps match your filters"
                      : 'No apps configured yet. Click "Add App" to get started.'}
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {app.displayName || app.primaryName}
                      </div>
                      <div className="text-sm text-gray-500">
                        Key: {app.appKey}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {app.category || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getResourceTypeBadgeColor(app.resourceType)}`}
                      >
                        {app.resourceType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(app.status)}`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {app.categoryVisibleToRoles &&
                      app.categoryVisibleToRoles.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {app.categoryVisibleToRoles.map((role) => (
                            <span
                              key={role}
                              className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 font-medium"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">All Users</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(app)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(app)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Duplicate"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => app.id && handleDelete(app.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isEditing && editingApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingApp.id ? "Edit App" : "Add New App"}
              </h3>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    App Key *
                  </label>
                  <input
                    type="text"
                    value={editingApp.appKey}
                    onChange={(e) =>
                      handleInputChange("appKey", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g., COC_VISUAL_COMM"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={editingApp.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Name *
                </label>
                <input
                  type="text"
                  value={editingApp.primaryName}
                  onChange={(e) =>
                    handleInputChange("primaryName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={editingApp.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resource Type *
                  </label>
                  <select
                    value={editingApp.resourceType}
                    onChange={(e) =>
                      handleInputChange("resourceType", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {resourceTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status *
                  </label>
                  <select
                    value={editingApp.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL *
                </label>
                <input
                  type="text"
                  value={editingApp.url}
                  onChange={(e) => handleInputChange("url", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visible To Roles
                  <span className="text-xs text-gray-500 ml-2">
                    (Leave empty for all users)
                  </span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableRoles.map((role) => {
                    const isSelected =
                      editingApp.categoryVisibleToRoles?.includes(role) ||
                      false;
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => {
                          const currentRoles =
                            editingApp.categoryVisibleToRoles || [];
                          const newRoles = isSelected
                            ? currentRoles.filter((r) => r !== role)
                            : [...currentRoles, role];
                          handleInputChange(
                            "categoryVisibleToRoles",
                            newRoles.length > 0 ? newRoles : null,
                          );
                        }}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          isSelected
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {role}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Selected roles:{" "}
                  {editingApp.categoryVisibleToRoles &&
                  editingApp.categoryVisibleToRoles.length > 0
                    ? editingApp.categoryVisibleToRoles.join(", ")
                    : "All users"}
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
