"use client"

interface ApiRequestOptions {
  url: string
  method: string
  headers?: Record<string, string>
  body?: any
}

interface ApiResponse {
  status: number
  statusText: string
  headers: Record<string, string>
  body: string
}

// API 요청 보내기
export async function sendApiRequest(options: ApiRequestOptions): Promise<ApiResponse> {
  try {
    // URL 유효성 검사
    if (!options.url) {
      throw new Error("URL이 필요합니다")
    }

    // URL이 http:// 또는 https://로 시작하는지 확인
    const url = options.url.startsWith("http") ? options.url : `https://${options.url}`

    // fetch 요청 옵션 구성
    const fetchOptions: RequestInit = {
      method: options.method,
      headers: options.headers,
      // GET 또는 HEAD 요청에는 body를 포함하지 않음
      ...(options.method !== "GET" && options.method !== "HEAD" && options.body
        ? { body: getRequestBody(options.body, options.headers) }
        : {}),
    }

    // CORS 오류 방지를 위한 모드 설정
    // 실제 프로덕션 환경에서는 CORS 프록시 서버를 사용하는 것이 좋습니다
    fetchOptions.mode = "cors"

    // 요청 보내기
    const response = await fetch(url, fetchOptions)

    // 응답 헤더 처리
    const headers: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      headers[key] = value
    })

    // 응답 본문 처리
    let responseBody = ""
    try {
      // 텍스트로 응답 본문 읽기
      responseBody = await response.text()
    } catch (e) {
      console.error("응답 본문 읽기 오류:", e)
      responseBody = "응답 본문을 읽을 수 없습니다"
    }

    return {
      status: response.status,
      statusText: response.statusText,
      headers,
      body: responseBody,
    }
  } catch (error) {
    console.error("API 요청 오류:", error)
    throw error
  }
}

export function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

// 요청 본문 처리
function getRequestBody(body: any, headers?: Record<string, string>): string | FormData | URLSearchParams {
  // 이미 FormData 또는 URLSearchParams인 경우 그대로 반환
  if (body instanceof FormData || body instanceof URLSearchParams) {
    return body
  }

  // 객체인 경우 JSON 문자열로 변환
  if (typeof body === "object" && body !== null) {
    return JSON.stringify(body)
  }

  // 그 외의 경우 문자열로 변환
  return String(body)
}

// JSON 포맷팅
export function formatJson(jsonString: string): string {
  try {
    const parsed = JSON.parse(jsonString)
    return JSON.stringify(parsed, null, 2)
  } catch (e) {
    return jsonString
  }
}

