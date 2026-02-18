/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { X, CreditCard, User, Mail, DollarSign, Loader, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import { PaymentService } from '../../../services/paymentService';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    amount: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess, amount }) => {
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        // amount: amount
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<typeof formData>>({});

    if (!isOpen) return null;

    const validateForm = () => {
        const newErrors: Partial<typeof formData> = {};

        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        // Name validation
        if (!formData.name) {
            newErrors.name = 'Name is required';
        } else if (formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        // Amount validation
        if (!amount) {
            toast.error('Amount is required')
        }
        // else {
        //     const amountNum = parseFloat(formData.amount);
        //     if (isNaN(amountNum) || amountNum <= 0) {
        //         newErrors.amount = 'Please enter a valid amount';
        //     } else if (amountNum < 100) {
        //         newErrors.amount = 'Minimum amount is ₦100';
        //     }
        // }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // For amount field, only allow numbers and decimal point
        if (name === 'amount') {
            // Remove any non-numeric characters except decimal point
            const sanitizedValue = value.replace(/[^0-9.]/g, '');

            // Prevent multiple decimal points
            const decimalCount = sanitizedValue.split('.').length - 1;
            if (decimalCount > 1) return;

            // Limit to 2 decimal places
            if (sanitizedValue.includes('.')) {
                const parts = sanitizedValue.split('.');
                if (parts[1].length > 2) return;
            }

            setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        // Clear error for this field when user starts typing
        if (errors[name as keyof typeof formData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setLoading(true);

        try {
            // Convert amount to kobo (Paystack expects amount in kobo)
            // const amountInKobo = parseFloat(formData.amount) * 100;

            const response = await PaymentService.makePayment({
                email: formData.email,
                name: formData.name,
                amount: amount
            });

            console.log(response)

            if (response?.authorization_url) {
                // Open Paystack checkout in new tab
                window.open(response.authorization_url);

                toast.success('Redirecting to payment page...');

                // Reset form and close modal
                setFormData({ email: '', name: '' });
                onSuccess?.();

                // Don't close modal immediately, give user time to see the redirect message
                setTimeout(() => {
                    onClose();
                }, 2000);
            } else {
                throw new Error('No payment URL received');
            }
        } catch (error: any) {
            console.error('Error initializing payment:', error);
            toast.error(error.response?.data?.message || 'Failed to initialize payment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && !loading) {
            onClose();
        }
    };

    // Preset amounts for quick selection (in Naira)
    const presetAmounts = [5000, 10000, 20000, 50000, 100000];

    // const handlePresetAmount = (amount: number) => {
    //     setFormData(prev => ({ ...prev, amount: amount.toString() }));
    //     setErrors(prev => ({ ...prev, amount: undefined }));
    // };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fadeIn"
                onClick={handleOverlayClick}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 pointer-events-auto animate-scaleIn relative">

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="bg-linear-to-r from-primary/10 to-yellow-600/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CreditCard className="w-10 h-10 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Make a Payment
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Secure payment powered by Paystack
                        </p>
                    </div>

                    {/* Payment Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="customer@example.com"
                                    disabled={loading}
                                    className={`block w-full pl-10 pr-3 py-2.5 border text-gray-900 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'
                                        } rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed`}
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>
                            )}
                        </div>

                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="John Doe"
                                    disabled={loading}
                                    className={`block w-full pl-10 pr-3 py-2.5 border text-gray-900 ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'
                                        } rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed`}
                                />
                            </div>
                            {errors.name && (
                                <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>
                            )}
                        </div>

                        {/* Amount Field */}
                        {/* <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Amount (₦)
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <DollarSign className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="amount"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                    disabled={loading}
                                    className={`block w-full pl-10 pr-3 py-2.5 border ${errors.amount ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'
                                        } rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed`}
                                />
                            </div>
                            {errors.amount && (
                                <p className="mt-1.5 text-xs text-red-600">{errors.amount}</p>
                            )}
                        </div> */}

                        {/* Preset Amounts */}
                        {/* <div>
                            <p className="text-xs text-gray-500 mb-2">Quick select:</p>
                            <div className="flex flex-wrap gap-2">
                                {presetAmounts.map((amount) => (
                                    <button
                                        key={amount}
                                        type="button"
                                        onClick={() => handlePresetAmount(amount)}
                                        disabled={loading}
                                        className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        ₦{amount.toLocaleString()}
                                    </button>
                                ))}
                            </div>
                        </div> */}

                        {/* Security Notice */}
                        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                            <Lock className="w-4 h-4 text-blue-600" />
                            <p className="text-xs text-blue-700">
                                Your payment is secured by Paystack. We never store your card details.
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-linear-to-r from-primary to-yellow-600 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    Initializing Payment...
                                </>
                            ) : (
                                <>
                                    <CreditCard className="w-5 h-5" />
                                    Proceed to Payment
                                </>
                            )}
                        </button>

                        {/* Terms */}
                        <p className="text-xs text-center text-gray-400 mt-4">
                            By proceeding, you agree to our{' '}
                            <a href="/terms" className="text-primary hover:underline">
                                Terms of Service
                            </a>{' '}
                            and{' '}
                            <a href="/privacy" className="text-primary hover:underline">
                                Privacy Policy
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
};

export default PaymentModal;