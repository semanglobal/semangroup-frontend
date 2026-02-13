import React from 'react'
import Hero from '../components/Landing/Hero'
import Gallery from '../components/Landing/Gallery'
import StatsBanner from '../components/Landing/StatsBanner'
import About from '../components/Landing/Benefits'
import Benefits from '../components/Landing/Benefits'
import StatsCounter from '../components/Landing/StatsCounter'

const Landing = () => {
    return (
        <div className='min-h-screen'>
            <Hero />
            <Benefits />
            <Gallery />
            <StatsCounter />
            {/* <StatsBanner /> */}
        </div>
    )
}

export default Landing