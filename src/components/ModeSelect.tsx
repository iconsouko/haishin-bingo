import type { BingoMode } from '../types'
import { MODE_LIST } from '../data/modes'

const COLOR_STYLES: Record<string, { border: string; badge: string }> = {
  coral: { border: 'border-coral', badge: 'bg-coral text-stage-ink' },
  teal: { border: 'border-teal', badge: 'bg-teal text-stage-ink' },
  gold: { border: 'border-gold', badge: 'bg-gold text-stage-ink' },
}

export function ModeSelect({ onSelectMode }: { onSelectMode: (mode: BingoMode) => void }) {
  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-10">
      <p className="text-sm text-muted">
        配信テーマ用のビンゴカードを作ります。まずはビンゴの種類をタップして選んでください。
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {MODE_LIST.map((mode) => {
          const style = COLOR_STYLES[mode.color]
          return (
            <button
              key={mode.id}
              onClick={() => onSelectMode(mode.id)}
              className={
                'flex flex-col items-start gap-3 rounded-ticket border-2 border-stage-line bg-stage-panel p-5 text-left transition-all hover:-translate-y-0.5 hover:' +
                style.border
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
    </section>
  )
}
