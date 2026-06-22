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
import { attachQuestionIds } from "@/lib/form-id"
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
      if ((q.type === "heading" || q.type === "paragraph") && !q.label?.trim())
        qErrors[i] = "This field is required"
    })
    if (Object.keys(qErrors).length > 0) next.questions = qErrors
    setErrors(next)
    return !next.name && !next.description && Object.keys(qErrors).length === 0
  }

  const persist = (pseudo: string) => {
    const cleanQuestions = attachQuestionIds(
      questions.map((q) => ({
        ...q,
        ...(q.options
          ? { options: q.options.filter((o) => o && o.trim() !== "") }
          : {}),
      }))
    )
    const newDocument = {
      name,
      description,
      createdAt: moment().valueOf(),
      idAuthor: pseudo,
      color,
      published: false,
      // strip any `undefined` values — Firestore rejects them
      questions: JSON.parse(JSON.stringify(cleanQuestions)),
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
    <section className="container-wrapper grid items-start gap-5 pt-6 pb-8 md:py-8">
      {/* Compact header: brand + title on one row, draft badge on the right */}
      <div className="flex w-full flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/forms"
            className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
            title="Back to forms"
          >
            <Terminal className="h-5 w-5" />
          </Link>
          <h1 className="text-xl leading-none font-extrabold tracking-tighter md:text-2xl">
            Create a new form
          </h1>
        </div>
        <span
          className={
            user
              ? "rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
              : "rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
          }
        >
          {user
            ? "Sign in detected — ready to save"
            : "Draft — sign in only to save, nothing is lost"}
        </span>
      </div>

      <Separator />

      {/* General settings — laid out in a grid to use the full width */}
      <div className="grid w-full grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-3">
        <div className="flex flex-col items-start gap-1.5 sm:col-span-2">
          <Label>Name</Label>
          <Input
            placeholder="Name of the form"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>
        <div className="flex flex-col items-start gap-1.5 sm:col-span-1">
          <Label>Color</Label>
          <div className="flex w-full items-center gap-2">
            <Input
              className="w-full"
              placeholder="#000000"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
            <div
              className="block h-9 w-9 shrink-0 rounded-full border"
              style={{ background: color }}
            ></div>
          </div>
        </div>
        <div className="flex flex-col items-start gap-1.5 sm:col-span-3">
          <Label>Description</Label>
          <Textarea
            placeholder="Description of the form"
            className="h-20"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description}</p>
          )}
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
      <div className="sticky inset-x-0 bottom-0 z-10 flex w-full items-center justify-between gap-2 border-t bg-background py-4">
        <Button disabled={busy} onClick={busy ? undefined : handleSave}>
          {busy ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {user ? "Save form" : "Save form (sign in)"}
        </Button>
        <Link href="/forms" className={buttonVariants({ variant: "outline" })}>
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
