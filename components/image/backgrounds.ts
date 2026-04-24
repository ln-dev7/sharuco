export type BackgroundKind = "theme" | "partner" | "backdrop"

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
  /** Shiki theme to use when darkCode is on */
  shikiDark: string
  /** Shiki theme to use when darkCode is off */
  shikiLight: string
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
    shikiDark: "github-dark-default",
    shikiLight: "github-light-default",
    name: "Vercel",
    kind: "partner",
    style: "#000000",
    logo: partnerLogos.vercel,
    logoColor: "#ffffff",
  },
  {
    id: "supabase",
    shikiDark: "poimandres",
    shikiLight: "github-light",
    name: "Supabase",
    kind: "partner",
    style: "linear-gradient(140deg, #1F1F1F, #0E0E0E)",
    logo: partnerLogos.supabase,
    logoColor: "#3ECF8E",
  },
  {
    id: "tailwind",
    shikiDark: "material-theme-ocean",
    shikiLight: "min-light",
    name: "Tailwind",
    kind: "partner",
    style: "linear-gradient(140deg, #0F172A, #1E293B)",
    logo: partnerLogos.tailwind,
    logoColor: "#38BDF8",
  },
  {
    id: "openai",
    shikiDark: "github-dark-dimmed",
    shikiLight: "github-light",
    name: "OpenAI",
    kind: "partner",
    style: "#000000",
    logo: partnerLogos.openai,
    logoColor: "#ffffff",
  },
  {
    id: "mintlify",
    shikiDark: "everforest-dark",
    shikiLight: "everforest-light",
    name: "Mintlify",
    kind: "partner",
    style: "linear-gradient(140deg, #041112, #0A1F22)",
    logo: partnerLogos.mintlify,
    logoColor: "#18E299",
  },
  {
    id: "prisma",
    shikiDark: "vitesse-dark",
    shikiLight: "vitesse-light",
    name: "Prisma",
    kind: "partner",
    style: "linear-gradient(140deg, #1B1B21, #2D2D36)",
    logo: partnerLogos.prisma,
    logoColor: "#2D3748",
  },
  {
    id: "clerk",
    shikiDark: "vesper",
    shikiLight: "min-light",
    name: "Clerk",
    kind: "partner",
    style: "linear-gradient(140deg, #1B1B1B, #0E0E0E)",
    logo: partnerLogos.clerk,
    logoColor: "#6C47FF",
  },
  {
    id: "stripe",
    shikiDark: "laserwave",
    shikiLight: "min-light",
    name: "Stripe",
    kind: "partner",
    style: "linear-gradient(140deg, #635BFF, #0A2540)",
    logo: partnerLogos.stripe,
    logoColor: "#ffffff",
  },
  {
    id: "nuxt",
    shikiDark: "material-theme-palenight",
    shikiLight: "min-light",
    name: "Nuxt",
    kind: "partner",
    style: "linear-gradient(140deg, #002E3B, #00DC82)",
    logo: partnerLogos.nuxt,
    logoColor: "#00DC82",
  },
  {
    id: "resend",
    shikiDark: "github-dark",
    shikiLight: "github-light",
    name: "Resend",
    kind: "partner",
    style: "#000000",
    logo: partnerLogos.resend,
    logoColor: "#ffffff",
  },
  {
    id: "gemini",
    shikiDark: "night-owl",
    shikiLight: "light-plus",
    name: "Gemini",
    kind: "partner",
    style: "linear-gradient(140deg, #1B72E8, #8F44F0)",
    logo: partnerLogos.gemini,
    logoColor: "#ffffff",
  },
  {
    id: "cloudflare",
    shikiDark: "dracula-soft",
    shikiLight: "min-light",
    name: "Cloudflare",
    kind: "partner",
    style: "linear-gradient(140deg, #F38020, #FBAD41)",
    logo: partnerLogos.cloudflare,
    logoColor: "#ffffff",
  },
  {
    id: "firecrawl",
    shikiDark: "monokai",
    shikiLight: "min-light",
    name: "Firecrawl",
    kind: "partner",
    style: "linear-gradient(140deg, #FA5D19, #FFB300)",
    logo: partnerLogos.firecrawl,
    logoColor: "#ffffff",
  },
  {
    id: "elevenlabs",
    shikiDark: "vesper",
    shikiLight: "min-light",
    name: "ElevenLabs",
    kind: "partner",
    style: "#000000",
    logo: partnerLogos.elevenlabs,
    logoColor: "#ffffff",
  },
  {
    id: "triggerdev",
    shikiDark: "synthwave-84",
    shikiLight: "min-light",
    name: "Trigger.dev",
    kind: "partner",
    style: "linear-gradient(140deg, #0B1115, #1B2530)",
    logo: partnerLogos.triggerdev,
    logoColor: "#41FF54",
  },
  {
    id: "browserbase",
    shikiDark: "laserwave",
    shikiLight: "min-light",
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
    shikiDark: "dracula-soft",
    shikiLight: "min-light",
    name: "Bitmap",
    kind: "theme",
    style: "linear-gradient(140deg, #881616, #F1393F)",
  },
  {
    id: "noir",
    shikiDark: "github-dark-dimmed",
    shikiLight: "github-light",
    name: "Noir",
    kind: "theme",
    style: "linear-gradient(140deg, #B1B1B1, #181818)",
  },
  {
    id: "ice",
    shikiDark: "slack-ochin",
    shikiLight: "light-plus",
    name: "Ice",
    kind: "theme",
    style: "linear-gradient(140deg, #FFFFFF, #80DEEA)",
  },
  {
    id: "sand",
    shikiDark: "rose-pine-dawn",
    shikiLight: "solarized-light",
    name: "Sand",
    kind: "theme",
    style: "linear-gradient(140deg, #EED5B6, #AF8856)",
  },
  {
    id: "forest",
    shikiDark: "everforest-dark",
    shikiLight: "everforest-light",
    name: "Forest",
    kind: "theme",
    style: "linear-gradient(140deg, #506853, #213223)",
  },
  {
    id: "mono",
    shikiDark: "monokai",
    shikiLight: "min-light",
    name: "Mono",
    kind: "theme",
    style: "linear-gradient(140deg, #333333, #181818)",
  },
  {
    id: "breeze",
    shikiDark: "synthwave-84",
    shikiLight: "catppuccin-latte",
    name: "Breeze",
    kind: "theme",
    style: "linear-gradient(140deg, #CF2F98, #6A3DEC)",
  },
  {
    id: "candy",
    shikiDark: "rose-pine",
    shikiLight: "rose-pine-dawn",
    name: "Candy",
    kind: "theme",
    style: "linear-gradient(140deg, #A58EFB, #E9BFF8)",
  },
  {
    id: "crimson",
    shikiDark: "dracula",
    shikiLight: "min-light",
    name: "Crimson",
    kind: "theme",
    style: "linear-gradient(140deg, #FF6363, #733434)",
  },
  {
    id: "falcon",
    shikiDark: "github-dark-default",
    shikiLight: "github-light-default",
    name: "Falcon",
    kind: "theme",
    style: "linear-gradient(140deg, #BDE3EC, #363654)",
  },
  {
    id: "meadow",
    shikiDark: "catppuccin-frappe",
    shikiLight: "catppuccin-latte",
    name: "Meadow",
    kind: "theme",
    style: "linear-gradient(140deg, #59D499, #A0872D)",
  },
  {
    id: "midnight",
    shikiDark: "tokyo-night",
    shikiLight: "light-plus",
    name: "Midnight",
    kind: "theme",
    style: "linear-gradient(140deg, #4CC8C8, #202033)",
  },
  {
    id: "raindrop",
    shikiDark: "one-dark-pro",
    shikiLight: "one-light",
    name: "Raindrop",
    kind: "theme",
    style: "linear-gradient(140deg, #8EC7FB, #1C55AA)",
  },
  {
    id: "sunset",
    shikiDark: "ayu-dark",
    shikiLight: "snazzy-light",
    name: "Sunset",
    kind: "theme",
    style: "linear-gradient(140deg, #FFCF73, #FF7A2F)",
  },
]

