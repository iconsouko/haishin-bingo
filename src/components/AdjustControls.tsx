import type { CardLayout } from '../types'
import { useHoldRepeat } from '../utils/useHoldRepeat'

const MOVE_STEP = 0.02
const SIZE_STEP = 0.01
const MIN_SIZE = 0.28
const MAX_SIZE = 0.92

function HoldButton({
  onFire,
  children,
  className,
  ariaLabel,
}: {
  onFire: () => void
  children: React.ReactNode
  className: string
  ariaLabel: string
}) {
  const handlers = useHoldRepeat(onFire)
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={'no-select select-none ' + className}
      onTouchStart={handlers.onTouchStart}
      onTouchEnd={handlers.onTouchEnd}
      onTouchCancel={handlers.onTouchCancel}
      onMouseDown={handlers.onMouseDown}
      onMouseUp={handlers.onMouseUp}
      onMouseLeave={handlers.onMouseLeave}
    >
      {children}
    </button>
  )
}

export function AdjustControls({
  layout,
  setLayout,
}: {
  layout: CardLayout
  setLayout: (updater: (prev: CardLayout) => CardLayout) => void
}) {
  const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

  // xPct/yPctは左上基準。移動自体は制限せず、キャンバス外に出過ぎない範囲まで許容する（重なりは警告で通知）。
  const moveClamped = (dx: number, dy: number) =>
    setLayout((prev) => ({
      ...prev,
      xPct: clamp(prev.xPct + dx, -prev.sizePct * 0.3, 1 - prev.sizePct * 0.7),
      yPct: clamp(prev.yPct + dy, -prev.sizePct * 0.3, 1 - prev.sizePct * 0.7),
    }))

  const resize = (delta: number) =>
    setLayout((prev) => {
      const nextSize = clamp(prev.sizePct + delta, MIN_SIZE, MAX_SIZE)
      // 中心を保ったまま拡縮する
      const centerX = prev.xPct + prev.sizePct / 2
      const centerY = prev.yPct + prev.sizePct / 2
      return {
        sizePct: nextSize,
        xPct: centerX - nextSize / 2,
        yPct: centerY - nextSize / 2,
      }
    })

  const btn =
    'flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-stage-panel border-2 border-stage-line text-paper text-xl active:bg-coral active:text-stage-ink active:border-coral'

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="mb-2 text-xs text-stage-line">位置調整</p>
        <div className="flex items-center gap-2">
          <HoldButton ariaLabel="上へ移動" className={btn} onFire={() => moveClamped(0, -MOVE_STEP)}>
            ↑
          </HoldButton>
          <HoldButton ariaLabel="下へ移動" className={btn} onFire={() => moveClamped(0, MOVE_STEP)}>
            ↓
          </HoldButton>
          <HoldButton ariaLabel="左へ移動" className={btn} onFire={() => moveClamped(-MOVE_STEP, 0)}>
            ←
          </HoldButton>
          <HoldButton ariaLabel="右へ移動" className={btn} onFire={() => moveClamped(MOVE_STEP, 0)}>
            →
          </HoldButton>
        </div>
      </div>

      <div className="flex-1">
        <p className="mb-2 text-xs text-stage-line">サイズ調整</p>
        <div className="flex items-center gap-3">
          <HoldButton ariaLabel="縮小" className={btn} onFire={() => resize(-SIZE_STEP)}>
            −
          </HoldButton>
          <input
            type="range"
            min={MIN_SIZE}
            max={MAX_SIZE}
            step={0.005}
            value={layout.sizePct}
            onChange={(e) => resize(parseFloat(e.target.value) - layout.sizePct)}
            className="h-2 flex-1 accent-coral"
          />
          <HoldButton ariaLabel="拡大" className={btn} onFire={() => resize(SIZE_STEP)}>
            ＋
          </HoldButton>
        </div>
      </div>
    </div>
  )
}
