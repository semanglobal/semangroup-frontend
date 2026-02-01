import React, { useEffect, useRef, useState } from 'react'
import { Home, ShieldCheck, TrendingUp, CheckCircle } from 'lucide-react'

const Benefits = () => {
    const [countedStats, setCountedStats] = useState({
        properties: 0,
        years: 0,
        satisfaction: 0,
        projects: 0
    })
    
    const statsRef = useRef(null)
    const [hasAnimated, setHasAnimated] = useState(false)

    const benefits = [
        {
            icon: <Home className="w-6 h-6" />,
            title: "Premium Properties",
            description: "Modern designs with premium finishes and energy-efficient features for comfortable living.",
            features: ["Modern design", "Energy efficient", "Spacious layouts"]
        },
        {
            icon: <ShieldCheck className="w-6 h-6" />,
            title: "Secure Investment",
            description: "Full legal documentation and title assurance for complete investment security.",
            features: ["Legal documentation", "Title assurance", "Secure investment"]
        },
        {
            icon: <TrendingUp className="w-6 h-6" />,
            title: "Value Growth",
            description: "Prime locations ensuring steady property value appreciation and high ROI.",
            features: ["Prime locations", "High ROI", "Steady growth"]
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
                    
                    // Animate each counter
                    const duration = 2000 // 2 seconds
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
                            
                            setCountedStats(prev => ({
                                ...prev,
                                [key]: Math.floor(current)
                            }))
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

    return (
        <section className='w-full bg-gradient-to-b from-white to-orange-50 py-16 md:py-24'>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className='text-center mb-12 md:mb-16'>
                    <p className="text-lg md:text-xl text-primary font-medium mb-2">Why Choose Us</p>
                    {/* <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Benefits with <span className="text-primary">Olamide Real Estate</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Smart investments and quality living experiences that grow with you.
                    </p> */}
                </div>

                {/* Benefits Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-12 md:mb-16">
                    {benefits.map((benefit, index) => (
                        <div 
                            key={index}
                            className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
                        >
                            <div className="mb-6">
                                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                                    <div className="text-primary">
                                        {benefit.icon}
                                    </div>
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-600 mb-6 text-sm md:text-base">
                                    {benefit.description}
                                </p>
                                <div className="space-y-2">
                                    {benefit.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0" />
                                            <span className="text-gray-700 text-sm md:text-base">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats Section with Counter */}
                <div 
                    ref={statsRef}
                    className="bg-gradient-to-r from-primary to-primary rounded-2xl p-8 md:p-12 text-white"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold mb-2">
                                {countedStats.properties}+
                            </div>
                            <div className="text-orange-100 text-sm md:text-base">Properties Sold</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold mb-2">
                                {countedStats.years}+
                            </div>
                            <div className="text-orange-100 text-sm md:text-base">Years Experience</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold mb-2">
                                {countedStats.satisfaction}%
                            </div>
                            <div className="text-orange-100 text-sm md:text-base">Client Satisfaction</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold mb-2">
                                {countedStats.projects}+
                            </div>
                            <div className="text-orange-100 text-sm md:text-base">Active Projects</div>
                        </div>
                    </div>
                    
                    {/* Supporting text */}
                    <div className="text-center mt-8 pt-6 border-t border-primary/30">
                        <p className="text-orange-100 text-sm md:text-base">
                            Trusted by homeowners and investors across Nigeria
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Benefits