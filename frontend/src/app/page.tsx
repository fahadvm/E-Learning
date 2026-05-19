"use client"

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  X, 
  MoveRight, 
  ArrowLeft, 
  ArrowRight, 
  Code2, 
  Layers, 
  Cpu, 
  Globe, 
  Menu,
  GraduationCap,
  Building2,
  Briefcase,
  Monitor
} from "lucide-react";

// Interactive Glowing Liquid Orb with Floating React Bits (Cosmic Sparks)
function LiquidOrb() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative w-80 h-80 md:w-[420px] md:h-[420px] flex items-center justify-center pointer-events-none select-none z-0"
    >
      {/* 3D Liquid Displacement Filter Definition */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="liquid-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" result="noise">
              <animate attributeName="baseFrequency" values="0.012;0.022;0.012" dur="15s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="70" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Floating React Bits (cosmic spark particles) */}
      <div className="absolute inset-0 z-10 overflow-visible">
        {[...Array(12)].map((_, i) => {
          const delay = i * 0.5;
          const randomX = Math.sin(i) * 150;
          const randomY = Math.cos(i) * 150;
          return (
            <motion.div
              key={i}
              initial={{ x: randomX, y: randomY, scale: 0.8, opacity: 0.2 }}
              animate={{
                x: [randomX, randomX + Math.sin(i + 1) * 30, randomX],
                y: [randomY, randomY + Math.cos(i + 1) * 30, randomY],
                opacity: [0.2, 0.7, 0.2],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 5 + (i % 3) * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay
              }}
              className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]"
            />
          );
        })}
      </div>

      {/* Mesmerizing Multi-layered Fluid Blob */}
      <motion.div
        animate={{
          x: mousePos.x,
          y: mousePos.y,
          rotate: 360
        }}
        transition={{
          type: "spring",
          stiffness: 70,
          damping: 15,
          rotate: { duration: 25, repeat: Infinity, ease: "linear" }
        }}
        style={{ filter: "url(#liquid-filter)" }}
        className="w-64 h-64 md:w-[320px] md:h-[320px] rounded-full relative bg-gradient-to-tr from-[#EA8EB5] via-[#9F9DF4] to-[#60A5FA] shadow-[0_0_120px_rgba(159,157,244,0.45)] flex items-center justify-center overflow-hidden"
      >
        {/* Inner Swirling Glass Highlights */}
        <div className="absolute inset-4 rounded-full bg-black/10 backdrop-blur-[1px] border border-white/10" />
        
        {/* Colorful Flowing Sub-blobs */}
        <motion.div 
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -30, 40, 0],
            scale: [1, 1.2, 0.9, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-44 h-44 rounded-full bg-[#EA8EB5] mix-blend-multiply filter blur-xl opacity-60 top-4 left-4"
        />
        <motion.div 
          animate={{
            x: [0, -40, 30, 0],
            y: [0, 40, -30, 0],
            scale: [1, 0.9, 1.1, 1]
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-44 h-44 rounded-full bg-[#60A5FA] mix-blend-multiply filter blur-xl opacity-60 bottom-4 right-4"
        />
      </motion.div>

      {/* Outer Luxury Glass Sphere Overlay (Frosted Edge Highlight) */}
      <div className="absolute w-[260px] h-[260px] md:w-[320px] md:h-[320px] rounded-full border border-white/20 shadow-[inset_0_2px_4px_rgba(255,255,255,0.25)] pointer-events-none z-20 mix-blend-overlay" />

    </div>
  );
}

export default function Page() {
  const [navOpen, setNavOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);

  const chooseUsCards = [
    {
      num: "01",
      title: "Adaptive Learning Paths",
      desc: "Personalized educational journeys tailored dynamically to individual career targets, academic milestones, and coding capabilities.",
      color: "from-[#EA8EB5]/20 to-transparent",
      icon: (
        <svg viewBox="0 0 24 24" className="w-9 h-9 text-white filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)]" fill="currentColor">
          <path d="M12 2.5l2.7 5.5 6 0.9-4.3 4.2 1 6-5.4-2.8-5.4 2.8 1-6-4.3-4.2 6-0.9z" />
          <path d="M20 3.5l0.8 1.6 1.7 0.3-1.2 1.2 0.3 1.7-1.6-0.8-1.6 0.8 0.3-1.7-1.2-1.2 1.7-0.3z" opacity="0.8" />
          <path d="M4 14.5l0.5 1 1 0.2-0.7 0.7 0.2 1-1-0.5-1 0.5 0.2-1-0.7-0.7 1-0.2z" opacity="0.7" />
        </svg>
      )
    },
    {
      num: "02",
      title: "Real-Time Collaboration",
      desc: "Ultra-low latency webRTC-powered consultation rooms, collaborative sandbox compilers, and interactive coding canvases.",
      color: "from-[#9F9DF4]/20 to-transparent",
      icon: (
        <svg viewBox="0 0 24 24" className="w-9 h-9 text-white filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 16.5c-1.5 1.26-2 3.4-2 3.4s2.14-.5 3.4-2" />
          <path d="M12 2S4.5 4 4.5 10.5c0 2.22 1.34 4.5 3 5.5l5-3-3-5" />
          <path d="M12 2s7.5 2 7.5 8.5c0 2.22-1.34 4.5-3 5.5l-5-3 3-5" />
          <path d="M9 15l3-3 3 3" />
        </svg>
      )
    },
    {
      num: "03",
      title: "Enterprise Skill Dashboard",
      desc: "Comprehensive company portals delivering clear metrics on employee upskilling milestones, analytics, and custom exams.",
      color: "from-[#60A5FA]/20 to-transparent",
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8 text-white filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)]" fill="currentColor">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <path d="M16 17.5h3M17.5 16v3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      )
    }
  ];

  const processSteps = [
    {
      num: "01",
      title: "Intelligent Profiling",
      desc: "Assess and map capabilities across engineering domains using adaptive AI diagnostic skill markers.",
      badge: "Diagnostics"
    },
    {
      num: "02",
      title: "Curated Skill Mentorship",
      desc: "Generate personalized dynamic curricula paired with direct live mentor guidance and check-ins.",
      badge: "Curriculum"
    },
    {
      num: "03",
      title: "Sandbox Compilation",
      desc: "Engage in hands-on learning with a real-time web compiler executing live code sandbox tests.",
      badge: "Execution"
    },
    {
      num: "04",
      title: "Corporate Challenge Testing",
      desc: "Validate readiness with real corporate problems and benchmarks designed by industry partners.",
      badge: "Validation"
    },
    {
      num: "05",
      title: "Gateway Licensing",
      desc: "Secure industry-standard micro-credentials with Razorpay/Stripe automated instant checkouts.",
      badge: "Licensing"
    }
  ];

  const caseStudies = [
    {
      title: "Enterprise Upskilling Program",
      description: "How a Fortune 500 company successfully retrained 2,500+ developers on next-generation architectures using DevNext B2B dashboards, reducing deployment onboarding times by 40%.",
      statNum: "40%",
      statDesc: "Faster Onboarding",
      imgSrc: "/slide_fluid_droplet.png"
    },
    {
      title: "High-Performance Sandbox",
      description: "Deploying interactive browser-based compiler containers powered by Judge0 execution layers to run complex Python, Go, and React algorithms for 50,000+ simultaneous students.",
      statNum: "99.9%",
      statDesc: "Uptime Achieved",
      imgSrc: "/slide_glass_sculpture.png"
    },
    {
      title: "AI-Powered Mentor System",
      description: "Integrating Gemini and OpenAI LLM models to provide real-time code reviews, smart path recommendations, and mock technical interview simulations for corporate career pivots.",
      statNum: "10x",
      statDesc: "Engagement Scale",
      imgSrc: "/slide_white_puff.png"
    }
  ];

  const techRow1 = [
    { name: "Next.js 15", icon: <Code2 className="w-4 h-4" /> },
    { name: "React 19", icon: <Layers className="w-4 h-4" /> },
    { name: "Tailwind CSS", icon: <Cpu className="w-4 h-4" /> },
    { name: "TypeScript", icon: <Globe className="w-4 h-4" /> },
    { name: "Node.js", icon: <Code2 className="w-4 h-4" /> },
    { name: "Express", icon: <Layers className="w-4 h-4" /> },
    { name: "MongoDB", icon: <Cpu className="w-4 h-4" /> },
    { name: "Mongoose", icon: <Globe className="w-4 h-4" /> }
  ];

  const techRow2 = [
    { name: "Redis Cache", icon: <Cpu className="w-4 h-4" /> },
    { name: "Socket.io", icon: <Globe className="w-4 h-4" /> },
    { name: "WebRTC Live", icon: <Layers className="w-4 h-4" /> },
    { name: "Stripe", icon: <Code2 className="w-4 h-4" /> },
    { name: "Razorpay", icon: <Layers className="w-4 h-4" /> },
    { name: "Cloudinary", icon: <Cpu className="w-4 h-4" /> },
    { name: "OpenAI API", icon: <Globe className="w-4 h-4" /> },
    { name: "Gemini Pro", icon: <Code2 className="w-4 h-4" /> }
  ];

  const techRow3 = [
    { name: "HTML5", icon: <Layers className="w-4 h-4" /> },
    { name: "CSS3 Extra", icon: <Cpu className="w-4 h-4" /> },
    { name: "Javascript ES6", icon: <Globe className="w-4 h-4" /> },
    { name: "Git Control", icon: <Code2 className="w-4 h-4" /> },
    { name: "GitHub Actions", icon: <Layers className="w-4 h-4" /> },
    { name: "Docker Stack", icon: <Cpu className="w-4 h-4" /> },
    { name: "Kubernetes", icon: <Globe className="w-4 h-4" /> },
    { name: "AWS Cloud", icon: <Code2 className="w-4 h-4" /> }
  ];

  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-x-hidden">
      
      {/* 1. Sleek Floating Navigation Header (Exact matching reference layout) */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-auto px-4 flex items-center gap-3 justify-center">
        
        {/* Left Side: Circular Spoke Logo Button (Grey Capsule Circle) */}
        <div className="w-12 h-12 rounded-full bg-neutral-800/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-lg cursor-pointer hover:bg-neutral-700 transition-all duration-300 group">
          <svg viewBox="0 0 100 100" className="w-6.5 h-6.5 text-white/95 group-hover:scale-105 transition-transform">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <path
                key={angle}
                transform={`rotate(${angle}, 50, 50)`}
                d="M 50 50 C 47.5 40 44.5 30 41 21 C 46.5 20 48.5 13 50 5 C 51.5 13 53.5 20 59 21 C 55.5 30 52.5 40 50 50 Z"
                fill="currentColor"
              />
            ))}
          </svg>
        </div>

        {/* Right Side: Combined Menu & CTA Pill Capsule */}
        <div className="flex items-center bg-neutral-800/80 border border-white/10 rounded-full p-1.5 shadow-lg backdrop-blur-md gap-1">
          
          {/* Menu Trigger Button with minimalist 2-line icon */}
          <button 
            onClick={() => setNavOpen(!navOpen)}
            className="flex items-center gap-2 text-white font-bold text-xs px-4 py-2 hover:opacity-85 transition-opacity select-none cursor-pointer"
          >
            {navOpen ? (
              <X className="w-3.5 h-3.5" />
            ) : (
              <div className="flex flex-col gap-1 w-3.5">
                <div className="h-[2px] w-full bg-white rounded-full" />
                <div className="h-[2px] w-4/5 bg-white rounded-full" />
              </div>
            )}
            <span>{navOpen ? "Close" : "Menu"}</span>
          </button>

          {/* White CTA Button inside capsule */}
          <button 
            onClick={() => {
              setNavOpen(true);
            }}
            className="bg-white hover:bg-neutral-200 text-black font-bold text-xs px-5 py-2 rounded-full border border-neutral-300 shadow-md transition-all select-none cursor-pointer"
          >
            Explore Portals
          </button>

        </div>

      </header>

      {/* 1b. Glassmorphic Dropdown Navigation Menu Overlay */}
      <AnimatePresence>
        {navOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-4"
          >
            <div className="bg-black/95 border border-white/10 backdrop-blur-xl rounded-[30px] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">
                    Access DevNext Roles
                  </span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <Link href="/student/login" onClick={() => setNavOpen(false)}>
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 hover:bg-white/10 transition-colors cursor-pointer flex flex-col gap-2 group">
                      <GraduationCap className="w-5 h-5 text-indigo-400" />
                      <span className="text-white text-xs font-bold font-sans flex items-center gap-1">
                        Student Portal
                        <MoveRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                      </span>
                      <p className="text-[10px] text-neutral-400">Adaptive courses & sandbox compilers</p>
                    </div>
                  </Link>

                  <Link href="/teacher/login" onClick={() => setNavOpen(false)}>
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 hover:bg-white/10 transition-colors cursor-pointer flex flex-col gap-2 group">
                      <Monitor className="w-5 h-5 text-[#EA8EB5]" />
                      <span className="text-white text-xs font-bold font-sans flex items-center gap-1">
                        Teacher Portal
                        <MoveRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                      </span>
                      <p className="text-[10px] text-neutral-400">Configure courses & assess code</p>
                    </div>
                  </Link>

                  <Link href="/company/login" onClick={() => setNavOpen(false)}>
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 hover:bg-white/10 transition-colors cursor-pointer flex flex-col gap-2 group">
                      <Building2 className="w-5 h-5 text-sky-400" />
                      <span className="text-white text-xs font-bold font-sans flex items-center gap-1">
                        Company B2B
                        <MoveRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                      </span>
                      <p className="text-[10px] text-neutral-400">Upskill team tracking & custom testing</p>
                    </div>
                  </Link>

                  <Link href="/employee/login" onClick={() => setNavOpen(false)}>
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 hover:bg-white/10 transition-colors cursor-pointer flex flex-col gap-2 group">
                      <Briefcase className="w-5 h-5 text-amber-400" />
                      <span className="text-white text-xs font-bold font-sans flex items-center gap-1">
                        Employee Portal
                        <MoveRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                      </span>
                      <p className="text-[10px] text-neutral-400">Complete corporate training assignments</p>
                    </div>
                  </Link>
                </div>

                <div className="border-t border-white/10 pt-4 flex justify-between items-center text-[10px] text-neutral-500">
                  <span>DevNext Advanced Corporate Ecosystem</span>
                  <Link href="/admin/login" onClick={() => setNavOpen(false)}>
                    <span className="hover:text-white transition-colors cursor-pointer font-bold uppercase tracking-wider flex items-center gap-1">
                      System Admin
                      <MoveRight className="w-2.5 h-2.5" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Hero Section (Unified Black BG Theme with Liquid 3D Orb and React Bits) */}
      <section className="relative min-h-screen pt-32 pb-24 flex items-center justify-center overflow-hidden bg-black text-white">
        
        {/* Soft Background Grid Accent */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:45px_45px] opacity-30 pointer-events-none" />

        {/* Dynamic Lavender & Rose Ambiance Glow Lights */}
        <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-[#9F9DF4] opacity-[0.07] filter blur-[120px] pointer-events-none z-0" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] rounded-full bg-[#EA8EB5] opacity-[0.07] filter blur-[120px] pointer-events-none z-0" />

        {/* Large Watermark Text */}
        <div className="absolute top-[22%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none select-none">
          <span className="text-[120px] md:text-[230px] font-black text-neutral-800/10 tracking-tighter uppercase font-sans">
            DEV/NEXT
          </span>
        </div>

        {/* Section Contents Grid Container */}
        <div className="relative z-10 w-full max-w-6xl px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline and Call-To-Action (7-span) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Centered Pill Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full py-1.5 px-4 shadow-sm mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-[10px] font-bold tracking-widest text-neutral-300 uppercase font-mono">
                001 • COGNITIVE ECOSYSTEM
              </span>
            </motion.div>

            {/* Faded Luxury Headline Text */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="text-3xl md:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.1] mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-100 to-neutral-500 max-w-3xl"
            >
              DevNext is the premium multi-role E-learning & corporate training ecosystem.
            </motion.h1>

            {/* Sub-description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="text-xs md:text-sm text-neutral-400 leading-relaxed max-w-xl mb-8"
            >
              Empowering students, teachers, companies, and employees to master technical stacks through adaptive AI learning paths, interactive video sandboxes, and deep performance metrics.
            </motion.p>

            {/* CTAs Button Row */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap items-center gap-4 mb-10"
            >
              <button 
                onClick={() => setNavOpen(true)}
                className="bg-white hover:bg-neutral-200 text-black font-bold text-xs px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95 cursor-pointer flex items-center gap-2 select-none"
              >
                <span>Explore Portals</span>
                <MoveRight className="w-3.5 h-3.5" />
              </button>

              <button 
                onClick={() => setVideoOpen(true)}
                className="bg-white/5 hover:bg-white/10 text-white font-bold text-xs px-6 py-3.5 rounded-full border border-white/10 transition-colors flex items-center gap-2 cursor-pointer select-none"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Watch System Tour</span>
              </button>
            </motion.div>

          </div>

          {/* Right Column: Mesmerizing Interactive 3D Orb and React Bits (5-span) */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <LiquidOrb />
          </div>

        </div>

      </section>

      {/* Hero Video Presentation Card Segment (Exact matching reference layout) */}
      <section className="bg-black text-white pb-28 px-6 flex flex-col items-center justify-center overflow-hidden relative">
        
        {/* CSS Keyframes for bulletproof hardware-accelerated continuous movement */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marquee-lr {
            0% { transform: translate3d(-50%, 0, 0); }
            100% { transform: translate3d(0%, 0, 0); }
          }
          .animate-marquee-continuous-lr {
            animation: marquee-lr 18s linear infinite;
            will-change: transform;
          }
        `}} />

        {/* Giant Behind-the-Video Moving Text: DEVNEXT Left-to-Right Loop */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden pointer-events-none select-none z-0">
          <div className="flex whitespace-nowrap text-[120px] md:text-[220px] font-black tracking-[0.12em] text-white/[0.025] uppercase select-none font-sans animate-marquee-continuous-lr">
            {/* 2 identical segments to ensure perfect loop matching */}
            <div className="flex shrink-0 items-center gap-16">
              <span>DEVNEXT</span>
              <span className="text-[60px] md:text-[100px] text-white/[0.015]">•</span>
              <span>DEVNEXT</span>
              <span className="text-[60px] md:text-[100px] text-white/[0.015]">•</span>
              <span>DEVNEXT</span>
              <span className="text-[60px] md:text-[100px] text-white/[0.015]">•</span>
              <span>DEVNEXT</span>
              <span className="text-[60px] md:text-[100px] text-white/[0.015]">•</span>
            </div>
            <div className="flex shrink-0 items-center gap-16">
              <span>DEVNEXT</span>
              <span className="text-[60px] md:text-[100px] text-white/[0.015]">•</span>
              <span>DEVNEXT</span>
              <span className="text-[60px] md:text-[100px] text-white/[0.015]">•</span>
              <span>DEVNEXT</span>
              <span className="text-[60px] md:text-[100px] text-white/[0.015]">•</span>
              <span>DEVNEXT</span>
              <span className="text-[60px] md:text-[100px] text-white/[0.015]">•</span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-4xl flex flex-col items-center relative z-10">
          {/* Interactive Presentation Video Card Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 25 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-3xl aspect-[1.78] rounded-[60px] md:rounded-[90px] border border-white/40 bg-neutral-900 shadow-[0_25px_60px_rgba(0,0,0,0.15)] relative overflow-hidden group cursor-pointer"
            onClick={() => setVideoOpen(true)}
          >
            {/* Embedded High-Res Thumbnail Image */}
            <Image 
              src="/landing_video_thumb.png" 
              alt="DevNext Platform Presentation Preview" 
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-103 opacity-90"
              priority
            />

            {/* Glowing Aura Overlay */}
            <div className="absolute inset-0 bg-neutral-950/15 group-hover:bg-neutral-950/25 transition-colors duration-300 flex items-center justify-center" />

            {/* Pulsing Play Button - Exact Glassmorphic reference style */}
            <div className="w-20 h-20 rounded-full bg-white/25 border border-white/30 backdrop-blur-md shadow-2xl flex items-center justify-center relative z-10 transition-transform duration-300 group-hover:scale-108">
              <Play className="w-8 h-8 text-white fill-current translate-x-0.5" />
            </div>

            {/* Floating Brand Badge */}
            <div className="absolute bottom-5 left-8 bg-black/60 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/10 text-white text-[10px] font-bold tracking-wider uppercase font-sans">
              DevNext Platform Presentation • 2:14 Min
            </div>
          </motion.div>
        </div>

      </section>

      {/* 2b. Pulsing Video Player Modal Overlay */}
      <AnimatePresence>
        {videoOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-4xl aspect-video rounded-[25px] overflow-hidden bg-neutral-950 shadow-2xl border border-white/10">
              {/* Close Button */}
              <button 
                onClick={() => setVideoOpen(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black transition-colors border border-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Responsive Video Frame */}
              <iframe 
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                title="DevNext Ecosystem Overview Video"
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Why Choose Us Section (002 • VALUES - Exquisite Light Theme Capsule Cards with Gradient Transition) */}
      <section className="bg-[linear-gradient(to_bottom,#000_0%,#F4F4F6_18%,#F4F4F6_82%,#000_100%)] text-black py-28 flex flex-col items-center justify-center overflow-hidden relative">
        
        {/* Soft Background Grid Accent with elegant blend */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:45px_45px] opacity-80 pointer-events-none [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]" />

        <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center">
          
          {/* Centered Pill Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-1.5 bg-white border border-neutral-200/80 rounded-full py-1.5 px-4 shadow-sm mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
            <span className="text-[10px] font-bold tracking-widest text-neutral-800 uppercase font-mono">
              002 • VALUES
            </span>
          </motion.div>

          {/* Section Titles */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl md:text-[42px] font-black text-center font-sans tracking-tight text-neutral-900 leading-tight"
          >
            Why Choose Us?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-xs md:text-sm text-neutral-500 text-center max-w-xl leading-relaxed mt-4 mb-16"
          >
            We build adaptive learning paths, real-time consultation rooms, and gamified streaks that eliminate barriers to technical skill mastery.
          </motion.p>

          {/* Three-Column Responsive Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6.5 w-full">
            {chooseUsCards.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: idx * 0.12 }}
                className="bg-white border border-neutral-200/80 rounded-[45px] p-6.5 shadow-[0_15px_40px_rgba(0,0,0,0.03)] relative overflow-hidden group cursor-pointer hover:border-neutral-300 transition-all duration-300 flex flex-col justify-between"
              >
                
                {/* 1. Inner Squircle Container with Dotted Grid Pattern */}
                <div className="relative w-full aspect-[1.1] rounded-[35px] bg-[#1C1C1E] border border-neutral-800 overflow-hidden flex items-center justify-center p-6 shadow-inner">
                  
                  {/* Dotted Matrix Background Grid overlay */}
                  <div className="absolute inset-0 opacity-[0.12]" style={{
                    backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
                    backgroundSize: "8px 8px"
                  }} />

                  {/* Soft Internal Glowing Backdrop Aura */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.07)_0%,transparent_70%)]" />

                  {/* 2. Glassmorphic 3D Interactive Orb in center */}
                  <div className="w-24 h-24 rounded-full bg-gradient-to-b from-white/20 via-white/5 to-white/0 border border-white/20 backdrop-blur-md flex items-center justify-center relative shadow-[0_8px_32px_rgba(0,0,0,0.37)] group-hover:scale-105 transition-transform duration-300">
                    
                    {/* Glossy inner highlights to build 3D curvature */}
                    <div className="absolute inset-2.5 rounded-full bg-gradient-to-b from-white/10 to-transparent border border-white/5 shadow-inner" />
                    
                    {/* The Clean White Vector Brand Icon */}
                    <div className="relative z-10">
                      {card.icon}
                    </div>

                  </div>

                  {/* 3. Small Dark Number Badge overlapping bottom border */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#2C2C2E] border border-white/5 px-3.5 py-1 rounded-full text-[10px] font-bold text-neutral-300 font-mono tracking-widest">
                    {card.num}
                  </div>

                </div>

                {/* 4. Under-card Typography Area */}
                <div className="text-center mt-6 flex flex-col items-center">
                  <h3 className="text-[17px] font-extrabold text-neutral-900 mb-2 font-sans tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-neutral-500 text-[11px] leading-relaxed max-w-[220px]">
                    {card.desc}
                  </p>
                </div>

              </motion.div>
            ))}
          </div>

        </div>

      </section>

      {/* 4. How We Work Section (004 • PROCESS) */}
      <section className="bg-black text-white py-24 flex flex-col items-center justify-center overflow-hidden relative">
        
        {/* Soft Background Grid Accent */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20 pointer-events-none" />

        <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center">
          
          {/* Centered Pill Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full py-1.5 px-4 shadow-md mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#EA8EB5]" />
            <span className="text-[10px] font-bold tracking-widest text-neutral-300 uppercase font-mono">
              004 • PROCESS
            </span>
          </motion.div>

          {/* Section Headings */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl md:text-4xl font-extrabold text-center font-sans tracking-tight max-w-2xl"
          >
            How We Work
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-xs md:text-sm text-neutral-400 text-center max-w-xl leading-relaxed mt-4 mb-20"
          >
            A structured methodology designed to transform complex engineering concepts into hands-on learning achievements — seamlessly.
          </motion.p>

          {/* Alternating Process Timeline Container */}
          <div className="relative w-full flex flex-col gap-10">
            
            {/* Glowing Gradient Center Vertical Timeline Line */}
            <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-0.5 -translate-x-1/2 z-0 bg-gradient-to-b from-[#EA8EB5] via-[#9F9DF4] to-[#60A5FA]" />

            {/* Steps Timeline Grid */}
            {processSteps.map((step, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div 
                  key={idx}
                  className={`w-full flex flex-col md:flex-row relative z-10 ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  
                  {/* Outer Spacing Segment */}
                  <div className="hidden md:block md:w-1/2" />

                  {/* Left / Right Card Container */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 30 : -30, y: 15 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7, delay: idx * 0.05 }}
                    className="w-full md:w-1/2 pl-14 md:pl-0 md:px-12 flex flex-col"
                  >
                    <div className="bg-neutral-900/60 border border-white/5 rounded-3xl p-6 shadow-xl relative hover:border-white/10 transition-colors group">
                      
                      {/* Timeline Central/Left Pin Marker Indicator */}
                      <div className="absolute left-[-40px] md:left-auto md:right-[-59px] md:group-hover:scale-110 top-6 w-5 h-5 rounded-full bg-black border-[3.5px] border-[#9F9DF4] shadow-[0_0_12px_#9F9DF4] z-10 transition-transform duration-300 md:translate-x-1/2" />

                      {/* Header Badge */}
                      <span className="text-[9px] font-bold font-mono tracking-widest text-[#EA8EB5] bg-[#EA8EB5]/10 px-2.5 py-1 rounded-full uppercase">
                        {step.badge}
                      </span>

                      {/* Step Title */}
                      <h3 className="text-sm font-bold text-white mt-4 mb-2">
                        {idx + 1}. {step.title}
                      </h3>

                      {/* Step Description */}
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>

                </div>
              );
            })}

          </div>

        </div>

      </section>

      {/* 5. What We've Built Section (005 • CASE STUDIES) with Slides */}
      <section className="bg-black text-white py-24 flex flex-col items-center justify-center overflow-hidden relative">
        
        <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center">
          
          {/* Centered Pill Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full py-1.5 px-4 shadow-md mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="text-[10px] font-bold tracking-widest text-neutral-300 uppercase font-mono">
              005 • CASE STUDIES
            </span>
          </motion.div>

          {/* Section Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl md:text-4xl font-extrabold text-center font-sans tracking-tight max-w-2xl mb-16"
          >
            What We&apos;ve Built
          </motion.h2>

          {/* Interactive Horizontal Slider Card Frame */}
          <div className="w-full bg-[#141417]/80 border border-white/5 rounded-[45px] p-6 md:p-10 shadow-2xl relative">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center"
              >
                
                {/* Left Side: 3D Render Box Frame */}
                <div className="aspect-square rounded-[30px] bg-neutral-950 border border-white/5 flex items-center justify-center p-3 relative overflow-hidden group shadow-inner">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.015)_0%,transparent_100%)] z-0" />
                  
                  <div className="w-full h-full relative z-10 rounded-[22px] overflow-hidden">
                    <Image 
                      src={caseStudies[activeSlide].imgSrc}
                      alt={caseStudies[activeSlide].title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  
                  {/* Frosted Glass Overlay Ring */}
                  <div className="absolute inset-4 rounded-[26px] border border-white/5 pointer-events-none z-20" />
                </div>

                {/* Right Side: Case Study Metadata & Stats */}
                <div className="flex flex-col justify-center">
                  
                  {/* Modern Corporate Brand Logo */}
                  <div className="flex items-center gap-2.5 mb-6">
                    <div className="w-7 h-7 rounded-full bg-black border border-white/10 flex items-center justify-center shadow-inner">
                      <svg viewBox="0 0 100 100" className="w-5 h-5 text-white">
                        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                          <path
                            key={angle}
                            transform={`rotate(${angle}, 50, 50)`}
                            d="M 50 50 C 47.5 40 44.5 30 41 21 C 46.5 20 48.5 13 50 5 C 51.5 13 53.5 20 59 21 C 55.5 30 52.5 40 50 50 Z"
                            fill="currentColor"
                          />
                        ))}
                      </svg>
                    </div>
                    <span className="text-base font-extrabold tracking-wider text-white uppercase font-sans">
                      DevNext
                    </span>
                  </div>

                  {/* Case Study Title */}
                  <h3 className="text-lg md:text-xl font-bold text-white leading-snug mb-4 font-sans">
                    {caseStudies[activeSlide].title}
                  </h3>

                  {/* Case Study Description */}
                  <p className="text-neutral-400 text-xs md:text-sm leading-relaxed mb-8">
                    {caseStudies[activeSlide].description}
                  </p>

                  {/* Custom Stat Block */}
                  <div className="flex flex-col border-l-2 border-[#60A5FA] pl-5 mt-2">
                    <span className="text-3xl md:text-4xl font-black text-white font-mono tracking-tight leading-none">
                      {caseStudies[activeSlide].statNum}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-1.5">
                      {caseStudies[activeSlide].statDesc}
                    </span>
                  </div>

                </div>

              </motion.div>
            </AnimatePresence>

            {/* Absolute Placed Control Buttons */}
            <div className="flex items-center gap-3.5 absolute bottom-6 right-6 md:bottom-10 md:right-10 z-20">
              <button 
                onClick={() => setActiveSlide((prev) => (prev === 0 ? caseStudies.length - 1 : prev - 1))}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center text-white cursor-pointer select-none"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setActiveSlide((prev) => (prev === caseStudies.length - 1 ? 0 : prev + 1))}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center text-white cursor-pointer select-none"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </section>

      {/* 6. Technology Ecosystem Section (006 • INTEGRATIONS) */}
      <section className="bg-black text-white py-24 flex flex-col items-center justify-center overflow-hidden relative">
        
        <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center mb-10">
          
          {/* Centered Pill Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full py-1.5 px-4 shadow-md mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#EA8EB5]" />
            <span className="text-[10px] font-bold tracking-widest text-neutral-300 uppercase font-mono">
              006 • INTEGRATIONS
            </span>
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl md:text-4xl font-extrabold text-center font-sans tracking-tight max-w-2xl"
          >
            Technology Ecosystem
          </motion.h2>

        </div>

        {/* 6b. Infinite Horizontal Tech Marquees */}
        <div className="w-full flex flex-col gap-5 py-4 overflow-hidden relative z-10">
          
          {/* Custom Webkit/Standard Animation Keyframe Styles */}
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes slideLeft {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            @keyframes slideRight {
              0% { transform: translateX(-50%); }
              100% { transform: translateX(0); }
            }
            .animate-marquee-left {
              animation: slideLeft 45s linear infinite;
            }
            .animate-marquee-right {
              animation: slideRight 45s linear infinite;
            }
          `}} />

          {/* Row 1: Moves Left */}
          <div className="w-full relative flex overflow-x-hidden border-y border-white/5 py-4">
            <div className="flex gap-4 animate-marquee-left whitespace-nowrap">
              {[...techRow1, ...techRow1].map((tech, idx) => (
                <div 
                  key={idx}
                  className="inline-flex items-center gap-2.5 bg-neutral-900/60 border border-white/5 rounded-full px-5 py-2.5 text-xs text-neutral-300 font-bold select-none hover:border-white/10 hover:text-white transition-all cursor-pointer shadow-md"
                >
                  {tech.icon}
                  <span>{tech.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Moves Right */}
          <div className="w-full relative flex overflow-x-hidden border-b border-white/5 pb-4">
            <div className="flex gap-4 animate-marquee-right whitespace-nowrap">
              {[...techRow2, ...techRow2].map((tech, idx) => (
                <div 
                  key={idx}
                  className="inline-flex items-center gap-2.5 bg-neutral-900/60 border border-white/5 rounded-full px-5 py-2.5 text-xs text-neutral-300 font-bold select-none hover:border-white/10 hover:text-white transition-all cursor-pointer shadow-md"
                >
                  {tech.icon}
                  <span>{tech.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Row 3: Moves Left */}
          <div className="w-full relative flex overflow-x-hidden border-b border-white/5 pb-4">
            <div className="flex gap-4 animate-marquee-left whitespace-nowrap">
              {[...techRow3, ...techRow3].map((tech, idx) => (
                <div 
                  key={idx}
                  className="inline-flex items-center gap-2.5 bg-neutral-900/60 border border-white/5 rounded-full px-5 py-2.5 text-xs text-neutral-300 font-bold select-none hover:border-white/10 hover:text-white transition-all cursor-pointer shadow-md"
                >
                  {tech.icon}
                  <span>{tech.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 6c. Centered Technology Orb Area */}
        <div className="w-full max-w-4xl px-6 flex flex-col items-center relative mt-16 z-20">
          
          <div className="relative flex items-center justify-center">
            
            {/* Spinning Curved Circular Text Ring */}
            <div className="absolute w-48 h-48 md:w-56 md:h-56 animate-[spin_25s_linear_infinite] select-none pointer-events-none z-0">
              <svg viewBox="0 0 200 200" className="w-full h-full text-neutral-500/30">
                <path 
                  id="textPath" 
                  d="M 100, 100 m -70, 0 a 70,70 0 1,1 140,0 a 70,70 0 1,1 -140,0" 
                  fill="none" 
                />
                <text className="text-[9px] font-bold font-mono tracking-[4px] fill-current uppercase">
                  <textPath href="#textPath">
                    * Explore DevNext Ecosystem * Advanced Engineering Platform
                  </textPath>
                </text>
              </svg>
            </div>

            {/* Glowing Core Pulse Background */}
            <div className="absolute w-28 h-28 md:w-34 md:h-34 rounded-full bg-gradient-to-tr from-[#EA8EB5] via-[#9F9DF4] to-[#60A5FA] opacity-15 blur-2xl animate-pulse z-0" />

            {/* Central Circle Button */}
            <button className="w-36 h-36 md:w-40 md:h-40 rounded-full bg-black border border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.5),_inset_0_1px_1px_rgba(255,255,255,0.18)] flex flex-col items-center justify-center p-4 cursor-pointer hover:scale-105 active:scale-95 group transition-all duration-300 z-10 relative">
              {/* Branded Spoke Logo Element inside White SVG */}
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white/5 border border-white/10 shadow-inner transition-transform duration-500 group-hover:rotate-45">
                <svg viewBox="0 0 100 100" className="w-8 h-8 text-white">
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                    <path
                      key={angle}
                      transform={`rotate(${angle}, 50, 50)`}
                      d="M 50 50 C 47.5 40 44.5 30 41 21 C 46.5 20 48.5 13 50 5 C 51.5 13 53.5 20 59 21 C 55.5 30 52.5 40 50 50 Z"
                      fill="currentColor"
                    />
                  ))}
                </svg>
              </div>
              <span className="text-[11px] font-bold text-white text-center leading-tight mt-3 uppercase tracking-wider font-sans max-w-[100px]">
                Explore DevNext
              </span>
            </button>

          </div>

        </div>

        {/* Section Subtext at Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="w-full max-w-2xl text-center mt-12 px-6 relative z-20"
        >
          <p className="text-xs md:text-sm text-neutral-500 leading-relaxed max-w-lg mx-auto">
            Our modern stack powers an incredibly responsive, high-performance, and secure learning environment designed to scale effortlessly.
          </p>
        </motion.div>

      </section>

    </div>
  );
}
