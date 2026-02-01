import React from 'react'
import HeroAbout from '../components/About/HeroAbout'
import OurTeam from '../components/About/OurTeam'
import OurValues from '../components/About/OurValues'
import Client from '../components/About/Client'

const AboutUs = () => {
    return (
        <div>
            <HeroAbout />
            <OurValues />
            <OurTeam />
            <Client />
        </div>
    )
}

export default AboutUs