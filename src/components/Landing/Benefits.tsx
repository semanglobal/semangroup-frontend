/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react'
import { Home, ShieldCheck, TrendingUp, ChevronDown, CheckCircle } from 'lucide-react'
import { imageAssets } from '../../assets/imageAssets'

const Benefits = () => {
    const [activeAccordion, setActiveAccordion] = useState(null)

    const statsRef = useRef(null)
    const [hasAnimated, setHasAnimated] = useState(false)

    const benefits = [
        {
            icon: <Home className="w-5 h-5" />,
            title: "Premium Properties",
            description: "Modern designs with premium finishes and energy-efficient features for comfortable living.",
            features: ["Modern design", "Energy efficient", "Spacious layouts"],
            stats: "500+ Properties"
        },
        {
            icon: <ShieldCheck className="w-5 h-5" />,
            title: "Secure Investment",
            description: "Full legal documentation and title assurance for complete investment security.",
            features: ["Legal documentation", "Title assurance", "Secure investment"],
            stats: "100% Legal Compliance"
        },
        {
            icon: <TrendingUp className="w-5 h-5" />,
            title: "Value Growth",
            description: "Prime locations ensuring steady property value appreciation and high ROI.",
            features: ["Prime locations", "High ROI", "Steady growth"],
            stats: "15-20% Annual Growth"
        }
    ]

    const stats = {
        properties: 500,
        years: 15,
        satisfaction: 98,
        projects: 25
    }

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated) {
                    setHasAnimated(true)

                    const duration = 2000
                    const steps = 60
                    const stepDuration = duration / steps

                    Object.keys(stats).forEach((key) => {
                        const target = stats[key as keyof typeof stats]
                        let current = 0
                        const increment = target / steps

                        const timer = setInterval(() => {
                            current += increment
                            if (current >= target) {
                                current = target
                                clearInterval(timer)
                            }
                        }, stepDuration)
                    })
                }
            },
            { threshold: 0.5 }
        )

        if (statsRef.current) {
            observer.observe(statsRef.current)
        }

        return () => {
            if (statsRef.current) {
                observer.unobserve(statsRef.current)
            }
        }
    }, [hasAnimated])

    const toggleAccordion = (index: any) => {
        setActiveAccordion(activeAccordion === index ? null : index)
    }

    return (
        <section className='w-full bg-primary py-16 md:py-24'>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className='text-center mb-12 md:mb-16'>
                    <p className="text-lg md:text-xl text-primary font-medium mb-2">Why Choose Us</p>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white max-w-3xl mx-auto">
                        We Provide the Best Value for Your Investment
                    </h2>
                </div>

                {/* Main Content - Image Left, Accordion Right */}
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start mb-16">
                    {/* Left Image */}
                    <div className="relative rounded-2xl overflow-hidden h-125 lg:h-150">
                        <img
                            src={imageAssets.se3}
                            alt="Luxury modern apartment building with swimming pool"
                            className="w-full h-full object-cover"
                        />
                        {/* Overlay with stats */}
                        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-6">
                            <div className="text-white">
                                <div className="text-2xl font-bold">15+ Years</div>
                                <p className="text-sm text-gray-200">Of Excellence in Real Estate</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Accordion Content */}
                    <div className="space-y-4">
                        {benefits.map((benefit, index) => (
                            <div
                                key={index}
                                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-primary transition-colors duration-300"
                            >
                                {/* Accordion Header */}
                                <button
                                    onClick={() => toggleAccordion(index)}
                                    className="w-full px-6 py-5 flex items-center justify-between bg-white hover:bg-orange-50 transition-colors duration-300"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                            {benefit.icon}
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-lg md:text-xl font-bold text-gray-900">
                                                {benefit.title}
                                            </h3>
                                            <p className="text-sm text-primary font-medium">
                                                {benefit.stats}
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronDown
                                        className={`w-5 h-5 text-primary transition-transform duration-300 ${activeAccordion === index ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>

                                {/* Accordion Content */}
                                <div
                                    className={`overflow-hidden transition-all duration-300 ${activeAccordion === index ? 'max-h-96' : 'max-h-0'
                                        }`}
                                >
                                    <div className="px-6 pb-6 pt-2">
                                        <p className="text-gray-600 mb-4">
                                            {benefit.description}
                                        </p>
                                        <div className="space-y-2">
                                            {benefit.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                                    <span className="text-gray-700 text-sm">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Trust Badge */}
                        <div className="mt-6 bg-orange-50 rounded-xl p-4 flex items-center gap-3">
                            <ShieldCheck className="w-8 h-8 text-primary" />
                            <p className="text-sm text-gray-700">
                                <span className="font-semibold">Trusted by 500+ homeowners</span> across Nigeria with 100% satisfaction guarantee
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Benefits