import APITester from "@/components/APITester/APITester"

export const metadata = {
  title: "API 테스트 도구 | 웹 도구 모음",
  description: "Fetch 또는 Axios 기반 API 테스트 도구입니다",
}

export default function ApiTesterPage() {
  return (
    <div className="container mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">API 테스트 도구</h1>
        <p className="text-muted-foreground">
          Fetch 또는 Axios 기반으로 API 요청을 테스트하고 응답을 확인할 수 있는 도구입니다
        </p>
      </div>
      <APITester />
    </div>
  )
}

