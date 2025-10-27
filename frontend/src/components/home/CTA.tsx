import { ArrowRight, Code, Sparkles } from 'lucide-react';

export default function CTA() {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="relative p-12 md:p-20 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 opacity-90" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />

          <div className="relative text-center space-y-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm text-white font-medium">Join the Future of Learning</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Ready to Transform Your
              <br />
              Learning Experience?
            </h2>

            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Join thousands of learners, educators, and companies already using DevNext to achieve their educational goals.
            </p>

           
            <div className="pt-8 flex items-center justify-center space-x-8 text-white/80 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-white" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-white" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-white" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white rounded-full blur-[100px] opacity-20" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-300 rounded-full blur-[100px] opacity-20" />
        </div>
      </div>

      <footer className="mt-32 pt-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
             <Code className="w-8 h-8 text-blue-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              DevNext
            </span>
          </div>

          <p className="text-gray-400 text-sm mb-8">
            The next generation of integrated e-learning solutions
          </p>

          <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            © 2025 DevNext. All rights reserved.
          </div>
        </div>
      </footer>
    </section>
  );
}
