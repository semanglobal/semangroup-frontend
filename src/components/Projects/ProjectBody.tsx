import React from 'react'
import { imageAssets } from '../../assets/imageAssets';
import { useNavigate } from 'react-router-dom';

const ProjectBody = () => {
    const navigate = useNavigate()
    const projects = [
        {
            id: 1,
            title: "Peace Estate, Ibeju-Lekki Lagos",
            description: "Description for Project 1",
            slug: "project-1",
            image: imageAssets.img2
        },
        {
            id: 2,
            title: "Vileria Estate, Odogunya Ikorodu Lagos",
            description: "Description for Project 2",
            slug: "project-2",
            image: imageAssets.img1
        },
        {
            id: 3,
            title: "Sunrise Estate, Epe Lagos",
            description: "Description for Project 3",
            slug: "project-3",
            image: imageAssets.img3
        },
        {
            id: 4,
            title: "Harmony Estate, Ajah Lagos",
            description: "Description for Project 4",
            slug: "project-4",
            image: imageAssets.img2
        },
    ];

    return (
        <div className='py-16 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-360 mx-auto space-y-20'>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="group relative w-full h-137.5 overflow-hidden border hover:shadow-lg transition"
                        >
                            {/* Background Image */}
                            <div
                                className="absolute inset-0 bg-center bg-cover transform transition-transform duration-700 ease-out group-hover:scale-110"
                                style={{ backgroundImage: `url(${project.image})` }}
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
