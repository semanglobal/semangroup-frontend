/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { bgPatterns, imageAssets } from '../../assets/imageAssets'
import { useNavigate } from 'react-router-dom'
import { ArrowForward } from '@mui/icons-material';
import type { PropertyType } from '../../types/propertyType';
import { PropertyService } from '../../services/propertyService';

const Gallery = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<PropertyType[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    
    const handleProjectClick = (link: string) => {
        // onClick={() => window.location.href = `/project/${project.slug}`}
    }

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        setLoading(true)
        try {
            const res = await PropertyService.getAllProperties()
            const only3 = res.slice(0, 3)
            setProjects(res)
        } catch (error: any) {
            console.error(error)
            setError(error.response.data.message || 'Failed to load property details')
            setProjects([])
        } finally {
            setLoading(false)
        }
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const falbackProjects = [
        {
            "_id": "6993183d3925c807cb044d86",
            "title": "Seman Hilltop City, Asokoro",
            "description": "<p><strong>Seman Hilltop City, Asokoro Extension</strong> is a premium residential development strategically located after Promiseland Estate by A &amp; K Construction, offering an exceptional opportunity to own land in one of Abuja’s fastest-growing luxury corridors. Designed for comfort, prestige, and long-term value, this hilltop community combines serene living with proximity to the city’s most important destinations.</p><p>With <strong>FCDA approval</strong> and a limited-time <strong>50% mega discount</strong>, this is the perfect investment for homeowners, developers, and forward-thinking investors seeking secure, high-return real estate in Asokoro Extension.</p><h3>Available Plots &amp; Pricing</h3><ul><li><strong>200 SQM — ₦25M</strong></li><li> Ideal for a 3-bedroom luxury terrace with penthouse and attached BQ.</li><li><strong>300 SQM — ₦30M</strong></li><li> Perfect for a 3-bedroom luxury semi-detached duplex with pent floor and BQ.</li><li><strong>400 SQM — ₦35M</strong></li><li> Suitable for a spacious 4-bedroom luxury penthouse with attached BQ.</li><li><strong>500 SQM — ₦45M</strong></li><li> Designed for a 4-bedroom luxury duplex with detached BQ.</li><li><strong>600 SQM — ₦50M</strong></li><li> Excellent for a 4-bedroom luxury villa with pent floor and detached BQ.</li><li><strong>1000 SQM — ₦65M</strong></li><li> Ideal for a block of 6 units of 3-bedroom flats or large bespoke development.</li></ul><h3>Why Choose Seman Hilltop City?</h3><ul><li>Prime location in Asokoro Extension</li><li>Government-approved (FCDA) title</li><li>Flexible plot sizes for diverse building options</li><li>High appreciation potential</li><li>Secure, well-planned environment</li></ul><p><strong>Seman Hilltop City, Asokoro Extension</strong> is more than land — it is a gateway to elevated living and a smart investment in Abuja’s luxury real estate future.</p>",
            "price": 25000000,
            "location": {
                "lat": 0,
                "long": 0,
                "address": "Freedom Avenue",
                "city": "FCT Abuja",
                "state": "Abuja",
                "country": "Nigeria"
            },
            "propertyType": "land",
            "status": "for-sale",
            "area": 200,
            "thumbnail": "https://res.cloudinary.com/dnkz7r4xi/image/upload/v1771247676/seman/Screenshot%202026-02-16%20141349.png",
            "images": [],
            "amenities": [
                "24/7 Electricity",
                "Security",
                "Parking Space",
                "Air Conditioning",
                "Garden",
                "Balcony"
            ],
            "isFeatured": false,
            "createdAt": "2026-02-16T13:14:37.777Z",
            "updatedAt": "2026-02-16T13:14:37.777Z",
            "slug": "seman-hilltop-city-asokoro"
        },
        {
            "_id": "6992ede1f6470e4c10b89665",
            "title": "Seman Royal Residence, Kubwa",
            "description": "<p>Introducing <strong>Seman Royal Residence, Kubwa</strong>, an exceptional residential development crafted for discerning homeowners and investors seeking premium value in a fast-growing Abuja district. Strategically located at <strong>Gbasango, beside Zeberced Quarry, Kubwa</strong>, this estate offers the perfect balance of accessibility, serenity, and long-term appreciation potential within one of the capital’s most active residential corridors.</p><p>Launched under an exclusive <strong>Pre-Sale Offer with Mega Discount</strong>, Royal Residence presents a rare opportunity to secure prime land at highly competitive prices before full market appreciation. Whether you envision a stylish terrace home, a spacious detached residence, or a luxury family estate, this development provides tailored plot options to bring your dream to life.</p><h3>Available Plot Options &amp; Pre-Sale Prices</h3><ul><li><strong>180 SQM — 2 Bedroom Terrace Duplex</strong> → <strong>₦3 Million</strong></li><li><strong>200 SQM — 3 Bedroom Terrace Duplex</strong> → <strong>₦3.5 Million</strong></li><li><strong>250 SQM — 4 Bedroom Terrace Duplex</strong> → <strong>₦4 Million</strong></li><li><strong>300 SQM — 4 Bedroom Semi-Detached Duplex</strong> → <strong>₦8.5 Million</strong></li><li><strong>500 SQM — 4 Bedroom Fully Detached Duplex</strong> → <strong>₦12.5 Million</strong></li><li><strong>1000 SQM — 5 Bedroom Luxury Duplex</strong> → <strong>₦25 Million</strong></li></ul><h3>Why Choose Seman Royal Residence, Kubwa?</h3><ul><li><strong>FCDA-approved</strong> — secure and credible land title</li><li>Located in a rapidly developing and high-demand residential zone</li><li>Ideal for personal residence, upscale rental projects, or land banking</li><li>Pre-sale pricing designed for maximum return on investment</li><li>Developed by a trusted brand committed to affordable housing excellence</li></ul><p>Seman Royal Residence is more than an estate — it is a statement of class, security, and foresight. As Kubwa continues to expand as a major residential hub in Abuja, early investors stand to benefit from significant capital growth and increasing housing demand.</p><p><strong>Secure your place today in a development designed for comfort, prestige, and lasting value.</strong></p>",
            "price": 3000000,
            "location": {
                "lat": 0,
                "long": 0,
                "address": "GBASANGO, BESIDE ZEBERCED QUARRY, KUBWA",
                "city": "FCT Abuja",
                "state": "Abuja",
                "country": "Nigeria"
            },
            "propertyType": "land",
            "status": "for-sale",
            "area": 180,
            "thumbnail": "https://res.cloudinary.com/dnkz7r4xi/image/upload/v1771239126/seman/Screenshot%202026-02-16%20115122.png",
            "images": [
                "https://res.cloudinary.com/dnkz7r4xi/image/upload/v1771236829/seman/WhatsApp%20Image%202026-01-17%20at%204.jpg",
                "https://res.cloudinary.com/dnkz7r4xi/image/upload/v1771236831/seman/WhatsApp%20Image%202026-01-17%20at%204.jpg",
                "https://res.cloudinary.com/dnkz7r4xi/image/upload/v1771236832/seman/WhatsApp%20Image%202026-01-17%20at%204.jpg",
                "https://res.cloudinary.com/dnkz7r4xi/image/upload/v1771236831/seman/WhatsApp%20Image%202026-01-17%20at%204.jpg"
            ],
            "amenities": [
                "24/7 Electricity",
                "Security",
                "Parking Space",
                "Swimming Pool",
                "Air Conditioning",
                "Balcony",
                "Garden"
            ],
            "isFeatured": false,
            "createdAt": "2026-02-16T10:13:53.279Z",
            "updatedAt": "2026-02-16T10:52:07.580Z",
            "slug": "seman-royal-residence-kubwa"
        },
        {
            "_id": "6992e68cf6470e4c10b89629",
            "title": "Seman Verizon Signature, Kuje",
            "description": "<p><strong>Welcome to Seman Verizon Signature, Kuje, a premium residential estate strategically located at Kuje Bridge, just after the Military Checkpoint and sharing a boundary with Centenary City, Kuje, Abuja — one of the fastest-developing corridors in the Federal Capital Territory. This is a rare opportunity to secure genuine, well-documented land in a location positioned for rapid appreciation, infrastructure expansion, and high residential demand.</strong></p><p><strong>Whether you are building your dream home, developing rental properties, or investing for the future, Verizon Signature offers flexible plot options designed to match your vision and budget.</strong></p><h3><strong>Available Plot Options &amp; Prices</strong></h3><ul><li><strong>160 SQM — 2 Bedroom Terrace Duplex → ₦2.9 Million</strong></li><li><strong>250 SQM — 2 Bedroom Semi-Detached Duplex → ₦3.5 Million</strong></li><li><strong>260 SQM — 4 Bedroom Terrace Duplex → ₦3.7 Million</strong></li><li><strong>300 SQM — 3 Bedroom Semi-Detached Duplex → ₦4 Million</strong></li><li><strong>325 SQM — 4 Bedroom Semi-Detached Duplex → ₦4.2 Million</strong></li><li><strong>400 SQM — 3 Bedroom Bungalow → ₦5 Million</strong></li><li><strong>500 SQM — 4 Bedroom Detached Duplex with BQ → ₦5.7 Million</strong></li><li><strong>900 SQM — 2 Bedroom Block of Flats → ₦9 Million</strong></li><li><strong>1,140 SQM — 3 Bedroom Block of Flats → ₦11 Million</strong></li></ul><h3><strong>Why Invest in Verizon Signature, Kuje?</strong></h3><ul><li><strong>FCDA-approved title for peace of mind</strong></li><li><strong>Deed of Assignment — secure and verifiable ownership</strong></li><li><strong>Close proximity to Centenary City, a major economic hub in development</strong></li><li><strong>Ideal for personal residence, rental projects, or long-term land banking</strong></li><li><strong>Located within a rapidly urbanizing district of Abuja</strong></li></ul><p><strong>Seman Verizon Signature is not just land — it is a strategic investment into Abuja’s expanding future. With affordable pricing, flexible plot sizes, and credible documentation, this estate offers the perfect blend of accessibility, security, and high return potential.</strong></p><p><strong>Secure your plot today and be part of the next prime residential destination in Abuja.</strong></p>",
            "price": 2900000,
            "location": {
                "lat": 0,
                "long": 0,
                "address": "Kuje Bridge, after Military Checkpoint sharing boundary with Centenary City, Kuje, Abuja",
                "city": "FCT Abuja",
                "state": "Abuja",
                "country": "Nigeria"
            },
            "propertyType": "land",
            "status": "for-sale",
            "area": 160,
            "thumbnail": "https://res.cloudinary.com/dnkz7r4xi/image/upload/v1771238920/seman/IMG-20251128-WA0016.jpg",
            "images": [
                "https://res.cloudinary.com/dnkz7r4xi/image/upload/v1771234955/seman/WhatsApp%20Image%202026-02-12%20at%2011.jpg",
                "https://res.cloudinary.com/dnkz7r4xi/image/upload/v1771234954/seman/Seman%20Verizon%20Signature%20Kuje%20HM.png"
            ],
            "amenities": [
                "24/7 Electricity",
                "Security",
                "Parking Space",
                "Swimming Pool",
                "Garden",
                "Air Conditioning"
            ],
            "isFeatured": true,
            "createdAt": "2026-02-16T09:42:36.272Z",
            "updatedAt": "2026-02-16T10:48:41.378Z",
            "slug": "seman-verizon-signature-kuje"
        }
    ]

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-20 lg:gap-6 mt-12 lg:mt-16">
                    {projects.length > 0 ? projects.map((project, index) => (
                        <div key={index} className="relative group">
                            {/* Image Container */}
                            <div
                                className="h-100 lg:h-97.5 w-full overflow-hidden rounded-2xl relative cursor-pointer"
                                onClick={() => window.location.href = `/project/${project?.slug}`}
                            >
                                {/* Background Image with Zoom Effect */}
                                <div
                                    className="absolute inset-0 bg-center bg-cover transform transition-transform duration-700 ease-out group-hover:scale-110 h-full w-full"
                                    style={{ backgroundImage: `url(${project?.thumbnail})` }}
                                ></div>

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>

                                {/* Project Info on Image (for medium screens and up) */}
                                <div className="absolute bottom-6 left-6 right-6 block text-white z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <span className="text-xl font-bold text-primary bg-white px-2 py-1 rounded">
                                        {formatPrice(project?.price)}
                                    </span>
                                    <p className="text-sm opacity-90 mt-2">{project?.location.address}</p>
                                    <h3 className="font-bold text-lg sm:text-xl line-clamp-1">{project?.title}</h3>
                                </div>
                            </div>
                        </div>
                    )) : (
                        falbackProjects.map((project, index) => (
                            <div key={index} className="relative group">
                                {/* Image Container */}
                                <div
                                    className="h-80 sm:h-96 lg:h-97.5 w-full overflow-hidden rounded-2xl relative cursor-pointer"
                                    onClick={() => window.location.href = `/project/${project?.slug}`}
                                >
                                    {/* Background Image with Zoom Effect */}
                                    <div
                                        className="absolute inset-0 bg-center bg-cover transform transition-transform duration-700 ease-out group-hover:scale-110 h-full w-full"
                                        style={{ backgroundImage: `url(${project?.thumbnail})` }}
                                    ></div>

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>

                                    {/* Project Info on Image (for medium screens and up) */}
                                    <div className="absolute bottom-6 left-6 right-6 block text-white z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                        <span className="text-xl font-bold text-primary bg-white px-2 py-1 rounded">
                                            {formatPrice(project?.price)}
                                        </span>
                                        <p className="text-sm opacity-90 mt-2">{project?.location.address}</p>
                                        <h3 className="font-bold text-lg sm:text-xl line-clamp-1">{project?.title}</h3>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default Gallery