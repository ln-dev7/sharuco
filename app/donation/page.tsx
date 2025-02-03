'use client';

//import axios from "axios"
import 'highlight.js/styles/vs.css';
import Head from 'next/head';

import { Layout } from '@/components/layout';

export default function Donation() {
  return (
    <Layout>
      <Head>
        <title>Sharuco | Make a donation</title>
        <meta
          name="description"
          content="Sharuco allows you to share code codes that you have found
          useful."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-2xl font-bold leading-tight tracking-tighter sm:text-2xl md:text-4xl lg:text-5xl">
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
    </Layout>
  );
}
