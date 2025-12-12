import { useState, useRef, useEffect } from "react";
import { Code } from "lucide-react";

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 backdrop-blur-md bg-black/30 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Code className="w-8 h-8 text-blue-400" />
            <div className="absolute inset-0 blur-xl bg-blue-400/30 animate-pulse" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            DevNext
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-8 text-sm">
          <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
          <a href="#roles" className="text-gray-300 hover:text-white transition-colors">For Who</a>
          <a href="#technology" className="text-gray-300 hover:text-white transition-colors">Technology</a>
          <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
        </div>

        <div className="relative flex items-center space-x-4">


          {/* Dropdown Menu */}
          {open && (
            <div
              ref={dropdownRef}
              className="absolute right-0 top-12 w-48 p-2
               bg-black/40 backdrop-blur-xl border border-white/10
               rounded-xl shadow-2xl shadow-blue-500/10
               animate-in fade-in zoom-in-95 duration-200
               origin-top-right z-50"
            >
              <div className="flex flex-col space-y-1">
                {[
                  { label: "Student", href: "/student/login" },
                  { label: "Teacher", href: "/teacher/login" },
                  { label: "Company", href: "/company/login" },
                  { label: "Employee", href: "/employee/login" },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="
            flex items-center px-4 py-2 rounded-lg text-gray-300
            hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-600
            transition-all duration-200
          "
                  >
                    <span className="w-2 h-2 rounded-full bg-blue-400 mr-2 group-hover:bg-white" />
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          )}
          <button
            onClick={() => setOpen(!open)}
            className="px-6 py-2 text-sm bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg shadow-blue-500/20">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}
