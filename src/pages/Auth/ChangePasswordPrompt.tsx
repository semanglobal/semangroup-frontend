import { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth/useAuth";

type ChangePasswordPromptProps = {
    open: boolean;
    onClose: () => void;
};

export default function ChangePasswordPrompt({
    open,
    onClose,
}: ChangePasswordPromptProps) {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleGoToProfile = () => {
        onClose(); // close modal first
        navigate(`/${user?.role}/profile`); // adjust to your profile route
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="change-password-prompt"
            sx={{
                display: "flex",
                alignItems: "flex-start", // stick to top
                justifyContent: "center",
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                backdropFilter: "blur(3px)",
                padding: "1rem",
            }}
        >
            <Box
                sx={{
                    mt: 2, // small margin from very top
                    width: "100%",
                    maxWidth: 600,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 3,
                    borderRadius: 2,
                    position: "relative",
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
                    id="change-password-prompt"
                    variant="h6"
                    component="h2"
                    gutterBottom
                >
                    Change Your Password
                </Typography>

                <Typography sx={{ mb: 2 }}>
                    For security reasons, please update your password.
                </Typography>

                <Button
                    onClick={handleGoToProfile}
                    fullWidth
                    sx={{
                        backgroundColor: "#5A38FD",
                        color: "white",
                        textTransform: "none",
                        borderRadius: "8px",
                        "&:hover": {
                            backgroundColor: "#4529c2",
                        },
                    }}
                >
                    Go to Profile
                </Button>
            </Box>
        </Modal>
    );
}