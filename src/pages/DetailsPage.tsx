import React from 'react'
import ReachOut from '../components/Projects/Details/ReachOut'
import { useLocation } from 'react-router-dom'
import ProjectDetails from '../components/Projects/Details/ProjectDetails'

const DetailsPage = () => {
    const location = useLocation()
    
    return (
        <div>
            <ProjectDetails />
            <ReachOut />
        </div>
    )
}

export default DetailsPage