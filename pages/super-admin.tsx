"use client"

import React, { useEffect, useRef, useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/context/AuthContext"
import { useGitHubLogout } from "@/firebase/auth/githubLogout"
import { useCreateDocument } from "@/firebase/firestore/createDocument"
import { useDocuments } from "@/firebase/firestore/getDocuments"
import { useGetFavoriteCode } from "@/firebase/firestore/getFavoriteCode"
import { useGetIsPrivateCodeFromUser } from "@/firebase/firestore/getIsPrivateCodeFromUser"
import { useGetIsPrivateCodes } from "@/firebase/firestore/getIsPrivateCodes"
import linearizeCode from "@/utils/linearizeCode"
import { yupResolver } from "@hookform/resolvers/yup"
import {
  Code,
  Eye,
  EyeOff,
  Loader2,
  MoreHorizontal,
  Plus,
  Star,
  User,
  UserCheckIcon,
  UserCog,
  UserIcon,
} from "lucide-react"
import moment from "moment"
import { useForm } from "react-hook-form"
import toast, { Toaster } from "react-hot-toast"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import * as yup from "yup"

import { cn } from "@/lib/utils"
import CardCode from "@/components/card-code"
import CardCodeAdmin from "@/components/card-code-admin"
import Error from "@/components/error"
import { Layout } from "@/components/layout"
import Loader from "@/components/loader"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import CardUserAdmin from "@/components/card-user-admin"

export default function Dashboard() {
  const { logout } = useGitHubLogout()
  const notifyCodeAdded = () =>
    toast.success("Your code has been added successfully !")

  const { user } = useAuthContext()
  const router = useRouter()
  useEffect(() => {
    if (!user || user.reloadUserInfo.screenName !== "ln-dev7") {
      router.push("/")
    }
  })

  const {
    data: dataUsers,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
  } = useDocuments("users")

  const {
    data: dataCodes,
    isLoading: isLoadingCodes,
    isError: isErrorCodes,
  } = useDocuments("codes")

  const [checkboxOn, setCheckboxOn] = useState(false)

  const schema = yup.object().shape({
    code: yup.string().required(),
    description: yup.string().required(),
    language: yup.string().required(),
    tags: yup.string(),
    isPrivate: yup.boolean(),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const { createDocument, isLoading, isError, isSuccess }: any =
    useCreateDocument("codes")

  const onSubmit = async (data) => {
    const { code, description, language, tags, isPrivate } = data
    const linearCode = linearizeCode(code)
    const now = Date.now()
    const tabTabs = tags ? tags.split(",") : []
    if (tabTabs[tabTabs.length - 1] === "") {
      tabTabs.pop()
    }

    const newDocument = {
      code: linearCode,
      description: description,
      isPrivate: !!isPrivate,
      language: language,
      tags: tabTabs,
      date: now,
      favoris: [],
      idAuthor: user.reloadUserInfo.screenName,
    }

    createDocument(newDocument)

    reset({
      code: "",
      description: "",
      language: "",
      tags: "",
      isPrivate: false,
    })
    setCheckboxOn(false)
  }

  useEffect(() => {
    if (isSuccess) {
      notifyCodeAdded()
    }
  }, [isSuccess])

  return (
    <Layout>
      <Head>
        <title>Sharuco | Super Admin</title>
        <meta
          name="description"
          content="Sharuco allows you to share code snippets that you have found
         useful."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
        <Toaster position="top-right" reverseOrder={false} />
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-2xl font-extrabold leading-tight tracking-tighter sm:text-2xl md:text-4xl lg:text-4xl">
            Hello Admin
          </h1>
        </div>
        <Tabs defaultValue="all-codes" className="w-full">
          <TabsList>
            <div>
              <TabsTrigger value="all-codes">
                <Code className="mr-2 h-4 w-4" />
                All codes
              </TabsTrigger>
              <TabsTrigger value="all-users">
                <UserIcon className="mr-2 h-4 w-4" />
                All users
              </TabsTrigger>
            </div>
          </TabsList>
          <TabsContent className="border-none p-0 pt-4" value="all-codes">
            {isLoadingCodes && <Loader />}
            {dataCodes && (
              <>
                <ResponsiveMasonry
                  columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
                  className="w-full"
                >
                  <Masonry gutter="1rem">
                    {dataCodes
                      .sort((a, b) => {
                        return moment(b.createdAt).diff(moment(a.createdAt))
                      })
                      .map(
                        (code: {
                          id: string
                          idAuthor: string
                          language: string
                          code: string
                          description: string
                          tags: string[]
                          favoris: string[]
                        }) => (
                          <CardCodeAdmin
                            key={code.id}
                            id={code.id}
                            idAuthor={code.idAuthor}
                            language={code.language}
                            code={code.code}
                            description={code.description}
                            tags={code.tags}
                            favoris={code.favoris}
                          />
                        )
                      )}
                  </Masonry>
                </ResponsiveMasonry>
                {dataCodes.length == 0 && (
                  <div className="flex flex-col items-center gap-4">
                    <h1 className="text-2xl font-bold">
                      You don&apos;t have any public code yet
                    </h1>
                  </div>
                )}
              </>
            )}
            {isErrorCodes && <Error />}
          </TabsContent>
          <TabsContent className="border-none p-0 pt-4" value="all-users">
            {isLoadingUsers && <Loader />}
            {dataUsers && (
               <ResponsiveMasonry
               columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
               className="w-full"
             >
               <Masonry gutter="1rem">
                 {dataUsers
                   .sort((a, b) => {
                     return moment(b.createdAt).diff(moment(a.createdAt))
                   })
                   .map(
                     (user: {
                       pseudo: string
                       displayName: string
                       photoURL: string
                     }) => (
                       <CardUserAdmin
                         key={user.pseudo}
                         pseudo={user.pseudo}
                         displayName={user.displayName}
                         photoURL={user.photoURL}
                       />
                     )
                   )}
               </Masonry>
             </ResponsiveMasonry>
            )}
            {isErrorUsers && <Error />}
          </TabsContent>
        </Tabs>
      </section>
    </Layout>
  )
}
