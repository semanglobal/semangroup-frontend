import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import {
    Select,
    MenuItem
} from '@mui/material';
import { DashboardService } from "../../../services/dashboardService";
import { useEffect, useState } from "react";

interface MonthlyData {
    month: number;
    totalPaid: number;
}

interface MonthlyRevenueChartProps {
    data: MonthlyData[];
    year: number;
}

const monthLabels = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const MonthlyRevenueChart = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [revenueData, setRevenueData] = useState<MonthlyData[] | null>(null);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const chartData = revenueData?.map((item) => ({
        month: monthLabels[item.month - 1],
        totalPaid: item.totalPaid,
    }));

    // Generate year options (current year and 5 years back)
    const yearOptions = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i);

    const formatCurrency = (value?: number) => {
        const safeValue = typeof value === "number" ? value : 0;
        return `₦${safeValue.toLocaleString()}`;
    };

    useEffect(() => {
        fetchRevenueData(selectedYear);
    }, [selectedYear]);

    const fetchRevenueData = async (year: number) => {
        setLoading(true);
        setError(null);

        try {
            const response = await DashboardService.getMonthlyRevenue(year);

            if (response.success) {
                setRevenueData(response.data);
            } else {
                setError('Failed to fetch revenue data');
            }
        } catch (err) {
            console.error('Error fetching revenue data:', err);
            setError('Failed to load revenue data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-100 bg-white rounded-2xl p-6 shadow">
            <div className="flex justify-between">
                <h2 className="text-lg font-semibold mb-4">
                    Monthly Revenue ({selectedYear})
                </h2>

                <Select
                    value={selectedYear}
                    label="Year"
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="w-40"
                >
                    {yearOptions.map((year) => (
                        <MenuItem key={year} value={year}>
                            {year}
                        </MenuItem>
                    ))}
                </Select>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={formatCurrency} />
                    <Tooltip formatter={(value) => formatCurrency(value as number | undefined)} />
                    <Line
                        type="monotone"
                        dataKey="totalPaid"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MonthlyRevenueChart;
