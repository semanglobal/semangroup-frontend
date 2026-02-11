// /* eslint-disable no-unused-vars */
import type { AxiosError } from 'axios';
import React, { useState } from 'react';
import { FaEnvelope, FaCheck } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/authService';
import { toast } from 'react-toastify';
import { ArrowBigLeft, Shield, Mail } from 'lucide-react';

interface FormData {
    email: string;
}

interface FormErrors {
    email?: string;
}

const ForgotPassword = () => {
    // const baseUrl: string = import.meta.env.VITE_API_BASE_URL;
    const [formData, setFormData] = useState<FormData>({
        email: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [success, setSuccess] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [loginError, setLoginError] = useState<string>('');
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear errors when user types
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        if (loginError) setLoginError('');
    };

    const validate = (): FormErrors => {
        const newErrors: FormErrors = {};
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const payload = {
            email: formData.email,
            subject: 'Password reset code',
        }

        setIsSubmitting(true);
        try {
            const res = await AuthService.sendVerificationEmail(payload);
            setLoginError('');
            setSuccess(true);
            toast.success(res.message || 'Password reset link has been sent to your email.');
            navigate(`/auth/confirm-email?email=${formData.email}`);
        } catch (error) {
            const axiosError = error as AxiosError;
            console.log(axiosError);
            if (axiosError.response?.status === 401) {
                setLoginError('Invalid credentials. Please try again.');
            } else {
                setLoginError('Server error. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const validation = !formData.email

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 to-black p-4">
            <div className="w-full max-w-md">
                {/* Super Admin Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/20">
                            <img src="/fasma_logo.png" alt="" />
                        </div>
                    </div>

                    <div className="mb-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-3">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-purple-300">SUPER ADMIN ACCESS</span>
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-white mb-3">
                        Reset Master Password
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Enter your administrator email to continue
                    </p>
                </div>

                {/* Forgot Password Form */}
                <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-8 shadow-2xl">
                    {loginError && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {loginError}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-300 rounded-xl flex items-center">
                            <FaCheck className="mr-2" />
                            Password reset instructions sent successfully!
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                                Administrator Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`pl-10 w-full bg-gray-900/50 border outline-none rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 py-3 px-4 text-white placeholder-gray-400 ${errors.email ? "border-red-500" : "border-gray-600"
                                        }`}
                                    placeholder="admin@system.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-400 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={validation || isSubmitting}
                            className={`w-full py-4 px-4 rounded-xl focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 font-semibold flex items-center justify-center ${validation || isSubmitting
                                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                    : 'bg-linear-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/25 cursor-pointer'
                                }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending Reset Code...
                                </>
                            ) : (
                                <div className="flex items-center">
                                    <Mail className="w-5 h-5 mr-2" />
                                    Send Reset Code
                                </div>
                            )}
                        </button>
                    </form>

                    <div className="flex justify-center mt-6 pt-6 border-t border-gray-700">
                        <Link
                            to={'/login'}
                            className={`text-purple-400 hover:text-purple-300 font-medium transition duration-200 flex items-center gap-2 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                        >
                            <ArrowBigLeft className="w-5 h-5" />
                            Back to System Login
                        </Link>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                        🔒 Secure super admin portal • Reset codes expire in 30 minutes
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword;