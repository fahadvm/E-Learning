import { Code, Video, MessageSquare, BarChart3, Sparkles, Zap, Shield, Globe } from 'lucide-react';

const features = [
  {
    icon: Code,
    title: 'Built-in Code Compiler',
    description: 'Practice coding in real-time with our integrated online compiler supporting multiple languages.',
    gradient: 'from-blue-600 to-cyan-600'
  },
  {
    icon: Video,
    title: 'Live Video Sessions',
    description: 'Connect one-on-one with teachers and mentors through seamless video calling integration.',
    gradient: 'from-cyan-600 to-teal-600'
  },
  {
    icon: MessageSquare,
    title: 'Interactive Communities',
    description: 'Engage in course-specific communities for collaboration, discussion, and peer learning.',
    gradient: 'from-teal-600 to-green-600'
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Track progress, engagement, and performance with comprehensive analytics dashboards.',
    gradient: 'from-green-600 to-blue-600'
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Assistance',
    description: 'Get personalized learning recommendations and instant help from our AI assistant.',
    gradient: 'from-purple-600 to-blue-600'
  },
  {
    icon: Zap,
    title: 'Real-Time Notifications',
    description: 'Stay updated with instant notifications for assignments, messages, and course updates.',
    gradient: 'from-yellow-600 to-orange-600'
  },
  {
    icon: Shield,
    title: 'Secure Authentication',
    description: 'Enterprise-grade security with JWT, OTP, and Google OAuth authentication.',
    gradient: 'from-red-600 to-pink-600'
  },
  {
    icon: Globe,
    title: 'Cloud-Based Storage',
    description: 'Store and stream video content securely with Cloudinary integration.',
    gradient: 'from-pink-600 to-purple-600'
  }
];

export default function Features() {
  return (
    <section id="features" className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-20">
          <h2 className="text-5xl md:text-6xl font-bold">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Powerful Features for
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Modern Learning
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to create, manage, and scale your learning experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-cyan-600/0 group-hover:from-blue-600/5 group-hover:to-cyan-600/5 rounded-2xl transition-all duration-300" />

              <div className="relative space-y-4">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} opacity-90`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-xl font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl bg-gradient-to-br ${feature.gradient} blur-xl -z-10`} style={{ filter: 'blur(40px)' }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
