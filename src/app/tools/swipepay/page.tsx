import SwipePay from "@/components/SwipePay/SwipePay"

export const metadata = {
  title: "SwipePay 테스트 | 웹 도구 모음",
  description: "밀어서 결제하기 모듈 테스트",
}

export default function SwipePayPage() {
  return (
    <div className="container mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">밀어서 결제하기</h1>
      </div>

      <SwipePay />
    </div>
  )
}
