import React, { useState } from 'react';
import { MapPin, Navigation, Phone, Globe, ExternalLink } from 'lucide-react';

interface MapLocation {
    lat: number;
    lng: number;
    address: string;
    title: string;
    phone: string;
    // website: string;
}

const EnhancedMap = () => {
    const [isCardHovered, setIsCardHovered] = useState(false);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    const location: MapLocation = {
        lat: 9.071,
        lng: 7.412,
        address: 'Suit 213 MKK Plaza, No 22 IT Igbani Street Opp. Nigeria Canadian International School Beside Vinnee Gas Jabi, Abuja',
        title: 'SEMAN GLOBAL PROJECT LTD',
        phone: '+234 818 436 8514',
        // website: 'www.semanglobalgroup.com'
    };

    const mapsUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.630658478612!2d${location.lng}!3d${location.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8d5c5c5c5c5c%3A0xabcdefabcdefabcd!2s${encodeURIComponent(location.address)}!5e0!3m2!1sen!2sng!4v${Date.now()}`;

    const openGoogleMaps = () => {
        window.open(
            `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`,
            '_blank'
        );
    };

    const openWhatsApp = () => {
        window.open(`https://wa.me/2348184368514`, '_blank');
    };

    return (
        <div className="relative w-full h-150 overflow-hidden shadow group">
            {/* Loading Overlay */}
            {!isMapLoaded && (
                <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-gray-100 z-10 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600 font-medium">Loading map...</p>
                    </div>
                </div>
            )}

            <div
                className={`lg:hidden absolute top-8 lg:left-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 max-w-sm transition-all duration-500 transform ${isCardHovered ? 'scale-105 shadow-2xl' : 'shadow-xl'
                    }`}
                onMouseEnter={() => setIsCardHovered(true)}
                onMouseLeave={() => setIsCardHovered(false)}
            >
                <div className="flex items-start space-x-4 mb-6">
                    <div className="p-3 bg-linear-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg">
                        <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{location.title}</h3>
                        <p className="text-sm text-blue-600 font-semibold">MAIN OFFICE</p>
                    </div>
                </div>

                {/* Address Details */}
                <div className="space-y-4 mb-6">
                    <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                        <p className="text-gray-700 leading-relaxed">{location.address}</p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-blue-600 shrink-0" />
                        <a
                            href={`tel:${location.phone}`}
                            className="text-gray-700 hover:text-blue-600 transition-colors duration-300"
                        >
                            {location.phone}
                        </a>
                    </div>

                    {/* <div className="flex items-center space-x-3">
                        <Globe className="w-5 h-5 text-blue-600 shrink-0" />
                        <a
                            href={`https://${location.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-700 hover:text-blue-600 transition-colors duration-300"
                        >
                            {location.website}
                        </a>
                    </div> */}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={openGoogleMaps}
                        className="group relative bg-linear-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:from-blue-700 hover:to-blue-800"
                    >
                        <span className="relative z-10 flex items-center justify-center space-x-2">
                            <Navigation className="w-4 h-4" />
                            <span>Directions</span>
                        </span>
                        <div className="absolute inset-0 bg-linear-to-r from-blue-700 to-blue-800 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                    </button>

                    <button
                        onClick={openWhatsApp}
                        className="group relative bg-linear-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:from-green-600 hover:to-green-700"
                    >
                        <span className="relative z-10 flex items-center justify-center space-x-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.507 14.307l-.009.075c-.208-1.148-1.16-1.363-2.294-1.198-1.027.145-1.413.75-2.096.75-.673 0-1.248-.5-2.04-.5-.792 0-1.456.5-2.04.5v2c1.479 0 2.653-1.5 3.5-1.5.846 0 2.02 1.5 3.5 1.5 1.482 0 2.657-1.5 3.5-1.5.843 0 2.018 1.5 3.5 1.5v-2c-.693 0-1.267-.5-2.04-.5-.773 0-1.348.5-2.04.5zM12 2C6.486 2 2 6.486 2 12c0 5.515 4.486 10 10 10s10-4.485 10-10c0-5.514-4.486-10-10-10zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                            </svg>
                            <span>WhatsApp</span>
                        </span>
                        <div className="absolute inset-0 bg-linear-to-r from-green-600 to-green-700 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                    </button>
                </div>

                {/* External Link */}
                <button
                    onClick={openGoogleMaps}
                    className="w-full mt-4 flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300"
                >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-4 h-4" />
                </button>
            </div>

            {/* Google Maps Iframe */}
            <iframe
                title="Company Location Map"
                src={mapsUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                className="transition-transform duration-700 group-hover:scale-105"
                onLoad={() => setIsMapLoaded(true)}
                referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Address Card */}
            <div
                className={`hidden lg:block absolute top-8 lg:left-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 max-w-sm transition-all duration-500 transform ${isCardHovered ? 'scale-105 shadow-2xl' : 'shadow-xl'
                    }`}
                onMouseEnter={() => setIsCardHovered(true)}
                onMouseLeave={() => setIsCardHovered(false)}
            >
                <div className="flex items-start space-x-4 mb-6">
                    <div className="p-3 bg-linear-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg">
                        <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{location.title}</h3>
                        <p className="text-sm text-blue-600 font-semibold">MAIN OFFICE</p>
                    </div>
                </div>

                {/* Address Details */}
                <div className="space-y-4 mb-6">
                    <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                        <p className="text-gray-700 leading-relaxed">{location.address}</p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-blue-600 shrink-0" />
                        <a
                            href={`tel:${location.phone}`}
                            className="text-gray-700 hover:text-blue-600 transition-colors duration-300"
                        >
                            {location.phone}
                        </a>
                    </div>

                    {/* <div className="flex items-center space-x-3">
                        <Globe className="w-5 h-5 text-blue-600 shrink-0" />
                        <a
                            href={`https://${location.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-700 hover:text-blue-600 transition-colors duration-300"
                        >
                            {location.website}
                        </a>
                    </div> */}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={openGoogleMaps}
                        className="group relative bg-linear-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:from-blue-700 hover:to-blue-800"
                    >
                        <span className="relative z-10 flex items-center justify-center space-x-2">
                            <Navigation className="w-4 h-4" />
                            <span>Directions</span>
                        </span>
                        <div className="absolute inset-0 bg-linear-to-r from-blue-700 to-blue-800 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                    </button>

                    <button
                        onClick={openWhatsApp}
                        className="group relative bg-linear-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:from-green-600 hover:to-green-700"
                    >
                        <span className="relative z-10 flex items-center justify-center space-x-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.507 14.307l-.009.075c-.208-1.148-1.16-1.363-2.294-1.198-1.027.145-1.413.75-2.096.75-.673 0-1.248-.5-2.04-.5-.792 0-1.456.5-2.04.5v2c1.479 0 2.653-1.5 3.5-1.5.846 0 2.02 1.5 3.5 1.5 1.482 0 2.657-1.5 3.5-1.5.843 0 2.018 1.5 3.5 1.5v-2c-.693 0-1.267-.5-2.04-.5-.773 0-1.348.5-2.04.5zM12 2C6.486 2 2 6.486 2 12c0 5.515 4.486 10 10 10s10-4.485 10-10c0-5.514-4.486-10-10-10zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                            </svg>
                            <span>WhatsApp</span>
                        </span>
                        <div className="absolute inset-0 bg-linear-to-r from-green-600 to-green-700 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                    </button>
                </div>

                {/* External Link */}
                <button
                    onClick={openGoogleMaps}
                    className="w-full mt-4 flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300"
                >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-4 h-4" />
                </button>
            </div>

            {/* Floating Marker */}
            <div className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                <div className="relative">
                    <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-20"></div>
                    <div className="relative w-12 h-12 bg-linear-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
                        <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <div className="w-0 h-0 border-l-8 border-r-8 border-t-12 border-l-transparent border-r-transparent border-t-blue-600"></div>
                    </div>
                </div>
            </div>

            {/* Map Controls Overlay */}
            <div className="absolute bottom-8 right-8 flex space-x-3">
                <button
                    className="p-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
                    onClick={() => window.open(mapsUrl, '_blank')}
                >
                    <Globe className="w-5 h-5 text-gray-700 group-hover:text-blue-600 transition-colors duration-300" />
                </button>

                <button
                    className="p-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
                    onClick={() => setIsMapLoaded(false)}
                >
                    <svg className="w-5 h-5 text-gray-700 group-hover:text-blue-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default EnhancedMap;