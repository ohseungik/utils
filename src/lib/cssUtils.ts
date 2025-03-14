"use client"

interface MinifyOptions {
  removeComments: boolean
  removeWhitespace: boolean
  collapseDeclarations: boolean
}

// CSS 코드 압축 함수
export async function minifyCss(css: string, options: MinifyOptions): Promise<string> {
  try {
    let result = css

    // 주석 제거
    if (options.removeComments) {
      result = result.replace(/\/\*[\s\S]*?\*\//g, "")
    }

    // 공백 제거
    if (options.removeWhitespace) {
      // 줄바꿈, 탭, 여러 공백을 하나의 공백으로 변경
      result = result.replace(/\s+/g, " ")
      // 선택자와 { 사이의 공백 제거
      result = result.replace(/\s*{\s*/g, "{")
      // } 앞뒤의 공백 제거
      result = result.replace(/\s*}\s*/g, "}")
      // : 앞뒤의 공백 제거
      result = result.replace(/\s*:\s*/g, ":")
      // ; 앞뒤의 공백 제거
      result = result.replace(/\s*;\s*/g, ";")
      // , 앞뒤의 공백 제거
      result = result.replace(/\s*,\s*/g, ",")
      // 마지막 세미콜론 제거
      result = result.replace(/;\}/g, "}")
    }

    // 선언 축소
    if (options.collapseDeclarations) {
      // 0px, 0em 등을 0으로 변경
      result = result.replace(/(\s|:)0(px|em|rem|%|in|cm|mm|pc|pt|ex|vh|vw|vmin|vmax)/g, "$10")
      // #ffffff를 #fff로 변경 (가능한 경우)
      result = result.replace(/#([a-f0-9])\1([a-f0-9])\2([a-f0-9])\3/gi, "#$1$2$3")
    }

    return result
  } catch (error) {
    console.error("CSS 압축 오류:", error)
    throw new Error("CSS 코드를 압축하는 중 오류가 발생했습니다.")
  }
}

// CSS 코드 포맷팅 함수
export async function beautifyCss(css: string): Promise<string> {
  try {
    // 먼저 기본 정리
    let result = css.trim()

    // 이미 압축된 CSS인 경우를 대비해 기본 공백 추가
    result = result
      .replace(/\{/g, " {\n")
      .replace(/\}/g, "}\n")
      .replace(/;/g, ";\n")
      .replace(/;\s*\n/g, ";\n")
      .replace(/,\s*/g, ", ")
      .replace(/\n\s*\n/g, "\n")

    // 들여쓰기 처리
    const lines = result.split("\n")
    let formatted = ""
    let indentLevel = 0

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim()

      // 빈 줄 건너뛰기
      if (!line) continue

      // 닫는 중괄호가 있으면 들여쓰기 레벨 감소
      if (line.includes("}")) {
        indentLevel = Math.max(0, indentLevel - 1)
      }

      // 현재 줄에 들여쓰기 적용 (닫는 중괄호 제외)
      if (line !== "}") {
        line = "  ".repeat(indentLevel) + line
      } else {
        line = "  ".repeat(indentLevel) + line
      }

      // 결과에 줄 추가
      formatted += line + "\n"

      // 여는 중괄호가 있으면 다음 줄부터 들여쓰기 레벨 증가
      if (line.includes("{")) {
        indentLevel++
      }
    }

    // 미디어 쿼리 및 중첩 규칙 처리 개선
    formatted = formatted
      // 미디어 쿼리 앞뒤 공백 추가
      .replace(/@media\s*\(/g, "@media (")
      // 속성과 값 사이 공백 추가
      .replace(/:\s*/g, ": ")
      // 선택자 사이 공백 추가
      .replace(/,\n/g, ",\n")
      // 여러 선택자 처리
      .replace(/,\s*\n\s*/g, ", ")

    // 주석 처리 개선
    formatted = formatted.replace(/\/\*\s*/g, "/* ").replace(/\s*\*\//g, " */")

    // 최종 정리
    formatted =
      formatted
        // 연속된 빈 줄 제거
        .replace(/\n\s*\n/g, "\n")
        // 마지막 줄바꿈 정리
        .trim() + "\n"

    return formatted
  } catch (error) {
    console.error("CSS 포맷팅 오류:", error)
    throw new Error("CSS 코드를 포맷팅하는 중 오류가 발생했습니다.")
  }
}

