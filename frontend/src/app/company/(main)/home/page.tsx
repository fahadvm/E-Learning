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

export default function Home() {
  const { company } = useCompany()
  const router = useRouter()
  const [leaderboard, setLeaderboard] = useState<any[]>([])

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await companyApiMethods.getCompanyLeaderboard()
        if (res?.ok && res.data) {
          console.log(res)
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
    <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-primary/20 to-slate-900" />
      <div className="fixed inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

        {[...Array(80)].map((_, i) => (
          <div
            key={i}
            className="fixed w-px h-px bg-white/70 animate-pulse"
            style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 8}s` }}
          />
        ))}
      </div>

      <div className="relative z-10">

        {/* Header */}
        <Header />

        {/* Hero */}
        <section className="pt-32 pb-24 px-6 text-center">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
              Enterprise Learning <br />
              <span className="bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
                That Drives Results
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              The complete platform trusted by leading organizations to develop talent, ensure compliance, and measure business impact.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="text-lg px-12 py-8 bg-primary hover:bg-primary/90 font-semibold shadow-xl">
                Schedule Enterprise Demo
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-12 py-8 border-white/30 text-white bg-white/5">
                View Case Studies
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-6 py-24">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">Enterprise-Grade Capabilities</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
              {features.map((f, i) => {
                const Icon = f.icon
                return (
                  <div
                    key={i}
                    className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-primary/40 transition-all duration-300"
                  >
                    <Image
                      src={f.image}
                      alt={f.title}
                      width={340}
                      height={200}
                      className="w-full h-48 object-cover rounded-lg mb-6"
                    />
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-primary/20 rounded-lg">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold">{f.title}</h3>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Leaderboard Section */}
        <section className="px-6 py-24 relative overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-20"
            >
              <h2 className="text-5xl font-extrabold text-white mb-6 flex items-center justify-center gap-4">
                <Trophy className="h-12 w-12 text-primary animate-bounce shadow-primary/20" />
                Elite Talent Rankings
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Celebrating our top performers who lead through consistent effort and expert mastery.
              </p>
            </motion.div>

            {leaderboard.length > 0 ? (
              <div className="relative">
                {/* Podium Layout */}
                <div className="flex flex-col md:flex-row items-end justify-center gap-8 md:gap-12 pb-12">

                  {/* 2nd Place */}
                  {leaderboard[1] && (
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                      className="flex flex-col items-center order-2 md:order-1"
                    >
                      <div className="relative group">
                        <div className="absolute -inset-2 bg-slate-400/20 rounded-full blur-xl group-hover:bg-slate-400/40 transition-all" />
                        <div className="relative w-28 h-28 rounded-full border-4 border-slate-400 overflow-hidden bg-slate-900 flex items-center justify-center text-3xl font-bold shadow-2xl">
                          {leaderboard[1].avatar ? (
                            <img src={leaderboard[1].avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            leaderboard[1].name.slice(0, 2).toUpperCase()
                          )}
                        </div>
                        <div className="absolute -top-2 -right-2 w-10 h-10 bg-slate-400 rounded-full flex items-center justify-center text-slate-950 font-bold shadow-lg ring-4 ring-slate-950">
                          2
                        </div>
                      </div>
                      <div className="mt-6 text-center">
                        <h4 className="text-xl font-bold text-white">{leaderboard[1].name}</h4>
                        <div className="flex items-center gap-2 justify-center text-slate-400 font-medium mt-1">
                          <Award className="h-4 w-4" /> 2nd Place
                        </div>
                        <div className="mt-2 inline-block px-4 py-1.5 rounded-full bg-slate-400/10 border border-slate-400/20 text-slate-400 font-bold text-sm">
                          {formatMinutesToHours(leaderboard[1].hours)}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* 1st Place */}
                  {leaderboard[0] && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 60 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
                      className="flex flex-col items-center z-10 order-1 md:order-2"
                    >
                      <div className="relative group">
                        <div className="absolute -inset-4 bg-primary/30 rounded-full blur-2xl group-hover:bg-primary/50 transition-all animate-pulse" />
                        <div className="relative w-40 h-40 rounded-full border-4 border-primary overflow-hidden bg-slate-900 flex items-center justify-center text-5xl font-black shadow-2xl ring-8 ring-primary/10">
                          {leaderboard[0].avatar ? (
                            <img src={leaderboard[0].avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            leaderboard[0].name.slice(0, 2).toUpperCase()
                          )}
                        </div>
                        <div className="absolute -top-4 -right-4 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-2xl ring-4 ring-slate-950 transform rotate-12">
                          <Trophy className="h-8 w-8 text-white fill-white/20" />
                        </div>
                      </div>
                      <div className="mt-8 text-center">
                        <h4 className="text-3xl font-black text-white tracking-tight">{leaderboard[0].name}</h4>
                        <div className="flex items-center gap-2 justify-center text-primary font-black mt-1 uppercase tracking-widest text-sm">
                          <Star className="h-5 w-5 fill-primary" /> Champion
                        </div>
                        <div className="mt-4 inline-block px-6 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary font-black text-lg shadow-lg shadow-primary/10">
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
                      transition={{ delay: 0.6, duration: 0.6 }}
                      className="flex flex-col items-center order-3"
                    >
                      <div className="relative group">
                        <div className="absolute -inset-2 bg-amber-700/20 rounded-full blur-xl group-hover:bg-amber-700/40 transition-all" />
                        <div className="relative w-28 h-28 rounded-full border-4 border-amber-700 overflow-hidden bg-slate-900 flex items-center justify-center text-3xl font-bold shadow-2xl">
                          {leaderboard[2].avatar ? (
                            <img src={leaderboard[2].avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            leaderboard[2].name.slice(0, 2).toUpperCase()
                          )}
                        </div>
                        <div className="absolute -top-2 -right-2 w-10 h-10 bg-amber-700 rounded-full flex items-center justify-center text-white font-bold shadow-lg ring-4 ring-slate-950">
                          3
                        </div>
                      </div>
                      <div className="mt-6 text-center">
                        <h4 className="text-xl font-bold text-white">{leaderboard[2].name}</h4>
                        <div className="flex items-center gap-2 justify-center text-amber-700/80 font-medium mt-1">
                          <Award className="h-4 w-4" /> 3rd Place
                        </div>
                        <div className="mt-2 inline-block px-4 py-1.5 rounded-full bg-amber-700/10 border border-amber-700/20 text-amber-700 font-bold text-sm">
                          {formatMinutesToHours(leaderboard[2].hours)}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* View Full Leaderboard Button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="flex justify-center mt-12"
                >
                  <Button
                    variant="ghost"
                    className="text-primary font-bold gap-2 hover:bg-primary/10 group"
                    onClick={() => router.push('/company/leaderboard')}
                  >
                    View All Company Rankings
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </div>
            ) : (
              <div className="py-20 text-center bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Competition Heating Up!</h3>
                <p className="text-gray-400">Our employees are just getting started. Rankings will appear here soon.</p>
              </div>
            )}
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 py-32 text-center">
          <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-2xl border border-primary/30 p-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">Ready to Transform Your Workforce?</h2>
            <p className="text-xl text-gray-300 mb-10">Join 500+ leading enterprises already using EduPlatform</p>
            <Button size="lg" className="text-xl px-16 py-8 bg-primary hover:bg-primary/90 font-bold shadow-xl">
              Book Enterprise Consultation
            </Button>
          </div>
        </section>

      </div>
    </div>
  )
}
