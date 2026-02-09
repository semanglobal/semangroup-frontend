/*eslint-disable @typescript-eslint/no-explicit-any*/

import React, { useState } from 'react';
import { AuthService } from '../../services/authService';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/auth/useAuth';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Loader, Shield, Eye, EyeOff } from 'lucide-react';
import { decryptResponse } from '../../utils/decrypt';

interface JwtPayload {
    id?: string;
    role?: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    schoolName?: string;
    profilePic?: string;
    iat: number;
    exp?: number;
}

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) return;

        setIsLoading(true);

        try {
            const res = await AuthService.login({ email, password });
            toast.success('Login successful!');
            const decrypted: any = decryptResponse(res);
            login(decrypted.token);

            navigate('/admin/dashboard');
        } catch (error) {
            console.log('Login failed:', error);
            const decrypted: any = decryptResponse((error as any).response?.data)
            // const errorMessage = (error as any).response?.data?.message;
            toast.error(decrypted.message || 'Login failed. Please check your credentials and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = email.trim() !== '' && password.trim() !== '';
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 to-black p-4">
            <div className="w-full max-w-md">
                {/* Super Admin Header */}
                <div className="mb-1 text-center flex flex-col items-center gap-2">
                    <div className="bg-white rounded-2xl p-2">
                        <img src={'/logo.png'} alt="logo" loading='lazy' className='w-16' />
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-purple-300">ADMIN ACCESS ONLY</span>
                    </div>
                </div>

                {/* Login Form */}
                <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                                Administrator Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 outline-none rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-white placeholder-gray-400"
                                placeholder="admin@system.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                                Master Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 pr-12 bg-gray-900/50 border border-gray-600 outline-none rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-white placeholder-gray-400"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 transition-colors duration-200"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !isFormValid}
                            className={`w-full py-4 px-4 rounded-xl focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 font-semibold flex items-center justify-center ${isFormValid && !isLoading
                                ? 'bg-linear-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/25 cursor-pointer'
                                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <Loader className="animate-spin mr-2 w-5 h-5" />
                                    Authenticating...
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <Shield className="w-5 h-5 mr-2" />
                                    Access Dashboard
                                </div>
                            )}
                        </button>

                        <div className="text-center pt-4 border-t border-gray-700">
                            <p className="text-sm text-gray-400">
                                For emergency access?{' '}
                                <button
                                    type="button"
                                    className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200"
                                    onClick={() => navigate('/auth/forgot-password')}
                                >
                                    Contact System Admin
                                </button>
                            </p>
                        </div>
                    </form>
                </div>

                {/* Security Notice */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                        🔒 Secure admin portal • Unauthorized access prohibited
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;