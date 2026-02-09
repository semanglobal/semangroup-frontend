import React from 'react';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
    download?: () => void
}

const SuccessModal: React.FC<SuccessModalProps> = ({
    isOpen,
    onClose,
    title = "Success!",
    message = "Your enquiry has been submitted successfully. We'll get back to you soon.",
    download
}) => {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fadeIn"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div
                    className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 pointer-events-auto animate-scaleIn"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Success Icon with Animation */}
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            {/* Outer Circle Animation */}
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-ping absolute opacity-75" />

                            {/* Main Circle */}
                            <div className="w-20 h-20 bg-linear-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center relative animate-bounceIn shadow-lg">
                                {/* Checkmark */}
                                <svg
                                    className="w-10 h-10 text-white animate-checkmark"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
                        {title}
                    </h2>

                    {/* Message */}
                    <p className="text-gray-600 text-center mb-8 leading-relaxed">
                        {message}
                    </p>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="w-full bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                    >
                        Close
                    </button>

                    <button
                        onClick={download}
                        className="w-full bg-primary hover:bg-hover text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg mt-4"
                    >
                        Donload QR Code
                    </button>
                </div>
            </div>

            {/* Add custom animations to your global CSS or Tailwind config */}
            <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes checkmark {
          0% {
            stroke-dashoffset: 50;
            stroke-dasharray: 50;
          }
          100% {
            stroke-dashoffset: 0;
            stroke-dasharray: 50;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }

        .animate-bounceIn {
          animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .animate-checkmark {
          animation: checkmark 0.5s ease-in-out 0.2s forwards;
        }
      `}</style>
        </>
    );
};

export default SuccessModal;

// Usage Example:
/*
import { useState } from 'react';
import SuccessModal from './SuccessModal';

function YourComponent() {
  const [successModal, setSuccessModal] = useState(false);

  const handleSubmit = async () => {
    // Your form submission logic
    // ...
    
    // Show success modal
    setSuccessModal(true);
  };

  return (
    <>
      <button onClick={handleSubmit}>Submit</button>
      
      <SuccessModal
        isOpen={successModal}
        onClose={() => setSuccessModal(false)}
        title="Success!"
        message="Your enquiry has been submitted successfully. We'll get back to you soon."
      />
    </>
  );
}
*/