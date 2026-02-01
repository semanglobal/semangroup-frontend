import React from 'react'
import { imageAssets } from '../../../assets/imageAssets'
import { LocateIcon } from 'lucide-react'
import { Link as LinkScroll } from 'react-scroll'

const ProjectDetails = () => {
    return (
        <div className=''>
            <div className="w-full h-[100dvh] relative flex items-center justify-center" style={{ background: `url(${imageAssets.img3})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>
                {/* <img src={} alt="" className="w-full h-full object-cover" /> */}
                <div className="w-2xl rounded-xl bg-black/50 p-6 flex flex-col items-center justify-center text-white gap-4">
                    <p className="font-bold text-5xl">Gray Manor, Karsana</p>
                    <p>The peoples' home dreams</p>
                    <p className='flex items-center gap-2'><LocateIcon /> Inside Lekki Phase one</p>
                    {/* <button className="px-10 py-3 rounded bg-primary hover:bg-orange-700">Enquire</button> */}
                    <LinkScroll to='reachOut' className="cursor-pointer px-10 py-3 rounded bg-primary hover:bg-primary" smooth={true} offset={-60} duration={600}>Enquire</LinkScroll>
                </div>
            </div>


            <div className='py-16 px-4 sm:px-6 lg:px-8'>
                <div className='max-w-[1440px] mx-auto'>
                </div>
            </div>
        </div>
    )
}

export default ProjectDetails