import { useState, useCallback } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { Bell, User, LogOut, ChevronDown, AlertTriangle } from "lucide-react";
import { useRole } from "./contexts/RoleContext";
import { useAuth } from "./contexts/AuthContext";
import { APP_CONFIG } from "./config";
import { IDLE_TIMEOUT_MS, IDLE_WARNING_MS } from "./config/okta";
import { useIdleTimeout } from "./hooks/useIdleTimeout";
import LeftNav from "./components/core/LeftNav";
import HomePage from "./components/core/HomePage";
import DashboardPage from "./components/core/DashboardPage";
import NotesManagementPage from "./components/notes/NotesManagementPage";
import UnifiedAdminPage from "./components/config/UnifiedAdminPage";
import AIChat from "./components/chat/AIChat";
import DocumentationPage from "./components/core/DocumentationPage";
import DecisionTreePageV4 from "./components/knowledge/DecisionTreePageV4";
import DashboardsHub from "./components/dashboards/DashboardsHub";
import AppsPage from "./components/apps/AppsPage";
import AccessDenied from "./components/core/AccessDenied";
import SessionWarningModal from "./components/auth/SessionWarningModal";
import { FlashCard } from "./types";
import LoginPage from "./components/core/LoginPage";
import OktaCallback from "./components/auth/OktaCallback";

