import { Code, Database, Lock, Layers } from 'lucide-react';

const techStack = [
  {
    category: 'Frontend',
    icon: Code,
    technologies: ['Next.js', 'TypeScript', 'React', 'Tailwind CSS'],
    gradient: 'from-blue-600 to-cyan-600'
  },
  {
    category: 'Backend',
    icon: Layers,
    technologies: ['Node.js', 'Express', 'Inversify', 'Clean Architecture'],
    gradient: 'from-cyan-600 to-teal-600'
  },
  {
    category: 'Database',
    icon: Database,
    technologies: ['MongoDB', 'Mongoose', 'Redis', 'Cloudinary'],
    gradient: 'from-teal-600 to-green-600'
  },
  {
    category: 'Security',
    icon: Lock,
    technologies: ['JWT', 'OTP', 'Google OAuth', 'bcrypt'],
    gradient: 'from-green-600 to-blue-600'
  }
];

export default function Technology() {
  return (
    <section id="technology" className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-20">
          <h2 className="text-5xl md:text-6xl font-bold">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Powered by
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Modern Technology
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Built with cutting-edge tools following Clean Architecture principles for scalability and maintainability
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {techStack.map((stack, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-cyan-600/0 group-hover:from-blue-600/5 group-hover:to-cyan-600/5 rounded-3xl transition-all duration-300" />

              <div className="relative space-y-6">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stack.gradient}`}>
                  <stack.icon className="w-6 h-6 text-white" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    {stack.category}
                  </h3>

                  <div className="space-y-2">
                    {stack.technologies.map((tech, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300"
                      >
                        {tech}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 p-12 rounded-3xl bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border border-blue-400/20 backdrop-blur-sm">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                Clean Architecture
              </div>
              <p className="text-gray-400 text-sm">Modular & Scalable Design</p>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent mb-2">
                Type-Safe
              </div>
              <p className="text-gray-400 text-sm">TypeScript Throughout</p>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-green-400 bg-clip-text text-transparent mb-2">
                Real-Time
              </div>
              <p className="text-gray-400 text-sm">Live Updates & Notifications</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
