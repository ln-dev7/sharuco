// Shared types for Sharuco Form
// Inspired by Tally.so field types

export type QuestionType =
  // Layout / content blocks
  | "heading"
  | "paragraph"
  | "divider"
  // Embed blocks
  | "image"
  | "video"
  | "audio"
  | "embed"
  // Text inputs
  | "text"
  | "longtext"
  | "email"
  | "link"
  | "number"
  | "phone"
  // Date & time
  | "date"
  | "time"
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
  id?: string // stable, URL-friendly id derived from the label (for prefill via query params)
  type: QuestionType
  label: string
  text?: string // placeholder, or the URL for embed blocks
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

// Embed/media blocks (display a URL, collect no answer)
export const MEDIA_TYPES: QuestionType[] = ["image", "video", "audio", "embed"]

// Field types that don't collect an answer
export const CONTENT_TYPES: QuestionType[] = [
  "heading",
  "paragraph",
  "divider",
  ...MEDIA_TYPES,
]

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

export const isMediaBlock = (type: QuestionType) => MEDIA_TYPES.includes(type)

export const hasOptions = (type: QuestionType) => OPTION_TYPES.includes(type)

// Human readable label for a field type (used for badges)
export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  heading: "Heading",
  paragraph: "Paragraph",
  divider: "Divider",
  image: "Image",
  video: "Video",
  audio: "Audio",
  embed: "Embed",
  text: "Short answer",
  longtext: "Long answer",
  email: "Email",
  link: "Link",
  number: "Number",
  phone: "Phone",
  date: "Date",
  time: "Time",
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
