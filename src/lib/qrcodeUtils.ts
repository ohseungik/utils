"use client"

interface QRCodeOptions {
  size: number
  foregroundColor: string
  backgroundColor: string
  errorCorrectionLevel: "L" | "M" | "Q" | "H"
  margin: number
  logoUrl?: string
  logoSize?: number
}

// QR 코드 생성 함수
export async function generateQRCode(text: string, options: QRCodeOptions): Promise<string> {
  // QRCode.js 라이브러리 동적 로드
  const QRCode = await import("qrcode")

  // QR 코드 옵션 설정
  const qrOptions = {
    errorCorrectionLevel: options.errorCorrectionLevel,
    margin: options.margin,
    color: {
      dark: options.foregroundColor,
      light: options.backgroundColor,
    },
    width: options.size,
  }

  // 로고가 있는 경우와 없는 경우 처리
  if (options.logoUrl && options.logoUrl.trim()) {
    // 로고가 있는 경우 캔버스에 QR 코드와 로고를 그려서 반환
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas")
      canvas.width = options.size
      canvas.height = options.size

      QRCode.toCanvas(canvas, text, qrOptions, (error) => {
        if (error) {
          reject(error)
          return
        }

        // 로고 이미지 로드
        const logoImg = new Image()
        logoImg.crossOrigin = "anonymous" // CORS 이슈 방지
        logoImg.onload = () => {
          const ctx = canvas.getContext("2d")
          if (!ctx) {
            reject(new Error("Canvas context not available"))
            return
          }

          // 로고 크기 및 위치 계산
          const logoSize = options.logoSize || 50
          const logoX = (options.size - logoSize) / 2
          const logoY = (options.size - logoSize) / 2

          // 로고 배경 (흰색 원)
          ctx.fillStyle = options.backgroundColor
          ctx.beginPath()
          ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2 + 5, 0, 2 * Math.PI)
          ctx.fill()

          // 로고 그리기
          ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize)

          // 캔버스를 데이터 URL로 변환
          resolve(canvas.toDataURL("image/png"))
        }

        logoImg.onerror = () => {
          // 로고 로드 실패 시 로고 없이 QR 코드만 반환
          resolve(canvas.toDataURL("image/png"))
        }

        logoImg.src = options.logoUrl
      })
    })
  } else {
    // 로고가 없는 경우 일반 QR 코드 생성
    return QRCode.toDataURL(text, qrOptions)
  }
}

// QR 코드 데이터 검증 함수
export function validateQRData(text: string, type: string): boolean {
  switch (type) {
    case "url":
      // URL 형식 검증
      try {
        new URL(text)
        return true
      } catch (e) {
        return false
      }
    case "email":
      // 이메일 형식 검증
      return /^mailto:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(text)
    case "phone":
      // 전화번호 형식 검증
      return /^tel:\+?[0-9]{10,15}$/.test(text)
    case "wifi":
      // WiFi 형식 검증
      return /^WIFI:S:.+;T:(WPA|WEP|);P:.*;;$/.test(text)
    case "vcard":
      // vCard 형식 검증 (간단한 검증)
      return text.startsWith("BEGIN:VCARD") && text.endsWith("END:VCARD")
    default:
      // 기본적으로 텍스트는 항상 유효
      return true
  }
}
