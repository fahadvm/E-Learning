import { GraduationCap, Users, Building2, UserCheck, Shield } from 'lucide-react';

const roles = [
  {
    icon: GraduationCap,
    title: 'Students',
    description: 'Browse courses, track progress, participate in communities, and practice coding with our integrated compiler.',
    features: ['Course enrollment', 'Progress tracking', 'Video sessions', 'Community access'],
    color: 'blue'
  },
  {
    icon: Users,
    title: 'Teachers',
    description: 'Create and manage courses, upload content, interact with students, and monitor performance analytics.',
    features: ['Course creation', 'Content management', 'Student analytics', 'Community moderation'],
    color: 'cyan'
  },
  {
    icon: Building2,
    title: 'Companies',
    description: 'Register your organization, add employees, assign learning paths, and track engagement with detailed insights.',
    features: ['Employee management', 'Custom learning paths', 'Engagement tracking', 'Performance insights'],
    color: 'teal'
  },
  {
    icon: UserCheck,
    title: 'Employees',
    description: 'Access company-approved courses, join interactive sessions, and track your professional development journey.',
    features: ['Company courses', 'Skill development', 'Progress reports', 'Certifications'],
    color: 'green'
  },
  {
    icon: Shield,
    title: 'Administrators',
    description: 'Complete platform oversight with user management, content moderation, and advanced analytics for decision-making.',
    features: ['User management', 'Content moderation', 'Platform analytics', 'Subscription management'],
    color: 'purple'
  }
];

const colorMap: Record<string, string> = {
  blue: 'from-blue-600 to-cyan-600',
  cyan: 'from-cyan-600 to-teal-600',
  teal: 'from-teal-600 to-green-600',
  green: 'from-green-600 to-blue-600',
  purple: 'from-purple-600 to-blue-600'
};

export default function Roles() {
  return (
    <section id="roles" className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-20">
          <h2 className="text-5xl md:text-6xl font-bold">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Built for
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Everyone
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            A unified platform serving students, educators, companies, and administrators
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {roles.map((role, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-cyan-600/0 group-hover:from-blue-600/10 group-hover:to-cyan-600/10 rounded-3xl transition-all duration-500" />

              <div className="relative space-y-6">
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${colorMap[role.color]} shadow-lg`}>
                  <role.icon className="w-8 h-8 text-white" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {role.title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed mb-6">
                    {role.description}
                  </p>

                  <ul className="space-y-2">
                    {role.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-sm text-gray-300">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${colorMap[role.color]}`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[150px] opacity-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600 rounded-full blur-[150px] opacity-10" />
    </section>
  );
}
