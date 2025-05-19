import QrCodeGenerator from "@/components/QrCodeGenerator/QrCodeGenerator"
export const metadata = {
  title: "QR코드 생성기 | 웹 도구 모음",
  description: "텍스트나 URL을 QR코드로 변환하여 다운로드할 수 있는 도구입니다",
}

export default function QrCodeGeneratorPage() {
  return (
    <div className="container mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">QR코드 생성기</h1>
        <p className="text-muted-foreground">텍스트나 URL을 QR코드로 변환하여 다운로드할 수 있는 도구입니다</p>
      </div>
      <QrCodeGenerator />
    </div>
  )
}
