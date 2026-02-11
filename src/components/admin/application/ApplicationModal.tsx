import React from 'react';
import { X, FileText, CheckCircle, Clock, AlertCircle, Download, ExternalLink, Calendar, Home, MapPin, Phone, Mail, DollarSign, FileCheck } from 'lucide-react';
import type { ApplicationCreate } from '../../../types/application';

interface AllocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: ApplicationCreate
}

const ApplicationModal: React.FC<AllocationModalProps> = ({ isOpen, onClose, data }) => {

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-NG', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    // Get payment status badge
    const getPaymentStatusBadge = (status: string) => {
        switch (status) {
            case 'full':
                return {
                    label: 'Paid in Full',
                    color: 'bg-green-100 text-green-800',
                    icon: CheckCircle,
                };
            case 'partial':
                return {
                    label: 'Partial Payment',
                    color: 'bg-yellow-100 text-yellow-800',
                    icon: Clock,
                };
            default:
                return {
                    label: 'Pending',
                    color: 'bg-gray-100 text-gray-800',
                    icon: AlertCircle,
                };
        }
    };

    const statusBadge = getPaymentStatusBadge(data.paymentStatus);
    const StatusIcon = statusBadge.icon;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Allocation Details</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Ref: {data.applicationNumber}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Status Badge */}
                        <div className="flex items-center justify-between">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${statusBadge.color}`}>
                                <StatusIcon className="w-4 h-4" />
                                {statusBadge.label}
                            </span>
                            {data.settingAndEvacuation && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                    <Home className="w-4 h-4" />
                                    Setting & Evacuation Completed
                                </span>
                            )}
                        </div>

                        {/* Property Overview Card */}
                        <div className="bg-linear-to-br from-gray-50 to-gray-100/50 rounded-xl p-5">
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                                Property Overview
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <Home className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Site</p>
                                        <p className="font-medium text-gray-900">{data.siteName}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Plot Number</p>
                                        <p className="font-medium text-gray-900">{data.plotNumber}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <FileCheck className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">House Type</p>
                                        <p className="font-medium text-gray-900">{data.houseType}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Allocation Date</p>
                                        <p className="font-medium text-gray-900">{formatDate(data.allocationLetter)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Buyer Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                                    Buyer Details
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-gray-500">Full Name</p>
                                        <p className="font-medium text-gray-900">{data.buyer}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <a href={`tel:${data.phoneNumber}`} className="text-gray-900 hover:text-primary">
                                            {data.phoneNumber}
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <a href={`mailto:${data.emailAddress}`} className="text-gray-900 hover:text-primary break-all">
                                            {data.emailAddress}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Summary */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                                    Payment Summary
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Amount Paid</span>
                                        <span className="font-semibold text-green-600">{formatCurrency(data.amountPaid)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Infrastructure Fees</span>
                                        <span className="font-medium text-gray-900">{formatCurrency(data.infrastructureFees)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                        <span className="text-gray-600">Balance Due</span>
                                        <span className="font-semibold text-orange-600">{formatCurrency(data.amountDueForPayment)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Comments */}
                        {data.comment && (
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-xs text-gray-500 mb-1">Comment</p>
                                <p className="text-gray-900">{data.comment}</p>
                            </div>
                        )}

                        {/* Document */}
                        {data.documentUrl && (
                            <div className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-red-50 rounded-lg">
                                            <FileText className="w-5 h-5 text-red-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Allocation Letter</p>
                                            <p className="text-xs text-gray-500">
                                                {/* PDF Document • Uploaded {formatDate(data.updatedAt)} */}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <a
                                            href={data.documentUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                            title="View Document"
                                        >
                                            <ExternalLink className="w-5 h-5 text-gray-600" />
                                        </a>
                                        <a
                                            href={data.documentUrl}
                                            download
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                            title="Download Document"
                                        >
                                            <Download className="w-5 h-5 text-gray-600" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Metadata */}
                        <div className="text-xs text-gray-400 border-t border-gray-100 pt-4">
                            <div className="flex flex-wrap gap-4">
                                <span>Created: {formatDate(data.createdAt!)}</span>
                                <span>Last Updated: {formatDate(data.updatedAt!)}</span>
                                <span>ID: {data._id!.slice(-6)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Close
                        </button>
                        {/* <button className="px-4 py-2 text-sm font-medium bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors">
                            Update Status
                        </button> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationModal;