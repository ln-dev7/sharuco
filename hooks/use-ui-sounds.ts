"use client"

import { useSound } from "@/hooks/use-sound"
import { clickSoftSound } from "@/lib/click-soft"
import { errorBuzzSound } from "@/lib/error-buzz"
import { hoverTickSound } from "@/lib/hover-tick"
import { notificationPopSound } from "@/lib/notification-pop"
import { successChimeSound } from "@/lib/success-chime"
import { switchOffSound } from "@/lib/switch-off"
import { switchOnSound } from "@/lib/switch-on"

export function useUiSounds() {
  const [playClick] = useSound(clickSoftSound, { volume: 0.4, interrupt: true })
  const [playHover] = useSound(hoverTickSound, { volume: 0.2, interrupt: true })
  const [playPop] = useSound(notificationPopSound, { volume: 0.5 })
  const [playSuccess] = useSound(successChimeSound, { volume: 0.5 })
  const [playError] = useSound(errorBuzzSound, { volume: 0.4 })
  const [playSwitchOn] = useSound(switchOnSound, {
    volume: 0.4,
    interrupt: true,
  })
  const [playSwitchOff] = useSound(switchOffSound, {
    volume: 0.4,
    interrupt: true,
  })

  return {
    playClick,
    playHover,
    playPop,
    playSuccess,
    playError,
    playSwitchOn,
    playSwitchOff,
  }
}
