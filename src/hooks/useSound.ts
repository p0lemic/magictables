import { useRef } from 'react'

export function useSound() {
  const enabledRef = useRef(false)

  function getCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!enabledRef.current) return null
    return new AudioContext()
  }

  function playTone(
    ctx: AudioContext,
    frequency: number,
    startTime: number,
    duration: number,
    gain = 0.3
  ) {
    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()
    osc.connect(gainNode)
    gainNode.connect(ctx.destination)
    osc.frequency.setValueAtTime(frequency, startTime)
    gainNode.gain.setValueAtTime(gain, startTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
    osc.start(startTime)
    osc.stop(startTime + duration)
  }

  /** Call on first user interaction to enable sound. */
  function enable() {
    enabledRef.current = true
  }

  function playCorrect() {
    const ctx = getCtx()
    if (!ctx) return
    const t = ctx.currentTime
    playTone(ctx, 523, t, 0.15)        // C5
    playTone(ctx, 659, t + 0.12, 0.2)  // E5
    playTone(ctx, 784, t + 0.24, 0.3)  // G5
  }

  function playWrong() {
    const ctx = getCtx()
    if (!ctx) return
    const t = ctx.currentTime
    playTone(ctx, 330, t, 0.15, 0.25)        // E4
    playTone(ctx, 277, t + 0.15, 0.3, 0.2)  // C#4
  }

  function playStarFanfare() {
    const ctx = getCtx()
    if (!ctx) return
    const t = ctx.currentTime
    const melody = [523, 659, 784, 1047]
    melody.forEach((freq, i) => {
      playTone(ctx, freq, t + i * 0.15, 0.25, 0.35)
    })
  }

  return { enable, playCorrect, playWrong, playStarFanfare }
}
