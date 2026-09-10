import type { NetaItem } from '../types'

/**
 * 「歌詞ビンゴくん」のお題プール
 * 歌詞の中に出てくる言葉・要素をテーマにした選曲チャレンジ
 * ※実在楽曲の歌詞そのものは使用せず、選曲の切り口となる言葉のみを扱う
 */

const WORDS: { word: string; category: string }[] = [
  // 感情
  ...['愛', '恋', '好き', '涙', '笑顔', '痛み', '幸せ', '寂しさ', '切なさ', '希望', '勇気', '孤独', '不安', '優しさ', '強さ'].map(
    (w) => ({ word: w, category: '感情' })
  ),
  // 自然
  ...['空', '海', '星', '月', '太陽', '風', '雨', '雪', '桜', '花', '虹', '光', '闇', '波', '雲'].map((w) => ({
    word: w,
    category: '自然',
  })),
  // 時間・季節
  ...['明日', '今日', '昨日', '未来', '過去', '永遠', '一瞬', '春', '夏', '秋', '冬', '朝', '夜', '青春', '時間'].map(
    (w) => ({ word: w, category: '時間' })
  ),
  // 人・関係
  ...['君', '僕', '私', 'あなた', '家族', '友達', '仲間', '約束', '思い出', '運命', '奇跡', '出会い', '別れ', '旅', '物語'].map(
    (w) => ({ word: w, category: '人・関係' })
  ),
  // 色
  ...['白', '黒', '赤', '青', '緑', '金色', '虹色'].map((w) => ({ word: w, category: '色' })),
]

const TEMPLATES = [
  (w: string) => `歌詞に「${w}」が出てくる曲を歌う`,
  (w: string) => `曲の中で「${w}」を連呼するパートがある曲を歌う`,
  (w: string) => `サビに「${w}」という言葉が入っている曲を歌う`,
]

const EXTRA: { text: string; category: string }[] = [
  { text: '歌詞が全部英語の曲を歌う', category: '言語' },
  { text: '歌詞に英語のフレーズが混ざっている曲を歌う', category: '言語' },
  { text: '歌詞に方言が入っている曲を歌う', category: '言語' },
  { text: '歌詞に数字が出てくる曲を歌う', category: '数字' },
  { text: '歌詞にカウントダウン(3、2、1など)が出てくる曲を歌う', category: '数字' },
  { text: '歌詞に擬音語・擬態語が入っている曲を歌う', category: '表現' },
  { text: '歌詞に自分の名前と同じ文字が入っている曲を歌う', category: '自己紹介' },
  { text: '歌詞に食べ物の名前が出てくる曲を歌う', category: 'モノ' },
  { text: '歌詞に動物の名前が出てくる曲を歌う', category: 'モノ' },
  { text: '歌詞に地名が出てくる曲を歌う', category: 'モノ' },
  { text: '歌詞に乗り物が出てくる曲を歌う', category: 'モノ' },
  { text: '歌詞が全部ひらがなで書けそうな曲を歌う', category: '言語' },
  { text: '歌詞に「ありがとう」が出てくる曲を歌う', category: '感情' },
  { text: '歌詞に「さよなら」が出てくる曲を歌う', category: '感情' },
  { text: '歌詞に「おはよう」または「こんにちは」が出てくる曲を歌う', category: '感情' },
  { text: '歌詞にセリフのようなパートがある曲を歌う', category: '表現' },
  { text: '歌詞にラップパートがある曲を歌う', category: '表現' },
  { text: '歌詞が全編通してポジティブな曲を歌う', category: '雰囲気' },
  { text: '歌詞が切なく泣ける曲を歌う', category: '雰囲気' },
  { text: '歌詞に問いかけ(〜かな？など)がある曲を歌う', category: '表現' },
  { text: '歌詞の中で一番好きなフレーズがある曲を歌う', category: '自己紹介' },
  { text: '歌詞に季節の行事(誕生日・クリスマスなど)が出てくる曲を歌う', category: '行事' },
  { text: '歌詞に「今夜」「今夜だけ」など夜を示す言葉が出てくる曲を歌う', category: '時間' },
]

function buildLyricsPool(): NetaItem[] {
  const items: NetaItem[] = []
  let idx = 0

  for (const { word, category } of WORDS) {
    for (const tpl of TEMPLATES) {
      items.push({
        id: `lyrics-${idx++}`,
        mode: 'lyrics',
        category,
        text: tpl(word),
      })
    }
  }

  for (const { text, category } of EXTRA) {
    items.push({ id: `lyrics-${idx++}`, mode: 'lyrics', category, text })
  }

  return items
}

export const lyricsBingoPool: NetaItem[] = buildLyricsPool()
