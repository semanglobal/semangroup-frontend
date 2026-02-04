// components/Footer.tsx
import React from 'react';
import {
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaLinkedinIn,
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
    FaHome,
    FaChevronRight
} from 'react-icons/fa';

// TypeScript interfaces
interface FooterLink {
    label: string;
    url: string;
}

interface SocialMedia {
    name: string;
    icon: React.ReactNode;
    url: string;
}

interface ContactInfo {
    icon: React.ReactNode;
    text: string;
}

const Footer: React.FC = () => {
    // Navigation links
    const navLinks: FooterLink[] = [
        { label: 'Home', url: '/' },
        { label: 'About Us', url: '/about-us' },
        { label: 'Projects', url: '/projects' },
        { label: 'Listings', url: '/listings' },
        { label: 'Contacts', url: '/contacts' }
    ];

    // Social media links
    const socialMedia: SocialMedia[] = [
        { name: 'Facebook', icon: <FaFacebookF />, url: 'https://facebook.com' },
        { name: 'Twitter', icon: <FaTwitter />, url: 'https://twitter.com' },
        { name: 'Instagram', icon: <FaInstagram />, url: 'https://instagram.com' },
        { name: 'LinkedIn', icon: <FaLinkedinIn />, url: 'https://linkedin.com' }
    ];

    // Contact information
    const contactInfo: ContactInfo[] = [
        { icon: <FaMapMarkerAlt />, text: 'Suit 213 MKK Plaza, No 22 IT Igbani Street Opp. Nigeria Canadian International School Beside Vinnee Gas Jabi, Abuja.' },
        { icon: <FaPhone />, text: '+234 818 436 8514' },
        { icon: <FaEnvelope />, text: 'semanglobalgroup@gmail.com' }
    ];

    // Current year for copyright
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-200 font-sans px-4 sm:px-6 lg:px-8">
            {/* Main footer content */}
            <div className="max-w-360 mx-auto py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

                    {/* Company info and logo */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-3">
                            <div className="bg-primary p-2 rounded-lg">
                                <FaHome className="text-white text-2xl" />
                            </div>
                            <span className="text-2xl font-bold text-white">
                                SEMAN GLOBAL <span className="text-primary">PROJECT LTD</span>
                            </span>
                        </div>
                        <p className="text-gray-400 leading-relaxed max-w-md">
                            We are a premier real estate agency specializing in luxury properties,
                            commercial real estate, and personalized property management services since 2005.
                        </p>
                        {/* <div className="pt-4">
                            <h4 className="text-white font-semibold mb-3 text-lg">Subscribe to our newsletter</h4>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent grow"
                                />
                                <button className="bg-primary hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition duration-300 whitespace-nowrap">
                                    Subscribe
                                </button>
                            </div>
                        </div> */}
                    </div>

                    {/* Navigation links */}
                    <div>
                        <h3 className="text-white text-xl font-semibold mb-4 relative pb-3">
                            Navigation
                            <div className="absolute bottom-0 left-0 w-12 h-1 bg-linear-to-r from-primary to-orange-700 rounded-full"></div>
                        </h3>
                        <ul className="space-y-3">
                            {navLinks.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.url}
                                        className="text-gray-400 hover:text-white flex items-center group transition duration-300"
                                    >
                                        <FaChevronRight className="text-primary mr-2 text-xs opacity-0 group-hover:opacity-100 transition duration-300" />
                                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                                            {link.label}
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact details */}
                    <div>
                        <h3 className="text-white text-xl font-semibold mb-4 relative pb-3">
                            Contact Us
                            <div className="absolute bottom-0 left-0 w-12 h-1 bg-linear-to-r from-primary to-orange-700 rounded-full"></div>
                        </h3>
                        <ul className="space-y-4">
                            {contactInfo.map((item, index) => (
                                <li key={index} className="flex items-start space-x-3">
                                    <span className="text-primary mt-1 shrink-0">{item.icon}</span>
                                    <span className="text-gray-400 leading-relaxed">{item.text}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-6 pt-6 border-t border-gray-800">
                            <h4 className="text-white font-semibold mb-3">Business Hours</h4>
                            <p className="text-gray-400 text-sm">Mon - Fri: 8am - 5pm</p>
                            <p className="text-gray-400 text-sm">Saturday: 8am - 5pm</p>
                            <p className="text-gray-400 text-sm">Sunday: Closed</p>
                        </div>
                    </div>

                    {/* Social media */}
                    <div>
                        <h3 className="text-white text-xl font-semibold mb-4 relative pb-3">
                            Follow Us
                            <div className="absolute bottom-0 left-0 w-12 h-1 bg-linear-to-r from-primary to-orange-700 rounded-full"></div>
                        </h3>
                        <div className="flex space-x-4 mb-6">
                            {socialMedia.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    className="w-10 h-10 rounded-full bg-gray-800 hover:bg-primary flex items-center justify-center text-gray-300 hover:text-white transition-all duration-300 transform hover:-translate-y-1"
                                    aria-label={`Visit our ${social.name} page`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-800 rounded-lg p-4">
                                <h4 className="text-white font-semibold mb-2">Certified & Licensed</h4>
                                <p className="text-gray-400 text-sm">Fully licensed real estate brokers in all 50 states</p>
                            </div>

                            <div className="flex items-center space-x-2 text-gray-400 text-sm">
                                <a
                                    href="/privacy-policy"
                                    className="hover:text-white transition duration-300 hover:underline"
                                >
                                    Privacy Policy
                                </a>
                                <span>•</span>
                                <a
                                    href="/terms"
                                    className="hover:text-white transition duration-300 hover:underline"
                                >
                                    Terms of Service
                                </a>
                                <span>•</span>
                                {/* <a
                                    href="/sitemap"
                                    className="hover:text-white transition duration-300 hover:underline"
                                >
                                    Sitemap
                                </a> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright bar */}
            <div className="border-t border-gray-800 bg-gray-950 max-w-360 mx-auto">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-gray-500 text-sm">
                            &copy; {currentYear} AdeolaRealty. All rights reserved.
                        </p>

                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                <span className="text-gray-400 text-sm">24/7 Support Available</span>
                            </div>

                            {/* <div className="text-gray-500 text-sm">
                                MLS® IDX Provided by Real Estate Solutions
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;