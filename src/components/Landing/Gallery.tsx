import React from 'react'
import { bgPatterns, imageAssets } from '../../assets/imageAssets'
import { useNavigate } from 'react-router-dom'
import { ArrowForward } from '@mui/icons-material';

const Gallery = () => {
    const navigate = useNavigate();

    const projects = [
        { name: 'Vin Max Estate', address: 'Okota Ikorodu', image: imageAssets.se1, link: '/project/vin-max-estate' },
        { name: 'Kent Cone Estate', address: 'Okota, Ikorodu', image: imageAssets.se2, link: '/project/kent-cone-estate' },
        { name: 'Lim Van Estate', address: 'Agbara, Ikorodu', image: imageAssets.se3, link: '/project/lim-van-estate' },
        // { name: 'Rock Lime Estate', address: 'Agbowa, Ikorodu', image: imageAssets.img1, link: '/project' },
    ]

    const handleProjectClick = (link: string) => {
        navigate(link);
    }

    return (
        <div className='py-16 sm:py-16 px-4 sm:px-6 lg:px-8' 
             style={{ backgroundImage: `url(${bgPatterns.bg_pattern_6})`, backgroundSize: 'cover' }}>
            <div className='max-w-360 mx-auto'>
                {/* Header Section */}
                <div className="flex flex-col md:flex-row gap-6 md:gap-4 justify-between items-start md:items-center">
                    <div className="w-full md:w-auto">
                        <div className="flex flex-wrap gap-2 items-center">
                            <p className="text-sm sm:text-base">PROJECT GALLERY</p>
                            <div className="flex gap-1">
                                <span className='w-6 sm:w-10 h-1 rounded-full bg-primary'></span>
                                <span className='w-1.5 h-1 rounded-full bg-primary'></span>
                                <span className='w-1 h-1 rounded-full bg-primary'></span>
                                <span className='w-1 h-1 rounded-full bg-primary'></span>
                            </div>
                        </div>
                        <p className="font-semibold text-3xl sm:text-4xl lg:text-5xl mt-2">
                            Our Projects
                        </p>
                    </div>

                    <button 
                        onClick={() => navigate('/projects')}
                        className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-10 lg:px-16 py-3 sm:py-3.5 lg:h-14 bg-primary hover:bg-black transition-colors duration-500 cursor-pointer rounded-xl"
                    >
                        <p className='text-white text-base sm:text-lg lg:text-xl'>View All</p>
                        <ArrowForward className='text-white text-xl' />
                    </button>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 sm:gap-20 lg:gap-6 mt-12 lg:mt-16">
                    {projects.map((project, index) => (
                        <div key={index} className="relative group">
                            {/* Image Container */}
                            <div
                                className="h-80 sm:h-96 lg:h-97.5 w-full overflow-hidden rounded-2xl relative cursor-pointer"
                                onClick={() => handleProjectClick(project.link)}
                            >
                                {/* Background Image with Zoom Effect */}
                                <div 
                                    className="absolute inset-0 bg-center bg-cover transform transition-transform duration-700 ease-out group-hover:scale-110 h-full w-full" 
                                    style={{ backgroundImage: `url(${project.image})` }}
                                ></div>
                                
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
                                
                                {/* Project Info on Image (for medium screens and up) */}
                                <div className="absolute bottom-6 left-6 right-6 hidden sm:block text-white z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <p className="text-sm opacity-90">{project.address}</p>
                                    <h3 className="font-bold text-lg sm:text-xl line-clamp-1">{project.name}</h3>
                                </div>
                            </div>

                            {/* Project Info Card (for mobile) */}
                            <div className="sm:hidden absolute -bottom-10 left-4 right-4 bg-white rounded-2xl px-6 py-5 h-auto shadow-lg z-20">
                                <p className="text-sm text-gray-600">{project.address}</p>
                                <span 
                                    className='font-bold text-base cursor-pointer hover:text-primary transition-colors duration-400 block line-clamp-1'
                                    onClick={() => handleProjectClick(project.link)}
                                >
                                    {project.name}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Gallery