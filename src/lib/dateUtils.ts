import { formatRelative } from "date-fns"
import { ko } from "date-fns/locale"

// 타임스탬프 타입
export type TimestampType = "seconds" | "milliseconds"

// 날짜 형식
export type DateFormat = "iso" | "locale" | "relative" | string

// 타임존 옵션 타입
export interface TimezoneOption {
  value: string
  label: string
}

// 현재 타임스탬프 가져오기
export function getCurrentTimestamp() {
  const now = new Date()
  return {
    seconds: Math.floor(now.getTime() / 1000).toString(),
    milliseconds: now.getTime().toString(),
  }
}

// 타임스탬프를 날짜로 변환
export function formatTimestamp(
  timestamp: number,
  type: TimestampType,
  timezone: string,
  dateFormat: DateFormat,
): string {
  try {
    // 타임스탬프를 밀리초로 변환
    const timestampMs = type === "seconds" ? timestamp * 1000 : timestamp

    // 날짜 객체 생성
    let date: Date

    if (timezone === "utc") {
      // UTC 시간으로 변환
      date = new Date(timestampMs)
    } else if (timezone === "local") {
      // 로컬 시간으로 변환
      date = new Date(timestampMs)
    } else {
      // 특정 타임존으로 변환
      const dateUTC = new Date(timestampMs)
      const dateString = dateUTC.toLocaleString("en-US", { timeZone: timezone })
      date = new Date(dateString)
    }

    // 날짜 형식에 따라 포맷팅
    if (dateFormat === "iso") {
      return date.toISOString()
    } else if (dateFormat === "locale") {
      return date.toLocaleString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: timezone === "local" ? undefined : timezone,
      })
    } else if (dateFormat === "relative") {
      return formatRelative(date, new Date(), { locale: ko })
    }

    return date.toString()
  } catch (error) {
    console.error("날짜 변환 오류:", error)
    return "변환 오류"
  }
}

// 타임존 옵션 가져오기
export function getTimezoneOptions(): TimezoneOption[] {
  return [
    { value: "Asia/Seoul", label: "서울 (GMT+9)" },
    { value: "Asia/Tokyo", label: "도쿄 (GMT+9)" },
    { value: "America/New_York", label: "뉴욕 (GMT-5/GMT-4)" },
    { value: "America/Los_Angeles", label: "로스앤젤레스 (GMT-8/GMT-7)" },
    { value: "Europe/London", label: "런던 (GMT+0/GMT+1)" },
    { value: "Europe/Paris", label: "파리 (GMT+1/GMT+2)" },
    { value: "Australia/Sydney", label: "시드니 (GMT+10/GMT+11)" },
  ]
}
