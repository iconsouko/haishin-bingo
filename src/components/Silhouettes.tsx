/**
 * 各モードのキャラクターを表す、モダンなフラットスタイルの上半身シルエット。
 * fill="currentColor" で親要素のtext色をそのまま使う。
 */

type SilhouetteProps = { className?: string }

/** 歌詞ビンゴくん：キャップを被った少年 */
export function BoyCapSilhouette({ className }: SilhouetteProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor" aria-hidden="true">
      {/* 肩・胴体 */}
      <path d="M20 100 C20 70 32 55 50 55 C68 55 80 70 80 100 Z" />
      {/* 首 */}
      <rect x="44" y="48" width="12" height="12" rx="4" />
      {/* 頭 */}
      <circle cx="50" cy="40" r="17" />
      {/* キャップの山 */}
      <path d="M31 34 C31 19 69 19 69 34 C69 36.5 67 38 64.5 38 L35.5 38 C33 38 31 36.5 31 34 Z" />
      {/* キャップのツバ */}
      <path d="M32 35.5 C25 35.5 19 37.5 14.5 41.5 C13.3 42.6 14.2 44.6 15.8 44.1 C21.5 42.3 27 39.5 33.5 39 Z" />
    </svg>
  )
}

/** 曲名ビンゴ兄さん：青年 */
export function YoungManSilhouette({ className }: SilhouetteProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor" aria-hidden="true">
      {/* 肩・胴体（やや広め） */}
      <path d="M17 100 C17 68 31 51 50 51 C69 51 83 68 83 100 Z" />
      {/* 首 */}
      <rect x="43" y="46" width="14" height="12" rx="4" />
      {/* 頭（少し角ばった輪郭） */}
      <path d="M50 20 C61 20 68 29 68 39 C68 50 60 58 50 58 C40 58 32 50 32 39 C32 29 39 20 50 20 Z" />
      {/* 襟（Vネック風のライン） */}
      <path d="M38 60 L50 69 L62 60 L59 55 L50 62 L41 55 Z" />
    </svg>
  )
}

/** 歌ネタビンゴ姉さん：女性 */
export function WomanSilhouette({ className }: SilhouetteProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor" aria-hidden="true">
      {/* 肩・胴体（なだらかな曲線） */}
      <path d="M23 100 C23 75 34 61 50 61 C66 61 77 75 77 100 Z" />
      {/* 髪（顔まわりを包み込み、肩口まで流れる） */}
      <path d="M28 29 C28 12 72 12 72 29 C72 45 67 61 62 66 C66 50 65 37 50 37 C35 37 34 50 38 66 C33 61 28 45 28 29 Z" />
      {/* 頭 */}
      <circle cx="50" cy="33" r="15" />
    </svg>
  )
}
