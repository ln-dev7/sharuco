"use client"

import Link from "next/link"
import { useAuthContext } from "@/context/AuthContext"
import { useGitHubLoign } from "@/firebase/auth/githubLogin"
import { useDocument } from "@/firebase/firestore/getDocument"
import { useUpdateDocument } from "@/firebase/firestore/updateDocument"
import copyToClipboard from "@/utils/copyToClipboard"
import highlight from "@/utils/highlight"
import { Copy, Github, Loader2, Share, Star, Verified } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import "prism-themes/themes/prism-one-dark.min.css"
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share"

import { cn } from "@/lib/utils"
import Loader from "@/components/loader"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export default function CardCode({
  id,
  idAuthor,
  language,
  code,
  description,
  tags,
  favoris: favorisInit,
}) {
  const notifyCodeCopied = () => toast.success("Code copied to clipboard")
  const notifyUrlCopied = () => toast.success("Url of code copied to clipboard")
  const { user } = useAuthContext()
  const { login, isPending } = useGitHubLoign()

  const shareUrl = `https://sharuco.lndev.me/code-preview/${id}`

  const {
    data: dataUser,
    isLoading: isLoadingUser,
    isError: isErrorUser,
  } = useDocument(idAuthor, "users")

  const {
    data: dataCodes,
    isLoading: isLoadingCodes,
    isError: isErrorCodes,
  } = useDocument(id, "codes")

  const {
    updateDocument,
    isLoading: isLoadingAddFavoris,
    isError: isErrorAddFavoris,
    isSuccess: isSuccessAddFavoris,
    error: errorAddFavoris,
  }: any = useUpdateDocument("codes")

  const addCodeOnFavoris = async (id: string) => {
    const updatedData = {
      favoris:
        favorisInit?.includes(user.reloadUserInfo.screenName) ?? false
          ? favorisInit.filter(
              (idUser: string) => idUser !== user.reloadUserInfo.screenName
            )
          : [...favorisInit, user.reloadUserInfo.screenName],
    }

    updateDocument({ id, updatedData })
  }

  return (
    <div key={id} className="flex flex-col gap-2">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex items-center justify-between">
        <Button
          variant="subtle"
          onClick={() => {
            copyToClipboard(code)
            notifyCodeCopied()
          }}
        >
          <Copy className="mr-2 h-4 w-4" />
          Copy code
        </Button>
        <div className="flex items-center justify-start gap-2">
          {user ? (
            <Button onClick={() => addCodeOnFavoris(id)}>
              {isLoadingAddFavoris ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {user &&
                  favorisInit.includes(user.reloadUserInfo.screenName) ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#F9197F"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="#F9197F"
                      className="mr-2 h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                      />
                    </svg>
                  ) : (
                    <Star className="mr-2 h-4 w-4" />
                  )}
                  {favorisInit.length}
                </>
              )}
            </Button>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button>
                  <Star className="mr-2 h-4 w-4" />0
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Like a Code to share the love.
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Join Sharuco now to let{" "}
                    <Link
                      href={`/${idAuthor}`}
                      className="font-semibold text-slate-900 dark:text-slate-100"
                    >
                      {idAuthor}
                    </Link>{" "}
                    know you like.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <button
                    className={cn(
                      "inline-flex h-10 items-center justify-center rounded-md bg-slate-900 py-2 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
                    )}
                    disabled={isPending}
                    onClick={login}
                  >
                    {isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Github className="mr-2 h-4 w-4" />
                    )}
                    Login with Github
                  </button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>
                <Share className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Share this code on your social networks.
                </AlertDialogTitle>
              </AlertDialogHeader>
              <div className="flex gap-2">
                <FacebookShareButton
                  url={shareUrl}
                  quote={`I discovered this code on sharuco.lndev.me and found it useful, I share it with you here`}
                >
                  <FacebookIcon size={38} round />
                </FacebookShareButton>
                <TwitterShareButton
                  url={shareUrl}
                  title={`I discovered this code on sharuco.lndev.me and found it useful, I share it with you here.`}
                  hashtags={["CaParleDev", "ShareWithSharuco"]}
                >
                  <TwitterIcon size={38} round />
                </TwitterShareButton>
                <LinkedinShareButton
                  url={shareUrl}
                  title={`I discovered this code on sharuco.lndev.me and found it useful, I share it with you here. #CaParleDev`}
                  source="https://sharuco.lndev.me"
                >
                  <LinkedinIcon size={38} round />
                </LinkedinShareButton>
                <EmailShareButton
                  url={shareUrl}
                  subject={`Share code on sharuco.lndev.me`}
                  body={`I discovered this code on sharuco.lndev.me and found it useful, I share it with you here. #CaParleDev`}
                >
                  <EmailIcon size={38} round />
                </EmailShareButton>
                <WhatsappShareButton
                  url={shareUrl}
                  title={`I discovered this code on sharuco.lndev.me and found it useful, I share it with you here. #CaParleDev`}
                >
                  <WhatsappIcon size={38} round />
                </WhatsappShareButton>
                <TelegramShareButton
                  url={shareUrl}
                  title={`I discovered this code on sharuco.lndev.me and found it useful, I share it with you here. #CaParleDev`}
                >
                  <TelegramIcon size={38} round />
                </TelegramShareButton>
                <Button
                  variant="subtle"
                  className="h-10 w-10 rounded-full p-0"
                  onClick={() => {
                    copyToClipboard(shareUrl)
                    notifyUrlCopied()
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg">
        <pre className="max-h-[480px] w-auto overflow-auto rounded-lg border border-slate-600 bg-slate-900 p-4 dark:bg-black">
          <code
            className="text-white"
            dangerouslySetInnerHTML={{
              __html: highlight(code, language),
            }}
          />
        </pre>
      </div>
      <div className="flex items-center justify-between gap-4">
        <Link
          href={`/${idAuthor}`}
          className="flex items-center justify-start gap-2"
        >
          <Avatar className="h-8 w-8 cursor-pointer">
            {isLoadingUser && (
              <AvatarFallback>
                <Loader />
              </AvatarFallback>
            )}
            {dataUser && dataUser.exists && (
              <>
                <AvatarImage
                  src={dataUser.data.photoURL}
                  alt={dataUser.data.displayName}
                />
                <AvatarFallback>
                  {dataUser.data.displayName.split(" ")[1] === undefined
                    ? dataUser.data.displayName.split(" ")[0][0] +
                      dataUser.data.displayName.split(" ")[0][1]
                    : dataUser.data.displayName.split(" ")[0][0] +
                      dataUser.data.displayName.split(" ")[1][0]}
                </AvatarFallback>
              </>
            )}
          </Avatar>
          <div className="flex items-center justify-start gap-1">
            <span className="text-md font-bold text-slate-700 hover:underline dark:text-slate-400 ">
              {idAuthor}{" "}
            </span>
            {dataUser && dataUser.exists && (
              <span>
                {dataUser.data.isCertified && (
                  <Verified className="h-4 w-4 text-green-500" />
                )}
              </span>
            )}
          </div>
        </Link>
        <span className="p-2 text-sm font-bold italic text-slate-700 dark:text-slate-400">
          {language.toLowerCase()}
        </span>
      </div>
      <p className="text-sm text-slate-700 dark:text-slate-400">
        {description}
      </p>
      {tags && tags.length > 0 && (
        <div className="mb-4 flex items-center justify-start gap-2">
          {tags?.map((tag: string) => (
            <span
              key={tag}
              className="rounded-full bg-slate-700 px-2 py-1 text-xs font-medium text-slate-100 dark:bg-slate-600 dark:text-slate-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
