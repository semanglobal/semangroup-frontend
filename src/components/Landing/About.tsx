import { Box, Building2, Zap, ShoppingBag, HardHat, ArrowRight, Calendar, Award } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

const services = [
  {
    icon: Building2,
    label: "Estate Development",
    color: "from-violet-500 to-purple-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
    iconColor: "text-violet-600",
  },
  {
    icon: Zap,
    label: "Electrical Engineering",
    color: "from-amber-400 to-orange-500",
    bg: "bg-amber-50",
    border: "border-amber-100",
    iconColor: "text-amber-500",
  },
  {
    icon: ShoppingBag,
    label: "Procurement Services",
    color: "from-emerald-400 to-teal-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    icon: HardHat,
    label: "General Contracting",
    color: "from-sky-400 to-blue-600",
    bg: "bg-sky-50",
    border: "border-sky-100",
    iconColor: "text-sky-600",
  },
]

const stats = [
  { value: "2016", label: "Founded", icon: Calendar },
  { value: "100+", label: "Projects Delivered", icon: Award },
]

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true)
    }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

const About = () => {
  const { ref: sectionRef, inView } = useInView()

  return (
    <div className="w-full relative overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 py-24 px-4 lg:px-8">

      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 rounded-full bg-violet-600/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -right-40 w-96 h-96 rounded-full bg-amber-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-1/3 w-80 h-80 rounded-full bg-sky-500/15 blur-3xl" />

      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }}
      />

      <div ref={sectionRef} className="max-w-6xl mx-auto relative z-10">

        {/* Section label */}
        <div className={`flex justify-center mb-14 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="inline-flex items-center gap-2 bg-white/10 border border-white/10 backdrop-blur-sm text-white/80 text-xs font-semibold uppercase tracking-widest px-5 py-2 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            About Us
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 items-start">

          {/* LEFT — Company Info */}
          <div className="flex-1">
            <div className={`transition-all duration-700 delay-100 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-2">
                Seman Global
                <span className="block bg-linear-to-r from-primary via-orange-400 to-amber-300 bg-clip-text text-transparent">
                  Project Ltd
                </span>
              </h2>
              <div className="flex items-center gap-3 mt-4 mb-8">
                <div className="h-0.5 w-12 bg-linear-to-r from-amber-400 to-orange-500 rounded-full" />
                <div className="h-0.5 w-4 bg-white/20 rounded-full" />
              </div>

              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 text-white/70 text-sm px-4 py-1.5 rounded-full mb-6">
                <span className="text-amber-400 font-semibold">RC: 1353574</span>
                <span>·</span>
                <span>Incorporated 10th August 2016</span>
              </div>

              <div className="space-y-5 text-slate-300 leading-relaxed">
                <p className="text-base">
                  Since inception, SEMAN Global Project Ltd has operated as a technical and
                  reputable company with a global outlook, delivering dependable solutions in
                  auctioneering, infrastructural development, construction services, and
                  general procurement and supply.
                </p>
                <p className="text-base">
                  Our objective is to be among Nigeria's leading firms providing innovative
                  real estate solutions and high-quality services.
                </p>
              </div>

              {/* Stats */}
              <div className="flex gap-6 mt-10">
                {stats.map(({ value, label, icon: Icon }, i) => (
                  <div
                    key={i}
                    className={`flex-1 bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                    style={{ transitionDelay: `${300 + i * 100}ms` }}
                  >
                    <Icon className="w-5 h-5 text-amber-400 mb-2" />
                    <p className="text-2xl font-bold text-white">{value}</p>
                    <p className="text-sm text-slate-400 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className={`mt-10 transition-all duration-700 delay-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                <a href='/about-us' className="group inline-flex items-center gap-2 bg-linear-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-900 font-semibold text-sm px-6 py-3 rounded-full transition-all duration-200 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-105">
                  Learn More
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT — Services */}
          <div className="flex-1">
            <div className={`transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-3xl p-8">
                <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                    <Box className="w-4 h-4 text-white" />
                  </div>
                  Our Core Services
                </h3>
                <p className="text-slate-400 text-sm mb-7 pl-11">What we do best</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {services.map(({ icon: Icon, label, color, bg, border, iconColor }, index) => (
                    <div
                      key={index}
                      className={`group relative overflow-hidden border ${border} ${bg} rounded-2xl p-5 cursor-default transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
                      style={{
                        transitionDelay: `${index * 80}ms`,
                        opacity: inView ? 1 : 0,
                        transform: inView ? 'translateY(0)' : 'translateY(20px)',
                        transition: `opacity 0.5s ease ${300 + index * 100}ms, transform 0.5s ease ${300 + index * 100}ms, box-shadow 0.3s ease, translate 0.3s ease`,
                      }}
                    >
                      {/* Gradient shine on hover */}
                      <div className={`absolute inset-0 bg-linear-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`} />

                      <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${color} flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="font-semibold text-slate-800 text-sm leading-snug">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default About