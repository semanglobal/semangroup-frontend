import React from 'react'
import { Box, Target, Eye, Heart, Shield, Users, Award, TrendingUp } from 'lucide-react';

const MissionVision = () => {
    const values = [
        {
            title: "Mission",
            description: "To build quality affordable spaces that serve people, strengthen communities, and scale across Nigeria and Africa.",
            icon: Target,
            color: "bg-blue-600"
        },
        {
            title: "Vision",
            description: "To lead the transformation of Nigeria's and Africa's real estate landscape by shaping accessible, well-built, and enduring developments that balance quality, affordability, and long-term value.",
            icon: Eye,
            color: "bg-purple-600"
        },
        {
            title: "Core Values",
            description: "",
            icon: Heart,
            color: "bg-primary",
            isValuesList: true
        }
    ];

    const coreValuesList = [
        {
            title: "Quality That Endures",
            description: "We build with care, precision, and standards that stand the test of time.",
            icon: Award,
            color: "bg-emerald-600"
        },
        {
            title: "Integrity Always",
            description: "We act honestly, keep our word, and do what is right even when no one is watching.",
            icon: Shield,
            color: "bg-blue-600"
        },
        {
            title: "People First",
            description: "We listen, collaborate, and design solutions that truly serve clients, users, and communities.",
            icon: Users,
            color: "bg-orange-600"
        },
        {
            title: "Technical Excellence",
            description: "Our work is driven by competence, discipline, and well structured processes from start to finish.",
            icon: Box,
            color: "bg-indigo-600"
        },
        {
            title: "Responsible Growth",
            description: "We scale with purpose, balancing affordability, sustainability, and long-term value.",
            icon: TrendingUp,
            color: "bg-green-600"
        }
    ];

    return (
        <div className="w-full bg-linear-to-b from-gray-50 to-white py-20 px-4 md:px-16 lg:px-24">
            <div className='max-w-360 mx-auto'>
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                            Our Purpose
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
                            Mission & Vision
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Guided by purpose and driven by excellence
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {values.slice(0, 2).map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <div
                                    key={index}
                                    className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                                >
                                    {/* Decorative accent */}
                                    <div className={`absolute top-0 left-0 w-2 h-full ${value.color} group-hover:w-3 transition-all duration-300`}></div>

                                    <div className="p-8 pl-10">
                                        <div className="flex items-start gap-6">
                                            <div className={`${value.color} p-4 rounded-2xl shadow-lg`}>
                                                <Icon className="w-8 h-8 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                                    {value.title}
                                                </h3>
                                                <p className="text-gray-600 leading-relaxed text-base">
                                                    {value.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mb-12">
                    <div className="text-center mb-12">
                        <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                            The Seman Way
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
                            Our Core Values
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Five principles that define who we are and how we work
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {coreValuesList.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <div
                                    key={index}
                                    className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-yellow-200 overflow-hidden"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className={`${value.color} p-3 rounded-lg shadow-md group-hover:scale-110 transition-transform duration-300`}>
                                                <Icon className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-900 mb-2 text-lg">
                                                    {value.title}
                                                </h4>
                                                <p className="text-gray-600 text-sm leading-relaxed">
                                                    {value.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MissionVision