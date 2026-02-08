// Properties.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditPropertyModal from '../components/admin/EditPropertyModal';
import AddPropertyModal from '../components/admin/AddPropertyModal';
import { PropertyService } from '../services/propertyService';
import type { PropertyType } from '../types/propertyType';

interface Location {
    address: string;
    city: string;
    state: string;
    country: string;
}

interface DeleteWarningModalProps {
    open: boolean;
    propertyTitle: string;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean
}

const DeleteWarningModal: React.FC<DeleteWarningModalProps> = ({
    open,
    propertyTitle,
    onClose,
    onConfirm,
    loading
}) => {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-lg font-semibold text-red-600 mb-3">Delete Property</h3>
                <p className="text-gray-600 mb-6">
                    Are you sure you want to delete "{propertyTitle}"? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                        {loading ? 'Deleting': 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const Properties: React.FC = () => {
    const [properties, setProperties] = useState<PropertyType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProperty, setSelectedProperty] = useState<PropertyType | null>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [propertyToDelete, setPropertyToDelete] = useState<{ id: string; title: string } | null>(null);
    const [deleting, setDeleting] = useState<boolean>(false)

    // Fetch properties from API
    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            setLoading(true);
            const response = await PropertyService.getAllProperties();
            setProperties(response);
        } catch (err) {
            setError('Failed to fetch properties');
            console.error('Error fetching properties:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (property: PropertyType) => {
        setSelectedProperty(property);
        setEditModalOpen(true);
    };

    const handleAddClick = () => {
        setAddModalOpen(true);
    };

    const handleDeleteClick = (property: PropertyType) => {
        setPropertyToDelete({ id: property._id, title: property.title });
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!propertyToDelete) return;
        setDeleting(true)
        try {
            await PropertyService.deleteProperty(propertyToDelete.id);
            setDeleteModalOpen(false);
            setPropertyToDelete(null);
        } catch (err) {
            console.error('Error deleting property:', err);
        } finally{
            setDeleting(false)
        }
    };

    const handlePropertyUpdate = (updatedProperty: PropertyType) => {
        setProperties(properties.map(p =>
            p._id === updatedProperty._id ? updatedProperty : p
        ));
        setEditModalOpen(false);
        setSelectedProperty(null);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const getStatusColor = (status: string) => {
        return status === 'for-sale' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
    };

    const getStatusText = (status: string) => {
        return status === 'for-sale' ? 'For Sale' : 'For Rent';
    };

    if (loading) {
        return (
            <div className="min-h-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg m-4">
                {error}
            </div>
        );
    }

    return (
        <div className="px-4 max-w-7xl mx-auto">
            {/* Header with Add Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
                    <p className="text-gray-600 mt-1">
                        {properties.length} {properties.length === 1 ? 'property' : 'properties'} found
                    </p>
                </div>
                <button
                    onClick={handleAddClick}
                    className="inline-flex items-center px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-hover transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Property
                </button>
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {properties?.map((property) => (
                    <div
                        key={property._id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
                    >
                        {/* Thumbnail with Featured Badge */}
                        <div className="relative h-48">
                            <img
                                src={property?.thumbnail}
                                alt={property?.title}
                                className="w-full h-full object-cover"
                            />
                            {property.isFeatured && (
                                <div className="absolute top-3 right-3">
                                    <span className="px-2 py-1 bg-primary text-white text-xs font-semibold rounded">
                                        Featured
                                    </span>
                                </div>
                            )}
                            <div className="absolute top-3 left-3 flex gap-2">
                                <span className={`px-2 py-1 text-xs font-semibold rounded ${getStatusColor(property.status)}`}>
                                    {getStatusText(property.status)}
                                </span>
                            </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-2 flex-1 flex flex-col">
                            {/* Price */}
                            <div className="">
                                <span className="text-xl font-bold text-primary">
                                    {formatPrice(property.price)}
                                </span>
                            </div>

                            {/* Title */}
                            <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">
                                {property.title}
                            </h3>

                            {/* Location */}
                            <div className="flex items-center text-gray-600 mb-1">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm">
                                    {property.location.city}, {property.location.state}
                                </span>
                            </div>

                            {/* Property Type and Area */}
                            <div className="flex items-center gap-3 mb-1">
                                <span className="px-2 py-1 border border-gray-300 text-gray-700 text-xs rounded">
                                    {property.propertyType}
                                </span>
                                <div className="flex items-center text-gray-600">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-xs">{property.area} m²</span>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 text-sm mb-1 line-clamp-2 flex-1">
                                {property.description}
                            </p>

                            {/* Amenities */}
                            <div className="flex flex-wrap gap-1 mb-1">
                                {property.amenities.slice(0, 2).map((amenity, index) => (
                                    <span
                                        key={index}
                                        className="px-2 py-1 border border-gray-300 text-gray-700 text-xs rounded"
                                    >
                                        {amenity}
                                    </span>
                                ))}
                                {property.amenities.length > 2 && (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                        +{property.amenities.length - 2}
                                    </span>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-1 border-t border-gray-100">
                                <button
                                    onClick={() => handleEditClick(property)}
                                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(property)}
                                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {properties.length === 0 && (
                <div className="text-center py-12 px-4">
                    <div className="max-w-md mx-auto">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
                        <p className="text-gray-600 mb-6">
                            Get started by adding your first property
                        </p>
                        <button
                            onClick={handleAddClick}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Property
                        </button>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {selectedProperty && (
                <EditPropertyModal
                    open={editModalOpen}
                    property={selectedProperty}
                    onClose={() => {
                        setEditModalOpen(false);
                        setSelectedProperty(null);
                    }}
                    onUpdate={fetchProperties}
                />
            )}

            {/* Add Modal */}
            <AddPropertyModal
                open={addModalOpen}
                onClose={() => setAddModalOpen(false)}
                onAdd={fetchProperties}
            />

            {/* Delete Warning Modal */}
            <DeleteWarningModal
                open={deleteModalOpen}
                propertyTitle={propertyToDelete?.title || ''}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setPropertyToDelete(null);
                }}
                onConfirm={confirmDelete}
                loading={deleting}
            />
        </div>
    );
};

export default Properties;