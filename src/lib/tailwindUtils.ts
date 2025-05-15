"use client"

interface ConversionOptions {
  includeComments: boolean
  sortClasses: boolean
  useShorthand: boolean
}

// CSS를 Tailwind로 변환하는 함수
export async function convertCssToTailwind(css: string, options: ConversionOptions): Promise<string> {
  try {
    // CSS 파싱
    const rules = parseCssRules(css)

    // 각 규칙을 Tailwind 클래스로 변환
    const tailwindClasses = rules.map((rule) => {
      const selector = rule.selector
      const declarations = rule.declarations

      // 선택자에서 클래스 또는 ID 추출
      const elementType = extractElementType(selector)

      // 선언을 Tailwind 클래스로 변환
      const classes = declarations
        .map((declaration) => {
          const property = declaration.property
          const value = declaration.value

          // CSS 속성을 Tailwind 클래스로 매핑
          const tailwindClass = mapCssToTailwind(property, value, options)

          // 주석 추가 (옵션에 따라)
          if (options.includeComments && tailwindClass) {
            return `${tailwindClass} /* ${property}: ${value} */`
          }

          return tailwindClass
        })
        .filter(Boolean) // 빈 값 제거

      // 클래스 정렬 (옵션에 따라)
      if (options.sortClasses) {
        sortTailwindClasses(classes)
      }

      // HTML 요소와 클래스 결합
      return formatTailwindOutput(elementType, classes.join(" "))
    })

    return tailwindClasses.join("\n\n")
  } catch (error) {
    console.error("CSS to Tailwind 변환 오류:", error)
    throw new Error("CSS를 Tailwind로 변환하는 중 오류가 발생했습니다")
  }
}

