/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Download, FileText, Printer, Plus, Edit, Trash2, Eye, MoreVertical, Check, Loader, FileCheck, Home, Phone, Mail, CreditCard, Calendar, X, RefreshCw } from 'lucide-react';
import * as XLSX from 'xlsx';
import { createPortal } from 'react-dom';
import jsPDF from 'jspdf';
import html2canvas from "html2canvas";
import Select from 'react-select';
import { toast } from 'react-toastify';
import { PaymentService } from '../../../services/paymentService';

interface Payment {
    _id: string;
    name: string;
    email: string;
    amount: number;
    reference: string;
    paystackUrl: string;
    status: 'paid' | 'pending' | 'failed' | 'refunded';
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface FilterState {
    status?: string;
    dateFrom?: string;
    dateTo?: string;
}

interface RowActionMenuProps {
    anchorRect: DOMRect;
    payment: Payment;
    onClose: () => void;
    onViewDetails?: (payment: Payment) => void;
    onRefund?: (payment: Payment) => void;
}

const RowActionMenu: React.FC<RowActionMenuProps> = ({
    anchorRect, payment, onClose, onViewDetails, onRefund
}) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    const style: React.CSSProperties = {
        position: "absolute",
        top: anchorRect.bottom + window.scrollY + 4,
        left: anchorRect.right - 140 + window.scrollX,
        width: "140px",
        zIndex: 1000,
    };

    return createPortal(
        <div
            ref={menuRef}
            style={style}
            className="bg-white shadow-lg rounded-md border"
        >
            <button
                className="w-full flex items-center px-3 py-2 text-sm hover:bg-primary hover:text-white rounded-t-md"
                onClick={() => { onViewDetails?.(payment); onClose(); }}
            >
                <Eye className="w-4 h-4 mr-2" /> View Details
            </button>
            {/* {payment.status === 'paid' && (
                <button
                    className="w-full flex items-center px-3 py-2 text-sm hover:bg-yellow-600 hover:text-white rounded-b-md text-yellow-600"
                    onClick={() => { onRefund?.(payment); onClose(); }}
                >
                    <RefreshCw className="w-4 h-4 mr-2" /> Refund
                </button>
            )} */}
        </div>,
        document.body
    );
};

