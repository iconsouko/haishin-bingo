import { useEffect, useRef, useState } from 'react'
import type { BackgroundTransform, BingoCard, BingoMode, CardLayout } from '../types'
import {
  AVOID_ZONES,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  PHONE_SAFE_MARGIN_X,
  TEMPLATE_IMAGE_SRC,
  rectsOverlap,
} from '../data/templateGuide'
import { clampBackgroundOffset, drawBackground, drawBingoCard, getContainScale } from '../utils/canvasCompose'
import { AdjustControls } from './AdjustControls'
import { MODE_MAP } from '../data/modes'

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

const CARD_MIN_SIZE = 0.28
const CARD_MAX_SIZE = 0.92
const CARD_MOVE_STEP = 0.02
const CARD_SIZE_STEP = 0.01

const BG_SCALE_MIN = 0.3
const BG_SCALE_MAX = 3
const BG_SCALE_STEP = 0.02
const BG_MOVE_STEP = CANVAS_WIDTH * 0.02

export function Composer({
  card,
  mode,
  bgImage,
  setBgImage,
  bgTransform,
  setBgTransform,
  layout,
  setLayout,
  letterboxColor,
  setLetterboxColor,
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
  letterboxColor: 'white' | 'black'
  setLetterboxColor: (c: 'white' | 'black') => void
  onRegenerate: () => void
  onBack: () => void
  onConfirm: () => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const displayRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [showGuide, setShowGuide] = useState(true)
  const [dragging, setDragging] = useState(false)
  const [adjustTarget, setAdjustTarget] = useState<'card' | 'background'>('card')
  const lastPointer = useRef<{ x: number; y: number } | null>(null)

  const modeInfo = MODE_MAP[mode]

  const cardRectFraction = {
    x: layout.xPct,
    y: layout.yPct,
    w: layout.sizePct,
    h: layout.sizePct * (CANVAS_WIDTH / CANVAS_HEIGHT),
  }
  const overlapping = AVOID_ZONES.some((zone) => rectsOverlap(cardRectFraction, zone))

  // 背景アップロード時、対象を自動的に「背景」に切り替える
  useEffect(() => {
    if (bgImage) setAdjustTarget('background')
  }, [bgImage])

  // 再描画
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    drawBackground(ctx, CANVAS_WIDTH, CANVAS_HEIGHT, bgImage, bgTransform, letterboxColor === 'white' ? '#FFFFFF' : '#000000')
    drawBingoCard(ctx, CANVAS_WIDTH, CANVAS_HEIGHT, card, layout)
  }, [bgImage, bgTransform, card, layout, letterboxColor])

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
      return clampBackgroundOffset(bgImage, CANVAS_WIDTH, CANVAS_HEIGHT, next)
    })
  }

  const onPointerUp = () => {
    setDragging(false)
    lastPointer.current = null
  }

  // ── 調整UI（背景／ビンゴカード共有）の実処理 ──
  const moveCard = (dx: number, dy: number) =>
    setLayout((prev) => ({
      ...prev,
      xPct: clamp(prev.xPct + dx, -prev.sizePct * 0.3, 1 - prev.sizePct * 0.7),
      yPct: clamp(prev.yPct + dy, -prev.sizePct * 0.3, 1 - prev.sizePct * 0.7),
    }))

  const resizeCard = (delta: number) =>
    setLayout((prev) => {
      const nextSize = clamp(prev.sizePct + delta, CARD_MIN_SIZE, CARD_MAX_SIZE)
      const centerX = prev.xPct + prev.sizePct / 2
      const centerY = prev.yPct + prev.sizePct / 2
      return { sizePct: nextSize, xPct: centerX - nextSize / 2, yPct: centerY - nextSize / 2 }
    })

  const moveBackground = (dx: number, dy: number) => {
    if (!bgImage) return
    setBgTransform((prev) =>
      clampBackgroundOffset(bgImage, CANVAS_WIDTH, CANVAS_HEIGHT, {
        ...prev,
        offsetX: prev.offsetX + dx,
        offsetY: prev.offsetY + dy,
      })
    )
  }

  const resizeBackground = (delta: number) => {
    if (!bgImage) return
    setBgTransform((prev) => {
      const nextScale = clamp(prev.scale + delta, BG_SCALE_MIN, BG_SCALE_MAX)
      return clampBackgroundOffset(bgImage, CANVAS_WIDTH, CANVAS_HEIGHT, { ...prev, scale: nextScale })
    })
  }

  const handleFitWhole = () => {
    if (!bgImage) return
    const containScale = getContainScale(bgImage, CANVAS_WIDTH, CANVAS_HEIGHT)
    setBgTransform(() => ({ offsetX: 0, offsetY: 0, scale: containScale }))
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-10">
      <button onClick={onBack} className="text-sm text-muted hover:text-paper">
        ← 条件を変更する
      </button>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
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
        {showGuide && (
          <>
            {/* スマホで見切れる可能性がある左右の範囲をシェード＋点線で表示（書き出し画像には含まれない） */}
            <div
              className="pointer-events-none absolute inset-y-0 left-0 bg-black/45"
              style={{ width: `${PHONE_SAFE_MARGIN_X * 100}%`, borderRight: '2px dashed rgba(255,255,255,0.8)' }}
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 bg-black/45"
              style={{ width: `${PHONE_SAFE_MARGIN_X * 100}%`, borderLeft: '2px dashed rgba(255,255,255,0.8)' }}
            />
            <div className="pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 rounded-full bg-stage-ink/80 px-3 py-1 text-[10px] text-paper">
              📱 点線の外側はスマホで見切れる可能性があります
            </div>
          </>
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
        <AdjustControls
          target={adjustTarget}
          onChangeTarget={setAdjustTarget}
          backgroundAvailable={!!bgImage}
          moveStep={adjustTarget === 'background' ? BG_MOVE_STEP : CARD_MOVE_STEP}
          onMove={adjustTarget === 'background' ? moveBackground : moveCard}
          sizeValue={adjustTarget === 'background' ? bgTransform.scale : layout.sizePct}
          sizeMin={adjustTarget === 'background' ? BG_SCALE_MIN : CARD_MIN_SIZE}
          sizeMax={adjustTarget === 'background' ? BG_SCALE_MAX : CARD_MAX_SIZE}
          sizeSliderStep={adjustTarget === 'background' ? 0.01 : 0.005}
          sizeButtonStep={adjustTarget === 'background' ? BG_SCALE_STEP : CARD_SIZE_STEP}
          onResize={adjustTarget === 'background' ? resizeBackground : resizeCard}
        />
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
        <label className="flex items-center gap-2 text-sm text-muted">
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
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <button
            onClick={handleFitWhole}
            className="rounded-full border-2 border-stage-line px-4 py-2 text-xs text-paper hover:border-paper/60"
          >
            📐 画像全体を収める（トリミングなし）
          </button>
          <div className="flex items-center gap-2 text-xs text-muted">
            余白の色：
            <button
              onClick={() => setLetterboxColor('white')}
              aria-label="余白を白にする"
              className={
                'h-6 w-6 rounded-full border-2 bg-white ' +
                (letterboxColor === 'white' ? 'border-coral' : 'border-stage-line')
              }
            />
            <button
              onClick={() => setLetterboxColor('black')}
              aria-label="余白を黒にする"
              className={
                'h-6 w-6 rounded-full border-2 bg-black ' +
                (letterboxColor === 'black' ? 'border-coral' : 'border-stage-line')
              }
            />
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col items-end gap-2">
        <p className="text-xs text-muted">
          完成した背景画像は、次の「④配信中チェック」の画面でダウンロードできます。
        </p>
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
