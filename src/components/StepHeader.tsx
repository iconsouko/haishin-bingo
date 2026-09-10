const STEPS = ['モード選択', '条件設定', '背景と合成']

export function StepHeader({ current }: { current: number }) {
  return (
    <header className="w-full">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 pt-8">
        <h1 className="font-display text-2xl tracking-wide text-paper sm:text-3xl">
          配信ビンゴさん
        </h1>
      </div>
      <div className="mx-auto mt-4 flex max-w-3xl items-center gap-2 px-6">
        {STEPS.map((label, i) => {
          const active = i === current
          const done = i < current
          return (
            <div key={label} className="flex flex-1 items-center gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={
                    'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors ' +
                    (active
                      ? 'bg-coral text-stage-ink'
                      : done
                      ? 'bg-teal text-stage-ink'
                      : 'bg-stage-panel text-stage-line')
                  }
                >
                  {i + 1}
                </span>
                <span
                  className={
                    'hidden text-sm sm:inline ' + (active ? 'text-paper' : 'text-stage-line')
                  }
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={'h-px flex-1 ' + (done ? 'bg-teal' : 'bg-stage-line')} />
              )}
            </div>
          )
        })}
      </div>
    </header>
  )
}
