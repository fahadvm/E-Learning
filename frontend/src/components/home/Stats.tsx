import { Users, BookOpen, Building2, Globe } from 'lucide-react';

const stats = [
  { icon: Users, label: 'Active Learners', value: '50K+' },
  { icon: BookOpen, label: 'Courses Available', value: '1,200+' },
  { icon: Building2, label: 'Partner Companies', value: '250+' },
  { icon: Globe, label: 'Countries Reached', value: '85+' }
];

export default function Stats() {
  return (
    <section className="relative py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-sm hover:border-blue-400/30 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-cyan-600/0 group-hover:from-blue-600/10 group-hover:to-cyan-600/10 rounded-2xl transition-all duration-300" />

              <div className="relative space-y-4">
                <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-400/30">
                  <stat.icon className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
