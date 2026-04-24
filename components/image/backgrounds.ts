export type BackgroundKind = "theme" | "partner"

export interface ImageBackground {
  id: string
  name: string
  kind: BackgroundKind
  style: string
  /** Inline SVG string (viewBox-based) or null for themes */
  logo?: string | null
  /** CSS color for the partner logo */
  logoColor?: string
  /** Gradient swatch for the dropdown trigger */
  swatch?: string
}

const partnerLogos: Record<string, string> = {
  vercel:
    '<svg viewBox="0 0 16 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M8.1383 0.054L16.1383 13.911H0.1383L8.1383 0.054Z"/></svg>',
  supabase:
    '<svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M9 15.6C8.6 16.1 7.8 15.8 7.8 15.2l-.2-9.5h6.4c1.2 0 1.9 1.3 1.1 2.3L9 15.6Z" fill="#3ECF8E"/><path d="M6.4.3C6.8-.2 7.6.1 7.6.7l.1 9.5H1.4C.2 10.2-.4 8.9.3 8L6.4.3Z" fill="#3ECF8E"/></svg>',
  tailwind:
    '<svg viewBox="0 0 16 10" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M8 0C5.9 0 4.5 1.1 4 3.2c.8-1.1 1.7-1.5 2.8-1.2.6.2 1 .6 1.5 1.1.8.8 1.7 1.7 3.7 1.7 2.1 0 3.5-1.1 4-3.2-.8 1.1-1.7 1.5-2.8 1.2-.6-.2-1-.6-1.5-1.1C10.9.9 10 0 8 0ZM4 4.8C1.9 4.8.5 5.9 0 8c.8-1.1 1.7-1.5 2.8-1.2.6.2 1 .6 1.5 1.1.8.8 1.7 1.7 3.7 1.7 2.1 0 3.5-1.1 4-3.2-.8 1.1-1.7 1.5-2.8 1.2-.6-.2-1-.6-1.5-1.1C6.9 5.7 6 4.8 4 4.8Z"/></svg>',
  openai:
    '<svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M14.7 6.5c.2-.5.3-1.1.2-1.7A3.5 3.5 0 0 0 10 1.3a3.5 3.5 0 0 0-5.4 1.5A3.5 3.5 0 0 0 1 9.5a3.5 3.5 0 0 0 4.6 4.6 3.5 3.5 0 0 0 6.4 0A3.5 3.5 0 0 0 15 11a3.5 3.5 0 0 0-.3-4.5ZM8.7 15c-.7 0-1.4-.2-1.9-.7l3.2-1.8c.2-.1.3-.3.3-.5V7.4l1.3.8v3.7A3 3 0 0 1 8.7 15ZM2.3 12.2c-.4-.6-.5-1.3-.3-2l3.2 1.9c.2.1.4.1.6 0l3.9-2.2v1.5l-3.2 1.9c-1.4.8-3.3.3-4.2-1.1Zm-.8-6.9c.3-.6.9-1.1 1.5-1.3v3.8c0 .2.1.4.3.5l3.9 2.2-1.4.8-3.2-1.9c-1.4-.8-1.9-2.7-1.1-4.1Z"/></svg>',
  mintlify:
    '<svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M4.2 5.8c0-1.5.6-3 1.7-4.1l-4.1 4.1c-1 1-1.6 2.3-1.7 3.8 0 1.4.4 2.8 1.2 3.9l4.1-4.1c-.8-1-1.2-2.2-1.2-3.6Z"/><path d="M14.2 10.1c-.8.8-1.8 1.3-2.8 1.5-1 .3-2.1.2-3.1-.2-.6-.2-1.1-.5-1.5-.9l-4.2 4.2C3.7 15.7 5.1 16 6.3 16c1.4 0 2.7-.6 3.7-1.7l4.2-4.2Z"/><path d="M16 5.9V0h-5.9c-1.7 0-3.3.7-4.5 1.8L5.9 2C5.2 2.7 4.7 3.6 4.4 4.4c.5-.1 1-.2 1.5-.2 1.3 0 2.6.4 3.6 1.2 1 .7 1.7 1.6 2.1 2.7.4 1.1.4 2.4.1 3.5 1-.3 1.9-.8 2.6-1.5l.1-.1c.5-.5 1-1.2 1.3-1.9.3-.7.5-1.5.5-2.3Z"/></svg>',
  prisma:
    '<svg viewBox="0 0 14 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M13.2 12.2 7.7.5A.9.9 0 0 0 7 0a.8.8 0 0 0-.7.4L.1 10A.9.9 0 0 0 .1 11l2.9 4.5c.3.4.8.6 1.3.4l8.4-2.5c.2-.1.4-.2.6-.4.1-.2.2-.4.2-.7 0-.1 0-.3-.1-.4Zm-1.3.5-7.2 2.1c-.2.1-.4-.1-.4-.3L6.9 2.2c0-.2.4-.2.5 0l4.7 10.1c.1.2 0 .4-.2.4Z"/></svg>',
  clerk:
    '<svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M16 21a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm9 6.8c.4.4.4 1.1-.1 1.5A16 16 0 0 1 16 32a16 16 0 0 1-8.9-2.7c-.5-.3-.5-1-.1-1.5l3.7-3.6c.3-.3.8-.4 1.2-.2 1.2.6 2.6 1 4.1 1 1.5 0 2.9-.4 4.1-1 .4-.2.9-.1 1.2.2l3.7 3.6Z"/><path opacity=".5" d="M24.9 2.7c.5.3.5 1 .1 1.5l-3.7 3.6c-.3.3-.8.4-1.2.2A9 9 0 0 0 8 20.1c.2.4.1.9-.2 1.2L4.2 25c-.5.4-1.1.4-1.5-.1A16 16 0 0 1 0 16a16 16 0 0 1 16-16c3.3 0 6.4 1 8.9 2.7Z"/></svg>',
  stripe:
    '<svg viewBox="0 0 250 250" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M0 250 250 197.4V0L0 51.6V250Z"/></svg>',
  nuxt: '<svg viewBox="0 0 256 168" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M143.6 167h95.2a17 17 0 0 0 8.6-2.2 17 17 0 0 0 6.3-6.1 16 16 0 0 0 0-16.7L189.8 34.6a17 17 0 0 0-6.3-6.1 17.6 17.6 0 0 0-17.2 0 17 17 0 0 0-6.3 6.1l-16.3 27.5L112 8.3A17 17 0 0 0 96.8 0a17.6 17.6 0 0 0-14.9 8.3L2.3 142a16 16 0 0 0 0 16.7 17 17 0 0 0 14.9 8.3h59.7c23.7 0 41.1-10 53.1-29.7l29.2-49 15.6-26.2 46.9 78.7h-62.5L143.6 167ZM76 140.8l-41.7-.1 62.5-105 31.2 52.5-20.9 35.1c-8 12.8-17 17.4-31.1 17.4Z"/></svg>',
  resend:
    '<svg viewBox="0 0 1004 997" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M602.5 52c174.3 0 278 103.7 278 241.3 0 137.6-103.7 241.3-278 241.3h-88L952 952H642.8L309.8 635.5c-23.9-22-34.9-47.7-34.9-69.7 0-31.2 22-58.7 64.3-70.7l171.5-45.9c65.1-17.4 110.1-67.9 110.1-133.9 0-80.8-66.1-127.5-147.7-127.5H52V52h550.5Z"/></svg>',
  gemini:
    '<svg viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M241 30q15-15 30 0c0 110 101 211 211 211q15 15 0 30c-110 0-211 101-211 211q-15 15-30 0c0-110-101-211-211-211q-15-15 0-30c110 0 211-101 211-211Z"/></svg>',
  cloudflare:
    '<svg viewBox="0 0 66 30" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M52.7 13c-.2 0-.4 0-.7.1L51.1 16c-.4 1.4-.2 2.7.4 3.6.6.9 1.6 1.4 2.9 1.5l5 .3c.2 0 .4.2.4.4a.5.5 0 0 1-.5.7L54 22.7c-2.9.1-5.9 2.5-7 5.3l-.4 1a.3.3 0 0 0 .3.4H65a.5.5 0 0 0 .5-.4c.3-1.2.5-2.3.5-3.5 0-7.2-5.8-13-13-13Zm-8 16.6.4-1.2c.4-1.4.2-2.7-.4-3.6-.6-.9-1.6-1.4-2.9-1.5l-23.7-.3c-.2 0-.3-.1-.4-.2 0-.1 0-.3 0-.4 0-.2.2-.4.5-.4l23.9-.3c2.8-.1 5.9-2.5 6.9-5.3l1.4-3.6v-.5C49 5.2 42.8 0 35.4 0 28.5 0 22.7 4.5 20.7 10.7c-1.4-1-3.2-1.5-5-1.4-3.3.4-5.9 3-6.3 6.4 0 .8 0 1.7.2 2.5C4.3 18.2 0 22.7 0 28.1c0 .5 0 1 .1 1.5a.5.5 0 0 0 .5.4h43.7a.6.6 0 0 0 .5-.4Z"/></svg>',
  firecrawl:
    '<svg viewBox="0 0 50 72" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M41.7 23.2c-2.8.8-4.8 2.7-6.4 4.7-.3.4-1 .1-.9-.4 2.9-12-.9-22-13-26.9-.6-.2-1.2.3-1.1 1 5.5 22-17.6 20.1-14.6 45 0 .4-.5.7-.8.5-1.1-.8-2.3-2.4-3.2-3.5-.2-.3-.7-.3-.9.1-.6 2.4-1 4.7-1 6.9 0 8.8 4.5 16.5 11.3 20.9.4.3.9-.1.7-.5-.3-1.2-.5-2.4-.6-3.7 0-.8.1-1.6.2-2.3.3-1.9.9-3.7 2-5.3 3.8-5.7 11.4-11.1 10.2-18.5 0-.5.5-.8.8-.5 5.3 4.9 6.4 11.5 5.5 17.3 0 .5.6.8.9.4.8-1 1.8-1.9 2.9-2.6.3-.2.6 0 .7.3.6 1.8 1.5 3.4 2.3 5.1 1 2 1.5 4.2 1.5 6.6 0 1.2-.3 2.3-.6 3.4-.1.5.4.8.8.6 6.8-4.4 11.3-12.1 11.3-20.9 0-3-.5-6-1.5-8.8-2.1-5.9-7.4-10.3-6.1-17.9.1-.4-.3-.7-.6-.6Z"/></svg>',
  elevenlabs:
    '<svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6.3 16H3V0h3.3v16ZM12.3 16H9V0h3.3v16Z"/></svg>',
  triggerdev:
    '<svg viewBox="0 0 17 15" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.7 5.7 8.9.2l8 13.8h-16l3.2-5.6 2.3 1.3-.9 1.6h6.9L8.9 5.4 8 7.1 5.7 5.7Z"/></svg>',
  browserbase:
    '<svg viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M100 0H0v100h100V0ZM36 27.8v44.4h16.5A11.4 11.4 0 0 0 64 60.8v-2.5c0-3.6-1.6-6.8-4.2-8.9a11.2 11.2 0 0 0 3-7.5v-2.6c0-6.3-5-11.4-11.4-11.4H36Zm16.5 38.1H42.4V53.2h10.1c2.9 0 5.1 2.2 5.1 5v2.6c0 2.8-2.2 5-5.1 5ZM51.3 46.8H42.4V34.1h8.9c2.8 0 5 2.2 5 5v2.6c0 2.8-2.2 5.1-5 5.1Z"/></svg>',
}

