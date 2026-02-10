import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import {
    Container,
    Paper,
    Typography,
    CircularProgress,
    Alert,
    Box,
    Grid,
    Card,
    CardContent,
    Divider,
    Chip,
    Button,
    ThemeProvider,
    createTheme
} from '@mui/material';
import {
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
    Home as HomeIcon,
    Person as PersonIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Numbers as NumbersIcon,
    Payment as PaymentIcon,
    CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { ApplicationService } from '../services/applicationService';

// Define the API response type
interface SalesData {
    _id: string;
    siteName: string;
    buyer: string;
    applicationNumber: string;
    plotNumber: string;
    phoneNumber: string;
    emailAddress: string;
    houseType: string;
    amountPaid: number;
    amountDueForPayment: number;
    infrastructureFees: number;
    paymentStatus: 'full' | 'partial';
    allocationLetter: string;
    comment: string;
    settingAndEvacuation: boolean;
    documentUrl: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

const theme = createTheme({
    palette: {
        primary: {
            main: '#2E7D32', // Success green
        },
        secondary: {
            main: '#1976D2',
        },
    },
});

const VerifySales: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [salesData, setSalesData] = useState<SalesData | null>(null);
    const [verified, setVerified] = useState<boolean>(false);

    useEffect(() => {
        const verifyCode = async () => {
            const code = searchParams.get('code');

            if (!code) {
                setError('No verification code provided in the URL');
                setLoading(false);
                return;
            }

            try {
                // Replace with your actual API endpoint
                const response = await ApplicationService.getApplicationById(code)

                if (response && !response.isDeleted) {
                    setSalesData(response);
                    setVerified(true);
                } else {
                    setError('Invalid or deleted sales record');
                }
            } catch (err) {
                console.error('Verification error:', err);
                setError('Failed to verify the sales record. The code may be invalid.');
            } finally {
                setLoading(false);
            }
        };

        verifyCode();
    }, [searchParams]);

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <ThemeProvider theme={theme}>
                <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
                    <CircularProgress size={60} sx={{ color: 'primary.main', mb: 3 }} />
                    <Typography variant="h6" color="text.secondary">
                        Verifying authenticity...
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Please wait while we verify the sales record
                    </Typography>
                </Container>
            </ThemeProvider>
        );
    }

    if (error) {
        return (
            <ThemeProvider theme={theme}>
                <Container maxWidth="sm" sx={{ mt: 8 }}>
                    <Alert
                        severity="error"
                        icon={<ErrorIcon fontSize="large" />}
                        sx={{ py: 2, fontSize: '1.1rem' }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Verification Failed
                        </Typography>
                        <Typography variant="body1">
                            {error}
                        </Typography>
                    </Alert>
                </Container>
            </ThemeProvider>
        );
    }

    if (!verified || !salesData) {
        return null;
    }

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="md" sx={{ py: 6 }}>
                {/* Success Verification Banner */}
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        mb: 4,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                        color: 'white',
                        textAlign: 'center',
                    }}
                >
                    <CheckCircleIcon sx={{ fontSize: 80, mb: 2 }} />
                    <Typography variant="h4" gutterBottom fontWeight="bold">
                        ✓ VERIFIED PROPERTY PURCHASE
                    </Typography>
                    <Typography variant="h6">
                        This property purchase has been verified as authentic
                    </Typography>
                    <Chip
                        label="VERIFIED"
                        sx={{
                            mt: 2,
                            bgcolor: 'white',
                            color: '#2E7D32',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            px: 2,
                            py: 1,
                        }}
                    />
                </Paper>

                {/* Property Details */}
                <Paper elevation={2} sx={{ p: 4, borderRadius: 3, mb: 4 }}>
                    <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
                        <HomeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Property Information
                    </Typography>

                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <div>
                            <Card variant="outlined" sx={{ height: '100%' }}>
                                <CardContent>
                                    <Typography variant="h6" color="primary" gutterBottom>
                                        Property Details
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <NumbersIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                        <Typography variant="body1">
                                            <strong>Plot:</strong> {salesData.plotNumber}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <HomeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                        <Typography variant="body1">
                                            <strong>House Type:</strong> {salesData.houseType}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <HomeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                        <Typography variant="body1">
                                            <strong>Estate:</strong> {salesData.siteName}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                        <Typography variant="body1">
                                            <strong>Allocation Date:</strong> {formatDate(salesData.allocationLetter)}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </div>

                        <div>
                            <Card variant="outlined" sx={{ height: '100%' }}>
                                <CardContent>
                                    <Typography variant="h6" color="primary" gutterBottom>
                                        Buyer Information
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                        <Typography variant="body1">
                                            <strong>Buyer:</strong> {salesData.buyer}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                        <Typography variant="body1">
                                            <strong>Phone:</strong> {salesData.phoneNumber}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                        <Typography variant="body1">
                                            <strong>Email:</strong> {salesData.emailAddress}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <NumbersIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                        <Typography variant="body1">
                                            <strong>Application #:</strong> {salesData.applicationNumber}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </div>
                    </Grid>
                </Paper>

                {/* Payment Information */}
                <Paper elevation={2} sx={{ p: 4, borderRadius: 3, mb: 4 }}>
                    <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
                        <PaymentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Payment Details
                    </Typography>

                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <div>
                            <Card
                                variant="outlined"
                                sx={{
                                    height: '100%',
                                    borderLeft: 4,
                                    borderLeftColor: 'primary.main',
                                    bgcolor: '#f8f9fa'
                                }}
                            >
                                <CardContent>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Amount Paid
                                    </Typography>
                                    <Typography variant="h4" color="primary" fontWeight="bold">
                                        {formatCurrency(salesData.amountPaid)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </div>

                        <div>
                            <Card
                                variant="outlined"
                                sx={{
                                    height: '100%',
                                    borderLeft: 4,
                                    borderLeftColor: salesData.amountDueForPayment === 0 ? 'success.main' : 'warning.main',
                                    bgcolor: '#f8f9fa'
                                }}
                            >
                                <CardContent>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Balance Due
                                    </Typography>
                                    <Typography
                                        variant="h4"
                                        color={salesData.amountDueForPayment === 0 ? 'success.main' : 'warning.main'}
                                        fontWeight="bold"
                                    >
                                        {formatCurrency(salesData.amountDueForPayment)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </div>

                        <div >
                            <Card
                                variant="outlined"
                                sx={{
                                    height: '100%',
                                    borderLeft: 4,
                                    borderLeftColor: 'secondary.main',
                                    bgcolor: '#f8f9fa'
                                }}
                            >
                                <CardContent>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Infrastructure Fees
                                    </Typography>
                                    <Typography variant="h4" color="secondary" fontWeight="bold">
                                        {formatCurrency(salesData.infrastructureFees)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </div>
                    </Grid>

                    {/* <Divider sx={{ my: 3 }} /> */}

                    {/* <Grid container spacing={2} alignItems="center">
                        <div>
                            <Typography variant="body1">
                                <strong>Payment Status:</strong>
                            </Typography>
                        </div>
                        <div>
                            <Chip
                                label={salesData.paymentStatus.toUpperCase()}
                                color={salesData.paymentStatus === 'full' ? 'success' : 'warning'}
                                sx={{ fontWeight: 'bold', fontSize: '1rem' }}
                            />
                        </div>
                    </Grid> */}

                    {/* {salesData.comment && (
                        <>
                            <Divider sx={{ my: 3 }} />
                            <Typography variant="body1">
                                <strong>Note:</strong> {salesData.comment}
                            </Typography>
                        </>
                    )} */}
                </Paper>

                {/* Action Buttons */}
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        sx={{ mr: 2 }}
                        onClick={() => window.print()}
                    >
                        Print Verification
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        size="large"
                        onClick={() => window.location.href = 'https://semanglobalgroup.com'}
                    >
                        Visit Website
                    </Button>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default VerifySales;