import { useState } from "react";
import {
  Settings,
  X,
  ToggleLeft,
  ToggleRight,
  GitBranch,
  RefreshCw,
} from "lucide-react";
import { useAdminSettings } from "../../contexts/AdminSettingsContext";

interface AdminSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSettingsPanel({
  isOpen,
  onClose,
}: AdminSettingsPanelProps) {
  const { settings, updateSetting, resetToDefaults } = useAdminSettings();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1A3673] to-[#2861BB] text-white p-4 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5" />
            <h2 className="text-lg font-bold">Admin Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Feature Toggles Section */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-[#1A3673]">
                Feature Toggles
              </h3>
            </div>

            <div className="p-4 space-y-4">
              {/* Decision Tree Recommendations Toggle */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <GitBranch className="w-4 h-4 text-[#1A3673]" />
                    <span className="text-sm font-medium text-gray-800">
                      Decision Tree Recommendations
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 ml-6">
                    When enabled, shows the full Related Decision Tree Questions
                    panel in the Chat interface. When disabled, shows only a
                    small indicator icon.
                  </p>
                </div>
                <button
                  onClick={() =>
                    updateSetting(
                      "decisionTreeRecommendationsEnabled",
                      !settings.decisionTreeRecommendationsEnabled,
                    )
                  }
                  className="flex-shrink-0 mt-1"
                >
                  {settings.decisionTreeRecommendationsEnabled ? (
                    <ToggleRight className="w-10 h-10 text-[#00BBBA]" />
                  ) : (
                    <ToggleLeft className="w-10 h-10 text-gray-400" />
                  )}
                </button>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2 ml-6">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    settings.decisionTreeRecommendationsEnabled
                      ? "bg-[#00BBBA]/10 text-[#00BBBA]"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {settings.decisionTreeRecommendationsEnabled
                    ? "ENABLED"
                    : "PARKING LOT"}
                </span>
                <span className="text-[10px] text-gray-400">
                  {settings.decisionTreeRecommendationsEnabled
                    ? "Full panel visible in Chat"
                    : "Icon only - future release"}
                </span>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700">
              <strong>Note:</strong> Settings are saved to your browser and will
              persist across sessions. Use the reset button below to restore
              default values.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 flex items-center justify-between bg-gray-50 rounded-b-xl">
          <button
            onClick={resetToDefaults}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reset to Defaults
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gradient-to-r from-[#1A3673] to-[#2861BB] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