const PARTNERS: ImageBackground[] = [
  {
    id: "vercel",
    name: "Vercel",
    kind: "partner",
    style: "#000000",
    logo: partnerLogos.vercel,
    logoColor: "#ffffff",
  },
  {
    id: "supabase",
    name: "Supabase",
    kind: "partner",
    style: "linear-gradient(140deg, #1F1F1F, #0E0E0E)",
    logo: partnerLogos.supabase,
    logoColor: "#3ECF8E",
  },
  {
    id: "tailwind",
    name: "Tailwind",
    kind: "partner",
    style: "linear-gradient(140deg, #0F172A, #1E293B)",
    logo: partnerLogos.tailwind,
    logoColor: "#38BDF8",
  },
  {
    id: "openai",
    name: "OpenAI",
    kind: "partner",
    style: "#000000",
    logo: partnerLogos.openai,
    logoColor: "#ffffff",
  },
  {
    id: "mintlify",
    name: "Mintlify",
    kind: "partner",
    style: "linear-gradient(140deg, #041112, #0A1F22)",
    logo: partnerLogos.mintlify,
    logoColor: "#18E299",
  },
  {
    id: "prisma",
    name: "Prisma",
    kind: "partner",
    style: "linear-gradient(140deg, #1B1B21, #2D2D36)",
    logo: partnerLogos.prisma,
    logoColor: "#2D3748",
  },
  {
    id: "clerk",
    name: "Clerk",
    kind: "partner",
    style: "linear-gradient(140deg, #1B1B1B, #0E0E0E)",
    logo: partnerLogos.clerk,
    logoColor: "#6C47FF",
  },
  {
    id: "stripe",
    name: "Stripe",
    kind: "partner",
    style: "linear-gradient(140deg, #635BFF, #0A2540)",
    logo: partnerLogos.stripe,
    logoColor: "#ffffff",
  },
  {
    id: "nuxt",
    name: "Nuxt",
    kind: "partner",
    style: "linear-gradient(140deg, #002E3B, #00DC82)",
    logo: partnerLogos.nuxt,
    logoColor: "#00DC82",
  },
  {
    id: "resend",
    name: "Resend",
    kind: "partner",
    style: "#000000",
    logo: partnerLogos.resend,
    logoColor: "#ffffff",
  },
  {
    id: "gemini",
    name: "Gemini",
    kind: "partner",
    style: "linear-gradient(140deg, #1B72E8, #8F44F0)",
    logo: partnerLogos.gemini,
    logoColor: "#ffffff",
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    kind: "partner",
    style: "linear-gradient(140deg, #F38020, #FBAD41)",
    logo: partnerLogos.cloudflare,
    logoColor: "#ffffff",
  },
  {
    id: "firecrawl",
    name: "Firecrawl",
    kind: "partner",
    style: "linear-gradient(140deg, #FA5D19, #FFB300)",
    logo: partnerLogos.firecrawl,
    logoColor: "#ffffff",
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    kind: "partner",
    style: "#000000",
    logo: partnerLogos.elevenlabs,
    logoColor: "#ffffff",
  },
  {
    id: "triggerdev",
    name: "Trigger.dev",
    kind: "partner",
    style: "linear-gradient(140deg, #0B1115, #1B2530)",
    logo: partnerLogos.triggerdev,
    logoColor: "#41FF54",
  },
  {
    id: "browserbase",
    name: "Browserbase",
    kind: "partner",
    style: "linear-gradient(140deg, #F03603, #FF7B3F)",
    logo: partnerLogos.browserbase,
    logoColor: "#ffffff",
  },
]

