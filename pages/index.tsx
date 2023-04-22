"use client"

import {
  allLanguages,
  getLanguageColor,
  languagesName,
} from "@/constants/languages"
import { COMPANIES, INDIVIDUALS } from "@/constants/supports.js"
import { useAuthContext } from "@/context/AuthContext"
import { useGitHubLogin } from "@/firebase/auth/githubLogin"
import highlight from "@/utils/highlight"
import linearizeCode from "@/utils/linearizeCode"
import hljs from "highlight.js"

import { Separator } from "@/components/ui/separator"
import "highlight.js/styles/vs.css"
import { useEffect, useRef, useState } from "react"

import "highlight.js/styles/vs.css"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import * as htmlToImage from "html-to-image"
import { Code2, Github, Loader2 } from "lucide-react"
import { useTheme } from "next-themes"
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
  const { login, isPending } = useGitHubLogin()
  const { theme } = useTheme()

  const notifyCodeAdded = () =>
    toast.custom((t) => (
      <div
        className="mt-4 rounded-lg border-2 border-green-600 bg-green-50 p-4 text-sm text-green-600 dark:bg-gray-800 dark:text-green-300"
        role="alert"
      >
        Your code has been added successfully !
      </div>
    ))

  const { user } = useAuthContext()
  const pseudo = user?.reloadUserInfo.screenName

  const [userCountry, setUserCountry] = useState("")
  useEffect(() => {
    setUserCountry(window.navigator.language.split("-")[1])
  }, [])

  // Contributors
  const [contributors, setContributors] = useState([])

  useEffect(() => {
    fetch("https://api.github.com/repos/ln-dev7/sharuco/contributors")
      .then((response) => response.json())
      .then((data) => setContributors(data))
      .catch((error) => console.error(error))
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
        <title>Sharuco</title>
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
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
            Share your code
            <br className="hidden sm:inline" />
            with everyone.
          </h1>
          <p className="max-w-[700px] text-lg text-slate-700 dark:text-slate-400 sm:text-xl">
            Sharuco allows you to share code codes that you have found useful.
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
        {!user && userCountry == "CM" && (
          <div
            className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            <span className="font-semibold">Warning alert !</span> We have
            noticed that you are in{" "}
            <span className="font-semibold">Cameroon</span> , if you are using
            an <span className="font-semibold">Orange connection</span> you need
            to use a VPN and change your location in order to connect.
          </div>
        )}
        <p className="text-sm text-slate-700 dark:text-slate-400">
          Follow us on{" "}
          <Link
            href="https://twitter.com/ln_dev7"
            className="font-bold underline underline-offset-4"
          >
            Twitter
          </Link>{" "}
          for the latest updates
        </p>
        <div className="mt-4 flex flex-col items-start gap-4">
          <div>
            <h2 className="text-xl font-bold leading-tight tracking-tighter sm:text-2xl md:text-2xl lg:text-2xl">
              Create beautiful images of your code.
            </h2>
          </div>
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="w-full bg-slate-100 dark:bg-slate-800 md:w-1/2">
              <Image
                src="/code-preview.png"
                alt="Card preview"
                width={1598}
                height={904}
              />
            </div>
            <div className="flex w-full flex-col gap-4 md:w-1/2">
              <div className="flex w-full flex-col items-start gap-1.5">
                <Textarea
                  placeholder="Insert your code here"
                  id="codeImage"
                  onChange={(e) => handleCodeChange(e.target.value)}
                  className="h-44"
                />
              </div>
              <div className="flex w-full flex-col items-start gap-1.5">
                <select
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-white py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
                  name="languageImage"
                  id="languageImage"
                  value={languageImage}
                  onChange={(e) => setLanguageImage(e.target.value)}
                >
                  <option value="" disabled selected>
                    {" "}
                    The code is written in what language ?
                  </option>
                  {allLanguages.map((language) => (
                    <option value={language.name.toLocaleLowerCase()}>
                      {language.name}
                    </option>
                  ))}
                </select>
              </div>
              <AlertDialog>
                {codeImage !== "" && languageImage !== "" ? (
                  <AlertDialogTrigger asChild>
                    <button
                      className={cn(
                        "inline-flex h-10 items-center justify-center rounded-md bg-slate-900 py-2 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
                      )}
                    >
                      Generate image
                    </button>
                  </AlertDialogTrigger>
                ) : (
                  <button
                    className={cn(
                      "inline-flex h-10 items-center justify-center rounded-md bg-slate-900 py-2 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
                    )}
                  >
                    You need to fill the fields
                  </button>
                )}
                <AlertDialogContent className="flex max-h-[640px] !w-auto !max-w-[1280px] flex-col items-center justify-start overflow-hidden overflow-y-auto scrollbar-hide">
                  <AlertDialogFooter>
                    <AlertDialogCancel>Close</AlertDialogCancel>
                    <button
                      className={cn(
                        "inline-flex h-10 items-center justify-center rounded-md bg-slate-900 py-2 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
                      )}
                      onClick={downloadImage}
                    >
                      Download Image
                    </button>
                  </AlertDialogFooter>
                  <div className="flex w-full items-center justify-center gap-2">
                    <button
                      className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-400 to-indigo-700"
                      onClick={handleChangeBgImg1}
                    ></button>{" "}
                    <button
                      className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-indigo-600"
                      onClick={handleChangeBgImg2}
                    ></button>{" "}
                    <button
                      className="h-6 w-6 rounded-full bg-gradient-to-br from-teal-400 to-green-500"
                      onClick={handleChangeBgImg3}
                    ></button>
                    <button
                      className="h-6 w-6 rounded-full bg-gradient-to-br from-yellow-300 to-orange-500"
                      onClick={handleChangeBgImg4}
                    ></button>
                    <button
                      className="h-6 w-6 rounded-full bg-gradient-to-br from-red-500 to-pink-600"
                      onClick={handleChangeBgImg5}
                    ></button>
                    <input
                      type="color"
                      className="h-8 w-8 cursor-pointer appearance-none rounded-full border-0 bg-transparent p-0"
                      value={backgroundImage}
                      onChange={(e) => {
                        setBackgroundImage(`${e.target.value}`)
                      }}
                    />
                  </div>
                  <div
                    ref={domRefImage}
                    className={`flex max-w-[1280px] flex-col items-center justify-center ${backgroundImage} p-8`}
                    style={{
                      backgroundColor: `${backgroundImage}`,
                    }}
                  >
                    <h3 className="mb-2 text-center text-lg font-semibold text-white">
                      sharuco.lndev.me
                    </h3>
                    <div className="max-w-[1280px] overflow-hidden rounded-lg bg-slate-900 dark:bg-black">
                      <div className="flex items-center justify-between bg-[#343541] py-1 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`
                          flex h-4 w-4 items-center rounded-full p-1 text-xs font-medium text-white
                        `}
                            style={{
                              backgroundColor: `${
                                languageImage !== "" &&
                                getLanguageColor(languageImage)
                              }`,
                            }}
                          ></span>
                          <span className="text-xs font-medium text-white">
                            {languageImage}
                          </span>
                        </div>
                        {user && (
                          <span className="flex cursor-pointer items-center p-1 text-xs font-medium text-white">
                            @ {pseudo}
                          </span>
                        )}
                      </div>
                      <pre className="max-w-[1280px] rounded-lg rounded-t-none bg-slate-900 p-4 dark:bg-black">
                        <code
                          className="text-sm text-white"
                          dangerouslySetInnerHTML={{
                            __html: highlight(codeImage, languageImage),
                          }}
                        />
                      </pre>
                    </div>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
        <Separator className="my-2" />
        <div>
          <div className="flex items-center space-x-2 text-base">
            <h4
              className="
              text-lg font-semibold text-slate-900 dark:text-slate-100
            "
            >
              Contributors
            </h4>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
              {contributors.length}
            </span>
          </div>
          <div className="mt-3 flex -space-x-2">
            {contributors
              .sort((a, b) => b.contributions - a.contributions)
              .slice(0, 10)
              .map((user) => (
                <a
                  href={"https://github.com/" + user.login}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="inline-block h-16 w-16 rounded-full ring-2 ring-white hover:ring-sky-500"
                    src={user.avatar_url}
                    alt={user.login}
                  />
                </a>
              ))}
          </div>
          {contributors.length > 6 && (
            <div className="mt-3 text-sm font-medium">
              <a
                href="https://github.com/ln-dev7/sharuco/graphs/contributors"
                className="text-blue-500"
              >
                + {contributors.length - 6} contributors
              </a>
            </div>
          )}
          {/* https://tailwindcss.com/docs/reusing-styles */}
        </div>
        <Separator className="my-2" />
        <div className="flex my-8 flex-col items-center gap-8">
          <h2 className="text-xl font-bold leading-tight tracking-tighter sm:text-2xl md:text-2xl lg:text-2xl">
            THOSE WHO SUPPORT US
          </h2>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {COMPANIES.map((support) => (
              <a
                className="shrink-0 w-[200px]"
                href={support.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={
                    theme === "dark"
                      ? support.image
                      : support.imageDark
                      ? support.imageDark
                      : support.image
                  }
                  className="cursor-pointer grayscale hover:grayscale-0"
                  alt={support.name}
                />
              </a>
            ))}
          </div>
          <h3 className="text-lg font-bold leading-tight tracking-tighter sm:text-xl md:text-2xl lg:text-xl">
            INDIVIDUALS
          </h3>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {INDIVIDUALS.map((support) => (
              <a
                className="shrink-0 w-14 h-14"
                href={support.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={support.image}
                  className="cursor-pointer rounded-full"
                  alt={support.name}
                />
              </a>
            ))}
          </div>
          <Link href="/donation" className="text-blue-500 hover:underline hover:underline-offset-4">
            Become a supporter
          </Link>
        </div>
      </section>
    </Layout>
  )
}
