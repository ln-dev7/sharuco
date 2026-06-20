"use client"

import Link from "next/link"
import { useGitHubLogin } from "@/firebase/auth/githubLogin"
import { Github, Loader2, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export default function FormsNotConnected() {
  const { login, isPending } = useGitHubLogin()
  return (
    <div className="flex min-h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed border-zinc-300 dark:border-zinc-700">
      <div className="mx-auto flex max-w-[460px] flex-col items-center justify-center px-6 text-center">
        <h3 className="mt-4 text-lg font-semibold">Start building right away</h3>
        <p className="mt-2 mb-6 text-sm text-muted-foreground">
          You can create a form without an account. We’ll only ask you to sign
          in when you’re ready to save — and nothing you’ve built will be lost.
          Sign in to also find all the forms you saved before.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Link href="/forms/new" className={buttonVariants({ size: "lg" })}>
            <Plus className="mr-2 h-4 w-4" />
            Create a form
          </Link>
          <button
            className={cn(
              "inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold transition-colors hover:bg-zinc-100 focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            )}
            disabled={isPending}
            onClick={login}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Github className="mr-2 h-4 w-4" />
            )}
            Sign in with GitHub
          </button>
        </div>
      </div>
    </div>
  )
}
