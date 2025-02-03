"use client";

import { getLanguageColor } from "@/constants/languages";
import { useAuthContext } from "@/context/AuthContext";
import { useGitHubLogin } from "@/firebase/auth/githubLogin";
import { useDocument } from "@/firebase/firestore/getDocument";
import { useUpdateCodeDocument } from "@/firebase/firestore/updateCodeDocument";
import copyToClipboard from "@/utils/copyToClipboard";
import embedProject from "@/utils/embedStackblitzProject";
import highlight from "@/utils/highlight";
import * as htmlToImage from "html-to-image";
import {
  Copy,
  Flag,
  Github,
  Loader2,
  Save,
  Share,
  Verified,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
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
} from "react-share";

import Loader from "@/components/loaders/loader";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { TemplateName } from "@/types/templatStackblitzName";
import { Input } from "./../ui/input";

export default function CardCode({
  id,
  idAuthor,
  language,
  code,
  description,
  tags,
  favoris: favorisInit,
  isPrivate,
  currentUser,
  comments,
}) {
  const notifyCodeCopied = () =>
    toast.message("Code copied to clipboard",{
      description: "You can paste it wherever you want",
    });
  const notifyUrlCopied = () =>
    toast.message("Url of code copied to clipboard",{
      description: "You can share it wherever you want",
    });

  const params = useParams();

  const { user, userPseudo } = useAuthContext();

  const { login, isPending } = useGitHubLogin();

  const shareUrl = `https://sharuco.lndev.me/code-preview/${id}`;

  const [openShareDialog, setOpenShareDialog] = useState(false);

  const {
    data: dataAuthor,
    isLoading: isLoadingAuthor,
    isError: isErrorAuthor,
  } = useDocument(idAuthor, "users");

  const {
    data: dataCodes,
    isLoading: isLoadingCodes,
    isError: isErrorCodes,
  } = useDocument(id, "codes");

  const { updateCodeDocument }: any = useUpdateCodeDocument("codes");

  const addCodeOnFavoris = async (id: string) => {
    let updatedCodeData = {
      favoris: favorisInit.includes(userPseudo)
        ? favorisInit.filter((item) => item !== userPseudo)
        : [...favorisInit, userPseudo],
      favorisCount: favorisInit.includes(userPseudo)
        ? favorisInit.filter((item) => item !== userPseudo).length
        : [...favorisInit, userPseudo].length,
    };

    updateCodeDocument({ id, updatedCodeData });
  };

  const domRefImage = useRef(null);
  const [backgroundImage, setBackgroundImage] = useState(
    "bg-gradient-to-br from-blue-400 to-indigo-700"
  );

  const handleChangeBgImg1 = () => {
    setBackgroundImage("bg-gradient-to-br from-blue-400 to-indigo-700");
  };

  const handleChangeBgImg2 = () => {
    setBackgroundImage("bg-gradient-to-r from-pink-500 to-indigo-600");
  };

  const handleChangeBgImg3 = () => {
    setBackgroundImage("bg-gradient-to-br from-teal-400 to-green-500");
  };

  const handleChangeBgImg4 = () => {
    setBackgroundImage("bg-gradient-to-br from-yellow-300 to-orange-500");
  };
  const handleChangeBgImg5 = () => {
    setBackgroundImage("bg-gradient-to-br from-red-500 to-pink-600");
  };

  const [nameOfImage, setNameOfImage] = useState("");

  const downloadImage = async () => {
    const dataUrl = await htmlToImage.toPng(domRefImage.current);

    // download image
    const link = document.createElement("a");
    link.download = nameOfImage !== "" ? nameOfImage : `sharuco-code-${id}.png`;
    link.href = dataUrl;
    link.click();
  };

  // console.log("params", params["code-preview"])

  return (
    <div key={id} className="mb-0 flex flex-col gap-2">
      {params["code-preview"] !== undefined && (
        <div className="flex w-full items-center justify-center">
          <Dialog>
            <DialogTrigger asChild>
              <button className="mb-1 flex items-center justify-center gap-2 rounded-md bg-[#1574ef] px-3 py-1.5 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.4}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                  />
                </svg>
                <span className="text-sm font-semibold tracking-wider text-white">
                  Open in stackblitz
                </span>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-7xl">
              <DialogHeader>
                <DialogDescription>
                  Choose the template with which the code will be executed{" "}
                </DialogDescription>
                <Select
                  onValueChange={(value: TemplateName) => {
                    embedProject(
                      value,
                      code,
                      language,
                      idAuthor,
                      description,
                      id
                    );
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Choose a template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Templates</SelectLabel>
                      <SelectItem value="angular-cli">angular-cli</SelectItem>
                      <SelectItem value="create-react-app">
                        create-react-app
                      </SelectItem>
                      <SelectItem value="html">html</SelectItem>
                      <SelectItem value="javascript">javascript</SelectItem>
                      <SelectItem value="polymer">polymer</SelectItem>
                      <SelectItem value="typescript">typescript</SelectItem>
                      <SelectItem value="vue">vue</SelectItem>
                      <SelectItem value="node">node</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </DialogHeader>
              <div
                id="embed-stackblitz"
                className="overflow-hidden rounded-lg bg-zinc-200 dark:bg-zinc-800"
              ></div>
            </DialogContent>
          </Dialog>
        </div>
      )}
      <div className="overflow-hidden rounded-lg bg-zinc-900 dark:bg-black">
        <div className="flex items-center justify-between bg-[#343541] px-4 py-1">
          <span className="text-xs font-medium text-white">
            {language.toLowerCase()}
          </span>
          <div className="flex items-center gap-4">
            <span
              className="flex cursor-pointer items-center p-1 text-xs font-medium text-white"
              onClick={() => {
                copyToClipboard(code);
                notifyCodeCopied();
              }}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy code
            </span>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="cursor-pointer text-white">
                  <Save className="h-4 w-4 cursor-pointer" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="scrollbar-hide flex max-h-[640px] !w-auto !max-w-[1280px] flex-col items-center justify-start overflow-hidden overflow-y-auto">
                <AlertDialogFooter>
                  <AlertDialogCancel>Close</AlertDialogCancel>
                  <button
                    className={cn(
                      "inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus:ring-zinc-400 dark:focus:ring-offset-zinc-900"
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
                      setBackgroundImage(`${e.target.value}`);
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
                      setNameOfImage(`${e.target.value}`);
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
                  <div className="card-code-image max-w-[1280px] overflow-hidden rounded-lg bg-zinc-900 dark:bg-black">
                    <div className="flex items-center justify-between bg-[#343541] px-4 py-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`
                          flex h-4 w-4 items-center rounded-full p-1 text-xs font-medium text-white
                        `}
                          style={{
                            backgroundColor: `${
                              language !== "" && getLanguageColor(language)
                            }`,
                          }}
                        ></span>
                        <span className="text-xs font-medium text-white">
                          {language.toLowerCase()}
                        </span>
                      </div>
                      <span className="flex cursor-pointer items-center p-1 text-xs font-medium text-white">
                        @ {idAuthor}
                      </span>
                    </div>
                    <pre className="max-w-[1280px] rounded-lg rounded-t-none bg-zinc-900 p-4 dark:bg-black">
                      <code
                        className="max-w-[1280px] text-white"
                        dangerouslySetInnerHTML={{
                          __html: highlight(code, language),
                        }}
                      />
                    </pre>
                  </div>
                </div>
              </AlertDialogContent>
            </AlertDialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="cursor-pointer text-white">
                  <Flag className="h-4 w-4 cursor-pointer" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Report this code</AlertDialogTitle>
                  <AlertDialogDescription>
                    Please, report this code if you think it&apos;s
                    inappropriate.
                    <br />
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <a
                    className={cn(
                      "inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus:ring-zinc-400 dark:focus:ring-offset-zinc-900"
                    )}
                    href={`mailto:sharuco@leonelngoya.com?subject=REPORTING%20A%20CODE%20ON%20SHARUCO&body=Hello,%20%0D%0A%0D%0AI%20want%20to%20report%20this%20code%20https://sharuco.lndev.me/code-preview/${id}%20that%20I%20saw%20on%20Sharuco.%0D%0AThank%20you`}
                  >
                    Report Code
                  </a>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        {params["code-preview"] === undefined ? (
          <Link href={`/code-preview/${id}`}>
            <pre className="max-h-[200px] w-auto overflow-auto rounded-lg rounded-t-none bg-zinc-900 p-4 hover:bg-gray-900 dark:bg-black dark:hover:bg-zinc-900">
              <code
                className="text-white"
                dangerouslySetInnerHTML={{
                  __html: highlight(code, language),
                }}
              />
            </pre>
          </Link>
        ) : (
          <pre className="w-auto overflow-auto rounded-lg rounded-t-none bg-zinc-900 p-4 dark:bg-black">
            <code
              className="text-white"
              dangerouslySetInnerHTML={{
                __html: highlight(code, language),
              }}
            />
          </pre>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <a
          href={dataAuthor && dataAuthor.exists ? `/user/${idAuthor}` : "#"}
          className="flex items-center justify-start gap-2"
        >
          <Avatar
            className={`h-8 w-8 cursor-pointer ${
              dataAuthor?.data?.premium
                ? "border-2 border-yellow-500"
                : "border-0 border-green-500"
            }`}
          >
            {isLoadingAuthor && (
              <AvatarFallback>
                <Loader />
              </AvatarFallback>
            )}
            {dataAuthor && dataAuthor.exists ? (
              <>
                <AvatarImage
                  src={dataAuthor.data.photoURL}
                  alt={
                    dataAuthor.data.displayName !== null
                      ? dataAuthor.data.displayName
                      : idAuthor
                  }
                />
                <AvatarFallback>
                  {dataAuthor.data.displayName !== null ? (
                    <>
                      {dataAuthor.data.displayName.split(" ")[1] === undefined
                        ? dataAuthor.data.displayName.split(" ")[0][0] +
                          dataAuthor.data.displayName.split(" ")[0][1]
                        : dataAuthor.data.displayName.split(" ")[0][0] +
                          dataAuthor.data.displayName.split(" ")[1][0]}
                    </>
                  ) : (
                    dataAuthor.data.pseudo[0] + dataAuthor.data.pseudo[1]
                  )}
                </AvatarFallback>
              </>
            ) : (
              <AvatarFallback>{idAuthor[0] + idAuthor[1]}</AvatarFallback>
            )}
          </Avatar>
          <div className="flex items-center justify-start gap-1">
            <span className="text-md font-bold text-zinc-700 hover:underline dark:text-zinc-400 ">
              {idAuthor}{" "}
            </span>
            {dataAuthor && dataAuthor.exists && (
              <span>
                {dataAuthor.data.premium && (
                  <Verified className="h-4 w-4 text-green-500" />
                )}
              </span>
            )}
          </div>
        </a>
        <div className="flex shrink-0 items-center justify-end gap-3">
          {params["code-preview"] === undefined && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={`/code-preview/${id}#commentsCode`}
                    className="flex gap-1 text-zinc-700 hover:text-zinc-500 dark:text-zinc-400  hover:dark:text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                      />
                    </svg>
                    {comments.length}
                    <span className="sr-only">Add or view</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add or View comments</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {user ? (
            isPrivate ? null : (
              <span
                className="flex cursor-pointer items-center p-1 text-xs font-medium text-white"
                onClick={() => {
                  addCodeOnFavoris(id);
                }}
              >
                {user && favorisInit.includes(userPseudo) ? (
                  <div className="mr-1 flex cursor-pointer  items-center justify-center rounded-full p-1 hover:bg-[#F8E3EB] dark:hover:bg-[#210C14]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#F9197F"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="#F9197F"
                      className="h-5 w-5"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                  </div>
                ) : (
                  <div className="mr-1 flex cursor-pointer items-center justify-center rounded-full p-1 text-zinc-700 hover:bg-[#F8E3EB] dark:text-zinc-400 dark:hover:bg-[#210C14]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                  </div>
                )}
                <span
                  className={`${
                    favorisInit.includes(userPseudo) ? "text-[#F9197F]" : ""
                  } hover:dark:text-white"  text-base text-zinc-700 hover:text-zinc-500  dark:text-zinc-400`}
                >
                  {favorisInit.length}
                </span>
              </span>
            )
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <span className="flex cursor-pointer items-center p-1 text-xs font-medium text-white">
                  <div className="mr-1 flex cursor-pointer items-center  justify-center rounded-full p-1 text-zinc-700 hover:bg-[#F8E3EB] dark:text-zinc-400 dark:hover:bg-[#210C14]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                      />
                    </svg>
                  </div>
                  <span
                    className={`hover:dark:text-white" text-base text-zinc-700 hover:text-zinc-500  dark:text-zinc-400`}
                  >
                    {favorisInit.length}
                  </span>
                </span>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Like a Code to share the love.
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Join Sharuco now to let{" "}
                    <a
                      href={
                        dataAuthor && dataAuthor.exists
                          ? `/user/${idAuthor}`
                          : "#"
                      }
                      className="font-semibold text-zinc-900 dark:text-zinc-100"
                    >
                      {idAuthor}
                    </a>{" "}
                    know you like.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <button
                    className={cn(
                      "inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus:ring-zinc-400 dark:focus:ring-offset-zinc-900"
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
          {!isPrivate && (
            <AlertDialog
              open={openShareDialog}
              onOpenChange={setOpenShareDialog}
            >
              <AlertDialogTrigger asChild>
                <span className="flex cursor-pointer items-center justify-center rounded-full p-1 text-zinc-700 duration-200 hover:bg-[#1C9BEF] hover:text-white dark:text-zinc-400 dark:hover:text-white">
                  <Share className="h-5 w-5" />
                </span>
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
                    quote={`I discovered this code on sharuco.lndev.me , I share it with you here. - « ${description} » #CaParleDev #ShareWithSharuco`}
                    onClick={() => setOpenShareDialog(false)}
                  >
                    <FacebookIcon size={38} round />
                  </FacebookShareButton>
                  <TwitterShareButton
                    url={shareUrl}
                    title={`I discovered this code on @sharuco_app , I share it with you here. - « ${description} »`}
                    hashtags={["CaParleDev", "ShareWithSharuco"]}
                    onClick={() => setOpenShareDialog(false)}
                  >
                    <TwitterIcon size={38} round />
                  </TwitterShareButton>
                  <LinkedinShareButton
                    url={shareUrl}
                    title={`I discovered this code on sharuco.lndev.me , I share it with you here. - « ${description} » #CaParleDev #ShareWithSharuco`}
                    source="https://sharuco.lndev.me"
                    onClick={() => setOpenShareDialog(false)}
                  >
                    <LinkedinIcon size={38} round />
                  </LinkedinShareButton>
                  <EmailShareButton
                    url={shareUrl}
                    subject={`Share code on sharuco.lndev.me`}
                    body={`I discovered this code on sharuco.lndev.me , I share it with you here. - « ${description} » #CaParleDev #ShareWithSharuco`}
                    onClick={() => setOpenShareDialog(false)}
                  >
                    <EmailIcon size={38} round />
                  </EmailShareButton>
                  <WhatsappShareButton
                    url={shareUrl}
                    title={`I discovered this code on sharuco.lndev.me , I share it with you here. - « ${description} » #CaParleDev #ShareWithSharuco`}
                    onClick={() => setOpenShareDialog(false)}
                  >
                    <WhatsappIcon size={38} round />
                  </WhatsappShareButton>
                  <TelegramShareButton
                    url={shareUrl}
                    title={`I discovered this code on sharuco.lndev.me , I share it with you here. - « ${description} » #CaParleDev #ShareWithSharuco`}
                    onClick={() => setOpenShareDialog(false)}
                  >
                    <TelegramIcon size={38} round />
                  </TelegramShareButton>
                  <Button
                    variant="subtle"
                    className="h-10 w-10 rounded-full p-0"
                    onClick={() => {
                      copyToClipboard(shareUrl);
                      notifyUrlCopied();
                      setOpenShareDialog(false);
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
          )}
        </div>
      </div>

      {params["code-preview"] === undefined ? (
        <Link
          href={`/code-preview/${id}`}
          className="text-sm text-zinc-700 dark:text-zinc-400"
        >
          {description.length > 300
            ? description.substring(0, 300) + "..."
            : description}
        </Link>
      ) : (
        <p className="text-sm text-zinc-700 dark:text-zinc-400">
          {description}
        </p>
      )}
      {tags && tags.length > 0 && (
        <div className="flex w-full flex-wrap items-center justify-start gap-2">
          {tags?.map((tag: string) => (
            <span
              key={tag}
              className="rounded-full bg-zinc-700 px-2 py-1 text-xs font-medium text-zinc-100 dark:bg-zinc-600 dark:text-zinc-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
