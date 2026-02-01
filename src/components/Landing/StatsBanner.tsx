import React from 'react';
import { User, GraduationCap, Globe, ThumbsUp, BadgeCheck } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';

export default function StatsBanner() {
  const { ref: statsRef, inView: statsInView } = useInView({ triggerOnce: true });

  return (
    <div className="w-full bg-gray-800 py-12 px-4 sm:px-6 lg:px-8" ref={statsRef}>
      <div className="max-w-[1440px] mx-auto flex flex-wrap justify-around items-center text-white text-center">

        {/* Course Enrollments */}
        <div className="h-58 w-58 bg-primary rounded-full flex flex-col items-center justify-center">
          <div className="flex flex-col items-center px-4 mb-6 md:mb-0">
            <User className="w-12 h-12 mb-2" />
            <h2 className="text-5xl font-bold">{statsInView && <CountUp end={3} />}k+</h2>
            <p className="mt-1">Apartments</p>
          </div>
        </div>

        {/* Recommended */}
        <div className="h-58 w-58 bg-primary rounded-full flex flex-col items-center justify-center">
          <div className="flex flex-col items-center px-4 mb-6 md:mb-0">
            <ThumbsUp className="w-12 h-12 mb-2" />
            <h2 className="text-5xl font-bold">{statsInView && <CountUp end={98} />}%</h2>
            <p className="mt-1">Recommended<br /></p>
          </div>
        </div>

        {/* Learners */}
        <div className="h-58 w-58 bg-primary rounded-full flex flex-col items-center justify-center">
          <div className="flex flex-col items-center px-4">
            <BadgeCheck className="w-12 h-12 mb-2" />
            <h2 className="text-5xl font-bold">{statsInView && <CountUp end={97} />}%</h2>
            <p className="mt-1">Aesthetic</p>
          </div>
        </div>
      </div>
    </div>
  );
}