import { TrendingUp, TrendingDown, Target, Activity } from "lucide-react";
import { useState } from "react";

export { InpatientSpikeChart } from "./InpatientSpikeChart";

interface DataPoint {
  quarter: string;
  commercial: number;
  medicare: number;
  medicaid: number;
}

const mlrData: DataPoint[] = [
  { quarter: "Q1", commercial: 82.4, medicare: 86.2, medicaid: 89.1 },
  { quarter: "Q2", commercial: 83.1, medicare: 85.8, medicaid: 88.7 },
  { quarter: "Q3", commercial: 84.2, medicare: 87.1, medicaid: 90.2 },
  { quarter: "Q4", commercial: 83.8, medicare: 86.5, medicaid: 89.5 },
];

const anthemColors = {
  commercial: "#44B8F3",
  medicare: "#1A3673",
  medicaid: "#00BBBA",
};

const revenueData = [
  { lob: "Commercial", value: 124.5, change: "+8.2%" },
  { lob: "Medicare", value: 89.3, change: "+5.7%" },
  { lob: "Medicaid", value: 67.8, change: "+3.1%" },
];

const costTrendData = [
  { month: "Jul", value: 281.2 },
  { month: "Aug", value: 285.7 },
  { month: "Sep", value: 279.5 },
  { month: "Oct", value: 289.3 },
  { month: "Nov", value: 295.8 },
  { month: "Dec", value: 281.6 },
];

export function MLRChart() {
  const maxValue = 92;
  const minValue = 80;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-bold text-[#1A3673]">
            Medical Loss Ratio
          </h3>
          <p className="text-[10px] text-gray-500">Performance by LOB</p>
        </div>
        <div className="text-right">
          <div className="text-base font-bold text-[#1A3673]">85.4%</div>
          <div className="text-[10px] text-[#00BBBA] flex items-center justify-end gap-0.5">
            <TrendingDown className="w-2.5 h-2.5" />
            <span className="font-semibold">-0.8%</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative min-h-0">
        <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500 pr-2 w-8">
          <div>92%</div>
          <div>89%</div>
          <div>86%</div>
          <div>83%</div>
          <div>80%</div>
        </div>

        <svg
          className="w-full h-full pl-10"
          viewBox="0 0 500 200"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient
              id="commercialGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#44B8F3" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#44B8F3" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="medicareGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#1A3673" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#1A3673" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="medicaidGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#00BBBA" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00BBBA" stopOpacity="0" />
            </linearGradient>
          </defs>

          <line
            x1="0"
            y1="200"
            x2="500"
            y2="200"
            stroke="#e5e7eb"
            strokeWidth="1"
          />

          {mlrData.map((point, idx) => (
            <line
              key={`grid-${idx}`}
              x1={idx * 125 + 62.5}
              y1={0}
              x2={idx * 125 + 62.5}
              y2={200}
              stroke="#f3f4f6"
              strokeWidth="1"
            />
          ))}

          <polyline
            points={mlrData
              .map(
                (point, idx) =>
                  `${idx * 125 + 62.5},${200 - ((point.commercial - minValue) / (maxValue - minValue)) * 200}`,
              )
              .join(" ")}
            fill="none"
            stroke={anthemColors.commercial}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <polyline
            points={mlrData
              .map(
                (point, idx) =>
                  `${idx * 125 + 62.5},${200 - ((point.medicare - minValue) / (maxValue - minValue)) * 200}`,
              )
              .join(" ")}
            fill="none"
            stroke={anthemColors.medicare}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <polyline
            points={mlrData
              .map(
                (point, idx) =>
                  `${idx * 125 + 62.5},${200 - ((point.medicaid - minValue) / (maxValue - minValue)) * 200}`,
              )
              .join(" ")}
            fill="none"
            stroke={anthemColors.medicaid}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {mlrData.map((point, idx) => (
            <g key={`dots-${idx}`}>
              <circle
                cx={idx * 125 + 62.5}
                cy={
                  200 -
                  ((point.commercial - minValue) / (maxValue - minValue)) * 200
                }
                r="6"
                fill={anthemColors.commercial}
                stroke="white"
                strokeWidth="2"
              />
              <circle
                cx={idx * 125 + 62.5}
                cy={
                  200 -
                  ((point.medicare - minValue) / (maxValue - minValue)) * 200
                }
                r="6"
                fill={anthemColors.medicare}
                stroke="white"
                strokeWidth="2"
              />
              <circle
                cx={idx * 125 + 62.5}
                cy={
                  200 -
                  ((point.medicaid - minValue) / (maxValue - minValue)) * 200
                }
                r="6"
                fill={anthemColors.medicaid}
                stroke="white"
                strokeWidth="2"
              />
            </g>
          ))}
        </svg>

        <div className="absolute bottom-0 left-10 right-0 flex justify-around text-xs text-gray-600 font-medium">
          {mlrData.map((point) => (
            <div key={point.quarter}>{point.quarter}</div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 mt-2 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: anthemColors.commercial }}
          ></div>
          <span className="text-[10px] font-medium text-gray-700">
            Commercial
          </span>
          <span className="text-[10px] font-bold text-[#1A3673]">83.8%</span>
        </div>
        <div className="flex items-center gap-1">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: anthemColors.medicare }}
          ></div>
          <span className="text-[10px] font-medium text-gray-700">
            Medicare
          </span>
          <span className="text-[10px] font-bold text-[#1A3673]">86.5%</span>
        </div>
        <div className="flex items-center gap-1">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: anthemColors.medicaid }}
          ></div>
          <span className="text-[10px] font-medium text-gray-700">
            Medicaid
          </span>
          <span className="text-[10px] font-bold text-[#1A3673]">89.5%</span>
        </div>
      </div>
    </div>
  );
}

