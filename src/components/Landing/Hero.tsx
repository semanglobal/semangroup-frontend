/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { heroImg } from "../../assets/imageAssets";
import { ArrowForward, Home, Shield, Verified } from "@mui/icons-material";

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    
    const slides = [
        heroImg.se2,
        heroImg.slide1,
        heroImg.slide2,
        heroImg.slide3,
        heroImg.slide4
    ];

    // Auto-play functionality
    useEffect(() => {
        let interval: any;
        if (isAutoPlaying) {
            interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % slides.length);
            }, 3000); // Change slide every 5 seconds
        }
        return () => clearInterval(interval);
    }, [isAutoPlaying, slides.length]);

    // Pause auto-play on hover
    const pauseAutoPlay = () => setIsAutoPlaying(false);
    const resumeAutoPlay = () => setIsAutoPlaying(true);

    // Manual navigation
    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <section className="relative overflow-hidden bg-linear-to-br from-orange-50 to-white py-10 md:py-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="text-center lg:text-left">
                        <div className="space-y-1">
                            <p className="text-xs md:text-xl text-gray-600">
                                Welcome to Seman Global Project Ltd.
                            </p>

                            <h1 className="text-[12vw] md:text-5xl lg:text-6xl font-bold text-gray-900 leading-12 lg:leading-16">
                                You can own a Home{' '}
                                <span className="text-primary">with us</span>
                            </h1>

                            <p className="text-sm lg:text-xl text-gray-600 leading-relaxed">
                                We are a real estate company dedicated to providing affordable
                                housing options in Nigeria, and across Africa.
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col lg:flex-row gap-4 justify-center lg:justify-start mt-10">
                            <a href="/about-us" className="
                                border border-primary text-primary
                                hover:bg-orange-100 transition-colors
                                px-4 md:px-6 py-2 md:py-3
                                text-xs
                                md:text-lg
                                rounded-lg
                                shadow-md
                                flex items-center justify-center gap-2
                            ">
                                Learn More
                                <ArrowForward />
                            </a>

                            <a href="/projects" 
                                className="
                                    bg-primary hover:bg-orange-600 transition-colors
                                    text-white
                                    px-4 md:px-6 py-2 md:py-3
                                    text-xs
                                    md:text-lg
                                    rounded-lg
                                    flex items-center justify-center gap-2
                                    shadow-lg
                                " 
                            >
                                Our Projects
                                <ArrowForward />
                            </a>
                        </div>

                        {/* Feature Icons */}
                        <div className="lg:grid grid-cols-3 gap-4 pt-8 hidden">
                            <div className="flex flex-col md:flex-row items-center gap-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <Home className="text-primary" fontSize="medium" />
                                </div>
                                <span className="text-sm md:text-base font-medium text-gray-700">Modern Homes</span>
                            </div>
                            <div className="flex flex-col md:flex-row items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Shield className="text-green-600" fontSize="medium" />
                                </div>
                                <span className="text-sm md:text-base font-medium text-gray-700">Secure & Safe</span>
                            </div>
                            <div className="flex flex-col md:flex-row items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Verified className="text-blue-600" fontSize="medium" />
                                </div>
                                <span className="text-sm md:text-base text-center font-medium text-gray-700">Verified Properties</span>
                            </div>
                        </div>
                    </div>

                    {/* Image Slideshow Section */}
                    <div className="relative">
                        <div 
                            className="relative bg-white rounded-2xl shadow-2xl duration-300 overflow-hidden group"
                            onMouseEnter={pauseAutoPlay}
                            onMouseLeave={resumeAutoPlay}
                        >
                            {/* Slides Container */}
                            <div className="relative aspect-4/3">
                                {slides.map((slide, index) => (
                                    <img
                                        key={index}
                                        src={slide}
                                        alt={`Luxury real estate property ${index + 1}`}
                                        className={`absolute top-0 left-0 w-full h-full rounded-xl object-cover transition-opacity duration-1000 ease-in-out ${
                                            index === currentSlide ? 'opacity-100' : 'opacity-0'
                                        }`}
                                        loading="lazy"
                                    />
                                ))}
                            </div>

                            {/* Navigation Arrows - Visible on hover */}
                            <button
                                onClick={prevSlide}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                aria-label="Previous slide"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                aria-label="Next slide"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>

                            {/* Slide Indicators */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {slides.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToSlide(index)}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                            index === currentSlide 
                                                ? 'w-8 bg-primary' 
                                                : 'bg-white/50 hover:bg-white/80'
                                        }`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>

                            {/* Slide Counter */}
                            <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                                {currentSlide + 1} / {slides.length}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;