import type { NetaItem } from '../types'

/**
 * 「曲名ビンゴ兄さん」のお題プール
 * 曲名（タイトル）に含まれる文字・特徴をテーマにした選曲チャレンジ
 */

const TITLE_CHARS = [
  '愛',
  '恋',
  '君',
  '僕',
  '私',
  '夢',
  '星',
  '空',
  '海',
  '涙',
  '笑',
  '花',
  '雨',
  '光',
  '夜',
  '青',
  '赤',
  '白',
  '黒',
  '花',
  '風',
  '雪',
  '月',
  '未来',
  '世界',
  '時代',
  '物語',
  '運命',
]

const TITLE_TEMPLATES = [
  (c: string) => `曲名に「${c}」の文字が入っている曲を歌う`,
  (c: string) => `曲名が「${c}」から始まる曲を歌う`,
]

const STRUCTURE_ITEMS: { text: string; category: string }[] = [
  { text: '曲名がひらがなだけの曲を歌う', category: '表記' },
  { text: '曲名がカタカナだけの曲を歌う', category: '表記' },
  { text: '曲名に漢字が入っている曲を歌う', category: '表記' },
  { text: '曲名がすべて英語（アルファベット）の曲を歌う', category: '表記' },
  { text: '曲名に英語と日本語が混ざっている曲を歌う', category: '表記' },
  { text: '曲名に数字が入っている曲を歌う', category: '表記' },
  { text: '曲名に「！」または「？」が入っている曲を歌う', category: '表記' },
  { text: '曲名に「・」（中黒）が入っている曲を歌う', category: '表記' },
  { text: '曲名が一文字の曲を歌う', category: '文字数' },
  { text: '曲名がカッコ（）付きの曲を歌う', category: '表記' },
  { text: '曲名に「Love」または「愛」に関する単語が入っている曲を歌う', category: 'テーマ' },
  { text: '曲名に色の名前が入っている曲を歌う', category: 'テーマ' },
  { text: '曲名に季節の名前が入っている曲を歌う', category: 'テーマ' },
  { text: '曲名に地名が入っている曲を歌う', category: 'テーマ' },
  { text: '曲名に人の名前が入っている曲を歌う', category: 'テーマ' },
  { text: '曲名が疑問文になっている曲を歌う', category: '表記' },
  { text: '曲名が一番長いと思う曲を歌う', category: '文字数' },
  { text: '曲名を見ただけで内容が想像できる曲を歌う', category: 'テーマ' },
  { text: '曲名に自分の推し・好きなものと関連する単語が入っている曲を歌う', category: '自己紹介' },
  { text: '曲名の意味を説明してから歌う', category: '自己紹介' },
]

const LENGTHS = [1, 2, 3, 4, 5, 6, 7, 8]
const LENGTH_ITEMS: { text: string; category: string }[] = LENGTHS.map((n) => ({
  text: `曲名がちょうど${n}文字の曲を歌う`,
  category: '文字数',
}))

function buildTitlePool(): NetaItem[] {
  const items: NetaItem[] = []
  let idx = 0

  for (const c of TITLE_CHARS) {
    for (const tpl of TITLE_TEMPLATES) {
      items.push({ id: `title-${idx++}`, mode: 'title', category: '文字', text: tpl(c) })
    }
  }

  for (const { text, category } of [...STRUCTURE_ITEMS, ...LENGTH_ITEMS]) {
    items.push({ id: `title-${idx++}`, mode: 'title', category, text })
  }

  return items
}

export const titleBingoPool: NetaItem[] = buildTitlePool()
