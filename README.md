# 配信ビンゴさん

歌う配信アプリ「ColorSing」のライバー向けに、配信テーマ（選曲ネタ）をビンゴ形式でランダム生成し、配信の背景画像として合成・ダウンロードできるツールです。

## セットアップ

```bash
npm install
npm run dev       # 開発サーバー起動（http://localhost:5173）
npm run build     # 本番ビルド（dist/ に出力）
npm run preview   # ビルド結果をローカル確認
```

Node.js 18以上を推奨します。

## 構成

- `src/data/` … 各モードのお題プール（歌詞ビンゴくん／曲名ビンゴ兄さん／歌ネタビンゴ姉さん）
- `src/utils/bingoGenerator.ts` … 重複しにくいビンゴカード生成ロジック（山札方式）
- `src/utils/canvasCompose.ts` … 背景画像とビンゴカードをCanvasに合成描画
- `src/components/` … 画面（モード選択／条件設定／背景合成・ダウンロード）
- `public/colorsing-template.png` … ColorSing公式の配置ガイド用テンプレート（編集画面にのみ表示、ダウンロード画像には含まれません）

## ネタを追加・編集したい場合

`src/data/lyricsBingo.ts` / `titleBingo.ts` / `themeBingo.ts` 内のリストに文言を追加するだけで、そのままビンゴのお題として反映されます。将来的に管理画面から編集できるようにする場合も、この3ファイルのデータ構造（`id` / `mode` / `category` / `text`）をそのまま流用できます。

## 配置ガイドの回避エリアを調整したい場合

`src/data/templateGuide.ts` の `AVOID_ZONES` に、キャンバス全体（1536×2048）に対する比率（0〜1）で矩形を定義しています。テンプレート画像を差し替えた場合はここも合わせて調整してください。
