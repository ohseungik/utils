import CssMinifier from "@/components/CSSMinifier/CSSMinifier"

export const metadata = {
  title: "CSS 코드 압축기 | 웹 도구 모음",
  description: "CSS 코드를 Minify하고 포맷을 변환하는 기능을 제공합니다",
}

export default function CssMinifierPage() {
  return (
    <div className="container mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">CSS 코드 압축기</h1>
        <p className="text-muted-foreground">CSS 코드를 Minify하고 포맷을 변환하는 도구입니다</p>
      </div>
      <CssMinifier />
    </div>
  )
}

