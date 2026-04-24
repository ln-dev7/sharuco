"use client"

import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"

export default function Custom404() {
  return (
    <>
      
      <section className="container grid items-center gap-8 pb-8 pt-6 md:py-10">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-2xl font-bold">This page does not exist.</h1>
          <Link
            href="/"
            className={buttonVariants({ size: "lg", variant: "outline" })}
          >
            Go back to home
          </Link>
        </div>
      </section>
    </>
  )
}
