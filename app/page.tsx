"use client"

import {
  allLanguages,
  getLanguageColor,
  languagesName,
} from "@/constants/languages"
import { COMPANIES } from "@/constants/supports.js"
import { useAuthContext } from "@/context/AuthContext"
import { useGitHubLogin } from "@/firebase/auth/githubLogin"
import highlight from "@/utils/highlight"
import linearizeCode from "@/utils/linearizeCode"
import hljs from "highlight.js"

import { Separator } from "@/components/ui/separator"
import "highlight.js/styles/vs.css"
import { useEffect, useRef, useState } from "react"
import { useQuery } from "react-query"

import "highlight.js/styles/vs.css"
import Image from "next/image"
import Link from "next/link"
import * as htmlToImage from "html-to-image"
import {
  ArrowRight,
  Check,
  Code2,
  Download,
  Github,
  Hash,
  Keyboard,
  Loader2,
  Paintbrush,
  Sparkles,
} from "lucide-react"
import { useTheme } from "next-themes"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"

export default function IndexPage() {
  const { login, isPending } = useGitHubLogin()
  const { resolvedTheme } = useTheme()

  const { user, userPseudo } = useAuthContext()

  const [userCountry, setUserCountry] = useState("")
  useEffect(() => {
    setUserCountry(window.navigator.language.split("-")[1])
  }, [])

  // Contributors
  const {
    data: contributors,
    isLoading: isLoadingContributors,
    isError: isErrorContributors,
  } = useQuery("contributors", () =>
    fetch("https://api.github.com/repos/ln-dev7/sharuco/contributors").then(
      (response) => response.json()
    )
  )
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

  const [nameOfImage, setNameOfImage] = useState("")

  const downloadImage = async () => {
    const dataUrl = await htmlToImage.toPng(domRefImage.current)

    // download image
    const link = document.createElement("a")
    link.download =
      nameOfImage !== ""
        ? nameOfImage
        : `sharuco-code-${Math.random().toString(36).substring(7)}.png`
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
    <>
      <section className="container-wrapper grid items-center gap-6 pt-6 pb-8 md:py-10">
        <a
          className="inline-flex w-fit items-center rounded-lg bg-zinc-100 px-3 py-1 text-sm font-medium dark:bg-zinc-800"
          href="/image"
        >
          🚀
          <div
            data-orientation="vertical"
            className="mx-2 h-4 w-[1px] shrink-0 bg-zinc-200 dark:bg-zinc-700"
          ></div>
          <span className="text-zinc-800 sm:hidden dark:text-zinc-200">
            Sharuco Image, Turn your code into a shareable picture.
          </span>
          <span className="hidden text-zinc-800 sm:inline dark:text-zinc-200">
            Introducing Sharuco Image, Turn your code into a shareable picture.
          </span>
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="ml-1 h-4 w-4 shrink-0"
          >
            <path
              d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
              fill="currentColor"
              fill-rule="evenodd"
              clip-rule="evenodd"
            ></path>
          </svg>
        </a>
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-3xl leading-tight font-extrabold tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
            Share your code.
            <br className="inline" />
            Manage Form & Link.
          </h1>
          <p className="max-w-[700px] text-lg text-zinc-700 sm:text-xl dark:text-zinc-400">
            Share and explore essential codes, create forms to retrieve
            information and keep useful links.
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
        <p className="text-sm text-zinc-700 dark:text-zinc-400">
          Follow us on{" "}
          <Link
            href="https://twitter.com/ln_dev7"
            className="font-bold underline underline-offset-4"
          >
            Twitter
          </Link>{" "}
          for the latest updates
        </p>
        <Separator className="my-2" />
        <div className="my-8 flex flex-col items-center gap-8">
          <h2 className="text-xl leading-tight font-bold tracking-tighter sm:text-2xl md:text-2xl lg:text-2xl">
            OUR SPONSORS
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {COMPANIES.map((support) => (
              <a
                className="w-40 shrink-0"
                href={support.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  width={160}
                  height={55}
                  src={
                    resolvedTheme === "dark" ? support.image : support.imageDark
                  }
                  className="cursor-pointer"
                  alt={support.name}
                  priority={true}
                />
              </a>
            ))}
          </div>
          <a
            target="href"
            href="https://lndev.mychariow.shop/prd_3cu1s0"
            className="text-center text-xs font-semibold text-sky-400 uppercase underline underline-offset-4"
          >
            Your logo here?
          </a>
        </div>
        <Separator className="my-2" />
        <div className="mt-8 flex flex-col items-start gap-4">
          <div className="relative w-full overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 via-white to-zinc-100 p-8 md:p-12 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-950 dark:to-black">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 -right-20 h-64 w-64 rounded-full bg-gradient-to-br from-pink-500/30 via-violet-500/20 to-indigo-500/30 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-gradient-to-br from-emerald-500/25 via-sky-500/20 to-blue-500/25 blur-3xl"
            />

            <div className="relative grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-center">
              <div className="flex flex-col items-start gap-5">
                <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/60 px-3 py-1 text-xs font-medium text-zinc-700 backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  Powered by Shiki · 30+ themes
                </span>

                <h2 className="text-3xl leading-[1.05] font-extrabold tracking-tighter md:text-4xl lg:text-5xl">
                  Create beautiful images of your code.
                </h2>
                <p className="max-w-[520px] text-sm text-zinc-600 md:text-base dark:text-zinc-400">
                  Paste a snippet, pick a theme, and export a ready-to-share
                  screenshot. Syntax colors change with the theme just like on
                  ray.so — no more flat white code.
                </p>

                <ul className="mt-1 grid grid-cols-1 gap-x-6 gap-y-2 text-sm text-zinc-700 sm:grid-cols-2 dark:text-zinc-300">
                  <li className="flex items-center gap-2">
                    <Paintbrush className="h-4 w-4 shrink-0 text-pink-500" />
                    14 themes + 16 partner presets
                  </li>
                  <li className="flex items-center gap-2">
                    <Hash className="h-4 w-4 shrink-0 text-violet-500" />
                    Line numbers & traffic lights
                  </li>
                  <li className="flex items-center gap-2">
                    <Download className="h-4 w-4 shrink-0 text-emerald-500" />
                    PNG download & clipboard copy
                  </li>
                  <li className="flex items-center gap-2">
                    <Keyboard className="h-4 w-4 shrink-0 text-sky-500" />
                    Full keyboard shortcuts
                  </li>
                </ul>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {[
                    {
                      name: "Midnight",
                      gradient: "from-[#4CC8C8] to-[#202033]",
                    },
                    { name: "Candy", gradient: "from-[#A58EFB] to-[#E9BFF8]" },
                    { name: "Sunset", gradient: "from-[#FFCF73] to-[#FF7A2F]" },
                    { name: "Breeze", gradient: "from-[#CF2F98] to-[#6A3DEC]" },
                    { name: "Vercel", gradient: "from-[#000000] to-[#000000]" },
                    {
                      name: "Supabase",
                      gradient: "from-[#1F1F1F] to-[#0E0E0E]",
                    },
                  ].map((t) => (
                    <span
                      key={t.name}
                      className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white/70 py-1 pr-3 pl-1.5 text-xs font-medium text-zinc-700 backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-300"
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "h-3.5 w-3.5 shrink-0 rounded-full bg-gradient-to-br",
                          t.gradient
                        )}
                      />
                      {t.name}
                    </span>
                  ))}
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    + 24 more
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <Link
                    href="/image"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "gap-2 shadow-lg shadow-zinc-900/10 dark:shadow-black/40"
                    )}
                  >
                    Open full editor
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    Free · no sign-in required
                  </span>
                </div>
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute inset-0 -m-4 rounded-3xl bg-gradient-to-br from-fuchsia-500/40 via-violet-500/30 to-sky-500/40 blur-2xl dark:from-fuchsia-500/30 dark:via-violet-500/20 dark:to-sky-500/30" />
                <div
                  className="relative overflow-hidden rounded-xl border border-zinc-900/10 bg-white shadow-2xl ring-1 ring-black/5 dark:border-white/10 dark:bg-zinc-950"
                  style={{
                    transform:
                      "perspective(1200px) rotateY(-6deg) rotateX(2deg)",
                  }}
                >
                  <Image
                    src="/home/code-preview.png"
                    alt="Preview of a code image generated with Sharuco"
                    width={1598}
                    height={904}
                    priority={false}
                    className="h-auto w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 flex w-full flex-col items-start gap-4">
          <div className="flex w-full flex-col items-center justify-center gap-2">
            <h2 className="text-3xl leading-tight font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl">
              Sharuco Form
            </h2>
            <p className="text-md max-w-[700px] text-center text-zinc-700 sm:text-lg dark:text-zinc-400">
              Sharuco Form allows you to create forms to collect information
              from your users.
            </p>
          </div>
          <Separator className="mx-auto my-2 block w-1/2 lg:hidden" />
          <div className="flex w-full flex-col items-center justify-center gap-4">
            <div className="flex flex-col items-start gap-16 pt-10 pb-12 lg:gap-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:gap-20">
                <div className="flex w-full flex-col items-start justify-center gap-2 sm:gap-4">
                  <h3 className="text-2xl font-medium sm:text-4xl">
                    Create forms
                    <br className="hidden sm:inline" /> easily in minutes{" "}
                  </h3>
                  <p>
                    Choose from all the different question types present to
                    customize your form.
                  </p>
                </div>
                <div className="w-full overflow-hidden rounded-md border border-zinc-200 bg-zinc-100 dark:bg-zinc-800">
                  <Image
                    src="/home/form-1.png"
                    alt="Sharuco Form"
                    width={2880}
                    height={1448}
                    className="h-full w-full object-cover"
                    priority={true}
                  />
                </div>
              </div>
              <div className="flex flex-col-reverse gap-4 lg:flex-row lg:gap-20">
                <div className="w-full overflow-hidden rounded-md bg-zinc-100 dark:border dark:border-zinc-800 dark:bg-zinc-800">
                  <Image
                    src="/home/form-2.png"
                    alt="Sharuco Form"
                    width={2880}
                    height={1448}
                    className="h-full w-full object-cover"
                    priority={true}
                  />
                </div>
                <div className="flex w-full flex-col items-start justify-center gap-2 sm:gap-4">
                  <h3 className="text-2xl font-medium sm:text-4xl">
                    Publish your form
                    <br className="hidden sm:inline" /> in one click
                  </h3>
                  <p>
                    Give everyone the opportunity to reply to your form by
                    publishing and sharing it on your networks.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4 lg:flex-row lg:gap-20">
                <div className="flex w-full flex-col items-start justify-center gap-2 sm:gap-4">
                  <h3 className="text-2xl font-medium sm:text-4xl">
                    Collect all
                    <br className="hidden sm:inline" /> your information
                  </h3>
                  <p>
                    In a dedicated area you have access to all the data sent via
                    your form
                  </p>
                </div>
                <div className="w-full overflow-hidden rounded-md border border-zinc-200 bg-zinc-100 dark:bg-zinc-800">
                  <Image
                    src="/home/form-3.png"
                    alt="Sharuco Form"
                    width={2880}
                    height={1448}
                    className="h-full w-full object-cover"
                    priority={true}
                  />
                </div>
              </div>
              <div className="flex flex-col-reverse gap-4 lg:flex-row lg:gap-20">
                <div className="w-full overflow-hidden rounded-md bg-zinc-100 dark:border dark:border-zinc-800 dark:bg-zinc-800">
                  <Image
                    src="/home/form-4.png"
                    alt="Sharuco Form"
                    width={2880}
                    height={1448}
                    className="h-full w-full object-cover"
                    priority={true}
                  />
                </div>
                <div className="flex w-full flex-col items-start justify-center gap-2 sm:gap-4">
                  <h3 className="text-2xl font-medium sm:text-4xl">
                    Manages all forms
                  </h3>
                  <p>
                    In one screen you have a global visualization of all your
                    forms with the ability to manage them.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex w-fit items-center justify-center">
              <Link
                href="/forms"
                className={buttonVariants({ size: "lg", variant: "subtle" })}
              >
                Go to Sharuco Form
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-16 flex w-full flex-col items-start gap-4">
          <div className="flex w-full flex-col items-start justify-center gap-2">
            <h2 className="text-xl leading-tight font-bold tracking-tighter sm:text-2xl md:text-3xl lg:text-4xl">
              Discover Sharuco Link
            </h2>
            <p className="text-md max-w-[700px] text-zinc-700 sm:text-lg dark:text-zinc-400">
              Sharuco Link is a simple way to store all the links that are
              useful to you and with possibilities to make everyone discover
              them.
            </p>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-4">
            <div className="w-full overflow-hidden rounded-md bg-zinc-100 dark:border dark:border-zinc-700 dark:bg-zinc-800">
              <Image
                src="/home/sharuco-link.png"
                alt="Sharuco Link"
                width={2880}
                height={1448}
                className="w-full"
                priority={true}
              />
            </div>
            <div className="flex w-fit items-center justify-center">
              <Link href="/links" className={buttonVariants({ size: "lg" })}>
                Go to Sharuco Link
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
        <Separator className="my-2" />
        <div>
          <div className="flex items-center space-x-2 text-base">
            <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Contributors
            </h4>
            <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-semibold text-zinc-700">
              {contributors?.length}
            </span>
          </div>
          <div className="mt-3 flex -space-x-2">
            {isLoadingContributors && (
              <>
                <Skeleton className="inline-block h-14 w-14 rounded-full bg-zinc-200 ring-2 ring-white hover:ring-sky-500 dark:bg-zinc-800" />
                <Skeleton className="inline-block h-14 w-14 rounded-full bg-zinc-200 ring-2 ring-white hover:ring-sky-500 dark:bg-zinc-800" />
                <Skeleton className="inline-block h-14 w-14 rounded-full bg-zinc-200 ring-2 ring-white hover:ring-sky-500 dark:bg-zinc-800" />
              </>
            )}
            {contributors &&
              contributors
                .filter((user) => user.login !== "dependabot[bot]")
                .sort((a, b) => b.contributions - a.contributions)
                .slice(0, 6)
                .map((user) => (
                  <a
                    href={"https://github.com/" + user.login}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      className="inline-block h-14 w-14 rounded-full ring-2 ring-white hover:ring-sky-500"
                      src={user.avatar_url}
                      alt={user.login}
                    />
                  </a>
                ))}
          </div>
          {contributors?.length > 6 && (
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
          <p className="mt-4 text-sm text-zinc-700 dark:text-zinc-400">
            Many thanks to all of you !
          </p>
        </div>
      </section>
    </>
  )
}
