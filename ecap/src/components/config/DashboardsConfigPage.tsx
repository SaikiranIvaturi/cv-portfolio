import React, { useState, useEffect } from "react";
import { Save, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";

import { API_BASE_URL as API_URL } from "../../config/api";

interface DashboardItem {
  id: string;
  path: string;
  label: string;
  type: string;
  provider: string;
  [key: string]: any;
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

const DashboardsConfigPage: React.FC = () => {
  const [menuData, setMenuData] = useState<DashboardMenu | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [jsonView, setJsonView] = useState(false);
  const [jsonText, setJsonText] = useState("");

  useEffect(() => {
    fetchDashboardMenu();
  }, []);

  const fetchDashboardMenu = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/dashboard-menu`);
      if (!response.ok) throw new Error("Failed to fetch dashboard menu");
      const data = await response.json();
      setMenuData(data);
      setJsonText(JSON.stringify(data, null, 2));
      setMessage(null);
    } catch (error) {
      setMessage({
        type: "error",
        text: `Error loading dashboard menu: ${error}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);

      let dataToSave = menuData;

      if (jsonView) {
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

      if (!response.ok) throw new Error("Failed to save dashboard menu");

      const result = await response.json();
      setMenuData(result.data);
      setJsonText(JSON.stringify(result.data, null, 2));
      setMessage({
        type: "success",
        text: "Dashboard menu saved successfully!",
      });

      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: `Error saving dashboard menu: ${error}`,
      });
    } finally {
      setSaving(false);
    }
  };

  const getTotalItems = () => {
    if (!menuData) return 0;
    let count = 0;
    menuData.categories.forEach((cat) => {
      cat.primaries.forEach((prim) => {
        prim.groups.forEach((group) => {
          count += group.items.length;
        });
      });
    });
    return count;
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading dashboard configuration...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">
              Dashboards Configuration
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage dashboard menu structure and items
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setJsonView(!jsonView)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {jsonView ? "Visual Editor" : "JSON Editor"}
            </button>
            <button
              onClick={fetchDashboardMenu}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Version:</span>
            <span className="font-semibold text-gray-900">
              {menuData?.version}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Categories:</span>
            <span className="font-semibold text-gray-900">
              {menuData?.categories.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Total Items:</span>
            <span className="font-semibold text-gray-900">
              {getTotalItems()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Last Updated:</span>
            <span className="font-semibold text-gray-900">
              {menuData?.generatedAt
                ? new Date(menuData.generatedAt).toLocaleString()
                : "N/A"}
            </span>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
              message.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
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
      <div className="flex-1 overflow-y-auto p-6">
        {jsonView ? (
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                className="w-full h-[600px] font-mono text-sm p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                spellCheck={false}
              />
              <p className="text-xs text-gray-500 mt-2">
                Edit the JSON directly. Changes will be validated when you save.
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto space-y-6">
            {menuData?.categories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {category.label}
                </h2>

                <div className="space-y-4">
                  {category.primaries.map((primary) => (
                    <div
                      key={primary.id}
                      className="border-l-4 border-blue-500 pl-4"
                    >
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {primary.label}
                      </h3>

                      {primary.groups.map((group) => (
                        <div key={group.id} className="ml-4 mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-md font-medium text-gray-700">
                              {group.label}
                            </h4>
                            <span className="text-sm text-gray-500">
                              {group.items.length} items
                            </span>
                          </div>

                          {group.items.length > 0 && (
                            <div className="space-y-2">
                              {group.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                                >
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900">
                                      {item.label}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {item.provider} • {item.type}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        item.provider === "powerbi"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-blue-100 text-blue-800"
                                      }`}
                                    >
                                      {item.provider}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardsConfigPage;
