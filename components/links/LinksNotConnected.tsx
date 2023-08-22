"use client"

import { useGitHubLogin } from "@/firebase/auth/githubLogin"
import { Github, Loader2, Lock } from "lucide-react"

import { cn } from "@/lib/utils"

export default function LinksNotConnected() {
  const { login, isPending } = useGitHubLogin()
  return (
    <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed border-slate-300 dark:border-slate-700">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <Lock className="h-12 w-12" />
        <h3 className="mt-4 text-lg font-semibold">Access denied</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          To access Sharuco Link you must first be logged in.
        </p>
        <button
          className={cn(
            "inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
          )}
          disabled={isPending}
          onClick={login}
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Github className="mr-2 h-4 w-4" />
          )}
          Login with Github
        </button>
      </div>
    </div>
  )
}
