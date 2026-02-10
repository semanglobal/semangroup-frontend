/* eslint-disable @typescript-eslint/no-explicit-any */
import Typography from "@mui/material/Typography";
import { Card, CardContent, Grid, Box } from "@mui/material";

export function SummaryCard({
    title,
    value,
    subtitle,
    icon: Icon,
    color = "primary",
    loading = false
}: {
    title: string;
    value: number;
    subtitle?: string;
    icon: any;
    color?: "primary" | "success" | "warning" | "error";
    loading?: boolean;
}) {
    const colorMap = {
        primary: { bg: "#eff6ff", text: "#1e40af", icon: "#3b82f6" },
        success: { bg: "#f0fdf4", text: "#166534", icon: "#22c55e" },
        warning: { bg: "#fffbeb", text: "#92400e", icon: "#f59e0b" },
        error: { bg: "#fef2f2", text: "#991b1b", icon: "#ef4444" }
    };

    const colors = colorMap[color];

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <Card
            sx={{
                borderRadius: 2,
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                border: '1px solid #e5e7eb',
                height: '100%'
            }}
        >
            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ flex: 1 }}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                fontWeight: 500,
                                fontSize: '0.875rem',
                                mb: 1
                            }}
                        >
                            {title}
                        </Typography>
                        {loading ? (
                            <div style={{ height: '32px', backgroundColor: '#e5e7eb', borderRadius: '4px', animation: 'pulse 2s infinite', width: '75%' }}></div>
                        ) : (
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    color: colors.text,
                                    mb: subtitle ? 0.5 : 0
                                }}
                            >
                                {title === "Total Applications" ? value : formatCurrency(value)}
                            </Typography>
                        )}
                        {subtitle && (
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ fontSize: '0.75rem' }}
                            >
                                {subtitle}
                            </Typography>
                        )}
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            backgroundColor: colors.bg
                        }}
                    >
                        <Icon style={{ color: colors.icon, fontSize: '24px' }} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}