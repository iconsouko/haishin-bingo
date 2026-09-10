import type { NetaItem } from '../types'

/**
 * 「歌ネタビンゴ姉さん」のお題プール
 * ジャンル・時代・シチュエーションなど、曲名や歌詞に限らない選曲チャレンジ
 */

const THEMES: { text: string; category: string }[] = [
  // 時代
  { text: '昭和の名曲を歌う', category: '時代' },
  { text: '平成ヒットソングを歌う', category: '時代' },
  { text: '令和ヒットソングを歌う', category: '時代' },
  { text: '10年以上前に流行った曲を歌う', category: '時代' },
  { text: '今年リリースされた曲を歌う', category: '時代' },
  { text: '自分が生まれる前に発売された曲を歌う', category: '時代' },
  { text: '懐メロを歌う', category: '時代' },
  // ジャンル
  { text: 'アニメソングを歌う', category: 'ジャンル' },
  { text: 'ボーカロイド曲を歌う', category: 'ジャンル' },
  { text: '洋楽を歌う', category: 'ジャンル' },
  { text: 'アイドルソングを歌う', category: 'ジャンル' },
  { text: 'バラードを歌う', category: 'ジャンル' },
  { text: 'ロックソングを歌う', category: 'ジャンル' },
  { text: 'ポップスを歌う', category: 'ジャンル' },
  { text: 'ゲーム音楽を歌う', category: 'ジャンル' },
  { text: 'ミュージカルソングを歌う', category: 'ジャンル' },
  { text: 'ジャズ・スタンダードを歌う', category: 'ジャンル' },
  { text: 'ディズニーソングを歌う', category: 'ジャンル' },
  { text: 'ジブリソングを歌う', category: 'ジャンル' },
  { text: 'V系（ヴィジュアル系）の曲を歌う', category: 'ジャンル' },
  { text: 'シティポップを歌う', category: 'ジャンル' },
  // シーン・用途
  { text: 'CMソングを歌う', category: '用途' },
  { text: 'ドラマ主題歌を歌う', category: '用途' },
  { text: '朝ドラ主題歌を歌う', category: '用途' },
  { text: '応援ソングを歌う', category: '用途' },
  { text: '卒業ソングを歌う', category: '用途' },
  { text: 'クリスマスソングを歌う', category: '用途' },
  { text: '結婚式で流れそうな曲を歌う', category: '用途' },
  { text: '運動会・体育祭で流れそうな曲を歌う', category: '用途' },
  { text: 'カラオケの定番曲を歌う', category: '用途' },
  { text: '一発ギャグ的な持ちネタソングを歌う', category: '用途' },
  // 季節
  { text: '夏うたを歌う', category: '季節' },
  { text: '冬うたを歌う', category: '季節' },
  { text: '春うたを歌う', category: '季節' },
  { text: '秋うたを歌う', category: '季節' },
  // 感情・シチュエーション
  { text: '失恋ソングを歌う', category: 'テーマ' },
  { text: '恋愛ソングを歌う', category: 'テーマ' },
  { text: '元気が出る曲を歌う', category: 'テーマ' },
  { text: '泣ける曲を歌う', category: 'テーマ' },
  { text: '踊れる曲を歌う', category: 'テーマ' },
  { text: '眠くなるくらい落ち着く曲を歌う', category: 'テーマ' },
  { text: '友情がテーマの曲を歌う', category: 'テーマ' },
  { text: '家族がテーマの曲を歌う', category: 'テーマ' },
  // 自己紹介・リクエスト系
  { text: '自分のデビュー配信で歌った曲を歌う', category: '自己紹介' },
  { text: '自分の十八番（おはこ）を歌う', category: '自己紹介' },
  { text: '最近ハマっている曲を歌う', category: '自己紹介' },
  { text: '初めて覚えた曲を歌う', category: '自己紹介' },
  { text: 'カラオケで一番歌う曲を歌う', category: '自己紹介' },
  { text: '視聴者からリクエストされた曲を歌う', category: 'リクエスト' },
  { text: 'コメント欄の多数決で決めた曲を歌う', category: 'リクエスト' },
  { text: '他のライバーとよく被る曲を歌う', category: 'リクエスト' },
  { text: '英語混じりの曲を歌う', category: '表現' },
  { text: '高音が印象的な曲を歌う', category: '表現' },
  { text: 'ラップパートがある曲を歌う', category: '表現' },
  { text: 'デュエット曲を一人二役で歌う', category: '表現' },
  { text: 'アカペラパートを作って歌う', category: '表現' },
  { text: '普段歌わないジャンルに挑戦する', category: '挑戦' },
  { text: '高難易度で有名な曲に挑戦する', category: '挑戦' },
  { text: '振り付き（ダンスあり）で歌う', category: '挑戦' },
]

const TITLE_LENGTHS = [2, 3, 4, 5, 6]
const LENGTH_ITEMS: { text: string; category: string }[] = TITLE_LENGTHS.map((n) => ({
  text: `曲名がちょうど${n}文字の曲を歌う`,
  category: '文字数',
}))

function buildThemePool(): NetaItem[] {
  const items: NetaItem[] = []
  let idx = 0
  for (const { text, category } of [...THEMES, ...LENGTH_ITEMS]) {
    items.push({ id: `theme-${idx++}`, mode: 'theme', category, text })
  }
  return items
}

export const themeBingoPool: NetaItem[] = buildThemePool()
