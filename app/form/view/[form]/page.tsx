"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import { useAuthContext } from "@/context/AuthContext"
import { useDocument } from "@/firebase/firestore/getDocument"
import { useUpdateFormDocument } from "@/firebase/firestore/updateFormDocument"
import algoliasearch from "algoliasearch"
import { format } from "date-fns"
import {
  ArrowDown,
  ArrowUp,
  CalendarIcon,
  Check,
  Loader2,
  Send,
  Terminal,
  X,
} from "lucide-react"
import moment from "moment"
import { uid } from "uid"

import { cn } from "@/lib/utils"
import { computeQuestionIds, matchOption } from "@/lib/form-id"
import { isContentBlock, isMediaBlock, type Question } from "@/types/form"
import SignaturePad from "@/components/form/signature-pad"
import StarRating from "@/components/form/star-rating"
import Error from "@/components/error"
import { Button, buttonVariants } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"

const isDirectVideo = (url: string) => /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url)

const toVideoEmbedUrl = (url: string) => {
  const yt = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/
  )
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`
  return url
}

export default function FormViewPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const { userPseudo } = useAuthContext()
  const formId = params["form"] as string

  const {
    data: dataForm,
    isLoading: isLoadingForm,
    isError: isErrorForm,
    error: errorForm,
  }: {
    data: any
    isLoading: boolean
    isError: boolean
    error: any
  } = useDocument(formId, "forms")

  function generateRandomNumbers() {
    const number1 = Math.floor(Math.random() * 10)
    const number2 = Math.floor(Math.random() * 10)
    return { number1, number2 }
  }

  const [randomNumbers, setRandomNumbers] = useState(() =>
    generateRandomNumbers()
  )
  const [captcha, setCaptcha] = useState("")

  // answers keyed by question index
  const [answers, setAnswers] = useState<Record<number, any>>({})
  const [errors, setErrors] = useState<Record<number, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const setAnswer = (index: number, value: any) =>
    setAnswers((prev) => ({ ...prev, [index]: value }))

  const ALGOLIA_INDEX_NAME = "forms"
  const client = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_ADMIN_KEY
  )
  const index = client.initIndex(ALGOLIA_INDEX_NAME)

  const {
    updateFormDocument,
    isLoading: isLoadingUpdateForm,
    isSuccess: isSuccessUpdateForm,
    reset: resetUpdateForm,
  }: any = useUpdateFormDocument("forms")

  const toggleArrayValue = (index: number, value: string) => {
    setAnswers((prev) => {
      const current: string[] = Array.isArray(prev[index]) ? prev[index] : []
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      return { ...prev, [index]: next }
    })
  }

  const moveRankItem = (index: number, from: number, to: number) => {
    setAnswers((prev) => {
      const list: string[] = Array.isArray(prev[index]) ? [...prev[index]] : []
      if (to < 0 || to >= list.length) return prev
      const [item] = list.splice(from, 1)
      list.splice(to, 0, item)
      return { ...prev, [index]: list }
    })
  }

  const serialize = (q: Question, value: any): string => {
    if (value === undefined || value === null) return ""
    if (Array.isArray(value)) return value.join(", ")
    return String(value)
  }

  // Coerce raw URL values into the answer shape expected for a given question.
  // Returns undefined when the value can't be applied (e.g. no matching option).
  const parsePrefillValue = (q: Question, raw: string[]): any => {
    const options = q.options || []
    switch (q.type) {
      case "text":
      case "longtext":
      case "email":
      case "link":
      case "phone":
      case "number":
      case "time":
        return raw[0]
      case "date": {
        const d = new Date(raw[0])
        return isNaN(d.getTime()) ? undefined : d
      }
      case "rating": {
        const n = Number(raw[0])
        if (isNaN(n)) return undefined
        return Math.min(Math.max(Math.round(n), 0), q.maxRating || 5)
      }
      case "linearscale": {
        const n = Number(raw[0])
        if (isNaN(n)) return undefined
        return Math.min(Math.max(n, q.min ?? 1), q.max ?? 10)
      }
      case "uniquechoice":
      case "dropdown":
        return matchOption(options, raw[0])
      case "multiplechoice":
      case "multiselect": {
        const values = raw
          .flatMap((r) => r.split(","))
          .map((s) => s.trim())
          .filter(Boolean)
        const matched = values
          .map((v) => matchOption(options, v))
          .filter(Boolean) as string[]
        return matched.length ? matched : undefined
      }
      default:
        // ranking / signature / fileupload — not prefillable from the URL
        return undefined
    }
  }

  // Prefill answers once from the URL query params, matching each question by
  // its id (e.g. /form/view/xxx?note-globale=4&pays=cameroun).
  const prefilledRef = useRef(false)
  useEffect(() => {
    if (prefilledRef.current) return
    const questions: Question[] = dataForm?.data?.questions || []
    if (questions.length === 0) return
    if (!searchParams || searchParams.toString() === "") {
      prefilledRef.current = true
      return
    }

    const computed = computeQuestionIds(questions)
    const seeded: Record<number, any> = {}
    questions.forEach((q, i) => {
      if (isContentBlock(q.type)) return
      const id = q.id || computed[i]
      if (!id) return
      const raw = searchParams.getAll(id)
      if (raw.length === 0) return
      const value = parsePrefillValue(q, raw)
      if (value !== undefined) seeded[i] = value
    })

    if (Object.keys(seeded).length > 0) {
      // don't clobber anything the respondent already touched
      setAnswers((prev) => ({ ...seeded, ...prev }))
    }
    prefilledRef.current = true
  }, [dataForm?.data?.questions, searchParams])

  const onSubmit = async () => {
    const questions: Question[] = dataForm?.data?.questions || []

    // captcha check
    const correctAnswer = randomNumbers.number1 + randomNumbers.number2
    if (parseInt(captcha, 10) !== correctAnswer) {
      alert("The answer to the mathematical question is incorrect.")
      return
    }

    // required validation
    const newErrors: Record<number, string> = {}
    questions.forEach((q, i) => {
      if (isContentBlock(q.type) || !q.required) return
      const v = answers[i]
      const empty =
        v === undefined ||
        v === null ||
        v === "" ||
        (Array.isArray(v) && v.length === 0)
      if (empty) newErrors[i] = "This field is required"
    })
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setErrors({})

    setSubmitting(true)
    try {
      // build responses (one entry per question, aligned by index)
      const builtResponses = await Promise.all(
        questions.map(async (q, i) => {
          let text = ""
          if (q.type === "signature") {
            // store the signature image directly in Firestore as a data URL
            text = typeof answers[i] === "string" ? answers[i] : ""
          } else if (q.type === "ranking") {
            // default to the options order if respondent didn't reorder
            const order = Array.isArray(answers[i])
              ? answers[i]
              : q.options || []
            text = order.join(", ")
          } else if (q.type === "date") {
            text =
              answers[i] instanceof Date ? format(answers[i], "yyyy-MM-dd") : ""
          } else if (!isContentBlock(q.type)) {
            text = serialize(q, answers[i])
          }
          return { type: q.type, label: q.label || "", text }
        })
      )

      const updatedFormData = {
        responses: [
          ...dataForm?.data?.responses,
          {
            idResponse: moment().valueOf() + uid(),
            createdAt: moment().valueOf(),
            responses: builtResponses,
          },
        ],
      }

      await updateFormDocument({ id: formId, updatedFormData })
      await index.partialUpdateObject({
        objectID: formId,
        responses: updatedFormData.responses,
      })

      setAnswers({})
      setCaptcha("")
      setRandomNumbers(generateRandomNumbers())
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    if (dataForm?.data?.redirectOnCompletion && isSuccessUpdateForm) {
      window.location.href = dataForm.data.redirectOnCompletion
    }
  }, [dataForm?.data?.redirectOnCompletion, isSuccessUpdateForm])

  // initialise ranking answers to the option order so the list shows up
  useEffect(() => {
    const questions: Question[] = dataForm?.data?.questions || []
    setAnswers((prev) => {
      const next = { ...prev }
      questions.forEach((q, i) => {
        if (q.type === "ranking" && !next[i] && q.options) {
          next[i] = [...q.options]
        }
      })
      return next
    })
  }, [dataForm?.data?.questions])

  const renderField = (q: Question, index: number) => {
    switch (q.type) {
      case "text":
      case "email":
      case "link":
        return (
          <Input
            type={
              q.type === "email" ? "email" : q.type === "link" ? "url" : "text"
            }
            value={answers[index] || ""}
            onChange={(e) => setAnswer(index, e.target.value)}
            placeholder={q.text}
          />
        )
      case "number":
        return (
          <Input
            type="number"
            value={answers[index] ?? ""}
            onChange={(e) => setAnswer(index, e.target.value)}
            placeholder={q.text}
          />
        )
      case "phone":
        return (
          <Input
            type="tel"
            value={answers[index] || ""}
            onChange={(e) => setAnswer(index, e.target.value)}
            placeholder={q.text}
          />
        )
      case "time":
        return (
          <Input
            type="time"
            value={answers[index] || ""}
            onChange={(e) => setAnswer(index, e.target.value)}
            className="w-fit"
          />
        )
      case "longtext":
        return (
          <Textarea
            value={answers[index] || ""}
            onChange={(e) => setAnswer(index, e.target.value)}
            placeholder={q.text}
          />
        )
      case "date": {
        const selected: Date | undefined =
          answers[index] instanceof Date ? answers[index] : undefined
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[260px] justify-start text-left font-normal",
                  !selected && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selected ? format(selected, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selected}
                onSelect={(d) => setAnswer(index, d)}
                autoFocus
              />
            </PopoverContent>
          </Popover>
        )
      }
      case "uniquechoice":
        return (
          <RadioGroup
            value={answers[index] || ""}
            onValueChange={(v) => setAnswer(index, v)}
            className="w-full gap-2"
          >
            {(q.options || []).map((opt, i) => (
              <label
                key={i}
                className="flex w-full cursor-pointer items-center gap-3 rounded-md border p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                <RadioGroupItem value={opt} id={`q${index}-o${i}`} />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </RadioGroup>
        )
      case "multiplechoice":
      case "multiselect": {
        const selected: string[] = Array.isArray(answers[index])
          ? answers[index]
          : []
        return (
          <div className="flex w-full flex-col gap-2">
            {(q.options || []).map((opt, i) => (
              <label
                key={i}
                className="flex w-full cursor-pointer items-center gap-3 rounded-md border p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                <Checkbox
                  checked={selected.includes(opt)}
                  onCheckedChange={() => toggleArrayValue(index, opt)}
                />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </div>
        )
      }
      case "dropdown":
        return (
          <Select
            value={answers[index] || ""}
            onValueChange={(v) => setAnswer(index, v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {(q.options || []).map((opt, i) => (
                <SelectItem key={i} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "ranking": {
        const list: string[] = Array.isArray(answers[index])
          ? answers[index]
          : q.options || []
        return (
          <div className="flex w-full flex-col gap-2">
            {list.map((opt, i) => (
              <div
                key={opt + i}
                className="flex w-full items-center gap-3 rounded-md border p-3"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold dark:bg-zinc-800">
                  {i + 1}
                </span>
                <span className="flex-1 text-sm">{opt}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={i === 0}
                  onClick={() => moveRankItem(index, i, i - 1)}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={i === list.length - 1}
                  onClick={() => moveRankItem(index, i, i + 1)}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )
      }
      case "rating":
        return (
          <StarRating
            value={Number(answers[index]) || 0}
            max={q.maxRating || 5}
            onChange={(v) => setAnswer(index, v)}
          />
        )
      case "linearscale": {
        const min = q.min ?? 1
        const max = q.max ?? 10
        const step = q.step || 1
        const current =
          answers[index] !== undefined ? Number(answers[index]) : min
        return (
          <div className="flex w-full flex-col gap-3">
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>{min}</span>
              <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {current}
              </span>
              <span>{max}</span>
            </div>
            <Slider
              min={min}
              max={max}
              step={step}
              value={[current]}
              onValueChange={(v) => setAnswer(index, v[0])}
            />
          </div>
        )
      }
      case "signature":
        return (
          <SignaturePad onChange={(dataUrl) => setAnswer(index, dataUrl)} />
        )
      case "fileupload":
        return (
          <div className="w-full rounded-md border border-dashed border-zinc-300 p-3 text-sm text-zinc-500 dark:border-zinc-700">
            File upload is not available at the moment.
          </div>
        )
      default:
        return null
    }
  }

  const questions: Question[] = dataForm?.data?.questions || []

  return (
    <>
      <section className="fixed inset-0 z-50 h-screen overflow-scroll bg-white dark:bg-zinc-900">
        <div className="container-wrapper grid items-center gap-6 pt-6 pb-8 md:py-10">
          <div className="flex w-full items-center justify-start">
            <Link href="/forms" className="flex items-center font-bold">
              <Terminal className="mr-2 h-6 w-6" />
              Sharuco Form
            </Link>
          </div>
          <Separator />
          {isLoadingForm && (
            <div className="flex w-full items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin" />
            </div>
          )}
          {dataForm &&
            dataForm.exists &&
            (dataForm.data.published ||
              dataForm.data.idAuthor === userPseudo) && (
              <div className="w-full py-8">
                <div
                  className="absolute inset-x-0 top-0 h-3 w-full"
                  style={{ background: `${dataForm.data.color}` }}
                ></div>
                <div className="flex w-full flex-col items-center justify-center gap-2">
                  <h1 className="text-2xl leading-tight font-extrabold tracking-tighter sm:text-2xl md:text-4xl lg:text-4xl">
                    {dataForm.data.name}
                  </h1>
                  <p className="text-center text-sm leading-5 font-medium text-gray-500 sm:text-base md:text-lg lg:text-lg dark:text-gray-400">
                    {dataForm.data.description}
                  </p>
                </div>
                <Separator className="mx-auto my-8 sm:w-2/3" />
                <div className="mx-auto w-full space-y-6 lg:w-2/3">
                  {questions.map((question: Question, qIndex: number) => {
                    if (question.type === "divider") {
                      return <Separator key={qIndex} className="my-2 w-full" />
                    }
                    if (question.type === "heading") {
                      return (
                        <h3 key={qIndex} className="pt-2 text-xl font-bold">
                          {question.label}
                        </h3>
                      )
                    }
                    if (question.type === "paragraph") {
                      return (
                        <p
                          key={qIndex}
                          className="text-sm leading-6 text-zinc-600 dark:text-zinc-300"
                        >
                          {question.label}
                        </p>
                      )
                    }
                    if (isMediaBlock(question.type)) {
                      const url = question.text || ""
                      if (!url) return null
                      return (
                        <div
                          key={qIndex}
                          className="flex w-full flex-col items-start gap-2"
                        >
                          {question.type === "image" && (
                            <img
                              src={url}
                              alt={question.label || "image"}
                              className="max-h-96 w-full rounded-md object-contain"
                            />
                          )}
                          {question.type === "video" &&
                            (isDirectVideo(url) ? (
                              <video
                                src={url}
                                controls
                                className="w-full rounded-md"
                              />
                            ) : (
                              <iframe
                                src={toVideoEmbedUrl(url)}
                                className="aspect-video w-full rounded-md"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title={question.label || "video"}
                              />
                            ))}
                          {question.type === "audio" && (
                            <audio src={url} controls className="w-full" />
                          )}
                          {question.type === "embed" && (
                            <iframe
                              src={url}
                              className="aspect-video w-full rounded-md border"
                              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                              title={question.label || "embed"}
                            />
                          )}
                          {question.label && (
                            <p className="text-xs text-zinc-500">
                              {question.label}
                            </p>
                          )}
                        </div>
                      )
                    }
                    return (
                      <div
                        className="flex w-full flex-col items-start gap-2"
                        key={qIndex}
                      >
                        <Label className="flex items-center gap-1">
                          {question.label}
                          {question.required && (
                            <span className="text-red-500">*</span>
                          )}
                        </Label>
                        {question.description && (
                          <p className="text-xs text-zinc-500">
                            {question.description}
                          </p>
                        )}
                        {renderField(question, qIndex)}
                        {errors[qIndex] && (
                          <p className="text-xs font-medium text-red-500">
                            {errors[qIndex]}
                          </p>
                        )}
                      </div>
                    )
                  })}
                  <div className="mx-auto my-8 flex w-full flex-col items-center gap-2 sm:w-2/3">
                    <div className="relative flex w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-lg bg-blue-600 p-8">
                      <h3 className="text-md z-10 text-center font-bold text-white uppercase">
                        Prove you’re not a robot by solving this equation{" "}
                      </h3>
                      <span className="z-10 mb-2 block text-center text-4xl font-black text-white">
                        {randomNumbers.number1} + {randomNumbers.number2} = ?
                      </span>
                      <img
                        src="/assets/stacked-waves-haikei.svg"
                        alt="stacked-waves-haikei"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <Input
                        type="number"
                        id="answer"
                        name="answer"
                        value={captcha}
                        onChange={(e) => setCaptcha(e.target.value)}
                        className="z-10 bg-white text-zinc-900"
                        placeholder={`${randomNumbers.number1} + ${randomNumbers.number2}`}
                      />
                    </div>
                  </div>
                  {isSuccessUpdateForm && (
                    <div
                      className="mx-auto mb-8 flex items-center rounded-lg bg-green-50 p-4 text-green-800 dark:bg-gray-800 dark:text-green-400"
                      role="alert"
                    >
                      <Check className="h-4 w-4" />
                      <span className="sr-only">Info</span>
                      <div className="ml-3 text-sm font-medium">
                        Your form has been sent successfully, Thank you !
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
                  <Button
                    variant="default"
                    disabled={isLoadingUpdateForm || submitting}
                    onClick={
                      isLoadingUpdateForm || submitting ? undefined : onSubmit
                    }
                  >
                    {isLoadingUpdateForm || submitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    Send
                  </Button>
                </div>
              </div>
            )}
          {((dataForm && !dataForm.exists) ||
            (dataForm &&
              dataForm.exists &&
              !dataForm.data.published &&
              dataForm.data.idAuthor !== userPseudo)) && (
            <div className="flex flex-col items-center gap-4">
              <h1 className="text-2xl font-bold">This form does not exist.</h1>
              <Link
                href="/forms"
                className={buttonVariants({ size: "lg", variant: "outline" })}
              >
                Create your own form
              </Link>
            </div>
          )}
          {isErrorForm && (
            <>
              {errorForm.message == "Missing or insufficient permissions." ? (
                <div className="flex flex-col items-center gap-4">
                  <h1 className="text-2xl font-bold">
                    This form does not exist.
                  </h1>
                  <Link
                    href="/forms"
                    className={buttonVariants({
                      size: "lg",
                      variant: "outline",
                    })}
                  >
                    Create your own form
                  </Link>
                </div>
              ) : (
                <Error />
              )}
            </>
          )}
          <Separator />
          <div className="flex w-full flex-col items-center justify-center gap-4">
            <div
              className="flex items-center rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800 dark:bg-gray-800 dark:text-yellow-300"
              role="alert"
            >
              <svg
                className="mr-3 inline h-4 w-4 shrink-0"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              <span className="sr-only">Info</span>
              <div>
                <span className="font-medium">
                  NEVER send sensitive information to Shruco Form such as your
                  password or credit card !
                </span>
              </div>
            </div>
            <Link href="/">
              Powered by{" "}
              <span className="font-bold hover:underline hover:underline-offset-4">
                Sharuco
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
