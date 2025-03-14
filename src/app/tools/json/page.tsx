import JSONFormatter from "@/components/JSONFormatter/JSONFormatter"

export const metadata = {
  title: "JSON 포매터 & 뷰어 | 웹 도구 모음",
  description: "JSON을 보기 좋게 정리하고 편집할 수 있는 도구입니다",
}

export default function JsonFormatterPage() {
  return (
    <div className="container mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">JSON 포매터 & 뷰어</h1>
        <p className="text-muted-foreground">JSON을 보기 좋게 정리하고 편집할 수 있는 도구입니다</p>
      </div>
      <JSONFormatter />
    </div>
  )
}

