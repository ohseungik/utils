"use client"

import { useState } from "react"
import { toast } from "sonner"
import SwipeToPayButton from "@/components/SwipePay/SwipePayButton"
import { Check } from "lucide-react"

export default function PaymentDemo() {
  const [isPaid, setIsPaid] = useState(false)

  const handlePaymentComplete = () => {
    toast("₩25,000 결제가 성공적으로 처리되었습니다.")
    setIsPaid(true)
  }

  const resetPayment = () => {
    setIsPaid(false)
  }

  return (
    <div className="flex min-h-[300px] w-full flex-col items-center justify-center space-y-6 rounded-lg border p-6 bg-white shadow-sm">
      <h2 className="text-2xl font-bold">결제 데모</h2>

      {!isPaid ? (
        <>
          <div className="w-full max-w-md rounded-lg bg-gray-50 p-4 shadow-sm">
            <div className="mb-2 flex justify-between">
              <span className="text-gray-600">상품:</span>
              <span className="font-medium">프리미엄 구독</span>
            </div>
            <div className="mb-4 flex justify-between">
              <span className="text-gray-600">금액:</span>
              <span className="font-medium">₩25,000</span>
            </div>
            <div className="h-px w-full bg-gray-200" />
          </div>

          <SwipeToPayButton amount={25000} onPaymentComplete={handlePaymentComplete} />
          <p className="text-sm text-gray-500 mt-2">버튼을 오른쪽으로 밀어서 결제를 완료하세요</p>
        </>
      ) : (
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-medium">결제가 완료되었습니다</h3>
          <p className="text-gray-500">₩25,000이 성공적으로 결제되었습니다.</p>
          <button
            onClick={resetPayment}
            className="mt-4 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
          >
            다시 시도
          </button>
        </div>
      )}
    </div>
  )
}
