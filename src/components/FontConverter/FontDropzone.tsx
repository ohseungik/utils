"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface FontDropzoneProps {
    onFontUpload: (file: File) => void
}

export default function FontDropzone({ onFontUpload }: FontDropzoneProps) {
    const [isDragging, setIsDragging] = useState(false)

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
    
        const files = e.dataTransfer.files
        if (files.length > 0) {
          validateAndUpload(files[0])
        }
    }, [])

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
          validateAndUpload(files[0])
        }
    }, [])

    const validateAndUpload = (file: File) => {
        // 폰트 파일 확장자 확인
        const validExtensions = [".ttf", ".otf", ".woff", ".woff2"]
        const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()
    
        if (!validExtensions.includes(fileExtension)) {
          toast("잘못된 파일 형식, TTF, OTF, WOFF 또는 WOFF2 폰트 파일을 업로드해주세요")
          return
        }
    
        // 파일 크기 확인 (10MB 제한)
        if (file.size > 10 * 1024 * 1024) {
          toast("파일이 너무 큽니다, 10MB 미만의 폰트 파일을 업로드해주세요")
          return
        }
    
        onFontUpload(file)
    }

    return (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-12 text-center h-[200px] flex flex-col items-center justify-center transition-colors",
            isDragging ? "border-primary bg-primary/5" : "border-border",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="h-12 w-12 mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-1">폰트 파일을 여기에 끌어다 놓으세요</p>
          <p className="text-sm text-muted-foreground mb-4">지원 형식: TTF, OTF, WOFF, WOFF2 (최대 10MB)</p>
          <label className="cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
            파일 찾기
            <input type="file" className="hidden" accept=".ttf,.otf,.woff,.woff2" onChange={handleFileChange} />
          </label>
        </div>
    )

}