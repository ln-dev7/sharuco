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
  ArrowUpRight,
  Bookmark,
  Check,
  Code2,
  Compass,
  Download,
  Github,
  Globe,
  Hash,
  Heart,
  Inbox,
  Keyboard,
  LayoutGrid,
  ListChecks,
  Loader2,
  Paintbrush,
  Send,
  Sparkles,
  Users,
} from "lucide-react"
import { useTheme } from "@/components/theme-provider"

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
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        </a>
        <div className="flex max-w-[980px] flex-col items-start gap-3">
          <h1 className="text-3xl leading-[1.05] font-extrabold tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
            Share your{" "}
            <span className="bg-gradient-to-r from-sky-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
              code
            </span>
            .
            <br className="inline" />
            Manage{" "}
            <span className="bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500 bg-clip-text text-transparent">
              Form
            </span>{" "}
            &amp;{" "}
            <span className="bg-gradient-to-r from-amber-500 via-rose-500 to-fuchsia-500 bg-clip-text text-transparent">
              Link
            </span>
            .
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
        <div className="relative my-4 w-full overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 via-white to-zinc-100 p-8 md:p-10 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-950 dark:to-black">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/3 h-48 w-48 rounded-full bg-gradient-to-br from-sky-500/20 via-indigo-500/15 to-violet-500/20 blur-3xl"
          />
          <div className="relative flex flex-col items-center gap-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/60 px-3 py-1 text-xs font-medium text-zinc-700 backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-300">
              <Heart className="h-3.5 w-3.5 text-rose-500" />
              Our sponsors
            </span>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {COMPANIES.map((support) => (
                <a
                  key={support.name}
                  className="w-40 shrink-0 opacity-80 transition-opacity hover:opacity-100"
                  href={support.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    width={160}
                    height={55}
                    src={
                      resolvedTheme === "dark"
                        ? support.image
                        : support.imageDark
                    }
                    className="cursor-pointer"
                    alt={support.name}
                    priority={true}
                  />
                </a>
              ))}
            </div>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://lndev.mychariow.shop/prd_3cu1s0"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Become a sponsor
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
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
                    width={2700}
                    height={1440}
                    priority={true}
                    className="h-auto w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative mt-8 w-full overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 via-white to-zinc-100 p-8 md:p-12 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-950 dark:to-black">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 -right-16 h-72 w-72 rounded-full bg-gradient-to-br from-sky-500/25 via-cyan-500/20 to-emerald-500/25 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-gradient-to-br from-amber-500/20 via-orange-500/15 to-rose-500/20 blur-3xl"
          />

          <div className="relative flex flex-col gap-10">
            <div className="flex max-w-[680px] flex-col items-start gap-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/60 px-3 py-1 text-xs font-medium text-zinc-700 backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-300">
                <ListChecks className="h-3.5 w-3.5 text-sky-500" />
                Sharuco Form · Collect anything
              </span>
              <h2 className="text-3xl leading-[1.05] font-extrabold tracking-tighter md:text-4xl lg:text-5xl">
                Create & share forms in minutes.
              </h2>
              <p className="max-w-[560px] text-sm text-zinc-600 md:text-base dark:text-zinc-400">
                Build any form with the question types you need, publish it with
                a single click, and collect every response in one place.
              </p>
            </div>

            <div className="flex flex-col gap-14 lg:gap-10">
              {[
                {
                  icon: ListChecks,
                  iconColor: "text-sky-500",
                  title: "Create forms easily in minutes",
                  description:
                    "Pick from every question type you need and customize the form to match your flow.",
                  image: "/home/form-1.png",
                  reverse: false,
                },
                {
                  icon: Send,
                  iconColor: "text-violet-500",
                  title: "Publish in one click",
                  description:
                    "Give everyone the opportunity to respond by publishing your form and sharing it on your socials.",
                  image: "/home/form-2.png",
                  reverse: true,
                },
                {
                  icon: Inbox,
                  iconColor: "text-emerald-500",
                  title: "Collect all your information",
                  description:
                    "In a dedicated area you have access to every response submitted through your form.",
                  image: "/home/form-3.png",
                  reverse: false,
                },
                {
                  icon: LayoutGrid,
                  iconColor: "text-amber-500",
                  title: "Manage all your forms",
                  description:
                    "A single screen gives you a global view of every form you own, with full control over each.",
                  image: "/home/form-4.png",
                  reverse: true,
                },
              ].map((row) => {
                const RowIcon = row.icon
                return (
                  <div
                    key={row.title}
                    className={cn(
                      "flex flex-col items-center gap-6 lg:flex-row lg:gap-14",
                      row.reverse && "lg:flex-row-reverse"
                    )}
                  >
                    <div className="flex w-full flex-col items-start gap-3 lg:w-2/5">
                      <span
                        className={cn(
                          "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white/70 backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-900/60"
                        )}
                      >
                        <RowIcon className={cn("h-5 w-5", row.iconColor)} />
                      </span>
                      <h3 className="text-2xl leading-tight font-bold tracking-tight sm:text-3xl">
                        {row.title}
                      </h3>
                      <p className="text-sm text-zinc-600 md:text-base dark:text-zinc-400">
                        {row.description}
                      </p>
                    </div>
                    <div className="relative w-full lg:w-3/5">
                      <div className="pointer-events-none absolute inset-0 -m-3 rounded-3xl bg-gradient-to-br from-sky-500/15 via-indigo-500/10 to-violet-500/15 blur-2xl dark:from-sky-500/20 dark:via-indigo-500/15 dark:to-violet-500/20" />
                      <div className="relative overflow-hidden rounded-xl border border-zinc-900/10 bg-white shadow-xl ring-1 ring-black/5 dark:border-white/10 dark:bg-zinc-950">
                        <Image
                          src={row.image}
                          alt={row.title}
                          width={2880}
                          height={1448}
                          className="h-full w-full object-cover"
                          priority={true}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/forms"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "gap-2 shadow-lg shadow-zinc-900/10 dark:shadow-black/40"
                )}
              >
                Go to Sharuco Form
                <ArrowRight className="h-4 w-4" />
              </Link>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Free · Sign in to start
              </span>
            </div>
          </div>
        </div>
        <div className="relative mt-8 w-full overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 via-white to-zinc-100 p-8 md:p-12 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-950 dark:to-black">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -left-20 h-64 w-64 rounded-full bg-gradient-to-br from-violet-500/30 via-fuchsia-500/20 to-rose-500/30 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -bottom-24 h-56 w-56 rounded-full bg-gradient-to-br from-teal-500/25 via-emerald-500/20 to-sky-500/25 blur-3xl"
          />

          <div className="relative grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-center">
            <div className="flex flex-col items-start gap-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/60 px-3 py-1 text-xs font-medium text-zinc-700 backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-300">
                <Bookmark className="h-3.5 w-3.5 text-fuchsia-500" />
                Sharuco Link · Curated hub
              </span>

              <h2 className="text-3xl leading-[1.05] font-extrabold tracking-tighter md:text-4xl lg:text-5xl">
                Store every link worth keeping.
              </h2>
              <p className="max-w-[520px] text-sm text-zinc-600 md:text-base dark:text-zinc-400">
                Save the resources you care about, organize them in seconds, and
                let the community discover the best of what you have bookmarked.
              </p>

              <ul className="mt-1 grid grid-cols-1 gap-x-6 gap-y-2 text-sm text-zinc-700 sm:grid-cols-2 dark:text-zinc-300">
                <li className="flex items-center gap-2">
                  <Bookmark className="h-4 w-4 shrink-0 text-fuchsia-500" />
                  Personal link library
                </li>
                <li className="flex items-center gap-2">
                  <Compass className="h-4 w-4 shrink-0 text-teal-500" />
                  Discover community picks
                </li>
                <li className="flex items-center gap-2">
                  <Globe className="h-4 w-4 shrink-0 text-sky-500" />
                  Rich link previews
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 shrink-0 text-amber-500" />
                  One-click sharing
                </li>
              </ul>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Link
                  href="/links"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "gap-2 shadow-lg shadow-zinc-900/10 dark:shadow-black/40"
                  )}
                >
                  Go to Sharuco Link
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  Public & private lists
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-0 -m-4 rounded-3xl bg-gradient-to-br from-fuchsia-500/30 via-violet-500/25 to-teal-500/30 blur-2xl dark:from-fuchsia-500/25 dark:via-violet-500/20 dark:to-teal-500/25" />
              <div
                className="relative overflow-hidden rounded-xl border border-zinc-900/10 bg-white shadow-2xl ring-1 ring-black/5 dark:border-white/10 dark:bg-zinc-950"
                style={{
                  transform: "perspective(1200px) rotateY(6deg) rotateX(2deg)",
                }}
              >
                <Image
                  src="/home/sharuco-link.png"
                  alt="Sharuco Link preview"
                  width={3024}
                  height={1896}
                  className="h-auto w-full"
                  priority={true}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-8 w-full overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 via-white to-zinc-100 p-8 md:p-10 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-950 dark:to-black">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 right-1/3 h-48 w-48 rounded-full bg-gradient-to-br from-rose-500/20 via-orange-500/15 to-amber-500/20 blur-3xl"
          />

          <div className="relative flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/60 px-3 py-1 text-xs font-medium text-zinc-700 backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-300">
                <Users className="h-3.5 w-3.5 text-rose-500" />
                Community
              </span>
              {typeof contributors?.length === "number" && (
                <span className="rounded-full bg-zinc-900 px-2.5 py-0.5 text-xs font-semibold text-white dark:bg-white dark:text-zinc-900">
                  {contributors.length} contributors
                </span>
              )}
            </div>

            <h3 className="text-2xl leading-tight font-bold tracking-tighter sm:text-3xl">
              Built by people who{" "}
              <span className="bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
                love
              </span>{" "}
              sharing code.
            </h3>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex -space-x-2">
                {isLoadingContributors && (
                  <>
                    <Skeleton className="inline-block h-12 w-12 rounded-full bg-zinc-200 ring-2 ring-white dark:bg-zinc-800 dark:ring-zinc-950" />
                    <Skeleton className="inline-block h-12 w-12 rounded-full bg-zinc-200 ring-2 ring-white dark:bg-zinc-800 dark:ring-zinc-950" />
                    <Skeleton className="inline-block h-12 w-12 rounded-full bg-zinc-200 ring-2 ring-white dark:bg-zinc-800 dark:ring-zinc-950" />
                  </>
                )}
                {contributors &&
                  contributors
                    .filter((user) => user.login !== "dependabot[bot]")
                    .sort((a, b) => b.contributions - a.contributions)
                    .slice(0, 8)
                    .map((user) => (
                      <a
                        key={user.login}
                        href={"https://github.com/" + user.login}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={user.login}
                        className="transition-transform hover:z-10 hover:-translate-y-0.5"
                      >
                        <img
                          className="inline-block h-12 w-12 rounded-full ring-2 ring-white hover:ring-rose-500 dark:ring-zinc-950"
                          src={user.avatar_url}
                          alt={user.login}
                        />
                      </a>
                    ))}
              </div>
              {contributors?.length > 8 && (
                <a
                  href="https://github.com/ln-dev7/sharuco/graphs/contributors"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-700 underline-offset-4 hover:text-zinc-900 hover:underline dark:text-zinc-300 dark:hover:text-zinc-100"
                >
                  + {contributors.length - 8} more
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}
            </div>

            <p className="max-w-[560px] text-sm text-zinc-600 dark:text-zinc-400">
              Sharuco is open source. Huge thanks to every contributor who has
              shaped what it is today — and to everyone who ships a PR next.
            </p>

            <div>
              <a
                href="https://github.com/ln-dev7/sharuco"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "gap-2"
                )}
              >
                <Github className="h-4 w-4" />
                Star on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
