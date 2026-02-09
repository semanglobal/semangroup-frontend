import React from 'react'
import HeroContact from '../components/Contact/HeroContact'
import ContactCard from '../components/Contact/ContactCard'
import ReachOut from '../components/Projects/Details/ReachOut'
import EnhancedMap from '../components/Contact/Map'

const ContactUs = () => {
    return (
        <div>
            <HeroContact />
            <ContactCard />
            <ReachOut />
            <EnhancedMap />
        </div>
    )
}

export default ContactUs