const THEMES: ImageBackground[] = [
  {
    id: "bitmap",
    name: "Bitmap",
    kind: "theme",
    style: "linear-gradient(140deg, #881616, #F1393F)",
  },
  {
    id: "noir",
    name: "Noir",
    kind: "theme",
    style: "linear-gradient(140deg, #B1B1B1, #181818)",
  },
  {
    id: "ice",
    name: "Ice",
    kind: "theme",
    style: "linear-gradient(140deg, #FFFFFF, #80DEEA)",
  },
  {
    id: "sand",
    name: "Sand",
    kind: "theme",
    style: "linear-gradient(140deg, #EED5B6, #AF8856)",
  },
  {
    id: "forest",
    name: "Forest",
    kind: "theme",
    style: "linear-gradient(140deg, #506853, #213223)",
  },
  {
    id: "mono",
    name: "Mono",
    kind: "theme",
    style: "linear-gradient(140deg, #333333, #181818)",
  },
  {
    id: "breeze",
    name: "Breeze",
    kind: "theme",
    style: "linear-gradient(140deg, #CF2F98, #6A3DEC)",
  },
  {
    id: "candy",
    name: "Candy",
    kind: "theme",
    style: "linear-gradient(140deg, #A58EFB, #E9BFF8)",
  },
  {
    id: "crimson",
    name: "Crimson",
    kind: "theme",
    style: "linear-gradient(140deg, #FF6363, #733434)",
  },
  {
    id: "falcon",
    name: "Falcon",
    kind: "theme",
    style: "linear-gradient(140deg, #BDE3EC, #363654)",
  },
  {
    id: "meadow",
    name: "Meadow",
    kind: "theme",
    style: "linear-gradient(140deg, #59D499, #A0872D)",
  },
  {
    id: "midnight",
    name: "Midnight",
    kind: "theme",
    style: "linear-gradient(140deg, #4CC8C8, #202033)",
  },
  {
    id: "raindrop",
    name: "Raindrop",
    kind: "theme",
    style: "linear-gradient(140deg, #8EC7FB, #1C55AA)",
  },
  {
    id: "sunset",
    name: "Sunset",
    kind: "theme",
    style: "linear-gradient(140deg, #FFCF73, #FF7A2F)",
  },
]

export const IMAGE_BACKGROUNDS: ImageBackground[] = [...THEMES, ...PARTNERS]

export const IMAGE_BACKGROUNDS_THEMES = THEMES
export const IMAGE_BACKGROUNDS_PARTNERS = PARTNERS

export const PADDING_OPTIONS = [
  { id: "sm", label: "16", value: 16 },
  { id: "md", label: "32", value: 32 },
  { id: "lg", label: "64", value: 64 },
  { id: "xl", label: "128", value: 128 },
] as const

export type PaddingValue = (typeof PADDING_OPTIONS)[number]["value"]
