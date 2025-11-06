'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useEmployee } from '@/context/employeeContext';
import { useRouter } from "next/navigation";
import { useInView } from 'react-intersection-observer';
import VANTA from 'vanta/dist/vanta.waves.min';
import * as THREE from 'three';

import {
  ChevronRight, PlayCircle, Award, Calendar, TrendingUp, Users, Star, ArrowRight, BookOpen,
  Target,
  BarChart3,
  Lightbulb,
  Clock,
  Shield,
  Zap,
  Trophy,
  Building2,
  Layers
} from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Senior Developer",
    company: "TechCorp",
    content: "DevNext transformed how I approach learning. The personalized paths and expert mentors helped me level up faster than ever.",
    avatar: "SC"
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "Engineering Manager",
    company: "InnovateCo",
    content: "I've seen my team's productivity soar since implementing DevNext. The progress tracking keeps everyone motivated.",
    avatar: "MR"
  },
  {
    id: 3,
    name: "Emily Watson",
    role: "Product Designer",
    company: "DesignHub",
    content: "The flexible learning schedule fits perfectly with my work. I've earned 12 badges in just 3 months!",
    avatar: "EW"
  }
];


const leaderboard = [
  { name: "Aisha Khan", photo: "/user1.jpg" },
  { name: "Rahul Verma", photo: "/user2.jpg" },
  { name: "Sana Mir", photo: "/user3.jpg" }
];

