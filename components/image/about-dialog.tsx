"use client"

import Link from "next/link"
import { HelpCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const SHORTCUTS: Array<{ label: string; keys: string[] }> = [
  { label: "Focus text editor", keys: ["F"] },
  { label: "Unfocus text editor", keys: ["Esc"] },
  { label: "Change theme", keys: ["C"] },
  { label: "Toggle dark mode", keys: ["D"] },
  { label: "Toggle line numbers", keys: ["N"] },
  { label: "Change padding", keys: ["P"] },
  { label: "Select language", keys: ["L"] },
  { label: "Download PNG", keys: ["⌘", "S"] },
  { label: "Copy image", keys: ["⌘", "C"] },
  { label: "Paste code", keys: ["⌘", "V"] },
]

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded border bg-muted px-1.5 font-mono text-[11px] font-medium text-muted-foreground">
      {children}
    </kbd>
  )
}

export function AboutDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <HelpCircle className="h-4 w-4" />
          About
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>About</DialogTitle>
          <DialogDescription>
            Turn any snippet into a beautiful screenshot.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            Pick a <strong>theme</strong> from a range of syntax colors and
            partner-branded backgrounds, the <strong>language</strong> of your
            code, and toggle between <strong>light or dark mode</strong>.
          </p>
          <p>
            Customize the padding, toggle line numbers, and when you&apos;re
            ready hit <strong>Download PNG</strong> or{" "}
            <strong>Copy image</strong> to save the image or drop it into any
            app that accepts clipboard images.
          </p>

          <div className="space-y-2 pt-2">
            <h3 className="text-sm font-semibold">Contribute</h3>
            <p className="text-muted-foreground">
              Sharuco is an open source project. Contributions, issues and
              feedback are welcome on{" "}
              <Link
                href="https://github.com/ln-dev7/sharuco"
                target="_blank"
                rel="noreferrer"
                className="text-foreground underline underline-offset-2"
              >
                GitHub
              </Link>
              .
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-semibold">Shortcuts</h3>
            <ul className="divide-y divide-border">
              {SHORTCUTS.map((s) => (
                <li
                  key={s.label}
                  className="flex items-center justify-between gap-4 py-2"
                >
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="flex items-center gap-1">
                    {s.keys.map((k, i) => (
                      <Kbd key={`${s.label}-${i}`}>{k}</Kbd>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className="pt-2 text-center text-xs text-muted-foreground">
            Made by{" "}
            <Link
              href="https://leonelngoya.com"
              target="_blank"
              rel="noreferrer"
              className="text-foreground underline underline-offset-2"
            >
              Leonel Ngoya
            </Link>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
