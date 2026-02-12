/*eslint-disable @typescript-eslint/no-explicit-any*/
import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/authService';
import { toast } from 'react-toastify';
import type { AxiosError } from 'axios';

// Remove empty interface and use type alias instead
type ConfirmEmailProps = object;

const ConfirmEmail: React.FC<ConfirmEmailProps> = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState<number>(0);
  const [canResend, setCanResend] = useState<boolean>(true);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');

  // Initialize refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  // Countdown timer
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleInputChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all fields are filled
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
    // Handle arrow keys
    else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');

    if (pastedData.length <= 6) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pastedData[i] || '';
      }
      setOtp(newOtp);

      // Focus the next empty input or the last input
      const nextEmptyIndex = newOtp.findIndex(digit => digit === '');
      const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleVerify = async (code: string = otp.join('')) => {
    if (code.length !== 6 || !email) return;

    setIsVerifying(true);

    try {
      // Use the actual confirmEmail endpoint
      await AuthService.confirmEmail({
        email,
        code
      });

      toast.success('Email verified successfully!');
      navigate(`/auth/reset-password?email=${email}&verificationCode=${code}`);
    } catch (error: any) {
      console.error('Verification failed:', error);
      toast.error(error.response.data.message || 'Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || !email) return;

    const payload = {
      email,
      subject: 'Password reset code',
    };

    try {
      // Simulate API call to resend OTP
      await AuthService.sendVerificationEmail(payload);

      // Reset state and start countdown
      setOtp(['', '', '', '', '', '']);
      setCountdown(30);
      setCanResend(false);
      inputRefs.current[0]?.focus();

      toast.success('New OTP sent to your email!');
    } catch (error) {
      console.error('Resend failed:', error);
      toast.error('Failed to resend OTP. Please try again.');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
          <p className="text-gray-600">
            We've sent a 6-digit verification code to your email address.
            Please enter it below to confirm your email.
          </p>
          {email && (
            <p className="text-sm text-gray-500 mt-2">
              Sent to: {email}
            </p>
          )}
        </div>

        <div className="mb-6">
          <div className="flex justify-center space-x-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-12 h-12 text-center text-xl font-semibold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${digit
                  ? 'border-primary bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
                  } ${isVerifying ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isVerifying}
              />
            ))}
          </div>

          <button
            onClick={() => handleVerify()}
            disabled={otp.join('').length !== 6 || isVerifying || !email}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${otp.join('').length === 6 && !isVerifying && email
              ? 'bg-primary hover:bg-primaryHover text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            {isVerifying ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </div>
            ) : (
              'Verify Email'
            )}
          </button>
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-3">
            Didn't receive the code?
          </p>
          <button
            onClick={handleResend}
            disabled={!canResend || !email}
            className={`font-medium transition-colors ${canResend && email
              ? 'text-primary hover:text-blue-700 cursor-pointer'
              : 'text-gray-400 cursor-not-allowed'
              }`}
          >
            {canResend ? 'Resend Code' : `Resend in ${formatTime(countdown)}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmail;