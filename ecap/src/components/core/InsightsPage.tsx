import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

export default function InsightsPage() {
  const insights = [
    {
      category: "Cost Drivers",
      title: "Out-of-Network Provider Concentration",
      description:
        "Regional Medical Center accounts for 34% of OON spend. Contract negotiation could yield $374K annual savings.",
      severity: "high",
      impact: "$374K",
      status: "action-required",
    },
    {
      category: "Utilization",
      title: "High-Cost Member Cohort Identified",
      description:
        "47 members driving 23% of total medical spend. Enhanced care management program recommended.",
      severity: "high",
      impact: "15-20% reduction",
      status: "action-required",
    },
    {
      category: "Quality",
      title: "Cardiovascular Procedure Appropriateness",
      description:
        "Prior authorization review suggests 8-12% of procedures could be optimized for clinical appropriateness.",
      severity: "medium",
      impact: "$125K",
      status: "in-review",
    },
    {
      category: "Pharmacy",
      title: "Biosimilar Conversion Opportunity",
      description:
        "Specialty pharmacy spend includes $89K in biologic medications with approved biosimilar alternatives.",
      severity: "medium",
      impact: "$89K",
      status: "action-required",
    },
    {
      category: "Network",
      title: "Emergency Department Utilization Pattern",
      description:
        "Non-emergent ED visits up 14% in Medicaid population. Enhanced primary care access recommended.",
      severity: "low",
      impact: "$45K",
      status: "monitoring",
    },
    {
      category: "Trend",
      title: "Surgical Complexity Increase",
      description:
        "Average case mix index for surgical admissions up 6.8%, indicating higher acuity cases.",
      severity: "low",
      impact: "Risk adjustment",
      status: "monitoring",
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "border-l-[#E3725F] bg-[#FBEAE7]";
      case "medium":
        return "border-l-[#44B8F3] bg-[#E3F4FD]";
      case "low":
        return "border-l-[#00BBBA] bg-[#D9F5F5]";
      default:
        return "border-l-gray-300 bg-gray-50";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "action-required":
        return (
          <span className="px-3 py-1 bg-[#E3725F] text-white text-xs font-semibold rounded-full">
            Action Required
          </span>
        );
      case "in-review":
        return (
          <span className="px-3 py-1 bg-[#44B8F3] text-white text-xs font-semibold rounded-full">
            In Review
          </span>
        );
      case "monitoring":
        return (
          <span className="px-3 py-1 bg-[#00BBBA] text-white text-xs font-semibold rounded-full">
            Monitoring
          </span>
        );
      default:
        return null;
    }
  };

  const summaryMetrics = [
    {
      label: "Total Potential Savings",
      value: "$633K",
      change: "+12%",
      trend: "up",
      color: "text-[#00BBBA]",
    },
    {
      label: "Action Items",
      value: "12",
      change: "+3",
      trend: "up",
      color: "text-[#E3725F]",
    },
    {
      label: "In Review",
      value: "5",
      change: "-2",
      trend: "down",
      color: "text-[#44B8F3]",
    },
    {
      label: "Completed This Month",
      value: "8",
      change: "+8",
      trend: "up",
      color: "text-[#00BBBA]",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-[#231E33] mb-2">
          Current Insights
        </h2>
        <p className="text-gray-600">
          Actionable intelligence derived from multi-source validation and
          confidence scoring
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {summaryMetrics.map((metric, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
          >
            <div className="text-sm text-gray-600 mb-1">{metric.label}</div>
            <div className={`text-3xl font-bold mb-2 ${metric.color}`}>
              {metric.value}
            </div>
            <div className="flex items-center gap-1">
              {metric.trend === "up" ? (
                <TrendingUp className="w-4 h-4 text-[#00BBBA]" />
              ) : (
                <TrendingDown className="w-4 h-4 text-[#E3725F]" />
              )}
              <span className="text-sm text-gray-600">
                {metric.change} from last month
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {insights.map((insight, idx) => (
          <div
            key={idx}
            className={`border-l-4 ${getSeverityColor(insight.severity)} rounded-lg p-6 shadow-sm`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-semibold text-[#1A3673] uppercase tracking-wide">
                    {insight.category}
                  </span>
                  {getStatusBadge(insight.status)}
                </div>
                <h3 className="text-lg font-semibold text-[#231E33] mb-2">
                  {insight.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {insight.description}
                </p>
              </div>
              <div className="ml-6 text-right">
                <div className="text-xs text-gray-600 mb-1">
                  Potential Impact
                </div>
                <div className="text-xl font-bold text-[#1A3673]">
                  {insight.impact}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-[#231E33] mb-4">
          Insight Generation Process
        </h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-[#E1EDFF] rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6 text-[#1A3673]" />
            </div>
            <h4 className="font-medium text-[#231E33] mb-2">Detection</h4>
            <p className="text-sm text-gray-600">
              AI algorithms scan certified metrics for anomalies and trends
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-[#E1EDFF] rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-[#1A3673]" />
            </div>
            <h4 className="font-medium text-[#231E33] mb-2">Validation</h4>
            <p className="text-sm text-gray-600">
              Cross-reference against multiple data sources for accuracy
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-[#E1EDFF] rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-[#1A3673]" />
            </div>
            <h4 className="font-medium text-[#231E33] mb-2">Action</h4>
            <p className="text-sm text-gray-600">
              Generate recommendations with estimated impact and ownership
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
