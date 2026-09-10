import { useEffect, useRef, useState } from 'react'
import type { BackgroundTransform, BingoCard, BingoMode, CardLayout } from '../types'
import { AVOID_ZONES, CANVAS_HEIGHT, CANVAS_WIDTH, TEMPLATE_IMAGE_SRC, rectsOverlap } from '../data/templateGuide'
import { drawBackground, drawBingoCard } from '../utils/canvasCompose'
import { AdjustControls } from './AdjustControls'
import { MODE_MAP } from '../data/modes'

const DEFAULT_LAYOUT: CardLayout = { xPct: 0.25, yPct: 0.15, sizePct: 0.5 }

export function Composer({
  card,
  mode,
  onRegenerate,
  onBack,
}: {
  card: BingoCard
  mode: BingoMode
  onRegenerate: () => void
  onBack: () => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const displayRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null)
  const [bgTransform, setBgTransform] = useState<BackgroundTransform>({ offsetX: 0, offsetY: 0, scale: 1 })
  const [layout, setLayout] = useState<CardLayout>(DEFAULT_LAYOUT)
  const [showGuide, setShowGuide] = useState(true)
  const [dragging, setDragging] = useState(false)
  const lastPointer = useRef<{ x: number; y: number } | null>(null)

  const modeInfo = MODE_MAP[mode]

  const cardRectFraction = {
    x: layout.xPct,
    y: layout.yPct,
    w: layout.sizePct,
    h: layout.sizePct * (CANVAS_WIDTH / CANVAS_HEIGHT),
  }
  const overlapping = AVOID_ZONES.some((zone) => rectsOverlap(cardRectFraction, zone))

  // 再描画
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    drawBackground(ctx, CANVAS_WIDTH, CANVAS_HEIGHT, bgImage, bgTransform)
    drawBingoCard(ctx, CANVAS_WIDTH, CANVAS_HEIGHT, card, layout)
  }, [bgImage, bgTransform, card, layout])

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        setBgImage(img)
        setBgTransform({ offsetX: 0, offsetY: 0, scale: 1 })
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  }

  const getScaleFactor = () => {
    const el = displayRef.current
    if (!el) return 1
    return CANVAS_WIDTH / el.clientWidth
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (!bgImage) return
    setDragging(true)
    lastPointer.current = { x: e.clientX, y: e.clientY }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || !lastPointer.current) return
    const scaleFactor = getScaleFactor()
    const dx = (e.clientX - lastPointer.current.x) * scaleFactor
    const dy = (e.clientY - lastPointer.current.y) * scaleFactor
    lastPointer.current = { x: e.clientX, y: e.clientY }
    setBgTransform((prev) => ({ ...prev, offsetX: prev.offsetX + dx, offsetY: prev.offsetY + dy }))
  }

  const onPointerUp = () => {
    setDragging(false)
    lastPointer.current = null
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `配信ビンゴ_${modeInfo.shortName}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-10">
      <button onClick={onBack} className="text-sm text-stage-line hover:text-paper">
        ← 条件を変更する
      </button>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-stage-line">
          <span className="font-bold text-paper">{modeInfo.name}</span> / {card.condition.size}×{card.condition.size}
        </p>
        <button
          onClick={onRegenerate}
          className="rounded-full border-2 border-stage-line px-4 py-2 text-sm text-paper hover:border-paper/60"
        >
          🔁 ビンゴを作り直す
        </button>
      </div>

      <div
        ref={displayRef}
        className="relative mt-5 w-full touch-none select-none overflow-hidden rounded-ticket border-2 border-stage-line bg-stage-panel"
        style={{ aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="h-full w-full"
        />
        {showGuide && (
          <img
            src={TEMPLATE_IMAGE_SRC}
            alt="配信画面UIの配置ガイド（ダウンロード画像には含まれません）"
            className="pointer-events-none absolute inset-0 h-full w-full opacity-40 mix-blend-screen"
          />
        )}
        {!bgImage && (
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 px-8 text-center text-sm text-paper/50">
            背景画像をアップロードすると、ここにプレビューされます
          </div>
        )}
      </div>

      {overlapping && (
        <p className="mt-3 rounded-lg bg-gold/15 px-4 py-2 text-sm text-gold">
          ⚠ ビンゴカードが配信画面のアイコンや枠と重なっている可能性があります。位置やサイズを調整してください。
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="rounded-full bg-teal px-5 py-2.5 text-sm font-bold text-stage-ink"
        >
          背景画像をアップロード
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
          }}
        />
        <label className="flex items-center gap-2 text-sm text-stage-line">
          <input
            type="checkbox"
            checked={showGuide}
            onChange={(e) => setShowGuide(e.target.checked)}
            className="h-4 w-4 accent-teal"
          />
          配置ガイドを表示
        </label>
      </div>

      {bgImage && (
        <div className="mt-4">
          <p className="mb-2 text-xs text-stage-line">背景の拡大・縮小</p>
          <input
            type="range"
            min={1}
            max={2.5}
            step={0.01}
            value={bgTransform.scale}
            onChange={(e) =>
              setBgTransform((prev) => ({ ...prev, scale: parseFloat(e.target.value) }))
            }
            className="h-2 w-full max-w-xs accent-teal"
          />
        </div>
      )}

      <div className="mt-8 rounded-ticket border-2 border-dashed border-stage-line p-5">
        <AdjustControls layout={layout} setLayout={setLayout} />
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleDownload}
          className="rounded-full bg-coral px-8 py-3 font-bold text-stage-ink"
        >
          配信用背景としてダウンロード
        </button>
      </div>
    </section>
  )
}
