import React, { useState, useEffect } from "react";
import { BarChart3, Globe, ExternalLink, X, Loader2 } from "lucide-react";
import PowerBIEmbed from "../powerbi/PowerBIEmbed";
import ExternalAppEmbed from "../powerbi/ExternalAppEmbed";

interface DashboardCardProps {
  id: string;
  label: string;
  type: "dashboard" | "app";
  provider: "powerbi" | "internal" | "external";
  primaryLabel: string;
  bi?: any;
  app?: any;
  appKey?: string;
  onClick: (id: string) => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  id,
  label,
  provider,
  bi,
  app,
  appKey,
  onClick,
}) => {
  const [showEmbed, setShowEmbed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ESC key handler
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showEmbed) {
        setShowEmbed(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [showEmbed]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showEmbed) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showEmbed]);

  const getProviderConfig = () => {
    if (provider === "powerbi") {
      return {
        icon: <BarChart3 className="w-3.5 h-3.5" />,
        gradient: "from-[#1A3673] to-[#2A4683]",
        bgColor: "bg-white",
        borderColor: "border-gray-200",
        hoverBorder: "hover:border-[#1A3673]",
        iconBg: "bg-[#E1EDFF]",
        iconColor: "text-[#1A3673]",
        badge: "Power BI",
      };
    }
    if (provider === "internal") {
      return {
        icon: <BarChart3 className="w-3.5 h-3.5" />,
        gradient: "from-[#1A3673] to-[#2A4683]",
        bgColor: "bg-white",
        borderColor: "border-gray-200",
        hoverBorder: "hover:border-[#1A3673]",
        iconBg: "bg-[#E1EDFF]",
        iconColor: "text-[#1A3673]",
        badge: "Internal",
      };
    }
    return {
      icon: <Globe className="w-3.5 h-3.5" />,
      gradient: "from-[#1A3673] to-[#2A4683]",
      bgColor: "bg-white",
      borderColor: "border-gray-200",
      hoverBorder: "hover:border-[#1A3673]",
      iconBg: "bg-gray-100",
      iconColor: "text-gray-600",
      badge: "External",
    };
  };

  const handleClick = () => {
    onClick(id);

    if (provider === "powerbi" || (app && app.openMode === "sameTab")) {
      setIsLoading(true);
      // Simulate loading delay for better UX
      setTimeout(() => {
        setShowEmbed(true);
        setIsLoading(false);
      }, 300);
    } else if (app && app.openMode === "newTab") {
      window.open(app.url, "_blank");
    }
  };

  const handleClose = () => {
    setShowEmbed(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const config = getProviderConfig();

  return (
    <>
      <div
        onClick={handleClick}
        onKeyDown={(e) => e.key === "Enter" && handleClick()}
        tabIndex={0}
        role="button"
        aria-label={`Open ${label} dashboard`}
        className={`group relative rounded-lg border ${config.borderColor} ${config.hoverBorder} ${config.bgColor} hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden focus:ring-2 focus:ring-[#1A3673] focus:outline-none`}
      >
        {/* Content */}
        <div className="relative p-3">
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`p-1.5 rounded-md ${config.iconBg} ${config.iconColor} group-hover:scale-105 transition-transform duration-200`}
            >
              {config.icon}
            </div>
            {provider === "external" && (
              <ExternalLink className="w-3 h-3 text-gray-400" />
            )}
          </div>

          <h3
            className="text-xs font-semibold text-gray-900 group-hover:text-[#1A3673] transition-colors leading-tight line-clamp-2 mb-1"
            title={label}
          >
            {label}
          </h3>
          <div className="flex items-center justify-between">
            <span className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-medium rounded">
              {config.badge}
            </span>
            <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
              Click to open
            </span>
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          className={`h-0.5 bg-gradient-to-r ${config.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left`}
        />

        {/* Hover overlay indicator */}
        <div className="absolute inset-0 bg-[#1A3673] opacity-0 group-hover:opacity-5 transition-opacity duration-200 pointer-events-none" />
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <Loader2 className="w-8 h-8 text-[#1A3673] animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-600">Opening {label}...</p>
          </div>
        </div>
      )}

      {/* Modal for embedded content */}
      {showEmbed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="dashboard-title"
        >
          <div className="bg-white rounded-lg w-full h-full max-w-7xl max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Close Button - Always Visible */}
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <button
                onClick={handleClose}
                className="p-2 bg-white hover:bg-gray-100 rounded-lg shadow-lg border border-gray-200 transition-colors group"
                title="Close (ESC)"
                aria-label="Close dashboard"
              >
                <X className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
              </button>
            </div>

            {provider === "powerbi" && bi ? (
              <PowerBIEmbed
                url={bi.embedUrl}
                title={label}
                workspace_id={bi.workspaceId}
                report_id={bi.reportId}
                onClose={handleClose}
              />
            ) : app ? (
              <ExternalAppEmbed
                url={app.url}
                title={label}
                appKey={appKey || "UNKNOWN"}
                onClose={handleClose}
              />
            ) : null}
          </div>

          {/* Helper Text */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-xs px-4 py-2 rounded-full">
            Press{" "}
            <kbd className="px-1.5 py-0.5 bg-white bg-opacity-20 rounded">
              ESC
            </kbd>{" "}
            or click outside to close
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardCard;
