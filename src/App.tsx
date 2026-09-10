import { useState } from 'react'
import type { BingoCard, BingoCondition, BingoMode, GridSize } from './types'
import { generateBingoCard } from './utils/bingoGenerator'
import { StepHeader } from './components/StepHeader'
import { ModeSelect } from './components/ModeSelect'
import { ConditionPanel } from './components/ConditionPanel'
import { Composer } from './components/Composer'

type Step = 0 | 1 | 2

export default function App() {
  const [step, setStep] = useState<Step>(0)
  const [mode, setMode] = useState<BingoMode | null>(null)
  const [size, setSize] = useState<GridSize>(5)
  const [freeSpace, setFreeSpace] = useState(true)
  const [card, setCard] = useState<BingoCard | null>(null)

  const handleGenerate = () => {
    if (!mode) return
    const condition: BingoCondition = { mode, size, freeSpace }
    setCard(generateBingoCard(condition))
    setStep(2)
  }

  const handleRegenerate = () => {
    if (!card) return
    setCard(generateBingoCard(card.condition))
  }

  return (
    <div className="min-h-screen bg-stage-ink pb-20">
      <StepHeader current={step} />

      {step === 0 && (
        <ModeSelect
          selected={mode}
          onSelect={(m) => setMode(m)}
          onNext={() => setStep(1)}
        />
      )}

      {step === 1 && mode && (
        <ConditionPanel
          mode={mode}
          size={size}
          freeSpace={freeSpace}
          onChangeSize={setSize}
          onChangeFreeSpace={setFreeSpace}
          onBack={() => setStep(0)}
          onGenerate={handleGenerate}
        />
      )}

      {step === 2 && card && mode && (
        <Composer
          card={card}
          mode={mode}
          onRegenerate={handleRegenerate}
          onBack={() => setStep(1)}
        />
      )}
    </div>
  )
}
