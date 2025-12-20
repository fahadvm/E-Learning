import { Bell, Search, User } from "lucide-react";
import { useAdmin } from "@/context/adminContext";

export function Header() {
  const {admin} = useAdmin()
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4 md:ml-0 ml-12">
        
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 transition-colors">
          <Bell className="h-5 w-5" />
        </button>
        
        <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-slate-900">{admin?.name}</p>
            <p className="text-xs text-slate-500">{admin?.isSuperAdmin?"Super Admin": "Admin"}</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border border-slate-300">
             <User className="h-5 w-5 text-slate-500" />
          </div>
        </div>
      </div>
    </header>
  );
}
