/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'

const StatsCounter = () => {
    const [countedStats, setCountedStats] = useState({
        properties: 0,
        years: 0,
        satisfaction: 0,
        projects: 0
    })

    const statsRef = useRef(null)
    const [hasAnimated, setHasAnimated] = useState(false)

    const stats = {
        properties: 20000,
        years: 9,
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
        <section className='w-full bg-white my-10'>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    ref={statsRef}
                    className="bg-linear-to-r from-primary to-primary/90 rounded-2xl p-8 md:p-12 text-white"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold mb-2">
                                {countedStats.properties?.toLocaleString()}+
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

export default StatsCounter