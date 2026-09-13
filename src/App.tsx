import { useEffect, useState } from 'react'
import type { BackgroundTransform, BingoCard, BingoCondition, BingoMode, CardLayout, GridSize } from './types'
import { generateBingoCard, resetChecks, toggleCellChecked } from './utils/bingoGenerator'
import { StepHeader } from './components/StepHeader'
import { ModeSelect } from './components/ModeSelect'
import { ConditionPanel } from './components/ConditionPanel'
import { Composer } from './components/Composer'
import { BingoChecker } from './components/BingoChecker'

type Step = 0 | 1 | 2 | 3

const DEFAULT_LAYOUT: CardLayout = { xPct: 0.2, yPct: 0.155, sizePct: 0.6 }
const DEFAULT_BG_TRANSFORM: BackgroundTransform = { offsetX: 0, offsetY: 0, scale: 1 }

export default function App() {
  const [step, setStep] = useState<Step>(0)
  const [mode, setMode] = useState<BingoMode | null>(null)
  const [size, setSize] = useState<GridSize>(3)
  const [freeSpace, setFreeSpace] = useState(true)
  const [card, setCard] = useState<BingoCard | null>(null)

  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null)
  const [bgTransform, setBgTransform] = useState<BackgroundTransform>(DEFAULT_BG_TRANSFORM)
  const [layout, setLayout] = useState<CardLayout>(DEFAULT_LAYOUT)
  const [letterboxColor, setLetterboxColor] = useState<'white' | 'black'>('white')

  // 画面が切り替わるたびにページ上部へ戻し、案内文を読み飛ばさないようにする
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [step])

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

  const handleToggleCell = (key: string) => {
    setCard((prev) => (prev ? toggleCellChecked(prev, key) : prev))
  }

  const handleResetChecks = () => {
    setCard((prev) => (prev ? resetChecks(prev) : prev))
  }

  return (
    <div className="min-h-screen bg-stage-ink pb-20">
      <StepHeader current={step} />

      {step === 0 && (
        <ModeSelect
          onSelectMode={(m) => {
            setMode(m)
            setStep(1)
          }}
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
          bgImage={bgImage}
          setBgImage={setBgImage}
          bgTransform={bgTransform}
          setBgTransform={setBgTransform}
          layout={layout}
          setLayout={setLayout}
          defaultLayout={DEFAULT_LAYOUT}
          letterboxColor={letterboxColor}
          setLetterboxColor={setLetterboxColor}
          onRegenerate={handleRegenerate}
          onBack={() => setStep(1)}
          onConfirm={() => setStep(3)}
        />
      )}

      {step === 3 && card && mode && (
        <BingoChecker
          card={card}
          mode={mode}
          bgImage={bgImage}
          bgTransform={bgTransform}
          layout={layout}
          letterboxColor={letterboxColor}
          onToggleCell={handleToggleCell}
          onResetChecks={handleResetChecks}
          onBackToAdjust={() => setStep(2)}
        />
      )}
    </div>
  )
}
