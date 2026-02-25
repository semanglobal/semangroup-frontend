/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Download, FileText, Printer, Plus, Edit, Trash2, Eye, MoreVertical, Check, Loader, FileCheck, Home, Phone, Mail, CreditCard, Calendar, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import { createPortal } from 'react-dom';
import jsPDF from 'jspdf';
import html2canvas from "html2canvas";
import Select from 'react-select';
import type { ApplicationCreate } from '../../../types/application';
import ApplicationModal from './ApplicationModal';
import { ApplicationService } from '../../../services/applicationService';
import { toast } from 'react-toastify';

interface FilterState {
    siteName?: string;
    paymentStatus?: string;
    houseType?: string;
}

interface ApplicationListProps {
    data?: ApplicationCreate[];
    onOpenUploadModal?: () => void;
    onEdit?: (data: ApplicationCreate) => void;
    setEditData?: (data: ApplicationCreate | null) => void;
    loading?: boolean;
    isLoading?: boolean;
    onChangePaymentStatus?: (id: string) => void;
    onMarkAsPaid?: (id: string) => void;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalCount: number;
    itemsPerPage: number;
    setSearchTerm: (data: string) => void;
    onFilter?: (filters: FilterState) => void;
    onDelete?: (data: ApplicationCreate) => void;
}

interface RowActionMenuProps {
    anchorRect: DOMRect;
    application: ApplicationCreate;
    onClose: () => void;
    onEdit?: (data: ApplicationCreate) => void;
    onDelete?: (data: ApplicationCreate) => void;
    onOpenUploadModal?: () => void;
    onViewDetails?: (data: ApplicationCreate) => void;
    onChangePaymentStatus?: (id: string) => void;
    onMarkAsPaid?: (id: string) => void;
    handleDownload?: (buyer: string, id: string) => void;
    setOpenView: () => void
}

const RowActionMenu: React.FC<RowActionMenuProps> = ({
    anchorRect, application, onClose, onEdit, onDelete, onOpenUploadModal, onViewDetails, onChangePaymentStatus, onMarkAsPaid, handleDownload, setOpenView
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
        left: anchorRect.right - 160 + window.scrollX,
        width: "160px",
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
                onClick={() => { onViewDetails?.(application); onClose(); setOpenView() }}
            >
                <Eye className="w-4 h-4 mr-2" /> View Details
            </button>
            <button
                className="w-full flex items-center px-3 py-2 text-sm hover:bg-primary hover:text-white"
                onClick={() => { onEdit?.(application); onOpenUploadModal?.(); onClose(); }}
            >
                <Edit className="w-4 h-4 mr-2" /> Edit
            </button>
            <button
                className="w-full flex items-center px-3 py-2 text-sm hover:bg-primary hover:text-white"
                onClick={() => { handleDownload?.(application.buyer!, application._id!); onClose(); }}
            >
                <Download className="w-4 h-4 mr-2" /> QR Code
            </button>
            <button
                className="w-full flex items-center px-3 py-2 text-sm hover:bg-red-600 hover:text-white rounded-b-md text-red-600"
                onClick={() => { onDelete?.(application); onClose(); }}
            >
                <Trash2 className="w-4 h-4 mr-2" /> Delete
            </button>
        </div>,
        document.body
    );
};

