import { Linkedin, Twitter, Facebook } from 'lucide-react';
import { team } from '../../assets/imageAssets';

export default function OurTeam() {
    const teamMembers = [
        { name: "Amb. Dr. Maxwell Stephen", role: "MD/CEO SEMAN GROUP", image: team.max },
        { name: "Mr. Uche Gabriel Anamege", role: "D.O.P SEMAN GLOBAL PROJECT", image: team.uche },
        { name: "Mary Desmond", role: "ACCOUNTANT", image: team.mary },
        { name: "Engr. Bello Jada", role: "Project Manager", image: team.bello },
        { name: "Mrs Chioma Tochukwu", role: "HEAD OF MARKETING", image: team.chioma },
        { name: "Arc. Agada Dickson", role: "ARCHITECT", image: team.agada },
        { name: "Mr. Sergius Tochukwu Oti.", role: "ICT COORDINATOR", image: team.tochi },
    ];

    return (
        <div className="w-full bg-yellow-50/50 py-16 px-4 sm:px-6 lg:px-8">
            <div className='max-w-360 mx-auto'>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {teamMembers.map((member, index) => (
                        <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                            <div className="w-full h-84 bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                                {/* <span className="text-white text-6xl font-bold">
                                    {member.name.charAt(0)}
                                </span> */}
                                <img src={member.image} alt="" className='h-full w-full object-cover' />
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