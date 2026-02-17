import React from 'react'
import Hero from '../components/Landing/Hero'
import Gallery from '../components/Landing/Gallery'
import StatsBanner from '../components/Landing/StatsBanner'
import About from '../components/Landing/About'
import Benefits from '../components/Landing/Benefits'
import StatsCounter from '../components/Landing/StatsCounter'
import FAQ from '../components/Landing/FAQ'

const Landing = () => {
    return (
        <div className='min-h-screen'>
            <Hero />
            <Benefits />
            <About />
            <Gallery />
            <StatsCounter />
            <FAQ />
            {/* <StatsBanner /> */}
        </div>
    )
}

export default Landing