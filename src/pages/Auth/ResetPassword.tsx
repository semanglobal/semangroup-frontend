/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { EyeIcon, EyeOffIcon, Shield, Lock, ArrowBigLeft } from "lucide-react";
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthService } from '../../services/authService';
import { toast } from 'react-toastify';
import type { resetPassword } from '../../types/loginType';

interface FormData {
  newPassword: string;
}

interface FormErrors {
  newPassword?: string;
  confirmNewPassword?: string;
}

const ResetPassword = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');
  const verificationCode = queryParams.get('verificationCode');

  const [formData, setFormData] = useState<resetPassword>({
    newPassword: '',
    confirmNewPassword: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (newPassword: string) => {
    if (!newPassword) return {
      length: false,
      uppercase: false,
      number: false,
      specialChar: false,
    };

    return {
      length: newPassword.length >= 8 && newPassword.length <= 20,
      uppercase: /[A-Z]/.test(newPassword),
      number: /\d/.test(newPassword),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    };
  };

  const passwordValidation = validatePassword(formData.newPassword);

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
    if (!formData.newPassword) {
      newErrors.newPassword = "Password is required";
    }
    if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }
    if (!formData.confirmNewPassword) {
      newErrors.confirmNewPassword = "Confirm password is required";
    }
    if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = "Passwords do not match";
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

    setIsSubmitting(true);

    const payload = {
      ...formData,
      email: email as string,
      verificationCode: verificationCode as string,
    };
    
    try {
      const res = await AuthService.resetPassword(payload);

      if (res.success === false) {
        toast.error(res.message);
      } else {
        toast.success("Password reset successfully");
        setLoginError('');
        setSuccess(true);
        navigate('/login');
      }
    } catch (error: any) {
      const axiosError = error;
      setLoginError(axiosError.response.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validation = !formData.newPassword || !formData.confirmNewPassword ||
    !passwordValidation.length || !passwordValidation.uppercase ||
    !passwordValidation.number || !passwordValidation.specialChar;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="w-full max-w-md">
        {/* Super Admin Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/20">
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
            Create a new secure password
          </p>
        </div>

        {/* Reset Password Form */}
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
              Password reset successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                New Master Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={`pl-10 pr-10 w-full bg-gray-900/50 border outline-none rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 py-3 px-4 text-white placeholder-gray-400 ${
                    errors.newPassword ? "border-red-500" : "border-gray-600"
                  }`}
                  placeholder="Enter new password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-200 transition-colors duration-200"
                  >
                    {showPassword ? <EyeIcon className="w-5 h-5" /> : <EyeOffIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              {errors.newPassword && (
                <p className="mt-2 text-sm text-red-400 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.newPassword}
                </p>
              )}

              {/* Password validation indicators */}
              <div className="mt-3 space-y-2">
                <p className={`text-xs flex items-center ${passwordValidation.length ? "text-green-400" : "text-gray-500"}`}>
                  <span className="w-4 mr-2">{passwordValidation.length ? "✓" : "•"}</span>
                  8-20 characters
                </p>
                <p className={`text-xs flex items-center ${passwordValidation.uppercase ? "text-green-400" : "text-gray-500"}`}>
                  <span className="w-4 mr-2">{passwordValidation.uppercase ? "✓" : "•"}</span>
                  At least one uppercase letter
                </p>
                <p className={`text-xs flex items-center ${passwordValidation.number ? "text-green-400" : "text-gray-500"}`}>
                  <span className="w-4 mr-2">{passwordValidation.number ? "✓" : "•"}</span>
                  At least one number
                </p>
                <p className={`text-xs flex items-center ${passwordValidation.specialChar ? "text-green-400" : "text-gray-500"}`}>
                  <span className="w-4 mr-2">{passwordValidation.specialChar ? "✓" : "•"}</span>
                  At least one special character
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Confirm Master Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmNewPassword"
                  value={formData.confirmNewPassword}
                  onChange={handleChange}
                  className={`pl-10 pr-10 w-full bg-gray-900/50 border outline-none rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 py-3 px-4 text-white placeholder-gray-400 ${
                    errors.confirmNewPassword ? "border-red-500" : "border-gray-600"
                  }`}
                  placeholder="Confirm new password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-200 transition-colors duration-200"
                  >
                    {showConfirmPassword ? <EyeIcon className="w-5 h-5" /> : <EyeOffIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              {errors.confirmNewPassword && (
                <p className="mt-2 text-sm text-red-400 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.confirmNewPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={validation || isSubmitting}
              className={`w-full py-4 px-4 rounded-xl focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 font-semibold flex items-center justify-center ${
                validation || isSubmitting
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/25 cursor-pointer'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Securing Password...
                </>
              ) : (
                <div className="flex items-center">
                  <Lock className="w-5 h-5 mr-2" />
                  Update Master Password
                </div>
              )}
            </button>
          </form>

          <div className="flex justify-center mt-6 pt-6 border-t border-gray-700">
            <Link
              to={'/login'}
              className={`text-purple-400 hover:text-purple-300 font-medium transition duration-200 flex items-center gap-2 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
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
            🔒 Secure super admin portal • Strong passwords required
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;