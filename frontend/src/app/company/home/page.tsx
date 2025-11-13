"use client"

import { ShoppingCart, MapPin, UserPlus, TrendingUp, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/company/Header"

export default function Home() {
  const features = [
    {
      icon: ShoppingCart,
      title: "Purchase Premium Courses",
      description:
        "Access a curated library of high-quality courses from industry experts. Tailor your selections to your company's needs and budget.",
    },
    {
      icon: MapPin,
      title: "Build Custom Learning Paths",
      description:
        "Combine courses into structured paths that align with your team's goals. Create engaging, progressive journeys for skill development.",
    },
    {
      icon: UserPlus,
      title: "Assign to Employees",
      description:
        "Easily assign learning paths to individuals or groups. Ensure every employee gets the training they need to excel.",
    },
    {
      icon: TrendingUp,
      title: "Track Progress & Analytics",
      description:
        "Monitor real-time progress for all employees or individuals. Gain insights with detailed reports and dashboards.",
    },
    {
      icon: Trophy,
      title: "Leaderboard & Top 50 Ranks",
      description:
        "Foster healthy competition with a dynamic leaderboard showcasing the top 50 performers. Celebrate achievements and motivate excellence.",
    },
  ]

  const topThree = [
    { rank: 1, name: "Alex Johnson", score: 98 },
    { rank: 2, name: "Maria Garcia", score: 96 },
    { rank: 3, name: "Liam Chen", score: 94 },
  ]

  const topTen = [
    { rank: 1, name: "Alex Johnson", score: 98 },
    { rank: 2, name: "Maria Garcia", score: 96 },
    { rank: 3, name: "Liam Chen", score: 94 },
    { rank: 4, name: "Sophia Patel", score: 92 },
    { rank: 5, name: "Ethan Lee", score: 90 },
    { rank: 6, name: "Isabella Rodriguez", score: 88 },
    { rank: 7, name: "James Wilson", score: 86 },
    { rank: 8, name: "Emma Martinez", score: 84 },
    { rank: 9, name: "Oliver Brown", score: 82 },
    { rank: 10, name: "Ava Taylor", score: 80 },
  ]

  return (
    <div className="galaxy-bg min-h-screen">
      <div className="floating-stars">
        <div
          className="star star-1"
          style={{ width: "2px", height: "2px", top: "10%", left: "5%", animationDelay: "0s" }}
        />
        <div
          className="star star-2"
          style={{ width: "1px", height: "1px", top: "20%", left: "15%", animationDelay: "0.5s" }}
        />
        <div
          className="star star-3"
          style={{ width: "2px", height: "2px", top: "30%", left: "25%", animationDelay: "1s" }}
        />
        <div
          className="star star-1"
          style={{ width: "1px", height: "1px", top: "40%", left: "35%", animationDelay: "1.5s" }}
        />
        <div
          className="star star-2"
          style={{ width: "2px", height: "2px", top: "50%", left: "45%", animationDelay: "2s" }}
        />
        <div
          className="star star-3"
          style={{ width: "1px", height: "1px", top: "60%", left: "55%", animationDelay: "2.5s" }}
        />
        <div
          className="star star-1"
          style={{ width: "2px", height: "2px", top: "70%", left: "65%", animationDelay: "3s" }}
        />
        <div
          className="star star-2"
          style={{ width: "1px", height: "1px", top: "80%", left: "75%", animationDelay: "3.5s" }}
        />
        <div
          className="star star-3"
          style={{ width: "2px", height: "2px", top: "90%", left: "85%", animationDelay: "4s" }}
        />
      </div>

      {/* Header Section */}
      
      <Header/>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-balance mb-6 bg-gradient-to-r from-white via-accent to-primary bg-clip-text text-transparent">
            Transform Learning Into Excellence
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance">
            Empower your team with premium courses, custom learning paths, and real-time analytics to track progress and
            celebrate success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-accent/30 hover:bg-black bg-transparent">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-balance">
            Powerful Features for Modern Learning
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div
                  key={idx}
                  className="glow-border rounded-lg p-6 bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all duration-300"
                >
                  <div className="mb-4 inline-flex p-3 bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg">
                    <Icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-balance">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground text-balance">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="relative z-10 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center text-balance">Top Performers Leaderboard</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Top 3 */}
            <div className="glow-border rounded-lg p-8 bg-black/40 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-accent" />
                Top 3 Ranks
              </h3>
              <div className="space-y-4">
                {topThree.map((performer) => (
                  <div
                    key={performer.rank}
                    className="flex items-center justify-between p-4 bg-black/50 rounded-lg border border-accent/10 hover:border-accent/30 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-accent to-primary text-sm font-bold text-white">
                        {performer.rank}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{performer.name}</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-accent">{performer.score}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top 10 */}
            <div className="glow-border rounded-lg p-8 bg-black/40 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                Top 10 Ranks
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                {topTen.map((performer) => (
                  <div
                    key={performer.rank}
                    className="flex items-center justify-between p-3 bg-black/50 rounded-lg border border-accent/10 hover:border-accent/30 transition-all text-sm text-white"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-accent/50 to-primary/50 text-xs font-bold text-white">
                        {performer.rank}
                      </div>
                      <span className="text-foreground truncate">{performer.name}</span>
                    </div>
                    <span className="text-accent font-semibold ml-2">{performer.score}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-24">
        <div className="mx-auto max-w-4xl glow-border rounded-lg p-12 md:p-16 bg-black/40 backdrop-blur-sm text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Ready to Transform Your Team's Learning?</h2>
          <p className="text-lg text-muted-foreground mb-8 text-balance">
            Join thousands of companies using EduPlatform to build engaged, skilled teams.
          </p>
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Start Your Free Trial Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-accent/20 bg-gradient-to-t from-black/60 to-black/30 backdrop-blur-xl mt-24">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-accent transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-accent transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-accent transition">
                    Docs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition">
                    Community
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-accent transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-accent/20 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 EduPlatform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
