"use client";

import { useRouter, usePathname } from "next/navigation";
import { showSuccessToast } from "@/utils/Toast";

export const DEMO_ACCOUNTS = [
  { role: "Student", email: "studentdemo@devnext.com", password: "Demo@123", route: "/student/login" },
  { role: "Teacher", email: "teacherdemo@devnext.com", password: "Demo@123", route: "/teacher/login" },
  { role: "Employee", email: "employeedemo@devnext.com", password: "Demo@123", route: "/employee/login" },
  { role: "Company", email: "companydemo@devnext.com", password: "Demo@123", route: "/company/login" },
  { role: "Admin", email: "admindemo@devnext.com", password: "Demo@123", route: "/admin/login" },
];

interface DemoAccountsProps {
  currentRole: string;
  theme?: "light" | "dark";
  onFillCredentials?: (email: string, pass: string) => void;
}

export default function DemoAccounts({ currentRole, theme = "dark", onFillCredentials }: DemoAccountsProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleUseAccount = (account: typeof DEMO_ACCOUNTS[0]) => {
    if (pathname === account.route && onFillCredentials) {
      onFillCredentials(account.email, account.password);
      showSuccessToast("Demo credentials added");
    } else {
      router.push(`${account.route}?demo=true`);
    }
  };

  const isDark = theme === "dark";

  return (
    <>
      {DEMO_ACCOUNTS.filter(acc => acc.role.toLowerCase() === currentRole.toLowerCase()).map((acc, idx) => (
        <div key={idx} className={`p-4 rounded-xl w-full max-w-sm text-left relative overflow-hidden transition-all ${
          isDark 
            ? "bg-white/10 backdrop-blur-md border border-white/20 shadow-lg" 
            : "bg-gray-50 border border-gray-200 shadow-sm"
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <div className={`font-mono text-sm tracking-wide ${isDark ? "text-gray-200" : "text-gray-700"}`}>Email: {acc.email}</div>
              <div className={`font-mono text-sm tracking-wide mt-1.5 ${isDark ? "text-gray-200" : "text-gray-700"}`}>Pass: {acc.password}</div>
              <div className={`text-xs mt-3 font-medium ${isDark ? "text-amber-300/90" : "text-amber-600"}`}>* For HR / Project Evaluation Only</div>
            </div>
            <button
              type="button"
              onClick={() => handleUseAccount(acc)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors font-semibold ml-3 shadow ${
                isDark 
                  ? "bg-white text-gray-900 hover:bg-gray-200" 
                  : "bg-gray-900 text-white hover:bg-gray-800"
              }`}
            >
              Auto-fill
            </button>
          </div>
        </div>
      ))}
    </>
  );
}
