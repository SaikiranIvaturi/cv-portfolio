import { ArrowLeft, TrendingUp, FileText, Building2, User } from "lucide-react";
import { ValidationResult } from "../types";
import ThinkingProcess from "../chat/ThinkingProcess";

interface ValidationViewProps {
  result: ValidationResult;
  onBack: () => void;
}

export default function ValidationView({
  result,
  onBack,
}: ValidationViewProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#1A3673]" />
        </button>
        <div>
          <h2 className="text-lg font-semibold text-[#231E33]">
            360° Validation Analysis
          </h2>
          <p className="text-xs text-gray-600">
            Multi-source validation and confidence scoring
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ThinkingProcess steps={result.thinkingProcess} />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-[#231E33] text-xs">
              Confidence Score
            </h3>
            <div className="text-xl font-bold text-[#1A3673]">
              {result.confidence}%
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
            <div
              className="bg-[#00BBBA] h-1.5 rounded-full transition-all"
              style={{ width: `${result.confidence}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-600">
            High confidence based on consistent evidence across financial
            metrics and policy documentation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-[#1A3673]" />
            <h3 className="font-semibold text-[#231E33] text-sm">
              Trend Analysis
            </h3>
          </div>

          <div className="mb-4">
            <h4 className="text-xs font-medium text-gray-700 mb-2">
              Financial Trend (PMPM)
            </h4>
            <div className="space-y-1">
              {result.trendAnalysis.financialTrend.map((trend, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-1.5 border-b border-gray-100"
                >
                  <span className="text-xs text-gray-600">{trend.period}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#1A3673] text-xs">
                      ${trend.value.toFixed(2)}
                    </span>
                    <span className="text-xs text-[#E3725F]">
                      +${trend.change.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-medium text-gray-700 mb-2">
              Leading Indicators (PMPW)
            </h4>
            <div className="space-y-1">
              {result.trendAnalysis.leadingIndicators.map((indicator, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-1.5 border-b border-gray-100"
                >
                  <span className="text-xs text-gray-600">
                    {indicator.period}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#1A3673] text-xs">
                      {indicator.value.toFixed(1)}
                    </span>
                    <span className="text-xs text-[#E3725F]">
                      +{indicator.change.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-4 h-4 text-[#1A3673]" />
            <h3 className="font-semibold text-[#231E33] text-sm">
              Deep Dive Analysis
            </h3>
          </div>

          <div className="mb-4">
            <h4 className="text-xs font-medium text-gray-700 mb-2">
              Top Procedures
            </h4>
            <div className="space-y-1">
              {result.deepDive.topProcedures.slice(0, 3).map((proc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-1.5 border-b border-gray-100"
                >
                  <span className="text-xs text-gray-600">{proc.name}</span>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-[#1A3673]">
                      ${proc.cost.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      {proc.volume} cases
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-medium text-gray-700 mb-2">
              Top Providers
            </h4>
            <div className="space-y-1">
              {result.deepDive.topProviders.slice(0, 3).map((provider, idx) => (
                <div key={idx} className="py-1.5 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">
                      {provider.name}
                    </span>
                    <span className="text-xs font-semibold text-[#1A3673]">
                      ${provider.cost.toLocaleString()}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                      provider.type === "Out-of-Network"
                        ? "bg-[#FBEAE7] text-[#E3725F]"
                        : "bg-[#D9F5F5] text-[#00BBBA]"
                    }`}
                  >
                    {provider.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-4 h-4 text-[#1A3673]" />
          <h3 className="font-semibold text-[#231E33] text-sm">
            Rules & Policy Check
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-medium text-gray-700 mb-2">
              Relevant Policies
            </h4>
            <div className="space-y-1">
              {result.rulesCheck.policies.map((policy, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-1.5 border-b border-gray-100"
                >
                  <span className="text-xs text-gray-600">
                    {policy.document}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-12 bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-[#1A3673] h-1.5 rounded-full"
                        style={{ width: `${policy.relevance}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-500 w-6">
                      {policy.relevance}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-medium text-gray-700 mb-2">
              Contract Status
            </h4>
            <div className="space-y-1">
              {result.rulesCheck.contracts.map((contract, idx) => (
                <div key={idx} className="py-1.5 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">
                      {contract.provider}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        contract.status === "No Active Contract"
                          ? "bg-[#FBEAE7] text-[#E3725F]"
                          : "bg-[#E1EDFF] text-[#1A3673]"
                      }`}
                    >
                      {contract.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