const PaymentList: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState<FilterState>({});
    const [menuAnchor, setMenuAnchor] = useState<{ rect: DOMRect; payment: Payment } | null>(null);
    const tableRef = useRef<HTMLTableElement>(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const itemsPerPage = 10;

    // View Modal
    const [openView, setOpenView] = useState<boolean>(false);
    const [viewData, setViewData] = useState<Payment | null>(null);

    // Fetch payments
    const fetchPayments = async () => {
        setLoading(true);
        try {
            const response = await PaymentService.getPayments();
            if (response?.data) {
                setPayments(response.data);
                setFilteredPayments(response.data);
                setTotalCount(response.data.length);
                setTotalPages(Math.ceil(response.data.length / itemsPerPage));
            }
        } catch (error) {
            console.error('Error fetching payments:', error);
            toast.error('Failed to fetch payments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    // Filter and search
    useEffect(() => {
        let filtered = [...payments];

        // Apply search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(payment =>
                payment.name.toLowerCase().includes(query) ||
                payment.email.toLowerCase().includes(query) ||
                payment.reference.toLowerCase().includes(query)
            );
        }

        // Apply status filter
        if (filters.status) {
            filtered = filtered.filter(payment => payment.status === filters.status);
        }

        // Apply date range filter
        if (filters.dateFrom) {
            const fromDate = new Date(filters.dateFrom).setHours(0, 0, 0, 0);
            filtered = filtered.filter(payment =>
                new Date(payment.createdAt).getTime() >= fromDate
            );
        }

        if (filters.dateTo) {
            const toDate = new Date(filters.dateTo).setHours(23, 59, 59, 999);
            filtered = filtered.filter(payment =>
                new Date(payment.createdAt).getTime() <= toDate
            );
        }

        setFilteredPayments(filtered);
        setTotalCount(filtered.length);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        setCurrentPage(1);
    }, [searchQuery, filters, payments]);

    // Get current page data
    const currentPayments = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredPayments.slice(startIndex, endIndex);
    }, [filteredPayments, currentPage, itemsPerPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleFilterChange = (key: keyof FilterState, value: string | undefined) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleApplyFilters = () => {
        // Filters are already applied via useEffect
        toast.success('Filters applied');
    };

    const handleClearFilters = () => {
        setFilters({});
        setSearchQuery('');
    };

    // const handleRefund = async (payment: Payment) => {
    //     if (window.confirm(`Are you sure you want to refund payment ${payment.reference}?`)) {
    //         try {
    //             // await PaymentService.refundPayment(payment._id);
    //             toast.success('Refund processed successfully');
    //             fetchPayments(); // Refresh list
    //         } catch (error) {
    //             console.error('Error processing refund:', error);
    //             toast.error('Failed to process refund');
    //         }
    //     }
    // };

    const onViewDetails = (payment: Payment) => {
        setViewData(payment);
        setOpenView(true);
    };

    // Export functions
    const handleExportCSV = () => {
        const headers = ["S/N", "Reference", "Customer Name", "Email", "Amount", "Status", "Date", "Paystack URL"];
        const rows = currentPayments.map((payment, index) => [
            (index + 1).toString(),
            payment.reference,
            payment.name,
            payment.email,
            formatCurrency(payment.amount),
            payment.status,
            formatDate(payment.createdAt),
            payment.paystackUrl
        ]);

        const csvContent = [headers, ...rows]
            .map((row) => row.map((field) => `"${field}"`).join(","))
            .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `payments_${formatDateForFilename(new Date())}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const handleExportExcel = () => {
        const headers = ["S/N", "Reference", "Customer Name", "Email", "Amount", "Status", "Date", "Paystack URL"];
        const rows = currentPayments.map((payment, index) => [
            index + 1,
            payment.reference,
            payment.name,
            payment.email,
            payment.amount,
            payment.status,
            formatDate(payment.createdAt),
            payment.paystackUrl
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");
        XLSX.writeFile(workbook, `payments_${formatDateForFilename(new Date())}.xlsx`);
    };

    // Helper functions
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount); // Assuming amount is in kobo
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDateForFilename = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    const getStatusBadge = (status: string) => {
        const statusConfig: { [key: string]: { color: string; text: string } } = {
            'paid': { color: 'bg-green-100 text-green-800', text: 'Paid' },
            'pending': { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
            'failed': { color: 'bg-red-100 text-red-800', text: 'Failed' },
            'refunded': { color: 'bg-indigo-100 text-indigo-800', text: 'Refunded' }
        };

        const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', text: status };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                {config.text}
            </span>
        );
    };

    // Options for select inputs
    const statusOptions = [
        { value: 'paid', label: 'Paid' },
        { value: 'pending', label: 'Pending' },
        { value: 'failed', label: 'Failed' },
        { value: 'refunded', label: 'Refunded' }
    ];

    const customStyles = {
        control: (provided: any) => ({
            ...provided,
            borderRadius: '8px',
            borderColor: '#d1d5db',
            padding: '0rem',
            boxShadow: 'none',
            '&:hover': {
                borderColor: '#5A38FD'
            }
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#5A38FD' : state.isFocused ? '#eff6ff' : 'white',
            color: state.isSelected ? 'white' : '#1f2937',
        })
    };

    return (
        <div className='w-full'>
            {/* Header */}
            <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Payment Transactions</h2>
                    <p className="text-sm text-gray-500">View and manage all payment transactions.</p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={handleExportExcel}
                        className="flex items-center gap-1 px-3 py-2 text-xs border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        <Download className="h-3 w-3" />
                        Export Excel
                    </button>

                    <button
                        onClick={fetchPayments}
                        className="flex items-center gap-1 px-3 py-2 text-xs border border-gray-300 rounded-md hover:bg-gray-50"
                        disabled={loading}
                    >
                        <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 space-y-2">
                <div className='w-full flex gap-2 md:items-center justify-between'>
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by customer name, email, or reference..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-1.5 border text-gray-900 bg-white border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-full"
                        />
                    </div>
                </div>

                <div className="w-full flex flex-col md:flex-row gap-2">
                    <Select
                        options={statusOptions}
                        placeholder="Payment Status"
                        value={statusOptions.find(opt => opt.value === filters.status)}
                        onChange={(selected) => handleFilterChange('status', selected?.value)}
                        isClearable
                        styles={customStyles}
                        className='w-full md:w-48'
                    />

                    <input
                        type="date"
                        placeholder="From Date"
                        value={filters.dateFrom || ''}
                        onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                        className="px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-full md:w-40"
                    />

                    <input
                        type="date"
                        placeholder="To Date"
                        value={filters.dateTo || ''}
                        onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                        className="px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-full md:w-40"
                    />

                    <div className="flex gap-2">
                        <button
                            onClick={handleApplyFilters}
                            className={`px-4 py-2 bg-primary text-white rounded-md hover:bg-hover ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className='flex items-center gap-2'>
                                    <Loader size={18} className="animate-spin h-4 w-4 text-white" />
                                    <span>Loading...</span>
                                </span>
                            ) : 'Apply Filters'}
                        </button>

                        <button
                            onClick={handleClearFilters}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500">Total Transactions</p>
                    <p className="text-2xl font-semibold text-gray-900">{totalCount}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-semibold text-green-600">
                        {formatCurrency(filteredPayments.reduce((sum, p) =>
                            p.status === 'paid' ? sum + p.amount : sum, 0
                        ))}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500">Successful</p>
                    <p className="text-2xl font-semibold text-green-600">
                        {filteredPayments.filter(p => p.status === 'paid').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-500">Pending/Failed</p>
                    <p className="text-2xl font-semibold text-yellow-600">
                        {filteredPayments.filter(p => ['pending', 'failed'].includes(p.status)).length}
                    </p>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-auto w-full border border-gray-200 rounded-lg">
                <table ref={tableRef} className="w-full border-collapse whitespace-nowrap">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">S/N</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Reference</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Customer</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Email</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Amount</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentPayments.map((payment, index) => (
                            <tr key={payment._id} className="hover:bg-gray-50">
                                <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-900">
                                    {(currentPage - 1) * itemsPerPage + index + 1}
                                </td>
                                <td className="px-4 py-4 text-sm font-medium text-gray-900">
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="w-4 h-4 text-primary" />
                                        {payment.reference}
                                    </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {payment.name}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        {payment.email}
                                    </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {formatCurrency(payment.amount || 0)}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    {getStatusBadge(payment.status)}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        {formatDate(payment.createdAt)}
                                    </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-900">
                                    <div className="flex items-center gap-2 relative">
                                        <button
                                            className="text-gray-600 hover:text-primary flex items-center gap-1"
                                            onClick={(e) => {
                                                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                                setMenuAnchor({ rect, payment });
                                            }}
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {!loading && filteredPayments.length === 0 && (
                    <div className="text-center py-12">
                        <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">No payment transactions found</p>
                        <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-500">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} entries
                    </div>
                    <div className="flex gap-1">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 hover:bg-gray-50"
                        >
                            Previous
                        </button>

                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }

                            return (
                                <button
                                    key={pageNum}
                                    className={`px-3 py-1 border rounded-md text-sm ${currentPage === pageNum ? "bg-primary text-white" : "hover:bg-gray-50"
                                        }`}
                                    onClick={() => handlePageChange(pageNum)}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        {totalPages > 5 && currentPage < totalPages - 2 && (
                            <>
                                <span className="px-2 py-1">...</span>
                                <button
                                    onClick={() => handlePageChange(totalPages)}
                                    className="px-3 py-1 border rounded-md text-sm hover:bg-gray-50"
                                >
                                    {totalPages}
                                </button>
                            </>
                        )}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg">
                    <div className="flex items-center gap-2">
                        <Loader className="w-6 h-6 animate-spin text-primary" />
                        <span className="text-gray-600">Loading payments...</span>
                    </div>
                </div>
            )}

            {/* Floating menu */}
            {menuAnchor && (
                <RowActionMenu
                    anchorRect={menuAnchor.rect}
                    payment={menuAnchor.payment}
                    onClose={() => setMenuAnchor(null)}
                    onViewDetails={onViewDetails}
                // onRefund={handleRefund}
                />
            )}

            {/* Payment Details Modal */}
            {openView && viewData && (
                <PaymentModal
                    payment={viewData}
                    isOpen={openView}
                    onClose={() => setOpenView(false)}
                />
            )}
        </div>
    );
};

