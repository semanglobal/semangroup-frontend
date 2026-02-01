import React from 'react'
import Hero from '../components/Landing/Hero'
import Gallery from '../components/Landing/Gallery'
import StatsBanner from '../components/Landing/StatsBanner'
import About from '../components/Landing/About'
import Benefits from '../components/Landing/About'

const Landing = () => {
    return (
        <div className='min-h-screen'>
            <Hero />
            <Benefits />
            <Gallery />
            {/* <StatsBanner /> */}
        </div>
    )
}

export default Landing