const mkDark = (
  id: string,
  name: string,
  style: string,
  overrides: Partial<Pick<ImageBackground, "shikiDark" | "shikiLight">> = {}
): ImageBackground => ({
  id,
  name,
  kind: "backdrop",
  style,
  shikiDark: overrides.shikiDark ?? "tokyo-night",
  shikiLight: overrides.shikiLight ?? "light-plus",
})

const mkLight = (id: string, name: string, style: string): ImageBackground => ({
  id,
  name,
  kind: "backdrop",
  style,
  shikiDark: "github-light-default",
  shikiLight: "github-light-default",
})

const BACKDROPS: ImageBackground[] = [
  mkDark(
    "mono1",
    "Monochrome 1",
    "conic-gradient(from 230.29deg at 51.63% 52.16%, rgb(0,0,0) 0deg, rgb(41,41,41) 67.5deg, rgb(5,5,5) 198.75deg, rgb(102,102,102) 251.25deg, rgb(33,33,33) 301.88deg, rgb(23,23,23) 360deg)",
    { shikiDark: "github-dark-dimmed" }
  ),
  mkDark(
    "mono2",
    "Monochrome 2",
    "linear-gradient(140deg, rgb(46,46,46), rgb(18,18,18), rgb(5,5,5))",
    { shikiDark: "github-dark-dimmed" }
  ),
  mkDark(
    "nord",
    "Nord",
    "linear-gradient(140deg, rgb(77,87,106), rgb(68,77,95), rgb(60,67,83), rgb(47,53,65))",
    { shikiDark: "nord" }
  ),
  mkDark(
    "turb1",
    "Turbulent 1",
    "linear-gradient(yellow 5%, fuchsia, royalblue 95%)",
    { shikiDark: "dracula" }
  ),
  mkLight(
    "turb2",
    "Turbulent 2",
    "linear-gradient(rgb(255,255,255) 5%, rgb(128,128,128) 50%, rgb(51,51,51) 95%)"
  ),
  mkDark(
    "turb3",
    "Turbulent 3",
    "linear-gradient(rgb(0,44,102) 5%, rgb(0,109,255) 50%, rgb(153,197,255) 95%)"
  ),
  mkDark(
    "turb4",
    "Turbulent 4",
    "linear-gradient(rgb(0,14,102) 5%, rgb(0,35,255) 50%, rgb(153,167,255) 95%)"
  ),
  mkDark(
    "turb5",
    "Turbulent 5",
    "linear-gradient(rgb(0,51,102) 5%, rgb(0,126,255) 50%, rgb(199,227,255) 95%)"
  ),
  mkDark(
    "turb6",
    "Turbulent 6",
    "linear-gradient(rgb(41,0,102) 5%, rgb(104,0,255) 50%, rgb(194,153,255) 95%)"
  ),
  mkDark(
    "r1",
    "R1",
    "conic-gradient(from 45deg, rgb(102,7,203), rgb(14,188,212), rgb(184,71,243), rgb(82,14,204), rgb(0,168,244), rgb(79,92,184))",
    { shikiDark: "one-dark-pro" }
  ),
  mkDark(
    "r2",
    "R2",
    "conic-gradient(from 90deg, rgb(140,195,228), rgb(37,12,163), rgb(5,197,235), rgb(5,209,192), rgb(4,146,35), rgb(30,239,110))",
    { shikiDark: "poimandres" }
  ),
  mkDark(
    "r3",
    "R3",
    "conic-gradient(from 45deg, rgb(106,102,190), rgb(114,79,247), rgb(36,165,81), rgb(17,152,178), rgb(34,135,249), rgb(199,188,236))"
  ),
  mkDark(
    "r4",
    "R4",
    "conic-gradient(rgb(214,164,38), rgb(167,80,1), rgb(255,173,126), rgb(168,178,185), rgb(16,219,203), rgb(109,177,154))",
    { shikiDark: "ayu-dark" }
  ),
  mkDark(
    "r5",
    "R5",
    "conic-gradient(from 45deg, rgb(122,37,174), rgb(11,26,75), rgb(241,44,222), rgb(53,31,254), rgb(20,30,195))",
    { shikiDark: "synthwave-84" }
  ),
  mkDark(
    "r6",
    "R6",
    "conic-gradient(rgb(56,10,26), rgb(249,73,58), rgb(32,155,198), rgb(3,47,115), rgb(183,214,180), rgb(17,41,139))"
  ),
  mkDark(
    "lakka",
    "Lakka",
    "conic-gradient(from 230.29deg at 51.63% 52.16%, rgb(51,58,255) 0deg, rgb(127,28,166) 67.5deg, rgb(64,85,191) 198.75deg, rgb(255,78,51) 251.25deg, rgb(207,122,250) 301.88deg, rgb(255,255,255) 360deg)"
  ),
  mkDark(
    "chrome",
    "Chrome",
    "conic-gradient(from 230.29deg at 51.63% 52.16%, rgb(0,0,5) 0deg, rgb(40,9,52) 67.5deg, rgb(10,14,31) 198.75deg, rgb(255,78,51) 251.25deg, rgb(207,122,250) 301.88deg, rgb(46,0,46) 360deg)"
  ),
  mkDark(
    "kozuchi",
    "Kozuchi",
    "conic-gradient(from 80deg at 47% 42%, rgb(44,41,61) 0deg, rgb(47,44,104) 60deg, rgb(41,54,122) 140deg, rgb(115,82,152) 200deg, rgb(102,45,159) 280deg, rgb(49,12,49) 360deg)"
  ),
  mkDark(
    "linear-backdrop",
    "Linear",
    "conic-gradient(from 230.29deg at 51.63% 52.16%, rgb(36,0,255) 0deg, rgb(0,135,255) 67.5deg, rgb(255,29,122) 198.75deg, rgb(245,56,27) 251.25deg, rgb(255,83,53) 301.88deg, rgb(105,31,255) 360deg)"
  ),
  mkDark(
    "linear2",
    "Linear 2",
    "conic-gradient(from 135deg, rgb(105,16,126), rgb(139,42,240), rgb(98,72,250), rgb(19,9,113), rgb(210,7,6), rgb(243,70,225))"
  ),
  mkDark(
    "supa",
    "Supa",
    "conic-gradient(from 135deg, rgb(176,242,173), rgb(58,234,230), rgb(33,187,184), rgb(59,138,141), rgb(149,172,6), rgb(184,233,88))",
    { shikiDark: "poimandres" }
  ),
  mkLight(
    "lotion",
    "Lotion",
    "linear-gradient(rgb(250,250,250), rgb(250,250,250))"
  ),
  mkLight(
    "liveblocks",
    "Liveblocks",
    "linear-gradient(125deg, rgb(253,226,237) 0%, rgb(247,229,246) 91%, rgb(244,231,250) 100%)"
  ),
  mkLight(
    "jigglypuff",
    "Jigglypuff",
    "linear-gradient(140deg, rgb(245,214,245), rgb(235,173,235), rgb(224,133,224))"
  ),
  mkLight(
    "sakura",
    "Sakura",
    "linear-gradient(140deg, rgb(250,209,230), rgb(245,163,204), rgb(240,117,179))"
  ),
  mkLight(
    "lavender",
    "Lavender",
    "linear-gradient(140deg, rgb(217,204,255), rgb(179,153,255), rgb(140,102,255))"
  ),
  mkDark(
    "gengar",
    "Gengar",
    "linear-gradient(140deg, rgb(128,51,204), rgb(102,41,163), rgb(77,31,122))"
  ),
  mkDark(
    "lucario",
    "Lucario",
    "conic-gradient(from 140deg, rgb(71,106,209) 0%, rgb(46,80,184) 33%, rgb(36,62,143) 66%, rgb(26,45,102) 100%)"
  ),
  mkDark(
    "snorlax",
    "Snorlax",
    "conic-gradient(from 140deg, rgb(89,89,166) 0%, rgb(71,71,133) 33%, rgb(54,54,99) 66%, rgb(36,36,66) 100%)"
  ),
  mkLight(
    "ocean",
    "Ocean",
    "linear-gradient(140deg, rgb(117,199,240), rgb(71,180,235), rgb(26,162,230))"
  ),
  mkDark(
    "squirtle",
    "Squirtle",
    "linear-gradient(140deg, rgb(0,191,255), rgb(0,153,204), rgb(0,115,153))"
  ),
  mkDark(
    "tailwindcss",
    "TailwindCSS",
    "linear-gradient(140deg, rgb(9,171,241), rgb(5,105,148), rgb(4,84,118), rgb(6,119,167))",
    { shikiDark: "material-theme-ocean" }
  ),
  mkDark(
    "bulbasaur",
    "Bulbasaur",
    "linear-gradient(140deg, rgb(77,179,77), rgb(61,143,61), rgb(46,107,46))"
  ),
  mkDark(
    "vue",
    "Vue",
    "linear-gradient(140deg, rgb(66,184,131), rgb(41,112,80), rgb(32,90,64), rgb(46,127,91))",
    { shikiDark: "catppuccin-macchiato" }
  ),
  mkDark(
    "dragonite",
    "Dragonite",
    "linear-gradient(140deg, rgb(255,166,0), rgb(204,133,0), rgb(153,99,0))"
  ),
  mkDark(
    "dawn",
    "Dawn",
    "linear-gradient(140deg, rgb(204,135,51), rgb(160,62,55), rgb(39,26,40))"
  ),
]

export const IMAGE_BACKGROUNDS: ImageBackground[] = [
  ...THEMES,
  ...BACKDROPS,
  ...PARTNERS,
]

export const IMAGE_BACKGROUNDS_THEMES = THEMES
export const IMAGE_BACKGROUNDS_PARTNERS = PARTNERS
export const IMAGE_BACKGROUNDS_BACKDROPS = BACKDROPS

export const PADDING_OPTIONS = [
  { id: "sm", label: "16", value: 16 },
  { id: "md", label: "32", value: 32 },
  { id: "lg", label: "64", value: 64 },
  { id: "xl", label: "128", value: 128 },
] as const

export type PaddingValue = (typeof PADDING_OPTIONS)[number]["value"]
