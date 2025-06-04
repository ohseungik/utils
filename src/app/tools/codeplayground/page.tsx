import CodePlayground from "@/components/CodePlayground/CodePlayground"

export const metadata = {
  title: "코드 플레이그라운드 - 웹 도구",
  description: "HTML, CSS, React 코드를 실시간으로 테스트하고 미리보기할 수 있는 도구입니다",
}

export default function CodePlaygroundPage() {
  return (
    <div className="container mx-auto max-w-full p-0">
      <CodePlayground />
    </div>
  )
}
