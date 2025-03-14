"use client"

interface JsonResult {
  isValid: boolean
  error?: string
  formattedJson?: string
  minifiedJson?: string
}

interface FormatOptions {
  indentSize: number
  sortKeys: boolean
}

// JSON 유효성 검사 함수
export function validateJson(jsonString: string): { isValid: boolean; error?: string } {
  try {
    JSON.parse(jsonString)
    return { isValid: true }
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : "유효하지 않은 JSON 형식입니다.",
    }
  }
}

// JSON 포맷팅 함수
export function formatJson(jsonString: string, options: FormatOptions): JsonResult {
  try {
    // JSON 파싱
    const parsedJson = JSON.parse(jsonString)

    // 키 정렬 옵션 처리
    let resultJson = parsedJson
    if (options.sortKeys) {
      resultJson = sortObjectKeys(parsedJson)
    }

    // 들여쓰기 적용하여 문자열로 변환
    const formattedJson = JSON.stringify(resultJson, null, options.indentSize)

    return {
      isValid: true,
      formattedJson,
    }
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : "JSON 포맷팅 중 오류가 발생했습니다.",
    }
  }
}

// JSON 압축 함수
export function minifyJson(jsonString: string): JsonResult {
  try {
    // JSON 파싱 후 공백 없이 문자열로 변환
    const parsedJson = JSON.parse(jsonString)
    const minifiedJson = JSON.stringify(parsedJson)

    return {
      isValid: true,
      minifiedJson,
    }
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : "JSON 압축 중 오류가 발생했습니다.",
    }
  }
}

// 객체의 키를 알파벳 순으로 정렬하는 함수
function sortObjectKeys(obj: Record<string, unknown>): unknown {
  // 배열인 경우 각 항목에 대해 재귀적으로 처리
  if (Array.isArray(obj)) {
    return obj.map((item) => sortObjectKeys(item))
  }

  // 객체가 아니거나 null인 경우 그대로 반환
  if (obj === null || typeof obj !== "object") {
    return obj
  }

  // 키를 알파벳 순으로 정렬하여 새 객체 생성
  const sortedObj: Record<string, unknown> = {}
  const keys = Object.keys(obj).sort()

  for (const key of keys) {
    sortedObj[key] = sortObjectKeys(obj[key] as Record<string, unknown>)
  }

  return sortedObj
}

