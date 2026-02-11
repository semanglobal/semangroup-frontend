/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from "react-router-dom"
import {
    LocateIcon,
    Square,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Phone,
    Mail,
    MapPin,
    Navigation,
    ExternalLink,
    Loader2,
    Home,
    AlertCircle
} from 'lucide-react'
import { Link as LinkScroll } from 'react-scroll'
import { type PropertyType } from '../../../types/propertyType'
import { PropertyService } from '../../../services/propertyService'

// Define a default property structure to avoid undefined errors
const defaultProperty: any = {
    _id: '',
    title: '',
    slug: '',
    description: '',
    price: 0,
    area: 0,
    status: 'for-sale',
    thumbnail: '',
    images: [],
    amenities: [],
    location: {
        address: '',
        city: '',
        state: '',
        country: '',
        lat: 0,
        long: 0
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
}

const ProjectDetails = () => {
    const { slug } = useParams<{ slug: string }>()
    const navigate = useNavigate()
    const [property, setProperty] = useState<PropertyType>(defaultProperty)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isMapLoaded, setIsMapLoaded] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isInitialLoad, setIsInitialLoad] = useState(true)

    const fetchData = useCallback(async () => {
        if (!slug) {
            setError('Invalid property URL')
            setIsLoading(false)
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const res = await PropertyService.getPropertyBySlug(slug)
            if (!res) {
                throw new Error('Property not found')
            }
            setProperty(res)
        } catch (error: any) {
            console.error('Error fetching property:', error)
            setError(error.response.data.message || 'Failed to load property details')
        } finally {
            setIsLoading(false)
            setIsInitialLoad(false)
        }
    }, [slug])

    useEffect(() => {
        if (slug) {
            fetchData()
        }
    }, [slug, fetchData])

    // Format price to Naira with commas
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            maximumFractionDigits: 0
        }).format(price)
    }

    // Format date
    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        } catch (error) {
            return 'Invalid date'
        }
    }

    // Navigation for image gallery
    const nextImage = () => {
        if (property.images?.length > 0) {
            setCurrentImageIndex((prev) =>
                prev === property.images.length - 1 ? 0 : prev + 1
            )
        }
    }

    const prevImage = () => {
        if (property.images?.length > 0) {
            setCurrentImageIndex((prev) =>
                prev === 0 ? property.images.length - 1 : prev - 1
            )
        }
    }

    // Parse description HTML safely
    const createDescription = () => {
        if (!property.description) {
            return { __html: '<p>No description available.</p>' }
        }

        // Basic sanitization - in production, use a proper sanitizer like DOMPurify
        const cleanDescription = property.description
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .trim()

        return { __html: cleanDescription || '<p>No description available.</p>' }
    }

    // Get Google Maps directions URL
    const getDirectionsUrl = () => {
        const { lat, long, address } = property.location
        const encodedAddress = encodeURIComponent(address)
        return `https://www.google.com/maps/dir/?api=1&destination=${lat},${long}&destination_place=${encodedAddress}`
    }

    // Alternative: Simple maps embed URL (no API key required)
    const getSimpleMapsUrl = () => {
        const { lat, long } = property.location
        // Add fallback coordinates if invalid
        const safeLat = lat || 6.5244
        const safeLong = long || 3.3792 // Default to Lagos coordinates
        return `https://maps.google.com/maps?q=${safeLat},${safeLong}&z=15&output=embed`
    }

    const openGoogleMaps = () => {
        window.open(getDirectionsUrl(), '_blank', 'noopener,noreferrer')
    }

    const openWhatsApp = () => {
        const message = encodeURIComponent(
            `Hello, I'm interested in ${property.title || 'this property'} at ${property.location?.address || 'this location'}. Can you provide more information?`
        )
        window.open(`https://wa.me/2348184368514?text=${message}`, '_blank', 'noopener,noreferrer')
    }

    const handleBackToHome = () => {
        navigate('/')
    }

    const handleRetry = () => {
        fetchData()
    }

    // Loading state with better UI
    if (isInitialLoad && isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto"></div>
                        <Home className="w-8 h-8 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Property Details</h2>
                        <p className="text-gray-600">Please wait while we fetch the property information...</p>
                    </div>
                </div>
            </div>
        )
    }

    // Error state
    if (error && !isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="bg-red-50 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto">
                        <AlertCircle className="w-10 h-10 text-red-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Property</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={handleRetry}
                            className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={handleBackToHome}
                            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // Main content with conditional rendering for empty states
    const hasImages = property.images && property.images.length > 0
    const hasAmenities = property.amenities && property.amenities.length > 0
    const hasLocation = property.location && property.location.address

    return (
        <div className='min-h-screen bg-gray-50'>
            {/* Header - with fallback background */}
            <div
                className="w-full h-[70vh] relative flex items-center justify-center"
                style={{
                    background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${property.thumbnail || '/default-property.jpg'})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                {isLoading ? (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                ) : (
                    <div className="w-full max-w-4xl px-4">
                        <div className="rounded-xl bg-black/60 backdrop-blur-sm p-8 flex flex-col items-center justify-center text-white gap-4">
                            <h1 className="font-bold text-4xl md:text-5xl text-center mb-2">
                                {property.title || 'Property Details'}
                            </h1>
                            <p className="text-xl text-gray-200 text-center">
                                Luxury Living at Its Finest
                            </p>
                            {hasLocation && (
                                <p className='flex items-center gap-2 text-lg'>
                                    <LocateIcon className="w-5 h-5" />
                                    {property.location.address}, {property.location.city}
                                </p>
                            )}
                            <div className="mt-4">
                                <LinkScroll
                                    to='reachOut'
                                    className="cursor-pointer px-10 py-3 rounded-lg bg-primary hover:bg-primary/90 transition-colors text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    smooth={true}
                                    offset={-60}
                                    duration={600}
                                >
                                    Enquire Now
                                </LinkScroll>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className='py-12 max-w-360 mx-auto'>
                {isLoading ? (
                    // Skeleton loader for content
                    <div className="space-y-12">
                        {/* Property Overview Skeleton */}
                        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12'>
                            <div className='lg:col-span-2 space-y-4'>
                                <div className='rounded-xl bg-gray-200 h-125 animate-pulse'></div>
                                <div className='flex gap-2'>
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className='w-24 h-24 rounded-lg bg-gray-200 animate-pulse'></div>
                                    ))}
                                </div>
                            </div>
                            <div className='space-y-6'>
                                <div className='bg-white rounded-xl shadow-lg p-6 space-y-4'>
                                    <div className='h-8 bg-gray-200 rounded animate-pulse'></div>
                                    <div className='space-y-3'>
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className='h-4 bg-gray-200 rounded animate-pulse'></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Property Overview */}
                        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12'>
                            {/* Left Column - Gallery */}
                            <div className='lg:col-span-2'>
                                {/* Main Image */}
                                <div className='relative rounded-xl overflow-hidden shadow-lg mb-4'>
                                    <img
                                        src={hasImages ? property.images[currentImageIndex] : property.thumbnail || '/default-property.jpg'}
                                        alt={property.title}
                                        className="w-full h-125 object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = '/default-property.jpg'
                                        }}
                                    />

                                    {/* Navigation Arrows */}
                                    {hasImages && property.images.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevImage}
                                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={property.images.length <= 1}
                                            >
                                                <ChevronLeft className="w-6 h-6" />
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={property.images.length <= 1}
                                            >
                                                <ChevronRight className="w-6 h-6" />
                                            </button>
                                        </>
                                    )}

                                    {/* Image Counter */}
                                    {hasImages && property.images.length > 1 && (
                                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                                            {currentImageIndex + 1} / {property.images.length}
                                        </div>
                                    )}
                                </div>

                                {/* Thumbnail Gallery */}
                                {hasImages && property.images.length > 1 && (
                                    <div className='flex gap-2 overflow-x-auto pb-4'>
                                        {property.images.map((img, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentImageIndex(index)}
                                                className={`shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${currentImageIndex === index ? 'border-primary' : 'border-transparent'
                                                    }`}
                                            >
                                                <img
                                                    src={img}
                                                    alt={`${property.title} ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.src = '/default-property.jpg'
                                                    }}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Right Column - Details */}
                            <div className='space-y-6'>
                                {/* Price Card */}
                                <div className='bg-white rounded-xl shadow-lg p-6'>
                                    <div className='flex items-center justify-between mb-4'>
                                        <h3 className='text-2xl font-bold text-gray-900'>
                                            {formatPrice(property.price)}
                                        </h3>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${property.status === 'for-sale'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {property.status === 'for-sale' ? 'For Sale' : 'For Rent'}
                                        </span>
                                    </div>

                                    <div className='space-y-3'>
                                        <div className='flex items-center gap-3 text-gray-600'>
                                            <Square className='w-5 h-5 text-primary' />
                                            <span>{property.area} sq. ft.</span>
                                        </div>
                                        {hasLocation && (
                                            <div className='flex items-center gap-3 text-gray-600'>
                                                <LocateIcon className='w-5 h-5 text-primary' />
                                                <span>{property.location.city}, {property.location.state}</span>
                                            </div>
                                        )}
                                        <div className='flex items-center gap-3 text-gray-600'>
                                            <Calendar className='w-5 h-5 text-primary' />
                                            <span>Listed {formatDate(property.createdAt)}</span>
                                        </div>
                                    </div>

                                    <button className='w-full mt-6 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors'>
                                        Schedule Viewing
                                    </button>
                                </div>

                                {/* Amenities */}
                                {hasAmenities && (
                                    <div className='bg-white rounded-xl shadow-lg p-6'>
                                        <h3 className='text-xl font-bold text-gray-900 mb-4'>Amenities</h3>
                                        <div className='grid grid-cols-2 gap-3'>
                                            {property.amenities.map((amenity, index) => (
                                                <div key={index} className='flex items-center gap-2 text-gray-600'>
                                                    <div className='w-2 h-2 bg-primary rounded-full'></div>
                                                    <span>{amenity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className='bg-white rounded-xl shadow-lg p-8 mb-12'>
                            <h2 className='text-2xl font-bold text-gray-900 mb-6'>Property Description</h2>
                            <div
                                className='prose prose-lg max-w-none text-gray-600'
                                dangerouslySetInnerHTML={createDescription()}
                            />
                        </div>

                        {/* Location Details with Google Maps Iframe */}
                        {hasLocation && (
                            <div className='bg-white rounded-xl shadow-lg overflow-hidden mb-12'>
                                <div className='p-8'>
                                    <h2 className='text-2xl font-bold text-gray-900 mb-6'>Location Details</h2>
                                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                                        <div className='lg:col-span-1 space-y-6'>
                                            <div>
                                                <h3 className='font-semibold text-gray-700 mb-3 flex items-center gap-2'>
                                                    <MapPin className='w-5 h-5 text-primary' />
                                                    Address
                                                </h3>
                                                <p className='text-gray-900 text-lg'>{property.location.address}</p>
                                            </div>

                                            <div className='space-y-4'>
                                                <div>
                                                    <h4 className='font-medium text-gray-700 mb-1'>City/State</h4>
                                                    <p className='text-gray-900'>{property.location.city}, {property.location.state}</p>
                                                </div>
                                                <div>
                                                    <h4 className='font-medium text-gray-700 mb-1'>Country</h4>
                                                    <p className='text-gray-900'>{property.location.country}</p>
                                                </div>
                                                <div>
                                                    <h4 className='font-medium text-gray-700 mb-1'>Coordinates</h4>
                                                    <p className='text-gray-900 font-mono text-sm'>
                                                        Lat: {property.location.lat.toFixed(6)},
                                                        Lng: {property.location.long.toFixed(6)}
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={openGoogleMaps}
                                                className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
                                            >
                                                <Navigation className="w-5 h-5" />
                                                Get Directions
                                            </button>
                                        </div>

                                        {/* Google Maps Iframe - No API Key Required */}
                                        <div className='lg:col-span-2 h-100 rounded-lg overflow-hidden border border-gray-200 relative'>
                                            {/* Loading Overlay */}
                                            {!isMapLoaded && (
                                                <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-gray-100 z-10 flex items-center justify-center">
                                                    <div className="text-center">
                                                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                                        <p className="text-gray-600 font-medium">Loading map...</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Google Maps Iframe */}
                                            <iframe
                                                title={`${property.title} Location`}
                                                src={getSimpleMapsUrl()}
                                                width="100%"
                                                height="100%"
                                                style={{ border: 0 }}
                                                allowFullScreen={false}
                                                loading="lazy"
                                                referrerPolicy="no-referrer-when-downgrade"
                                                className="transition-opacity duration-300"
                                                onLoad={() => setIsMapLoaded(true)}
                                                onError={() => {
                                                    setIsMapLoaded(true)
                                                    console.error('Failed to load Google Maps')
                                                }}
                                            />

                                            {/* Map Controls */}
                                            <div className="absolute bottom-4 right-4 flex space-x-3">
                                                <button
                                                    onClick={openGoogleMaps}
                                                    className="p-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
                                                >
                                                    <ExternalLink className="w-5 h-5 text-gray-700 group-hover:text-primary transition-colors" />
                                                </button>
                                            </div>

                                            {/* Floating Marker */}
                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20"></div>
                                                    <div className="relative w-10 h-10 bg-linear-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
                                                        <MapPin className="w-5 h-5 text-white" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* CTA Section */}
                        <div id="reachOut" className='bg-primary/5 rounded-2xl p-8 md:p-12 text-center mb-12'>
                            <h2 className='text-3xl font-bold text-gray-900 mb-4'>Interested in this Property?</h2>
                            <p className='text-gray-600 mb-8 max-w-2xl mx-auto text-lg'>
                                Contact us today to schedule a viewing or get more information about this exclusive property.
                            </p>
                            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                                <button
                                    onClick={openWhatsApp}
                                    className='inline-flex items-center justify-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors'
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.507 14.307l-.009.075c-.208-1.148-1.16-1.363-2.294-1.198-1.027.145-1.413.75-2.096.75-.673 0-1.248-.5-2.04-.5-.792 0-1.456.5-2.04.5v2c1.479 0 2.653-1.5 3.5-1.5.846 0 2.02 1.5 3.5 1.5 1.482 0 2.657-1.5 3.5-1.5.843 0 2.018 1.5 3.5 1.5v-2c-.693 0-1.267-.5-2.04-.5-.773 0-1.348.5-2.04.5zM12 2C6.486 2 2 6.486 2 12c0 5.515 4.486 10 10 10s10-4.485 10-10c0-5.514-4.486-10-10-10zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                                    </svg>
                                    WhatsApp Inquiry
                                </button>
                                <a href='tel:+2348184368514' className='inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors'>
                                    <Phone className='w-5 h-5' />
                                    Call Agent
                                </a>
                                <a href='/contacts' className='inline-flex items-center justify-center gap-2 px-8 py-3 bg-white hover:bg-gray-50 text-primary border-2 border-primary font-medium rounded-lg transition-colors'>
                                    <Mail className='w-5 h-5' />
                                    Email Inquiry
                                </a>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default ProjectDetails