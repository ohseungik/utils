"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Copy, FileCode, RefreshCw, Trash2, Wand2 } from "lucide-react"
import { toast } from "sonner"
import { minifyCss, beautifyCss } from "@/lib/cssUtils"

export default function CSSMinifier() {
  const [inputCss, setInputCss] = useState<string>("")
  const [outputCss, setOutputCss] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [stats, setStats] = useState<{
    originalSize: number
    minifiedSize: number
    compressionRatio: number
  } | null>(null)
  const [options, setOptions] = useState({
    removeComments: true,
    removeWhitespace: true,
    collapseDeclarations: true,
  })
  const outputRef = useRef<HTMLTextAreaElement>(null)

  const handleMinify = async () => {
    if (!inputCss.trim()) {
      toast("입력 오류 CSS 코드를 입력해주세요")
      return
    }

    setIsProcessing(true)
    try {
      const minified = await minifyCss(inputCss, options)
      setOutputCss(minified)

      // 통계 계산
      const originalSize = new Blob([inputCss]).size
      const minifiedSize = new Blob([minified]).size
      const compressionRatio = ((originalSize - minifiedSize) / originalSize) * 100

      setStats({
        originalSize,
        minifiedSize,
        compressionRatio,
      })

      toast(`압축 완료 CSS 코드가 성공적으로 압축되었습니다. 압축률: ${compressionRatio.toFixed(2)}%`)
    } catch (error) {
      console.error("압축 오류:", error)
      toast("압축 실패 CSS 코드 압축 중 오류가 발생했습니다.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBeautify = async () => {
    if (!inputCss.trim()) {
      toast("입력 오류 CSS 코드를 입력해주세요")
      return
    }

    setIsProcessing(true)
    try {
      const beautified = await beautifyCss(inputCss)
      setOutputCss(beautified)

      // 통계 계산
      const originalSize = new Blob([inputCss]).size
      const beautifiedSize = new Blob([beautified]).size
      const sizeChange = ((beautifiedSize - originalSize) / originalSize) * 100

      setStats({
        originalSize,
        minifiedSize: beautifiedSize,
        compressionRatio: -sizeChange, // 음수는 크기가 증가했음을 의미
      })

      toast("포맷팅 완료 CSS 코드가 성공적으로 포맷팅되었습니다.")
    } catch (error) {
      console.error("포맷팅 오류:", error)
      toast("포맷팅 실패 CSS 코드 포맷팅 중 오류가 발생했습니다.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCopyOutput = () => {
    if (!outputCss) {
      toast("복사 오류 복사할 결과가 없습니다")
      return
    }

    navigator.clipboard
      .writeText(outputCss)
      .then(() => {
        toast("복사 완료 결과가 클립보드에 복사되었습니다")
      })
      .catch((error) => {
        console.error("복사 오류:", error)
        toast("복사 실패 클립보드에 복사하는 중 오류가 발생했습니다")
      })
  }

  const handleClear = () => {
    setInputCss("")
    setOutputCss("")
    setStats(null)
  }

  const formatSize = (bytes: number): string => {
    return `${(bytes / 1024).toFixed(2)} KB`
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">입력 CSS</h2>
              <Button variant="outline" size="sm" onClick={handleClear} disabled={!inputCss}>
                <Trash2 className="h-4 w-4 mr-2" />
                초기화
              </Button>
            </div>
            <Textarea
              placeholder="여기에 CSS 코드를 입력하세요..."
              className="min-h-[300px] font-mono text-sm"
              value={inputCss}
              onChange={(e) => setInputCss(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">출력 결과</h2>
              <Button variant="outline" size="sm" onClick={handleCopyOutput} disabled={!outputCss}>
                <Copy className="h-4 w-4 mr-2" />
                복사
              </Button>
            </div>
            <Textarea
              ref={outputRef}
              placeholder="결과가 여기에 표시됩니다..."
              className="min-h-[300px] font-mono text-sm"
              value={outputCss}
              readOnly
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="minify">
            <TabsList className="mb-4">
              <TabsTrigger value="minify">압축 (Minify)</TabsTrigger>
              <TabsTrigger value="beautify">포맷팅 (Beautify)</TabsTrigger>
              <TabsTrigger value="options">옵션</TabsTrigger>
            </TabsList>

            <TabsContent value="minify">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  CSS 코드를 압축하여 파일 크기를 줄이고 로딩 속도를 개선합니다. 공백, 주석, 불필요한 세미콜론 등을
                  제거합니다.
                </p>
                <Button className="w-full" onClick={handleMinify} disabled={!inputCss || isProcessing}>
                  {isProcessing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      처리 중...
                    </>
                  ) : (
                    <>
                      <FileCode className="mr-2 h-4 w-4" />
                      CSS 압축하기
                    </>
                  )}
                </Button>

                {stats && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <h3 className="font-medium mb-2">압축 통계</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>원본 크기:</div>
                      <div className="font-mono">{formatSize(stats.originalSize)}</div>

                      <div>결과 크기:</div>
                      <div className="font-mono">{formatSize(stats.minifiedSize)}</div>

                      <div>압축률:</div>
                      <div className={`font-mono ${stats.compressionRatio >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {stats.compressionRatio >= 0
                          ? `${stats.compressionRatio.toFixed(2)}% 감소`
                          : `${Math.abs(stats.compressionRatio).toFixed(2)}% 증가`}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="beautify">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  CSS 코드를 보기 좋게 포맷팅합니다. 적절한 들여쓰기와 줄바꿈을 추가하여 가독성을 높입니다.
                </p>
                <Button className="w-full" onClick={handleBeautify} disabled={!inputCss || isProcessing}>
                  {isProcessing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      처리 중...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      CSS 포맷팅하기
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="options">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="remove-comments"
                    checked={options.removeComments}
                    onCheckedChange={(checked) => setOptions({ ...options, removeComments: checked })}
                  />
                  <Label htmlFor="remove-comments">주석 제거</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="remove-whitespace"
                    checked={options.removeWhitespace}
                    onCheckedChange={(checked) => setOptions({ ...options, removeWhitespace: checked })}
                  />
                  <Label htmlFor="remove-whitespace">공백 제거</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="collapse-declarations"
                    checked={options.collapseDeclarations}
                    onCheckedChange={(checked) => setOptions({ ...options, collapseDeclarations: checked })}
                  />
                  <Label htmlFor="collapse-declarations">선언 축소</Label>
                </div>

                <p className="text-sm text-muted-foreground mt-4">
                  이 옵션들은 CSS 압축 시에만 적용됩니다. 포맷팅 시에는 적용되지 않습니다.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

