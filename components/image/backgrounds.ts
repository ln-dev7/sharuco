export interface ImageBackground {
  id: string
  name: string
  style: string
}

export const IMAGE_BACKGROUNDS: ImageBackground[] = [
  {
    id: "candy",
    name: "Candy",
    style: "linear-gradient(135deg, #FF80B5 0%, #9089FC 100%)",
  },
  {
    id: "midnight",
    name: "Midnight",
    style: "linear-gradient(135deg, #5C258D 0%, #4389A2 100%)",
  },
  {
    id: "breeze",
    name: "Breeze",
    style: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
  },
  {
    id: "sunset",
    name: "Sunset",
    style: "linear-gradient(135deg, #ff512f 0%, #f09819 100%)",
  },
  {
    id: "peachy",
    name: "Peachy",
    style: "linear-gradient(135deg, #ffb88c 0%, #de6262 100%)",
  },
  {
    id: "blush",
    name: "Blush",
    style: "linear-gradient(135deg, #B24592 0%, #F15F79 100%)",
  },
  {
    id: "meadow",
    name: "Meadow",
    style: "linear-gradient(135deg, #4776E6 0%, #8E54E9 100%)",
  },
  {
    id: "aurora",
    name: "Aurora",
    style: "linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)",
  },
  {
    id: "forest",
    name: "Forest",
    style: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
  },
  {
    id: "mango",
    name: "Mango",
    style: "linear-gradient(135deg, #fceabb 0%, #f8b500 100%)",
  },
  {
    id: "slate",
    name: "Slate",
    style: "linear-gradient(135deg, #232526 0%, #414345 100%)",
  },
  {
    id: "rose",
    name: "Rose",
    style: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
  },
  {
    id: "violet",
    name: "Violet",
    style: "linear-gradient(135deg, #7F00FF 0%, #E100FF 100%)",
  },
  {
    id: "mint",
    name: "Mint",
    style: "linear-gradient(135deg, #00b09b 0%, #96c93d 100%)",
  },
  {
    id: "cosmic",
    name: "Cosmic",
    style: "linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)",
  },
  {
    id: "bw",
    name: "BW",
    style: "linear-gradient(135deg, #000000 0%, #434343 100%)",
  },
]

export const PADDING_OPTIONS = [
  { id: "sm", label: "16", value: 16 },
  { id: "md", label: "32", value: 32 },
  { id: "lg", label: "64", value: 64 },
  { id: "xl", label: "128", value: 128 },
] as const

export type PaddingValue = (typeof PADDING_OPTIONS)[number]["value"]
