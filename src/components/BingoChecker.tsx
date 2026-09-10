import { useEffect, useRef, useState } from 'react'
import type { BackgroundTransform, BingoCard, BingoMode, CardLayout } from '../types'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../data/templateGuide'
import { drawBackground, drawBingoCard, hitTestCell } from '../utils/canvasCompose'
import { exportCanvasImage } from '../utils/exportImage'
import { MODE_MAP } from '../data/modes'

export function BingoChecker({
  card,
  mode,
  bgImage,
  bgTransform,
  layout,
  onToggleCell,
  onResetChecks,
  onBackToAdjust,
}: {
  card: BingoCard
  mode: BingoMode
  bgImage: HTMLImageElement | null
  bgTransform: BackgroundTransform
  layout: CardLayout
  onToggleCell: (key: string) => void
  onResetChecks: () => void
  onBackToAdjust: () => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle')

  const modeInfo = MODE_MAP[mode]
  const total = card.cells.length
  const doneCount = card.cells.filter((c) => c.checked).length

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    drawBackground(ctx, CANVAS_WIDTH, CANVAS_HEIGHT, bgImage, bgTransform)
    drawBingoCard(ctx, CANVAS_WIDTH, CANVAS_HEIGHT, card, layout)
  }, [bgImage, bgTransform, card, layout])

  const handleTap = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scaleX = CANVAS_WIDTH / rect.width
    const scaleY = CANVAS_HEIGHT / rect.height
    const px = (e.clientX - rect.left) * scaleX
    const py = (e.clientY - rect.top) * scaleY

    const index = hitTestCell(px, py, CANVAS_WIDTH, CANVAS_HEIGHT, layout, card.condition.size)
    if (index === null) return
    const cell = card.cells[index]
    if (cell) onToggleCell(cell.key)
  }

  const handleSave = async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    setSaveStatus('saving')
    const result = await exportCanvasImage(canvas, `配信ビンゴ_${modeInfo.shortName}.png`)
    setSaveStatus(result === 'failed' ? 'error' : 'done')
    window.setTimeout(() => setSaveStatus('idle'), 2500)
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={onBackToAdjust} className="text-sm text-stage-line hover:text-paper">
          ← 配置を編集し直す
        </button>
        <span className="rounded-full bg-stage-panel px-4 py-1.5 text-sm text-paper">
          {doneCount} / {total} マス達成
        </span>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-stage-line">
        歌い終わったら、マスをタップしてチェックを付けてください。配置調整はロック中なので、誤操作でずれる心配はありません。
      </p>

      <div
        className="relative mt-5 w-full overflow-hidden rounded-ticket border-2 border-stage-line bg-stage-panel"
        style={{ aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}` }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="h-full w-full cursor-pointer"
          onClick={handleTap}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          className="rounded-full bg-coral px-8 py-3 font-bold text-stage-ink disabled:opacity-60"
        >
          {saveStatus === 'saving' ? '保存中…' : '📥 今の状態を保存する'}
        </button>
        <button
          onClick={onResetChecks}
          className="rounded-full border-2 border-stage-line px-5 py-2.5 text-sm text-paper hover:border-paper/60"
        >
          チェックをリセット
        </button>
      </div>

      {saveStatus === 'done' && (
        <p className="mt-3 text-sm text-teal">保存（または共有）を開始しました。写真アプリ等をご確認ください。</p>
      )}
      {saveStatus === 'error' && (
        <p className="mt-3 text-sm text-coral">
          保存に失敗しました。画面を長押しして「画像を保存」を試すか、もう一度お試しください。
        </p>
      )}
    </section>
  )
}
