"use client"

import {
  ArrowDown,
  ArrowUp,
  FileQuestion,
  Plus,
  Trash,
  X,
} from "lucide-react"

import {
  hasOptions,
  isContentBlock,
  QUESTION_TYPE_LABELS,
  type Question,
  type QuestionType,
} from "@/types/form"
import EmptyCard from "@/components/empty-card"
import {
  defaultsForType,
  FIELD_GROUPS,
  PLACEHOLDER_TYPES,
} from "@/components/form/field-config"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

/**
 * Controlled, Firestore-agnostic form builder UI. Used both by the
 * authenticated builder (saving to Firestore) and the local draft builder.
 */
export default function QuestionsEditor({
  questions,
  onChange,
  color = "#000000",
  errors = {},
  editable = true,
}: {
  questions: Question[]
  onChange: (questions: Question[]) => void
  color?: string
  errors?: Record<number, string>
  editable?: boolean
}) {
  const addField = (type: QuestionType) => {
    onChange([...questions, defaultsForType(type)])
    setTimeout(() => {
      document
        .getElementById("questions-editor")
        ?.scrollIntoView({ behavior: "smooth", block: "end" })
    }, 50)
  }

  const updateField = (index: number, patch: Partial<Question>) => {
    onChange(questions.map((q, i) => (i === index ? { ...q, ...patch } : q)))
  }

  const removeField = (index: number) => {
    onChange(questions.filter((_, i) => i !== index))
  }

  const moveField = (index: number, dir: -1 | 1) => {
    const target = index + dir
    if (target < 0 || target >= questions.length) return
    const next = [...questions]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  const addOption = (index: number) => {
    const current = questions[index].options || []
    updateField(index, {
      options: [...current, `Option ${current.length + 1}`],
    })
  }

  const updateOption = (index: number, optIndex: number, value: string) => {
    const current = [...(questions[index].options || [])]
    current[optIndex] = value
    updateField(index, { options: current })
  }

  const removeOption = (index: number, optIndex: number) => {
    const current = questions[index].options || []
    updateField(index, {
      options: current.filter((_, i) => i !== optIndex),
    })
  }

  return (
    <div className="flex w-full flex-col items-start gap-4 sm:flex-row">
      {editable && (
        <>
          <div className="flex w-full shrink-0 flex-col items-start gap-2 rounded-md sm:sticky sm:top-20 sm:max-h-[calc(100vh-6rem)] sm:w-[250px] sm:overflow-y-auto sm:pr-1">
            {FIELD_GROUPS.map((group) => (
              <div key={group.group} className="w-full">
                <p className="mb-1 px-2 text-xs font-semibold tracking-wide text-zinc-400 uppercase">
                  {group.group}
                </p>
                {group.fields.map((field) => (
                  <button
                    key={field.type}
                    type="button"
                    onClick={() => addField(field.type)}
                    className="flex w-full items-center justify-start gap-2 rounded-md px-3 py-1.5 hover:bg-zinc-100 hover:dark:bg-zinc-800"
                  >
                    {field.icon}
                    <span className="ml-1 text-sm font-medium">
                      {field.label}
                    </span>
                  </button>
                ))}
              </div>
            ))}
            <Separator className="my-2 hidden w-full sm:block" />
          </div>
          <Separator className="my-2 block w-full sm:hidden" />
        </>
      )}
      <div
        id="questions-editor"
        className="relative flex w-full flex-col items-start gap-4 overflow-hidden rounded-md border px-4 pt-7 pb-4"
      >
        <div
          className="absolute inset-x-0 top-0 h-3 w-full"
          style={{ background: color }}
        ></div>
        <div className="w-full space-y-4">
          {questions.map((q, index) => {
            const type = q.type
            const options: string[] = q.options || []
            return (
              <div
                className="relative flex w-full flex-col items-start gap-3 rounded-md border border-dashed border-zinc-200 p-4 first:mt-2 dark:border-zinc-700"
                key={index}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                    {QUESTION_TYPE_LABELS[type] ?? type}
                  </span>
                  {editable && (
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        disabled={index === 0}
                        onClick={() => moveField(index, -1)}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        disabled={index === questions.length - 1}
                        onClick={() => moveField(index, 1)}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeField(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {type === "divider" ? (
                  <Separator className="my-1 w-full" />
                ) : (
                  <div className="flex w-full flex-col items-start gap-1">
                    <Input
                      value={q.label}
                      onChange={(e) =>
                        updateField(index, { label: e.target.value })
                      }
                      disabled={!editable}
                      className={
                        type === "heading"
                          ? "text-md h-9 font-semibold"
                          : "h-9"
                      }
                      placeholder={
                        type === "paragraph"
                          ? "Your text content"
                          : type === "heading"
                            ? "Section heading"
                            : "Your question"
                      }
                    />
                    {errors[index] && (
                      <p className="mt-1 text-xs font-medium text-red-500">
                        {errors[index]}
                      </p>
                    )}
                  </div>
                )}

                {!isContentBlock(type) && (
                  <Input
                    value={q.description || ""}
                    onChange={(e) =>
                      updateField(index, { description: e.target.value })
                    }
                    disabled={!editable}
                    className="h-8 text-sm"
                    placeholder="Description / help text (optional)"
                  />
                )}

                {PLACEHOLDER_TYPES.includes(type) && (
                  <Input
                    value={q.text || ""}
                    onChange={(e) =>
                      updateField(index, { text: e.target.value })
                    }
                    disabled={!editable}
                    className="h-8 text-sm"
                    placeholder="Placeholder (optional)"
                  />
                )}

                {hasOptions(type) && (
                  <div className="flex w-full flex-col items-start gap-2">
                    <Label className="text-xs text-zinc-500">Options</Label>
                    {options.map((opt, optIndex) => (
                      <div
                        key={optIndex}
                        className="flex w-full items-center gap-2"
                      >
                        <Input
                          value={opt}
                          onChange={(e) =>
                            updateOption(index, optIndex, e.target.value)
                          }
                          disabled={!editable}
                          className="h-8 text-sm"
                          placeholder={`Option ${optIndex + 1}`}
                        />
                        {editable && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            disabled={options.length <= 1}
                            onClick={() => removeOption(index, optIndex)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {editable && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addOption(index)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add option
                      </Button>
                    )}
                  </div>
                )}

                {type === "rating" && (
                  <div className="flex w-full items-center gap-2">
                    <Label className="text-xs text-zinc-500">
                      Number of stars
                    </Label>
                    <Input
                      type="number"
                      min={2}
                      max={10}
                      value={q.maxRating ?? 5}
                      onChange={(e) =>
                        updateField(index, {
                          maxRating: Number(e.target.value),
                        })
                      }
                      disabled={!editable}
                      className="h-8 w-24 text-sm"
                    />
                  </div>
                )}

                {type === "linearscale" && (
                  <div className="flex w-full flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-zinc-500">Min</Label>
                      <Input
                        type="number"
                        value={q.min ?? 1}
                        onChange={(e) =>
                          updateField(index, { min: Number(e.target.value) })
                        }
                        disabled={!editable}
                        className="h-8 w-20 text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-zinc-500">Max</Label>
                      <Input
                        type="number"
                        value={q.max ?? 10}
                        onChange={(e) =>
                          updateField(index, { max: Number(e.target.value) })
                        }
                        disabled={!editable}
                        className="h-8 w-20 text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-zinc-500">Step</Label>
                      <Input
                        type="number"
                        min={1}
                        value={q.step ?? 1}
                        onChange={(e) =>
                          updateField(index, { step: Number(e.target.value) })
                        }
                        disabled={!editable}
                        className="h-8 w-20 text-sm"
                      />
                    </div>
                  </div>
                )}

                {!isContentBlock(type) && (
                  <div className="flex w-full items-center justify-end gap-2 border-t border-dashed border-zinc-200 pt-3 dark:border-zinc-700">
                    <Label className="text-xs text-zinc-500">Required</Label>
                    <Switch
                      checked={!!q.required}
                      disabled={!editable}
                      onCheckedChange={(v) =>
                        updateField(index, { required: v })
                      }
                    />
                  </div>
                )}
              </div>
            )
          })}
          {questions.length < 1 && (
            <EmptyCard
              icon={<FileQuestion className="h-8 w-8" />}
              title="No questions yet"
              description={
                editable
                  ? "Click on the field types on the left to add questions to your form"
                  : "This form has no questions yet"
              }
            />
          )}
        </div>
      </div>
    </div>
  )
}
