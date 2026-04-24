import { Github, Linkedin, Twitter } from "lucide-react"

export type SocialId = "x" | "github" | "linkedin" | "none"

export const SOCIAL_OPTIONS: Array<{ id: SocialId; label: string }> = [
  { id: "none", label: "None" },
  { id: "x", label: "X (Twitter)" },
  { id: "github", label: "GitHub" },
  { id: "linkedin", label: "LinkedIn" },
]

export interface UserInfo {
  name: string
  handle: string
  social: SocialId
  avatar: string
}

function SocialIcon({ social, fg }: { social: SocialId; fg: string }) {
  const common = {
    className: "h-3.5 w-3.5",
    style: { color: fg, opacity: 0.7 },
  }
  switch (social) {
    case "x":
      return <Twitter {...common} />
    case "github":
      return <Github {...common} />
    case "linkedin":
      return <Linkedin {...common} />
    default:
      return null
  }
}

export function UserBadge({ user, fg }: { user: UserInfo; fg: string }) {
  const name = user.name.trim()
  const handle = user.handle.trim()
  if (!name && !handle) return null

  return (
    <div
      className="flex items-center gap-2 px-5 py-3"
      style={{ borderTop: "1px solid rgba(128,128,128,0.15)" }}
    >
      {user.avatar ? (
        <img
          src={user.avatar}
          alt=""
          className="h-7 w-7 shrink-0 rounded-full object-cover"
          style={{ border: "1px solid rgba(128,128,128,0.2)" }}
          crossOrigin="anonymous"
        />
      ) : name ? (
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
          style={{
            backgroundColor: "rgba(128,128,128,0.2)",
            color: fg,
          }}
        >
          {name.charAt(0).toUpperCase()}
        </span>
      ) : null}
      <div className="flex flex-1 flex-col leading-tight">
        {name ? (
          <span className="text-xs font-semibold" style={{ color: fg }}>
            {name}
          </span>
        ) : null}
        {handle ? (
          <span
            className="flex items-center gap-1 text-[11px]"
            style={{ color: fg, opacity: 0.7 }}
          >
            <SocialIcon social={user.social} fg={fg} />
            {handle}
          </span>
        ) : null}
      </div>
    </div>
  )
}
