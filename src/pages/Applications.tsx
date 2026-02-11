/*eslint-disable @typescript-eslint/no-explicit-any*/
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import ApplicationForm from '../components/admin/application/ApplicationForm'
import ApplicationList from '../components/admin/application/ApplicationList'
import type { ApplicationCreate, ApplicationPagination } from '../types/application';
import { ApplicationService } from '../services/applicationService';
import { toast } from 'react-toastify';

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

    const [deleteLoading, setDeleteLoading] = useState<boolean>(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [propertyToDelete, setPropertyToDelete] = useState<{ id: string; title: string } | null>(null);

    const handleDeleteClick = (application: ApplicationCreate) => {
        setPropertyToDelete({ id: application._id!, title: application.applicationNumber });
        setDeleteModalOpen(true);
    };
    const handleDelete = async () => {
        if (!propertyToDelete) return;
        setDeleteLoading(true)
        try {
            await ApplicationService.deleteApplication(propertyToDelete.id)
            setDeleteModalOpen(false)
            setPropertyToDelete(null)
            fetchData(1)
            toast.success('Deleted successfully')
        } catch (error) {
            console.error(error)
        } finally {
            setDeleteLoading(false)
        }
    }

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
                    onDelete={handleDeleteClick}
                />
            )}

            <DeleteWarningModal
                open={deleteModalOpen}
                propertyTitle={propertyToDelete?.title || ''}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setPropertyToDelete(null);
                }}
                onConfirm={handleDelete}
                loading={deleteLoading}
            />

        </div>
    )
}

export default Applications

interface DeleteWarningModalProps {
    open: boolean;
    propertyTitle: string;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean
}

const DeleteWarningModal: React.FC<DeleteWarningModalProps> = ({
    open,
    propertyTitle,
    onClose,
    onConfirm,
    loading
}) => {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-lg font-semibold text-red-600 mb-3">Delete Application</h3>
                <p className="text-gray-600 mb-6">
                    Are you sure you want to delete "{propertyTitle}"? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                        {loading ? 'Deleting' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};