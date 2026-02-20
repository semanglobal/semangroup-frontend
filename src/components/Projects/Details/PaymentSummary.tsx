// PaymentSummary.tsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import PaymentModal from './PaymentModal';

interface PaymentSummaryProps {
    isOpen: boolean;
    onClose: () => void;
    propertyAmount: number;
    propertyName?: string;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
    isOpen,
    onClose,
    propertyAmount,
    propertyName
}) => {
    const [openPaymentModal, setOpenPaymentModal] = useState<boolean>(false);
    const handleBuyNow = () => {
        setOpenPaymentModal(true)
    }

    if (!isOpen) return null;

    // Fixed amounts
    const APPLICATION_FEE = 20000; // 20,000 Naira
    const CHARGES = 366.598778004; // Additional charges

    // Calculate totals
    const subtotal = propertyAmount + APPLICATION_FEE;
    const total = subtotal + CHARGES;

    // Format currency
    const formatNaira = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-4xl transform rounded-lg bg-white p-6 shadow-xl transition-all">

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>

                    {/* Header */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Payment Summary</h2>
                        {propertyName && (
                            <p className="text-sm text-gray-600 mt-1">{propertyName}</p>
                        )}
                    </div>

                    {/* Summary items */}
                    <div className="space-y-4">
                        {/* Property Amount */}
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">Property Amount</span>
                            <span className="font-medium text-gray-900">
                                {formatNaira(propertyAmount)}
                            </span>
                        </div>

                        {/* Application Form Fee */}
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <div>
                                <span className="text-gray-600">Application Form Fee</span>
                                <p className="text-xs text-gray-400 mt-1">Fixed fee</p>
                            </div>
                            <span className="font-medium text-gray-900">
                                {formatNaira(APPLICATION_FEE)}
                            </span>
                        </div>

                        {/* Additional Charges */}
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <div>
                                <span className="text-gray-600">Service Charges</span>
                                <p className="text-xs text-gray-400 mt-1">Processing fee</p>
                            </div>
                            <span className="font-medium text-gray-900">
                                {formatNaira(CHARGES)}
                            </span>
                        </div>

                        {/* Subtotal */}
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium text-gray-900">
                                {formatNaira(subtotal)}
                            </span>
                        </div>

                        {/* Total */}
                        <div className="flex justify-between items-center py-3 mt-2 bg-gray-50 rounded-lg px-3">
                            <span className="text-lg font-semibold text-gray-900">Total</span>
                            <span className="text-xl font-bold text-primary">
                                {formatNaira(total)}
                            </span>
                        </div>

                        {/* Additional info */}
                        <div className="text-xs text-gray-400 mt-4 space-y-1">
                            <p className='font-medium text-primary mb-2'>Note: Your application form will be downloaded after successful payment.  Ensure you fill it, sign and scan it, then send it back to us on WhatsApp via +2348184368514 or via email: Semanglobalgroup@gmail.com</p>
                            <p>• Application form fee is non-refundable</p>
                            <p>• Service charges include processing and verification fees</p>
                            <p>• All amounts are in Nigerian Naira (NGN)</p>
                        </div>
                    </div>

                    {/* Buy Now button */}
                    <button
                        onClick={handleBuyNow}
                        className="w-full mt-6 bg-primary hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Buy Now
                    </button>

                    {/* Cancel link */}
                    <button
                        onClick={onClose}
                        className="w-full mt-3 text-sm text-gray-500 hover:underline transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>

            <PaymentModal
                isOpen={openPaymentModal}
                onClose={() => setOpenPaymentModal(false)}
                amount={total}
            />
        </div>
    );
};

export default PaymentSummary;