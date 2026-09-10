/**
 * ColorSing公式のカスタム背景テンプレート画像をもとにした、
 * 配信画面UIが重なるエリア（丸・四角のアイコン/枠）の概算定義。
 * すべてキャンバス全体(1536x2048基準)に対する比率(0〜1)で表現する。
 */
export interface AvoidZone {
  label: string
  x: number
  y: number
  w: number
  h: number
}

export const TEMPLATE_IMAGE_SRC = '/colorsing-template.png'

/** 出力画像の基準サイズ（ColorSing推奨） */
export const CANVAS_WIDTH = 1536
export const CANVAS_HEIGHT = 2048

export const AVOID_ZONES: AvoidZone[] = [
  { label: 'アバター・名前欄', x: 0.17, y: 0.045, w: 0.32, h: 0.06 },
  { label: '上部アイコン列', x: 0.49, y: 0.045, w: 0.35, h: 0.075 },
  { label: 'カメラ/コンテンツ枠', x: 0.2, y: 0.555, w: 0.53, h: 0.29 },
  { label: '右側アイコン列', x: 0.74, y: 0.68, w: 0.09, h: 0.15 },
  { label: 'チャット入力欄', x: 0.19, y: 0.915, w: 0.4, h: 0.05 },
  { label: '下部アイコン列', x: 0.58, y: 0.905, w: 0.25, h: 0.06 },
]

/** 矩形同士が重なっているか判定 */
export function rectsOverlap(
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number }
): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
}