export function MemberMonthsChart() {
  const memberData = [
    { month: "Jul", commercial: 1.82, medicare: 1.24, medicaid: 0.98 },
    { month: "Aug", commercial: 1.85, medicare: 1.26, medicaid: 0.99 },
    { month: "Sep", commercial: 1.88, medicare: 1.28, medicaid: 1.01 },
    { month: "Oct", commercial: 1.91, medicare: 1.31, medicaid: 1.02 },
    { month: "Nov", commercial: 1.94, medicare: 1.33, medicaid: 1.04 },
    { month: "Dec", commercial: 1.97, medicare: 1.35, medicaid: 1.05 },
  ];

  const totalCurrent = 1.97 + 1.35 + 1.05; // 4.37M
  const maxValue = 2.2;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-bold text-[#1A3673]">Member Months</h3>
          <p className="text-[10px] text-gray-500">Millions by LOB</p>
        </div>
        <div className="text-right">
          <div className="text-base font-bold text-[#1A3673]">4.37M</div>
          <div className="text-[10px] text-[#00BBBA] flex items-center justify-end gap-0.5">
            <TrendingUp className="w-2.5 h-2.5" />
            <span className="font-semibold">+3.2%</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative min-h-0">
        <svg
          className="w-full h-full"
          viewBox="0 0 500 180"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient
              id="commMemberGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#44B8F3" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#44B8F3" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient
              id="medcareMemberGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#1A3673" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1A3673" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient
              id="medcaidMemberGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#00BBBA" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00BBBA" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          <line
            x1="0"
            y1="180"
            x2="500"
            y2="180"
            stroke="#e5e7eb"
            strokeWidth="1"
          />

          {/* Commercial Line */}
          <polyline
            points={memberData
              .map(
                (point, idx) =>
                  `${idx * 83.3 + 41.65},${180 - (point.commercial / maxValue) * 160}`,
              )
              .join(" ")}
            fill="none"
            stroke="#44B8F3"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Medicare Line */}
          <polyline
            points={memberData
              .map(
                (point, idx) =>
                  `${idx * 83.3 + 41.65},${180 - (point.medicare / maxValue) * 160}`,
              )
              .join(" ")}
            fill="none"
            stroke="#1A3673"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Medicaid Line */}
          <polyline
            points={memberData
              .map(
                (point, idx) =>
                  `${idx * 83.3 + 41.65},${180 - (point.medicaid / maxValue) * 160}`,
              )
              .join(" ")}
            fill="none"
            stroke="#00BBBA"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {memberData.map((point, idx) => (
            <g key={idx}>
              <circle
                cx={idx * 83.3 + 41.65}
                cy={180 - (point.commercial / maxValue) * 160}
                r="4"
                fill="#44B8F3"
                stroke="white"
                strokeWidth="2"
              />
              <circle
                cx={idx * 83.3 + 41.65}
                cy={180 - (point.medicare / maxValue) * 160}
                r="4"
                fill="#1A3673"
                stroke="white"
                strokeWidth="2"
              />
              <circle
                cx={idx * 83.3 + 41.65}
                cy={180 - (point.medicaid / maxValue) * 160}
                r="4"
                fill="#00BBBA"
                stroke="white"
                strokeWidth="2"
              />
            </g>
          ))}
        </svg>

        <div className="absolute bottom-0 left-0 right-0 flex justify-around text-[10px] text-gray-600 font-medium">
          {memberData.map((point) => (
            <div key={point.month} className="text-center">
              {point.month}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-gray-100 flex justify-around">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#44B8F3]"></div>
          <span className="text-[10px] font-medium text-gray-700">
            Commercial
          </span>
          <span className="text-[10px] font-bold text-[#1A3673]">1.97M</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#1A3673]"></div>
          <span className="text-[10px] font-medium text-gray-700">
            Medicare
          </span>
          <span className="text-[10px] font-bold text-[#1A3673]">1.35M</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00BBBA]"></div>
          <span className="text-[10px] font-medium text-gray-700">
            Medicaid
          </span>
          <span className="text-[10px] font-bold text-[#00BBBA]">1.05M</span>
        </div>
      </div>
    </div>
  );
}

