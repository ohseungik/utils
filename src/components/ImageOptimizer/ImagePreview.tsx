"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { FileIcon } from "lucide-react"

interface ImagePreviewProps {
  imageUrl: string | null
  fileName: string
  fileSize: number
}

export default function ImagePreview({ imageUrl, fileName, fileSize }: ImagePreviewProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [actualFileSize, setActualFileSize] = useState(fileSize)

  useEffect(() => {
    if (imageUrl) {
      // 이미지 크기 가져오기
      const img = new window.Image()
      img.onload = () => {
        setDimensions({
          width: img.width,
          height: img.height,
        })
      }
      img.src = imageUrl

      // 파일 크기 가져오기 (최적화된 이미지의 경우)
      if (fileSize === 0) {
        fetch(imageUrl)
          .then((response) => response.blob())
          .then((blob) => {
            setActualFileSize(blob.size)
          })
          .catch((error) => {
            console.error("이미지 크기 가져오기 오류:", error)
          })
      }
    }
  }, [imageUrl, fileSize])

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  if (!imageUrl) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="relative h-[200px] w-full overflow-hidden rounded-lg bg-secondary/20">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={fileName}
          fill
          style={{ objectFit: "contain" }}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center">
          <FileIcon className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-sm font-medium truncate" title={fileName}>
            {fileName}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>크기: {formatFileSize(actualFileSize)}</div>
          <div>
            해상도: {dimensions.width} × {dimensions.height}px
          </div>
        </div>
      </div>
    </div>
  )
}

