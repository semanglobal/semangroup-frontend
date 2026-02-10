// /* eslint-disable @typescript-eslint/no-explicit-any */
import Typography from "@mui/material/Typography";
import { Card, CardContent, Grid, Box } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { SummaryCard } from "./SummaryCard";
import { DashboardService } from "../../../services/dashboardService";
import { useEffect, useState } from "react";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

interface DataType {
    totalApplications: number;
    totalAmountPaid: number;
    totalAmountDue: number;
    totalInfrastructureFees: number;
    paymentBreakdown: {
        paid: number;
        partial: number;
        pending: number;
    }
}

const DashboardCards = () => {
    const [cardData, setCardData] = useState({} as DataType)
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            const res = await DashboardService.getAnalytics()
            setCardData(res)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <Box sx={{ mb: 4 }}>
                <div className="flex justify-between items-center mb-4">
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1f2937' }}>
                        Platform Summary
                    </Typography>
                    {/* <Button
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
                    </Button> */}
                </div>

                <Grid container spacing={3}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                        {/* Total Schools */}
                        <SummaryCard
                            title="Total Applications"
                            value={cardData?.totalApplications}
                            // subtitle={`${summaryData.growth.overall} growth`}
                            icon={SchoolIcon}
                            color="primary"
                            loading={loading}
                        />

                        {/* Total Students */}
                        <SummaryCard
                            title="Total Amount Paid"
                            value={cardData?.totalAmountPaid}
                            // subtitle={`${summaryData.growth.students} growth`}
                            icon={PersonIcon}
                            color="success"
                            loading={loading}
                        />

                        {/* Total Teachers */}
                        <SummaryCard
                            title="Total Outstanding"
                            value={cardData?.totalAmountDue}
                            // subtitle={`${summaryData.growth.teachers} growth`}
                            icon={PersonIcon}
                            color="warning"
                            loading={loading}
                        />

                        {/* Total Admins */}
                        <SummaryCard
                            title="Total Infrastructure Fees"
                            value={cardData?.totalInfrastructureFees}
                            // subtitle={`${summaryData.growth.admins} growth`}
                            icon={AdminPanelSettingsIcon}
                            color="primary"
                            loading={loading}
                        />
                    </div>
                </Grid>
            </Box>
        </div>
    )
}

export default DashboardCards