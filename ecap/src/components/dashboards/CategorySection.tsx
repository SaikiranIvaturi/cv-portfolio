import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Star,
  DollarSign,
  Activity,
  Shield,
  Users,
  Building2,
  Briefcase,
  BarChart3,
} from "lucide-react";
import DashboardCard from "./DashboardCard";

// Category icon mapping
const getCategoryIcon = (title: string) => {
  const titleLower = title.toLowerCase();
  if (titleLower.includes("cost")) return <DollarSign className="w-4 h-4" />;
  if (titleLower.includes("quality") || titleLower.includes("health"))
    return <Activity className="w-4 h-4" />;
  if (titleLower.includes("compliance") || titleLower.includes("risk"))
    return <Shield className="w-4 h-4" />;
  if (titleLower.includes("member") || titleLower.includes("population"))
    return <Users className="w-4 h-4" />;
  if (titleLower.includes("provider") || titleLower.includes("network"))
    return <Building2 className="w-4 h-4" />;
  if (titleLower.includes("operation") || titleLower.includes("admin"))
    return <Briefcase className="w-4 h-4" />;
  return <BarChart3 className="w-4 h-4" />;
};

interface DashboardItem {
  id: string;
  label: string;
  type: "dashboard" | "app";
  provider: "powerbi" | "internal" | "external";
  primaryLabel: string;
  bi?: any;
  app?: any;
  key?: string;
}

interface CategorySectionProps {
  title: string;
  items: DashboardItem[];
  onItemClick: (id: string) => void;
  favorites?: string[];
  onToggleFavorite?: (id: string, e?: React.MouseEvent) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  items,
  onItemClick,
  favorites = [],
  onToggleFavorite,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Auto-collapse if too many items
  React.useEffect(() => {
    if (items.length > 20) {
      setIsExpanded(false);
    }
  }, [items.length]);

  // Group items by Line of Business (from primaryLabel)
  const groupByLOB = () => {
    const groups: { [key: string]: DashboardItem[] } = {};

    items.forEach((item) => {
      // Extract LOB from primaryLabel (e.g., "Commercial", "Medicaid", "Medicare", "Capitation")
      const lob = item.primaryLabel || "Other";
      if (!groups[lob]) {
        groups[lob] = [];
      }
      groups[lob].push(item);
    });

    return groups;
  };

  const lobGroups = groupByLOB();
  const lobOrder = [
    "Commercial",
    "Medicaid",
    "Medicare",
    "Capitation",
    "Other",
  ];
  const sortedLOBs = Object.keys(lobGroups).sort((a, b) => {
    const indexA = lobOrder.indexOf(a);
    const indexB = lobOrder.indexOf(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Category Header - Sticky */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#F8FAFB] transition-colors sticky top-0 bg-white z-10 border-b border-gray-100"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-[#1A3673] to-[#2A4683] text-white shadow-sm">
            {getCategoryIcon(title)}
          </div>
          <div className="text-left">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              {title}
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              )}
            </h2>
            <p className="text-[10px] text-gray-500 mt-0.5">
              {items.length} {items.length === 1 ? "dashboard" : "dashboards"} •{" "}
              {sortedLOBs.length} {sortedLOBs.length === 1 ? "group" : "groups"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-[#E1EDFF] text-[#1A3673] text-xs font-semibold rounded-full">
            {items.length}
          </span>
        </div>
      </button>

      {/* Category Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {sortedLOBs.map((lob, index) => (
            <div key={lob}>
              {/* LOB Divider */}
              {index > 0 && <div className="border-t border-gray-100 my-3" />}

              {/* LOB Header */}
              <div className="flex items-center gap-2 mb-2.5">
                <div className="h-5 w-0.5 bg-[#1A3673] rounded-full" />
                <h3 className="text-xs font-semibold text-[#1A3673]">{lob}</h3>
                <span className="text-[10px] text-gray-500">
                  ({lobGroups[lob].length})
                </span>
              </div>

              {/* Dashboard Grid - Auto-adjusting columns */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3">
                {lobGroups[lob].map((item) => (
                  <div key={item.id} className="relative group">
                    {/* Favorite Button */}
                    {onToggleFavorite && (
                      <button
                        onClick={(e) => onToggleFavorite(item.id, e)}
                        className={`absolute top-1 right-1 z-10 p-1 rounded-full transition-all ${
                          favorites.includes(item.id)
                            ? "text-yellow-500 bg-yellow-50 opacity-100"
                            : "text-gray-300 opacity-0 group-hover:opacity-100 hover:text-yellow-500 hover:bg-yellow-50"
                        }`}
                        title={
                          favorites.includes(item.id)
                            ? "Remove from favorites"
                            : "Add to favorites"
                        }
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${favorites.includes(item.id) ? "fill-current" : ""}`}
                        />
                      </button>
                    )}
                    <DashboardCard
                      id={item.id}
                      label={item.label}
                      type={item.type}
                      provider={item.provider}
                      primaryLabel={item.primaryLabel}
                      bi={item.bi}
                      app={item.app}
                      appKey={item.key}
                      onClick={onItemClick}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategorySection;
