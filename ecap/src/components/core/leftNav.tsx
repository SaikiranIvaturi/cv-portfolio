import { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  Home,
  FileText,
  ChevronLeft,
  ChevronRight,
  Settings,
  Activity,
  Zap,
  MessageSquare,
  StickyNote,
  GitBranch,
  LayoutDashboard,
  AppWindow,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  BarChart3,
  CircleDot,
  ArrowUpRight,
  Sparkle,
} from "lucide-react";
import { useRole } from "../../contexts/RoleContext";
import { API_CONFIG, APP_CONFIG } from "../../config";

interface LeftNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onCollapseChange?: (collapsed: boolean) => void;
}

function BackendStatus() {
  const [status, setStatus] = useState<"online" | "offline" | "checking">(
    "checking",
  );

  useEffect(() => {
    // Health check endpoint disabled - set status to online by default
    setStatus("online");

    // Disabled: Backend health check
    // const checkStatus = async () => {
    //   try {
    //     const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.HEALTH_ENDPOINT}`, {
    //       signal: AbortSignal.timeout(3000)
    //     });
    //     setStatus(response.ok ? 'online' : 'offline');
    //   } catch {
    //     setStatus('offline');
    //   }
    // };
    // checkStatus();
    // const interval = setInterval(checkStatus, API_CONFIG.HEALTH_CHECK_INTERVAL);
    // return () => clearInterval(interval);
  }, []);

  const statusColor =
    status === "online"
      ? "#00BBBA"
      : status === "offline"
        ? "#E3725F"
        : "#9CA3AF";

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          bgcolor: statusColor,
        }}
      />
      <Typography
        sx={{
          fontSize: "12px",
          fontWeight: 600,
          color: statusColor,
          fontFamily: "Open Sans",
        }}
      >
        {status === "online"
          ? "ONLINE"
          : status === "offline"
            ? "OFFLINE"
            : "CHECKING"}
      </Typography>
    </Box>
  );
}

