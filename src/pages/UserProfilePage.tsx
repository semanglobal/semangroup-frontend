/*eslint-disable @typescript-eslint/no-explicit-any*/
import React, { useState, useEffect } from 'react';
import { ProfileService } from '../services/profileService';
import { toast } from 'react-toastify';
import { useAuth } from '../context/auth/useAuth';
import ChangePasswordModal from './Auth/ChangePasswordModal';
import { Loader } from 'lucide-react';
import { decryptResponse } from '../utils/decrypt';

interface UserProfile {
    _id?: string;
    fullName: string;
    email: string;
    phone: string;
    role?: string;
    lastLogin?: string;
}

const UserProfilePage: React.FC = () => {
    const { user, login } = useAuth();
    const [userData, setUserData] = useState<UserProfile>({
        fullName: '',
        email: '',
        phone: '',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [openPasswordModal, setOpenPasswordModal] = useState(false);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await ProfileService.getProfile();
            const decrypted: any = decryptResponse(response);
            // Map only the fields that exist in the API response
            const mappedUserData: UserProfile = {
                _id: decrypted._id,
                fullName: decrypted.fullName,
                email: decrypted.email,
                phone: decrypted.phone,
                role: decrypted.role,
                lastLogin: decrypted.lastLogin,
            };
            setUserData(mappedUserData);
            setIsDataLoaded(true);
        } catch (error) {
            console.error('Error fetching user data:', error);
            toast.error('Failed to load profile data');
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const updatedData = {
                ...userData
            };

            const res = await ProfileService.updateProfile(updatedData);

            // Update auth context with new token if provided
            if (res.token) {
                login(res.token);
            }

            toast.success('Profile updated successfully!');
            setUserData(updatedData);
            setIsEditing(false);
            fetchUserData(); // Refresh data to get any server-side updates
        } catch (error: any) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.message || error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        };
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset form data by fetching original data
        fetchUserData();
    };

    if (!isDataLoaded) return (
        <div className="col-span-3 flex flex-col gap-2 items-center justify-center h-[80vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p>Loading profile...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white border rounded-lg overflow-hidden">
                    <div className="px-6 py-8">
                        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                            {/* Profile Image Section - Removed */}

                            {/* Signature Section - Removed */}

                            {/* Form Section */}
                            <div className="grow w-full">
                                {isEditing ? (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                            <div>
                                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                                                    Full Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    id="fullName"
                                                    value={userData.fullName}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    id="email"
                                                    value={userData.email}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-gray-500 bg-gray-100"
                                                    readOnly
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                                    Phone
                                                </label>
                                                <input
                                                    type="text"
                                                    name="phone"
                                                    id="phone"
                                                    value={userData.phone}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end space-x-3">
                                            <button
                                                type="button"
                                                onClick={handleCancel}
                                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="inline-flex items-center px-10 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                                            >
                                                {loading ? (
                                                    <span className="flex gap-2 items-center">
                                                        <Loader size={18} className="animate-spin" />
                                                        Updating...
                                                    </span>
                                                ) : 'Update'}
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="space-y-6">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">{userData.fullName}</h2>
                                            <p className="text-sm text-gray-500">{userData.email}</p>
                                            {userData.role && (
                                                <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                    {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <svg className="shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                                {userData.phone || 'Not provided'}
                                            </div>

                                            {userData.lastLogin && (
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <svg className="shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Last login: {new Date(userData.lastLogin).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-6 flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setIsEditing(true)}
                                                className="inline-flex items-center px-4 md:px-10 py-2 border border-gray-300 hover:text-white shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all"
                                            >
                                                Edit Profile
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setOpenPasswordModal(true)}
                                                className="inline-flex items-center px-4 md:px-10 py-2 border border-gray-300 hover:text-white shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all"
                                            >
                                                Change Password
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ChangePasswordModal
                onClose={() => setOpenPasswordModal(false)}
                isOpen={openPasswordModal}
            />
        </div>
    );
};

export default UserProfilePage;