export default function DevNextLanding() {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef<HTMLDivElement>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const { employee } = useEmployee()
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const router = useRouter();


  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      setVantaEffect(
        VANTA({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200,
          minWidth: 200,
          scale: 1,
          scaleMobile: 1,
          color: 0x3b82f6,
          shininess: 120,
          waveHeight: 20,
          waveSpeed: 0.75,
          zoom: 0.85,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <PlayCircle className="w-8 h-8" />,
      title: "Learn Anytime",
      description: "Access courses 24/7 from any device with offline support"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Earn Recognition",
      description: "Get certified badges that showcase your achievements"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert Mentors",
      description: "Book 1-on-1 sessions with industry leaders"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Track Progress",
      description: "Visual dashboards show your growth journey"
    }
  ];

  const benefits = [
    {
      title: "Learn at Your Pace",
      description: "Flexible scheduling that fits your work life. Pause, resume, and learn on your terms.",
      image: "/benefits/learn.png",
    },
    {
      title: "Earn Badges & Certificates",
      description: "Showcase your skills with verifiable digital credentials recognized by top companies.",
      image: "/benefits/certificate.png",
    },
    {
      title: "Personalized Learning Path",
      description: "Progress through structured courses step-by-step, unlocking new levels as you grow.",
      image: "/benefits/learningpath.jpg",
    },
    {
      title: "Track Streaks & Progress",
      description: "Stay motivated with daily streaks, milestones, and detailed analytics.",
      image: "/benefits/streak.png",
    }
  ];


  return (
    <>
      {/* Hero Section */}
      <section ref={vantaRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 opacity-50" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        >
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight"
          >
            Grow Your Skills.
            <br />
            <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
              Unlock Your Potential.
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto"
          >
            Transform your career with personalized learning paths, expert mentors,
            and a supportive community that celebrates every milestone.
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="group px-8 py-4 bg-white text-blue-900 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105">
              Start Learning
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-blue-900 transition-all duration-300">
              Explore Courses
            </button>
          </motion.div>
        </motion.div>

        {/* Floating 3D Elements */}
        <motion.div style={{ y }} className="absolute top-32 left-10 text-6xl opacity-20">
          <Target className="w-16 h-16 text-yellow-300" />
        </motion.div>
        <motion.div style={{ y }} className="absolute top-48 right-20 text-5xl opacity-20">
          <BarChart3 className="w-14 h-14 text-pink-300" />
        </motion.div>
        <motion.div style={{ y }} className="absolute bottom-32 left-20 text-7xl opacity-20">
          <Lightbulb className="w-20 h-20 text-purple-300" />
        </motion.div>
      </section>

      {/* ====================== LEADERBOARD PODIUM ====================== */}
      <section className="py-24 px-4 bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Top Performers</h2>
            <p className="text-xl text-gray-600">
              {employee?.companyId
                ? 'Your company leaderboard – see who’s leading the pack'
                : 'Join a company to compete and grow together'}
            </p>
          </motion.div>

          {employee?.companyId ? (
            /* ---------- PODIUM (1st, 2nd, 3rd) ---------- */
            <div className="flex flex-col md:flex-row items-end justify-center gap-6 md:gap-12">
              {/* 2nd Place */}
              {leaderboard[1] && (
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.7 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full opacity-30 blur-xl animate-pulse" />
                    <img
                      src={leaderboard[1].photo || '/default-avatar.png'}
                      alt={leaderboard[1].name}
                      className="relative w-28 h-28 rounded-full object-cover border-4 border-gray-300 shadow-xl"
                    />
                    <div className="absolute -top-2 -right-2 bg-gradient-to-br from-gray-400 to-gray-600 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                      2
                    </div>
                  </div>
                  <h4 className="mt-4 text-lg font-semibold text-gray-800">{leaderboard[1].name}</h4>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Award className="w-4 h-4 text-gray-500" /> 2nd Place
                  </p>
                </motion.div>
              )}

              {/* 1st Place – BIGGER */}
              {leaderboard[0] && (
                <motion.div
                  initial={{ opacity: 0, y: 80, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.8, type: 'spring', stiffness: 120 }}
                  className="flex flex-col items-center order-first md:order-none"
                >
                  <div className="relative">
                    <div className="absolute -inset-3 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full opacity-40 blur-2xl animate-pulse" />
                    <img
                      src={leaderboard[0].photo || '/default-avatar.png'}
                      alt={leaderboard[0].name}
                      className="relative w-36 h-36 rounded-full object-cover border-4 border-yellow-400 shadow-2xl ring-4 ring-yellow-300 ring-opacity-50"
                    />
                    <div className="absolute -top-3 -right-3 bg-gradient-to-br from-yellow-400 to-amber-600 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
                      <Trophy className="w-6 h-6" />
                    </div>
                  </div>
                  <h4 className="mt-5 text-xl font-bold text-gray-900">{leaderboard[0].name}</h4>
                  <p className="text-base font-semibold text-yellow-600 flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" /> 1st Place
                  </p>
                </motion.div>
              )}

              {/* 3rd Place */}
              {leaderboard[2] && (
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.7 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-30 blur-xl animate-pulse" />
                    <img
                      src={leaderboard[2].photo || '/default-avatar.png'}
                      alt={leaderboard[2].name}
                      className="relative w-28 h-28 rounded-full object-cover border-4 border-orange-400 shadow-xl"
                    />
                    <div className="absolute -top-2 -right-2 bg-gradient-to-br from-orange-400 to-red-500 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                      3
                    </div>
                  </div>
                  <h4 className="mt-4 text-lg font-semibold text-gray-800">{leaderboard[2].name}</h4>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Award className="w-4 h-4 text-orange-500" /> 3rd Place
                  </p>
                </motion.div>
              )}
            </div>
          ) : (
            /* ---------- NOT IN COMPANY ---------- */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-6">
                <Users className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                You’re not part of a company yet
              </h3>
              <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
                Join a company to unlock leaderboards, team learning paths, and collaborative growth.
              </p>
              <button
                onClick={() => router.push('/employee/company')}
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <Building2 className="w-5 h-5" />
                Join a Company
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Why DevNext Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Why DevNext?</h2>
            <p className="text-xl text-gray-600">Everything you need to grow, in one platform</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const [ref, inView] = useInView({
                threshold: 0.1,
                triggerOnce: true
              });

              return (
                <motion.div
                  key={index}
                  ref={ref}
                  initial={{ opacity: 0, y: 50 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="group"
                >
                  <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 h-full border border-gray-100">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What You Can Do Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {benefits.map((b, i) => {
            const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
            return (
              <motion.div
                key={i}
                ref={ref}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.2, duration: 0.8 }}
                className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center mb-24 last:mb-0`}
              >
                <div className="flex-1 flex justify-center">
                  <img
                    src={b.image}
                    alt={b.title}
                    className="w-90 h-70 object-cover rounded-xl shadow-lg"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">{b.title}</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">{b.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>



      {/* Final CTA Section */}
      <section className="relative py-32 px-4">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl max-w-7xl mx-auto">

          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600" />
          <div className="absolute inset-0 bg-black opacity-10" />

          {/* Ripple animation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
              className="absolute w-96 h-96 bg-white rounded-full opacity-10"
            />
            <motion.div
              animate={{ scale: [1, 1.8, 1], opacity: [0.2, 0, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 1 }}
              className="absolute w-96 h-96 bg-white rounded-full opacity-10"
            />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center py-32 px-6">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold text-white mb-8"
            >
              Become the best version
              <br />
              <span className="text-yellow-300">of yourself.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto"
            >
              Join thousands of professionals who are already transforming their careers with DevNext.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <button className="group px-12 py-6 bg-white text-blue-900 rounded-full font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-3 mx-auto hover:scale-105">
                <PlayCircle className="w-8 h-8" />
                Start Now
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>

        </div>
      </section>
    </>
  );
}