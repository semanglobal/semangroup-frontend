/*eslint-disable @typescript-eslint/no-explicit-any*/
import React, { useState, useEffect, useRef } from 'react';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import type { ChangeEvent, FormEvent } from 'react';
import { ArrowLeft, Loader, Upload, X } from 'lucide-react';
import { toast } from 'react-toastify';
import Select from 'react-select';
import type { ApplicationCreate } from '../../../types/application';
import { ApplicationService } from '../../../services/applicationService';
import { fileUpload } from '../../../services/fileUpload';
import SuccessModal from './Successmodal ';

type ApplicationFormProps = {
    editData: ApplicationCreate | null;
    // isOpen: boolean;
    onClose: () => void;
    setEditData?: (data: ApplicationCreate | null) => void;
    refetch?: () => void;
};

const ApplicationForm: React.FC<ApplicationFormProps> = ({
    editData,
    onClose,
    setEditData,
    refetch,
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [tempDocument, setTempDocument] = useState<string | null>(null);
    const [formData, setFormData] = useState<ApplicationCreate>({
        siteName: '',
        buyer: '',
        applicationNumber: '',
        plotNumber: '',
        phoneNumber: '',
        emailAddress: '',
        houseType: '',
        amountPaid: 0,
        amountDueForPayment: 0,
        infrastructureFees: 0,
        paymentStatus: '',
        allocationLetter: '',
        comment: '',
        settingAndEvacuation: false,
        documentUrl: '',
    });
    const [successModal, setSuccessModal] = useState<boolean>(false)
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // QR Code
    const [qrValue, setQrValue] = useState('');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleGenerate = (id: string) => {
        const data = `https://semanglobalgroup.com/verify?code=${id}`

        setQrValue(data);
    };

    const handleDownload = () => {
        const canvas = canvasRef.current;
        console.log(canvas)

        if (canvas) {
            const pngUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = pngUrl;
            link.download = `receipt-qr-${formData.buyer || 'unnamed'}.png`;
            link.click();
        } else {
            console.error('Canvas not ready');
        }
    };


    useEffect(() => {
        if (editData) {
            setFormData(editData);
            if (editData.documentUrl) {
                setTempDocument(editData.documentUrl);
            }
        }
    }, [editData]);

    const paymentStatusOptions = [
        { value: 'paid', label: 'Full Payment' },
        { value: 'partial', label: 'Partial Payment' },
        { value: 'pending', label: 'Pending Payment' },
    ];

    const houseTypeOptions = [
        { value: '2 Bedroom Bungalow', label: '2 Bedroom Bungalow' },
        { value: '3 Bedroom Bungalow', label: '3 Bedroom Bungalow' },
        { value: '4 Bedroom Duplex', label: '4 Bedroom Duplex' },
        { value: '5 Bedroom Duplex', label: '5 Bedroom Duplex' },
        { value: 'Semi-detached Duplex', label: 'Semi-detached Duplex' },
        { value: 'Terraced Duplex', label: 'Terraced Duplex' }
    ];

    const siteNameOptions = [
        { value: 'Abuja Prime Estate', label: 'Abuja Prime Estate' },
        { value: 'Lagos Luxury Homes', label: 'Lagos Luxury Homes' },
        { value: 'Port Harcourt Garden City', label: 'Port Harcourt Garden City' },
        { value: 'Kano Royal Estates', label: 'Kano Royal Estates' },
        { value: 'Ibadan Heritage Homes', label: 'Ibadan Heritage Homes' }
    ];

    const selectedPaymentStatusOption = paymentStatusOptions.find(option =>
        option.value === formData.paymentStatus
    );

    const selectedHouseTypeOption = houseTypeOptions.find(option =>
        option.value === formData.houseType
    );

    const selectedSiteNameOption = siteNameOptions.find(option =>
        option.value === formData.siteName
    );

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const { name, value, type } = e.target;
        setFormData((prev: any) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                type === 'number' ? Number(value) || 0 : value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: '',
        }));
    };

    const handleSelectChange = (fieldName: string) => (selectedOption: any) => {
        setFormData((prev: any) => ({
            ...prev,
            [fieldName]: selectedOption?.value || ''
        }));

        setErrors((prev) => ({
            ...prev,
            [fieldName]: '',
        }));
    };

    const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, checked } = e.target;
        setFormData((prev: any) => ({
            ...prev,
            [name]: checked,
        }));
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.siteName) newErrors.siteName = 'Site name is required';
        if (!formData.buyer) newErrors.buyer = 'Buyer name is required';
        if (!formData.applicationNumber) newErrors.applicationNumber = 'Application number is required';
        if (!formData.plotNumber) newErrors.plotNumber = 'Plot number is required';
        if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
        if (!formData.emailAddress) newErrors.emailAddress = 'Email address is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress))
            newErrors.emailAddress = 'Invalid email format';
        if (!formData.houseType) newErrors.houseType = 'House type is required';
        if (formData.amountPaid < 0) newErrors.amountPaid = 'Amount paid cannot be negative';
        if (formData.amountDueForPayment < 0) newErrors.amountDueForPayment = 'Amount due cannot be negative';
        if (formData.infrastructureFees < 0) newErrors.infrastructureFees = 'Infrastructure fees cannot be negative';
        if (!formData.paymentStatus) newErrors.paymentStatus = 'Payment status is required';
        if (!formData.allocationLetter) newErrors.allocationLetter = 'Allocation date is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCancel = (): void => {
        onClose();
        setEditData?.(null);
        setTempDocument(null);
        setSelectedFile(null);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                toast.error('File size should be less than 10MB');
                return;
            }

            // Check file type (PDF, DOC, DOCX, images)
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'image/jpeg',
                'image/png',
                'image/jpg'
            ];

            if (!allowedTypes.includes(file.type)) {
                toast.error('Please select a PDF, Word document, or image file');
                return;
            }

            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setTempDocument(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeDocument = () => {
        setSelectedFile(null);
        setTempDocument(null);
        setFormData((prev: any) => ({ ...prev, documentUrl: '' }));
    };

    const uploadDocument = async (): Promise<string> => {
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedFile!);
        const response = await fileUpload(uploadFormData);
        return response;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validate()) return;
        setIsSubmitting(true);

        let documentUrl = formData.documentUrl;
        // If a new document was selected, upload it first
        if (selectedFile) {
            try {
                documentUrl = await uploadDocument();
            } catch (error) {
                console.error('Error uploading document:', error);
                toast.error('Failed to upload document. Please try again.');
                setIsSubmitting(false);
                return;
            }
        }

        const payload = {
            ...formData,
            documentUrl: documentUrl,
            // Format allocation letter date to ISO string
            allocationLetter: new Date(formData.allocationLetter).toISOString(),
        };

        try {
            if (editData && editData._id) {
                const res = await ApplicationService.updateApplication(payload, editData._id);
                toast.success(res.message as string);
                setSelectedFile(null);
                setTempDocument(null);
                handleGenerate(editData._id)
                // onClose();
                setSuccessModal(true)
                refetch?.();
            } else {
                const res = await ApplicationService.createApplication(payload);
                handleGenerate(res.data)

                toast.success(res.message as string);
                setSelectedFile(null);
                setTempDocument(null);
                onClose();
                refetch?.();
            }
        } catch (error) {
            console.error('Error creating application:', error);
            const errorResponse = (error as any).response?.data?.message;
            toast.error(errorResponse || "Something went wrong, please try again");
        } finally {
            setIsSubmitting(false);
        }
    };

    const customStyles = {
        control: (provided: any, state: any) => ({
            ...provided,
            borderRadius: '8px',
            borderColor: errors[state.name] ? '#ef4444' : '#d1d5db',
            padding: '0rem',
            boxShadow: 'none',
            '&:hover': {
                borderColor: errors[state.name] ? '#ef4444' : '#5A38FD'
            }
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#5A38FD' : state.isFocused ? '#eff6ff' : 'white',
            color: state.isSelected ? 'white' : '#1f2937',
        })
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="flex items-center mb-8">
                    <button
                        onClick={handleCancel}
                        type="button"
                        className="mr-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-xl font-medium text-gray-900">
                            {editData ? "Edit Application" : "Create Application"}
                        </h1>
                        <p className="text-gray-600 text-xs">
                            {editData ? "Update application information" : "Create a new property application"}
                        </p>
                    </div>
                </div>

                <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 md:space-x-4">
                    {/* Site Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                        <Select
                            name="siteName"
                            options={siteNameOptions}
                            value={selectedSiteNameOption}
                            onChange={handleSelectChange('siteName')}
                            placeholder="Select site"
                            className="text-sm"
                            styles={customStyles}
                        />
                        {errors.siteName && <p className="text-xs text-red-500 mt-1">{errors.siteName}</p>}
                    </div>

                    {/* Buyer Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Buyer Name</label>
                        <input
                            type="text"
                            name="buyer"
                            value={formData.buyer}
                            onChange={handleInputChange}
                            placeholder="Buyer's full name"
                            className="w-full px-3 py-2 border bg-white text-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary placeholder-gray-400 text-sm"
                        />
                        {errors.buyer && <p className="text-xs text-red-500 mt-1">{errors.buyer}</p>}
                    </div>

                    {/* Application Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Application Number</label>
                        <input
                            type="text"
                            name="applicationNumber"
                            value={formData.applicationNumber}
                            onChange={handleInputChange}
                            placeholder="e.g., APP-2026-001"
                            className="w-full px-3 py-2 border bg-white text-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary placeholder-gray-400 text-sm"
                        />
                        {errors.applicationNumber && <p className="text-xs text-red-500 mt-1">{errors.applicationNumber}</p>}
                    </div>

                    {/* Plot Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Plot Number</label>
                        <input
                            type="text"
                            name="plotNumber"
                            value={formData.plotNumber}
                            onChange={handleInputChange}
                            placeholder="e.g., Plot 24B"
                            className="w-full px-3 py-2 border bg-white text-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary placeholder-gray-400 text-sm"
                        />
                        {errors.plotNumber && <p className="text-xs text-red-500 mt-1">{errors.plotNumber}</p>}
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            placeholder="Phone number"
                            className="w-full px-3 py-2 border bg-white text-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary placeholder-gray-400 text-sm"
                        />
                        {errors.phoneNumber && <p className="text-xs text-red-500 mt-1">{errors.phoneNumber}</p>}
                    </div>

                    {/* Email Address */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            name="emailAddress"
                            value={formData.emailAddress}
                            onChange={handleInputChange}
                            placeholder="Email address"
                            className="w-full px-3 py-2 border bg-white text-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary placeholder-gray-400 text-sm"
                        />
                        {errors.emailAddress && <p className="text-xs text-red-500 mt-1">{errors.emailAddress}</p>}
                    </div>

                    {/* House Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">House Type</label>
                        <Select
                            name="houseType"
                            options={houseTypeOptions}
                            value={selectedHouseTypeOption}
                            onChange={handleSelectChange('houseType')}
                            placeholder="Select house type"
                            className="text-sm"
                            styles={customStyles}
                        />
                        {errors.houseType && <p className="text-xs text-red-500 mt-1">{errors.houseType}</p>}
                    </div>

                    {/* Payment Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                        <Select
                            name="paymentStatus"
                            options={paymentStatusOptions}
                            value={selectedPaymentStatusOption}
                            onChange={handleSelectChange('paymentStatus')}
                            placeholder="Select payment status"
                            className="text-sm"
                            styles={customStyles}
                        />
                        {errors.paymentStatus && <p className="text-xs text-red-500 mt-1">{errors.paymentStatus}</p>}
                    </div>

                    {/* Amount Paid */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Amount Paid (₦)
                        </label>
                        <input
                            type="number"
                            name="amountPaid"
                            value={formData.amountPaid || ''}
                            min="0"
                            onChange={handleInputChange}
                            placeholder="Amount paid"
                            className="w-full px-3 py-2 border bg-white text-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary placeholder-gray-400 text-sm"
                        />
                        {errors.amountPaid && <p className="text-xs text-red-500 mt-1">{errors.amountPaid}</p>}
                    </div>

                    {/* Amount Due for Payment */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Amount Due for Payment (₦)
                        </label>
                        <input
                            type="number"
                            name="amountDueForPayment"
                            value={formData.amountDueForPayment || ''}
                            min="0"
                            onChange={handleInputChange}
                            placeholder="Amount due"
                            className="w-full px-3 py-2 border bg-white text-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary placeholder-gray-400 text-sm"
                        />
                        {errors.amountDueForPayment && <p className="text-xs text-red-500 mt-1">{errors.amountDueForPayment}</p>}
                    </div>

                    {/* Infrastructure Fees */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Infrastructure Fees (₦)
                        </label>
                        <input
                            type="number"
                            name="infrastructureFees"
                            value={formData.infrastructureFees || ''}
                            min="0"
                            onChange={handleInputChange}
                            placeholder="Infrastructure fees"
                            className="w-full px-3 py-2 border bg-white text-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary placeholder-gray-400 text-sm"
                        />
                        {errors.infrastructureFees && <p className="text-xs text-red-500 mt-1">{errors.infrastructureFees}</p>}
                    </div>

                    {/* Allocation Letter Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Allocation Date
                        </label>
                        <input
                            type="date"
                            name="allocationLetter"
                            value={formData.allocationLetter?.split('T')[0]}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border bg-white text-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary placeholder-gray-400 text-sm"
                        />
                        {errors.allocationLetter && (
                            <p className="text-xs text-red-500 mt-1">{errors.allocationLetter}</p>
                        )}
                    </div>

                    {/* Setting and Evacuation Checkbox */}
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="settingAndEvacuation"
                            checked={formData.settingAndEvacuation}
                            onChange={handleCheckboxChange}
                            className="w-4 h-4 text-primary rounded focus:ring-primary border-gray-300"
                        />
                        <label className="text-sm font-medium text-gray-700">
                            Setting and Evacuation Completed
                        </label>
                    </div>
                </div>

                {/* Comment Section (Full width) */}
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
                    <textarea
                        name="comment"
                        value={formData.comment}
                        onChange={handleInputChange}
                        placeholder="Additional comments or notes about this application..."
                        rows={3}
                        className="w-full px-3 py-2 border bg-white text-gray-900 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary placeholder-gray-400 text-sm"
                    />
                </div>

                {/* Document Upload Section */}
                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Supporting Document (Optional)
                    </label>

                    <div className="flex items-center space-x-4">
                        {tempDocument ? (
                            <div className="relative">
                                <div className="w-20 h-20 rounded border border-gray-300 flex flex-col items-center justify-center bg-gray-50">
                                    <div className="text-xs text-gray-600 text-center px-1">
                                        Document Uploaded
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={removeDocument}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="w-20 h-20 rounded border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                                <Upload className="w-6 h-6 text-gray-400" />
                            </div>
                        )}

                        <div>
                            <label className="cursor-pointer">
                                <span className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors">
                                    Upload Document
                                </span>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx,image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                            </label>
                            <p className="text-xs text-gray-500 mt-3">
                                PDF, Word documents, or images (Max 10MB)
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                    <button
                        onClick={handleCancel}
                        type="button"
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-sm"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-primary text-white rounded-md hover:bg-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors text-sm"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="flex gap-2 items-center">
                                <Loader size={18} className="animate-spin" />
                                Processing...
                            </span>
                        ) : editData?._id ? "Update Application" : "Create Application"}
                    </button>
                </div>
            </form>

            <SuccessModal
                isOpen={successModal}
                onClose={() => {setSuccessModal(false); onClose()}}
                title="Success!"
                message="Your enquiry has been submitted successfully. We'll get back to you soon."
                download={handleDownload}
            />

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
        </>
    );
};

export default ApplicationForm;