"use client";

import { SessionProvider } from "next-auth/react";
import { CallProvider } from "@/context/CallContext";
import IncomingCall from "@/components/shared/IncomingCall";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CallProvider>
        {children}
        <IncomingCall />
      </CallProvider>
    </SessionProvider>
  );
}
