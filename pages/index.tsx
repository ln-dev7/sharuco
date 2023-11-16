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
import { useQuery } from "react-query"

import "highlight.js/styles/vs.css"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import * as htmlToImage from "html-to-image"
import { ArrowRight, Code2, Github, Loader2 } from "lucide-react"
import { useTheme } from "next-themes"

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
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"

export default function IndexPage() {
  const { login, isPending } = useGitHubLogin()
  const { theme } = useTheme()

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
    <Layout>
      <Head>
        <title>Sharuco</title>
        <meta
          name="description"
          content="Sharuco allows you to share code codes that you have found
          useful."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="google-adsense-account" content="ca-pub-2222017759396595" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <a
          className="inline-flex w-fit items-center rounded-lg bg-slate-100 px-3 py-1 text-sm font-medium dark:bg-slate-800"
          href="/forms"
        >
          🚀
          <div
            data-orientation="vertical"
            className="mx-2 h-4 w-[1px] shrink-0 bg-slate-200 dark:bg-slate-700"
          ></div>
          <span className="text-slate-800 dark:text-slate-200 sm:hidden">
            Sharuco Form, Create and share your forms.
          </span>
          <span className="hidden text-slate-800 dark:text-slate-200 sm:inline">
            Introducing Sharuco Form, Create and share your forms.
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
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
            Share your code.
            <br className="inline" />
            Manage Form & Link.
          </h1>
          <p className="max-w-[700px] text-lg text-slate-700 dark:text-slate-400 sm:text-xl">
            Share and explore essential codes, create forms to retrieve
            information and keep useful links.
          </p>
        </div>
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 md:flex-row">
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
        <Separator className="my-2" />
        <div className="my-8 flex flex-col items-center gap-8">
          <h2 className="text-xl font-bold leading-tight tracking-tighter sm:text-2xl md:text-2xl lg:text-2xl">
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
                    theme === "dark"
                      ? support.image
                      : support.imageDark
                      ? support.imageDark
                      : support.image
                  }
                  className="cursor-pointer"
                  alt={support.name}
                  priority={true}
                />
              </a>
            ))}
          </div>
        </div>
        <Separator className="my-2" />
        <div className="mt-8 flex flex-col items-start gap-4">
          <div>
            <h2 className="text-xl font-bold leading-tight tracking-tighter sm:text-2xl md:text-2xl lg:text-2xl">
              Create beautiful images of your code.
            </h2>
          </div>
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="w-full overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800 md:w-1/2">
              <Image
                src="/home/code-preview.png"
                alt="Card preview"
                width={1598}
                height={904}
                priority={true}
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
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
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
                        "inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
                      )}
                    >
                      Generate image
                    </button>
                  </AlertDialogTrigger>
                ) : (
                  <button
                    className={cn(
                      "inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
                    )}
                  >
                    You need to fill the fields
                  </button>
                )}
                <AlertDialogContent className="scrollbar-hide flex max-h-[640px] !w-auto !max-w-[1280px] flex-col items-center justify-start overflow-hidden overflow-y-auto">
                  <AlertDialogFooter>
                    <AlertDialogCancel>Close</AlertDialogCancel>
                    <button
                      className={cn(
                        "inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
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
                  <div className="flex w-full items-center justify-center gap-2">
                    <Input
                      className="w-full"
                      type="text"
                      id="tags"
                      placeholder="Name of your image"
                      value={nameOfImage}
                      onChange={(e) => {
                        setNameOfImage(`${e.target.value}`)
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
                    <div className="card-code-image max-w-[1280px] overflow-hidden rounded-lg bg-slate-900 dark:bg-black">
                      <div className="flex items-center justify-between bg-[#343541] px-4 py-1">
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
                            @ {userPseudo}
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
        <div className="mt-16 flex w-full flex-col items-start gap-4">
          <div className="flex w-full flex-col items-center justify-center gap-2">
            <h2 className="text-3xl font-bold leading-tight tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl">
              Sharuco Form
            </h2>
            <p className="text-md max-w-[700px] text-center text-slate-700 dark:text-slate-400 sm:text-lg">
              Sharuco Form allows you to create forms to collect information
              from your users.
            </p>
          </div>
          <Separator className="mx-auto my-2 block w-1/2 lg:hidden" />
          <div className="flex w-full flex-col items-center justify-center gap-4">
            <div className="flex flex-col items-start gap-16 pb-12 pt-10 lg:gap-6">
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
                <div className="w-full overflow-hidden rounded-md border border-slate-200 bg-slate-100 dark:bg-slate-800">
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
                <div className="w-full overflow-hidden rounded-md bg-slate-100 dark:border dark:border-slate-800 dark:bg-slate-800">
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
                <div className="w-full overflow-hidden rounded-md border border-slate-200 bg-slate-100 dark:bg-slate-800">
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
                <div className="w-full overflow-hidden rounded-md bg-slate-100 dark:border dark:border-slate-800 dark:bg-slate-800">
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
            <h2 className="text-xl font-bold leading-tight tracking-tighter sm:text-2xl md:text-3xl lg:text-4xl">
              Discover Sharuco Link
            </h2>
            <p className="text-md max-w-[700px] text-slate-700 dark:text-slate-400 sm:text-lg">
              Sharuco Link is a simple way to store all the links that are
              useful to you and with possibilities to make everyone discover
              them.
            </p>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-4">
            <div className="w-full overflow-hidden rounded-md bg-slate-100 dark:border dark:border-slate-700 dark:bg-slate-800">
              <Image
                src="/home/sharuco-link.png"
                alt="Sharuco Link"
                width={2880}
                height={1448}
                className="w-full "
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
            <h4
              className="
              text-lg font-semibold text-slate-900 dark:text-slate-100
            "
            >
              Contributors
            </h4>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
              {contributors?.length}
            </span>
          </div>
          <div className="mt-3 flex -space-x-2">
            {isLoadingContributors && (
              <>
                <Skeleton className="inline-block h-14 w-14 rounded-full bg-slate-200 ring-2 ring-white hover:ring-sky-500 dark:bg-slate-800" />
                <Skeleton className="inline-block h-14 w-14 rounded-full bg-slate-200 ring-2 ring-white hover:ring-sky-500 dark:bg-slate-800" />
                <Skeleton className="inline-block h-14 w-14 rounded-full bg-slate-200 ring-2 ring-white hover:ring-sky-500 dark:bg-slate-800" />
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
          <p className="mt-4 text-sm text-slate-700 dark:text-slate-400">
            Many thanks to all of you !
          </p>
        </div>
      </section>
    </Layout>
  )
}
