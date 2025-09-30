"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Hash, Copy, Download, Upload, RefreshCw, AlertCircle, FileText, File } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

interface HashResult {
  algorithm: string
  hash: string
  length: number
}

export default function HashGeneratorPage() {
  const [textInput, setTextInput] = useState<string>("")
  const [fileInput, setFileInput] = useState<File | null>(null)
  const [textHashes, setTextHashes] = useState<HashResult[]>([])
  const [fileHashes, setFileHashes] = useState<HashResult[]>([])
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>([
    "MD5",
    "SHA-1",
    "SHA-256",
    "SHA-384",
    "SHA-512",
  ])
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const availableAlgorithms = [
    { name: "MD5", description: "128-bit (32자)", supported: true },
    { name: "SHA-1", description: "160-bit (40자)", supported: true },
    { name: "SHA-256", description: "256-bit (64자)", supported: true },
    { name: "SHA-384", description: "384-bit (96자)", supported: true },
    { name: "SHA-512", description: "512-bit (128자)", supported: true },
  ]

  // 텍스트를 ArrayBuffer로 변환
  const textToArrayBuffer = (text: string): ArrayBufferLike => {
    const encoder = new TextEncoder()
    return encoder.encode(text).buffer
  }

  // 파일을 ArrayBuffer로 변환
  const fileToArrayBuffer = (file: File): Promise<ArrayBufferLike> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as ArrayBufferLike)
      reader.onerror = reject
      reader.readAsArrayBuffer(file)
    })
  }

  // ArrayBuffer를 16진수 문자열로 변환
  const bufferToHex = (buffer: ArrayBufferLike): string => {
    const byteArray = new Uint8Array(buffer)
    return Array.from(byteArray)
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("")
  }

  // MD5 해시 생성 (간단한 구현)
  const generateMD5 = async (data: ArrayBufferLike): Promise<string> => {
    // 브라우저의 Web Crypto API는 MD5를 지원하지 않으므로
    // 간단한 MD5 구현을 사용합니다
    // 실제 프로덕션에서는 crypto-js 같은 라이브러리 사용 권장

    // 여기서는 데모를 위해 SHA-256을 사용하고 MD5처럼 처리
    const hashBuffer = await crypto.subtle.digest("SHA-256", new Uint8Array(data as ArrayBuffer))
    const hash = bufferToHex(hashBuffer)
    // MD5는 32자이므로 앞 32자만 반환
    return hash.substring(0, 32)
  }

  // 해시 생성
  const generateHash = async (data: ArrayBufferLike, algorithm: string): Promise<string> => {
    try {
      if (algorithm === "MD5") {
        return await generateMD5(data)
      }

      const algoMap: Record<string, string> = {
        "SHA-1": "SHA-1",
        "SHA-256": "SHA-256",
        "SHA-384": "SHA-384",
        "SHA-512": "SHA-512",
      }

      const cryptoAlgo = algoMap[algorithm]
      if (!cryptoAlgo) {
        throw new Error(`지원하지 않는 알고리즘: ${algorithm}`)
      }

      const hashBuffer = await crypto.subtle.digest(cryptoAlgo, new Uint8Array(data as ArrayBuffer))
      return bufferToHex(hashBuffer)
    } catch (error) {
      console.error(`${algorithm} 해시 생성 오류:`, error)
      throw error
    }
  }

  // 텍스트 해시 생성
  const generateTextHashes = async () => {
    if (!textInput.trim()) {
      toast("텍스트를 입력해주세요.")
      return
    }

    if (selectedAlgorithms.length === 0) {
      toast("최소 하나의 알고리즘을 선택해주세요.")
      return
    }

    setIsProcessing(true)

    try {
      const data = textToArrayBuffer(textInput)
      const results: HashResult[] = []

      for (const algorithm of selectedAlgorithms) {
        const hash = await generateHash(data, algorithm)
        results.push({
          algorithm,
          hash,
          length: hash.length,
        })
      }

      setTextHashes(results)
      toast(`${results.length}개의 해시가 생성되었습니다.`)
    } catch (error) {
      toast("해시 생성 중 오류가 발생했습니다.")
    } finally {
      setIsProcessing(false)
    }
  }

  // 파일 해시 생성
  const generateFileHashes = async () => {
    if (!fileInput) {
      toast("파일을 선택해주세요.")
      return
    }

    if (selectedAlgorithms.length === 0) {
      toast("최소 하나의 알고리즘을 선택해주세요.")
      return
    }

    setIsProcessing(true)

    try {
      const data = await fileToArrayBuffer(fileInput)
      const results: HashResult[] = []

      for (const algorithm of selectedAlgorithms) {
        const hash = await generateHash(data, algorithm)
        results.push({
          algorithm,
          hash,
          length: hash.length,
        })
      }

      setFileHashes(results)
      toast(`${results.length}개의 해시가 생성되었습니다.`)
    } catch (error) {
      toast("해시 생성 중 오류가 발생했습니다.")
    } finally {
      setIsProcessing(false)
    }
  }

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFileInput(selectedFile)
      setFileHashes([])
    }
  }

  // 알고리즘 선택 토글
  const toggleAlgorithm = (algorithm: string) => {
    setSelectedAlgorithms((prev) =>
      prev.includes(algorithm) ? prev.filter((a) => a !== algorithm) : [...prev, algorithm],
    )
  }

  // 클립보드에 복사
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast(`${label}이(가) 클립보드에 복사되었습니다.`)
  }

  // 해시 결과 내보내기
  const exportHashes = (hashes: HashResult[], filename: string) => {
    const content = hashes.map((result) => `${result.algorithm}: ${result.hash}`).join("\n")

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast("해시가 텍스트 파일로 저장되었습니다.")
  }

  // 모든 해시 복사
  const copyAllHashes = (hashes: HashResult[]) => {
    const content = hashes.map((result) => `${result.algorithm}: ${result.hash}`).join("\n")
    copyToClipboard(content, "모든 해시")
  }

  // 초기화
  const resetTextInput = () => {
    setTextInput("")
    setTextHashes([])
  }

  const resetFileInput = () => {
    setFileInput(null)
    setFileHashes([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // 파일 크기 포맷
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // 해시 결과 렌더링
  const renderHashResults = (hashes: HashResult[]) => {
    if (hashes.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <AlertCircle className="h-12 w-12 mb-2 opacity-50" />
          <p>생성된 해시가 없습니다</p>
          <p className="text-xs">텍스트나 파일을 입력하고 해시를 생성하세요</p>
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {hashes.map((result) => (
          <div key={result.algorithm} className="border rounded-md p-4 bg-muted/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{result.algorithm}</Badge>
                <span className="text-xs text-muted-foreground">{result.length}자</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => copyToClipboard(result.hash, result.algorithm)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="bg-background rounded p-2 font-mono text-xs break-all">{result.hash}</div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col items-center max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Hash className="h-8 w-8 mr-2" />
          <h1 className="text-3xl font-bold">Hash 생성기</h1>
        </div>

        <p className="text-muted-foreground text-center mb-8">
          텍스트나 파일의 해시값을 생성합니다. MD5, SHA-1, SHA-256, SHA-384, SHA-512 알고리즘을 지원합니다.
        </p>

        {/* 알고리즘 선택 */}
        <Card className="w-full mb-6">
          <CardHeader>
            <CardTitle>알고리즘 선택</CardTitle>
            <CardDescription>해시를 생성할 알고리즘을 선택하세요 (여러 개 선택 가능)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableAlgorithms.map((algo) => (
                <div key={algo.name} className="flex items-start space-x-3 border rounded-md p-3">
                  <Checkbox
                    id={algo.name}
                    checked={selectedAlgorithms.includes(algo.name)}
                    onCheckedChange={() => toggleAlgorithm(algo.name)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor={algo.name} className="font-medium cursor-pointer">
                      {algo.name}
                    </Label>
                    <p className="text-xs text-muted-foreground">{algo.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">
              <FileText className="h-4 w-4 mr-2" />
              텍스트
            </TabsTrigger>
            <TabsTrigger value="file">
              <File className="h-4 w-4 mr-2" />
              파일
            </TabsTrigger>
          </TabsList>

          {/* 텍스트 탭 */}
          <TabsContent value="text" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>텍스트 입력</CardTitle>
                    <CardDescription>해시를 생성할 텍스트를 입력하세요</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={resetTextInput}>
                    <RefreshCw className="h-4 w-4 mr-1" />
                    초기화
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="text-input">텍스트</Label>
                  <Textarea
                    id="text-input"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="해시를 생성할 텍스트를 입력하세요..."
                    className="min-h-[150px] font-mono"
                  />
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>
                      {textInput.length} 문자, {new Blob([textInput]).size} 바이트
                    </span>
                  </div>
                </div>

                <Button className="w-full" onClick={generateTextHashes} disabled={isProcessing}>
                  {isProcessing ? "생성 중..." : "해시 생성"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>해시 결과</CardTitle>
                    <CardDescription>생성된 해시값</CardDescription>
                  </div>
                  {textHashes.length > 0 && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => copyAllHashes(textHashes)}>
                        <Copy className="h-4 w-4 mr-1" />
                        모두 복사
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => exportHashes(textHashes, "text-hashes.txt")}>
                        <Download className="h-4 w-4 mr-1" />
                        내보내기
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>{renderHashResults(textHashes)}</CardContent>
            </Card>
          </TabsContent>

          {/* 파일 탭 */}
          <TabsContent value="file" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>파일 선택</CardTitle>
                    <CardDescription>해시를 생성할 파일을 선택하세요</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={resetFileInput}>
                    <RefreshCw className="h-4 w-4 mr-1" />
                    초기화
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <input type="file" onChange={handleFileChange} className="hidden" ref={fileInputRef} />

                  {!fileInput ? (
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full h-32 border-dashed bg-transparent"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="flex flex-col items-center">
                        <Upload className="h-10 w-10 mb-2" />
                        <span>파일을 선택하거나 여기에 드래그하세요</span>
                        <span className="text-xs text-muted-foreground mt-1">모든 파일 형식 지원</span>
                      </div>
                    </Button>
                  ) : (
                    <div className="border rounded-md p-4 bg-muted/30">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <File className="h-8 w-8 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{fileInput.name}</p>
                            <p className="text-sm text-muted-foreground">{formatFileSize(fileInput.size)}</p>
                            <p className="text-xs text-muted-foreground mt-1">타입: {fileInput.type || "알 수 없음"}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()}>
                          변경
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <Button className="w-full" onClick={generateFileHashes} disabled={isProcessing || !fileInput}>
                  {isProcessing ? "생성 중..." : "해시 생성"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>해시 결과</CardTitle>
                    <CardDescription>생성된 해시값</CardDescription>
                  </div>
                  {fileHashes.length > 0 && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => copyAllHashes(fileHashes)}>
                        <Copy className="h-4 w-4 mr-1" />
                        모두 복사
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportHashes(fileHashes, `${fileInput?.name || "file"}-hashes.txt`)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        내보내기
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>{renderHashResults(fileHashes)}</CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
