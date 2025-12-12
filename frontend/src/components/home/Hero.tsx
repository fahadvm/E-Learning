import { Sparkles, User, GraduationCap, Users, Briefcase, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import Link from "next/link";


const platforms = [
    {
        name: "Student",
        icon: User,
        href: "student/login",
        description: "Access courses & track progress",
        color: "from-blue-500 to-blue-600"
    },
    {
        name: "Teacher",
        icon: GraduationCap,
        href: "teacher/login",
        description: "Create & manage your courses",
        color: "from-cyan-500 to-cyan-600"
    },
    {
        name: "Company",
        icon: Briefcase,
        href: "company/login",
        description: "Train your workforce",
        color: "from-blue-600 to-cyan-500"
    },
    {
        name: "Employee",
        icon: Users,
        href: "employee/login",
        description: "Upskill & grow your career",
        color: "from-cyan-600 to-blue-500"
    },
];

export default function Hero() {
    const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null);

    return (
        <section className="relative min-h-screen pt-32 pb-20 px-6 ">
            <div className="max-w-7xl mx-auto">
                <div className="text-center space-y-8">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-card">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm text-primary">The Future of E-Learning is Here</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-bold leading-tight">
                        <span className="block bg-gradient-to-r from-foreground via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                            Learning Beyond
                        </span>
                        <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent animate-gradient">
                            Boundaries
                        </span>
                    </h1>

                    <p className="max-w-3xl mx-auto text-xl text-muted-foreground leading-relaxed">
                        DevNext unifies students, teachers, companies, and employees in a single integrated ecosystem.
                        Experience the next generation of e-learning with AI-powered assistance, real-time collaboration,
                        and personalized learning paths.
                    </p>

                    {/* Start Journey Button */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-2xl shadow-primary/30 flex items-center space-x-2">
                            <span className="font-semibold text-white">Start Your Journey</span>
                            <ArrowRight className="w-5 h-5 text-foreground group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Platform Selection - Enhanced */}
                    <div className="pt-12">
                        <p className="text-white mb-8 text-sm uppercase tracking-widest">Choose Your Portal</p>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                            {platforms.map((platform, index) => {
                                const Icon = platform.icon;
                                const isHovered = hoveredPlatform === platform.name;

                                return (
                                    <Link
                                        href={`/${platform.href}`}

                                        key={platform.name}
                                        onMouseEnter={() => setHoveredPlatform(platform.name)}
                                        onMouseLeave={() => setHoveredPlatform(null)}
                                        className="group relative"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        {/* Glow Effect */}
                                        <div
                                            className={`absolute inset-0 bg-gradient-to-r ${platform.color} rounded-2xl blur-xl transition-opacity duration-500 ${isHovered ? 'opacity-40' : 'opacity-0'
                                                }`}
                                        />

                                        {/* Card */}
                                        <div className="relative gradient-border rounded-2xl p-6 h-full transition-all duration-300 group-hover:scale-[1.02] group-hover:-translate-y-1">
                                            {/* Icon Container */}
                                            <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r ${platform.color} p-[1px] transition-all duration-300 group-hover:scale-110`}>
                                                <div className="w-full h-full rounded-xl bg-black flex items-center justify-center">
                                                    <Icon className={`w-8 h-8 bg-gradient-to-r ${platform.color} bg-clip-text transition-all duration-300`} style={{ color: isHovered ? 'hsl(199 89% 48%)' : 'hsl(210 40% 98%)' }} />
                                                </div>
                                            </div>

                                            {/* Text */}
                                            <h3 className="text-lg font-semibold text-foreground mb-1 transition-colors">
                                                {platform.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground transition-colors group-hover:text-foreground/70">
                                                {platform.description}
                                            </p>

                                            {/* Arrow indicator */}
                                            <div className={`mt-4 flex items-center justify-center gap-1 text-primary transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                                                }`}>
                                                <span className="text-sm font-medium">Enter</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* DevNext Platform Card */}


                    <div className="pt-16 relative">
                        <div className="relative mx-auto max-w-5xl">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur-3xl opacity-20 animate-pulse" />

                            <div className="relative aspect-video rounded-2xl border border-border glass-card overflow-hidden shadow-2xl">

                                {/* Background Image */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                                    style={{ backgroundImage: "url('/gallery/herobghome.png')" }}
                                />

                                {/* Existing gradient overlay */}
                                <div className="absolute inset-0 bg-black/70 via-transparent to-accent/10" />

                                {/* Text Content */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="space-y-4 text-center p-8">
                                        <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                            DevNext Platform
                                        </div>
                                        <div className="text-muted-foreground">
                                            Interactive Learning Environment
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>





                </div>
            </div>

            {/* Background Effects */}
            <div className="absolute top-1/4 left-10 w-72 h-72 bg-blue-600 rounded-full blur-[120px] opacity-20 animate-pulse" />
            <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-cyan-600 rounded-full blur-[150px] opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
        </section>
    );
}
