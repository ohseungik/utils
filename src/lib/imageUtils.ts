"use client"

interface OptimizationSettings {
  quality: number
  width: number
  height: number
  maintainAspectRatio: boolean
  convertToWebP: boolean
  originalWidth?: number
  originalHeight?: number
}

// 브라우저가 WebP를 지원하는지 확인하는 함수
export async function checkWebPSupport(): Promise<boolean> {
  return new Promise((resolve) => {
    const webP = new Image()
    webP.onload = () => {
      // WebP 지원 여부는 이미지의 너비가 1인지로 확인
      resolve(webP.width === 1)
    }
    webP.onerror = () => {
      resolve(false)
    }
    // WebP 형식의 작은 이미지 데이터
    webP.src = "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA="
  })
}

export async function optimizeImage(file: File, settings: OptimizationSettings): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas")

        let width = settings.width || img.width
        let height = settings.height || img.height

        if (settings.maintainAspectRatio) {
          const aspectRatio = img.width / img.height
          if (settings.width && !settings.height) {
            height = Math.round(width / aspectRatio)
          } else if (!settings.width && settings.height) {
            width = Math.round(height * aspectRatio)
          }
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext("2d")
        if (!ctx) {
          reject(new Error("Could not get canvas context"))
          return
        }

        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = "high"

        ctx.drawImage(img, 0, 0, width, height)

        let mimeType = file.type

        // WebP 변환 처리
        if (settings.convertToWebP) {
          // WebP 지원 확인
          checkWebPSupport().then((isSupported) => {
            if (isSupported) {
              mimeType = "image/webp"
              finalizeImage()
            } else {
              console.warn("이 브라우저는 WebP를 지원하지 않습니다. 원본 형식을 사용합니다.")
              finalizeImage()
            }
          })
        } else {
          finalizeImage()
        }

        function finalizeImage() {
          try {
            // 품질 설정
            const quality = settings.quality / 100

            // 캔버스에서 데이터 URL 생성
            const dataUrl = canvas.toDataURL(settings.convertToWebP ? "image/webp" : mimeType, quality)

            // 데이터 URL이 비어있거나 유효하지 않은 경우 오류 처리
            if (!dataUrl || dataUrl === "data:,") {
              reject(new Error("이미지 생성에 실패했습니다. 형식이 지원되지 않을 수 있습니다."))
              return
            }

            resolve(dataUrl)
          } catch (error) {
            console.error("이미지 처리 중 오류:", error)
            reject(new Error("이미지 처리에 실패했습니다. 형식이 지원되지 않을 수 있습니다."))
          }
        }
      } catch (error) {
        console.error("Error in image processing:", error)
        reject(error)
      }
    }

    img.onerror = (e) => {
      console.error("이미지 로딩 오류:", e)
      reject(new Error("이미지 로드에 실패했습니다"))
    }

    img.crossOrigin = "anonymous"
    img.src = URL.createObjectURL(file)
  })
}

