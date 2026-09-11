import type { BingoMode } from '../types'
import { MODE_LIST } from '../data/modes'
import { BoyCapSilhouette, WomanSilhouette, YoungManSilhouette } from './Silhouettes'

const COLOR_STYLES: Record<string, { border: string; badge: string; iconBg: string; iconText: string }> = {
  coral: { border: 'border-coral', badge: 'bg-coral text-stage-ink', iconBg: 'bg-coral-soft', iconText: 'text-coral' },
  teal: { border: 'border-teal', badge: 'bg-teal text-stage-ink', iconBg: 'bg-teal-soft', iconText: 'text-teal' },
  gold: { border: 'border-gold', badge: 'bg-gold text-stage-ink', iconBg: 'bg-gold-soft', iconText: 'text-gold' },
}

const SILHOUETTES: Record<BingoMode, (props: { className?: string }) => JSX.Element> = {
  lyrics: BoyCapSilhouette,
  title: YoungManSilhouette,
  theme: WomanSilhouette,
}

export function ModeSelect({ onSelectMode }: { onSelectMode: (mode: BingoMode) => void }) {
  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-10">
      <p className="text-sm text-stage-line">
        配信テーマ用のビンゴカードを作ります。まずはビンゴの種類をタップして選んでください。
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {MODE_LIST.map((mode) => {
          const style = COLOR_STYLES[mode.color]
          const Silhouette = SILHOUETTES[mode.id]
          return (
            <button
              key={mode.id}
              onClick={() => onSelectMode(mode.id)}
              className={
                'flex flex-col items-center gap-3 rounded-ticket border-2 border-stage-line bg-stage-panel p-5 text-center transition-all hover:-translate-y-0.5 hover:' +
                style.border
              }
            >
              <span className={`flex h-24 w-24 items-center justify-center rounded-full ${style.iconBg}`}>
                <Silhouette className={`h-16 w-16 ${style.iconText}`} />
              </span>
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
