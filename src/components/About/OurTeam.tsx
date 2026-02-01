import { Linkedin, Twitter, Facebook } from 'lucide-react';

export default function OurTeam() {
    const teamMembers = [
        { name: "Sarah Johnson", role: "Senior Real Estate Agent" },
        { name: "Michael Chen", role: "Property Manager" },
        { name: "Emily Rodriguez", role: "Sales Consultant" },
        { name: "David Thompson", role: "Marketing Director" },
        { name: "Jessica Williams", role: "Client Relations Manager" },
        { name: "Robert Brown", role: "Investment Advisor" },
        { name: "Amanda Davis", role: "Listing Specialist" },
        { name: "James Wilson", role: "Operations Manager" }
    ];

    return (
        <div className="w-full bg-yellow-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className='max-w-[1440px] mx-auto'>
                {/* Heading */}
                <div className="mb-12 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Our Team
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        We work together to provide exceptional service and help you find your perfect home.
                    </p>
                </div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {teamMembers.map((member, index) => (
                        <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                            {/* Card Image Placeholder */}
                            <div className="w-full h-64 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                                <span className="text-white text-6xl font-bold">
                                    {member.name.charAt(0)}
                                </span>
                            </div>

                            {/* Card Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                    {member.name}
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    {member.role}
                                </p>

                                {/* Social Icons */}
                                <div className="flex gap-3">
                                    <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                                        <Linkedin size={18} />
                                    </a>
                                    <a href="#" className="text-gray-500 hover:text-blue-400 transition-colors">
                                        <Twitter size={18} />
                                    </a>
                                    <a href="#" className="text-gray-500 hover:text-blue-700 transition-colors">
                                        <Facebook size={18} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}