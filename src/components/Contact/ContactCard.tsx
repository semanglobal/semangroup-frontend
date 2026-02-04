import { Clock, LocationEdit, MapPinned, PhoneCall } from 'lucide-react'
import React from 'react'
import EnhancedMap from './Map'

const ContactCard = () => {

    return (
        <div className='py-28 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-360 mx-auto space-y-20'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    <div className="h-40 w-100 border flex items-center gap-4 p-6">
                        <div className="bg-orange-100 p-4">
                            <MapPinned className='text-amber-600' size={50} />
                        </div>
                        <div>
                            <p className='text-gray-800 font-bold text-2xl'>Office Address</p>
                            <p className='text-gray-500'>Suit 213 MKK Plaza, No 22 IT Igbani Street Opp. Nigeria Canadian International School Beside Vinnee Gas Jabi, Abuja.</p>
                        </div>
                    </div>

                    <div className="h-40 w-100 border flex items-center gap-4 p-6">
                        <div className="bg-orange-100 p-4">
                            <PhoneCall className='text-amber-600' size={50} />
                        </div>
                        <div>
                            <p className='text-gray-800 font-bold text-2xl'>Contact Number</p>
                            <p className='text-gray-500'>Phone: +234 818 436 8514</p>
                            <p className='text-gray-500'>Email: semanglobalgroup@gmail.com </p>
                        </div>
                    </div>

                    <div className="h-40 w-100 border flex items-center gap-4 p-6">
                        <div className="bg-orange-100 p-4">
                            <Clock className='text-amber-600' size={50} />
                        </div>
                        <div>
                            <p className='text-gray-800 font-bold text-2xl'>Work Hours</p>
                            <p className='text-gray-500'>Mon-Fri: 8am - 5pm</p>
                            <p className='text-gray-500'>Sat: 8am - 5pm</p>
                        </div>
                    </div>
                </div>

                <div className="shadow p-10 md:p-20 border">
                    <p className='text-gray-800 font-bold text-5xl'>Get in touch with us</p>
                    <form className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <input type="text" placeholder='Your Name' className='border p-3 w-full outline-none focus:border-primary rounded' required />
                        <input type="email" placeholder='Your Email' className='border p-3 w-full outline-none focus:border-primary rounded' required />
                        <input type="text" placeholder='Subject' className='border p-3 w-full outline-none focus:border-primary rounded md:col-span-2' required />
                        <textarea placeholder='Your Message' className='border p-3 w-full md:col-span-2 h-32 outline-none focus:border-primary rounded' required></textarea>
                        <button type="submit" className='bg-amber-600 hover:bg-gray-900 rounded transition-colors duration-300 text-white px-6 py-3 mt-4 md:col-span-2 w-max'>Send Message</button>
                    </form>
                </div>

                <EnhancedMap />
            </div>
        </div>
    )
}

export default ContactCard