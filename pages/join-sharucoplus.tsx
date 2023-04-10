"use client"

import { contributors } from "@/contants/contributors"
import {
  allLanguages,
  getLanguageColor,
  languagesName,
} from "@/contants/languages"
import { useAuthContext } from "@/context/AuthContext"
import { useGitHubLoign } from "@/firebase/auth/githubLogin"
import highlight from "@/utils/highlight"
import linearizeCode from "@/utils/linearizeCode"
import hljs from "highlight.js"

import "highlight.js/styles/vs.css"
import { useEffect, useRef, useState } from "react"

import "highlight.js/styles/vs.css"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import * as htmlToImage from "html-to-image"
import { Code2, Github, Loader2 } from "lucide-react"
import { toast } from "react-hot-toast"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Layout } from "@/components/layout"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { buttonVariants } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function IndexPage() {
  const { login, isPending } = useGitHubLoign()

  const notifyCodeAdded = () =>
    toast.success("Your code has been added successfully !")

  const { user } = useAuthContext()
  const pseudo = user?.reloadUserInfo.screenName

  const [userCountry, setUserCountry] = useState("")
  useEffect(() => {
    setUserCountry(window.navigator.language.split("-")[1])
  }, [])

  //

  const [codeImage, setCodeImage] = useState("")
  const [languageImage, setLanguageImage] = useState("")

  const domRefImage = useRef(null)
  const [backgroundImage, setBackgroundImage] = useState(
    "bg-gradient-to-br from-blue-400 to-indigo-700"
  )

  const handleChangeBgImg1 = () => {
    setBackgroundImage("bg-gradient-to-br from-blue-400 to-indigo-700")
  }

  const handleChangeBgImg2 = () => {
    setBackgroundImage("bg-gradient-to-r from-pink-500 to-indigo-600")
  }

  const handleChangeBgImg3 = () => {
    setBackgroundImage("bg-gradient-to-br from-teal-400 to-green-500")
  }

  const handleChangeBgImg4 = () => {
    setBackgroundImage("bg-gradient-to-br from-yellow-300 to-orange-500")
  }
  const handleChangeBgImg5 = () => {
    setBackgroundImage("bg-gradient-to-br from-red-500 to-pink-600")
  }

  const downloadImage = async () => {
    const dataUrl = await htmlToImage.toPng(domRefImage.current)

    // download image
    const link = document.createElement("a")
    link.download = `sharuco-code-${Math.random()
      .toString(36)
      .substring(7)}.png`
    link.href = dataUrl
    link.click()
  }
  //

  function detectLanguage(code) {
    const language = hljs.highlightAuto(code).language
    return language || "text"
  }

  function handleCodeChange(code) {
    const detectedLanguage = detectLanguage(code)
    if (!languagesName.includes(detectedLanguage)) {
      setCodeImage(linearizeCode(code))
      setLanguageImage("other")
      return
    }
    setCodeImage(linearizeCode(code))
    setLanguageImage(detectedLanguage)
  }
  return (
    <Layout>
      <Head>
        <title>Join Sharuco Plus</title>
        <meta
          name="description"
          content="Sharuco allows you to share code codes that you have found
          useful."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sharuco" />
        <meta
          name="twitter:description"
          content="Share your code with everyone"
        />
        <meta
          name="twitter:image"
          content="https://sharuco.lndev.me/sharuco-banner.png"
        />

        <meta property="og:title" content="Sharuco" />
        <meta
          property="og:description"
          content="Share your code with everyone"
        />
        <meta
          property="og:image"
          content="https://sharuco.lndev.me/sharuco-banner.png"
        />
        <meta property="og:url" content="https://sharuco.lndev.me" />
        <meta property="og:type" content="website" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl block bg-gradient-to-r from-purple-700 via-purple-500 to-blue-300 bg-clip-text text-transparent break-clone">
            Join Sharuco Plus
          </h1>
          <svg aria-hidden="true" viewBox="0 0 668 1069" width="668" height="1069" fill="none" className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 lg:translate-y-[-60%]"><defs><clipPath id=":R1l6:-clip-path"><path fill="#fff" transform="rotate(-180 334 534.4)" d="M0 0h668v1068.8H0z"></path></clipPath></defs><g opacity=".4" clip-path="url(#:R1l6:-clip-path)" stroke-width="4"><path opacity=".3" d="M584.5 770.4v-474M484.5 770.4v-474M384.5 770.4v-474M283.5 769.4v-474M183.5 768.4v-474M83.5 767.4v-474" stroke="#334155"></path><path d="M83.5 221.275v6.587a50.1 50.1 0 0 0 22.309 41.686l55.581 37.054a50.102 50.102 0 0 1 22.309 41.686v6.587M83.5 716.012v6.588a50.099 50.099 0 0 0 22.309 41.685l55.581 37.054a50.102 50.102 0 0 1 22.309 41.686v6.587M183.7 584.5v6.587a50.1 50.1 0 0 0 22.31 41.686l55.581 37.054a50.097 50.097 0 0 1 22.309 41.685v6.588M384.101 277.637v6.588a50.1 50.1 0 0 0 22.309 41.685l55.581 37.054a50.1 50.1 0 0 1 22.31 41.686v6.587M384.1 770.288v6.587a50.1 50.1 0 0 1-22.309 41.686l-55.581 37.054A50.099 50.099 0 0 0 283.9 897.3v6.588" stroke="#334155"></path><path d="M384.1 770.288v6.587a50.1 50.1 0 0 1-22.309 41.686l-55.581 37.054A50.099 50.099 0 0 0 283.9 897.3v6.588M484.3 594.937v6.587a50.1 50.1 0 0 1-22.31 41.686l-55.581 37.054A50.1 50.1 0 0 0 384.1 721.95v6.587M484.3 872.575v6.587a50.1 50.1 0 0 1-22.31 41.686l-55.581 37.054a50.098 50.098 0 0 0-22.309 41.686v6.582M584.501 663.824v39.988a50.099 50.099 0 0 1-22.31 41.685l-55.581 37.054a50.102 50.102 0 0 0-22.309 41.686v6.587M283.899 945.637v6.588a50.1 50.1 0 0 1-22.309 41.685l-55.581 37.05a50.12 50.12 0 0 0-22.31 41.69v6.59M384.1 277.637c0 19.946 12.763 37.655 31.686 43.962l137.028 45.676c18.923 6.308 31.686 24.016 31.686 43.962M183.7 463.425v30.69c0 21.564 13.799 40.709 34.257 47.529l134.457 44.819c18.922 6.307 31.686 24.016 31.686 43.962M83.5 102.288c0 19.515 13.554 36.412 32.604 40.645l235.391 52.309c19.05 4.234 32.605 21.13 32.605 40.646M83.5 463.425v-58.45M183.699 542.75V396.625M283.9 1068.8V945.637M83.5 363.225v-141.95M83.5 179.524v-77.237M83.5 60.537V0M384.1 630.425V277.637M484.301 830.824V594.937M584.5 1068.8V663.825M484.301 555.275V452.988M584.5 622.075V452.988M384.1 728.537v-56.362M384.1 1068.8v-20.88M384.1 1006.17V770.287M283.9 903.888V759.85M183.699 1066.71V891.362M83.5 1068.8V716.012M83.5 674.263V505.175" stroke="#334155"></path><circle cx="83.5" cy="384.1" r="10.438" transform="rotate(-180 83.5 384.1)" fill="#1E293B" stroke="#334155"></circle><circle cx="83.5" cy="200.399" r="10.438" transform="rotate(-180 83.5 200.399)" stroke="#334155"></circle><circle cx="83.5" cy="81.412" r="10.438" transform="rotate(-180 83.5 81.412)" stroke="#334155"></circle><circle cx="183.699" cy="375.75" r="10.438" transform="rotate(-180 183.699 375.75)" fill="#1E293B" stroke="#334155"></circle><circle cx="183.699" cy="563.625" r="10.438" transform="rotate(-180 183.699 563.625)" fill="#1E293B" stroke="#334155"></circle><circle cx="384.1" cy="651.3" r="10.438" transform="rotate(-180 384.1 651.3)" fill="#1E293B" stroke="#334155"></circle><circle cx="484.301" cy="574.062" r="10.438" transform="rotate(-180 484.301 574.062)" fill="#0EA5E9" fill-opacity=".42" stroke="#0EA5E9"></circle><circle cx="384.1" cy="749.412" r="10.438" transform="rotate(-180 384.1 749.412)" fill="#1E293B" stroke="#334155"></circle><circle cx="384.1" cy="1027.05" r="10.438" transform="rotate(-180 384.1 1027.05)" stroke="#334155"></circle><circle cx="283.9" cy="924.763" r="10.438" transform="rotate(-180 283.9 924.763)" stroke="#334155"></circle><circle cx="183.699" cy="870.487" r="10.438" transform="rotate(-180 183.699 870.487)" stroke="#334155"></circle><circle cx="283.9" cy="738.975" r="10.438" transform="rotate(-180 283.9 738.975)" fill="#1E293B" stroke="#334155"></circle><circle cx="83.5" cy="695.138" r="10.438" transform="rotate(-180 83.5 695.138)" fill="#1E293B" stroke="#334155"></circle><circle cx="83.5" cy="484.3" r="10.438" transform="rotate(-180 83.5 484.3)" fill="#0EA5E9" fill-opacity=".42" stroke="#0EA5E9"></circle><circle cx="484.301" cy="432.112" r="10.438" transform="rotate(-180 484.301 432.112)" fill="#1E293B" stroke="#334155"></circle><circle cx="584.5" cy="432.112" r="10.438" transform="rotate(-180 584.5 432.112)" fill="#1E293B" stroke="#334155"></circle><circle cx="584.5" cy="642.95" r="10.438" transform="rotate(-180 584.5 642.95)" fill="#1E293B" stroke="#334155"></circle><circle cx="484.301" cy="851.699" r="10.438" transform="rotate(-180 484.301 851.699)" stroke="#334155"></circle><circle cx="384.1" cy="256.763" r="10.438" transform="rotate(-180 384.1 256.763)" stroke="#334155"></circle></g></svg>
          <p className="max-w-[700px] text-lg text-slate-700 dark:text-slate-400 sm:text-xl">
          Enjoy all the features of Sharuco by joining our premium community
          </p>
        </div>
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 md:flex-row">
          <Link
            href={siteConfig.links.explore}
            className={buttonVariants({ size: "lg" })}
          >
            Explore code
          </Link>
          {user ? (
            <Link
              href="/dashboard"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              <Code2 className="mr-2 h-4 w-4" />
              Your dashboard
            </Link>
          ) : (
            <button
              className={buttonVariants({ variant: "outline", size: "lg" })}
              disabled={isPending}
              onClick={login}
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Github className="mr-2 h-4 w-4" />
              )}
              Sign in with Github
            </button>
          )}
        </div>
      </section>
    </Layout>
  )
}
