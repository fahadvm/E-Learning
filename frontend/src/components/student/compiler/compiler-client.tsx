"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type Language = "javascript" | "python"

type LogEntry = {
  id: string
  kind: "log" | "error" | "info"
  text: string
  ts: number
}

const JS_TEMPLATE = `// JavaScript example
// You can use top-level await.
console.log("Hello from JavaScript!");
const x = 21;
const y = 2;
await new Promise(r => setTimeout(r, 200));
console.log("x * y =", x * y)
`

const PY_TEMPLATE = `# Python example
# Print will stream to the console below.
print("Hello from Python!")
x = 21
y = 2
print("x * y =", x * y)
`

function Toolbar({
  language,
  onLanguageChange,
  onRun,
  onStop,
  onClear,
  running,
  disabled,
}: {
  language: Language
  onLanguageChange: (lang: Language) => void
  onRun: () => void
  onStop: () => void
  onClear: () => void
  running: boolean
  disabled?: boolean
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <label htmlFor="language" className="text-sm text-muted-foreground">
          Language
        </label>
        <select
          id="language"
          value={language}
          onChange={(e) => onLanguageChange(e.target.value as Language)}
          className={cn(
            "rounded-md border bg-background px-3 py-2 text-sm",
            "border-input focus:outline-none focus:ring-2 focus:ring-ring",
          )}
          aria-label="Select language"
          disabled={running}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRun}
          disabled={running || disabled}
          className={cn(
            "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
            "disabled:opacity-50",
          )}
          aria-label="Run code"
        >
          {running ? "Running…" : "Run"}
        </button>
        <button
          type="button"
          onClick={onStop}
          disabled={!running}
          className={cn(
            "rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground",
            "disabled:opacity-50",
          )}
          aria-label="Stop execution"
        >
          Stop
        </button>
        <button
          type="button"
          onClick={onClear}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          aria-label="Clear output"
        >
          Clear
        </button>
      </div>
    </div>
  )
}

function CodeEditor({
  language,
  value,
  onChange,
}: {
  language: Language
  value: string
  onChange: (val: string) => void
}) {
  return (
    <div className="rounded-lg border border-input bg-card">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">{language}</span>
        <button
          type="button"
          onClick={() => onChange(language === "javascript" ? JS_TEMPLATE : PY_TEMPLATE)}
          className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
          aria-label="Insert example"
        >
          Insert example
        </button>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className={cn(
          "block h-[300px] w-full resize-y rounded-b-lg bg-card px-3 py-3 font-mono text-sm",
          "focus:outline-none",
        )}
        aria-label="Code editor"
      />
    </div>
  )
}

function OutputConsole({ logs }: { logs: LogEntry[] }) {
  return (
    <div className="rounded-lg border border-input bg-card">
      <div className="border-b border-border px-3 py-2">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">Output</span>
      </div>
      <div className="h-[220px] overflow-auto px-3 py-3">
        {logs.length === 0 ? (
          <div className="text-sm text-muted-foreground">No output yet.</div>
        ) : (
          <ul className="space-y-1">
            {logs.map((l) => (
              <li key={l.id} className={cn("text-sm", l.kind === "error" ? "text-destructive" : "text-foreground")}>
                <span className="text-muted-foreground">{new Date(l.ts).toLocaleTimeString()} — </span>
                <span>{l.text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default function CompilerClient() {
  const [language, setLanguage] = useState<Language>("javascript")
  const [code, setCode] = useState<string>(JS_TEMPLATE)
  const [running, setRunning] = useState(false)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const [iframeKey, setIframeKey] = useState(0)
  const [sandboxReady, setSandboxReady] = useState(false)

  // Reset template when switching languages only if current code equals prior template
  const onLanguageChange = useCallback(
    (lang: Language) => {
      setLanguage(lang)
      const isDefault = code.trim() === JS_TEMPLATE.trim() || code.trim() === PY_TEMPLATE.trim()
      if (isDefault) {
        setCode(lang === "javascript" ? JS_TEMPLATE : PY_TEMPLATE)
      }
    },
    [code],
  )

  const pushLog = useCallback((entry: Omit<LogEntry, "id" | "ts">) => {
    setLogs((prev) => [
      ...prev,
      { ...entry, id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, ts: Date.now() },
    ])
  }, [])

  const clearLogs = useCallback(() => setLogs([]), [])

  // Handle messages from sandbox
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (!iframeRef.current || e.source !== iframeRef.current.contentWindow) return
      const data = (e.data as { type?: string; text?: string }) || {}
      switch (data.type) {
        case "ready":
          setSandboxReady(true)
          pushLog({ kind: "info", text: "Sandbox ready." })
          break
        case "log":
          pushLog({ kind: "log", text: String(data.text ?? "") })
          break
        case "error":
          pushLog({ kind: "error", text: String(data.text ?? "") })
          setRunning(false)
          break
        case "done":
          pushLog({ kind: "info", text: "Execution finished." })
          setRunning(false)
          break
        default:
          break
      }
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [pushLog])

  const run = useCallback(() => {
    if (!iframeRef.current?.contentWindow) return
    clearLogs()
    setRunning(true)
    // Post run request to sandbox
    iframeRef.current.contentWindow.postMessage(
      {
        type: "run",
        language,
        code,
      },
      "*",
    )
  }, [language, code, clearLogs])

  const stop = useCallback(() => {
    // Reload sandbox to abort any running execution
    setIframeKey((k) => k + 1)
    setSandboxReady(false)
    setRunning(false)
    pushLog({ kind: "info", text: "Execution stopped." })
  }, [pushLog])

  // Prefill console info when sandbox reloaded
  const iframeLoaded = useCallback(() => {
    // The sandbox itself will send "ready" when fully initialized.
  }, [])

  const sandboxUrl = useMemo(() => "/compiler-sandbox.html", [])

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <section className="space-y-3">
        <Toolbar
          language={language}
          onLanguageChange={onLanguageChange}
          onRun={run}
          onStop={stop}
          onClear={clearLogs}
          running={running}
          disabled={!sandboxReady}
        />
        <CodeEditor language={language} value={code} onChange={setCode} />
      </section>

      <section className="space-y-3">
        <OutputConsole logs={logs} />
        <div className="rounded-lg border border-input">
          <div className="border-b border-border px-3 py-2">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Sandbox</span>
          </div>
          <iframe
            key={iframeKey}
            ref={iframeRef}
            title="Sandbox"
            src={sandboxUrl}
            sandbox="allow-scripts"
            className="h-[120px] w-full rounded-b-lg bg-card"
            onLoad={iframeLoaded}
          />
        </div>
      </section>
    </div>
  )
}
