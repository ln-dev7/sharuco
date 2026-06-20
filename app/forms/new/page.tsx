"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { colors, getRandomColor } from "@/constants/colors"
import { useAuthContext } from "@/context/AuthContext"
import { useCreateDocument } from "@/firebase/firestore/createDocument"
import { useGitHubLogin } from "@/firebase/auth/githubLogin"
import { Github, Loader2, Save, Terminal } from "lucide-react"
import moment from "moment"

import { isContentBlock, type Question } from "@/types/form"
import QuestionsEditor from "@/components/form/questions-editor"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

const DRAFT_KEY = "sharuco-form-draft"
const PENDING_SAVE_KEY = "sharuco-form-pending-save"

interface Draft {
  name: string
  description: string
  color: string
  questions: Question[]
}

export default function NewFormDraftPage() {
  const { user, userPseudo } = useAuthContext()
  const { createDocument, isLoading: isCreating }: any =
    useCreateDocument("forms")
  const { login, isPending: isLoggingIn } = useGitHubLogin()

  const [loaded, setLoaded] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [color, setColor] = useState(colors[0])
  const [questions, setQuestions] = useState<Question[]>([])
  const [errors, setErrors] = useState<{
    name?: string
    description?: string
    questions?: Record<number, string>
  }>({})
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [pendingSave, setPendingSave] = useState(false)

  // Restore draft from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (raw) {
        const draft: Draft = JSON.parse(raw)
        setName(draft.name || "")
        setDescription(draft.description || "")
        setColor(draft.color || getRandomColor(colors))
        setQuestions(draft.questions || [])
      } else {
        setColor(getRandomColor(colors))
      }
      if (localStorage.getItem(PENDING_SAVE_KEY) === "true") {
        setPendingSave(true)
      }
    } catch {
      setColor(getRandomColor(colors))
    }
    setLoaded(true)
  }, [])

  // Persist draft on every change
  useEffect(() => {
    if (!loaded) return
    const draft: Draft = { name, description, color, questions }
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
  }, [loaded, name, description, color, questions])

  const validate = () => {
    const next: typeof errors = {}
    if (!name.trim()) next.name = "Name is required"
    if (!description.trim()) next.description = "Description is required"
    const qErrors: Record<number, string> = {}
    questions.forEach((q, i) => {
      if (!isContentBlock(q.type) && !q.label?.trim())
        qErrors[i] = "The label is required"
      if (
        (q.type === "heading" || q.type === "paragraph") &&
        !q.label?.trim()
      )
        qErrors[i] = "This field is required"
    })
    if (Object.keys(qErrors).length > 0) next.questions = qErrors
    setErrors(next)
    return (
      !next.name &&
      !next.description &&
      Object.keys(qErrors).length === 0
    )
  }

  const persist = (pseudo: string) => {
    const newDocument = {
      name,
      description,
      createdAt: moment().valueOf(),
      idAuthor: pseudo,
      color,
      published: false,
      questions: questions.map((q) => ({
        ...q,
        options: q.options
          ? q.options.filter((o) => o && o.trim() !== "")
          : q.options,
      })),
      responses: [],
      collaborators: [],
    }
    createDocument(newDocument, {
      onSuccess: () => {
        localStorage.removeItem(DRAFT_KEY)
        localStorage.removeItem(PENDING_SAVE_KEY)
        // createDocument redirects to /form/{id} automatically
      },
    })
  }

  const handleSave = () => {
    if (!validate()) return
    if (userPseudo) {
      persist(userPseudo)
    } else {
      // remember that the user asked to save, then prompt login
      localStorage.setItem(PENDING_SAVE_KEY, "true")
      setPendingSave(true)
      setShowLoginDialog(true)
    }
  }

  const handleLogin = async () => {
    await login()
    // saving continues in the effect below once userPseudo is set
  }

  // Once authenticated with a pending save, create the form without data loss
  useEffect(() => {
    if (loaded && pendingSave && userPseudo) {
      setShowLoginDialog(false)
      setPendingSave(false)
      persist(userPseudo)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, pendingSave, userPseudo])

  const busy = isCreating || isLoggingIn

  return (
    <section className="container-wrapper grid items-center gap-6 pt-6 pb-8 md:py-10">
      <div className="flex w-full items-center justify-between">
        <Link href="/forms" className="flex items-center font-bold">
          <Terminal className="mr-2 h-6 w-6" />
          Sharuco Form
        </Link>
        {!user && (
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Draft — not saved yet
          </span>
        )}
      </div>

      <div className="flex flex-col items-start gap-2">
        <h1 className="text-2xl leading-tight font-extrabold tracking-tighter sm:text-2xl md:text-4xl lg:text-4xl">
          Create a new form
        </h1>
        <p className="text-sm leading-5 font-medium text-gray-500 sm:text-base md:text-lg dark:text-gray-400">
          Build your form freely. You only need to sign in when you want to save
          it — nothing you create here will be lost.
        </p>
      </div>

      <Separator />

      {/* General settings */}
      <div className="flex w-full max-w-3xl flex-col items-start gap-4">
        <div className="flex w-full flex-col items-start gap-2">
          <Label>Name</Label>
          <Input
            placeholder="Name of the form"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name}</p>
          )}
        </div>
        <div className="flex w-full flex-col items-start gap-2">
          <Label>Description</Label>
          <Textarea
            placeholder="Description of the form"
            className="h-24"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description}</p>
          )}
        </div>
        <div className="flex w-full flex-col items-start gap-2">
          <Label>Color of the form</Label>
          <div className="flex w-full items-center gap-2">
            <Input
              className="w-full"
              placeholder="#000000"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
            <div
              className="block h-9 w-9 shrink-0 rounded-full"
              style={{ background: color }}
            ></div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Questions builder */}
      <QuestionsEditor
        questions={questions}
        onChange={setQuestions}
        color={color}
        errors={errors.questions || {}}
        editable
      />

      {/* Save bar */}
      <div className="sticky inset-x-0 bottom-0 z-10 flex w-full items-center justify-between gap-2 border-t bg-white py-4 dark:bg-zinc-900">
        <Button disabled={busy} onClick={busy ? undefined : handleSave}>
          {busy ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {user ? "Save form" : "Save form (sign in)"}
        </Button>
        <Link
          href="/forms"
          className={buttonVariants({ variant: "outline" })}
        >
          Cancel
        </Link>
      </div>

      {/* Login dialog */}
      <AlertDialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign in to save your form</AlertDialogTitle>
            <AlertDialogDescription>
              Your form is ready. Sign in with GitHub to save it — everything
              you’ve built so far will be kept and saved automatically right
              after sign in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLoginDialog(false)}
              disabled={isLoggingIn}
            >
              Keep editing
            </Button>
            <Button onClick={handleLogin} disabled={isLoggingIn}>
              {isLoggingIn ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Github className="mr-2 h-4 w-4" />
              )}
              Sign in with GitHub
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}
