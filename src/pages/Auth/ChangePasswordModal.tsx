/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";
import { AuthService } from "../../services/authService";
import { useAuth } from "../../context/auth/useAuth";

type ChangePasswordModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ChangePasswordModal({
  isOpen,
  onClose,
}: ChangePasswordModalProps) {
  const { login } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // show/hide toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChangePassword = async () => {
    // validations
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error("All fields are required");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        currentPassword,
        newPassword,
      };
      const res = await AuthService.changePassword(payload);
      toast.success("Password changed successfully");
      if (res?.token) {
        login(res.token)
      }
      // reset
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="Change-password-modal-title"
      sx={{
        backdropFilter: "blur(6px)", // blur background
        backgroundColor: "rgba(0,0,0,0.2)",
        padding: "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: "600px",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 2,
          borderRadius: 2,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "#6b7280",
            "&:hover": { color: "#111827" },
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography
          id="Change-password-modal-title"
          variant="h6"
          component="h2"
          gutterBottom
        >
          <span className="font-semibold">Change Password</span>
        </Typography>

        <div className="mb-3">
          <TextField
            label="Current Password"
            type={showCurrent ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            fullWidth
            variant="outlined"
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowCurrent((prev) => !prev)}
                    edge="end"
                  >
                    {showCurrent ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>

        <div className="mb-3">
          <TextField
            label="New Password"
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            variant="outlined"
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowNew((prev) => !prev)}
                    edge="end"
                  >
                    {showNew ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>

        <div className="mb-3">
          <TextField
            label="Confirm New Password"
            type={showConfirm ? "text" : "password"}
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            fullWidth
            variant="outlined"
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirm((prev) => !prev)}
                    edge="end"
                  >
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>

        <Button
          fullWidth
          onClick={handleChangePassword}
          disabled={loading}
          sx={{
            mt: 2,
            backgroundColor: loading ? "#d1d5db" : "#5A38FD",
            color: "white",
            textTransform: "none",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "#4529c2",
            },
          }}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader size={18} className="animate-spin text-white" /> Processing...
            </span>
          ) : (
            "Change Password"
          )}
        </Button>
      </Box>
    </Modal>
  );
}