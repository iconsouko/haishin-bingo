import { useCallback, useRef } from 'react'

/**
 * ボタンの「1タップ＝1回実行」「長押し＝連続実行」を扱うフック。
 *
 * iOS Safari / Chrome(iOS) を含む幅広い環境で確実に動作させるため、
 * Pointer Eventsではなく、最も互換性の高い touch系 / mouse系イベントを
 * それぞれ個別に処理する（タッチ端末ではtouch系のみが有効になり、
 * 続けて発火する合成マウスイベントは実害がない範囲で無視される）。
 *
 * ・指/ボタンを離すまで何も実行しない（離した時点でタップとみなし1回実行）
 * ・一定時間(delayMs)以上押し続けたら、そこから一定間隔(intervalMs)で連続実行に切り替える
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

  const start = useCallback(() => {
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
  }, [action, clearTimers, delayMs, intervalMs])

  const release = useCallback(() => {
    const wasActive = activeRef.current
    const wasRepeating = repeatingRef.current
    activeRef.current = false
    clearTimers()
    if (wasActive && !wasRepeating) {
      // 長押し判定に達する前に離した＝タップとして1回だけ実行
      action()
    }
    repeatingRef.current = false
  }, [action, clearTimers])

  return {
    onTouchStart: (e: React.TouchEvent) => {
      // タッチ後に発火する合成マウスイベント（mousedown等）を抑止する
      e.preventDefault()
      start()
    },
    onTouchEnd: release,
    onTouchCancel: release,
    onMouseDown: start,
    onMouseUp: release,
    onMouseLeave: release,
  }
}
