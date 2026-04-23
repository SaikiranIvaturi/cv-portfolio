import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Modal,
  IconButton,
} from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import {
  Lock,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  X,
  Copy,
} from "lucide-react";

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [callbackError, setCallbackError] = useState<string | null>(null);
  const [showHelpSection, setShowHelpSection] = useState(false);
  const [showCopiedNotification, setShowCopiedNotification] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setShowCopiedNotification(true);
      setTimeout(() => setShowCopiedNotification(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  useEffect(() => {
    // Check for callback error from URL params and localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const hasCallbackError = urlParams.get("error") === "callback";

    console.log(
      "[LoginPage] Checking for callback error, URL:",
      window.location.href,
    );
    console.log("[LoginPage] hasCallbackError:", hasCallbackError);

    if (hasCallbackError) {
      const storedError = sessionStorage.getItem("oktaCallbackError");
      console.log("[LoginPage] storedError:", storedError);

      if (storedError) {
        try {
          const errorData = JSON.parse(storedError);
          console.log("[LoginPage] Setting callback error:", errorData.message);
          setCallbackError(errorData.message);
          // Clear the error from sessionStorage
          sessionStorage.removeItem("oktaCallbackError");
        } catch {
          console.log("[LoginPage] Error parsing stored error, using default");
          setCallbackError("Authentication failed");
        }
      } else {
        console.log("[LoginPage] No stored error, using default message");
        setCallbackError("Authentication failed");
      }
    }

    // Always clean the URL on mount to remove any error params
    if (window.location.search.includes("error=callback")) {
      console.log("[LoginPage] Cleaning URL to remove error=callback");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    setCallbackError(null); // Clear any previous errors
    try {
      await login();
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(135deg, #0F1F47 0%, #1A3673 50%, #2861BB 100%)",
        "&::before": {
          content: '""',
          position: "absolute",
          width: "150%",
          height: "150%",
          background:
            "radial-gradient(circle at 30% 20%, rgba(68, 184, 243, 0.08) 0%, transparent 50%)",
          animation: "pulse 8s ease-in-out infinite",
        },
        "@keyframes pulse": {
          "0%, 100%": { opacity: 0.5, transform: "scale(1)" },
          "50%": { opacity: 0.8, transform: "scale(1.1)" },
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 480,
          mx: 3,
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            textAlign: "center",
            mb: 5,
            animation: "fadeInDown 0.8s ease-out",
            "@keyframes fadeInDown": {
              "0%": { opacity: 0, transform: "translateY(-20px)" },
              "100%": { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          <img
            src="/elv-logo.svg"
            alt="Elevance Health"
            style={{
              height: "52px",
              width: "auto",
              filter: "drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2))",
            }}
          />
        </Box>

        {/* Main Card */}
        <Box
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(20px)",
            borderRadius: 4,
            boxShadow:
              "0 24px 48px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1) inset",
            overflow: "hidden",
            animation: "fadeInUp 0.8s ease-out 0.2s both",
            "@keyframes fadeInUp": {
              "0%": { opacity: 0, transform: "translateY(30px)" },
              "100%": { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          {/* Accent Bar */}
          <Box
            sx={{
              height: 4,
              background:
                "linear-gradient(90deg, #1A3673 0%, #44B8F3 50%, #00BBBA 100%)",
            }}
          />

          <Box sx={{ p: 5 }}>
            {/* Badge */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 0.75,
                mb: 3,
                borderRadius: 2,
                background:
                  "linear-gradient(135deg, rgba(26, 54, 115, 0.08) 0%, rgba(68, 184, 243, 0.08) 100%)",
                border: "1px solid rgba(26, 54, 115, 0.12)",
              }}
            >
              <Lock size={14} color="#1A3673" />
              <Typography
                sx={{
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.5px",
                  color: "#1A3673",
                  fontFamily: "Open Sans",
                  textTransform: "uppercase",
                }}
              >
                Secure Access
              </Typography>
            </Box>

            {/* Title */}
            <Typography
              sx={{
                fontSize: "28px",
                fontWeight: 300,
                color: "#0F1F47",
                mb: 1,
                fontFamily: "Open Sans",
                letterSpacing: "-0.5px",
                lineHeight: 1.3,
              }}
            >
              Welcome to{" "}
              <Box
                component="span"
                sx={{
                  fontWeight: 600,
                  background:
                    "linear-gradient(135deg, #1A3673 0%, #44B8F3 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                ECAP Elevate
              </Box>
            </Typography>

            {/* Subtitle */}
            <Typography
              sx={{
                fontSize: "14px",
                color: "#64748B",
                mb: 4,
                fontFamily: "Open Sans",
                fontWeight: 400,
                lineHeight: 1.6,
              }}
            >
              Enterprise Cost of Care Analytics Platform
            </Typography>

            {/* Divider */}
            <Box
              sx={{
                height: 1,
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(15, 31, 71, 0.1) 50%, transparent 100%)",
                mb: 4,
              }}
            />

            {/* Error Alert */}
            {callbackError && (
              <Box sx={{ mb: 3 }}>
                <Alert
                  severity="error"
                  icon={<AlertCircle size={20} />}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: "rgba(239, 68, 68, 0.08)",
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                    "& .MuiAlert-icon": {
                      color: "#DC2626",
                    },
                    "& .MuiAlert-message": {
                      color: "#991B1B",
                      fontFamily: "Open Sans",
                      fontSize: "14px",
                      fontWeight: 500,
                    },
                  }}
                >
                  {callbackError.includes("Access denied") ||
                  callbackError.includes(
                    "User is not assigned to the client application",
                  ) ? (
                    <Box>
                      <Typography
                        sx={{
                          fontSize: "14px",
                          color: "#991B1B",
                          fontWeight: 500,
                          mb: 0.5,
                        }}
                      >
                        Access Denied
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "12px",
                          color: "#991B1B",
                          fontStyle: "italic",
                        }}
                      >
                        For more info, see "Need Help?" below.
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <Typography
                        sx={{
                          fontSize: "14px",
                          color: "#991B1B",
                          fontWeight: 500,
                          mb: 0.5,
                        }}
                      >
                        Authentication Failed
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "12px",
                          color: "#991B1B",
                          fontStyle: "italic",
                        }}
                      >
                        For more info, see "Need Help?" below.
                      </Typography>
                    </Box>
                  )}
                </Alert>
              </Box>
            )}

            {/* Sign In Button */}
            <Button
              onClick={handleLogin}
              disabled={isLoading}
              fullWidth
              variant="contained"
              sx={{
                py: 2,
                px: 3,
                fontSize: "15px",
                fontWeight: 600,
                fontFamily: "Open Sans",
                textTransform: "none",
                borderRadius: 2.5,
                background: "linear-gradient(135deg, #1A3673 0%, #2861BB 100%)",
                boxShadow: "0 8px 24px rgba(26, 54, 115, 0.3)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover:not(.Mui-disabled)": {
                  background:
                    "linear-gradient(135deg, #2861BB 0%, #44B8F3 100%)",
                  boxShadow: "0 12px 32px rgba(26, 54, 115, 0.4)",
                  transform: "translateY(-2px)",
                },
                "&:active:not(.Mui-disabled)": {
                  transform: "translateY(0)",
                  boxShadow: "0 4px 16px rgba(26, 54, 115, 0.3)",
                },
                "&.Mui-disabled": {
                  background:
                    "linear-gradient(135deg, #CBD5E1 0%, #94A3B8 100%)",
                  color: "#FFFFFF",
                  opacity: 0.6,
                },
              }}
            >
              {isLoading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <CircularProgress
                    size={18}
                    thickness={3}
                    sx={{ color: "#FFFFFF" }}
                  />
                  <span>Authenticating...</span>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1.5,
                  }}
                >
                  <span>Sign In with SSO</span>
                  <ArrowRight size={18} strokeWidth={2.5} />
                </Box>
              )}
            </Button>

            {/* Help Modal */}
            <Modal
              open={showHelpSection}
              onClose={() => setShowHelpSection(false)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 3,
                  boxShadow: "0 24px 48px rgba(0, 0, 0, 0.25)",
                  maxWidth: 550,
                  width: "90%",
                  height: "fit-content",
                  maxHeight: "none",
                  overflow: "visible",
                  position: "relative",
                }}
              >
                {/* Modal Header */}
                <Box
                  sx={{
                    p: 2,
                    borderBottom: "1px solid #E5E7EB",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#1A3673",
                      fontFamily: "Open Sans",
                    }}
                  >
                    Login Help & Support
                  </Typography>
                  <IconButton
                    onClick={() => setShowHelpSection(false)}
                    sx={{
                      color: "#6B7280",
                      "&:hover": {
                        backgroundColor: "rgba(107, 114, 128, 0.1)",
                      },
                    }}
                  >
                    <X size={20} />
                  </IconButton>
                </Box>

                {/* Modal Content */}
                <Box sx={{ p: 1.5 }}>
                  {/* Single Column Layout */}
                  <Box>
                    {/* Common Issues Section */}
                    <Box
                      sx={{
                        p: 1.5,
                        backgroundColor: "#F8FAFC",
                        borderRadius: 1.5,
                        border: "1px solid #E2E8F0",
                        mb: 1.5,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "#374151",
                          mb: 1,
                          fontFamily: "Open Sans",
                        }}
                      >
                        Common Login Issues
                      </Typography>
                      <Box
                        component="ul"
                        sx={{
                          m: 0,
                          pl: 2,
                          fontSize: "12px",
                          color: "#6B7280",
                          lineHeight: 1.4,
                        }}
                      >
                        <li style={{ marginBottom: "4px" }}>
                          <strong>Access Denied:</strong> Contact IT support for
                          access
                        </li>
                        <li style={{ marginBottom: "4px" }}>
                          <strong>Authentication Failed:</strong> Verify
                          credentials or contact IT
                        </li>
                        <li style={{ marginBottom: "4px" }}>
                          <strong>Application Error:</strong> Contact system
                          administrator
                        </li>
                        <li style={{ marginBottom: "4px" }}>
                          <strong>Browser Issues:</strong> Clear cache and
                          cookies, try again
                        </li>
                      </Box>
                    </Box>

                    {/* Contact Support Section */}
                    <Box
                      sx={{
                        p: 1.5,
                        backgroundColor: "#F8FAFC",
                        borderRadius: 1.5,
                        border: "1px solid #E2E8F0",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "#374151",
                          mb: 1,
                          fontFamily: "Open Sans",
                        }}
                      >
                        Need Additional Support?
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "12px",
                          color: "#6B7280",
                          mb: 1,
                          fontFamily: "Open Sans",
                        }}
                      >
                        Contact the ECAP development team for assistance:
                      </Typography>
                      <Box>
                        <Box
                          sx={{
                            p: 1.5,
                            backgroundColor: "#FFFFFF",
                            borderRadius: 1,
                            border: "1px solid #E5E7EB",
                            mb: showCopiedNotification ? 0.5 : 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "12px",
                              color: "#1A3673",
                              fontFamily: "Open Sans",
                              fontWeight: 600,
                            }}
                          >
                            📧 DL-ECAPAI-Dev-Internal-Team@carelon.com
                          </Typography>
                          <IconButton
                            onClick={() =>
                              copyToClipboard(
                                "DL-ECAPAI-Dev-Internal-Team@carelon.com",
                              )
                            }
                            size="small"
                            sx={{
                              color: "#1A3673",
                              "&:hover": {
                                backgroundColor: "rgba(26, 54, 115, 0.1)",
                              },
                            }}
                          >
                            <Copy size={16} />
                          </IconButton>
                        </Box>

                        {showCopiedNotification && (
                          <Typography
                            sx={{
                              fontSize: "11px",
                              color: "#6B7280",
                              fontFamily: "Open Sans",
                              fontStyle: "italic",
                              textAlign: "center",
                              mb: 1,
                            }}
                          >
                            Copied to clipboard
                          </Typography>
                        )}
                      </Box>
                      <Typography
                        sx={{
                          fontSize: "11px",
                          color: "#6B7280",
                          fontFamily: "Open Sans",
                          fontStyle: "italic",
                        }}
                      >
                        Include your username and error details when contacting
                        support.
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Modal>

            {/* Footer */}
            <Box
              sx={{
                mt: 4,
                pt: 3,
                borderTop: "1px solid rgba(15, 31, 71, 0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#22C55E",
                    boxShadow: "0 0 8px rgba(34, 197, 94, 0.4)",
                  }}
                />
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "#94A3B8",
                    fontFamily: "Open Sans",
                    fontWeight: 500,
                  }}
                >
                  Secure Enterprise Single Sign-On
                </Typography>
              </Box>

              <Button
                onClick={() => setShowHelpSection(true)}
                variant="text"
                sx={{
                  color: "#94A3B8",
                  fontSize: "12px",
                  fontWeight: 500,
                  textTransform: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  p: 0.5,
                  minWidth: "auto",
                  "&:hover": {
                    backgroundColor: "rgba(148, 163, 184, 0.1)",
                    color: "#64748B",
                  },
                }}
              >
                <HelpCircle size={14} />
                Need Help?
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Bottom Text */}
        <Typography
          sx={{
            textAlign: "center",
            mt: 4,
            fontSize: "11px",
            color: "rgba(255, 255, 255, 0.5)",
            fontFamily: "Open Sans",
            fontWeight: 400,
            letterSpacing: "0.3px",
          }}
        >
          © 2026 Elevance Health. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;
