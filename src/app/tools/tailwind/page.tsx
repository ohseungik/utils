import CssToTailwind from "@/components/Tailwind/Tailwind"

export const metadata = {
  title: "CSS → Tailwind 변환기 | 웹 도구 모음",
  description: "CSS 코드를 Tailwind CSS 클래스로 변환해주는 도구입니다",
}

export default function CssToTailwindPage() {
  return (
    <div className="container mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">CSS → Tailwind 변환기</h1>
        <p className="text-muted-foreground">CSS 코드를 Tailwind CSS 클래스로 변환해주는 도구입니다</p>
      </div>
      <CssToTailwind />
    </div>
  )
}
