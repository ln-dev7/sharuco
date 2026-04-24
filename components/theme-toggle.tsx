"use client"

import { useTheme } from "@/components/theme-provider"

import { useUiSounds } from "@/hooks/use-ui-sounds"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme } = useTheme()
  const { playSwitchOn, playSwitchOff, playClick } = useUiSounds()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" onClick={() => playClick()}>
          <Icons.sun className="scale-100 rotate-0 transition-all hover:text-zinc-900 dark:scale-0 dark:-rotate-90 dark:text-zinc-400 dark:hover:text-zinc-100" />
          <Icons.moon className="absolute scale-0 rotate-90 transition-all hover:text-zinc-900 dark:scale-100 dark:rotate-0 dark:text-zinc-400 dark:hover:text-zinc-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" forceMount>
        <DropdownMenuItem
          onClick={() => {
            playSwitchOff()
            setTheme("light")
          }}
        >
          <Icons.sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            playSwitchOn()
            setTheme("dark")
          }}
        >
          <Icons.moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            playClick()
            setTheme("system")
          }}
        >
          <Icons.laptop className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
