export type BingoMode = 'lyrics' | 'title' | 'theme'

export interface ModeInfo {
  id: BingoMode
  name: string
  shortName: string
  tagline: string
  description: string
  color: 'coral' | 'teal' | 'gold'
}

export interface NetaItem {
  id: string
  mode: BingoMode
  category: string
  text: string
}

export type GridSize = 3 | 4 | 5

export interface BingoCell {
  key: string
  text: string
  isFree: boolean
}

export interface BingoCondition {
  mode: BingoMode
  size: GridSize
  freeSpace: boolean
}

export interface BingoCard {
  condition: BingoCondition
  cells: BingoCell[]
}

/** 背景に対するビンゴカードの配置（キャンバス全体に対する比率 0〜1） */
export interface CardLayout {
  xPct: number
  yPct: number
  /** キャンバス幅に対するビンゴカード一辺の比率 */
  sizePct: number
}

export interface BackgroundTransform {
  /** キャンバス中心からのオフセット(px, キャンバス座標系) */
  offsetX: number
  offsetY: number
  /** cover表示を基準とした追加倍率 */
  scale: number
}
