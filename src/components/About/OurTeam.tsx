import { Linkedin, Twitter, Facebook, Instagram, Mail, X } from 'lucide-react';
import { team } from '../../assets/imageAssets';
import { FaExclamationCircle } from 'react-icons/fa';
import { useState } from 'react';

export default function OurTeam() {
    const [showDetails, setShowDetails] = useState<boolean>(false)
    const [showMdDetails, setShowMdDetails] = useState<boolean>(false)
    const [detailId, setDetailId] = useState<number>(0)

    const handleShowDetails = (index: number) => {
        setDetailId(index)
        setShowDetails(true)
    }

    const md = {
        name: "Amb. (Dr) Maxwell Stephen Chigbogu Nweze",
        role: "GMD/CEO",
        image: team.md,
        fb: 'https://web.facebook.com/maxwell.stephen.73',
        ig: 'https://www.instagram.com/maxwellstephen_seman',
        x: '',
        link: '',
        email: '',
        description: [
            `Ambassador Dr. Stephen Maxwell Nweze is the Chairman/CEO of Seman Global Project Ltd, where he provides visionary leadership and drives the company’s strategic growth in the real estate sector. Under his direction, Seman has expanded its footprint through innovative projects, operational excellence, and a strong commitment to client satisfaction.`,

            `A seasoned entrepreneur, he brings a proven track record from diverse industries into building a resilient and future-focused organization. His achievements in business development and human empowerment have earned him multiple national and international recognitions. Through purpose-driven leadership, he continues to position Seman as a trusted name in delivering value, integrity, and sustainable development.`,

            // `In September 2021, Dr. Stephen Maxwell Nweze obtained his BSc in Economics from
            // Heim Weldios University of Management and Technology of Benin Republic. He was
            // awarded the Doctor of Business Management in October, 2021 by American Heritage
            // University of Southern California. And in same year, Peace achievers international, an
            // internationally recognized organization recognized him as an ambassador for peace in
            // recognition of his achievements in human development and successful advancements
            // in business. He is a full member of Chartered institute of management and leadership
            // and Real Estate Developers Association Nigeria (REDAN).`,

            // `Ambassador Dr. Stephen Maxwell has made so much impact in the community and
            // the nation at large. He is a philanthropist by nature. This is evident in the numerous
            // awards he has received. Some of which are Icon of women empowerment award by
            // Women advocacy for development, grand entertainers award, youth leadership award
            // for excellence, life hero award, Sarduana legacy award by the National Association of
            // Nigerian Northern Students, award of excellence in good leadership by the Niger
            // Delta Youth Forum, and many more.`,

            // `Ambassador Dr. Stephen Maxwell Nweze is currently the Chairman/CEO of Seman
            // Global Project Ltd; A good husband to his beautiful wife, and an adored father by his
            // two beautiful children. Ambassador Dr. Stephen Maxwell Nweze enjoys traveling,
            // watching wrestling sports, reading, listening to music and a good dancer.`
        ]
    }

    const teamMembers = [
        {
            name: "Sir. Uche Gabriel Anamege",
            role: "Director of Projects",
            image: team.uche,
            fb: '',
            ig: '',
            x: '',
            link: '',
            email: '',
            description: [
                `Sir. Uche Gabriel Anamege brings decades of high-level experience in finance, regulation, and institutional leadership to every project he oversees. He previously served in senior roles at the Central Bank of Nigeria, where he coordinated major financial operations, policy implementation, and institutional reforms. At Seman, he leads project execution with precision, ensuring timely delivery, regulatory compliance, and exceptional quality standards across all developments.`,

                `His career is distinguished by national commendations, global training exposures, and a proven record of operational excellence. With his strategic leadership, Seman Global Projects Ltd continues to deliver landmark projects that inspire confidence and long-term value.`
            ]
        },

        {
            name: "Engr. Bello Umar Jada",
            role: "Project Manager",
            image: team.bello,
            fb: 'https://web.facebook.com/bello.jada.161',
            ig: '',
            x: '',
            link: '',
            email: 'bellojadaumar@gmail.com',
            description: [
                'Engr. Bello Umar Jada serves as the Project Manager at Seman Global Projects Ltd, overseeing the planning, execution, and delivery of complex construction projects. With extensive experience in civil engineering and project leadership, he has successfully managed infrastructure projects, including major road construction and dualization works. His expertise spans construction management, team coordination, and strategic project planning, ensuring efficiency and quality.',

                'A registered member of COREN and multiple engineering bodies, Bello brings professional rigor and innovation to every project. His commitment to excellence and mentorship consistently drives Seman’s projects to timely and successful completion.'
            ]
        },

        {
            name: "Mrs Chioma Juliet Toochukwu",
            role: "HEAD OF MARKETING",
            image: team.chioma2,
            fb: 'https://web.facebook.com/chioma.toochukwu.77',
            ig: 'https://www.instagram.com/chiomatochilife1',
            link: 'https://www.linkedin.com/in/chioma-toochukwu-b96a5b36b',
            x: '',
            description: [
                'Mrs Chioma Juliet Toochukwu is a dynamic strategist who drives the company’s brand visibility, client engagement, and market growth with creativity and precision. With a strong background in banking and finance, she brings results-oriented approach to connecting investors and home buyers with premium property opportunities. She has successfully led innovative campaigns that strengthen Seman’s market presence and accelerate sales performance',

                'Her experience in public relations and stakeholder communication enables her to build lasting trust with clients and partners alike. Passionate, disciplined, and purpose driven, she continues to position Seman Global Projects Ltd as a trusted name in real estate development.'
            ]
        },

        {
            name: "Arc Agada Dickson",
            role: "Resident Architect",
            image: team.agada,
            fb: 'https://web.facebook.com/DicksonNide',
            ig: 'https://www.instagram.com/dicksonnide',
            x: '',
            link: '',
            description: [
                'Arc Agada Dickson is a highly skilled design professional with extensive experience in architectural planning, construction supervision, and real estate development. He has led and contributed to numerous residential and commercial building projects across Nigeria, delivering structurally sound and aesthetically exceptional developments. Before joining Seman, he honed his expertise with reputable firms, managing large-scale projects from concept to completion with precision and innovation.',

                'At Seman, he ensures every development meets approved standards, functional excellence, and modern design expectations. His commitment to quality, compliance, and forward thinking architecture continues to shape the company’s reputation for outstanding project delivery.'
            ]
        },

        {
            name: "Mrs Marry Desmond",
            role: "Accountant",
            image: team.mary,
            fb: 'https://web.facebook.com/mary.okereke.73',
            ig: '',
            x: '',
            link: '',
            description: [
                'Mrs Mary Desmond is the Accounting Officer at Seman Global Projects Ltd, where she expertly manages daily accounting operations and ensures financial accuracy across the company. With a strong background in auditing and finance, she has successfully streamlined reporting processes and enhanced cash flow management.',

                'A registered ICAN professional, Mary brings precision and integrity to budgeting, forecasting, and statutory compliance. Her prior experience in both public and private sectors adds depth to her strategic financial oversight. Mary’s commitment to financial excellence consistently supports Seman’s organizational growth and operational efficiency.'
            ]
        },

        {
            name: "Mr Sergius Tochukwu Oti",
            role: "ICT COORDINATOR",
            image: team.tochi,
            fb: 'https://web.facebook.com/SergiusTochukwu',
            ig: 'https://www.instagram.com/sergius_tochukwu',
            x: '',
            link: 'https://www.linkedin.com/in/sergius-tochukwu-oti-0b364823a',
            description: [
                'Sergius Tochukwu Oti oversees the company’s digital infrastructure, ensuring seamless technology operations that support productivity, marketing, and client engagement. Before joining Seman, he delivered high impact digital solutions, visual branding, and media content for diverse organizations, campaigns, and events, earning a reputation for creativity and technical excellence.',

                'At Seman, he leads the company’s ICT systems while integrating innovative digital strategies that enhance operations, marketing, and client experience. He holds professional certifications in Content Marketing, Social Media Management, and Branding Strategy, equipping him with advanced tools for today’s digital economy. Additionally, he is certified in Google Digital Marketing & E-commerce, applying global best practices to strengthen the company’s online visibility and performance.',

                'His unique fusion of ICT expertise and creative media experience positions Seman as a modern, tech driven real estate brand.'
            ]
        },
    ];

    return (
        <div className="w-full bg-yellow-50/50 py-16 px-4 sm:px-6 lg:px-8">
            <div className='max-w-360 mx-auto'>
                {/* MD */}
                <div className="mb-6 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                        Meet Our CEO/MD
                    </h2>
                </div>

                <div className="flex flex-col justify-center md:flex-row mb-16 bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                    <div className="flex justify-center md:w-5/12">
                        <div className="bg-gray-200 w-full">
                            <div className="w-full h-100 bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                                <img src={md.image} alt="" className='h-full w-full object-cover' />
                            </div>

                            <div className="p-2 flex flex-col items-center">
                                <h3 className="text-xl font-semibold text-gray-900 mb-1 text-center">
                                    {md.name}
                                </h3>
                                <p className="text-sm text-gray-600 mb-4 uppercase">
                                    {md.role}
                                </p>

                                <div className="flex gap-3">
                                    {md.link && (
                                        <a href={md.link} className="text-gray-500 hover:text-blue-600 transition-colors">
                                            <Linkedin size={18} />
                                        </a>
                                    )}
                                    {md.x && (
                                        <a href="#" className="text-gray-500 hover:text-blue-400 transition-colors">
                                            <Twitter size={18} />
                                        </a>
                                    )}

                                    {md.fb && (
                                        <a href={md.fb} className="text-gray-500 hover:text-blue-700 transition-colors">
                                            <Facebook size={18} />
                                        </a>
                                    )}

                                    {md.ig && (
                                        <a href={md.ig} className="text-gray-500 hover:text-blue-700 transition-colors">
                                            <Instagram size={18} />
                                        </a>
                                    )}

                                    {md.email && (
                                        <a href={`mailto: ${md.email}`} className="text-gray-500 hover:text-blue-700 transition-colors">
                                            <Mail size={18} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='md:w-7/12 p-4 md:p-6 bg-white'>
                        {md.description.map((para, i) => (
                            <p key={i} className="mb-4 text-gray-700">{para}</p>
                        ))}
                    </div>
                </div>

                {/* Team */}
                <div className="mb-12 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                        Our Team
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        We work together to provide exceptional service and help you find your perfect home.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {teamMembers.map((member, index) => (
                        <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                            <div className="w-full h-84 bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                                <img src={member.image} alt="" className='h-full w-full object-cover' />
                            </div>

                            {/* Card Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                    {member.name}
                                </h3>
                                <p className="text-sm text-gray-600 mb-2 uppercase">
                                    {member.role}
                                </p>

                                {/* Social Icons */}
                                <div className="flex gap-3 mb-2">
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

                                <button className='text-primary font-semibold hover:text-primary/60 hover:underline' onClick={() => handleShowDetails(index)}>View profile</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showDetails && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 lg:p-10">
                    <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg p-6 lg:p-10 space-y-6 relative">
                        {/* Close button - positioned absolutely within the modal */}
                        <button
                            onClick={() => setShowDetails(false)}
                            className="absolute right-4 top-4 lg:right-6 lg:top-6 text-gray-500 hover:text-gray-700 transition-colors z-10"
                        >
                            <X size={24} />
                        </button>

                        {/* Content with padding to prevent overlap with close button */}
                        <div className="pt-8">
                            {/* Header with image and name */}
                            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
                                <img
                                    src={teamMembers[detailId].image}
                                    alt={teamMembers[detailId].name}
                                    className="w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-primary/10 shrink-0"
                                />
                                <div className="text-center md:text-left">
                                    <h3 className="text-2xl lg:text-3xl font-bold text-primary mb-2">
                                        {teamMembers[detailId].name}
                                    </h3>
                                    <p className="text-gray-600 text-lg">{teamMembers[detailId].role}</p>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="prose prose-lg max-w-none mb-8">
                                {teamMembers[detailId].description.map((para, i) => (
                                    <p key={i} className="mb-4 text-gray-600 leading-relaxed">
                                        {para}
                                    </p>
                                ))}
                            </div>

                            {/* Close button at bottom for mobile convenience */}
                            <div className="flex justify-end">
                                <button
                                    className='bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/80 transition-colors duration-200 font-medium'
                                    onClick={() => setShowDetails(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}