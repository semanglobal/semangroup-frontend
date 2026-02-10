import React from 'react';
import DashboardCards from '../components/admin/dashboard/DashboardCards';
import MonthlyRevenueChart from '../components/admin/dashboard/MonthlyRevenueChart';
// import MonthlyRevenueChart from '../components/admin/dashboard/MonthlyRevenueChart';

const AdminDashboard: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="py-8">
                <DashboardCards />

                <MonthlyRevenueChart />
            </div>
        </div>
    );
};

export default AdminDashboard;
