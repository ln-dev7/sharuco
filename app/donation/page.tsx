import Link from "next/link"
import { Heart } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"

const DONATION_URL = "https://lndev.mychariow.shop/prd_3cu1s0"

export default function Donation() {
  return (
    <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-2xl leading-tight font-bold tracking-tighter sm:text-2xl md:text-4xl lg:text-5xl">
          Support Sharuco
        </h1>
        <p className="max-w-[700px] text-lg text-zinc-700 sm:text-xl dark:text-zinc-400">
          Sharuco is a free and open source project.
          <br className="hidden sm:inline" /> If you want to support the
          project, you can make a donation.
        </p>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <Link
          href={DONATION_URL}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants({ size: "lg" })}
        >
          <Heart className="mr-2 h-5 w-5 fill-current" />
          Support Sharuco
        </Link>
      </div>
    </section>
  )
}
