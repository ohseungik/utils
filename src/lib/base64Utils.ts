"use client"

interface Base64Options {
  encoding?: string
  urlSafe?: boolean
  lineBreaks?: boolean
}

/**
 * 텍스트를 Base64로 인코딩합니다.
 */
export async function encodeBase64(text: string, options: Base64Options = {}): Promise<string> {
  const { encoding = "utf-8", urlSafe = false, lineBreaks = false } = options

  try {
    // 텍스트를 Base64로 인코딩
    let base64

    // TextEncoder를 사용하여 UTF-8 인코딩 처리
    if (encoding === "utf-8") {
      const encoder = new TextEncoder()
      const data = encoder.encode(text)
      base64 = btoa(String.fromCharCode(...data))
    } else {
      // 다른 인코딩의 경우 기본 btoa 사용
      base64 = btoa(text)
    }

    // URL 안전 Base64로 변환
    if (urlSafe) {
      base64 = base64.replace(/\+/g, "-").replace(/\//g, "_")
    }

    // 76자마다 줄바꿈 추가
    if (lineBreaks) {
      const chunks = []
      for (let i = 0; i < base64.length; i += 76) {
        chunks.push(base64.substring(i, i + 76))
      }
      base64 = chunks.join("\n")
    }

    return base64
  } catch (error) {
    console.error("Base64 인코딩 오류:", error)
    throw new Error("텍스트를 Base64로 인코딩하는 중 오류가 발생했습니다")
  }
}

/**
 * Base64를 텍스트로 디코딩합니다.
 */
export async function decodeBase64(base64: string, options: Base64Options = {}): Promise<string> {
  const { encoding = "utf-8", urlSafe = false } = options

  try {
    // URL 안전 Base64 처리
    if (urlSafe) {
      base64 = base64.replace(/-/g, "+").replace(/_/g, "/")
    }

    // 줄바꿈 및 공백 제거
    base64 = base64.replace(/\s/g, "")

    // Base64를 디코딩
    const binaryString = atob(base64)

    // UTF-8 인코딩 처리
    if (encoding === "utf-8") {
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }

      // TextDecoder를 사용하여 UTF-8 디코딩
      const decoder = new TextDecoder(encoding)
      return decoder.decode(bytes)
    }

    // 다른 인코딩의 경우 기본 문자열 반환
    return binaryString
  } catch (error) {
    console.error("Base64 디코딩 오류:", error)
    throw new Error("Base64를 텍스트로 디코딩하는 중 오류가 발생했습니다")
  }
}

/**
 * 문자열이 유효한 Base64 형식인지 확인합니다.
 */
export function isValidBase64(str: string, urlSafe = false): boolean {
  // 줄바꿈 및 공백 제거
  str = str.replace(/\s/g, "")

  // URL 안전 Base64 패턴 또는 일반 Base64 패턴 확인
  const pattern = urlSafe ? /^[-A-Za-z0-9_]*={0,2}$/ : /^[A-Za-z0-9+/]*={0,2}$/

  // 패턴 검사 및 길이가 4의 배수인지 확인 (패딩 포함)
  return pattern.test(str) && (str.length % 4 === 0 || str.length % 4 === 2 || str.length % 4 === 3)
}
