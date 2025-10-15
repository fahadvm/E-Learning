import type { Metadata } from "next"
import { Suspense } from "react"
import CompilerClient from "@/components/student/compiler/compiler-client"
export const metadata: Metadata = {
  title: "Online Compiler",
  description: "Run JavaScript and Python safely in your browser.",
}

export default function Page() {
  return (
    <main className="min-h-dvh p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-4">
        <header className="space-y-1">
          <h1 className="text-pretty text-3xl font-semibold tracking-tight">Online Compiler</h1>
          <p className="text-muted-foreground">
            Execute JavaScript or Python securely in a sandbox. Logs and errors are streamed below.
          </p>
        </header>

        <Suspense fallback={<div className="text-muted-foreground">Loading...</div>}>
          <CompilerClient />
        </Suspense>
      </div>
    </main>
  )
}
