import { useState, useEffect } from "react";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  User,
  Calendar,
  Filter,
  ArrowLeft,
  LayoutDashboard,
} from "lucide-react";
import { api } from "../../services/api";

interface Action {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in_progress" | "pending";
  priority: "high" | "medium" | "low";
  assignedTo: string;
  createdDate: string;
  completedDate?: string;
  impact: string;
  source: string;
}

interface ActionDashboardProps {
  onNavigate?: (page: string) => void;
}

export default function ActionDashboard({
  onNavigate,
}: ActionDashboardProps = {}) {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActions();
  }, []);

  const loadActions = async () => {
    try {
      const response = await api.getAllActions();
      const dbActions = response.actions || [];

      // Convert database format to component format
      const formattedActions: Action[] = dbActions.map((action: any) => ({
        id: action.id,
        title: action.title,
        description: action.description,
        status: action.status,
        priority: action.priority,
        assignedTo: action.assigned_to || "Unassigned",
        createdDate: new Date(action.created_at).toISOString().split("T")[0],
        completedDate: action.completed_at
          ? new Date(action.completed_at).toISOString().split("T")[0]
          : undefined,
        impact: action.impact || "TBD",
        source: action.source,
      }));

      // Add some mock actions if database is empty
      if (formattedActions.length === 0) {
        formattedActions.push(
          {
            id: "1",
            title: "Review reimbursement policy for surgical procedures",
            description:
              "Update policy documentation for CPT codes 12001-12007 based on detected overpayment trends",
            status: "completed",
            priority: "high",
            assignedTo: "Provider Contract Team",
            createdDate: "2024-01-10",
            completedDate: "2024-01-14",
            impact: "$2.4M annual savings",
            source: "Universal Chat - Chat Analysis",
          },
          {
            id: "2",
            title: "Implement prior authorization for high-cost imaging",
            description:
              "Add prior auth requirements for MRI procedures showing 45% utilization increase",
            status: "in_progress",
            priority: "high",
            assignedTo: "HIP Adapter Team",
            createdDate: "2024-01-12",
            impact: "$1.8M estimated savings",
            source: "Auto-detect Flash Card",
          },
        );
      }

      setActions(formattedActions);
    } catch (error) {
      console.error("Failed to load actions:", error);
      // Fall back to mock data
      setActions([
        {
          id: "1",
          title: "Review reimbursement policy for surgical procedures",
          description:
            "Update policy documentation for CPT codes 12001-12007 based on detected overpayment trends",
          status: "completed",
          priority: "high",
          assignedTo: "Provider Contract Team",
          createdDate: "2024-01-10",
          completedDate: "2024-01-14",
          impact: "$2.4M annual savings",
          source: "Universal Chat - Chat Analysis",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredActions =
    filterStatus === "all"
      ? actions
      : actions.filter((a) => a.status === filterStatus);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "in_progress":
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "in_progress":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200";
      case "medium":
        return "bg-orange-50 text-orange-700 border-orange-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const stats = [
    {
      label: "Total actions",
      value: actions.length.toString(),
      icon: TrendingUp,
    },
    {
      label: "Completed",
      value: actions.filter((a) => a.status === "completed").length.toString(),
      icon: CheckCircle2,
    },
    {
      label: "In progress",
      value: actions
        .filter((a) => a.status === "in_progress")
        .length.toString(),
      icon: Clock,
    },
    {
      label: "Pending",
      value: actions.filter((a) => a.status === "pending").length.toString(),
      icon: AlertCircle,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A3673] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading actions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {onNavigate && (
        <div className="mb-4">
          <button
            onClick={() => onNavigate("dashboards")}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-[#1A3673] hover:bg-gray-50 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <LayoutDashboard className="w-4 h-4" />
            <span>Back to All Dashboards</span>
          </button>
        </div>
      )}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">{stat.label}</span>
                <Icon className="w-5 h-5 text-[#1A3673]" />
              </div>
              <div className="text-3xl font-bold text-[#231E33]">
                {stat.value}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-[#231E33] mb-2">
              Action tracking
            </h2>
            <p className="text-sm text-gray-600">
              Actions generated from AI analysis and flash card validations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3673] focus:border-transparent"
            >
              <option value="all">All statuses</option>
              <option value="completed">Completed</option>
              <option value="in_progress">In progress</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredActions.map((action) => (
            <div
              key={action.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(action.status)}
                    <h3 className="text-lg font-semibold text-[#231E33]">
                      {action.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-4">{action.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">{action.assignedTo}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">
                        Created:{" "}
                        {new Date(action.createdDate).toLocaleDateString()}
                      </span>
                    </div>
                    {action.completedDate && (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700">
                          Completed:{" "}
                          {new Date(action.completedDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 ml-6">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(action.status)}`}
                  >
                    {action.status.replace("_", " ").toUpperCase()}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(action.priority)}`}
                  >
                    {action.priority.toUpperCase()} PRIORITY
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <span className="text-gray-500">Impact: </span>
                    <span className="font-semibold text-[#00BBBA]">
                      {action.impact}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Source: </span>
                    <span className="font-medium text-gray-700">
                      {action.source}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
