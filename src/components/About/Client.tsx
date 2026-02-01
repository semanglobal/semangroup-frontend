import React from 'react'
import { imageAssets } from '../../assets/imageAssets'

const Client = () => {
    const logos = [imageAssets.logo1, imageAssets.logo2, imageAssets.logo3, imageAssets.logo1, imageAssets.logo3]
    return (
        <div className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8">
            <div className='max-w-[1440px] mx-auto gap-10 flex justify-center py-10'>
                <div className="flex gap-10">
                    {logos.map((logo, index) => (
                        <div key={index} className="h-16 w-28">
                            <img src={logo} alt="" className="w-full h-full object-contain" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Client