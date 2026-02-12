/* eslint-disable @typescript-eslint/no-explicit-any */

import { Clock, MapPinned, PhoneCall } from 'lucide-react'
import React, { useState } from 'react'
import EnhancedMap from './Map'
import { EnquiryService } from '../../services/enquiryService'

interface FormDataType {
    fullName: string
    email: string
    phone: string
    subject: string
    message: string
}

const ContactCard = () => {
    const [formData, setFormData] = useState<FormDataType>({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)

        try {
            const res = await EnquiryService.sendEnquiry(formData)

            setSuccess(
                res?.message || 'Your enquiry has been sent successfully 🎉'
            )

            setFormData({
                fullName: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
            })

            setTimeout(() => setSuccess(''), 5000)
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                'Something went wrong. Please try again.'
            )
            setTimeout(() => setError(''), 5000)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="py-28 px-4 sm:px-6 lg:px-8">
            <div className="max-w-360 mx-auto space-y-20">

                {/* INFO CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="lg:h-40 w-full border flex items-center gap-4 p-6">
                        <div className="bg-orange-100 p-4">
                            <MapPinned className="text-amber-600" size={50} />
                        </div>
                        <div>
                            <p className="text-gray-800 font-bold text-2xl">
                                Office Address
                            </p>
                            <p className="text-gray-500">
                                Suit 213 MKK Plaza, No 22 IT Igbani Street Opp.
                                Nigeria Canadian International School Beside
                                Vinnee Gas Jabi, Abuja.
                            </p>
                        </div>
                    </div>

                    <div className="h-40 w-full border flex items-center gap-4 p-6">
                        <div className="bg-orange-100 p-4">
                            <PhoneCall className="text-amber-600" size={50} />
                        </div>
                        <div>
                            <p className="text-gray-800 font-bold text-2xl">
                                Contact Number
                            </p>
                            <p className="text-gray-500">
                                Phone: +234 818 436 8514
                            </p>
                            <p className="text-gray-500">
                                Email: semanglobalgroup@gmail.com
                            </p>
                        </div>
                    </div>

                    <div className="h-40 w-full border flex items-center gap-4 p-6">
                        <div className="bg-orange-100 p-4">
                            <Clock className="text-amber-600" size={50} />
                        </div>
                        <div>
                            <p className="text-gray-800 font-bold text-2xl">
                                Work Hours
                            </p>
                            <p className="text-gray-500">
                                Mon–Fri: 8am – 5pm
                            </p>
                            <p className="text-gray-500">
                                Sat: 8am – 5pm
                            </p>
                        </div>
                    </div>
                </div>

                {/* CONTACT FORM */}
                {/* <div className="shadow p-10 md:p-20 border">
                    <p className="text-gray-800 font-bold text-5xl">
                        Get in touch with us
                    </p>

                    {success && (
                        <div className="mt-6 flex gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800 animate-fadeIn">
                            <span className="text-xl">✔</span>
                            <div>
                                <p className="font-semibold">
                                    Message Sent
                                </p>
                                <p className="text-sm">{success}</p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mt-6 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 animate-fadeIn">
                            <span className="text-xl">⚠</span>
                            <div>
                                <p className="font-semibold">
                                    Submission Failed
                                </p>
                                <p className="text-sm">{error}</p>
                            </div>
                        </div>
                    )}

                    <form
                        className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
                        onSubmit={handleSubmit}
                    >
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={formData.fullName}
                            className="border p-3 w-full outline-none focus:border-primary rounded"
                            required
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    fullName: e.target.value,
                                })
                            }
                        />

                        <input
                            type="email"
                            placeholder="Your Email"
                            value={formData.email}
                            className="border p-3 w-full outline-none focus:border-primary rounded"
                            required
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    email: e.target.value,
                                })
                            }
                        />

                        <input
                            type="text"
                            placeholder="Subject"
                            value={formData.subject}
                            className="border p-3 w-full outline-none focus:border-primary rounded md:col-span-2"
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    subject: e.target.value,
                                })
                            }
                        />

                        <input
                            type="text"
                            placeholder="Phone"
                            value={formData.phone}
                            className="border p-3 w-full outline-none focus:border-primary rounded md:col-span-2"
                            required
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    phone: e.target.value,
                                })
                            }
                        />

                        <textarea
                            placeholder="Your Message"
                            value={formData.message}
                            className="border p-3 w-full md:col-span-2 h-32 outline-none focus:border-primary rounded"
                            required
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    message: e.target.value,
                                })
                            }
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className={`rounded transition-colors duration-300 text-white px-6 py-3 mt-4 md:col-span-2 w-max
                                ${loading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-amber-600 hover:bg-gray-900'
                                }`}
                        >
                            {loading ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div> */}
            </div>
        </div>
    )
}

export default ContactCard