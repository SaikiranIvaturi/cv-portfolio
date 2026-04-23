import { X, TrendingUp, TrendingDown } from "lucide-react";

interface KPIDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  kpiId: string;
}

export default function KPIDetailModal({
  isOpen,
  onClose,
  kpiId,
}: KPIDetailModalProps) {
  if (!isOpen) return null;

  const pmpmBreakdown = [
    {
      service: "IP",
      prior: "$136.36",
      current: "$128.09",
      diff: "$8.27",
      diffPct: "-6.1%",
      isPositive: true,
    },
    {
      service: "OP",
      prior: "$227.36",
      current: "$259.23",
      diff: "$31.87",
      diffPct: "14.0%",
      isPositive: false,
    },
    {
      service: "Phys",
      prior: "$155.79",
      current: "$171.30",
      diff: "$15.51",
      diffPct: "10.0%",
      isPositive: false,
    },
    {
      service: "Pharmacy Net Rebates",
      prior: "$124.41",
      current: "$142.65",
      diff: "$18.24",
      diffPct: "14.7%",
      isPositive: false,
    },
    {
      service: "Cpttn/Vendor",
      prior: "$40.35",
      current: "$86.67",
      diff: "$46.32",
      diffPct: "114.8%",
      isPositive: false,
    },
    {
      service: "Intrst/Net Reins/Oth Med",
      prior: "-$9.58",
      current: "-$6.33",
      diff: "$3.25",
      diffPct: "-33.9%",
      isPositive: true,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1A3673] to-[#2861BB] text-white p-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold mb-0.5">
              Expense Paid PMPM Breakdown
            </h2>
            <p className="text-xs text-blue-100">
              Commercial • Incurred Ending Month: Jan 2026
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-100px)]">
          {/* Summary Card */}
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-4 mb-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-600 mb-0.5">
                  Total Expense Paid PMPM
                </div>
                <div className="text-2xl font-bold text-[#1A3673]">$572.38</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-600 mb-0.5">
                  Change from Prior
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-red-500" />
                  <span className="text-lg font-bold text-red-500">$68.80</span>
                  <span className="text-sm font-semibold text-red-500">
                    13.7%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left p-2 text-xs font-bold text-gray-700">
                    Type of Service
                  </th>
                  <th className="text-right p-2 text-xs font-bold text-gray-700">
                    Prior
                  </th>
                  <th className="text-right p-2 text-xs font-bold text-gray-700">
                    Current
                  </th>
                  <th className="text-right p-2 text-xs font-bold text-gray-700">
                    Diff
                  </th>
                  <th className="text-right p-2 text-xs font-bold text-gray-700">
                    Diff %
                  </th>
                </tr>
              </thead>
              <tbody>
                {pmpmBreakdown.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-0.5 h-6 bg-gradient-to-b from-[#1A3673] to-[#2861BB] rounded"></div>
                        <span className="text-xs font-medium text-gray-900">
                          {row.service}
                        </span>
                      </div>
                    </td>
                    <td className="text-right p-2 text-xs text-gray-700 font-medium">
                      {row.prior}
                    </td>
                    <td className="text-right p-2 text-xs text-gray-900 font-semibold">
                      {row.current}
                    </td>
                    <td
                      className={`text-right p-2 text-xs font-semibold ${row.isPositive ? "text-green-600" : "text-red-600"}`}
                    >
                      {row.diff}
                    </td>
                    <td className="text-right p-2">
                      <div
                        className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          row.isPositive
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {row.isPositive ? (
                          <TrendingDown className="w-2.5 h-2.5" />
                        ) : (
                          <TrendingUp className="w-2.5 h-2.5" />
                        )}
                        {row.diffPct}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Note */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-gray-700">
              <span className="font-semibold">Note:</span> This breakdown shows
              the Type of Service contribution to the total Expense Paid PMPM
              for Commercial LOB. Positive variance (green) indicates cost
              reduction, while negative variance (red) indicates cost increase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
