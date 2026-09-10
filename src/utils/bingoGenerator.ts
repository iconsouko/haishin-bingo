import type { BingoCard, BingoCell, BingoCondition, BingoMode, NetaItem } from '../types'
import { POOLS } from '../data/modes'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * モードごとに「山札（残りネタ）」を保持し、使い切るまで同じネタが再び
 * 出ないようにする。山札が尽きたら、プール全体をシャッフルして補充する。
 * （ページを開いている間はメモリ上に保持される）
 */
const decks: Partial<Record<BingoMode, NetaItem[]>> = {}

function drawItems(mode: BingoMode, count: number): NetaItem[] {
  const pool = POOLS[mode]
  let deck = decks[mode] ?? []

  const drawn: NetaItem[] = []
  while (drawn.length < count) {
    if (deck.length === 0) {
      deck = shuffle(pool)
    }
    const item = deck.pop()
    if (item) drawn.push(item)
  }
  decks[mode] = deck
  return drawn
}

export function generateBingoCard(condition: BingoCondition): BingoCard {
  const { mode, size, freeSpace } = condition
  const totalCells = size * size
  const hasFree = freeSpace && size % 2 === 1
  const centerIndex = hasFree ? Math.floor(totalCells / 2) : -1
  const needed = hasFree ? totalCells - 1 : totalCells

  const items = drawItems(mode, needed)

  const cells: BingoCell[] = []
  let cursor = 0
  for (let i = 0; i < totalCells; i++) {
    if (i === centerIndex) {
      cells.push({ key: `free-${i}`, text: '自由選曲', isFree: true })
    } else {
      const item = items[cursor++]
      cells.push({ key: item.id, text: item.text, isFree: false })
    }
  }

  return { condition, cells }
}
