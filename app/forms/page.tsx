"use client"

import Link from "next/link"
import { useAuthContext } from "@/context/AuthContext"
import { Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import FormsConnected from "@/components/forms/FormsConnected"
import FormsNotConnected from "@/components/forms/FormsNotConnected"
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function Forms() {
  const { user } = useAuthContext()

  return (
    <section className="container-wrapper grid items-center gap-6 pt-6 pb-8 md:py-10">
      <div className="flex flex-col items-start gap-2">
        <h1 className="text-2xl leading-tight font-extrabold tracking-tighter sm:text-2xl md:text-4xl lg:text-4xl">
          Sharuco Form
        </h1>
        <p
          className={cn(
            "text-sm leading-5 font-medium text-gray-500 dark:text-gray-400",
            "sm:text-base md:text-lg lg:text-lg"
          )}
        >
          Create and share forms to receive answers very quickly. No account
          needed to start — sign in only when you want to save.
        </p>
      </div>
      <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
        <Link
          href="/forms/new"
          className={buttonVariants({ size: "lg" })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create new form
        </Link>
      </div>
      <Separator className="my-4" />
      {user ? <FormsConnected /> : <FormsNotConnected />}
    </section>
  )
}