// CSS 규칙 파싱
function parseCssRules(
  css: string,
): Array<{ selector: string; declarations: Array<{ property: string; value: string }> }> {
  const rules: Array<{ selector: string; declarations: Array<{ property: string; value: string }> }> = []

  // 주석 제거
  css = css.replace(/\/\*[\s\S]*?\*\//g, "")

  // 규칙 블록 추출
  const ruleBlocks = css.match(/{[^{}]*}/g)
  if (!ruleBlocks) return rules

  // 선택자와 선언 분리
  let index = 0
  css.replace(/{[^{}]*}/g, () => {
    const block = ruleBlocks[index++]
    const declarations = block.substring(1, block.length - 1).trim()

    // 선택자 찾기
    const selectorEnd = css.indexOf(block)
    let selectorStart = css.lastIndexOf("}", selectorEnd)
    if (selectorStart === -1) selectorStart = 0
    else selectorStart += 1

    const selector = css.substring(selectorStart, selectorEnd).trim()

    // 선언 파싱
    const declarationList: Array<{ property: string; value: string }> = []
    declarations.split(";").forEach((declaration) => {
      const parts = declaration.split(":")
      if (parts.length >= 2) {
        const property = parts[0].trim()
        const value = parts.slice(1).join(":").trim()
        if (property && value) {
          declarationList.push({ property, value })
        }
      }
    })

    if (selector && declarationList.length > 0) {
      rules.push({ selector, declarations: declarationList })
    }

    return ""
  })

  return rules
}

// 선택자에서 요소 타입 추출
function extractElementType(selector: string): string {
  // 기본 HTML 요소 목록
  const htmlElements = [
    "div",
    "span",
    "p",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "a",
    "button",
    "input",
    "img",
    "ul",
    "ol",
    "li",
    "table",
    "form",
    "section",
    "article",
    "header",
    "footer",
    "nav",
    "main",
    "aside",
  ]

  // 선택자에서 요소 추출
  const parts = selector.split(/[.#\s:[\]>+~]/)
  const element = parts.find((part) => htmlElements.includes(part)) || "div"

  return element
}

// CSS 속성을 Tailwind 클래스로 매핑
function mapCssToTailwind(property: string, value: string, options: ConversionOptions): string {
  // 속성별 매핑 함수
  switch (property) {
    case "display":
      return mapDisplay(value)
    case "margin":
      return mapMargin(value, options.useShorthand)
    case "padding":
      return mapPadding(value, options.useShorthand)
    case "width":
      return mapWidth(value)
    case "height":
      return mapHeight(value)
    case "color":
      return mapColor(value)
    case "background-color":
      return mapBackgroundColor(value)
    case "font-size":
      return mapFontSize(value)
    case "font-weight":
      return mapFontWeight(value)
    case "text-align":
      return mapTextAlign(value)
    case "border":
      return mapBorder(value)
    case "border-radius":
      return mapBorderRadius(value)
    case "flex":
    case "flex-direction":
    case "flex-wrap":
    case "flex-grow":
    case "flex-shrink":
      return mapFlex(property, value)
    case "justify-content":
      return mapJustifyContent(value)
    case "align-items":
      return mapAlignItems(value)
    case "position":
      return mapPosition(value)
    case "top":
    case "right":
    case "bottom":
    case "left":
      return mapInset(property, value)
    case "box-shadow":
      return mapBoxShadow(value)
    case "overflow":
      return mapOverflow(value)
    case "z-index":
      return mapZIndex(value)
    default:
      // 지원되지 않는 속성은 빈 문자열 반환
      return ""
  }
}

// 디스플레이 속성 매핑
function mapDisplay(value: string): string {
  const displayMap: Record<string, string> = {
    block: "block",
    inline: "inline",
    "inline-block": "inline-block",
    flex: "flex",
    "inline-flex": "inline-flex",
    grid: "grid",
    "inline-grid": "inline-grid",
    none: "hidden",
  }

  return displayMap[value] || ""
}

// 마진 속성 매핑
function mapMargin(value: string, useShorthand: boolean): string {
  return mapSpacing("m", value, useShorthand)
}

// 패딩 속성 매핑
function mapPadding(value: string, useShorthand: boolean): string {
  return mapSpacing("p", value, useShorthand)
}

// 간격(마진, 패딩) 매핑 공통 함수
function mapSpacing(prefix: string, value: string, useShorthand: boolean): string {
  const values = value.split(/\s+/)

  // 값을 픽셀 단위로 변환
  const pxValues = values.map((v) => {
    if (v.endsWith("px")) {
      return Number.parseInt(v)
    } else if (v.endsWith("rem")) {
      return Number.parseInt(v) * 16
    } else if (v === "0") {
      return 0
    }
    return null
  })

  // 픽셀 값을 Tailwind 스페이싱으로 변환
  const twValues = pxValues.map((px) => {
    if (px === null) return null
    if (px === 0) return "0"
    if (px === 4) return "1"
    if (px === 8) return "2"
    if (px === 12) return "3"
    if (px === 16) return "4"
    if (px === 20) return "5"
    if (px === 24) return "6"
    if (px === 32) return "8"
    if (px === 40) return "10"
    if (px === 48) return "12"
    if (px === 64) return "16"
    if (px === 80) return "20"
    if (px === 96) return "24"
    return px / 4 // 근사값
  })

  // 값 개수에 따라 클래스 생성
  if (values.length === 1) {
    return `${prefix}-${twValues[0]}`
  } else if (values.length === 2) {
    if (useShorthand && twValues[0] === twValues[1]) {
      return `${prefix}-${twValues[0]}`
    }
    return `${prefix}y-${twValues[0]} ${prefix}x-${twValues[1]}`
  } else if (values.length === 4) {
    if (useShorthand && twValues[0] === twValues[2] && twValues[1] === twValues[3]) {
      return `${prefix}y-${twValues[0]} ${prefix}x-${twValues[1]}`
    }
    return `${prefix}t-${twValues[0]} ${prefix}r-${twValues[1]} ${prefix}b-${twValues[2]} ${prefix}l-${twValues[3]}`
  }

  return ""
}

// 너비 속성 매핑
function mapWidth(value: string): string {
  if (value === "100%") return "w-full"
  if (value === "50%") return "w-1/2"
  if (value === "33.33%" || value === "33.333%") return "w-1/3"
  if (value === "66.66%" || value === "66.666%") return "w-2/3"
  if (value === "25%") return "w-1/4"
  if (value === "75%") return "w-3/4"
  if (value === "20%") return "w-1/5"
  if (value === "40%") return "w-2/5"
  if (value === "60%") return "w-3/5"
  if (value === "80%") return "w-4/5"

  if (value.endsWith("px")) {
    const px = Number.parseInt(value)
    if (px === 0) return "w-0"
    if (px === 1) return "w-px"
    if (px === 4) return "w-1"
    if (px === 8) return "w-2"
    if (px === 12) return "w-3"
    if (px === 16) return "w-4"
    if (px === 20) return "w-5"
    if (px === 24) return "w-6"
    if (px === 32) return "w-8"
    if (px === 40) return "w-10"
    if (px === 48) return "w-12"
    if (px === 64) return "w-16"
    if (px === 80) return "w-20"
    if (px === 96) return "w-24"
    return `w-[${value}]`
  }

  if (value === "auto") return "w-auto"

  return `w-[${value}]`
}

// 높이 속성 매핑
function mapHeight(value: string): string {
  if (value === "100%") return "h-full"
  if (value === "50%") return "h-1/2"
  if (value === "33.33%" || value === "33.333%") return "h-1/3"
  if (value === "66.66%" || value === "66.666%") return "h-2/3"
  if (value === "25%") return "h-1/4"
  if (value === "75%") return "h-3/4"

  if (value.endsWith("px")) {
    const px = Number.parseInt(value)
    if (px === 0) return "h-0"
    if (px === 1) return "h-px"
    if (px === 4) return "h-1"
    if (px === 8) return "h-2"
    if (px === 12) return "h-3"
    if (px === 16) return "h-4"
    if (px === 20) return "h-5"
    if (px === 24) return "h-6"
    if (px === 32) return "h-8"
    if (px === 40) return "h-10"
    if (px === 48) return "h-12"
    if (px === 64) return "h-16"
    if (px === 80) return "h-20"
    if (px === 96) return "h-24"
    return `h-[${value}]`
  }

  if (value === "auto") return "h-auto"

  return `h-[${value}]`
}

// 색상 속성 매핑
function mapColor(value: string): string {
  // 기본 색상 매핑
  const colorMap: Record<string, string> = {
    black: "text-black",
    white: "text-white",
    red: "text-red-500",
    blue: "text-blue-500",
    green: "text-green-500",
    yellow: "text-yellow-500",
    purple: "text-purple-500",
    pink: "text-pink-500",
    gray: "text-gray-500",
    transparent: "text-transparent",
  }

  if (colorMap[value]) {
    return colorMap[value]
  }

  // HEX 색상 처리
  if (value.startsWith("#")) {
    // 일반적인 색상 매핑 시도
    if (value === "#000000" || value === "#000") return "text-black"
    if (value === "#ffffff" || value === "#fff") return "text-white"
    if (value === "#ff0000" || value === "#f00") return "text-red-500"
    if (value === "#00ff00" || value === "#0f0") return "text-green-500"
    if (value === "#0000ff" || value === "#00f") return "text-blue-500"

    // 매핑되지 않는 색상은 임의값 사용
    return `text-[${value}]`
  }

  // RGB/RGBA 색상 처리
  if (value.startsWith("rgb")) {
    return `text-[${value}]`
  }

  return `text-[${value}]`
}

// 배경색 속성 매핑
function mapBackgroundColor(value: string): string {
  // 기본 색상 매핑
  const colorMap: Record<string, string> = {
    black: "bg-black",
    white: "bg-white",
    red: "bg-red-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
    pink: "bg-pink-500",
    gray: "bg-gray-500",
    transparent: "bg-transparent",
  }

  if (colorMap[value]) {
    return colorMap[value]
  }

  // HEX 색상 처리
  if (value.startsWith("#")) {
    // 일반적인 색상 매핑 시도
    if (value === "#000000" || value === "#000") return "bg-black"
    if (value === "#ffffff" || value === "#fff") return "bg-white"
    if (value === "#ff0000" || value === "#f00") return "bg-red-500"
    if (value === "#00ff00" || value === "#0f0") return "bg-green-500"
    if (value === "#0000ff" || value === "#00f") return "bg-blue-500"

    // 매핑되지 않는 색상은 임의값 사용
    return `bg-[${value}]`
  }

  // RGB/RGBA 색상 처리
  if (value.startsWith("rgb")) {
    return `bg-[${value}]`
  }

  return `bg-[${value}]`
}

// 폰트 크기 속성 매핑
function mapFontSize(value: string): string {
  if (value.endsWith("px")) {
    const px = Number.parseInt(value)
    if (px === 12) return "text-xs"
    if (px === 14) return "text-sm"
    if (px === 16) return "text-base"
    if (px === 18) return "text-lg"
    if (px === 20) return "text-xl"
    if (px === 24) return "text-2xl"
    if (px === 30) return "text-3xl"
    if (px === 36) return "text-4xl"
    if (px === 48) return "text-5xl"
    if (px === 60) return "text-6xl"
    if (px === 72) return "text-7xl"
    if (px === 96) return "text-8xl"
    if (px === 128) return "text-9xl"
    return `text-[${value}]`
  }

  if (value.endsWith("rem")) {
    const rem = Number.parseFloat(value)
    if (rem === 0.75) return "text-xs"
    if (rem === 0.875) return "text-sm"
    if (rem === 1) return "text-base"
    if (rem === 1.125) return "text-lg"
    if (rem === 1.25) return "text-xl"
    if (rem === 1.5) return "text-2xl"
    if (rem === 1.875) return "text-3xl"
    if (rem === 2.25) return "text-4xl"
    if (rem === 3) return "text-5xl"
    if (rem === 3.75) return "text-6xl"
    if (rem === 4.5) return "text-7xl"
    if (rem === 6) return "text-8xl"
    if (rem === 8) return "text-9xl"
    return `text-[${value}]`
  }

  return `text-[${value}]`
}

// 폰트 두께 속성 매핑
function mapFontWeight(value: string): string {
  const weightMap: Record<string, string> = {
    "100": "font-thin",
    "200": "font-extralight",
    "300": "font-light",
    "400": "font-normal",
    "500": "font-medium",
    "600": "font-semibold",
    "700": "font-bold",
    "800": "font-extrabold",
    "900": "font-black",
    thin: "font-thin",
    extralight: "font-extralight",
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    extrabold: "font-extrabold",
    black: "font-black",
  }

  return weightMap[value] || `font-[${value}]`
}

// 텍스트 정렬 속성 매핑
function mapTextAlign(value: string): string {
  const alignMap: Record<string, string> = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify",
  }

  return alignMap[value] || ""
}

// 테두리 속성 매핑
function mapBorder(value: string): string {
  // 간단한 테두리 처리
  if (value === "none") return "border-0"
  if (value === "1px solid black") return "border border-black"
  if (value === "1px solid") return "border"
  if (value === "2px solid") return "border-2"
  if (value === "4px solid") return "border-4"
  if (value === "8px solid") return "border-8"

  // 복잡한 테두리는 개별 속성으로 분리 필요
  return "border"
}

// 테두리 반경 속성 매핑
function mapBorderRadius(value: string): string {
  if (value.endsWith("px")) {
    const px = Number.parseInt(value)
    if (px === 0) return "rounded-none"
    if (px === 2) return "rounded-sm"
    if (px === 4) return "rounded"
    if (px === 6) return "rounded-md"
    if (px === 8) return "rounded-lg"
    if (px === 12) return "rounded-xl"
    if (px === 16) return "rounded-2xl"
    if (px === 24) return "rounded-3xl"
    if (px === 9999) return "rounded-full"
    return `rounded-[${value}]`
  }

  if (value === "50%") return "rounded-full"

  return `rounded-[${value}]`
}

// Flex 속성 매핑
function mapFlex(property: string, value: string): string {
  if (property === "flex-direction") {
    if (value === "row") return "flex-row"
    if (value === "column") return "flex-col"
    if (value === "row-reverse") return "flex-row-reverse"
    if (value === "column-reverse") return "flex-col-reverse"
  }

  if (property === "flex-wrap") {
    if (value === "wrap") return "flex-wrap"
    if (value === "nowrap") return "flex-nowrap"
    if (value === "wrap-reverse") return "flex-wrap-reverse"
  }

  if (property === "flex-grow") {
    if (value === "1") return "flex-grow"
    if (value === "0") return "flex-grow-0"
    return `flex-grow-[${value}]`
  }

  if (property === "flex-shrink") {
    if (value === "1") return "flex-shrink"
    if (value === "0") return "flex-shrink-0"
    return `flex-shrink-[${value}]`
  }

  if (property === "flex") {
    if (value === "1") return "flex-1"
    if (value === "auto") return "flex-auto"
    if (value === "initial") return "flex-initial"
    if (value === "none") return "flex-none"
    return `flex-[${value}]`
  }

  return ""
}

// Justify Content 속성 매핑
function mapJustifyContent(value: string): string {
  const justifyMap: Record<string, string> = {
    "flex-start": "justify-start",
    "flex-end": "justify-end",
    center: "justify-center",
    "space-between": "justify-between",
    "space-around": "justify-around",
    "space-evenly": "justify-evenly",
  }

  return justifyMap[value] || ""
}

// Align Items 속성 매핑
function mapAlignItems(value: string): string {
  const alignMap: Record<string, string> = {
    "flex-start": "items-start",
    "flex-end": "items-end",
    center: "items-center",
    baseline: "items-baseline",
    stretch: "items-stretch",
  }

  return alignMap[value] || ""
}

// Position 속성 매핑
function mapPosition(value: string): string {
  const positionMap: Record<string, string> = {
    static: "static",
    relative: "relative",
    absolute: "absolute",
    fixed: "fixed",
    sticky: "sticky",
  }

  return positionMap[value] || ""
}

// Inset(top, right, bottom, left) 속성 매핑
function mapInset(property: string, value: string): string {
  if (value === "0") {
    if (property === "top") return "top-0"
    if (property === "right") return "right-0"
    if (property === "bottom") return "bottom-0"
    if (property === "left") return "left-0"
  }

  if (value === "auto") {
    if (property === "top") return "top-auto"
    if (property === "right") return "right-auto"
    if (property === "bottom") return "bottom-auto"
    if (property === "left") return "left-auto"
  }

  if (value.endsWith("px")) {
    const px = Number.parseInt(value)
    const prefix =
      property === "top" ? "top" : property === "right" ? "right" : property === "bottom" ? "bottom" : "left"

    if (px === 0) return `${prefix}-0`
    if (px === 1) return `${prefix}-px`
    if (px === 4) return `${prefix}-1`
    if (px === 8) return `${prefix}-2`
    if (px === 12) return `${prefix}-3`
    if (px === 16) return `${prefix}-4`
    if (px === 20) return `${prefix}-5`
    if (px === 24) return `${prefix}-6`
    if (px === 32) return `${prefix}-8`
    if (px === 40) return `${prefix}-10`
    if (px === 48) return `${prefix}-12`
    if (px === 64) return `${prefix}-16`
    if (px === 80) return `${prefix}-20`
    if (px === 96) return `${prefix}-24`
    return `${prefix}-[${value}]`
  }

  if (value.endsWith("%")) {
    if (value === "50%") {
      if (property === "top") return "top-1/2"
      if (property === "right") return "right-1/2"
      if (property === "bottom") return "bottom-1/2"
      if (property === "left") return "left-1/2"
    }
    if (value === "100%") {
      if (property === "top") return "top-full"
      if (property === "right") return "right-full"
      if (property === "bottom") return "bottom-full"
      if (property === "left") return "left-full"
    }
  }

  const prefix = property === "top" ? "top" : property === "right" ? "right" : property === "bottom" ? "bottom" : "left"

  return `${prefix}-[${value}]`
}

// Box Shadow 속성 매핑
function mapBoxShadow(value: string): string {
  if (value === "none") return "shadow-none"
  if (value.includes("0 1px 3px") || value.includes("0 1px 2px")) return "shadow-sm"
  if (value.includes("0 4px 6px") || value.includes("0 1px 3px")) return "shadow"
  if (value.includes("0 10px 15px") || value.includes("0 4px 6px")) return "shadow-md"
  if (value.includes("0 20px 25px") || value.includes("0 10px 15px")) return "shadow-lg"
  if (value.includes("0 25px 50px")) return "shadow-xl"
  if (value.includes("0 35px 60px")) return "shadow-2xl"
  if (value.includes("inset")) return "shadow-inner"

  return "shadow"
}

// Overflow 속성 매핑
function mapOverflow(value: string): string {
  const overflowMap: Record<string, string> = {
    visible: "overflow-visible",
    hidden: "overflow-hidden",
    clip: "overflow-clip",
    scroll: "overflow-scroll",
    auto: "overflow-auto",
  }

  return overflowMap[value] || ""
}

// Z-Index 속성 매핑
function mapZIndex(value: string): string {
  const zIndexMap: Record<string, string> = {
    "0": "z-0",
    "10": "z-10",
    "20": "z-20",
    "30": "z-30",
    "40": "z-40",
    "50": "z-50",
    auto: "z-auto",
  }

  return zIndexMap[value] || `z-[${value}]`
}

// Tailwind 클래스 정렬
function sortTailwindClasses(classes: string[]): void {
  // 클래스 카테고리 정의
  const categories = {
    layout: ["container", "block", "inline", "flex", "grid", "hidden"],
    spacing: ["p-", "m-", "space-"],
    sizing: ["w-", "h-", "min-", "max-"],
    typography: ["text-", "font-", "tracking-", "leading-"],
    backgrounds: ["bg-"],
    borders: ["border", "rounded"],
    effects: ["shadow", "opacity"],
    transitions: ["transition", "duration", "ease"],
    interactivity: ["cursor-", "pointer-events-"],
    positioning: ["static", "fixed", "absolute", "relative", "sticky"],
  }

  // 클래스를 카테고리별로 정렬
  classes.sort((a, b) => {
    const aClass = a.split(" ")[0] // 주석이 있는 경우 클래스만 추출
    const bClass = b.split(" ")[0]

    // 각 클래스의 카테고리 찾기
    let aCat = "other"
    let bCat = "other"

    for (const [category, prefixes] of Object.entries(categories)) {
      if (prefixes.some((prefix) => aClass.startsWith(prefix))) {
        aCat = category
      }
      if (prefixes.some((prefix) => bClass.startsWith(prefix))) {
        bCat = category
      }
    }

    // 카테고리 순서에 따라 정렬
    const catOrder = [
      "layout",
      "positioning",
      "spacing",
      "sizing",
      "typography",
      "backgrounds",
      "borders",
      "effects",
      "transitions",
      "interactivity",
      "other",
    ]
    return catOrder.indexOf(aCat) - catOrder.indexOf(bCat)
  })
}

// Tailwind 출력 형식 지정
function formatTailwindOutput(elementType: string, classes: string): string {
  if (!classes) return ""
  return `<${elementType} class="${classes}">\n  <!-- 내용 -->\n</${elementType}>`
}