export default function LeftNav({
  currentPage,
  onNavigate,
  onCollapseChange,
}: LeftNavProps) {
  const [isCollapsed] = useState(true);
  const [isPlatformStatusExpanded, setIsPlatformStatusExpanded] =
    useState(false);
  const { role, setRole, canAccessSettings } = useRole();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [graphValues] = useState([0.5, 0.7, 0.9]);
  const [colorPhase, setColorPhase] = useState(0);
  const [starVisible, setStarVisible] = useState(true);
  const [star2Visible, setstar2Visible] = useState(false);
  const [star3Visible, setstar3Visible] = useState(true);
  const [trendLineOffset, setTrendLineOffset] = useState(0);

  useEffect(() => {
    // Star blinking animation
    const starInterval = setInterval(() => {
      setStarVisible((prev) => !prev);
    }, 1500);

    const star2Interval = setInterval(() => {
      setstar2Visible((prev) => !prev);
    }, 1800);

    const star3Interval = setInterval(() => {
      setstar3Visible((prev) => !prev);
    }, 2100);

    // Trend line animation (slower)
    const trendInterval = setInterval(() => {
      setTrendLineOffset((prev) => (prev + 1) % 100);
    }, 60);

    return () => {
      clearInterval(starInterval);
      clearInterval(star2Interval);
      clearInterval(star3Interval);
      clearInterval(trendInterval);
    };
  }, []);

  const handleRoleChange = (newRole: string) => {
    if (newRole === "admin") {
      setShowPasswordModal(true);
      setPassword("");
      setPasswordError("");
    } else {
      setRole(newRole as any);
    }
  };

  const handlePasswordSubmit = () => {
    const success = setRole("admin", password);
    if (success) {
      setShowPasswordModal(false);
      setPassword("");
      setPasswordError("");
    } else {
      setPasswordError("Incorrect password");
    }
  };

  const handlePasswordCancel = () => {
    setShowPasswordModal(false);
    setPassword("");
    setPasswordError("");
  };

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "insights", label: "Auto-Detected Insights", icon: Zap },
    { id: "dashboards-hub", label: "Dashboard Hub", icon: LayoutDashboard },
    { id: "apps", label: "Apps", icon: AppWindow },
  ];

  const drawerWidth = 80;

  const handleToggleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    if (onCollapseChange) {
      onCollapseChange(newCollapsed);
    }
  };

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "#1A3673",
            color: "#FFFFFF",
            borderRight: "none",
            borderRadius: 0,
            transition: "width 0.3s",
            overflowX: "hidden",
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 1.4,
            px: isCollapsed ? 2 : 1.4,
            pb: isCollapsed ? 1 : 0,
            position: "relative",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                position: "relative",
                width: 56,
                height: 56,
                bgcolor: "rgba(68, 184, 243, 0.08)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                padding: "10px",
                backdropFilter: "blur(3px)",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                border: "1px solid rgba(68, 184, 243, 0.15)",
                overflow: "visible",
                pb: 1,
                transition: "height 0.3s ease",
              }}
            >
              {/* Blinking Stars */}
              <Box
                sx={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  opacity: starVisible ? 1 : 0,
                  transition: "opacity 0.5s ease-in-out",
                }}
              >
                <Sparkle size={10} color="#00BBBA" fill="#00BBBA" />
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  bottom: 8,
                  right: -2,
                  opacity: star3Visible ? 1 : 0,
                  transition: "opacity 0.5s ease-in-out",
                }}
              >
                <Sparkle size={6} color="#8FD4F8" fill="#8FD4F8" />
              </Box>

              {/* Y-Axis with Arrow */}
              <Box
                sx={{
                  position: "absolute",
                  left: 6,
                  bottom: 6,
                  width: "2px",
                  height: "36px",
                  bgcolor: "rgba(255, 255, 255, 0.5)",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  left: 4,
                  bottom: 40,
                  width: 0,
                  height: 0,
                  borderLeft: "3px solid transparent",
                  borderRight: "3px solid transparent",
                  borderBottom: "4px solid rgba(255, 255, 255, 0.5)",
                }}
              />

              {/* X-Axis with Arrow */}
              <Box
                sx={{
                  position: "absolute",
                  left: 6,
                  bottom: 6,
                  width: "44px",
                  height: "2px",
                  bgcolor: "rgba(255, 255, 255, 0.5)",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  left: 48,
                  bottom: 4,
                  width: 0,
                  height: 0,
                  borderTop: "3px solid transparent",
                  borderBottom: "3px solid transparent",
                  borderLeft: "4px solid rgba(255, 255, 255, 0.5)",
                }}
              />

              {/* Static Bar Chart */}
              {graphValues.map((value, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 7,
                    height: `${value * 32}px`,
                    bgcolor:
                      index === 0
                        ? "#44B8F3"
                        : index === 1
                          ? "#00BBBA"
                          : "#8FD4F8",
                    borderRadius: "3px 3px 0 0",
                    marginLeft: index > 0 ? "5px" : "0px",
                  }}
                />
              ))}

              {/* Professional Animated Trend Line */}
              <svg
                width="44"
                height="36"
                style={{
                  position: "absolute",
                  bottom: "13px",
                  left: "6px",
                  pointerEvents: "none",
                }}
              >
                <defs>
                  <clipPath id="trendClip">
                    <rect
                      x="0"
                      y="0"
                      width={Math.min((trendLineOffset % 50) * 0.88, 44)}
                      height="36"
                    />
                  </clipPath>
                  <linearGradient
                    id="lineGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="rgba(255, 255, 255, 0.7)" />
                    <stop offset="100%" stopColor="rgba(255, 255, 255, 1)" />
                  </linearGradient>
                </defs>
                {/* Upward arrow between bar 1 and 2 */}
                <polygon
                  points={`9.5,${36 - ((graphValues[0] + graphValues[1]) / 2) * 32 - 3} ${8.5},${36 - ((graphValues[0] + graphValues[1]) / 2) * 32 - 3 + 2.5} ${10.5},${36 - ((graphValues[0] + graphValues[1]) / 2) * 32 - 3 + 2.5}`}
                  fill="rgba(255, 255, 255, 0.95)"
                  clipPath="url(#trendClip)"
                  style={{
                    filter: "drop-shadow(0 1px 3px rgba(255, 255, 255, 0.5))",
                  }}
                />
                {/* Upward arrow between bar 2 and 3 */}
                <polygon
                  points={`21.5,${36 - ((graphValues[1] + graphValues[2]) / 2) * 32 - 3} ${20.5},${36 - ((graphValues[1] + graphValues[2]) / 2) * 32 - 3 + 2.5} ${22.5},${36 - ((graphValues[1] + graphValues[2]) / 2) * 32 - 3 + 2.5}`}
                  fill="rgba(255, 255, 255, 0.95)"
                  clipPath="url(#trendClip)"
                  style={{
                    filter: "drop-shadow(0 1px 3px rgba(255, 255, 255, 0.5))",
                  }}
                />
                {/* Animated line with gradient - follows actual bar heights */}
                <path
                  d={`M 3.5,${36 - graphValues[0] * 32 - 3} L 15.5,${36 - graphValues[1] * 32 - 3} L 27.5,${36 - graphValues[2] * 32 - 3}`}
                  stroke="url(#lineGradient)"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  clipPath="url(#trendClip)"
                  style={{
                    filter: "drop-shadow(0 1px 4px rgba(255, 255, 255, 0.5))",
                  }}
                />
                {/* Arrow head at the end of trend line - rotates based on slope */}
                <g
                  transform={`translate(${Math.min((trendLineOffset % 50) * 0.88, 27.5)}, ${
                    (trendLineOffset % 50) * 0.88 <= 3.5
                      ? 36 - graphValues[0] * 32 - 3
                      : (trendLineOffset % 50) * 0.88 <= 15.5
                        ? 36 -
                          graphValues[0] * 32 -
                          3 -
                          (((trendLineOffset % 50) * 0.88 - 3.5) *
                            (graphValues[1] - graphValues[0]) *
                            32) /
                            12
                        : 36 -
                          graphValues[1] * 32 -
                          3 -
                          ((Math.min((trendLineOffset % 50) * 0.88, 27.5) -
                            15.5) *
                            (graphValues[2] - graphValues[1]) *
                            32) /
                            12
                  }) rotate(${
                    (trendLineOffset % 50) * 0.88 <= 3.5
                      ? (-Math.atan2(
                          (graphValues[1] - graphValues[0]) * 32,
                          12,
                        ) *
                          180) /
                        Math.PI
                      : (trendLineOffset % 50) * 0.88 <= 15.5
                        ? (-Math.atan2(
                            (graphValues[1] - graphValues[0]) * 32,
                            12,
                          ) *
                            180) /
                          Math.PI
                        : (-Math.atan2(
                            (graphValues[2] - graphValues[1]) * 32,
                            12,
                          ) *
                            180) /
                          Math.PI
                  })`}
                >
                  <polygon
                    points="5,0 -2.5,-3 -2.5,3"
                    fill="rgba(255, 255, 255, 0.95)"
                    style={{
                      filter: "drop-shadow(0 1px 3px rgba(255, 255, 255, 0.5))",
                    }}
                  />
                </g>
              </svg>
            </Box>
            {!isCollapsed && (
              <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                <Typography
                  sx={{
                    fontSize: "20px",
                    fontWeight: 700,
                    fontFamily: "Open Sans",
                    whiteSpace: "nowrap",
                  }}
                >
                  ECAP Elevate
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Powered by Elevance Health - Above divider */}
        {!isCollapsed && (
          <Box sx={{ px: 1, pb: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 0.5,
              }}
            >
              <Typography
                sx={{
                  fontSize: "10px",
                  fontWeight: 300,
                  fontFamily: "Open Sans",
                  color: "rgba(255, 255, 255, 0.6)",
                  textTransform: "lowercase",
                }}
              >
                powered by
              </Typography>
              <img
                src="/elv-logo.svg"
                alt="Elevance Health"
                style={{
                  height: "17px",
                  filter: "brightness(0) invert(1) opacity(1.0)",
                }}
              />
            </Box>
          </Box>
        )}

        <Divider sx={{ borderColor: "rgba(68, 184, 243, 0.25)" }} />

        {/* Navigation Items */}
        <List sx={{ px: 2, py: 2 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
                <Tooltip
                  title={isCollapsed ? item.label : ""}
                  placement="right"
                  arrow
                  componentsProps={{
                    tooltip: {
                      sx: {
                        bgcolor: "#FFFFFF",
                        color: "#1A3673",
                        fontSize: "13px",
                        fontFamily: "Open Sans",
                        fontWeight: 500,
                        px: 1.5,
                        py: 0.75,
                        borderRadius: "6px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                        border: "1px solid #E5E7EB",
                        "& .MuiTooltip-arrow": {
                          color: "#FFFFFF",
                          "&::before": {
                            border: "1px solid #E5E7EB",
                          },
                        },
                      },
                    },
                  }}
                >
                  <ListItemButton
                    onClick={() => onNavigate(item.id)}
                    sx={{
                      borderRadius: "8px",
                      py: 1,
                      px: 1,
                      bgcolor: isActive ? "#FFFFFF" : "transparent",
                      color: isActive ? "#1A3673" : "#FFFFFF",
                      "&:hover": {
                        bgcolor: isActive
                          ? "#FFFFFF"
                          : "rgba(68, 184, 243, 0.2)",
                        color: isActive ? "#1A3673" : "#FFFFFF",
                      },
                      transition: "all 0.2s",
                      justifyContent: isCollapsed ? "center" : "flex-start",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: isCollapsed ? "auto" : 44,
                        color: isActive ? "#1A3673" : "#FFFFFF",
                        justifyContent: "center",
                      }}
                    >
                      <Icon size={18} />
                    </ListItemIcon>
                    {!isCollapsed && (
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: "14px",
                          fontWeight: isActive ? 600 : 500,
                          fontFamily: "Open Sans",
                          color: isActive ? "#1A3673" : "#FFFFFF",
                        }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            );
          })}

          {canAccessSettings && (
            <ListItem disablePadding sx={{ mb: 1 }}>
              <Tooltip
                title={isCollapsed ? "Admin Settings" : ""}
                placement="right"
                arrow
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: "#FFFFFF",
                      color: "#1A3673",
                      fontSize: "13px",
                      fontFamily: "Open Sans",
                      fontWeight: 500,
                      px: 1.5,
                      py: 0.75,
                      borderRadius: "6px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                      border: "1px solid #E5E7EB",
                      "& .MuiTooltip-arrow": {
                        color: "#FFFFFF",
                        "&::before": {
                          border: "1px solid #E5E7EB",
                        },
                      },
                    },
                  },
                }}
              >
                <ListItemButton
                  onClick={() => onNavigate("settings")}
                  sx={{
                    borderRadius: "8px",
                    py: 1.5,
                    px: 1,
                    bgcolor:
                      currentPage === "settings" ? "#FFFFFF" : "transparent",
                    color: currentPage === "settings" ? "#1A3673" : "#FFFFFF",
                    "&:hover": {
                      bgcolor:
                        currentPage === "settings"
                          ? "#FFFFFF"
                          : "rgba(68, 184, 243, 0.2)",
                      color: currentPage === "settings" ? "#1A3673" : "#FFFFFF",
                    },
                    transition: "all 0.2s",
                    justifyContent: isCollapsed ? "center" : "flex-start",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: isCollapsed ? "auto" : 44,
                      color: currentPage === "settings" ? "#1A3673" : "#FFFFFF",
                      justifyContent: "center",
                    }}
                  >
                    <Settings size={24} />
                  </ListItemIcon>
                  {!isCollapsed && (
                    <ListItemText
                      primary="Admin Settings"
                      primaryTypographyProps={{
                        fontSize: "14px",
                        fontWeight: currentPage === "settings" ? 600 : 500,
                        fontFamily: "Open Sans",
                        color:
                          currentPage === "settings" ? "#1A3673" : "#FFFFFF",
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          )}
        </List>

        {/* Bottom Section */}
        <Box sx={{ mt: "auto", p: 3, pt: 2 }}>
          <Divider sx={{ borderColor: "rgba(68, 184, 243, 0.25)", mb: 2 }} />

          {!isCollapsed && (
            <>
              {/* Platform Details */}
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    pb: 1,
                    px: 1,
                    cursor: "not-allowed",
                    borderRadius: "8px",
                    opacity: 0.5,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: 600,
                      fontFamily: "Open Sans",
                      color: "#FFFFFF",
                    }}
                  >
                    Configuration
                  </Typography>
                  {isPlatformStatusExpanded ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </Box>
                <Collapse in={false}>
                  <Box sx={{ px: 1, pb: 2 }}>
                    {/* Version */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1.5,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "12px",
                          color: "rgba(255, 255, 255, 0.7)",
                          fontFamily: "Open Sans",
                        }}
                      >
                        Version:
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#FFFFFF",
                          fontFamily: "Open Sans",
                        }}
                      >
                        v1.4.3
                      </Typography>
                    </Box>

                    {/* Backend Status */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "12px",
                          color: "rgba(255, 255, 255, 0.7)",
                          fontFamily: "Open Sans",
                        }}
                      >
                        Backend:
                      </Typography>
                      <BackendStatus />
                    </Box>

                    {/* Dev: Switch Role */}
                    <Box sx={{ mb: 0 }}>
                      <Typography
                        sx={{
                          fontSize: "11px",
                          color: "rgba(255, 255, 255, 0.6)",
                          mb: 1,
                          fontFamily: "Open Sans",
                        }}
                      >
                        Dev: Switch Role
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Select
                          value={role}
                          onChange={(e) => handleRoleChange(e.target.value)}
                          sx={{
                            bgcolor: "rgba(68, 184, 243, 0.08)",
                            color: "#FFFFFF",
                            fontSize: "12px",
                            fontFamily: "Open Sans",
                            borderRadius: "6px",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "rgba(68, 184, 243, 0.2)",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "rgba(68, 184, 243, 0.3)",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "rgba(68, 184, 243, 0.4)",
                            },
                            "& .MuiSvgIcon-root": {
                              color: "#FFFFFF",
                            },
                          }}
                        >
                          <MenuItem value="business">Business User</MenuItem>
                          <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>
                </Collapse>
              </Box>
            </>
          )}
        </Box>
      </Drawer>

      {/* Password Modal */}
      <Dialog
        open={showPasswordModal}
        onClose={handlePasswordCancel}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            minWidth: 400,
          },
        }}
      >
        <DialogTitle
          sx={{ fontFamily: "Open Sans", fontWeight: 700, color: "#1A3673" }}
        >
          Admin Access Required
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{
              fontSize: "14px",
              color: "#6B7280",
              mb: 2,
              fontFamily: "Open Sans",
            }}
          >
            Please enter the admin password to continue
          </Typography>
          <TextField
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handlePasswordSubmit()}
            error={!!passwordError}
            helperText={passwordError}
            placeholder="Enter password"
            autoFocus
            sx={{
              "& .MuiOutlinedInput-root": {
                fontFamily: "Open Sans",
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handlePasswordCancel}
            sx={{
              color: "#6B7280",
              fontFamily: "Open Sans",
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePasswordSubmit}
            variant="contained"
            sx={{
              background: "linear-gradient(90deg, #1A3673 0%, #2861BB 100%)",
              fontFamily: "Open Sans",
              textTransform: "none",
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
