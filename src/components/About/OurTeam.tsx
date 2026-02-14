import { Linkedin, Twitter, Facebook, Instagram, Mail } from 'lucide-react';
import { team } from '../../assets/imageAssets';
import { FaExclamationCircle } from 'react-icons/fa';

export default function OurTeam() {
    const teamMembers = [
        {
            name: "Amb. (Dr) Maxwell Stephen Chigbogu Nweze",
            role: "GMD/CEO",
            image: team.max,
            fb: 'https://web.facebook.com/maxwell.stephen.73',
            ig: 'https://www.instagram.com/maxwellstephen_seman',
            x: '',
            link: '',
            email: ''
        },

        {
            name: "Sir. Uche Gabriel Anamege",
            role: "Director of Projects",
            image: team.uche,
            fb: '',
            ig: '',
            x: '',
            link: '',
            email: ''
        },

        {
            name: "Engr. Bello Umar Jada",
            role: "Project Manager",
            image: team.bello,
            fb: 'https://web.facebook.com/bello.jada.161',
            ig: '',
            x: '',
            link: '',
            email: 'bellojadaumar@gmail.com'
        },

        // {
        //     name: "Barr. Ndudi Ezekiel Chidi",
        //     role: "Head Legal",
        //     image: team.bello
        // },

        {
            name: "Mrs Chioma Juliet Toochukwu",
            role: "HEAD OF MARKETING",
            image: team.chioma,
            fb: 'https://web.facebook.com/chioma.toochukwu.77',
            ig: 'https://www.instagram.com/chiomatochilife1',
            link: 'https://www.linkedin.com/in/chioma-toochukwu-b96a5b36b',
            x: ''
        },

        {
            name: "Arc Agada Dickson",
            role: "Resident Architect",
            image: team.agada,
            fb: 'https://web.facebook.com/DicksonNide',
            ig: 'https://www.instagram.com/dicksonnide',
            x: '',
            link: ''
        },

        {
            name: "Mrs Marry Desmond",
            role: "Accountant",
            image: team.mary,
            fb: '',
            ig: '',
            x: '',
            link: ''
        },

        {
            name: "Mr Tochukwu Sergius Oti",
            role: "Head of ICT",
            image: team.tochi,
            fb: 'https://web.facebook.com/SergiusTochukwu',
            ig: 'https://www.instagram.com/sergius_tochukwu',
            x: '',
            link: 'https://www.linkedin.com/in/sergius-tochukwu-oti-0b364823a'
        },
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
                                <p className="text-sm text-gray-600 mb-4 uppercase">
                                    {member.role}
                                </p>

                                {/* Social Icons */}
                                <div className="flex gap-3">
                                    {member.link && (
                                        <a href={member.link} className="text-gray-500 hover:text-blue-600 transition-colors">
                                            <Linkedin size={18} />
                                        </a>
                                    )}
                                    {member.x && (
                                        <a href="#" className="text-gray-500 hover:text-blue-400 transition-colors">
                                            <Twitter size={18} />
                                        </a>
                                    )}

                                    {member.fb && (
                                        <a href={member.fb} className="text-gray-500 hover:text-blue-700 transition-colors">
                                            <Facebook size={18} />
                                        </a>
                                    )}

                                    {member.ig && (
                                        <a href={member.ig} className="text-gray-500 hover:text-blue-700 transition-colors">
                                            <Instagram size={18} />
                                        </a>
                                    )}

                                    {member.email && (
                                        <a href={`mailto: ${member.email}`} className="text-gray-500 hover:text-blue-700 transition-colors">
                                            <Mail size={18} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}