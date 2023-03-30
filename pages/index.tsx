import { useEffect, useRef, useState } from "react"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { useAuthContext } from "@/context/AuthContext"
import { useGitHubLoign } from "@/firebase/auth/githubLogin"
import highlight from "@/utils/highlight"
import linearizeCode from "@/utils/linearizeCode"
import * as htmlToImage from "html-to-image"
import { Code2, Github, Loader2 } from "lucide-react"
import { toast } from "react-hot-toast"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Layout } from "@/components/layout"
import {
  AlertDialog,
  AlertDialogAction,
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
    console.log(codeImage, languageImage)
    const dataUrl = await htmlToImage.toPng(domRefImage.current)

    // download image
    const link = document.createElement("a")
    link.download = `sharuco-code-${Math.random()
      .toString(36)
      .substring(7)}.png`
    link.href = dataUrl
    link.click()

    setCodeImage("")
    setLanguageImage("")
  }
  //
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
            <div className="w-full md:w-1/2">
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
                  id="codeImg"
                  onChange={(e) => setCodeImage(e.target.value)}
                  className="h-44"
                  value={codeImage}
                />
              </div>
              <div className="flex w-full flex-col items-start gap-1.5">
                <select
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
                  name="language"
                  id="language"
                  onChange={(e) => setLanguageImage(e.target.value)}
                  value={languageImage}
                >
                  <option value="" disabled selected>
                    {" "}
                    The code is written in what language ?
                  </option>
                  <option value="c">C</option>
                  <option value="csharp">C#</option>
                  <option value="css">CSS</option>
                  <option value="dart">Dart</option>
                  <option value="graphql">GraphQL</option>
                  <option value="html">HTML</option>
                  <option value="java">Java</option>
                  <option value="javascript">Javascript</option>
                  <option value="json">JSON</option>
                  <option value="kotlin">Kotlin</option>
                  <option value="markdown">Markdown</option>
                  <option value="typescript">Typescript</option>
                  <option value="php">PHP</option>
                  <option value="python">Python</option>
                  <option value="ruby">Ruby</option>
                  <option value="scss">SCSS</option>
                  <option value="sql">SQL</option>
                  <option value="swift">Swift</option>
                  <option value="xml">XML</option>
                  <option value="yaml">YAML</option>
                  <option value="other">Other</option>
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
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={downloadImage}>
                      Download Image
                    </AlertDialogAction>
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
                  </div>
                  <div
                    ref={domRefImage}
                    className={`flex max-w-[1280px] flex-col items-center justify-center ${backgroundImage} p-8`}
                  >
                    <h3 className="mb-2 text-center text-lg font-semibold text-white">
                      sharuco.lndev.me
                    </h3>
                    <div className="max-w-[1280px] overflow-hidden rounded-lg bg-slate-900 dark:bg-black">
                      <div className="flex items-center justify-between bg-[#343541] py-1 px-4">
                        <span className="text-xs font-medium text-white">
                          {languageImage}
                        </span>
                        {user && (
                          <span className="flex cursor-pointer items-center p-1 text-xs font-medium text-white">
                            @ {pseudo}
                          </span>
                        )}
                      </div>
                      <pre className="max-w-[1280px] rounded-lg rounded-t-none bg-slate-900 p-4 dark:bg-black">
                        <code
                          className="max-w-[1280px] text-white"
                          dangerouslySetInnerHTML={{
                            __html: highlight(
                              linearizeCode(codeImage),
                              languageImage
                            ),
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
      </section>
    </Layout>
  )
}
