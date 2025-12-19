"use client"

import { ShoppingCart, MapPin, UserPlus, TrendingUp, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Header from "@/components/company/Header"

export default function Home() {
  const features = [
    { icon: ShoppingCart, title: "Purchase Premium Courses", desc: "Curated enterprise-grade content from global experts", image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80" },
    { icon: MapPin, title: "Build Custom Learning Paths", desc: "Tailored skill development aligned with business objectives", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80" },
    { icon: UserPlus, title: "Assign to Employees", desc: "Role-based training deployment across teams and regions", image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=800&q=80" },
    { icon: TrendingUp, title: "Track Progress & Analytics", desc: "Real-time reporting and compliance dashboards", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" },
    { icon: Trophy, title: "Leaderboard & Recognition", desc: "Celebrate top performers and drive healthy competition", image: "https://images.unsplash.com/photo-1582213782179-8574f5d43e48?auto=format&fit=crop&w=800&q=80" },
  ]

  const leaderboard = [
    { rank: 1, name: "Fahad vm", role: "Senior Director, Engineering", score: 98, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80" },
    { rank: 2, name: "Risvana", role: "VP of Product", score: 96, avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80" },
    { rank: 3, name: "Ajmal", role: "Head of Data Science", score: 94, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" },
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
      <Header/>

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

        {/* Leaderboard */}
        <section className="px-6 py-24">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-12">
              <h2 className="text-4xl font-bold text-center mb-12 flex items-center justify-center gap-3">
                <Trophy className="h-10 w-10 text-primary" />
                Top Performers This Quarter
              </h2>

              <div className="space-y-6">
                {leaderboard.map((p) => (
                  <div key={p.rank} className="flex items-center justify-between p-6 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-6">
                      <Image
                        src={p.avatar}
                        alt={p.name}
                        width={64}
                        height={64}
                        className="rounded-full ring-4 ring-primary/20"
                      />
                      <div>
                        <div className="text-xl font-semibold">{p.name}</div>
                        <div className="text-sm text-gray-400">{p.role}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-4xl font-bold text-primary">{p.score}%</div>
                      <div className="text-sm text-gray-400">Completion Rate</div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
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
