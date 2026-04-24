export interface CodeFont {
  id: string
  name: string
  /** CSS font-family stack */
  family: string
  /** Google Fonts family name, for runtime <link> load */
  google?: string
}

export const CODE_FONTS: CodeFont[] = [
  {
    id: "jetbrains-mono",
    name: "JetBrains Mono",
    family: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
    google: "JetBrains Mono",
  },
  {
    id: "fira-code",
    name: "Fira Code",
    family: '"Fira Code", ui-monospace, SFMono-Regular, Menlo, monospace',
    google: "Fira Code",
  },
  {
    id: "ibm-plex-mono",
    name: "IBM Plex Mono",
    family: '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
    google: "IBM Plex Mono",
  },
  {
    id: "cascadia-code",
    name: "Cascadia Code",
    family:
      '"Cascadia Mono", "Cascadia Code", ui-monospace, SFMono-Regular, Menlo, monospace',
    google: "Cascadia Mono",
  },
  {
    id: "geist-mono",
    name: "Geist Mono",
    family: '"Geist Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
    google: "Geist Mono",
  },
  {
    id: "system-mono",
    name: "System Mono",
    family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
]

export function loadGoogleFont(family: string) {
  if (typeof document === "undefined") return
  const id = `google-font-${family.replace(/\s+/g, "-").toLowerCase()}`
  if (document.getElementById(id)) return
  const link = document.createElement("link")
  link.id = id
  link.rel = "stylesheet"
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    family
  )}:wght@400;500;600;700&display=swap`
  document.head.appendChild(link)
}
