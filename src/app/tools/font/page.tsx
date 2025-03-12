import FontConverter from "@/components/FontConverter/FontConverter"

export const metadata = {
  title: "폰트 프리뷰 및 변환기 | 웹 도구 모음",
  description: "웹 폰트 미리보기 및 다양한 포맷(WOFF, TTF) 변환 기능을 제공합니다",
}

export default function FontConverterPage() {
  return (
    <div className="container mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">폰트 프리뷰 및 변환기</h1>
        <p className="text-muted-foreground">웹 폰트를 미리보고 다양한 포맷으로 변환해보세요</p>
      </div>
      <FontConverter />
    </div>
  )
}

