import { Box, Typography, Button } from "@mui/material";
import { LucideIcon, ChevronRight } from "lucide-react";
import { ReactNode } from "react";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  iconBgColor?: string;
  iconColor?: string;
  iconSize?: number;
  iconBoxSize?: number;
  className?: string;
  showViewAll?: boolean;
  onViewAllClick?: () => void;
  viewAllText?: string;
  rightContent?: ReactNode;
  leftBadge?: ReactNode;
  borderWidth?: "none" | "border-b" | "border-b-2";
  mb?: number;
  titleSize?: string;
  titleWeight?: number;
  titleColor?: string;
}

export default function SectionHeader({
  icon: Icon,
  title,
  iconBgColor = "#1A3673",
  iconColor = "#FFFFFF",
  iconSize = 16,
  iconBoxSize = 28,
  className = "",
  showViewAll = false,
  onViewAllClick,
  viewAllText = "View All",
  rightContent,
  leftBadge,
  borderWidth = "none",
  mb = 0.5,
  titleSize = "14px",
  titleWeight = 700,
  titleColor = "#231E33",
}: SectionHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        mb,
        pb: borderWidth !== "none" ? 0.5 : 0,
        borderBottom:
          borderWidth === "border-b-2"
            ? "2px solid #E5E7EB"
            : borderWidth === "border-b"
              ? "1px solid #E5E7EB"
              : "none",
        width: "100%",
      }}
      className={className}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            width: iconBoxSize,
            height: iconBoxSize,
            bgcolor: iconBgColor,
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={iconSize} color={iconColor} />
        </Box>
        <Typography
          sx={{
            fontSize: titleSize,
            fontWeight: titleWeight,
            color: titleColor,
            fontFamily: "Open Sans",
          }}
        >
          {title}
        </Typography>
        {leftBadge}
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {rightContent}
        {showViewAll && (
          <Button
            onClick={onViewAllClick}
            endIcon={<ChevronRight size={14} />}
            sx={{
              fontSize: "11px",
              fontWeight: 400,
              color: "#FFFFFF",
              bgcolor: "#1A3673",
              textTransform: "none",
              fontFamily: "Open Sans",
              px: 2,
              py: 0.5,
              borderRadius: "16px",
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              minHeight: "auto",
              "&:hover": {
                bgcolor: "#2861BB",
                boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            {viewAllText}
          </Button>
        )}
      </Box>
    </Box>
  );
}
