"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useAuthContext } from "@/context/AuthContext"
import { useUpdateFormDocument } from "@/firebase/firestore/updateFormDocument"
import algoliasearch from "algoliasearch"
import { Check, Loader2, Save, X } from "lucide-react"

import { isContentBlock, type Question } from "@/types/form"
import QuestionsEditor from "@/components/form/questions-editor"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function QuestionsForms({ dataForm }: { dataForm: any }) {
  const params = useParams()
  const { userPseudo } = useAuthContext()

  const {
    updateFormDocument,
    isLoading: isLoadingUpdateForm,
    isSuccess: isSuccessUpdateForm,
    reset: resetUpdateForm,
  }: any = useUpdateFormDocument("forms")

  const isOwner = dataForm.idAuthor === userPseudo

  const [questions, setQuestions] = useState<Question[]>(
    dataForm.questions || []
  )
  const [errors, setErrors] = useState<Record<number, string>>({})

  useEffect(() => {
    setQuestions(dataForm.questions || [])
  }, [dataForm])

  const ALGOLIA_INDEX_NAME = "forms"
  const client = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_ADMIN_KEY
  )
  const index = client.initIndex(ALGOLIA_INDEX_NAME)

  const validate = (qs: Question[]) => {
    const newErrors: Record<number, string> = {}
    qs.forEach((q, i) => {
      if (!isContentBlock(q.type) && (!q.label || q.label.trim() === "")) {
        newErrors[i] = "The label is required"
      }
      if (q.type === "heading" || q.type === "paragraph") {
        if (!q.label || q.label.trim() === "")
          newErrors[i] = "This field is required"
      }
    })
    return newErrors
  }

  const onSubmit = async () => {
    const newErrors = validate(questions)
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setErrors({})

    const cleanedQuestions = questions.map((q) => ({
      ...q,
      ...(q.options
        ? { options: q.options.filter((o) => o && o.trim() !== "") }
        : {}),
    }))
    // strip any `undefined` values — Firestore rejects them
    const cleaned = JSON.parse(JSON.stringify(cleanedQuestions))

    const id = params["form"]
    await updateFormDocument({ id, updatedFormData: { questions: cleaned } })
    await index.partialUpdateObject({ objectID: id, questions: cleaned })
  }

  return (
    <div className="flex w-full flex-col items-start gap-4">
      <QuestionsEditor
        questions={questions}
        onChange={setQuestions}
        color={dataForm.color}
        errors={errors}
        editable={isOwner}
      />

      {isSuccessUpdateForm && (
        <div
          className="flex w-full items-center rounded-lg bg-green-50 p-4 text-green-800 dark:bg-gray-800 dark:text-green-400"
          role="alert"
        >
          <Check className="h-4 w-4" />
          <span className="sr-only">Info</span>
          <div className="ml-3 text-sm font-medium">
            Your questions have been updated
          </div>
          <button
            type="button"
            className="-m-1.5 ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 p-1.5 text-green-500 hover:bg-green-200 focus:ring-2 focus:ring-green-400 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700"
            onClick={resetUpdateForm}
          >
            <span className="sr-only">Close</span>
            <X />
          </button>
        </div>
      )}

      {isOwner && (
        <>
          <Separator className="w-full" />
          <Button
            variant="outline"
            disabled={isLoadingUpdateForm}
            onClick={isLoadingUpdateForm ? undefined : onSubmit}
          >
            {isLoadingUpdateForm ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save questions
          </Button>
        </>
      )}
    </div>
  )
}
