/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';

import { useAuth } from '../context/auth/useAuth';
import UsersList from '../components/UsersList';
import { SchoolService } from '../services/SchoolService';
import type { ChangeStatusType, SchoolData, SummaryData } from '../types/schoolDataType';
import { fetchSchoolDataFailure, fetchSchoolDataStart, fetchSchoolDataSuccess } from '../store/schoolDataSlice';
import { fetchSchoolSummaryFailure, fetchSchoolSummaryStart, fetchSchoolSummarySuccess } from '../store/schoolSummarySlice';
import { toast } from 'react-toastify';
// import ResultTemplate from '../components/dashboard/admin/ResultSheet';
// import ResultSheet from '../components/dashboard/admin/ResultSheet';

const AdminDashboard: React.FC = () => {
    const { user } = useAuth();
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState<boolean>(false);
    const schoolData = useSelector((state: RootState) => state.getSchoolData).recordData;
    const summaryData = useSelector((state: RootState) => state.getSchoolSummary).recordData;
    const [hasFetched, setHasFetched] = useState(false);
    // console.log(classrooms);

    useEffect(() => {
        const noSchoolData = schoolData.length === 0;
        const nosummaryData = Object.keys(summaryData).length === 0;
        if ((noSchoolData || nosummaryData) && !hasFetched) {
            fetchAllData();
            setHasFetched(true);
        }
    }, [hasFetched, schoolData.length, Object.keys(summaryData).length]);

    const fetchAllData = async (): Promise<void> => {
        setLoading(true);

        dispatch(fetchSchoolDataStart());
        dispatch(fetchSchoolSummaryStart());

        try {
            const schoolData: SchoolData[] = await SchoolService.getAllSchools();
            const allSchoolStat: SummaryData = await SchoolService.getAllSchoolStat();

            dispatch(fetchSchoolDataSuccess(schoolData));
            dispatch(fetchSchoolSummarySuccess(allSchoolStat));

        } catch (error) {
            console.error('Error fetching content:', error);
            dispatch(fetchSchoolDataFailure(error as Error));
            dispatch(fetchSchoolSummaryFailure(error as Error));
        } finally {
            setLoading(false);
        }
    };

    const changeSchoolStatus = async (data: ChangeStatusType) => {
        try {
            await SchoolService.changeStatus(data);
            toast.success(`School ${data.status === 'active' ? 'activated' : 'suspended'} successfully`);
            fetchAllData();
        } catch (error) {
            toast.error('Error changing school status');
            console.error('Error changing school status:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="py-8">
                {/* <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user?.fullName} 👋</h2>
                    <p className="text-gray-600">Here's what's happening at your school today.</p>
                </div> */}

                <UsersList
                    summaryData={summaryData}
                    schoolsData={schoolData}
                    loading={false}
                    onSuspendSchool={changeSchoolStatus}
                    onActivateSchool={changeSchoolStatus}
                    refetch={fetchAllData}
                />
            </div>
        </div>
    );
};

export default AdminDashboard;