const ApplicationList: React.FC<ApplicationListProps> = ({
    data = [], onOpenUploadModal, onEdit, setEditData, loading, isLoading, onChangePaymentStatus, onMarkAsPaid, currentPage, totalPages, onPageChange, totalCount, itemsPerPage, setSearchTerm, onFilter, onDelete
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [menuAnchor, setMenuAnchor] = useState<{ rect: DOMRect; application: ApplicationCreate } | null>(null);
    const tableRef = useRef<HTMLTableElement>(null);
    const [filters, setFilters] = useState<FilterState>({});
    const [openView, setOpenView] = useState<boolean>(false)
    const [viewData, setViewData] = useState<ApplicationCreate>({} as ApplicationCreate)

    // QR Code
    const [downloadModal, setOpenDownloadModal] = useState<boolean>(false)
    const [qrValue, setQrValue] = useState('');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [buyer, setBuyer] = useState<string>('')
    const [siteNameOptions, setSiteNameOptions] = useState<{ value: string; label: string }[]>([])

    const openDownloadModal = (buyer: string, id: string) => {
        setOpenDownloadModal(true);
        setBuyer(buyer);
        handleGenerate(id)
    }

    const handleGenerate = (id: string) => {
        const data = `https://semanglobalgroup.com/verify?code=${id}`

        setQrValue(data);
    };

    const onViewDetails = (data: ApplicationCreate) => {
        setViewData(data)
    }

    const handleDownload = () => {
        const canvas = canvasRef.current;

        if (canvas) {
            const pngUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = pngUrl;
            link.download = `receipt-qr-${buyer || 'unnamed'}.png`;
            link.click();
        } else {
            console.error('Canvas not ready');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {

            const { data } = await ApplicationService.getAllApplications();
            setSiteNameOptions(data ? Array.from(new Set(data.map(app => app.siteName))).map(type => ({ value: type!, label: type! })) : [])
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    };

    const paymentStatusOptions = [
        { value: 'full', label: 'Full Payment' },
        { value: 'partial', label: 'Partial Payment' },
        { value: 'pending', label: 'Pending Payment' },
        { value: 'overdue', label: 'Overdue Payment' }
    ];

    const houseTypeOptions = [
        { value: '2 Bedroom Bungalow', label: '2 Bedroom Bungalow' },
        { value: '3 Bedroom Bungalow', label: '3 Bedroom Bungalow' },
        { value: '4 Bedroom Duplex', label: '4 Bedroom Duplex' },
        { value: '5 Bedroom Duplex', label: '5 Bedroom Duplex' },
        { value: 'Semi-detached Duplex', label: 'Semi-detached Duplex' },
        { value: 'Terraced Duplex', label: 'Terraced Duplex' }
    ];

    // const siteNameOptions = [
    //     { value: 'Abuja Prime Estate', label: 'Abuja Prime Estate' },
    //     { value: 'Lagos Luxury Homes', label: 'Lagos Luxury Homes' },
    //     { value: 'Port Harcourt Garden City', label: 'Port Harcourt Garden City' },
    //     { value: 'Kano Royal Estates', label: 'Kano Royal Estates' },
    //     { value: 'Ibadan Heritage Homes', label: 'Ibadan Heritage Homes' }
    // ];

    const getPaymentStatusBadge = (status: string) => {
        const statusConfig: { [key: string]: { color: string; text: string } } = {
            'full': { color: 'bg-green-100 text-green-800', text: 'Paid' },
            'paid': { color: 'bg-green-100 text-green-800', text: 'Paid' },
            'partial': { color: 'bg-yellow-100 text-yellow-800', text: 'Partial' },
            'pending': { color: 'bg-blue-100 text-blue-800', text: 'Pending' },
            'overdue': { color: 'bg-red-100 text-red-800', text: 'Overdue' }
        };

        const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', text: status };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                {config.text}
            </span>
        );
    };

    const getSettingEvacuationBadge = (completed: boolean) => {
        return completed ? (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Completed
            </span>
        ) : (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Pending
            </span>
        );
    };

    const handleFilterChange = (key: keyof FilterState, value: string | undefined) => {
        console.log('Filter changed:', key, value);
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleApplyFilters = () => {
        onFilter?.(filters);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const handleExportCSV = () => {
        const headers = ["S/N", "Application #", "Buyer", "Site", "Plot #", "House Type", "Amount Paid", "Amount Due", "Payment Status", "Setting & Evacuation"];
        const rows = data.map((application, index) => [
            (index + 1).toString(),
            application.applicationNumber,
            application.buyer,
            application.siteName,
            application.plotNumber,
            application.houseType,
            formatCurrency(application.amountPaid),
            formatCurrency(application.amountDueForPayment),
            application.paymentStatus,
            application.settingAndEvacuation ? 'Completed' : 'Pending'
        ]);

        const csvContent = [headers, ...rows]
            .map((row) => row.map((field) => `"${field}"`).join(","))
            .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "applications.csv";
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const handleExportExcel = () => {
        const headers = ["S/N", "Application #", "Buyer", "Site", "Plot #", "House Type", "Amount Paid", "Amount Due", "Payment Status", "Setting & Evacuation"];
        const rows = data.map((application, index) => [
            index + 1,
            application.applicationNumber,
            application.buyer,
            application.siteName,
            application.plotNumber,
            application.houseType,
            application.amountPaid,
            application.amountDueForPayment,
            application.paymentStatus,
            application.settingAndEvacuation ? 'Completed' : 'Pending'
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");
        XLSX.writeFile(workbook, "applications.xlsx");
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow && tableRef.current) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Property Applications</title>
                        <style>
                            body { font-family: Arial, sans-serif; margin: 20px; }
                            table { width: 100%; border-collapse: collapse; }
                            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                            th { background-color: #f5f5f5; }
                            .badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 12px; }
                            .badge-paid { background-color: #d1fae5; color: #065f46; }
                            .badge-pending { background-color: #dbeafe; color: #1e40af; }
                            .badge-overdue { background-color: #fee2e2; color: #991b1b; }
                        </style>
                    </head>
                    <body>
                        <h1>Property Applications</h1>
                        ${tableRef.current.outerHTML}
                        <script>
                            window.onload = function() {
                                window.print();
                                setTimeout(function() {
                                    window.close();
                                }, 100);
                            };
                        </script>
                    </body>
                </html>
            `);
            printWindow.document.close();
        }
    };

    const handleExportPDF = async () => {
        if (!tableRef.current) return;

        try {
            const canvas = await html2canvas(tableRef.current);
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const pdfHeight = (canvasHeight * pdfWidth) / canvasWidth;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('applications.pdf');
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className='w-full'>
            {/* Header */}
            <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Property Applications</h2>
                    <p className="text-sm text-gray-500">Manage all property applications and payments.</p>
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
                        className="flex gap-2 items-center justify-center text-xs bg-primary text-white hover:bg-hover py-3 px-4 rounded-lg lg:w-40 shrink-0"
                        onClick={() => {
                            onOpenUploadModal?.();
                            setEditData?.(null);
                        }}
                    >
                        <Plus className="w-4 h-4" />
                        New Application
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
                            placeholder="Search applications by Id, site name, and buyer..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setSearchTerm(e.target.value) }}
                            className="pl-10 pr-4 py-1.5 border text-gray-900 bg-white border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-full"
                        />
                    </div>
                </div>

                <div className="w-full flex flex-col md:flex-row gap-2">
                    <Select
                        options={siteNameOptions}
                        placeholder="Site Name"
                        value={siteNameOptions.find(opt => opt.value === filters.siteName)}
                        onChange={(selected) => handleFilterChange('siteName', selected?.value)}
                        isClearable
                        styles={customStyles}
                        className='w-full'
                    />
                    <Select
                        options={paymentStatusOptions}
                        placeholder="Payment Status"
                        value={paymentStatusOptions.find(opt => opt.value === filters.paymentStatus)}
                        onChange={(selected) => handleFilterChange('paymentStatus', selected?.value)}
                        isClearable
                        styles={customStyles}
                        className='w-full'
                    />
                    <button
                        onClick={handleApplyFilters}
                        className={`lg:w-40 shrink-0 px-4 py-2 bg-primary text-white rounded-md hover:bg-hover ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className='flex items-center gap-2'>
                                <Loader size={18} className="animate-spin h-4 w-4 text-white" />
                                <span>Searching...</span>
                            </span>
                        ) : 'Apply Filters'}
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-auto w-full">
                <table ref={tableRef} className="w-full border-collapse whitespace-nowrap">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">S/N</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Application #</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Buyer</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Site</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Plot #</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">House Type</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Amount Paid</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Amount Due</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Payment Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">S&E Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Allocation Date</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data?.map((application, index) => (
                            <tr key={application._id} className="hover:bg-gray-50">
                                <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-900">{index + 1}</td>
                                <td className="px-4 py-4 text-sm font-medium text-gray-900">
                                    <div className="flex items-center gap-2">
                                        <FileCheck className="w-4 h-4 text-primary" />
                                        {application.applicationNumber}
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{application.buyer}</div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                            <Phone className="w-3 h-3" />
                                            {application.phoneNumber}
                                        </div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                            <Mail className="w-3 h-3" />
                                            {application.emailAddress}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-900">
                                    <div className="flex items-center gap-2">
                                        <Home className="w-4 h-4 text-gray-400" />
                                        {application.siteName}
                                    </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {application.plotNumber}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {application.houseType}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {formatCurrency(application.amountPaid)}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {formatCurrency(application.amountDueForPayment)}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    {getPaymentStatusBadge(application.paymentStatus)}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    {getSettingEvacuationBadge(application.settingAndEvacuation)}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        {formatDate(application.allocationLetter)}
                                    </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-900">
                                    <div className="flex items-center gap-2 relative">
                                        <button
                                            className="text-gray-600 hover:text-primary flex items-center gap-1"
                                            onClick={(e) => {
                                                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                                setMenuAnchor({ rect, application });
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
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-500">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} entries
                    </div>
                    <div className="flex gap-1">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
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
                                    className={`px-3 py-1 border rounded-md text-sm ${currentPage === pageNum ? "bg-primary text-white" : ""}`}
                                    onClick={() => onPageChange(pageNum)}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                        {totalPages > 5 && currentPage < totalPages - 2 && (
                            <span className="px-2">...</span>
                        )}
                        {totalPages > 5 && currentPage < totalPages - 2 && (
                            <button
                                onClick={() => onPageChange(totalPages)}
                                className="px-3 py-1 border rounded-md text-sm"
                            >
                                {totalPages}
                            </button>
                        )}
                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {(loading || data.length === 0) && (
                <div className="text-center text-xs py-8 text-gray-500">
                    {loading ? "Loading applications..." : "No applications found."}
                </div>
            )}

            {downloadModal && (
                <>
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fadeIn" onClick={() => setOpenDownloadModal(false)}>
                    </div>
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <div
                            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 pointer-events-auto animate-scaleIn relative max-h-[90vh] overflow-y-auto"
                        >
                            <X className='absolute right-4 top-4 hover:text-primary cursor-pointer' onClick={() => setOpenDownloadModal(false)} />

                            <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
                                Download QR
                            </h2>

                            {/* Message */}
                            <p className="text-gray-600 text-center mb-8 leading-relaxed">
                                Click on the download button to download the QR Code
                            </p>

                            {qrValue && (
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{
                                        background: 'white',
                                        padding: '16px',
                                        borderRadius: '8px',
                                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                        display: 'inline-block',
                                        marginBottom: '24px',
                                    }}>
                                        <QRCode
                                            ref={canvasRef}
                                            value={qrValue}
                                            size={400}
                                            level="H"
                                            includeMargin={true}
                                        />
                                    </div>

                                    <pre style={{
                                        background: '#f5f5f5',
                                        padding: '16px',
                                        borderRadius: '6px',
                                        textAlign: 'left',
                                        whiteSpace: 'pre-wrap',
                                        fontSize: '14px',
                                        marginBottom: '24px',
                                    }}>
                                        {qrValue}
                                    </pre>

                                    <button
                                        onClick={handleDownload}
                                        style={{
                                            padding: '12px 32px',
                                            background: '#28a745',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontSize: '16px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Download High-Quality PNG
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* Floating menu */}
            {menuAnchor && (
                <RowActionMenu
                    anchorRect={menuAnchor.rect}
                    application={menuAnchor.application}
                    onClose={() => setMenuAnchor(null)}
                    onEdit={setEditData}
                    onDelete={onDelete}
                    onOpenUploadModal={onOpenUploadModal}
                    onViewDetails={onViewDetails}
                    onChangePaymentStatus={onChangePaymentStatus}
                    onMarkAsPaid={onMarkAsPaid}
                    handleDownload={openDownloadModal}
                    setOpenView={() => setOpenView(true)}
                />
            )}

            {openView && (
                <ApplicationModal
                    data={viewData}
                    isOpen={openView}
                    onClose={() => setOpenView(false)}
                />
            )}
        </div>
    );
};

export default ApplicationList;