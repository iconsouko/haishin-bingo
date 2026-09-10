import { useCallback, useRef } from 'react'

/**
 * ボタンの「1タップ＝1回実行」「長押し＝連続実行」を扱うフック。
 * サイズ調整バーの±ボタンや十字ボタンで使用する。
 */
export function useHoldRepeat(action: () => void, intervalMs = 90, delayMs = 350) {
  const timeoutRef = useRef<number | null>(null)
  const intervalRef = useRef<number | null>(null)
  const firedOnceRef = useRef(false)

  const clear = useCallback(() => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    if (intervalRef.current) window.clearInterval(intervalRef.current)
    timeoutRef.current = null
    intervalRef.current = null
  }, [])

  const start = useCallback(() => {
    firedOnceRef.current = true
    action()
    timeoutRef.current = window.setTimeout(() => {
      intervalRef.current = window.setInterval(() => {
        action()
      }, intervalMs)
    }, delayMs)
  }, [action, delayMs, intervalMs])

  const stop = useCallback(() => {
    clear()
  }, [clear])

  return {
    onPointerDown: start,
    onPointerUp: stop,
    onPointerLeave: stop,
    onPointerCancel: stop,
  }
}
