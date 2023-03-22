"use client"

import React, { useEffect, useState } from "react"
import Head from "next/head"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/context/AuthContext"
import { useGitHubLogout } from "@/firebase/auth/githubLogout"
import { useCollections } from "@/firebase/firestore/getCollections"
import { Eye, EyeOff, Loader2, MoreHorizontal, Plus } from "lucide-react"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

import { cn } from "@/lib/utils"
import { Layout } from "@/components/layout"
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

export default function Dashboard() {
  const { logout } = useGitHubLogout()

  const { user } = useAuthContext()
  const router = useRouter()
  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  })

  return (
    <Layout>
      <Head>
        <title>Sharuco | Dashboard</title>
        <meta
          name="description"
          content="Sharuco allows you to share code snippets that you have found
         useful."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
        <h1 className="text-2xl font-extrabold leading-tight tracking-tighter sm:text-2xl md:text-4xl lg:text-4xl">
          Dashboard
        </h1>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="w-fit">
              <Plus className="mr-2 h-4 w-4" />
              Add new snippet
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
                  Add new snippet
                </h3>
              </AlertDialogTitle>
              <AlertDialogDescription>
                <div className="flex flex-col items-start w-full gap-1.5 mb-4">
                  <Label htmlFor="code">Insert your code</Label>
                  <Textarea placeholder="Insert your code here..." id="code" />
                </div>
                <div className="flex flex-col items-start w-full gap-1.5 mb-4">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    placeholder="What does this code do ?"
                    id="description"
                  />
                </div>
                <div className="flex flex-col items-start w-full gap-1.5 mb-4">
                  <Label htmlFor="language">Language</Label>
                  <Select>
                    <SelectTrigger className="w-full" id="language">
                      <SelectValue placeholder="What language is the code written in ?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bash">Bash</SelectItem>
                      <SelectItem value="c">C</SelectItem>
                      <SelectItem value="csharp">C#</SelectItem>
                      <SelectItem value="cpp">C++</SelectItem>
                      <SelectItem value="css">CSS</SelectItem>
                      <SelectItem value="docker">Docker</SelectItem>
                      <SelectItem value="go">Go</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="javascript">Javascript</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="jsx">JSX</SelectItem>
                      <SelectItem value="kotlin">Kotlin</SelectItem>
                      <SelectItem value="less">Less</SelectItem>
                      <SelectItem value="markdown">Markdown</SelectItem>
                      <SelectItem value="php">PHP</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="scss">Scss</SelectItem>
                      <SelectItem value="sql">SQL</SelectItem>
                      <SelectItem value="typescript">Typescript</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col items-start w-full gap-1.5 mb-4">
                  <Label htmlFor="tags">Tags</Label>
                  <Input type="text" id="tags" placeholder="" />
                  <p className="text-sm text-slate-500">
                    Please separate tags with{" "}
                    <span className="text-slate-700 dark:text-slate-300">
                      ,
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Switch id="isPrivate" />
                  <Label htmlFor="isPrivate">Will this code be private ?</Label>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <button
                className={cn(
                  "inline-flex h-10 items-center justify-center rounded-md bg-slate-900 py-2 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
                )}
                // disabled={isPending}
                // onClick={login}
              >
                {/* {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Github className="mr-2 h-4 w-4" />
                )} */}
                Submit
              </button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Tabs defaultValue="public-code" className="w-full">
          <TabsList>
            <div>
              <TabsTrigger value="public-code">
                <Eye className="mr-2 h-4 w-4" />
                public code
              </TabsTrigger>
              <TabsTrigger value="private-code">
                <EyeOff className="mr-2 h-4 w-4" />
                Private code
              </TabsTrigger>
            </div>
          </TabsList>
          <TabsContent
            className="border-none"
            value="public-code"
          ></TabsContent>
          <TabsContent
            className="border-none"
            value="private-code"
          ></TabsContent>
        </Tabs>
      </section>
    </Layout>
  )
}
