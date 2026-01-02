"use client"

import { useState, useEffect } from "react"
import { companyApiMethods } from "@/services/APIservices/companyApiService"
import { useCompany } from "@/context/companyContext"
import { formatMinutesToHours } from "@/utils/timeConverter"
import { ShoppingCart, MapPin, UserPlus, TrendingUp, Trophy, Star, Award, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Header from "@/components/company/Header"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface LeaderboardEntry {
  name: string;
  avatar?: string;
  hours: number;
}

export default function Home() {
  const { company } = useCompany()
  const router = useRouter()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await companyApiMethods.getCompanyLeaderboard() as { ok: boolean; data: { leaderboard: LeaderboardEntry[] } } | null;
        if (res?.ok && res.data) {
          setLeaderboard(res.data.leaderboard.slice(0, 3))
        }
      } catch (error) {
        console.error("Error fetching company leaderboard:", error)
      }
    }
    fetchLeaderboard()
  }, [])

  const features = [
    { icon: ShoppingCart, title: "Purchase Premium Courses", desc: "Curated enterprise-grade content from global experts", image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80" },
    { icon: MapPin, title: "Build Custom Learning Paths", desc: "Tailored skill development aligned with business objectives", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80" },
    { icon: UserPlus, title: "Assign to Employees", desc: "Role-based training deployment across teams and regions", image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=800&q=80" },
    { icon: TrendingUp, title: "Track Progress & Analytics", desc: "Real-time reporting and compliance dashboards", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" },
    { icon: Trophy, title: "Leaderboard & Recognition", desc: "Celebrate top performers and drive healthy competition", image: "https://images.unsplash.com/photo-1582213782179-8574f5d43e48?auto=format&fit=crop&w=800&q=80" },
  ]

  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-primary/20 to-slate-900" />

      {/* Animated Stars Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 sm:left-20 w-72 sm:w-96 h-72 sm:h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 sm:right-20 w-72 sm:w-96 h-72 sm:h-96 bg-secondary/10 rounded-full blur-3xl" />

        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-px h-px bg-white/60 animate-pulse hidden sm:block"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <Header />

        {/* Hero Section */}
        <section className="pt-24 pb-16 px-6 sm:pt-32 sm:pb-24 text-center">
          <div className="max-w-5xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 sm:mb-8 leading-tight"
            >
              Enterprise Learning <br className="sm:block hidden" />
              <span className="bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
                That Drives Results
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-lg sm:text-xl text-gray-300 mb-10 sm:mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              The complete platform trusted by leading organizations to develop talent, ensure compliance, and measure business impact.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center"
            >
              <Link href="/company/courses">

                <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-10 sm:px-12 py-6 sm:py-8 bg-primary hover:bg-primary/90 font-semibold shadow-xl">
                  Explore Courses
                </Button>
              </Link>

              <Link href="/company/learningpath">

                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base sm:text-lg px-10 sm:px-12 py-6 sm:py-8 border-white/30 text-white bg-white/5 hover:bg-white/10">
                  Create Learning path
                </Button>
              </Link>

            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-16 sm:py-24">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12 sm:mb-16"
            >
              Enterprise-Grade Capabilities
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 sm:gap-8">
              {features.map((f, i) => {
                const Icon = f.icon
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group p-6 sm:p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-primary/40 hover:bg-white/10 transition-all duration-500"
                  >
                    <div className="relative overflow-hidden rounded-lg mb-6 aspect-video">
                      <Image
                        src={f.image}
                        alt={f.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold">{f.title}</h3>
                    </div>
                    <p className="text-sm sm:text-base text-gray-400 leading-relaxed">{f.desc}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Leaderboard Section */}
        <section className="px-6 py-16 sm:py-24">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 sm:mb-20"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 sm:mb-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Trophy className="h-10 w-10 sm:h-12 sm:w-12 text-primary animate-bounce" />
                <span>Elite Talent Rankings</span>
              </h2>
              <p className="text-base sm:text-xl text-gray-400 max-w-2xl mx-auto px-4">
                Celebrating our top performers who lead through consistent effort and expert mastery.
              </p>
            </motion.div>

            {leaderboard.length > 0 ? (
              <div className="flex flex-col items-center">
                {/* Mobile: Vertical Stack | Desktop: Podium Layout */}
                <div className="flex flex-col lg:flex-row items-end justify-center gap-8 lg:gap-12 w-full max-w-4xl">

                  {/* 2nd Place */}
                  {leaderboard[1] && (
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                      className="flex flex-col items-center w-full lg:w-auto order-2 lg:order-1"
                    >
                      <div className="relative group mb-4 lg:mb-0">
                        <div className="absolute -inset-2 bg-slate-400/20 rounded-full blur-xl group-hover:bg-slate-400/40 transition-all" />
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-slate-400 overflow-hidden bg-slate-900 shadow-2xl">
                          {leaderboard[1].avatar ? (
                            <img src={leaderboard[1].avatar} alt={leaderboard[1].name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl sm:text-3xl font-bold">
                              {leaderboard[1].name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 bg-slate-400 rounded-full flex items-center justify-center text-slate-950 font-bold text-sm sm:text-base shadow-lg">
                          2
                        </div>
                      </div>
                      <div className="text-center">
                        <h4 className="text-lg sm:text-xl font-bold">{leaderboard[1].name}</h4>
                        <p className="text-sm sm:text-base text-slate-400 mt-1">2nd Place</p>
                        <div className="mt-3 px-4 py-2 rounded-full bg-slate-400/10 border border-slate-400/30 text-slate-300 text-sm font-bold">
                          {formatMinutesToHours(leaderboard[1].hours)}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* 1st Place - Always on top in mobile */}
                  {leaderboard[0] && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
                      className="flex flex-col items-center order-1 lg:order-2 z-10"
                    >
                      <div className="relative group mb-6 lg:mb-0">
                        <div className="absolute -inset-4 bg-primary/30 rounded-full blur-2xl group-hover:bg-primary/50 transition-all animate-pulse" />
                        <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 sm:border-[6px] border-primary overflow-hidden bg-slate-900 shadow-2xl ring-8 ring-primary/20">
                          {leaderboard[0].avatar ? (
                            <img src={leaderboard[0].avatar} alt={leaderboard[0].name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl sm:text-5xl font-black">
                              {leaderboard[0].name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="absolute -top-3 -right-3 w-12 h-12 sm:w-14 sm:h-14 bg-primary rounded-full flex items-center justify-center shadow-2xl">
                          <Trophy className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                        </div>
                      </div>
                      <div className="text-center">
                        <h4 className="text-2xl sm:text-3xl font-black">{leaderboard[0].name}</h4>
                        <p className="text-primary font-bold uppercase tracking-wider text-sm sm:text-base mt-1">Champion</p>
                        <div className="mt-4 px-6 py-3 rounded-full bg-primary/20 border-2 border-primary/50 text-primary font-black text-base sm:text-lg">
                          {formatMinutesToHours(leaderboard[0].hours)}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* 3rd Place */}
                  {leaderboard[2] && (
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 }}
                      className="flex flex-col items-center w-full lg:w-auto order-3"
                    >
                      <div className="relative group mb-4 lg:mb-0">
                        <div className="absolute -inset-2 bg-amber-600/20 rounded-full blur-xl group-hover:bg-amber-600/40 transition-all" />
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-amber-600 overflow-hidden bg-slate-900 shadow-2xl">
                          {leaderboard[2].avatar ? (
                            <img src={leaderboard[2].avatar} alt={leaderboard[2].name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl sm:text-3xl font-bold">
                              {leaderboard[2].name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg">
                          3
                        </div>
                      </div>
                      <div className="text-center">
                        <h4 className="text-lg sm:text-xl font-bold">{leaderboard[2].name}</h4>
                        <p className="text-amber-500 text-sm sm:text-base mt-1">3rd Place</p>
                        <div className="mt-3 px-4 py-2 rounded-full bg-amber-600/10 border border-amber-600/30 text-amber-400 text-sm font-bold">
                          {formatMinutesToHours(leaderboard[2].hours)}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="mt-12 sm:mt-16"
                >
                  <Button
                    variant="ghost"
                    size="lg"
                    className="text-primary font-bold text-base sm:text-lg gap-2 hover:bg-primary/10"
                    onClick={() => router.push('/company/leaderboard')}
                  >
                    View All Company Rankings
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </div>
            ) : (
              <div className="py-16 sm:py-20 text-center bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 max-w-2xl mx-auto">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-3">Competition Heating Up!</h3>
                <p className="text-gray-400 text-base sm:text-lg px-6">
                  Our employees are just getting started. Rankings will appear here soon.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 py-20 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-2xl border border-primary/30 p-10 sm:p-16 text-center"
          >
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Ready to Transform Your Workforce?
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-10">
              Join 500+ leading enterprises already using EduPlatform
            </p>
            <Link href="/company/employees">
              <Button
                size="lg"
                className="
    w-full 
    max-w-md 
    mx-auto 
    text-base 
    sm:text-lg 
    lg:text-xl 
    px-8 
    sm:px-12 
    lg:px-16 
    py-6 
    sm:py-7 
    lg:py-8 
    bg-primary 
    hover:bg-primary/90 
    font-bold 
    shadow-2xl 
    transition-all 
    duration-300
  "
              >
                Add Employees
              </Button>
            </Link>
          </motion.div>
        </section>
      </div>
    </div>
  )
}