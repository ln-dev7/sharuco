"use client"

import { COMPANIES } from "@/constants/supports"
import { useAuthContext } from "@/context/AuthContext"
import { useGitHubLogin } from "@/firebase/auth/githubLogin"

import "highlight.js/styles/vs.css"
import { useQuery } from "react-query"

import "highlight.js/styles/vs.css"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
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
import { useUiSounds } from "@/hooks/use-ui-sounds"
import { useTheme } from "@/components/theme-provider"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

import { buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { CountUp } from "@/components/home/count-up"
import { DotField } from "@/components/home/dot-field"
import { ScrollReveal } from "@/components/home/scroll-reveal"
import { SpotlightCard } from "@/components/home/spotlight-card"
import { TiltedPreview } from "@/components/home/tilted-preview"

export default function IndexPage() {
  const { login, isPending } = useGitHubLogin()
  const { resolvedTheme } = useTheme()
  const { playClick, playPop } = useUiSounds()

  const { user } = useAuthContext()

  const handleLogin = () => {
    playClick()
    login()
  }

  // Contributors
  const { data: contributors, isLoading: isLoadingContributors } = useQuery(
    "contributors",
    () =>
      fetch("https://api.github.com/repos/ln-dev7/sharuco/contributors").then(
        (response) => response.json()
      )
  )

  return (
    <>
      <section className="container-wrapper relative grid items-center gap-6 pt-10 pb-8 md:pt-16 md:pb-12">
        {/* Full-bleed decorative background */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-1/2 h-[720px] w-screen -translate-x-1/2 overflow-hidden [mask-image:radial-gradient(ellipse_75%_55%_at_50%_30%,black_40%,transparent_90%)]"
        >
          {/* Interactive dot field (reactbits-inspired): dots bulge away from the cursor */}
          <DotField
            dotRadius={1.5}
            dotSpacing={16}
            cursorRadius={260}
            bulgeStrength={55}
            gradientFrom={
              resolvedTheme === "dark"
                ? "rgba(168, 85, 247, 0.55)"
                : "rgba(99, 102, 241, 0.55)"
            }
            gradientTo="rgba(236, 72, 153, 0.35)"
            glowColor={resolvedTheme === "dark" ? "#09090b" : "#ffffff"}
          />
          {/* Floating gradient orbs layered over the dot field */}
          <div className="sharuco-drift-a absolute top-24 left-[15%] h-72 w-72 rounded-full bg-gradient-to-br from-sky-500/30 via-violet-500/25 to-fuchsia-500/30 blur-3xl dark:from-sky-500/15 dark:via-violet-500/12 dark:to-fuchsia-500/15" />
          <div className="sharuco-drift-b absolute top-40 right-[12%] h-80 w-80 rounded-full bg-gradient-to-br from-rose-500/25 via-amber-500/18 to-emerald-500/25 blur-3xl dark:from-rose-500/12 dark:via-amber-500/10 dark:to-emerald-500/12" />
          <div className="sharuco-drift-c absolute top-[420px] left-[45%] h-56 w-56 rounded-full bg-gradient-to-br from-cyan-500/22 via-indigo-500/18 to-pink-500/22 blur-3xl dark:from-cyan-500/10 dark:via-indigo-500/8 dark:to-pink-500/10" />
        </div>

        {/* Announcement pill */}
        <Link
          href="/image"
          onClick={() => playPop()}
          className="group relative z-10 inline-flex w-fit items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3 py-1 text-sm font-medium shadow-sm backdrop-blur-sm transition-all hover:border-zinc-300 hover:bg-white hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
        >
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500" />
          </span>
          <span className="rounded-full bg-gradient-to-r from-sky-500 to-violet-500 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-white uppercase">
            New
          </span>
          <span className="text-zinc-800 sm:hidden dark:text-zinc-200">
            Sharuco Image is live
          </span>
          <span className="hidden text-zinc-800 sm:inline dark:text-zinc-200">
            Turn any snippet into a shareable picture
          </span>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 dark:text-zinc-400" />
        </Link>

        {/* Headline */}
        <div className="relative z-10 flex max-w-[980px] flex-col items-start gap-5">
          <h1 className="text-4xl leading-[1.03] font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Share your{" "}
            <span className="sharuco-animated-gradient bg-gradient-to-r from-sky-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
              code
            </span>
            .
            <br className="inline" />
            Manage{" "}
            <span className="sharuco-animated-gradient bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500 bg-clip-text text-transparent">
              Form
            </span>{" "}
            &amp;{" "}
            <span className="sharuco-animated-gradient bg-gradient-to-r from-amber-500 via-rose-500 to-fuchsia-500 bg-clip-text text-transparent">
              Link
            </span>
            .
          </h1>
          <p className="max-w-[680px] text-lg text-zinc-700 sm:text-xl dark:text-zinc-400">
            Share and explore essential codes, create forms to retrieve
            information and keep useful links —{" "}
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              all in one delightful place
            </span>
            .
          </p>
        </div>

        {/* CTAs */}
        <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Link
            href={siteConfig.links.explore}
            onClick={() => playClick()}
            className={cn(
              buttonVariants({ size: "lg" }),
              "group relative gap-2 overflow-hidden shadow-[0_10px_30px_-12px_rgba(99,102,241,0.5)] transition-shadow hover:shadow-[0_16px_40px_-12px_rgba(99,102,241,0.7)] dark:shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)]"
            )}
          >
            <span className="sharuco-animated-gradient absolute inset-0 bg-gradient-to-r from-sky-500 via-violet-500 to-fuchsia-500 bg-[length:200%_200%] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="relative z-10 flex items-center gap-2">
              Explore code
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </Link>
          {user ? (
            <Link
              href="/dashboard"
              onClick={() => playClick()}
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "gap-2 backdrop-blur-sm"
              )}
            >
              <Code2 className="h-4 w-4" />
              Your dashboard
            </Link>
          ) : (
            <button
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "gap-2 backdrop-blur-sm"
              )}
              disabled={isPending}
              onClick={handleLogin}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Github className="h-4 w-4" />
              )}
              Sign in with Github
            </button>
          )}
        </div>

        {/* Trust row */}
        <div className="relative z-10 mt-1 mb-16 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-zinc-600 dark:text-zinc-400">
          <a
            href="https://github.com/ln-dev7/sharuco"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            <Github className="h-4 w-4" />
            Open source on GitHub
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <span
            aria-hidden
            className="hidden h-4 w-px bg-zinc-300 sm:inline-block dark:bg-zinc-700"
          />
          <a
            href="https://twitter.com/ln_dev7"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            Follow us on Twitter
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <ScrollReveal className="relative my-4 w-full overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 via-white to-zinc-100 p-8 md:p-10 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-950 dark:to-black">
          <div
            aria-hidden
            className="sharuco-drift-a pointer-events-none absolute -top-24 left-1/3 h-48 w-48 rounded-full bg-gradient-to-br from-sky-500/20 via-indigo-500/15 to-violet-500/20 blur-3xl"
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
                  style={{ width: support.width && `${support.width}px` }}
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
        </ScrollReveal>
        <ScrollReveal className="mt-8 flex flex-col items-start gap-4">
          <SpotlightCard className="relative w-full overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 via-white to-zinc-100 p-8 md:p-12 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-950 dark:to-black">
            <div
              aria-hidden
              className="sharuco-drift-a pointer-events-none absolute -top-24 -right-20 h-64 w-64 rounded-full bg-gradient-to-br from-pink-500/30 via-violet-500/20 to-indigo-500/30 blur-3xl"
            />
            <div
              aria-hidden
              className="sharuco-drift-b pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-gradient-to-br from-emerald-500/25 via-sky-500/20 to-blue-500/25 blur-3xl"
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
                <TiltedPreview className="relative overflow-hidden rounded-xl border border-zinc-900/10 bg-white shadow-2xl ring-1 ring-black/5 dark:border-white/10 dark:bg-zinc-950">
                  <Image
                    src="/home/code-preview.png"
                    alt="Preview of a code image generated with Sharuco"
                    width={2700}
                    height={1440}
                    priority={true}
                    className="h-auto w-full"
                  />
                </TiltedPreview>
              </div>
            </div>
          </SpotlightCard>
        </ScrollReveal>
        <ScrollReveal className="relative mt-8 w-full overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 via-white to-zinc-100 p-8 md:p-12 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-950 dark:to-black">
          <div
            aria-hidden
            className="sharuco-drift-a pointer-events-none absolute -top-32 -right-16 h-72 w-72 rounded-full bg-gradient-to-br from-sky-500/25 via-cyan-500/20 to-emerald-500/25 blur-3xl"
          />
          <div
            aria-hidden
            className="sharuco-drift-b pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-gradient-to-br from-amber-500/20 via-orange-500/15 to-rose-500/20 blur-3xl"
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
              ].map((row, i) => {
                const RowIcon = row.icon
                return (
                  <ScrollReveal
                    key={row.title}
                    delay={i * 80}
                    className={cn(
                      "flex flex-col items-center gap-6 lg:flex-row lg:gap-14",
                      row.reverse && "lg:flex-row-reverse"
                    )}
                  >
                    <div className="flex w-full flex-col items-start gap-3 lg:w-2/5">
                      <span
                        className={cn(
                          "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white/70 backdrop-blur-sm transition-transform duration-300 hover:scale-110 hover:-rotate-6 dark:border-zinc-700 dark:bg-zinc-900/60"
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
                    <div className="group relative w-full lg:w-3/5">
                      <div className="pointer-events-none absolute inset-0 -m-3 rounded-3xl bg-gradient-to-br from-sky-500/15 via-indigo-500/10 to-violet-500/15 opacity-70 blur-2xl transition-opacity duration-500 group-hover:opacity-100 dark:from-sky-500/20 dark:via-indigo-500/15 dark:to-violet-500/20" />
                      <div className="relative overflow-hidden rounded-xl border border-zinc-900/10 bg-white shadow-xl ring-1 ring-black/5 transition-transform duration-500 group-hover:-translate-y-1 dark:border-white/10 dark:bg-zinc-950">
                        <Image
                          src={row.image}
                          alt={row.title}
                          width={2880}
                          height={1448}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                          priority={true}
                        />
                      </div>
                    </div>
                  </ScrollReveal>
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
        </ScrollReveal>
        <ScrollReveal className="relative mt-8 w-full">
          <SpotlightCard className="relative w-full overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 via-white to-zinc-100 p-8 md:p-12 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-950 dark:to-black">
            <div
              aria-hidden
              className="sharuco-drift-a pointer-events-none absolute -top-24 -left-20 h-64 w-64 rounded-full bg-gradient-to-br from-violet-500/30 via-fuchsia-500/20 to-rose-500/30 blur-3xl"
            />
            <div
              aria-hidden
              className="sharuco-drift-b pointer-events-none absolute -right-16 -bottom-24 h-56 w-56 rounded-full bg-gradient-to-br from-teal-500/25 via-emerald-500/20 to-sky-500/25 blur-3xl"
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
                  Save the resources you care about, organize them in seconds,
                  and let the community discover the best of what you have
                  bookmarked.
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
                <TiltedPreview
                  baseRotateY={6}
                  baseRotateX={2}
                  className="relative overflow-hidden rounded-xl border border-zinc-900/10 bg-white shadow-2xl ring-1 ring-black/5 dark:border-white/10 dark:bg-zinc-950"
                >
                  <Image
                    src="/home/sharuco-link.png"
                    alt="Sharuco Link preview"
                    width={3024}
                    height={1896}
                    className="h-auto w-full"
                    priority={true}
                  />
                </TiltedPreview>
              </div>
            </div>
          </SpotlightCard>
        </ScrollReveal>

        <ScrollReveal className="relative mt-8 w-full overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 via-white to-zinc-100 p-8 md:p-10 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-950 dark:to-black">
          <div
            aria-hidden
            className="sharuco-drift-a pointer-events-none absolute -top-20 right-1/3 h-48 w-48 rounded-full bg-gradient-to-br from-rose-500/20 via-orange-500/15 to-amber-500/20 blur-3xl"
          />

          <div className="relative flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/60 px-3 py-1 text-xs font-medium text-zinc-700 backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-300">
                <Users className="h-3.5 w-3.5 text-rose-500" />
                Community
              </span>
              {typeof contributors?.length === "number" && (
                <span className="rounded-full bg-zinc-900 px-2.5 py-0.5 text-xs font-semibold text-white dark:bg-white dark:text-zinc-900">
                  <CountUp to={contributors.length} /> contributors
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
                    .map((user, i) => (
                      <ScrollReveal
                        as="a"
                        key={user.login}
                        delay={i * 70}
                        href={"https://github.com/" + user.login}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={user.login}
                        className="transition-transform duration-300 hover:z-10 hover:-translate-y-1 hover:scale-110"
                      >
                        <img
                          className="inline-block h-12 w-12 rounded-full ring-2 ring-white transition-all duration-300 hover:ring-4 hover:ring-rose-500 dark:ring-zinc-950"
                          src={user.avatar_url}
                          alt={user.login}
                        />
                      </ScrollReveal>
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
        </ScrollReveal>
      </section>
    </>
  )
}
