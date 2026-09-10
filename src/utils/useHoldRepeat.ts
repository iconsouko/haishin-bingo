import { useCallback, useRef } from 'react'

/**
 * ボタンの「1タップ＝1回実行」「長押し＝連続実行」を扱うフック。
 * ・指を離すまで何も実行しない（離した時点でタップとみなし1回実行）
 * ・一定時間(delayMs)以上押し続けたら、そこから一定間隔(intervalMs)で連続実行に切り替える
 *   （連続実行に入った場合は、離したときの重複実行はしない）
 */
export function useHoldRepeat(action: () => void, intervalMs = 90, delayMs = 350) {
  const timeoutRef = useRef<number | null>(null)
  const intervalRef = useRef<number | null>(null)
  const repeatingRef = useRef(false)
  const activeRef = useRef(false)

  const clearTimers = useCallback(() => {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
    if (intervalRef.current !== null) window.clearInterval(intervalRef.current)
    timeoutRef.current = null
    intervalRef.current = null
  }, [])

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      activeRef.current = true
      repeatingRef.current = false
      clearTimers()
      timeoutRef.current = window.setTimeout(() => {
        if (!activeRef.current) return
        repeatingRef.current = true
        action()
        intervalRef.current = window.setInterval(() => {
          action()
        }, intervalMs)
      }, delayMs)
    },
    [action, clearTimers, delayMs, intervalMs]
  )

  const release = useCallback(() => {
    const wasRepeating = repeatingRef.current
    const wasActive = activeRef.current
    activeRef.current = false
    clearTimers()
    if (wasActive && !wasRepeating) {
      // 長押し判定に達する前に離した＝タップとして1回だけ実行
      action()
    }
    repeatingRef.current = false
  }, [action, clearTimers])

  return {
    onPointerDown,
    onPointerUp: release,
    onPointerLeave: release,
    onPointerCancel: release,
  }
}
