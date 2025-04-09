import Base64Converter from "@/components/Base64Converter/Base64Converter"

export const metadata = {
  title: "Base64 인코딩/디코딩 | 웹 도구 모음",
  description: "텍스트와 파일을 Base64로 인코딩하고 디코딩할 수 있는 도구입니다",
}

export default function Base64ConverterPage() {
  return (
    <div className="container mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Base64 인코딩/디코딩</h1>
        <p className="text-muted-foreground">텍스트와 파일을 Base64로 인코딩하고 디코딩할 수 있는 도구입니다</p>
      </div>
      <Base64Converter />
    </div>
  )
}
