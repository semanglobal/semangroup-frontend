import React from 'react'
import { bgPatterns, imageAssets } from '../../assets/imageAssets'
import { useNavigate } from 'react-router-dom'
import { ArrowForward } from '@mui/icons-material';

const Gallery = () => {
    const navigate = useNavigate();

    const projects = [
        { name: 'Vin Max Estate', address: 'Okota Ikorodu', image: imageAssets.img1, link: '/project' },
        { name: 'Kent Cone Estate', address: 'Okota, Ikorodu', image: imageAssets.img2, link: '/project' },
        { name: 'Lim Van Estate', address: 'Agbara, Ikorodu', image: imageAssets.img3, link: '/project' },
        // { name: 'Rock Lime Estate, address: 'Agbowa', Ikorodu', image: imageAssets.img1, link: '/project' },
    ]

    return (
        <div className='py-28 px-4 sm:px-6 lg:px-8' style={{backgroundImage: `url(${bgPatterns.bg_pattern_6})`}}>
            <div className='max-w-360 mx-auto '>
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div>
                        <div className="flex gap-2 items-center">
                            <p>PROJECT GALLERY</p>
                            <div className="flex gap-1">
                                <span className='w-10 h-1 rounded-full bg-primary'></span>
                                <span className='w-1.5 h-1 rounded-full bg-primary'></span>
                                <span className='w-1 h-1 rounded-full bg-primary'></span>
                                <span className='w-1 h-1 rounded-full bg-primary'></span>
                            </div>
                        </div>
                        <p className="font-semibold text-5xl mt-2">Our Portfolio</p>
                    </div>

                    <a className="flex items-center gap-2 px-16 font-medium h-14 bg-primary hover:bg-black transition-colors duration-500 cursor-pointer" href='projects'>
                        <p className='text-white text-xl'>View All</p>
                        <ArrowForward className='text-white' />
                    </a>
                </div>

                <div className="flex flex-col lg:flex-row gap-20 justify-between lg:gap-6 mt-12">
                    {projects.map((project, index) => (
                        <div key={index} className="relative">
                            <div className="h-97.5 lg:min-w-90 md:w-95 overflow-hidden rounded-2xl relative cursor-pointer group transition" onClick={() => navigate(project.link)}>
                                <div className="absolute inset-0 bg-center bg-cover transform transition-transform duration-700 ease-out group-hover:scale-110 h-full w-full" style={{ backgroundImage: `url(${project.image})` }}></div>
                                {/* <img src={project.image} alt="" className='h-full w-full hover:scale-110 transition-all ease-in-out duration-600 z-20' /> */}

                                <div className="absolute inset-0 bg-linear-to-t from-black to-transparent opacity-80"></div>
                            </div>

                            <div className="absolute -bottom-10 left-4 right-4 bg-white rounded-2xl px-8 py-6 h-24 z-20 shadow-lg">
                                <p>{project.address}</p>
                                <span className='font-bold text-lg cursor-pointer hover:text-primary transition-colors duration-400'>{project.name}</span>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Gallery