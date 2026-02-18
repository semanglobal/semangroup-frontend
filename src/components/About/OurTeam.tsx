import { Linkedin, Twitter, Facebook, Instagram, Mail, X } from 'lucide-react';
import { team } from '../../assets/imageAssets';
import { FaExclamationCircle } from 'react-icons/fa';
import { useState } from 'react';

export default function OurTeam() {
    const [showDetails, setShowDetails] = useState<boolean>(false)
    const [showMdDetails, setShowMdDetails] = useState<boolean>(false)
    const [detailId, setDetailId] = useState<number>(0)

    const md = {
        name: "Amb. (Dr) Maxwell Stephen Chigbogu Nweze",
        role: "GMD/CEO",
        image: team.md,
        fb: 'https://web.facebook.com/maxwell.stephen.73',
        ig: 'https://www.instagram.com/maxwellstephen_seman',
        x: '',
        link: '',
        email: '',
        description: [`Ambassador Dr. Stephen Maxwell was born on the 6th of June, 1982 in Enugu, Enugu
            State to the family of Chief and Mrs. Dominic Nweze. His parents were from
            Umuenwene Iji Nike, of Enugu East LGA, in Enugu State. As a child, he was always
            very inquisitive and curious about everything. He attended St. Paul’s primary School
            Eke, from 1991 to 1996 and Government Technical College (GTC), Enugu, from
            1997 to 2003 for his primary and secondary school education respectively.`,

            `It was because of his desire to become better and serve humanity that lead him to learn
            the cosmetics trading as an apprentice under the guidance of one of the best merchants
            in the business at Ogbete main market, Enugu from 2004 to 2005. It might interest
            you to know that within the first six months of being an apprentice, Dr. Stephen was
            made a manager of the shop. This is an indication of his resilience and belief that hard
            and smart work pays. With the strong desire of a young entrepreneur, he started his
            own cosmetics business afterwards and performed well before diversifying into
            manufacturing of paints. He later went on into supply and sales of heavy electrical
            equipment. It was from here that the journey into real estate began.`,

            `In September 2021, Dr. Stephen Maxwell Nweze obtained his BSc in Economics from
            Heim Weldios University of Management and Technology of Benin Republic. He was
            awarded the Doctor of Business Management in October, 2021 by American Heritage
            University of Southern California. And in same year, Peace achievers international, an
            internationally recognized organization recognized him as an ambassador for peace in
            recognition of his achievements in human development and successful advancements
            in business. He is a full member of Chartered institute of management and leadership
            and Real Estate Developers Association Nigeria (REDAN).`,

            `Ambassador Dr. Stephen Maxwell has made so much impact in the community and
            the nation at large. He is a philanthropist by nature. This is evident in the numerous
            awards he has received. Some of which are Icon of women empowerment award by
            Women advocacy for development, grand entertainers award, youth leadership award
            for excellence, life hero award, Sarduana legacy award by the National Association of
            Nigerian Northern Students, award of excellence in good leadership by the Niger
            Delta Youth Forum, and many more.`,

            `Ambassador Dr. Stephen Maxwell Nweze is currently the Chairman/CEO of Seman
            Global Project Ltd; A good husband to his beautiful wife, and an adored father by his
            two beautiful children. Ambassador Dr. Stephen Maxwell Nweze enjoys traveling,
            watching wrestling sports, reading, listening to music and a good dancer.`
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
            description: ''
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
            description: ''
        },

        {
            name: "Mrs Chioma Juliet Toochukwu",
            role: "HEAD OF MARKETING",
            image: team.chioma2,
            fb: 'https://web.facebook.com/chioma.toochukwu.77',
            ig: 'https://www.instagram.com/chiomatochilife1',
            link: 'https://www.linkedin.com/in/chioma-toochukwu-b96a5b36b',
            x: '',
            description: ''
        },

        {
            name: "Arc Agada Dickson",
            role: "Resident Architect",
            image: team.agada,
            fb: 'https://web.facebook.com/DicksonNide',
            ig: 'https://www.instagram.com/dicksonnide',
            x: '',
            link: '',
            description: ''
        },

        {
            name: "Mrs Marry Desmond",
            role: "Accountant",
            image: team.mary,
            fb: 'https://web.facebook.com/mary.okereke.73',
            ig: '',
            x: '',
            link: '',
            description: ''
        },

        {
            name: "Mr Sergius Tochukwu Oti",
            role: "ICT COORDINATOR",
            image: team.tochi,
            fb: 'https://web.facebook.com/SergiusTochukwu',
            ig: 'https://www.instagram.com/sergius_tochukwu',
            x: '',
            link: 'https://www.linkedin.com/in/sergius-tochukwu-oti-0b364823a',
            description: ''
        },
    ];

    return (
        <div className="w-full bg-yellow-50/50 py-16 px-4 sm:px-6 lg:px-8">
            <div className='max-w-360 mx-auto'>
                {/* MD */}
                <div className="mb-6 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Meet Our MD
                    </h2>
                </div>

                <div className="flex justify-center mb-16">
                    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                        <div className="w-full h-100 bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                            <img src={md.image} alt="" className='h-full w-full object-cover' />
                        </div>

                        {/* Card Content */}
                        <div className="p-6 flex flex-col items-center">
                            <h3 className="text-xl font-semibold text-gray-900 mb-1 text-center">
                                {md.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-4 uppercase">
                                {md.role}
                            </p>

                            {/* Social Icons */}
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

                            <button className='text-primary font-semibold text-lg mt-4' onClick={() => setShowMdDetails(true)}>View Profile</button>
                        </div>
                    </div>
                </div>

                {/* Team */}
                <div className="mb-12 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
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

            {showMdDetails && (
                <div className="fixed top-0 lg:px-40 left-0 w-full h-dvh overflow-scroll bg-white flex items-center justify center z-50">
                    <div className="bg-white h-dvh lg:h-[80dvh] p-4 lg:p-10 space-y-4 relative">
                        <X className="absolute right-10 text-xl cursor-pointer" onClick={() => setShowMdDetails(false)} />
                        <div className="flex flex-col items-start gap-4">
                            <img src={md.image} alt="" className="w-40 h-40 shrink-0 rounded-full object-cover" />
                            <div >
                                <h3 className="text-2xl font-bold text-primary mb-2">{md.name}</h3>
                                <p>{md.role}</p>
                            </div>
                        </div>
                        <p className="bg-white pb-4">
                            <p className="bg-white ">
                                {md.description.map((para, i) => (
                                    <p key={i} className="mb-4">{para}</p>
                                ))}
                            </p>
                        </p>
                    </div>
                </div>
            )}

            {showDetails && (
                <div className="fixed top-0 lg:px-40 left-0 w-full h-dvh overflow-scroll bg-white flex items-center justify center z-50">
                    <div className="bg-white h-dvh lg:h-[80dvh] p-4 lg:p-10 space-y-4 relative">
                        <X className="absolute right-10 text-xl cursor-pointer" onClick={() => setShowDetails(false)} />
                        <div className="flex items-end gap-4">
                            <img src={teamMembers[detailId].image} alt="" className="w-40 h-40 rounded-full object-cover" />
                            <div >
                                <h3 className="text-2xl font-bold text-primary mb-2">{teamMembers[detailId].name}</h3>
                                <p>{teamMembers[detailId].role}</p>
                            </div>
                        </div>
                        <p className="bg-white ">
                            <p>{teamMembers[detailId].description}</p>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}