export function RevenueByLOB() {
  const maxRevenue = 130;

  return (
    <div className="w-full h-full flex flex-col px-2">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-bold text-[#1A3673]">Revenue by LOB</h3>
          <p className="text-[10px] text-gray-500">Year-to-date ($M)</p>
        </div>
        <div className="text-right">
          <div className="text-base font-bold text-[#1A3673]">$281.6M</div>
          <div className="text-[10px] text-[#00BBBA] flex items-center justify-end gap-0.5">
            <TrendingUp className="w-2.5 h-2.5" />
            <span className="font-semibold">+5.7%</span>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-2.5">
        {revenueData.map((item, idx) => (
          <div key={item.lob}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-[#231E33]">
                {item.lob}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#1A3673]">
                  ${item.value}M
                </span>
                <span className="text-[10px] font-semibold text-white bg-gradient-to-r from-[#00BBBA] to-[#66D6D6] px-1.5 py-0.5 rounded-full">
                  {item.change}
                </span>
              </div>
            </div>
            <div className="relative h-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded overflow-hidden shadow-inner">
              <div
                className={`absolute top-0 left-0 h-full rounded shadow-sm ${
                  idx === 0
                    ? "bg-gradient-to-r from-[#44B8F3] to-[#8FD4F8]"
                    : idx === 1
                      ? "bg-gradient-to-r from-[#1A3673] to-[#2861BB]"
                      : "bg-gradient-to-r from-[#00BBBA] to-[#66D6D6]"
                }`}
                style={{
                  width: `${(item.value / maxRevenue) * 100}%`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-20"></div>
              </div>
              <div className="absolute inset-0 flex items-center px-2">
                <span
                  className="text-[10px] font-bold"
                  style={{
                    color: item.value / maxRevenue > 0.3 ? "white" : "#1A3673",
                  }}
                >
                  {((item.value / 281.6) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 pt-2 border-t border-gray-100 grid grid-cols-3 gap-2">
        <div className="text-center">
          <div className="text-[10px] text-gray-500">Target</div>
          <div className="text-xs font-bold text-[#1A3673]">$270M</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-gray-500">Achieved</div>
          <div className="text-xs font-bold text-[#00BBBA]">$281.6M</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-gray-500">vs Target</div>
          <div className="text-xs font-bold text-[#00BBBA]">+4.3%</div>
        </div>
      </div>
    </div>
  );
}

export function TrendChart() {
  const trendData = [
    { month: "Jul", pmpm: 412.5 },
    { month: "Aug", pmpm: 418.2 },
    { month: "Sep", pmpm: 415.8 },
    { month: "Oct", pmpm: 422.4 },
    { month: "Nov", pmpm: 428.6 },
    { month: "Dec", pmpm: 425.3 },
  ];

  const minValue = 400;
  const maxValue = 440;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-bold text-[#1A3673]">Paid PMPM</h3>
          <p className="text-[10px] text-gray-500">6-Month Rolling</p>
        </div>
        <div className="text-right">
          <div className="text-base font-bold text-[#1A3673]">$425.30</div>
          <div className="text-[10px] text-[#E3725F] flex items-center justify-end gap-0.5">
            <TrendingUp className="w-2.5 h-2.5" />
            <span className="font-semibold">+3.1%</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative min-h-0">
        <svg
          className="w-full h-full"
          viewBox="0 0 500 180"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient
              id="trendGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#00BBBA" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#00BBBA" stopOpacity="0.02" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <line
            x1="0"
            y1="180"
            x2="500"
            y2="180"
            stroke="#e5e7eb"
            strokeWidth="1"
          />

          <path
            d={`
              M 0,${180 - ((trendData[0].pmpm - minValue) / (maxValue - minValue)) * 180}
              ${trendData
                .slice(1)
                .map(
                  (point, idx) =>
                    `L ${((idx + 1) / (trendData.length - 1)) * 500},${180 - ((point.pmpm - minValue) / (maxValue - minValue)) * 180}`,
                )
                .join(" ")}
              L 500,180 L 0,180 Z
            `}
            fill="url(#trendGradient)"
          />

          <polyline
            points={trendData
              .map(
                (point, idx) =>
                  `${(idx / (trendData.length - 1)) * 500},${180 - ((point.pmpm - minValue) / (maxValue - minValue)) * 180}`,
              )
              .join(" ")}
            fill="none"
            stroke="#00BBBA"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
          />

          {trendData.map((point, idx) => (
            <g key={idx}>
              <circle
                cx={(idx / (trendData.length - 1)) * 500}
                cy={
                  180 - ((point.pmpm - minValue) / (maxValue - minValue)) * 180
                }
                r="8"
                fill="#00BBBA"
                stroke="white"
                strokeWidth="3"
                filter="url(#glow)"
              />
              <text
                x={(idx / (trendData.length - 1)) * 500}
                y={
                  180 -
                  ((point.pmpm - minValue) / (maxValue - minValue)) * 180 -
                  20
                }
                textAnchor="middle"
                className="text-xs font-bold fill-[#1A3673]"
              >
                ${point.pmpm}
              </text>
            </g>
          ))}
        </svg>

        <div className="absolute bottom-0 left-0 right-0 flex justify-around text-xs text-gray-600 font-medium">
          {trendData.map((point) => (
            <div key={point.month} className="text-center">
              {point.month}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-gray-100 grid grid-cols-4 gap-2">
        <div className="text-center">
          <div className="text-[10px] text-gray-500">Current</div>
          <div className="text-xs font-bold text-[#1A3673]">$425</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-gray-500">6M Avg</div>
          <div className="text-xs font-bold text-[#1A3673]">$420</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-gray-500">Target</div>
          <div className="text-xs font-bold text-[#1A3673]">$412</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-gray-500">vs Tgt</div>
          <div className="text-xs font-bold text-[#E3725F]">+$13</div>
        </div>
      </div>
    </div>
  );
}

export function AuthTrendChart() {
  const authData = [
    { month: "Jan", ipAuth: 2150, opAuth: 3420 },
    { month: "Feb", ipAuth: 2280, opAuth: 3580 },
    { month: "Mar", ipAuth: 2350, opAuth: 3650 },
    { month: "Apr", ipAuth: 2420, opAuth: 3720 },
    { month: "May", ipAuth: 2380, opAuth: 3780 },
    { month: "Jun", ipAuth: 2450, opAuth: 3820 },
  ];

  const maxValue = 4000;
  const minValue = 2000;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-bold text-[#1A3673]">
            Authorization Trend
          </h3>
          <p className="text-[10px] text-gray-500">IP vs OP Auth Count</p>
        </div>
        <div className="text-right">
          <div className="text-base font-bold text-[#1A3673]">6,270</div>
          <div className="text-[10px] text-[#E3725F] flex items-center justify-end gap-0.5">
            <TrendingUp className="w-2.5 h-2.5" />
            <span className="font-semibold">+8.4%</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative min-h-0">
        <svg
          className="w-full h-full"
          viewBox="0 0 500 180"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient
              id="ipAuthGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#1A3673" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1A3673" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient
              id="opAuthGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#00BBBA" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00BBBA" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          <line
            x1="0"
            y1="180"
            x2="500"
            y2="180"
            stroke="#e5e7eb"
            strokeWidth="1"
          />

          {/* OP Auth Area */}
          <path
            d={`
              M ${authData
                .map(
                  (point, idx) =>
                    `${idx * 83.3 + 41.65},${180 - ((point.opAuth - minValue) / (maxValue - minValue)) * 160}`,
                )
                .join(" L ")}
              L ${500 - 41.65},180
              L 41.65,180
              Z
            `}
            fill="url(#opAuthGradient)"
          />

          {/* IP Auth Area */}
          <path
            d={`
              M ${authData
                .map(
                  (point, idx) =>
                    `${idx * 83.3 + 41.65},${180 - ((point.ipAuth - minValue) / (maxValue - minValue)) * 160}`,
                )
                .join(" L ")}
              L ${500 - 41.65},180
              L 41.65,180
              Z
            `}
            fill="url(#ipAuthGradient)"
          />

          {/* OP Auth Line */}
          <polyline
            points={authData
              .map(
                (point, idx) =>
                  `${idx * 83.3 + 41.65},${180 - ((point.opAuth - minValue) / (maxValue - minValue)) * 160}`,
              )
              .join(" ")}
            fill="none"
            stroke="#00BBBA"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* IP Auth Line */}
          <polyline
            points={authData
              .map(
                (point, idx) =>
                  `${idx * 83.3 + 41.65},${180 - ((point.ipAuth - minValue) / (maxValue - minValue)) * 160}`,
              )
              .join(" ")}
            fill="none"
            stroke="#1A3673"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {authData.map((point, idx) => (
            <g key={idx}>
              <circle
                cx={idx * 83.3 + 41.65}
                cy={
                  180 -
                  ((point.opAuth - minValue) / (maxValue - minValue)) * 160
                }
                r="4"
                fill="#00BBBA"
              />
              <circle
                cx={idx * 83.3 + 41.65}
                cy={
                  180 -
                  ((point.ipAuth - minValue) / (maxValue - minValue)) * 160
                }
                r="4"
                fill="#1A3673"
              />
            </g>
          ))}
        </svg>

        <div className="absolute bottom-0 left-0 right-0 flex justify-around text-[10px] text-gray-600 font-medium">
          {authData.map((point) => (
            <div key={point.month} className="text-center">
              {point.month}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-gray-100 flex justify-around">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#1A3673]"></div>
          <span className="text-[10px] font-medium text-gray-700">IP Auth</span>
          <span className="text-[10px] font-bold text-[#1A3673]">2,450</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00BBBA]"></div>
          <span className="text-[10px] font-medium text-gray-700">OP Auth</span>
          <span className="text-[10px] font-bold text-[#00BBBA]">3,820</span>
        </div>
      </div>
    </div>
  );
}

export function CostTrendChart() {
  const minValue = 275;
  const maxValue = 300;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-bold text-[#1A3673]">Total Cost Trend</h3>
          <p className="text-[10px] text-gray-500">Monthly expenditure ($M)</p>
        </div>
        <div className="text-right">
          <div className="text-base font-bold text-[#1A3673]">$281.6M</div>
          <div className="text-[10px] text-[#00BBBA] flex items-center justify-end gap-0.5">
            <TrendingDown className="w-2.5 h-2.5" />
            <span className="font-semibold">-4.8%</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative min-h-0">
        <svg
          className="w-full h-full"
          viewBox="0 0 500 180"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="costGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#44B8F3" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#44B8F3" stopOpacity="0.02" />
            </linearGradient>
            <filter id="shadow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <line
            x1="0"
            y1="180"
            x2="500"
            y2="180"
            stroke="#e5e7eb"
            strokeWidth="1"
          />

          {costTrendData.map((_, idx) => (
            <line
              key={idx}
              x1={0}
              y1={(idx * 180) / 5}
              x2={500}
              y2={(idx * 180) / 5}
              stroke="#f3f4f6"
              strokeWidth="1"
            />
          ))}

          <path
            d={`
              M 0,${180 - ((costTrendData[0].value - minValue) / (maxValue - minValue)) * 180}
              ${costTrendData
                .slice(1)
                .map(
                  (point, idx) =>
                    `L ${((idx + 1) / (costTrendData.length - 1)) * 500},${180 - ((point.value - minValue) / (maxValue - minValue)) * 180}`,
                )
                .join(" ")}
              L 500,180 L 0,180 Z
            `}
            fill="url(#costGradient)"
          />

          <polyline
            points={costTrendData
              .map(
                (point, idx) =>
                  `${(idx / (costTrendData.length - 1)) * 500},${180 - ((point.value - minValue) / (maxValue - minValue)) * 180}`,
              )
              .join(" ")}
            fill="none"
            stroke="#44B8F3"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#shadow)"
          />

          {costTrendData.map((point, idx) => (
            <g key={idx}>
              <circle
                cx={(idx / (costTrendData.length - 1)) * 500}
                cy={
                  180 - ((point.value - minValue) / (maxValue - minValue)) * 180
                }
                r="7"
                fill="#44B8F3"
                stroke="white"
                strokeWidth="3"
              />
            </g>
          ))}
        </svg>

        <div className="absolute bottom-0 left-0 right-0 flex justify-around text-xs text-gray-600 font-medium">
          {costTrendData.map((point) => (
            <div key={point.month} className="text-center">
              {point.month}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-gray-100 grid grid-cols-4 gap-2">
        <div className="text-center">
          <div className="text-[10px] text-gray-500">6M Avg</div>
          <div className="text-xs font-bold text-[#1A3673]">$285M</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-gray-500">High</div>
          <div className="text-xs font-bold text-[#E3725F]">$296M</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-gray-500">Low</div>
          <div className="text-xs font-bold text-[#00BBBA]">$280M</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-gray-500">Range</div>
          <div className="text-xs font-bold text-[#1A3673]">$16M</div>
        </div>
      </div>
    </div>
  );
}

export function CoCSavingsChart() {
  const target = 4.24;
  const booked = 2.83;
  const identified = 3.39;
  const p50 = 3.98;

  const bookedPercent = (booked / target) * 100;
  const identifiedPercent = (identified / target) * 100;
  const p50Percent = (p50 / target) * 100;

  const bookedPMPM = 19.54;
  const identifiedPMPM = 23.37;
  const p50PMPM = 27.5;

  const bookedChange = 228;
  const identifiedChange = 54;
  const p50Change = 131;

  // Donut chart calculations
  const radius = 40;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (bookedPercent / 100) * circumference;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header with Target */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-bold text-[#1A3673]">
            2026 CoC Performance
          </h3>
          <p className="text-[10px] text-gray-500">
            As of 2/17/2026 | Next update: 3/10
          </p>
        </div>
        <div className="text-right">
          <div className="text-[9px] text-gray-500">2026 Target</div>
          <div className="text-lg font-bold text-[#1A3673]">${target}B</div>
        </div>
      </div>

      {/* Progress to Target - Horizontal Bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-semibold text-gray-600">
            Booked vs Target
          </span>
          <span className="text-xs font-bold text-[#00BBBA]">
            {bookedPercent.toFixed(0)}%
          </span>
        </div>
        <div className="relative h-5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#00BBBA] to-[#2861BB] rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2"
            style={{ width: `${bookedPercent}%` }}
          >
            <span className="text-[9px] font-bold text-white">${booked}B</span>
          </div>
        </div>
        <div className="flex justify-between mt-0.5">
          <span className="text-[10px] text-gray-600 font-medium">
            Booked: ${booked}B
          </span>
          <span className="text-[10px] text-[#E3725F] font-semibold">
            Remaining: ${(target - booked).toFixed(2)}B
          </span>
        </div>
      </div>

      {/* Performance Metrics - 3 Column Layout */}
      <div className="flex justify-center mb-1">
        <div className="grid grid-cols-3 gap-2 max-w-4xl w-full">
          <div className="bg-gradient-to-br from-[#2861BB]/10 to-[#2861BB]/5 rounded-lg p-2 border border-[#2861BB]/20">
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-4 h-4 bg-gradient-to-br from-[#2861BB] to-[#2861BB]/80 rounded flex items-center justify-center flex-shrink-0">
                <Target className="w-2.5 h-2.5 text-white" />
              </div>
              <div className="text-xs font-semibold text-gray-700">Target</div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="text-xl font-bold text-[#1A3673]">${target}B</div>
              <div className="text-right space-y-0.5">
                <div className="text-[9px] text-gray-600">2026 Goal</div>
                <div className="text-[9px] font-semibold text-[#2861BB]">
                  100%
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#44B8F3]/10 to-[#44B8F3]/5 rounded-lg p-2 border border-[#44B8F3]/20">
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-4 h-4 bg-gradient-to-br from-[#44B8F3] to-[#44B8F3]/80 rounded flex items-center justify-center flex-shrink-0">
                <Activity className="w-2.5 h-2.5 text-white" />
              </div>
              <div className="text-xs font-semibold text-gray-700">
                Identified
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="text-xl font-bold text-[#1A3673]">
                ${identified}B
              </div>
              <div className="text-right space-y-0.5">
                <div className="text-[9px] text-gray-600">
                  ${identifiedPMPM} PMPM
                </div>
                <div className="text-[9px] font-semibold">
                  <span className="text-green-600">▲${identifiedChange}M</span>
                  <span className="text-gray-400"> | </span>
                  <span className="text-[#44B8F3]">
                    {identifiedPercent.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#00BBBA]/10 to-[#00BBBA]/5 rounded-lg p-2 border border-[#00BBBA]/20">
            <div className="flex items-center gap-1.5 mb-2">
              <div className="w-4 h-4 bg-gradient-to-br from-[#00BBBA] to-[#00BBBA]/80 rounded flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-2.5 h-2.5 text-white" />
              </div>
              <div className="text-xs font-semibold text-gray-700">Booked</div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="text-xl font-bold text-[#1A3673]">${booked}B</div>
              <div className="text-right space-y-0.5">
                <div className="text-[9px] text-gray-600">
                  ${bookedPMPM} PMPM
                </div>
                <div className="text-[9px] font-semibold">
                  <span className="text-green-600">▲${bookedChange}M</span>
                  <span className="text-gray-400"> | </span>
                  <span className="text-[#00BBBA]">
                    {bookedPercent.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="pt-1 border-t border-gray-200">
        <div className="text-[8px] text-gray-500 italic text-center">
          Identified & booked on 2026 basis
        </div>
      </div>
    </div>
  );
}

export function MultiYearTrendChart() {
  const [activeTab, setActiveTab] = useState<
    | "memberMonths"
    | "revenuePMPM"
    | "expensePaidPMPM"
    | "expenseAllowedPMPM"
    | "mlr"
  >("memberMonths");
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);
  const [hoveredData, setHoveredData] = useState<{
    month: string;
    year: number;
    value: number;
  } | null>(null);
  const [showAllMonths, setShowAllMonths] = useState(false);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Static data for different metrics across years - with crossing patterns
  const memberMonthsData = {
    // 2020: [4.64, 4.63, 4.62, 4.61, 4.60, 4.59, 4.58, 4.57, 4.56, 4.55, 4.54, 4.53],
    // 2021: [4.17, 4.19, 4.22, 4.25, 4.28, 4.31, 4.34, 4.37, 4.40, 4.42, 4.44, 4.46],
    // 2022: [4.50, 4.49, 4.48, 4.47, 4.46, 4.45, 4.44, 4.43, 4.42, 4.41, 4.40, 4.39],
    // 2023: [4.40, 4.40, 4.41, 4.41, 4.42, 4.42, 4.43, 4.43, 4.44, 4.44, 4.45, 4.45],
    // 2024: [4.17, 4.20, 4.24, 4.28, 4.32, 4.36, 4.40, 4.44, 4.48, 4.52, 4.56, 4.60],
    2025: [
      4.64, 4.63, 4.62, 4.61, 4.6, 4.59, 4.58, 4.57, 4.56, 4.55, 4.54, 4.53,
    ],
    2026: [
      4.17, 4.18, 4.19, 4.2, 4.21, 4.22, 4.23, 4.24, 4.25, 4.26, 4.27, 4.28,
    ],
  };

  const revenuePMPMData = {
    // 2020: [720, 718, 716, 714, 712, 710, 708, 706, 704, 702, 700, 698],
    // 2021: [580, 585, 590, 595, 600, 605, 610, 615, 620, 625, 630, 635],
    // 2022: [690, 688, 686, 684, 682, 680, 678, 676, 674, 672, 670, 668],
    // 2023: [640, 642, 644, 646, 648, 650, 652, 654, 656, 658, 660, 662],
    // 2024: [580, 590, 600, 610, 620, 630, 640, 650, 660, 670, 680, 690],
    2025: [720, 718, 716, 714, 712, 710, 708, 706, 704, 702, 700, 698],
    2026: [580, 582, 584, 586, 588, 590, 592, 594, 596, 598, 600, 602],
  };

  const expensePaidPMPMData = {
    // 2020: [620, 618, 616, 614, 612, 610, 608, 606, 604, 602, 600, 598],
    // 2021: [480, 485, 490, 495, 500, 505, 510, 515, 520, 525, 530, 535],
    // 2022: [590, 588, 586, 584, 582, 580, 578, 576, 574, 572, 570, 568],
    // 2023: [540, 542, 544, 546, 548, 550, 552, 554, 556, 558, 560, 562],
    // 2024: [480, 490, 500, 510, 520, 530, 540, 550, 560, 570, 580, 590],
    2025: [620, 618, 616, 614, 612, 610, 608, 606, 604, 602, 600, 598],
    2026: [480, 482, 484, 486, 488, 490, 492, 494, 496, 498, 500, 502],
  };

  const expenseAllowedPMPMData = {
    2020: [800, 798, 796, 794, 792, 790, 788, 786, 784, 782, 780, 778],
    2021: [650, 655, 660, 665, 670, 675, 680, 685, 690, 695, 700, 705],
    2022: [770, 768, 766, 764, 762, 760, 758, 756, 754, 752, 750, 748],
    2023: [710, 712, 714, 716, 718, 720, 722, 724, 726, 728, 730, 732],
    2024: [650, 660, 670, 680, 690, 700, 710, 720, 730, 740, 750, 760],
    2025: [800, 798, 796, 794, 792, 790, 788, 786, 784, 782, 780, 778],
    2026: [650, 652, 654, 656, 658, 660, 662, 664, 666, 668, 670, 672],
  };

  const mlrData = {
    2020: [
      90.0, 89.8, 89.6, 89.4, 89.2, 89.0, 88.8, 88.6, 88.4, 88.2, 88.0, 87.8,
    ],
    2021: [
      82.5, 82.8, 83.1, 83.4, 83.7, 84.0, 84.3, 84.6, 84.9, 85.2, 85.5, 85.8,
    ],
    2022: [
      87.5, 87.3, 87.1, 86.9, 86.7, 86.5, 86.3, 86.1, 85.9, 85.7, 85.5, 85.3,
    ],
    2023: [
      85.0, 85.1, 85.2, 85.3, 85.4, 85.5, 85.6, 85.7, 85.8, 85.9, 86.0, 86.1,
    ],
    2024: [
      82.5, 83.0, 83.5, 84.0, 84.5, 85.0, 85.5, 86.0, 86.5, 87.0, 87.5, 88.0,
    ],
    2025: [
      90.0, 89.8, 89.6, 89.4, 89.2, 89.0, 88.8, 88.6, 88.4, 88.2, 88.0, 87.8,
    ],
    2026: [
      82.5, 82.6, 82.7, 82.8, 82.9, 83.0, 83.1, 83.2, 83.3, 83.4, 83.5, 83.6,
    ],
  };

  const tabs = [
    { id: "memberMonths", label: "Member Months" },
    { id: "revenuePMPM", label: "Revenue PMPM" },
    { id: "expensePaidPMPM", label: "Expense Paid PMPM" },
    { id: "expenseAllowedPMPM", label: "Expense Allowed PMPM" },
    { id: "mlr", label: "MLR" },
  ] as const;

  const yearColors: Record<number, string> = {
    2020: "#E3725F",
    2021: "#00BBBA",
    2022: "#EAB8A8",
    2023: "#2861BB",
    2024: "#44B8F3",
    2025: "#1A3673",
    2026: "#FF6B35",
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case "memberMonths":
        return memberMonthsData;
      case "revenuePMPM":
        return revenuePMPMData;
      case "expensePaidPMPM":
        return expensePaidPMPMData;
      case "expenseAllowedPMPM":
        return expenseAllowedPMPMData;
      case "mlr":
        return mlrData;
      default:
        return memberMonthsData;
    }
  };

  const data = getCurrentData();
  const years = Object.keys(data).map(Number);

  // Calculate min and max for scaling
  const allValues = Object.values(data).flat();
  const minValue = Math.min(...allValues) * 0.98;
  const maxValue = Math.max(...allValues) * 1.02;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Tabs */}
      {/* <div className="flex items-center gap-1 mb-3 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-2.5 py-1 text-[10px] font-semibold rounded-md transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-[#1A3673] to-[#2861BB] text-white shadow-sm'
                : 'text-gray-600 hover:text-[#1A3673] hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div> */}

      {/* Chart */}
      <div className="flex-1 relative min-h-0 w-full overflow-visible">
        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 600 160"
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          <line
            x1="50"
            y1="140"
            x2="550"
            y2="140"
            stroke="#e5e7eb"
            strokeWidth="1"
          />

          {/* Year lines */}
          {years.map((year) => {
            const yearData = data[year];
            const points = yearData
              .map((value, monthIdx) => {
                const x = 50 + (monthIdx / (months.length - 1)) * 500;
                const y =
                  140 - ((value - minValue) / (maxValue - minValue)) * 130;
                return `${x},${y}`;
              })
              .join(" ");

            return (
              <polyline
                key={year}
                points={points}
                fill="none"
                stroke={yearColors[year]}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.8"
              />
            );
          })}

          {/* Interactive data points for all years */}
          {months.map((month, monthIdx) => {
            return years.map((year) => {
              const value = data[year][monthIdx];
              const x = 50 + (monthIdx / (months.length - 1)) * 500;
              const y =
                140 - ((value - minValue) / (maxValue - minValue)) * 130;
              const isHovered = hoveredMonth === `${year}-${monthIdx}`;
              return (
                <circle
                  key={`${year}-${monthIdx}`}
                  cx={x}
                  cy={y}
                  r={isHovered ? "5" : "3"}
                  fill={yearColors[year]}
                  stroke="white"
                  strokeWidth="1.5"
                  opacity={isHovered ? "1" : "0.7"}
                  style={{ cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={() => {
                    setHoveredMonth(`${year}-${monthIdx}`);
                    setHoveredData({ month, year, value });
                  }}
                  onMouseLeave={() => {
                    setHoveredMonth(null);
                    setHoveredData(null);
                  }}
                />
              );
            });
          })}
        </svg>

        {/* Tooltip - Shows all years for the hovered month */}
        {hoveredData &&
          (() => {
            const monthIdx = months.indexOf(hoveredData.month);
            const xPosition = (monthIdx / (months.length - 1)) * 100; // percentage position
            const isLeftSide = xPosition < 25;
            const isRightSide = xPosition > 75;

            return (
              <div
                className="absolute top-0 bg-white border-2 border-[#1A3673] rounded-lg shadow-xl px-3 py-2 z-50 min-w-[140px] pointer-events-none"
                style={{
                  left: isLeftSide
                    ? "0%"
                    : isRightSide
                      ? "auto"
                      : `${xPosition}%`,
                  right: isRightSide ? "0%" : "auto",
                  transform:
                    !isLeftSide && !isRightSide ? "translateX(-50%)" : "none",
                }}
              >
                <div className="text-[11px] font-bold text-[#1A3673] mb-1.5 border-b border-gray-200 pb-1">
                  {hoveredData.month}
                </div>
                <div className="space-y-0.5">
                  {years.map((year) => {
                    const value = data[year][monthIdx];
                    const formatValue =
                      activeTab === "memberMonths"
                        ? `${value.toFixed(2)}M`
                        : activeTab === "mlr"
                          ? `${value.toFixed(1)}%`
                          : `$${value.toFixed(0)}`;
                    return (
                      <div
                        key={year}
                        className="flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-1.5">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: yearColors[year] }}
                          ></div>
                          <span className="text-[9px] font-medium text-gray-700">
                            {year}:
                          </span>
                        </div>
                        <span
                          className={`${year === hoveredData.year ? "font-bold text-[11px]" : "font-medium text-[10px]"}`}
                          style={{
                            color:
                              year === hoveredData.year
                                ? yearColors[year]
                                : "black",
                          }}
                        >
                          {formatValue}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[9px] text-gray-600 font-medium px-[8.3%]">
          {months.map((month) => (
            <div key={month} className="text-center">
              {month}
            </div>
          ))}
        </div>
      </div>

      {/* Legend with toggle button */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-2 flex-wrap">
          {years.map((year) => (
            <div key={year} className="flex items-center gap-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: yearColors[year] }}
              ></div>
              <span className="text-[9px] font-medium text-gray-700">
                {year}
              </span>
            </div>
          ))}
        </div>
        <button
          onClick={() => setShowAllMonths(!showAllMonths)}
          className="text-[9px] font-semibold text-[#1A3673] hover:text-[#2861BB] px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 transition-colors"
        >
          {showAllMonths ? "Hide Data" : "Show All Data"}
        </button>
      </div>

      {/* All Months Data Table */}
      {showAllMonths && (
        <div className="mt-3 pt-3 border-t border-gray-200 max-h-48 overflow-y-auto">
          <div className="text-[10px] font-bold text-[#1A3673] mb-2">
            All Months Data
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[8px] border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-1.5 py-1 text-left font-semibold text-gray-700">
                    Month
                  </th>
                  {years.map((year) => (
                    <th
                      key={year}
                      className="border border-gray-200 px-1.5 py-1 text-right font-semibold"
                      style={{ color: yearColors[year] }}
                    >
                      {year}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {months.map((month, monthIdx) => (
                  <tr key={month} className="hover:bg-blue-50">
                    <td className="border border-gray-200 px-1.5 py-1 font-medium text-gray-700">
                      {month}
                    </td>
                    {years.map((year) => {
                      const value = data[year][monthIdx];
                      const formatValue =
                        activeTab === "memberMonths"
                          ? value.toFixed(2)
                          : activeTab === "mlr"
                            ? value.toFixed(1)
                            : value.toFixed(0);
                      const suffix =
                        activeTab === "memberMonths"
                          ? "M"
                          : activeTab === "mlr"
                            ? "%"
                            : "";
                      const prefix =
                        activeTab !== "memberMonths" && activeTab !== "mlr"
                          ? "$"
                          : "";
                      return (
                        <td
                          key={year}
                          className="border border-gray-200 px-1.5 py-1 text-right font-semibold text-gray-900"
                        >
                          {prefix}
                          {formatValue}
                          {suffix}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
