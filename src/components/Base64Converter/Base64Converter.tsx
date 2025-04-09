"use client"

import { useState, useRef, type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Copy, Download, Upload, RefreshCw, Trash2, FileText, ImageIcon, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { encodeBase64, decodeBase64, isValidBase64 } from "@/lib/base64Utils"

export default function Base64Converter() {
  // 상태 관리
  const [inputText, setInputText] = useState<string>("")
  const [outputText, setOutputText] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>("text")
  const [mode, setMode] = useState<"encode" | "decode">("encode")
  const [encoding, setEncoding] = useState<string>("utf-8")
  const [error, setError] = useState<string | null>(null)
  const [fileInfo, setFileInfo] = useState<{
    name: string
    type: string
    size: number
  } | null>(null)
  const [urlSafe, setUrlSafe] = useState<boolean>(false)
  const [lineBreaks, setLineBreaks] = useState<boolean>(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const downloadLinkRef = useRef<HTMLAnchorElement>(null)

  // 텍스트 인코딩
  const handleEncode = async () => {
    if (!inputText.trim()) {
      toast("인코딩할 텍스트를 입력해주세요");
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const result = await encodeBase64(inputText, {
        encoding,
        urlSafe,
        lineBreaks,
      })
      setOutputText(result)
    } catch (err) {
      console.error("인코딩 오류:", err)
      setError(err instanceof Error ? err.message : "인코딩 중 오류가 발생했습니다")
      toast("텍스트를 Base64로 인코딩하는 중 오류가 발생했습니다");
    } finally {
      setIsProcessing(false)
    }
  }

  // 텍스트 디코딩
  const handleDecode = async () => {
    if (!inputText.trim()) {
      toast("디코딩할 Base64 텍스트를 입력해주세요");
      return
    }

    // Base64 유효성 검사
    if (!isValidBase64(inputText, urlSafe)) {
      setError("유효하지 않은 Base64 형식입니다")
      toast("입력된 텍스트가 유효한 Base64 형식이 아닙니다");
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const result = await decodeBase64(inputText, {
        encoding,
        urlSafe,
      })
      setOutputText(result)
    } catch (err) {
      console.error("디코딩 오류:", err)
      setError(err instanceof Error ? err.message : "디코딩 중 오류가 발생했습니다")
      toast("Base64를 텍스트로 디코딩하는 중 오류가 발생했습니다");
    } finally {
      setIsProcessing(false)
    }
  }

  // 파일 인코딩
  const handleFileEncode = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsProcessing(true)
    setError(null)
    setFileInfo({
      name: file.name,
      type: file.type || "application/octet-stream",
      size: file.size,
    })

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // data:image/png;base64, 부분 제거
      const base64String = result.split(",")[1]
      setOutputText(base64String)
      setIsProcessing(false)
      toast(`${file.name} 파일이 성공적으로 Base64로 인코딩되었습니다`);
    }
    reader.onerror = () => {
      setError("파일을 읽는 중 오류가 발생했습니다")
      setIsProcessing(false)
      toast("파일을 읽는 중 오류가 발생했습니다");
    }
    reader.readAsDataURL(file)
  }

  // 파일 디코딩 및 다운로드
  const handleFileDecode = () => {
    if (!inputText.trim()) {
      toast("디코딩할 Base64 텍스트를 입력해주세요");
      return
    }

    // Base64 유효성 검사
    if (!isValidBase64(inputText, urlSafe)) {
      setError("유효하지 않은 Base64 형식입니다")
      toast("입력된 텍스트가 유효한 Base64 형식이 아닙니다");
      return
    }

    try {
      // Base64를 Blob으로 변환
      const byteCharacters = atob(urlSafe ? inputText.replace(/-/g, "+").replace(/_/g, "/") : inputText)
      const byteArrays = []
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays.push(byteCharacters.charCodeAt(i))
      }
      const byteArray = new Uint8Array(byteArrays)
      const blob = new Blob([byteArray])

      // 다운로드 링크 생성
      const url = URL.createObjectURL(blob)
      if (downloadLinkRef.current) {
        downloadLinkRef.current.href = url
        downloadLinkRef.current.download = "decoded_file"
        downloadLinkRef.current.click()
        URL.revokeObjectURL(url)
      }

      toast("Base64가 성공적으로 파일로 디코딩되었습니다");
    } catch (err) {
      console.error("파일 디코딩 오류:", err)
      setError(err instanceof Error ? err.message : "파일 디코딩 중 오류가 발생했습니다")
      toast("Base64를 파일로 디코딩하는 중 오류가 발생했습니다");
    }
  }

  // 결과 복사
  const handleCopy = () => {
    if (!outputText) {
      toast("복사할 결과가 없습니다");
      return
    }

    navigator.clipboard
      .writeText(outputText)
      .then(() => {
        toast("결과가 클립보드에 복사되었습니다");
      })
      .catch((error) => {
        console.error("복사 오류:", error)
        toast("클립보드에 복사하는 중 오류가 발생했습니다");
      })
  }

  // 모든 필드 초기화
  const handleClear = () => {
    setInputText("")
    setOutputText("")
    setError(null)
    setFileInfo(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // 파일 크기 포맷팅
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">입력</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleClear} disabled={!inputText && !outputText}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  초기화
                </Button>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="text">텍스트</TabsTrigger>
                <TabsTrigger value="file">파일</TabsTrigger>
              </TabsList>

              <TabsContent value="text">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="mode">모드:</Label>
                      <Select value={mode} onValueChange={(value) => setMode(value as "encode" | "decode")}>
                        <SelectTrigger id="mode" className="w-[180px]">
                          <SelectValue placeholder="모드 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="encode">인코딩 (텍스트 → Base64)</SelectItem>
                          <SelectItem value="decode">디코딩 (Base64 → 텍스트)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Textarea
                    placeholder={
                      mode === "encode" ? "인코딩할 텍스트를 입력하세요..." : "디코딩할 Base64 텍스트를 입력하세요..."
                    }
                    className="min-h-[200px] font-mono text-sm"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />

                  <div className="flex justify-between">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="encoding">인코딩:</Label>
                      <Select value={encoding} onValueChange={setEncoding}>
                        <SelectTrigger id="encoding" className="w-[120px]">
                          <SelectValue placeholder="인코딩 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="utf-8">UTF-8</SelectItem>
                          <SelectItem value="ascii">ASCII</SelectItem>
                          <SelectItem value="iso-8859-1">ISO-8859-1</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={mode === "encode" ? handleEncode : handleDecode}
                      disabled={isProcessing || !inputText}
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          처리 중...
                        </>
                      ) : mode === "encode" ? (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          인코딩
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          디코딩
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="file">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="file-mode">모드:</Label>
                      <Select value={mode} onValueChange={(value) => setMode(value as "encode" | "decode")}>
                        <SelectTrigger id="file-mode" className="w-[180px]">
                          <SelectValue placeholder="모드 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="encode">인코딩 (파일 → Base64)</SelectItem>
                          <SelectItem value="decode">디코딩 (Base64 → 파일)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {mode === "encode" ? (
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="bg-muted rounded-full p-3">
                          <Upload className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="text-sm font-medium">파일을 여기에 끌어다 놓거나 클릭하여 업로드하세요</div>
                        <div className="text-xs text-muted-foreground">최대 10MB</div>
                        <Input
                          ref={fileInputRef}
                          type="file"
                          className="hidden"
                          onChange={handleFileEncode}
                          accept="*/*"
                        />
                        <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isProcessing}>
                          파일 선택
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Textarea
                        placeholder="디코딩할 Base64 텍스트를 입력하세요..."
                        className="min-h-[200px] font-mono text-sm"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                      />
                      <Button onClick={handleFileDecode} disabled={isProcessing || !inputText}>
                        {isProcessing ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            처리 중...
                          </>
                        ) : (
                          <>
                            <Download className="mr-2 h-4 w-4" />
                            파일로 디코딩
                          </>
                        )}
                      </Button>
                      <a ref={downloadLinkRef} className="hidden" />
                    </div>
                  )}

                  {fileInfo && (
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <h3 className="font-medium mb-2">파일 정보</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>파일 이름:</div>
                        <div className="font-mono truncate">{fileInfo.name}</div>

                        <div>파일 유형:</div>
                        <div className="font-mono">{fileInfo.type}</div>

                        <div>파일 크기:</div>
                        <div className="font-mono">{formatFileSize(fileInfo.size)}</div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">결과</h2>
              <Button variant="outline" size="sm" onClick={handleCopy} disabled={!outputText}>
                <Copy className="mr-2 h-4 w-4" />
                복사
              </Button>
            </div>

            {error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>오류 발생</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                <Textarea
                  readOnly
                  placeholder="결과가 여기에 표시됩니다..."
                  className="min-h-[200px] font-mono text-sm"
                  value={outputText}
                />

                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="url-safe" checked={urlSafe} onCheckedChange={setUrlSafe} />
                    <Label htmlFor="url-safe">URL 안전 Base64 사용 (+ → -, / → _)</Label>
                  </div>

                  {mode === "encode" && (
                    <div className="flex items-center space-x-2">
                      <Switch id="line-breaks" checked={lineBreaks} onCheckedChange={setLineBreaks} />
                      <Label htmlFor="line-breaks">76자마다 줄바꿈 추가</Label>
                    </div>
                  )}
                </div>

                {outputText && (
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      {mode === "encode" ? (
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      )}
                      <h3 className="font-medium">결과 정보</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>문자 수:</div>
                      <div className="font-mono">{outputText.length}</div>

                      <div>바이트 크기:</div>
                      <div className="font-mono">{formatFileSize(new Blob([outputText]).size)}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Base64 정보</h2>
          <div className="space-y-4">
            <p>
              Base64는 바이너리 데이터를 텍스트로 인코딩하는 방식으로, 이메일이나 HTML과 같이 텍스트만 허용하는 환경에서
              바이너리 데이터를 안전하게 전송하기 위해 사용됩니다.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Base64 특징</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>ASCII 문자만 사용하여 바이너리 데이터를 표현합니다.</li>
                  <li>A-Z, a-z, 0-9, +, / 총 64개의 문자를 사용합니다.</li>
                  <li>패딩을 위해 = 문자를 사용합니다.</li>
                  <li>인코딩 시 원본 데이터보다 약 33% 크기가 증가합니다.</li>
                  <li>URL 안전 Base64는 +와 /를 각각 -와 _로 대체합니다.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">주요 사용 사례</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>이메일 첨부 파일 (MIME)</li>
                  <li>데이터 URL (이미지를 HTML에 직접 삽입)</li>
                  <li>JWT(JSON Web Token)</li>
                  <li>XML 및 JSON에서 바이너리 데이터 표현</li>
                  <li>API 통신에서 바이너리 데이터 전송</li>
                </ul>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>참고 사항</AlertTitle>
              <AlertDescription>
                Base64는 암호화가 아닌 인코딩 방식입니다. 보안을 위한 용도로는 적합하지 않으며, 단순히 바이너리 데이터를
                텍스트로 표현하기 위한 방법입니다.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
