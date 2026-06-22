import { isContentBlock, type Question } from "@/types/form"

/**
 * Turn any text into a URL-friendly slug.
 * "Note globale" -> "note-globale", "Caméroun" -> "cameroun"
 */
export function slugify(text: string): string {
  return (text || "")
    .toString()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "") // strip accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * Compute a stable, unique id for each question, derived from its label.
 * Returned array is index-aligned with `questions`.
 * Content blocks (heading / paragraph / divider / media) collect no answer,
 * so they get an empty id.
 */
export function computeQuestionIds(questions: Question[]): string[] {
  const seen: Record<string, number> = {}
  return questions.map((q, i) => {
    if (isContentBlock(q.type)) return ""
    let base = slugify(q.label)
    if (!base) base = `${q.type}-${i + 1}` // fallback while the label is empty
    const count = seen[base] || 0
    seen[base] = count + 1
    return count === 0 ? base : `${base}-${count + 1}`
  })
}

/**
 * Return a copy of the questions with a derived `id` attached to each
 * answerable field. Used right before persisting the form.
 */
export function attachQuestionIds(questions: Question[]): Question[] {
  const ids = computeQuestionIds(questions)
  return questions.map((q, i) => (ids[i] ? { ...q, id: ids[i] } : q))
}

/**
 * The id of a single option = slug of its text. This is the value to pass
 * in the URL for choice fields (e.g. ?pays=cameroun).
 */
export function optionId(option: string): string {
  return slugify(option)
}

/**
 * Find the matching option for a raw URL value, comparing both the option
 * slug and a case-insensitive exact match. Returns the original option string.
 */
export function matchOption(
  options: string[],
  value: string
): string | undefined {
  const slug = slugify(value)
  const lower = value.trim().toLowerCase()
  return options.find(
    (o) => slugify(o) === slug || o.trim().toLowerCase() === lower
  )
}