// Payment Modal Component
interface PaymentModalProps {
    payment: Payment;
    isOpen: boolean;
    onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ payment, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fadeIn" onClick={onClose} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 pointer-events-auto animate-scaleIn relative max-h-[90vh] overflow-y-auto">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Payment Details
                    </h2>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Reference</p>
                                <p className="font-medium">{payment.reference}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                                    payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                                            'bg-indigo-100 text-indigo-800'
                                    }`}>
                                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Customer Name</p>
                                <p className="font-medium">{payment.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Email Address</p>
                                <p className="font-medium">{payment.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Amount</p>
                                <p className="font-medium text-lg text-primary">
                                    {new Intl.NumberFormat('en-NG', {
                                        style: 'currency',
                                        currency: 'NGN'
                                    }).format(payment.amount / 100)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Date</p>
                                <p className="font-medium">
                                    {new Date(payment.createdAt).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 mb-1">Paystack Payment URL</p>
                            <a
                                href={payment.paystackUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline break-all"
                            >
                                {payment.paystackUrl}
                            </a>
                        </div>

                        <div className="pt-4 border-t">
                            <p className="text-sm text-gray-500">Transaction Timeline</p>
                            <div className="mt-2 space-y-2">
                                <div className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                                    <div>
                                        <p className="text-sm font-medium">Payment Created</p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(payment.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                                    <div>
                                        <p className="text-sm font-medium">Last Updated</p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(payment.updatedAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PaymentList;