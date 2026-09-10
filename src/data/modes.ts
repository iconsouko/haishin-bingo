import type { BingoMode, ModeInfo, NetaItem } from '../types'
import { lyricsBingoPool } from './lyricsBingo'
import { titleBingoPool } from './titleBingo'
import { themeBingoPool } from './themeBingo'

export const MODE_LIST: ModeInfo[] = [
  {
    id: 'lyrics',
    name: '歌詞ビンゴくん',
    shortName: 'くん',
    tagline: '歌詞のワードで選曲',
    description: '歌詞に出てくる言葉やフレーズをお題にしたビンゴ。「歌詞に◯◯が出てくる曲」を歌おう。',
    color: 'coral',
  },
  {
    id: 'title',
    name: '曲名ビンゴ兄さん',
    shortName: '兄さん',
    tagline: '曲名の文字で選曲',
    description: '曲名に含まれる文字や特徴をお題にしたビンゴ。「曲名に◯◯が入っている曲」を歌おう。',
    color: 'teal',
  },
  {
    id: 'theme',
    name: '歌ネタビンゴ姉さん',
    shortName: '姉さん',
    tagline: 'ジャンル・時代で選曲',
    description: '「曲名が4文字」「平成ヒットソング」など、幅広いお題で選曲を楽しむビンゴ。',
    color: 'gold',
  },
]

export const MODE_MAP: Record<BingoMode, ModeInfo> = Object.fromEntries(
  MODE_LIST.map((m) => [m.id, m])
) as Record<BingoMode, ModeInfo>

export const POOLS: Record<BingoMode, NetaItem[]> = {
  lyrics: lyricsBingoPool,
  title: titleBingoPool,
  theme: themeBingoPool,
}
