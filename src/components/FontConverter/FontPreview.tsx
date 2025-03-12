"use client"

interface FontPreviewProps {
  text: string
  fontFamily: string
  fontSize: number
}

export default function FontPreview({ text, fontFamily, fontSize }: FontPreviewProps) {
  if (!fontFamily) {
    return (
      <div className="border rounded-lg p-6 text-center h-[200px] flex flex-col items-center justify-center text-muted-foreground">
        <p>폰트를 업로드하면 미리보기가 표시됩니다</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg p-6 min-h-[200px]">
      <div
        style={{
          fontFamily: `"${fontFamily}", sans-serif`,
          fontSize: `${fontSize}px`,
          lineHeight: 1.5,
        }}
      >
        {text}
      </div>
    </div>
  )
}

