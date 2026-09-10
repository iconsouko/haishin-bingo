import type { BackgroundTransform, BingoCard, CardLayout } from '../types'

const MODE_COLORS: Record<string, { base: string; free: string; border: string; text: string }> = {
  lyrics: { base: 'rgba(255,111,89,0.93)', free: 'rgba(245,185,66,0.96)', border: '#FF6F59', text: '#1E1B29' },
  title: { base: 'rgba(47,182,166,0.93)', free: 'rgba(245,185,66,0.96)', border: '#2FB6A6', text: '#1E1B29' },
  theme: { base: 'rgba(245,185,66,0.93)', free: 'rgba(255,111,89,0.96)', border: '#F5B942', text: '#1E1B29' },
}

/** 日本語混じりのテキストを、指定幅に収まるよう1文字単位で折り返す */
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = []
  let current = ''
  for (const ch of text) {
    const test = current + ch
    if (ctx.measureText(test).width > maxWidth && current.length > 0) {
      lines.push(current)
      current = ch
    } else {
      current = test
    }
  }
  if (current) lines.push(current)
  return lines
}

/** 背景画像をcover表示＋オフセット/倍率で描画する（未設定時はダークグラデーション） */
export function drawBackground(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  image: HTMLImageElement | null,
  transform: BackgroundTransform
) {
  ctx.save()
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)

  if (!image) {
    const grad = ctx.createLinearGradient(0, 0, 0, canvasHeight)
    grad.addColorStop(0, '#1D1B29')
    grad.addColorStop(1, '#14131C')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
    ctx.restore()
    return
  }

  const baseScale = Math.max(canvasWidth / image.width, canvasHeight / image.height)
  const scale = baseScale * transform.scale
  const drawWidth = image.width * scale
  const drawHeight = image.height * scale
  const drawX = (canvasWidth - drawWidth) / 2 + transform.offsetX
  const drawY = (canvasHeight - drawHeight) / 2 + transform.offsetY

  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight)
  ctx.restore()
}

/**
 * ビンゴカードを描画する。
 * layout.xPct / yPct はキャンバス幅・高さそれぞれに対する比率、
 * layout.sizePct はキャンバス幅に対する一辺の比率（正方形）。
 */
export function drawBingoCard(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  card: BingoCard,
  layout: CardLayout
) {
  const { mode, size } = card.condition
  const colors = MODE_COLORS[mode]

  const originX = layout.xPct * canvasWidth
  const originY = layout.yPct * canvasHeight
  const boxSize = layout.sizePct * canvasWidth
  const gap = boxSize * 0.02
  const cellSize = (boxSize - gap * (size + 1)) / size
  const cellRadius = Math.max(4, cellSize * 0.08)

  ctx.save()

  // カード全体の背景パネル（半透明の黒でコントラストを確保）
  ctx.fillStyle = 'rgba(20,19,28,0.35)'
  roundRect(ctx, originX - gap, originY - gap, boxSize + gap * 2, boxSize + gap * 2, cellRadius * 1.4)
  ctx.fill()

  card.cells.forEach((cell, i) => {
    const row = Math.floor(i / size)
    const col = i % size
    const cx = originX + gap + col * (cellSize + gap)
    const cy = originY + gap + row * (cellSize + gap)

    ctx.fillStyle = cell.isFree ? colors.free : colors.base
    roundRect(ctx, cx, cy, cellSize, cellSize, cellRadius)
    ctx.fill()

    ctx.strokeStyle = colors.border
    ctx.lineWidth = Math.max(1, cellSize * 0.015)
    roundRect(ctx, cx, cy, cellSize, cellSize, cellRadius)
    ctx.stroke()

    // テキスト
    ctx.fillStyle = colors.text
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const fontSize = Math.max(10, cellSize * (cell.isFree ? 0.16 : 0.14))
    ctx.font = `700 ${fontSize}px "Zen Kaku Gothic New", sans-serif`

    const padding = cellSize * 0.12
    const maxWidth = cellSize - padding * 2
    let lines = wrapText(ctx, cell.text, maxWidth)

    // 行数が多すぎる場合はフォントを縮小して再計算
    let currentFontSize = fontSize
    while (lines.length * currentFontSize * 1.15 > cellSize - padding * 2 && currentFontSize > 8) {
      currentFontSize -= 1
      ctx.font = `700 ${currentFontSize}px "Zen Kaku Gothic New", sans-serif`
      lines = wrapText(ctx, cell.text, maxWidth)
    }

    const lineHeight = currentFontSize * 1.15
    const totalTextHeight = lines.length * lineHeight
    const startY = cy + cellSize / 2 - totalTextHeight / 2 + lineHeight / 2

    lines.forEach((line, li) => {
      ctx.fillText(line, cx + cellSize / 2, startY + li * lineHeight)
    })
  })

  ctx.restore()
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
}
