import type { GridSize } from '../types'
import { MODE_MAP } from '../data/modes'
import type { BingoMode } from '../types'

const SIZES: GridSize[] = [3, 4, 5]

export function ConditionPanel({
  mode,
  size,
  freeSpace,
  onChangeSize,
  onChangeFreeSpace,
  onBack,
  onGenerate,
}: {
  mode: BingoMode
  size: GridSize
  freeSpace: boolean
  onChangeSize: (s: GridSize) => void
  onChangeFreeSpace: (v: boolean) => void
  onBack: () => void
  onGenerate: () => void
}) {
  const modeInfo = MODE_MAP[mode]
  const freeSpaceDisabled = size % 2 === 0

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-10">
      <button onClick={onBack} className="text-sm text-muted hover:text-paper">
        ← モードを選び直す
      </button>

      <p className="mt-4 text-sm text-muted">
        選択中：<span className="font-bold text-paper">{modeInfo.name}</span>
      </p>

      <div className="mt-8">
        <h2 className="font-display text-lg text-paper">マス目のサイズ</h2>
        <div className="mt-3 flex gap-3">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => onChangeSize(s)}
              className={
                'flex h-20 w-20 flex-col items-center justify-center rounded-2xl border-2 font-bold transition-colors ' +
                (size === s
                  ? 'border-coral bg-coral/10 text-paper'
                  : 'border-stage-line text-muted hover:border-paper/40')
              }
            >
              <span className="text-xl">{s}×{s}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-display text-lg text-paper">フリーマス（中央は自由選曲）</h2>
        <label className="mt-3 flex w-fit items-center gap-3 rounded-full border-2 border-stage-line px-5 py-3">
          <input
            type="checkbox"
            checked={freeSpace && !freeSpaceDisabled}
            disabled={freeSpaceDisabled}
            onChange={(e) => onChangeFreeSpace(e.target.checked)}
            className="h-5 w-5 accent-coral"
          />
          <span className={freeSpaceDisabled ? 'text-muted' : 'text-paper'}>
            {freeSpaceDisabled ? '偶数マスでは使用できません（3×3 / 5×5で選択可）' : '中央マスを自由選曲にする'}
          </span>
        </label>
      </div>

      <div className="mt-10 flex justify-end">
        <button
          onClick={onGenerate}
          className="rounded-full bg-coral px-8 py-3 font-bold text-stage-ink"
        >
          ビンゴカードを作成する
        </button>
      </div>
    </section>
  )
}
