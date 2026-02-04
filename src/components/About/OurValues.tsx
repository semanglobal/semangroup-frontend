import { Box } from 'lucide-react';

export default function OurValues() {
    const values = [
        {
            title: "Mission",
            description: "Using innovation and integrity in delivering quality properties."
        },
        {
            title: "Vision",
            description: "Our goal is to be amongst leading practices offering innovative Real Estates solutions and service in Nigeria."
        },
        {
            title: "Core Values",
            description: "Integrity, Innovation, Customer Satisfaction and Excellence."
        }
    ];

    return (
        <div className="w-full bg-gray-50 py-15 px-4 md:px-16 lg:px-24">
            <style>{`
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .value-card:hover .rotating-ring {
          animation: rotate 8s linear infinite;
        }
      `}</style>
            <div className='max-w-360 mx-auto'>
                {/* Heading */}
                <div className="mb-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-700 mb-4">
                        Our Core Values
                    </h2>
                    <p className="text-lg text-gray-600 mb-12">
                        Our core values are Integrity, Innovation, Customer Satisfaction and Excellence.
                    </p>
                </div>

                {/* Values Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-4">
                    {values.map((value, index) => (
                        <div key={index} className="value-card flex flex-col items-center">
                            {/* Icon and Circle Design */}
                            <div className="relative mb-6">
                                {/* Dotted Outer Ring */}
                                <svg className="rotating-ring absolute top-0 left-0 w-full h-full" width="280" height="280" viewBox="0 0 280 280">
                                    <circle
                                        cx="140"
                                        cy="140"
                                        r="130"
                                        fill="none"
                                        stroke="#D4AF37"
                                        strokeWidth="2"
                                        strokeDasharray="8 8"
                                        strokeLinecap="round"
                                    />
                                </svg>

                                {/* Solid Inner Ring */}
                                <svg className="absolute top-0 left-0 w-full h-full" width="280" height="280" viewBox="0 0 280 280">
                                    <circle
                                        cx="140"
                                        cy="140"
                                        r="115"
                                        fill="none"
                                        stroke="#D4AF37"
                                        strokeWidth="3"
                                    />
                                </svg>

                                {/* Yellow Circle with Icon */}
                                <div className="relative w-72 h-72 flex items-start justify-start pt-8 pl-8">
                                    <div className="w-24 h-24 bg-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                                        <Box className="text-white" size={48} strokeWidth={1.5} />
                                    </div>
                                </div>

                                {/* Text Content Inside Circle */}
                                <div className="absolute inset-0 flex items-center justify-center pt-12">
                                    <div className="text-center max-w-xs px-8">
                                        <h3 className="text-3xl font-bold text-gray-900 mb-4">
                                            {value.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {value.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Description */}
                {/* <div className="">
                    <p className="text-gray-700 text-base leading-relaxed 2xl:text-2xl">
                        We manage every stage of the real estate development process, from land acquisition and banking to property development and construction management, enabling individuals to make smarter decisions when buying or investing in homes and properties.
                    </p>
                </div> */}
            </div>

            <div className="max-w-360 mx-auto pt-6">
                {/* Section Title */}
                <div className="mb-10">
                    <h2 className="text-3xl font-semibold text-gray-900">
                        About SEMAN Global Project Ltd
                    </h2>
                    <div className="mt-2 w-16 h-0.5 bg-gray-900"></div>
                </div>

                {/* About Text */}
                <div className="space-y-6 text-gray-700 leading-7 text-base">
                    <p>
                        SEMAN Global Project Ltd was incorporated on 10th August 2016 under the
                        Companies and Allied Matters Act (CAMA) 1990 and duly registered with the
                        Corporate Affairs Commission (CAC) with Registration Number{" "}
                        <span className="font-medium text-gray-900">RC: 1353574</span>.
                    </p>

                    <p>
                        Since inception, SEMAN Global Project Ltd has operated as a technical and
                        reputable company with a global outlook, delivering dependable solutions in
                        auctioneering, infrastructural development, construction services, and
                        general procurement and supply.
                    </p>

                    <p>
                        Our objective is to be among Nigeria’s leading firms providing innovative
                        real estate solutions and high-quality services.
                    </p>
                </div>

                {/* Services */}
                <div className="mt-14">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">
                        Our Core Services
                    </h3>

                    <div className="border border-gray-200 divide-y divide-gray-200">
                        <div className="py-4 px-4 font-medium text-gray-800">
                            Estate Development
                        </div>
                        <div className="py-4 px-4 font-medium text-gray-800">
                            Electrical Engineering
                        </div>
                        <div className="py-4 px-4 font-medium text-gray-800">
                            Procurement Services
                        </div>
                        <div className="py-4 px-4 font-medium text-gray-800">
                            General Contracting
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}