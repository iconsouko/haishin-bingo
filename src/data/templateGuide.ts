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

/**
 * 参考資料（配信画面の実測レイアウト）をもとにした回避エリア。
 * 中央の「画像がしっかり映るゾーン」はビンゴカードで最大限使ってよい範囲とし、
 * 上部のアイコン帯・下部のコメント欄／ギフトアイコン帯のみを回避エリアとする。
 */
/**
 * 主要なスマートフォンの画面比率をもとにした「見切れずに表示される範囲」の目安。
 * 出力画像(1536×2048 / 3:4)は多くのスマホ画面より横長のため、上下は画面いっぱいに
 * 表示される一方、左右は機種によって見切れる。ここではやや見切れの大きい機種
 * （Android系の20:9前後）を基準に、左右それぞれこの比率分は見切れる可能性があるとみなす。
 */
export const PHONE_SAFE_MARGIN_X = 0.2

export const AVOID_ZONES: AvoidZone[] = [
  { label: '上部アイコン・名前帯', x: 0.0, y: 0.0, w: 1.0, h: 0.14 },
  { label: '下部：歌詞欄・コメント・入力欄', x: 0.0, y: 0.73, w: 1.0, h: 0.27 },
]

/** 矩形同士が重なっているか判定 */
export function rectsOverlap(
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number }
): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
}
