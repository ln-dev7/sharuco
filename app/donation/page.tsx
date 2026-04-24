"use client"

//import axios from "axios"
import "highlight.js/styles/vs.css"

export default function Donation() {
  return (
    <>
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
        {/*<div className="flex w-full items-center justify-center">*/}
        {/*  <span className="text-lg font-bold">OR</span>*/}
        {/*</div>*/}
        <div className="flex w-full flex-col items-center justify-center gap-4">
          <a href="https://www.buymeacoffee.com/lndev">
            <img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=☕&slug=lndev&button_colour=5F7FFF&font_colour=ffffff&font_family=Bree&outline_colour=000000&coffee_colour=FFDD00" />
          </a>
        </div>
      </section>
    </>
  )
}
