import { useEffect, useRef, useState } from 'react'
import type { BackgroundTransform, BingoCard, BingoMode, CardLayout } from '../types'
import { AVOID_ZONES, CANVAS_HEIGHT, CANVAS_WIDTH, TEMPLATE_IMAGE_SRC, rectsOverlap } from '../data/templateGuide'
import { clampBackgroundOffset, drawBackground, drawBingoCard } from '../utils/canvasCompose'
import { AdjustControls } from './AdjustControls'
import { MODE_MAP } from '../data/modes'

export function Composer({
  card,
  mode,
  bgImage,
  setBgImage,
  bgTransform,
  setBgTransform,
  layout,
  setLayout,
  onRegenerate,
  onBack,
  onConfirm,
}: {
  card: BingoCard
  mode: BingoMode
  bgImage: HTMLImageElement | null
  setBgImage: (img: HTMLImageElement | null) => void
  bgTransform: BackgroundTransform
  setBgTransform: (updater: (prev: BackgroundTransform) => BackgroundTransform) => void
  layout: CardLayout
  setLayout: (updater: (prev: CardLayout) => CardLayout) => void
  onRegenerate: () => void
  onBack: () => void
  onConfirm: () => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const displayRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
        setBgTransform(() => ({ offsetX: 0, offsetY: 0, scale: 1 }))
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
    if (!dragging || !lastPointer.current || !bgImage) return
    const scaleFactor = getScaleFactor()
    const dx = (e.clientX - lastPointer.current.x) * scaleFactor
    const dy = (e.clientY - lastPointer.current.y) * scaleFactor
    lastPointer.current = { x: e.clientX, y: e.clientY }
    setBgTransform((prev) => {
      const next = { ...prev, offsetX: prev.offsetX + dx, offsetY: prev.offsetY + dy }
      // 背景が枠からはみ出して隙間ができないよう常にクランプする
      return clampBackgroundOffset(bgImage, CANVAS_WIDTH, CANVAS_HEIGHT, next)
    })
  }

  const onPointerUp = () => {
    setDragging(false)
    lastPointer.current = null
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

      {/* プレビュー：スワイプでのページスクロールを妨げないよう、
          縦方向のパン(pan-y)はブラウザ標準の挙動に任せる。
          背景ドラッグはpointer移動で処理する（画像未設定時はドラッグ無効）。 */}
      <div
        ref={displayRef}
        className="relative mt-5 w-full select-none overflow-hidden rounded-ticket border-2 border-stage-line bg-stage-panel"
        style={{ aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}`, touchAction: 'pan-y' }}
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

      {/* プレビューのすぐ下に配置調整UIを置き、見ながら操作できるようにする */}
      <div className="mt-4 rounded-ticket border-2 border-dashed border-stage-line p-5">
        <AdjustControls layout={layout} setLayout={setLayout} />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
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

      <div className="mt-8 flex justify-end">
        <button
          onClick={onConfirm}
          className="rounded-full bg-coral px-8 py-3 font-bold text-stage-ink"
        >
          ビンゴ開始！
        </button>
      </div>
    </section>
  )
}