export default function AppContent() {
  const { isAuthenticated, isLoading, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [chatWithCard, setChatWithCard] = useState<FlashCard | null>(null);
  const [decisionTreeMode, setDecisionTreeMode] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showSessionWarning, setShowSessionWarning] = useState(false);
  const { role, canAccessSettings } = useRole();

  // Stable callback for warning - prevents timer resets on re-renders
  const handleWarning = useCallback(() => {
    console.log("[AppContent] Session warning triggered");
    setShowSessionWarning(true);
  }, []);

  // Idle timeout monitoring - only active when authenticated
  const { resetTimer } = useIdleTimeout({
    onTimeout: logout,
    onWarn: handleWarning,
    enabled: isAuthenticated,
  });

  // Debug authentication state and current route
  console.log("[AppContent] Route info:", {
    pathname: location.pathname,
    isAuthenticated: isAuthenticated,
  });

  const handleNavigate = (page: string, card?: FlashCard) => {
    if (card) {
      setChatWithCard(card);
    }
    // Reset chat state when navigating to Universal Chat from nav
    if (page === "ai-chat" && !card) {
      setChatWithCard(null);
      setDecisionTreeMode(false);
    }
    // Navigate using React Router
    navigate(`/${page === "home" ? "" : page}`);
  };

  const handleChatWithCard = (card: FlashCard) => {
    setChatWithCard(card);
    setDecisionTreeMode(false);
    navigate("/ai-chat");
  };

  const handleChatWithDecisionTree = () => {
    setChatWithCard(null);
    setDecisionTreeMode(true);
    navigate("/ai-chat");
  };

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    handleUserMenuClose();
    logout();
    // Note: logout() already does window.location.replace('/'), so no navigate() needed
  };

  // Get current page from location for navigation highlighting
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === "/") return "home";
    if (path.startsWith("/ai-chat")) return "ai-chat";
    if (path.startsWith("/insights")) return "insights";
    if (path.startsWith("/documentation")) return "documentation";
    if (path.startsWith("/settings")) return "settings";
    if (path.startsWith("/notes-logs")) return "notes-logs";
    if (path.startsWith("/decision-tree")) return "decision-tree";
    if (path.startsWith("/dashboards-hub")) return "dashboards-hub";
    if (path.startsWith("/apps")) return "apps";
    return "home";
  };

  const currentPage = getCurrentPage();

  const pageConfig: Record<string, { title: string; subtitle: string }> = {
    home: { title: "", subtitle: "" },
    insights: {
      title: "Auto-Detected Insights",
      subtitle:
        "Automatically surfaced variances that demand attention and action.",
    },
    "ai-chat": {
      title: "Universal Chat",
      subtitle: "Ask questions and get intelligent insights",
    },
    documentation: {
      title: "Documentation",
      subtitle: "Guides, best practices, and technical references",
    },
    settings: { title: "Settings", subtitle: "Configure your preferences" },
    "notes-logs": {
      title: "Leadership Notes",
      subtitle: "Notes from senior leadership",
    },
    "decision-tree": {
      title: "Analyst Decision Tree",
      subtitle: "Pre-defined analytical questions and decision paths",
    },
    "dashboards-hub": {
      title: "Dashboard Hub",
      subtitle: "Access all Power BI dashboards and reports",
    },
  };

  const config = pageConfig[currentPage] || pageConfig.home;

  const getUserInfo = () => {
    if (user) {
      // Get initials from name (first letter of first and last name)
      const nameParts = user.name.split(" ");
      const initials =
        nameParts.length > 1
          ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
          : user.name.substring(0, 2).toUpperCase();

      return {
        name: user.name,
        initials: initials,
      };
    }
    return { name: "User", initials: "U" };
  };

  const userInfo = getUserInfo();

  // Show loading spinner while checking authentication status
  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0F1F47 0%, #1A3673 50%, #2861BB 100%)",
        }}
      >
        <CircularProgress size={60} thickness={4} sx={{ color: "#FFFFFF" }} />
      </Box>
    );
  }

  // If not authenticated and not on callback route, show login
  if (!isAuthenticated && location.pathname !== "/callback") {
    return <LoginPage />;
  }

  return (
    <>
      {/* Session Warning Modal - only shown when authenticated */}
      {isAuthenticated && (
        <SessionWarningModal
          open={showSessionWarning}
          onStayLoggedIn={() => {
            setShowSessionWarning(false);
            resetTimer();
          }}
          onLogout={logout}
          timeRemainingMs={IDLE_TIMEOUT_MS - IDLE_WARNING_MS}
        />
      )}

      <Routes>
        {/* OKTA Callback Route - accessible without authentication */}
        <Route path="/callback" element={<OktaCallback />} />

        {/* Main Application Routes - require authentication */}
        <Route
          path="/*"
          element={
            <Box
              sx={{ minHeight: "100vh", bgcolor: "#FFFFFF", display: "flex" }}
            >
              <LeftNav
                currentPage={currentPage}
                onNavigate={handleNavigate}
                onCollapseChange={setIsNavCollapsed}
              />
              <Box sx={{ flex: 1 }}>
                {location.pathname !== "/ai-chat" && (
                  <Box
                    component="header"
                    sx={{
                      bgcolor: "#FFFFFF",
                      position: "sticky",
                      top: 0,
                      zIndex: 1000,
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                    }}
                  >
                    {/* Environment Notice Banner */}
                    {APP_CONFIG.ENV !== "production" && (
                      <Box
                        sx={{
                          bgcolor:
                            APP_CONFIG.ENV === "uat" ? "#FFF4E6" : "#D9F5F5",
                          borderBottom:
                            APP_CONFIG.ENV === "uat"
                              ? "1px solid #FFE0B2"
                              : "1px solid #B2EBEA",
                          px: { xs: 2, sm: 3, lg: 4 },
                          py: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                        }}
                      >
                        <AlertTriangle
                          size={16}
                          color={
                            APP_CONFIG.ENV === "uat" ? "#D97706" : "#00BBBA"
                          }
                        />
                        <Typography
                          sx={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#231E33",
                            fontFamily: "Open Sans",
                          }}
                        >
                          Environment Notice:
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "13px",
                            fontWeight: 400,
                            color: "#231E33",
                            fontFamily: "Open Sans",
                          }}
                        >
                          You are Currently Accessing{" "}
                          {APP_CONFIG.ENV === "uat" ? "UAT" : "Development"}{" "}
                          Environment
                        </Typography>
                      </Box>
                    )}
                    <Box
                      sx={{
                        px: { xs: 2, sm: 3, lg: 4 },
                        pb: { xs: 1.5, sm: 1 },
                        pt: { xs: 1.5, sm: 1.9 },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 2,
                        }}
                      >
                        {/* Show platform title only on homepage */}
                        {currentPage === "home" ? (
                          <Box
                            sx={{
                              flex: 1,
                              minWidth: 0,
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: { xs: "18px", sm: "22px" },
                                fontWeight: 600,
                                color: "#1A3673",
                                fontFamily: "Open Sans",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              Enterprise Cost of Care Analytics Platform Elevate
                            </Typography>
                          </Box>
                        ) : config.title ? (
                          <Box
                            sx={{
                              flex: 1,
                              minWidth: 0,
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                            }}
                          >
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography
                                sx={{
                                  fontSize: { xs: "18px", sm: "20px" },
                                  fontWeight: 600,
                                  color: "#231E33",
                                  fontFamily: "Open Sans",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {currentPage === "insights" ? "" : config.title}
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: { xs: "12px", sm: "14px" },
                                  color: "#6B7280",
                                  fontFamily: "Open Sans",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {currentPage === "insights"
                                  ? ""
                                  : config.subtitle}
                              </Typography>
                            </Box>
                          </Box>
                        ) : (
                          <Box></Box>
                        )}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            flexShrink: 0,
                          }}
                        >
                          <IconButton
                            sx={{
                              position: "relative",
                              p: 0.75,
                              background:
                                "linear-gradient(to bottom right, #E1EDFF, #FFFFFF)",
                              borderRadius: "12px",
                              border: "1px solid #E5E7EB",
                              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                              transition: "all 0.2s",
                              "&:hover": {
                                borderColor: "#1A3673",
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                bgcolor: "transparent",
                              },
                            }}
                          >
                            <Bell size={18} color="#6B7280" />
                          </IconButton>
                          <Box
                            onClick={handleUserMenuClick}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.25,
                              px: 0.5,
                              py: 0.5,
                              background:
                                "linear-gradient(to right, #FFFFFF, #E1EDFF)",
                              borderRadius: "12px",
                              border: "1px solid #E5E7EB",
                              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                              cursor: "pointer",
                              transition: "all 0.2s",
                              "&:hover": {
                                borderColor: "#2861BB",
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                              },
                            }}
                          >
                            <Box sx={{ position: "relative" }}>
                              <Box
                                sx={{
                                  width: 32,
                                  height: 32,
                                  background:
                                    "linear-gradient(to bottom right, #1A3673, #2861BB, #44B8F3)",
                                  borderRadius: "8px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "#FFFFFF",
                                  fontSize: "12px",
                                  fontWeight: 700,
                                  fontFamily: "Open Sans",
                                  boxShadow:
                                    "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                  transition: "transform 0.2s",
                                  "&:hover": {
                                    transform: "scale(1.05)",
                                  },
                                }}
                              >
                                <User size={16} color="#FFFFFF" />
                              </Box>
                            </Box>
                            <Box
                              sx={{
                                display: { xs: "none", sm: "flex" },
                                flexDirection: "column",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: "14px",
                                  fontWeight: 600,
                                  color: "#1F2937",
                                  fontFamily: "Open Sans",
                                  lineHeight: 1.2,
                                }}
                              >
                                {userInfo.name}
                              </Typography>
                            </Box>
                            <ChevronDown
                              size={16}
                              color="#6B7280"
                              style={{
                                marginLeft: "4px",
                                transition: "transform 0.2s",
                                transform: Boolean(anchorEl)
                                  ? "rotate(180deg)"
                                  : "rotate(0deg)",
                              }}
                            />
                          </Box>
                          <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleUserMenuClose}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "right",
                            }}
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "right",
                            }}
                            sx={{
                              mt: 0.5,
                              "& .MuiPaper-root": {
                                borderRadius: "6px",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                                border: "1px solid #E5E7EB",
                                minWidth: 115,
                              },
                            }}
                          >
                            <MenuItem
                              onClick={handleSignOut}
                              sx={{
                                fontSize: "12px",
                                fontFamily: "Open Sans",
                                fontWeight: 500,
                                color: "#374151",
                                py: 0,
                                px: 1.25,
                                minHeight: "auto",
                                display: "flex",
                                alignItems: "center",
                                gap: 0.75,
                                transition: "all 0.15s",
                                bgcolor: "transparent !important",
                                "&:hover": {
                                  color: "#1A3673",
                                },
                              }}
                            >
                              <LogOut size={13} strokeWidth={2} />
                              Sign Out
                            </MenuItem>
                          </Menu>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                )}
                <Box component="main" sx={{ pl: 2, pr: 0, pt: 0, pb: 0 }}>
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <HomePage
                          onNavigate={handleNavigate}
                          onChatWithCard={handleChatWithCard}
                          role={role}
                        />
                      }
                    />
                    <Route
                      path="/insights"
                      element={<DashboardPage onNavigate={handleNavigate} />}
                    />
                    <Route
                      path="/dashboards-hub"
                      element={<DashboardsHub onNavigate={handleNavigate} />}
                    />
                    <Route path="/apps" element={<AppsPage />} />
                    <Route
                      path="/notes-logs"
                      element={<NotesManagementPage />}
                    />
                    <Route
                      path="/ai-chat"
                      element={
                        <AIChat
                          isNavCollapsed={isNavCollapsed}
                          selectedCard={chatWithCard}
                          onClearCard={() => setChatWithCard(null)}
                          decisionTreeMode={decisionTreeMode}
                          onClearDecisionTree={() => setDecisionTreeMode(false)}
                          onNavigate={handleNavigate}
                        />
                      }
                    />
                    <Route
                      path="/documentation"
                      element={<DocumentationPage />}
                    />
                    <Route
                      path="/settings"
                      element={
                        canAccessSettings ? (
                          <UnifiedAdminPage onNavigate={handleNavigate} />
                        ) : (
                          <AccessDenied
                            requiredRole="Admin"
                            onNavigate={handleNavigate}
                          />
                        )
                      }
                    />
                    <Route
                      path="/decision-tree"
                      element={
                        <DecisionTreePageV4
                          onChatWithDecisionTree={handleChatWithDecisionTree}
                          onNavigate={handleNavigate}
                        />
                      }
                    />
                  </Routes>
                </Box>
              </Box>
            </Box>
          }
        />
      </Routes>
    </>
  );
}
