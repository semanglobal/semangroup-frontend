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
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        setLoading(true)
        try {
            const res = await PropertyService.getAllProperties()
            setProjects(res)
            setError('No Project Found')
        } catch (error: any) {
            console.log(error)
            setError(error.response.data.message || 'Failed to load property details')
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
                            <div className="absolute inset-0 bg-linear-to-t from-black to-transparent opacity-80" />

                            {/* Content */}
                            <div className="absolute bottom-16 left-10 z-10">
                                <h2 className="text-3xl font-bold mb-4 text-white">
                                    {project.title}
                                </h2>

                                <button className="py-2 px-6 bg-primary hover:bg-primary rounded-md text-sm font-medium text-white"
                                    onClick={() => window.location.href = `/project/${project.slug}`}
                                // onClick={() => navigate(`/project/${project.slug}`, { state: project })}
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
