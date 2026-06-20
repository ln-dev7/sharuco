import {
  AlignLeft,
  AudioLines,
  Calendar,
  ChevronDown,
  CircleDot,
  Clock,
  Code,
  Film,
  Hash,
  Heading,
  Image,
  LinkIcon,
  ListChecks,
  ListOrdered,
  Mail,
  Minus,
  PenTool,
  Phone,
  SlidersHorizontal,
  Star,
  Text,
  Type,
  Upload,
} from "lucide-react"

import { hasOptions, type Question, type QuestionType } from "@/types/form"

export interface FieldDef {
  type: QuestionType
  label: string
  icon: React.ReactNode
}

export const FIELD_GROUPS: { group: string; fields: FieldDef[] }[] = [
  {
    group: "Layout",
    fields: [
      { type: "heading", label: "Heading", icon: <Heading className="h-4 w-4" /> },
      { type: "paragraph", label: "Paragraph", icon: <Text className="h-4 w-4" /> },
      { type: "divider", label: "Divider", icon: <Minus className="h-4 w-4" /> },
    ],
  },
  {
    group: "Text",
    fields: [
      { type: "text", label: "Short answer", icon: <Type className="h-4 w-4" /> },
      { type: "longtext", label: "Long answer", icon: <AlignLeft className="h-4 w-4" /> },
      { type: "email", label: "Email", icon: <Mail className="h-4 w-4" /> },
      { type: "link", label: "Link", icon: <LinkIcon className="h-4 w-4" /> },
      { type: "number", label: "Number", icon: <Hash className="h-4 w-4" /> },
      { type: "phone", label: "Phone", icon: <Phone className="h-4 w-4" /> },
      { type: "date", label: "Date", icon: <Calendar className="h-4 w-4" /> },
      { type: "time", label: "Time", icon: <Clock className="h-4 w-4" /> },
    ],
  },
  {
    group: "Embed",
    fields: [
      { type: "image", label: "Image", icon: <Image className="h-4 w-4" /> },
      { type: "video", label: "Video", icon: <Film className="h-4 w-4" /> },
      { type: "audio", label: "Audio", icon: <AudioLines className="h-4 w-4" /> },
      { type: "embed", label: "Embed", icon: <Code className="h-4 w-4" /> },
    ],
  },
  {
    group: "Choices",
    fields: [
      { type: "uniquechoice", label: "Multiple choice", icon: <CircleDot className="h-4 w-4" /> },
      { type: "multiplechoice", label: "Checkboxes", icon: <ListChecks className="h-4 w-4" /> },
      { type: "dropdown", label: "Dropdown", icon: <ChevronDown className="h-4 w-4" /> },
      { type: "multiselect", label: "Multi-select", icon: <ListChecks className="h-4 w-4" /> },
      { type: "ranking", label: "Ranking", icon: <ListOrdered className="h-4 w-4" /> },
    ],
  },
  {
    group: "Advanced",
    fields: [
      { type: "rating", label: "Rating", icon: <Star className="h-4 w-4" /> },
      { type: "linearscale", label: "Linear scale", icon: <SlidersHorizontal className="h-4 w-4" /> },
      { type: "signature", label: "Signature", icon: <PenTool className="h-4 w-4" /> },
      { type: "fileupload", label: "File upload", icon: <Upload className="h-4 w-4" /> },
    ],
  },
]

export const PLACEHOLDER_TYPES: QuestionType[] = [
  "text",
  "longtext",
  "email",
  "link",
  "number",
  "phone",
]

export const defaultsForType = (type: QuestionType): Question => {
  const base: Question = {
    type,
    text: "",
    label: "",
    description: "",
    required: false,
  }
  if (hasOptions(type)) {
    base.options = ["Option 1", "Option 2", "Option 3"]
  }
  if (type === "rating") base.maxRating = 5
  if (type === "linearscale") {
    base.min = 1
    base.max = 10
    base.step = 1
  }
  return base
}
