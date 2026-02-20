/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { imageAssets } from '../../assets/imageAssets';
import { useNavigate } from 'react-router-dom';
import { PropertyService } from '../../services/propertyService';
import { type PropertyType } from '../../types/propertyType';
import { AlertCircle, Home } from 'lucide-react';

const ProjectBody = () => {
    const navigate = useNavigate()
    // const projects = [
    //     {
    //         id: 1,
    //         title: "Peace Estate, Ibeju-Lekki Lagos",
    //         description: "Description for Project 1",
    //         slug: "project-1",
    //         image: imageAssets.img2
    //     },
    //     {
    //         id: 2,
    //         title: "Vileria Estate, Odogunya Ikorodu Lagos",
    //         description: "Description for Project 2",
    //         slug: "project-2",
    //         image: imageAssets.img1
    //     },
    //     {
    //         id: 3,
    //         title: "Sunrise Estate, Epe Lagos",
    //         description: "Description for Project 3",
    //         slug: "project-3",
    //         image: imageAssets.img3
    //     },
    //     {
    //         id: 4,
    //         title: "Harmony Estate, Ajah Lagos",
    //         description: "Description for Project 4",
    //         slug: "project-4",
    //         image: imageAssets.img2
    //     },
    // ];
    const [projects, setProjects] = useState<PropertyType[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<boolean | null>(null)

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        setLoading(true)
        try {
            const res = await PropertyService.getAllProperties()
            setProjects(res)
        } catch (error: any) {
            console.log(error)
            setError(true)
            // setError(error.response.data.message || 'Failed to load property details')
            setProjects([])
        } finally {
            setLoading(false)
        }
    }

    const handleBackToHome = () => {
        navigate('/')
    }

    const handleRetry = () => {
        fetchProjects()
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    if (loading && projects.length === 0) {
        return (
            <div className="min-h-[58dvh] flex flex-col items-center justify-center bg-gray-50 p-4">
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

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="bg-red-50 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto">
                        <AlertCircle className="w-10 h-10 text-red-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">No property found</h2>
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

    return (
        <div className='py-16 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-360 mx-auto space-y-20'>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {projects.map((project) => (
                        <div
                            key={project._id}
                            className="group relative w-full h-137.5 overflow-hidden border hover:shadow-lg transition"
                        >
                            {/* Background Image */}
                            <div
                                className="absolute inset-0 bg-center bg-cover transform transition-transform duration-700 ease-out group-hover:scale-110"
                                style={{ backgroundImage: `url(${project.thumbnail})` }}
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-linear-to-t from-black to-transparent opacity-100" />

                            {/* Content */}
                            <div className="absolute bottom-16 left-10 z-10">
                                <span className="text-xl font-bold text-primary bg-white px-2 py-1 rounded">
                                    {formatPrice(project.price)}
                                </span>
                                <h2 className="text-3xl font-bold mb-1 text-white">
                                    {project.title}
                                </h2>

                                <div className='text-white mb-4'>
                                    <div className="flex items-center text-white mb-1">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm">
                                            {project.location.city}, {project.location.state}
                                        </span>

                                    </div>

                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="px-2 py-1 border border-gray-300 text-white text-xs rounded">
                                            {project.propertyType}
                                        </span>
                                        <div className="flex items-center text-white">
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-xs">{project.area} m²</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-1 mb-1">
                                        {project.amenities.slice(0, 2).map((amenity, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 border border-gray-300 text-white text-xs rounded"
                                            >
                                                {amenity}
                                            </span>
                                        ))}
                                        {project.amenities.length > 2 && (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                                +{project.amenities.length - 2}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <button className="py-2 px-6 bg-primary hover:bg-primary rounded-md text-sm font-medium text-white"
                                    onClick={() => window.location.href = `/project/${project.slug}`}
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ProjectBody
