/*eslint-disable @typescript-eslint/no-explicit-any*/
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import ApplicationForm from '../components/admin/application/ApplicationForm'
import ApplicationList from '../components/admin/application/ApplicationList'
import type { ApplicationCreate, ApplicationPagination } from '../types/application';
import { ApplicationService } from '../services/applicationService';

interface FilterState {
    siteName?: string;
    paymentStatus?: string;
    houseType?: string;
}

const Applications = () => {
    const ITEMS_PER_PAGE = 10;
    const [openUploadModal, setOpenUploadModal] = useState(false);
    const [editData, setEditData] = useState<ApplicationCreate | any>(null);
    const [openViewModal, setOpenViewModal] = useState<boolean>(false);
    const [userId, setUserId] = useState<string>('');
    const [statusModal, setStatusModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({} as ApplicationPagination)
    const [applications, setApplications] = useState<ApplicationCreate[]>([])
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSiteName, setSelectedSiteName] = useState<string>('')
    const [filters, setFilters] = useState<FilterState>({});

    useEffect(() => {
        fetchData(currentPage);
        setHasFetched(true);
    }, [currentPage]);

    useEffect(() => {
        setCurrentPage(1);
        fetchData(1);
    }, [searchTerm, filters]);


    const fetchData = async (page: number) => {
        setLoading(true);

        try {
            const params = buildQueryParams(page);

            const { pagination, data } =
                await ApplicationService.getAllApplications(params);

            setPagination(pagination);
            setApplications(data);
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const buildQueryParams = (page: number) => {
        return {
            page,
            limit: ITEMS_PER_PAGE,
            search: searchTerm || undefined,
            paymentStatus: filters.paymentStatus || undefined,
            siteName: filters.siteName || undefined,
        };
    };


    const handleFilter = (newFilters: FilterState) => {
        setFilters(newFilters);
    };

    return (
        <div>
            {openUploadModal ? (
                <ApplicationForm
                    editData={editData}
                    onClose={() => setOpenUploadModal(false)}
                    setEditData={() => { }}
                    refetch={() => fetchData(currentPage)}
                />
            ) : (
                <ApplicationList
                    data={applications}
                    currentPage={currentPage}
                    totalPages={pagination.totalPages}
                    totalCount={pagination.total}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={setCurrentPage}
                    setSearchTerm={setSearchTerm}
                    onFilter={handleFilter}
                    loading={loading}
                    onOpenUploadModal={() => setOpenUploadModal(true)}
                    setEditData={setEditData}
                />
            )}

        </div>
    )
}

export default Applications