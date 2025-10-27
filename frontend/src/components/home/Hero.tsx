import { Sparkles, User, GraduationCap, Users, Briefcase } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center space-y-8">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/30 backdrop-blur-sm">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-blue-300">The Future of E-Learning is Here</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-bold leading-tight">
                        <span className="block bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                            Learning Beyond
                        </span>
                        <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent animate-gradient">
                            Boundaries
                        </span>
                    </h1>

                    <p className="max-w-3xl mx-auto text-xl text-gray-300 leading-relaxed">
                        DevNext unifies students, teachers, companies, and employees in a single integrated ecosystem.
                        Experience the next generation of e-learning with AI-powered assistance, real-time collaboration,
                        and personalized learning paths.
                    </p>

                    {/* Start Journey Button */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-2xl shadow-blue-500/30 flex items-center space-x-2">
                            <span className="font-semibold">Start Your Journey</span>
                        </button>
                    </div>

                    {/* Platform Selection */}
                    <div className="pt-8 flex flex-wrap justify-center gap-6">
                        {[
                            { name: "Student", icon: User, href: "student/login" },
                            { name: "Teacher", icon: GraduationCap, href: "teacher/login" },
                            { name: "Company", icon: Briefcase, href: "company/login" },
                            { name: "Employee", icon: Users, href: "employee/login" },
                        ].map((platform) => {
                            const Icon = platform.icon;
                            return (
                                <button
                                    key={platform.name}
                                    className="flex flex-col items-center justify-center w-40 h-40 bg-gradient-to-tr from-blue-700 to-cyan-500 rounded-2xl shadow-lg hover:scale-105 transform transition-all hover:shadow-2xl"
                                >
                                    <Icon className="w-12 h-12 text-white mb-2" />
                                    <span className="text-white font-semibold">{platform.name}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* DevNext Platform Card */}
                    <div className="pt-12 relative">
                        <div className="relative mx-auto max-w-5xl">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur-3xl opacity-20 animate-pulse" />
                            <div className="relative aspect-video rounded-2xl border border-white/10 bg-gradient-to-br from-blue-950/50 to-black/50 backdrop-blur-xl overflow-hidden shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-cyan-500/10" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="space-y-4 text-center p-8">
                                        <div className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                            DevNext Platform
                                        </div>
                                        <div className="text-gray-400">Interactive Learning Environment</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute top-1/4 left-10 w-72 h-72 bg-blue-600 rounded-full blur-[120px] opacity-20 animate-pulse" />
            <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-cyan-600 rounded-full blur-[150px] opacity-20 animate-pulse delay-1000" />
        </section>
    );
}
