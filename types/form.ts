// Shared types for Sharuco Form
// Inspired by Tally.so field types

export type QuestionType =
  // Layout / content blocks
  | "heading"
  | "paragraph"
  | "divider"
  // Text inputs
  | "text"
  | "longtext"
  | "email"
  | "link"
  | "number"
  | "phone"
  // Date
  | "date"
  // Choices
  | "uniquechoice"
  | "multiplechoice"
  | "dropdown"
  | "multiselect"
  // Advanced
  | "rating"
  | "linearscale"
  | "ranking"
  | "signature"
  | "fileupload"

export interface Question {
  type: QuestionType
  label: string
  text?: string // placeholder
  description?: string // helper text under the label
  required?: boolean
  options?: string[] // for choice / ranking fields
  maxRating?: number // for rating (default 5)
  min?: number // for linear scale
  max?: number // for linear scale
  step?: number // for linear scale
}

export interface AnswerItem {
  type: QuestionType
  label: string
  text: string // always a string representation of the answer
}

// Field types that don't collect an answer
export const CONTENT_TYPES: QuestionType[] = ["heading", "paragraph", "divider"]

// Field types that use an editable list of options
export const OPTION_TYPES: QuestionType[] = [
  "uniquechoice",
  "multiplechoice",
  "dropdown",
  "multiselect",
  "ranking",
]

export const isContentBlock = (type: QuestionType) =>
  CONTENT_TYPES.includes(type)

export const hasOptions = (type: QuestionType) => OPTION_TYPES.includes(type)

// Human readable label for a field type (used for badges)
export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  heading: "Heading",
  paragraph: "Paragraph",
  divider: "Divider",
  text: "Short answer",
  longtext: "Long answer",
  email: "Email",
  link: "Link",
  number: "Number",
  phone: "Phone",
  date: "Date",
  uniquechoice: "Multiple choice",
  multiplechoice: "Checkboxes",
  dropdown: "Dropdown",
  multiselect: "Multi-select",
  rating: "Rating",
  linearscale: "Linear scale",
  ranking: "Ranking",
  signature: "Signature",
  fileupload: "File upload",
}
