"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ArrowRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface SwipeToPayButtonProps {
  amount: number
  currency?: string
  onPaymentComplete?: () => void
  className?: string
}

export default function SwipeToPayButton({
  amount,
  currency = "₩",
  onPaymentComplete,
  className,
}: SwipeToPayButtonProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)

  // 트랙 너비 계산
  const getTrackWidth = () => {
    if (!trackRef.current) return 0
    return trackRef.current.getBoundingClientRect().width
  }

  // 썸 너비 계산
  const getThumbWidth = () => {
    if (!thumbRef.current) return 56
    return thumbRef.current.getBoundingClientRect().width
  }

  // 최대 드래그 거리 계산
  const getMaxPosition = () => {
    return getTrackWidth() - getThumbWidth()
  }

  // 드래그 시작 처리
  const handleDragStart = (clientX: number) => {
    if (isComplete) return
    setIsDragging(true)
  }

  // 드래그 중 처리
  const handleDrag = (clientX: number) => {
    if (!isDragging || isComplete || !trackRef.current) return

    const trackRect = trackRef.current.getBoundingClientRect()
    const newPosition = Math.max(0, Math.min(getMaxPosition(), clientX - trackRect.left - getThumbWidth() / 2))

    setPosition(newPosition)

    // 완료 상태 체크 (90% 이상 드래그 시 완료)
    if (newPosition > getMaxPosition() * 0.9) {
      completePayment()
    }
  }

  // 드래그 종료 처리
  const handleDragEnd = () => {
    if (!isDragging) return
    setIsDragging(false)

    // 완료되지 않았으면 처음 위치로 돌아감
    if (!isComplete) {
      setPosition(0)
    }
  }

  // 결제 완료 처리
  const completePayment = () => {
    setIsComplete(true)
    setPosition(getMaxPosition())
    if (onPaymentComplete) {
      onPaymentComplete()
    }
  }

  // 마우스 이벤트 핸들러
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleDragStart(e.clientX)
  }

  const handleMouseMove = (e: MouseEvent) => {
    handleDrag(e.clientX)
  }

  const handleMouseUp = () => {
    handleDragEnd()
  }

  // 터치 이벤트 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault() // 스크롤 방지
    handleDragStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches && e.touches[0]) {
      handleDrag(e.touches[0].clientX)
    }
  }

  const handleTouchEnd = () => {
    handleDragEnd()
  }

  // 이벤트 리스너 등록 및 해제
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
      window.addEventListener("touchmove", handleTouchMove)
      window.addEventListener("touchend", handleTouchEnd)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isDragging])

  // 컴포넌트 크기 변경 시 위치 조정
  useEffect(() => {
    const handleResize = () => {
      if (isComplete) {
        setPosition(getMaxPosition())
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [isComplete])

  // 진행률 계산 (0-1 사이 값)
  const progress = getMaxPosition() > 0 ? position / getMaxPosition() : 0

  return (
    <div className={cn("w-full max-w-md", className)}>
      <div className="mb-2 text-center font-medium">
        {currency} {amount.toLocaleString()}
      </div>
      <div
        ref={trackRef}
        className={cn(
          "relative h-14 w-full overflow-hidden rounded-full bg-gray-100 shadow-inner transition-colors duration-300",
          isComplete ? "bg-green-100" : "bg-gray-100",
        )}
      >
        {/* 진행 배경 */}
        <div
          className={cn(
            "absolute left-0 top-0 h-full rounded-full bg-green-500/20",
            isDragging ? "transition-none" : "transition-all duration-150",
          )}
          style={{ width: `${position + getThumbWidth()}px` }}
        />

        {/* 썸 버튼 */}
        <div
          ref={thumbRef}
          className={cn(
            "absolute left-0 top-0 flex h-14 w-14 cursor-grab items-center justify-center rounded-full bg-green-500 text-white shadow-md transition-transform duration-100",
            isDragging ? "scale-105" : "",
            isComplete ? "scale-105" : "",
          )}
          style={{
            transform: `translateX(${position}px)`,
            transition: isDragging ? "none" : "transform 0.2s ease-out",
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {isComplete ? <Check className="h-6 w-6" /> : <ArrowRight className="h-6 w-6" />}
        </div>

        {/* 텍스트 */}
        <div className="pointer-events-none absolute left-0 top-0 flex h-full w-full items-center justify-center text-sm font-medium text-gray-500">
          {isComplete ? (
            <span className="ml-14 text-green-600 transition-opacity duration-300">결제 완료</span>
          ) : (
            <span className={cn("transition-opacity duration-300", progress > 0.3 ? "opacity-0" : "opacity-100")}>
              밀어서 결제하기
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
