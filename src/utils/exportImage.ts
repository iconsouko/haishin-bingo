/**
 * Canvasの内容を画像として保存する。
 * iPhoneのSafari/Chromeでは data URL や download属性だけでは
 * 保存できない・別タブで開くだけになるケースがあるため、
 * Web Share API（共有シート経由で「画像を保存」）を優先的に使い、
 * 使えない環境では Blob + <a download> にフォールバックする。
 */
export async function exportCanvasImage(
  canvas: HTMLCanvasElement,
  filename: string
): Promise<'shared' | 'downloaded' | 'failed'> {
  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b), 'image/png')
  )

  if (!blob) return 'failed'

  const nav = navigator as Navigator & {
    canShare?: (data?: ShareData) => boolean
    share?: (data: ShareData) => Promise<void>
  }

  if (nav.canShare && nav.share) {
    try {
      const file = new File([blob], filename, { type: 'image/png' })
      if (nav.canShare({ files: [file] })) {
        await nav.share({ files: [file] })
        return 'shared'
      }
    } catch (err) {
      // ユーザーが共有をキャンセルした場合などは、フォールバックに進む
    }
  }

  try {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.setTimeout(() => URL.revokeObjectURL(url), 8000)
    return 'downloaded'
  } catch (err) {
    return 'failed'
  }
}
