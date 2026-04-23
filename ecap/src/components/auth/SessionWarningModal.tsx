import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { AlertTriangle } from "lucide-react";

interface SessionWarningModalProps {
  open: boolean;
  onStayLoggedIn: () => void;
  onLogout: () => void;
  timeRemainingMs: number;
}

export default function SessionWarningModal({
  open,
  onStayLoggedIn,
  onLogout,
  timeRemainingMs,
}: SessionWarningModalProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(
    Math.floor(timeRemainingMs / 1000),
  );

  // Reset countdown when modal opens
  useEffect(() => {
    if (open) {
      setSecondsRemaining(Math.floor(timeRemainingMs / 1000));
    }
  }, [open, timeRemainingMs]);

  // Countdown timer - ticks every second
  useEffect(() => {
    if (!open || secondsRemaining <= 0) return;

    const intervalId = setInterval(() => {
      setSecondsRemaining((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          console.log(
            "[SessionWarningModal] Countdown reached 0 - auto logout",
          );
          onLogout();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [open, secondsRemaining, onLogout]);

  // Format seconds as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
      onClose={() => {}}
      PaperProps={{
        sx: {
          borderRadius: "12px",
          padding: 2,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <AlertTriangle size={24} color="#D97706" />
          <Typography
            sx={{ fontSize: "20px", fontWeight: 600, color: "#1A3673" }}
          >
            Session Timeout Warning
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography
          sx={{ fontSize: "15px", color: "#4B5563", lineHeight: 1.6 }}
        >
          Your session will expire in{" "}
          <strong>{formatTime(secondsRemaining)}</strong> due to inactivity. You
          will be automatically logged out unless you choose to stay logged in.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, pt: 1, gap: 1 }}>
        <Button
          onClick={onLogout}
          variant="outlined"
          sx={{
            textTransform: "none",
            borderColor: "#D1D5DB",
            color: "#6B7280",
            "&:hover": {
              borderColor: "#9CA3AF",
              backgroundColor: "#F9FAFB",
            },
          }}
        >
          Log Out Now
        </Button>
        <Button
          onClick={onStayLoggedIn}
          variant="contained"
          sx={{
            textTransform: "none",
            backgroundColor: "#1A3673",
            "&:hover": {
              backgroundColor: "#2861BB",
            },
          }}
        >
          Stay Logged In
        </Button>
      </DialogActions>
    </Dialog>
  );
}
