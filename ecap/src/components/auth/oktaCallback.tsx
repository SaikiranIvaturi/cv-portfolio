import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";

export default function OktaCallback() {
  const { handleCallback } = useAuth();
  const navigate = useNavigate();
  const processedCode = useRef<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const processCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      // Only skip if we've already processed this exact code
      if (code && processedCode.current === code) {
        console.log("[OktaCallback] Already processed this code, skipping");
        return;
      }

      if (code) {
        processedCode.current = code;
      }

      console.log(
        "[OktaCallback] Processing callback, URL:",
        window.location.href,
      );
      console.log("[OktaCallback] Full search params:", window.location.search);
      console.log("[OktaCallback] Hash params:", window.location.hash);

      try {
        const state = urlParams.get("state");

        console.log(
          "[OktaCallback] URL params - code:",
          !!code,
          "state:",
          !!state,
        );
        console.log(
          "[OktaCallback] All URL params:",
          Object.fromEntries(urlParams.entries()),
        );

        // Check if this is an error callback
        const error = urlParams.get("error");
        const errorDescription = urlParams.get("error_description");

        if (error) {
          console.error(
            "[OktaCallback] OAuth error received:",
            error,
            errorDescription,
          );
          setIsRedirecting(true);
          sessionStorage.setItem(
            "oktaCallbackError",
            JSON.stringify({
              message: `Authentication failed: ${errorDescription || error}`,
              timestamp: Date.now(),
            }),
          );
          setTimeout(() => {
            navigate("/?error=callback", { replace: true });
          }, 100);
          return;
        }

        if (code && state) {
          console.log("[OktaCallback] Calling handleCallback");
          await handleCallback(code, state);
          console.log("[OktaCallback] Success - redirecting to home");
          setIsRedirecting(true);

          // Simple clean navigation to home
          navigate("/", { replace: true });
        } else {
          // Missing required parameters - redirect immediately
          console.error(
            "[OktaCallback] Missing code or state parameters, redirecting to login with error",
          );
          setIsRedirecting(true);
          sessionStorage.setItem(
            "oktaCallbackError",
            JSON.stringify({
              message:
                "Invalid authentication response - missing required parameters",
              timestamp: Date.now(),
            }),
          );
          // Use setTimeout to ensure state is set before redirect
          setTimeout(() => {
            navigate("/?error=callback", { replace: true });
          }, 100);
        }
      } catch (err) {
        console.error("[OktaCallback] Error during callback:", err);
        setIsRedirecting(true);
        // Store error in sessionStorage and redirect to login with error flag
        sessionStorage.setItem(
          "oktaCallbackError",
          JSON.stringify({
            message:
              err instanceof Error ? err.message : "Authentication failed",
            timestamp: Date.now(),
          }),
        );
        // Use setTimeout to ensure state is set before redirect
        setTimeout(() => {
          navigate("/?error=callback", { replace: true });
        }, 100);
      }
    };

    processCallback();
  }, [handleCallback, navigate]);

  // Add safety timeout
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isRedirecting) {
        console.error("[OktaCallback] Timeout - forcing redirect to login");
        setIsRedirecting(true);
        sessionStorage.setItem(
          "oktaCallbackError",
          JSON.stringify({
            message: "Authentication timeout - please try again",
            timestamp: Date.now(),
          }),
        );
        navigate("/?error=callback", { replace: true });
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, [isRedirecting, navigate]);

  // No popstate listener needed - it causes navigation issues

  if (isRedirecting) {
    return null; // Don't render anything while redirecting
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1A3673 0%, #2861BB 100%)",
      }}
    >
      <CircularProgress size={60} thickness={4} sx={{ color: "#FFFFFF" }} />
    </Box>
  );
}
