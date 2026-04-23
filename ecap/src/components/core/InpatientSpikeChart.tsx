import { TrendingUp } from "lucide-react";

export function InpatientSpikeChart() {
  const ipAuthData = {
    title: "IP Auth - Commercial",
    period: "Oct-Aug 2025",
    snapshot: "Jan 2026",
    trend: "+1.5%",
    metric: "82,496",
    metricLabel: "Auth Claims",
    driver: "Volume Spike",
    color: "#1A3673",
    states: [
      { state: "CT", value: 45, label: "+45%" },
      { state: "WI", value: 29, label: "+29%" },
      { state: "VA", value: 10, label: "+10%" },
    ],
  };

  const ipMedSurgData = {
    title: "IP Med/Surg - Commercial",
    period: "Sep 2025",
    snapshot: "Jan 2026",
    trend: "+3.0%",
    metric: "$101.65",
    metricLabel: "PMPM Paid",
    driver: "Unit Cost Spike",
    color: "#1A3673",
    states: [
      { state: "CA", value: 22, label: "+22%" },
      { state: "CT", value: 21, label: "+21%" },
      { state: "VA", value: 7, label: "+7%" },
    ],
  };

  const maxValue = Math.max(
    ...ipAuthData.states.map((s) => s.value),
    ...ipMedSurgData.states.map((s) => s.value),
  );

  return (
    <div className="w-full h-full flex flex-col p-2.5">
      <div className="flex items-center justify-between mb-1.5">
        <div>
          <h3 className="text-xs font-bold text-[#1A3673]">
            Inpatient Trend Spikes - Top 3 States
          </h3>
          <p className="text-[8px] text-gray-500">
            3M Rolling | Oct-Aug 2025 | Snapshot: Jan 2026
          </p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-3 min-h-0">
        {/* IP Auth Section */}
        <div className="flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-1 pb-1 border-b border-gray-200">
            <div>
              <h4 className="text-[10px] font-bold text-[#1A3673]">
                {ipAuthData.title}
              </h4>
              <p className="text-[7px] text-gray-500">
                {ipAuthData.metric} | {ipAuthData.trend}
              </p>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-evenly py-0.5">
            {ipAuthData.states.map((state, idx) => (
              <div key={state.state} className="flex items-center gap-2">
                <span className="text-[9px] font-semibold text-gray-700 w-6">
                  {state.state}
                </span>
                <div className="flex-1 relative h-2.5 bg-gray-100 rounded overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full rounded"
                    style={{
                      width: `${Math.min((state.value / maxValue) * 96, 96)}%`,
                      backgroundColor: `${ipAuthData.color}40`,
                    }}
                  />
                </div>
                <span
                  className="text-[9px] font-bold w-10 text-right"
                  style={{ color: ipAuthData.color }}
                >
                  {state.label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-1 pt-1 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-[7px] text-gray-500">Driver:</span>
              <span className="text-[8px] font-semibold text-[#1A3673]">
                {ipAuthData.driver}
              </span>
            </div>
          </div>
        </div>

        {/* IP Med/Surg Section */}
        <div className="flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-1 pb-1 border-b border-gray-200">
            <div>
              <h4 className="text-[10px] font-bold text-[#1A3673]">
                {ipMedSurgData.title}
              </h4>
              <p className="text-[7px] text-gray-500">
                {ipMedSurgData.metric} | {ipMedSurgData.trend}
              </p>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-evenly py-0.5">
            {ipMedSurgData.states.map((state, idx) => (
              <div key={state.state} className="flex items-center gap-2">
                <span className="text-[9px] font-semibold text-gray-700 w-6">
                  {state.state}
                </span>
                <div className="flex-1 relative h-2.5 bg-gray-100 rounded overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full rounded"
                    style={{
                      width: `${Math.min((state.value / maxValue) * 96, 96)}%`,
                      backgroundColor: `${ipMedSurgData.color}40`,
                    }}
                  />
                </div>
                <span
                  className="text-[9px] font-bold w-10 text-right"
                  style={{ color: ipMedSurgData.color }}
                >
                  {state.label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-1 pt-1 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-[7px] text-gray-500">Driver:</span>
              <span className="text-[8px] font-semibold text-[#1A3673]">
                {ipMedSurgData.driver}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
