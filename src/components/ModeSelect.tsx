import type { BingoMode } from '../types'
import { MODE_LIST } from '../data/modes'

const COLOR_STYLES: Record<string, { border: string; badge: string; ring: string }> = {
  coral: { border: 'border-coral', badge: 'bg-coral text-stage-ink', ring: 'ring-coral' },
  teal: { border: 'border-teal', badge: 'bg-teal text-stage-ink', ring: 'ring-teal' },
  gold: { border: 'border-gold', badge: 'bg-gold text-stage-ink', ring: 'ring-gold' },
}

export function ModeSelect({
  selected,
  onSelect,
  onNext,
}: {
  selected: BingoMode | null
  onSelect: (mode: BingoMode) => void
  onNext: () => void
}) {
  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-10">
      <p className="text-sm text-stage-line">
        配信テーマ用のビンゴカードを作ります。まずはビンゴの種類を選んでください。
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {MODE_LIST.map((mode) => {
          const style = COLOR_STYLES[mode.color]
          const isSelected = selected === mode.id
          return (
            <button
              key={mode.id}
              onClick={() => onSelect(mode.id)}
              className={
                'flex flex-col items-start gap-3 rounded-ticket border-2 bg-stage-panel p-5 text-left transition-all ' +
                (isSelected ? `${style.border} ring-2 ${style.ring} ring-offset-2 ring-offset-stage-ink` : 'border-stage-line hover:border-stage-line/60')
              }
            >
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${style.badge}`}>
                {mode.tagline}
              </span>
              <span className="font-display text-xl text-paper">{mode.name}</span>
              <p className="text-sm leading-relaxed text-paper/70">{mode.description}</p>
            </button>
          )
        })}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          disabled={!selected}
          onClick={onNext}
          className="rounded-full bg-coral px-8 py-3 font-bold text-stage-ink transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
        >
          この種類で次へ
        </button>
      </div>
    </section>
  )
}
