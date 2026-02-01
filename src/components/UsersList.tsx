/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Card, CardContent, Grid, Box } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleIcon from "@mui/icons-material/People";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import WarningIcon from "@mui/icons-material/Warning";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import GroupsIcon from "@mui/icons-material/Groups";
import type { ChangeStatusType, SchoolData, SummaryData } from "../types/schoolDataType";
import { SchoolService } from "../services/SchoolService";
import { toast } from "react-toastify";

type UsersListProps = {
    summaryData: SummaryData;
    schoolsData: SchoolData[];
    loading: boolean;
    onSuspendSchool: (data: ChangeStatusType) => void;
    onActivateSchool: (data: ChangeStatusType) => void;
    refetch: () => void;
};

// Summary Card Component
function SummaryCard({
    title,
    value,
    subtitle,
    icon: Icon,
    color = "primary",
    loading = false
}: {
    title: string;
    value: string;
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
                                {value}
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

export default function UsersList({
    summaryData,
    schoolsData,
    loading,
    onSuspendSchool,
    onActivateSchool,
    refetch,
}: UsersListProps) {
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const handleSuspendSchool = async (schoolId: string, domain: string) => {
        setActionLoading(schoolId);
        try {
            await onSuspendSchool({ schoolId, status: "suspended", domain });
        } finally {
            setActionLoading(null);
        }
    };

    const handleActivateSchool = async (schoolId: string, domain: string) => {
        setActionLoading(schoolId);
        try {
            await onActivateSchool({ schoolId, status: "active", domain });
        } finally {
            setActionLoading(null);
        }
    };

    const handleUpdateAllSchools = async () => {
        setActionLoading('update-all-schools');
        try {
            const res = await SchoolService.updateAllSchoolData(schoolsData.map((school) => school.domain));
            toast.success(res.message ||'School data updated successfully');
            refetch();
        } catch (err) {
            console.log(err);
        } finally {
            setActionLoading(null);
        }
    }

    return (
        <div style={{ padding: "" }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Users Overview
            </Typography>

            {/* Summary Cards */}
            <Box sx={{ mb: 4 }}>
                <div className="flex justify-between items-center mb-4">
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1f2937' }}>
                        Platform Summary
                    </Typography>
                    <Button
                        variant="outlined"
                        color="success"
                        size="small"
                        onClick={handleUpdateAllSchools}
                        disabled={actionLoading === "update-all-schools"}
                        sx={{
                            textTransform: 'none',
                            borderRadius: '6px',
                            fontWeight: 600,
                            padding: '6px 12px',
                        }}
                    >
                        {actionLoading === "update-all-schools" ? 'Processing...' : 'Update All Schools'}
                    </Button>
                </div>

                <Grid container spacing={3}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                        {/* Total Schools */}
                        <SummaryCard
                            title="Total Schools"
                            value={summaryData.totalSchools.toString()}
                            subtitle={`${summaryData.growth.overall} growth`}
                            icon={SchoolIcon}
                            color="primary"
                            loading={loading}
                        />

                        {/* Total Students */}
                        <SummaryCard
                            title="Total Students"
                            value={summaryData.totalStudents.toString()}
                            subtitle={`${summaryData.growth.students} growth`}
                            icon={PeopleIcon}
                            color="success"
                            loading={loading}
                        />

                        {/* Total Teachers */}
                        <SummaryCard
                            title="Total Teachers"
                            value={summaryData.totalTeachers.toString()}
                            subtitle={`${summaryData.growth.teachers} growth`}
                            icon={PersonIcon}
                            color="warning"
                            loading={loading}
                        />

                        {/* Total Admins */}
                        <SummaryCard
                            title="Total Admins"
                            value={summaryData.totalAdmins.toString()}
                            subtitle={`${summaryData.growth.admins} growth`}
                            icon={AdminPanelSettingsIcon}
                            color="primary"
                            loading={loading}
                        />
                    </div>
                </Grid>
            </Box>

            {/* Schools Table */}
            <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Schools Management
            </Typography>

            <TableContainer component={Paper} sx={{ mt: 2, boxShadow: 'none', border: '1px solid #e5e7eb' }}>
                <Table sx={{ minWidth: 650 }} aria-label="schools table">
                    <TableHead sx={{ backgroundColor: '#f9fafb' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', color: '#374151', fontSize: '12px' }}>School Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#374151', fontSize: '12px' }}>Contact Email</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#374151', fontSize: '12px' }}>Location</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#374151', fontSize: '12px' }}>Students</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#374151', fontSize: '12px' }}>Teachers</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#374151', fontSize: '12px' }}>Admins</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#374151', fontSize: '12px' }}>Total Users</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#374151', fontSize: '12px' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#374151', fontSize: '12px' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {schoolsData?.map((school) => (
                            <TableRow
                                key={school.schoolId}
                                sx={{
                                    '&:last-child td, &:last-child th': { border: 0 },
                                    '&:hover': { backgroundColor: '#fafafa' }
                                }}
                            >
                                <TableCell component="th" scope="row" sx={{ fontWeight: 500, fontSize: '12px' }} className="whitespace-nowrap">
                                    {school.schoolName}
                                </TableCell>
                                <TableCell sx={{ fontSize: '12px' }}>{school.schoolContact.email}</TableCell>
                                <TableCell className="whitespace-nowrap" sx={{ fontSize: '12px' }}>
                                    {school.schoolContact.address.city}, {school.schoolContact.address.state}
                                </TableCell>
                                <TableCell sx={{ fontSize: '12px' }}>{school.totalStudents}</TableCell>
                                <TableCell sx={{ fontSize: '12px' }}>{school.totalTeachers}</TableCell>
                                <TableCell sx={{ fontSize: '12px' }}>{school.totalAdmins}</TableCell>
                                <TableCell sx={{ fontSize: '12px' }}>{school.totalUsers}</TableCell>
                                <TableCell>
                                    <span
                                        style={{
                                            padding: '4px 8px',
                                            borderRadius: '12px',
                                            fontSize: '10px',
                                            fontWeight: 500,
                                            backgroundColor: school.schoolAccountStatus === 'active' ? '#dcfce7' : '#fef2f2',
                                            color: school.schoolAccountStatus === 'active' ? '#166534' : '#991b1b'
                                        }}
                                    >
                                        {school.schoolAccountStatus.charAt(0).toUpperCase() + school.schoolAccountStatus.slice(1)}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    {school.schoolAccountStatus === 'active' ? (
                                        <Button
                                            variant="outlined"
                                            color="warning"
                                            size="small"
                                            onClick={() => handleSuspendSchool(school.schoolId, school.domain)}
                                            disabled={actionLoading === school.schoolId}
                                            sx={{
                                                textTransform: 'none',
                                                borderRadius: '6px'
                                            }}
                                        >
                                            {actionLoading === school.schoolId ? 'Processing...' : 'Suspend'}
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outlined"
                                            color="success"
                                            size="small"
                                            onClick={() => handleActivateSchool(school.schoolId, school.domain)}
                                            disabled={actionLoading === school.schoolId}
                                            sx={{
                                                textTransform: 'none',
                                                borderRadius: '6px'
                                            }}
                                        >
                                            {actionLoading === school.schoolId ? 'Processing...' : 'Activate'}
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {schoolsData.length === 0 && !loading && (
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                        textAlign: 'center',
                        py: 4,
                        fontStyle: 'italic'
                    }}
                >
                    No schools found.
                </Typography>
            )}
        </div>
    );
}