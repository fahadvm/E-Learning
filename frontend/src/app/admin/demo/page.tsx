// app/blocked/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function BlockedPage() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-black via-blue-600 to-black flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-10 md:p-14 text-center">
            {/* Blocked Icon */}
            <div className="mx-auto w-32 h-32 mb-8 relative">
              <Image
                src="/gallery/blocked.png"
                alt="Account Blocked"
                fill
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-red-600 mb-4">
              Access Restricted
            </h1>

            {/* Message */}
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Your student account has been <strong>temporarily blocked</strong> by the administrator.
            </p>
            <p className="text-gray-600 mb-8">
              This may be due to policy violation, pending fees, disciplinary action, or account verification.
            </p>



           
          </div>

          {/* Footer */}
          <div className="bg-gray-100 py-5 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Your Institute Name. All rights reserved.
          </div>
        </div>
      </div>
    </>
  );
}