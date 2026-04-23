import { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  CheckCircle2,
  XCircle,
  Key,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { dashboardKeys, categoryPresets } from "../../data/dashboardKeys";
import { API_BASE_URL } from "../../config/api";

interface ReportsConfigPageProps {
  onNavigate?: (page: string) => void;
}

interface PowerBIReport {
  id?: string;
  name: string;
  description: string;
  dashboardKey: string;
  workspaceId: string;
  reportId: string;
  pageName: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function ReportsConfigPage({
  onNavigate,
}: ReportsConfigPageProps) {
  const [reports, setReports] = useState<PowerBIReport[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingReport, setEditingReport] = useState<PowerBIReport | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const emptyReport: PowerBIReport = {
    name: "",
    description: "",
    dashboardKey: "",
    workspaceId: "",
    reportId: "",
    pageName: "ReportSection",
    isActive: true,
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/powerbi/reports?active_only=false`,
      );
      const data = await response.json();
      setReports(data.reports || []);
      setError(null);
    } catch (err) {
      setError("Failed to load reports");
      console.error("Error loading reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingReport(emptyReport);
    setIsEditing(true);
  };

  const handleEdit = (report: PowerBIReport) => {
    setEditingReport({ ...report });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditingReport(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!editingReport) return;

    try {
      if (editingReport.id) {
        const response = await fetch(
          `${API_BASE_URL}/powerbi/reports/${editingReport.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editingReport),
          },
        );
        if (!response.ok) throw new Error("Failed to update report");
      } else {
        const response = await fetch(`${API_BASE_URL}/powerbi/reports`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingReport),
        });
        if (!response.ok) throw new Error("Failed to create report");
      }

      await fetchReports();
      handleCancel();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save report");
      console.error("Error saving report:", err);
    }
  };

  const handleDelete = async (reportId: string) => {
    if (!confirm("Are you sure you want to delete this report?")) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/powerbi/reports/${reportId}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) throw new Error("Failed to delete report");

      await fetchReports();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete report");
      console.error("Error deleting report:", err);
    }
  };

  const handleInputChange = (
    field: keyof PowerBIReport,
    value: string | boolean,
  ) => {
    if (!editingReport) return;
    setEditingReport({ ...editingReport, [field]: value });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 overflow-auto">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            PowerBI Reports Configuration
          </h1>
          <p className="text-gray-600">
            Manage PowerBI report configurations. Each report is linked to a
            dashboard via its Dashboard Key.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Configured Reports
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate?.("dashboard-keys")}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Key className="w-5 h-5" />
                View Dashboard Keys
              </button>
              <button
                onClick={handleCreate}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Report
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Dashboard Key
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
                {reports.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No reports configured yet. Click "Add Report" to get
                      started.
                    </td>
                  </tr>
                ) : (
                  reports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {report.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {report.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                        {report.description}
                      </td>
                      <td className="px-6 py-4">
                        <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono text-gray-800">
                          {report.dashboardKey}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        {report.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            <CheckCircle2 className="w-4 h-4" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                            <XCircle className="w-4 h-4" />
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(report)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => report.id && handleDelete(report.id)}
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

        {isEditing && editingReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingReport.id ? "Edit Report" : "Add New Report"}
                </h3>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Report Name *
                  </label>
                  <input
                    type="text"
                    value={editingReport.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Financial Executive Report"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={editingReport.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                    placeholder="Brief description of the report"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dashboard Key *
                  </label>
                  <input
                    type="text"
                    value={editingReport.dashboardKey}
                    onChange={(e) =>
                      handleInputChange("dashboardKey", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                    placeholder="e.g., FIN_EXEC, COC_VISUAL_COMM"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Must match a dashboard key from the left navigation
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Workspace ID *
                  </label>
                  <input
                    type="text"
                    value={editingReport.workspaceId}
                    onChange={(e) =>
                      handleInputChange("workspaceId", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                    placeholder="e.g., me or workspace GUID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Report ID *
                  </label>
                  <input
                    type="text"
                    value={editingReport.reportId}
                    onChange={(e) =>
                      handleInputChange("reportId", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                    placeholder="PowerBI Report GUID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Page Name
                  </label>
                  <input
                    type="text"
                    value={editingReport.pageName}
                    onChange={(e) =>
                      handleInputChange("pageName", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                    placeholder="e.g., ReportSection"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={editingReport.isActive}
                    onChange={(e) =>
                      handleInputChange("isActive", e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="isActive"
                    className="text-sm font-medium text-gray-700"
                  >
                    Report is Active
                  </label>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Report
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>
              • Each report must have a <strong>Dashboard Key</strong> that
              matches a key in the left navigation
            </li>
            <li>
              • When a user clicks a dashboard in the left nav, all reports with
              that key will be loaded
            </li>
            <li>
              • Reports are stored in{" "}
              <code className="bg-blue-100 px-1 rounded">
                backend/reports_config.json
              </code>
            </li>
            <li>• Only active reports are displayed to end users</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
