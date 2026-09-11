import { useHoldRepeat } from '../utils/useHoldRepeat'

type Target = 'card' | 'background'

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

/**
 * 位置(十字ボタン)・サイズ(スライダー＋±ボタン)の調整UI。
 * 「背景画像」と「ビンゴカード」のどちらを操作対象にするかを切り替えて、
 * 同じ矢印キー／スライダーを共有する。
 */
export function AdjustControls({
  target,
  onChangeTarget,
  backgroundAvailable,
  moveStep,
  onMove,
  sizeValue,
  sizeMin,
  sizeMax,
  sizeSliderStep,
  sizeButtonStep,
  onResize,
}: {
  target: Target
  onChangeTarget: (t: Target) => void
  backgroundAvailable: boolean
  moveStep: number
  onMove: (dx: number, dy: number) => void
  sizeValue: number
  sizeMin: number
  sizeMax: number
  sizeSliderStep: number
  sizeButtonStep: number
  onResize: (delta: number) => void
}) {
  const btn =
    'flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-stage-panel border-2 border-stage-line text-paper text-xl active:bg-coral active:text-stage-ink active:border-coral'

  const targetBtn = (t: Target, label: string) =>
    'flex-1 rounded-full px-3 py-2 text-xs font-bold transition-colors ' +
    (target === t
      ? 'bg-coral text-stage-ink'
      : 'bg-stage-panel text-muted border border-stage-line') +
    (t === 'background' && !backgroundAvailable ? ' opacity-40' : '')

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          disabled={!backgroundAvailable}
          onClick={() => onChangeTarget('background')}
          className={targetBtn('background', '背景')}
        >
          🖼 背景を調整
        </button>
        <button
          type="button"
          onClick={() => onChangeTarget('card')}
          className={targetBtn('card', 'ビンゴ')}
        >
          🎯 ビンゴカードを調整
        </button>
      </div>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 text-xs text-muted">
            位置調整（{target === 'background' ? '背景画像' : 'ビンゴカード'}）
          </p>
          <div className="flex items-center gap-2">
            <HoldButton ariaLabel="上へ移動" className={btn} onFire={() => onMove(0, -moveStep)}>
              ↑
            </HoldButton>
            <HoldButton ariaLabel="下へ移動" className={btn} onFire={() => onMove(0, moveStep)}>
              ↓
            </HoldButton>
            <HoldButton ariaLabel="左へ移動" className={btn} onFire={() => onMove(-moveStep, 0)}>
              ←
            </HoldButton>
            <HoldButton ariaLabel="右へ移動" className={btn} onFire={() => onMove(moveStep, 0)}>
              →
            </HoldButton>
          </div>
        </div>

        <div className="flex-1">
          <p className="mb-2 text-xs text-muted">
            サイズ調整（{target === 'background' ? '背景の拡大率' : 'ビンゴカード'}）
          </p>
          <div className="flex items-center gap-3">
            <HoldButton ariaLabel="縮小" className={btn} onFire={() => onResize(-sizeButtonStep)}>
              −
            </HoldButton>
            <input
              type="range"
              min={sizeMin}
              max={sizeMax}
              step={sizeSliderStep}
              value={sizeValue}
              onChange={(e) => onResize(parseFloat(e.target.value) - sizeValue)}
              className="h-2 flex-1 accent-coral"
            />
            <HoldButton ariaLabel="拡大" className={btn} onFire={() => onResize(sizeButtonStep)}>
              ＋
            </HoldButton>
          </div>
        </div>
      </div>
    </div>
  )
}
