import React from "react";
import { imageAssets } from "../../assets/imageAssets";
import { ArrowForward, Home, Shield, Verified } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Hero = () => {
    const navigate = useNavigate()
    return (
        <section className="relative overflow-hidden bg-linear-to-br from-orange-50 to-white py-10 md:py-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-4">
                        <div className="space-y-4">
                            <p className="text-lg md:text-xl text-gray-600">
                                Welcome to Seman Global Project Ltd.
                            </p>

                            <h1 className="text-6xl md:text-5xl lg:text-6xl font-bold text-gray-900">
                                You can own a Home{' '}
                                <span className="text-primary">with us</span>
                            </h1>

                            <p className="lg:text-xl text-gray-600 leading-relaxed">
                                We are a real estate company dedicated to providing affordable
                                housing options in Nigeria, and across Africa. As a real estate
                                developer, we specialize in designing homes to suit different
                                lifestyles and preferences.
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-row gap-4">
                            <button className="
                                border-2 border-primary text-primary
                                hover:bg-orange-50 transition-colors
                                px-6 py-3
                                text-base
                                md:text-lg
                                rounded-lg
                                flex items-center justify-center gap-2
                            ">
                                Learn More
                                <ArrowForward />
                            </button>

                            <a href="/projects" 
                                className="
                                    bg-primary hover:bg-primary transition-colors
                                    text-white
                                    px-6 py-3
                                    text-base
                                    md:text-lg
                                    rounded-lg
                                    flex items-center justify-center gap-2
                                " 
                                // onClick={() => navigate('/projects')}
                            >
                                Our Projects
                                <ArrowForward />
                            </a>
                        </div>

                        {/* Feature Icons */}
                        <div className="grid grid-cols-3 gap-4 pt-8">
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

                    {/* Image Section */}
                    <div className="relative">
                        <div className="relative bg-white rounded-2xl shadow-2xl p-2 transform -rotate-1 hover:rotate-0 transition-transform duration-300 overflow-hidden">
                            <img
                                src={imageAssets.img1}
                                alt="Luxury real estate property"
                                className="w-full h-auto rounded-xl object-cover"
                                loading="lazy"
                            />
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute -top-4 -right-4 h-24 w-24 bg-orange-200 rounded-full opacity-50"></div>
                        <div className="absolute -bottom-4 -left-4 h-32 w-32 bg-blue-200 rounded-full opacity-50"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;