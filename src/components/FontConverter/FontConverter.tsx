"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Download, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import FontDropzone from "@/components/FontConverter/FontDropzone"
import FontPreview from "@/components/FontConverter/FontPreview"
import { convertFont } from "@/lib/fontUtils"

export default function FontConverter() {
    const [originalFont, setOriginalFont] = useState<File | null>(null)
    const [convertedFontUrl, setConvertedFontUrl] = useState<string | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [fontFamily, setFontFamily] = useState<string>("")
    const [previewText, setPreviewText] = useState<string>(
      "가나다라마바사 abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789",
    )
    const [fontSize, setFontSize] = useState<number>(24)
    const [targetFormat, setTargetFormat] = useState<string>("woff2")
    const downloadLinkRef = useRef<HTMLAnchorElement>(null)

    const handleFontUpload = (file: File) => {
        setOriginalFont(file)
        setConvertedFontUrl(null)
    }

    const handleConvert = async () => {
        if (!originalFont) return
    
        setIsProcessing(true)
        try {
          const result = await convertFont(originalFont)
          setConvertedFontUrl(result)
          toast("폰트 변환 완료 폰트가 성공적으로 변환되었습니다.");
        } catch (error) {
          console.error("변환 오류:", error)
          toast("변환 실패 폰트 변환 중 오류가 발생했습니다. 다시 시도해주세요.");
        } finally {
          setIsProcessing(false)
        }
    }

    const handleDownload = () => {
        if (!convertedFontUrl || !downloadLinkRef.current || !originalFont) return
    
        const extension = targetFormat
        const fileName = `${originalFont.name.split(".")[0]}.${extension}`
    
        downloadLinkRef.current.href = convertedFontUrl
        downloadLinkRef.current.download = fileName
        downloadLinkRef.current.click()
      }
    
    const handleReset = () => {
      setOriginalFont(null)
      setConvertedFontUrl(null)
      setFontFamily("")
    }

    // 폰트 로드 및 미리보기 설정
    useEffect(() => {
      if (originalFont) {
        const fontUrl = URL.createObjectURL(originalFont)
        const fontName = originalFont.name.split(".")[0].replace(/[^a-zA-Z0-9]/g, "")
        setFontFamily(fontName)

        // 폰트 스타일 생성
        const style = document.createElement("style")
        style.textContent = `
          @font-face {
            font-family: "${fontName}";
            src: url("${fontUrl}") format("truetype");
            font-weight: normal;
            font-style: normal;
          }
        `
        document.head.appendChild(style)

        return () => {
          URL.revokeObjectURL(fontUrl)
          document.head.removeChild(style)
        }
      }
    }, [originalFont])

    return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">폰트 업로드</h2>
                {originalFont ? (
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <p className="font-medium">{originalFont.name}</p>
                      <p className="text-sm text-muted-foreground">크기: {(originalFont.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <Button variant="outline" className="w-full" onClick={handleReset}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      초기화
                    </Button>
                  </div>
                ) : (
                  <FontDropzone onFontUpload={handleFontUpload} />
                )}
              </CardContent>
            </Card>
    
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">변환 설정</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="format">변환 포맷</Label>
                    <Select value={targetFormat} onValueChange={setTargetFormat} disabled={!originalFont}>
                      <SelectTrigger id="format">
                        <SelectValue placeholder="변환할 포맷 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="woff2">WOFF2 (최신 브라우저용)</SelectItem>
                        <SelectItem value="woff">WOFF (대부분의 브라우저 지원)</SelectItem>
                        <SelectItem value="ttf">TTF (TrueType)</SelectItem>
                        <SelectItem value="otf">OTF (OpenType)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
    
                  <Button className="w-full" onClick={handleConvert} disabled={!originalFont || isProcessing}>
                    {isProcessing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        변환 중...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        폰트 변환하기
                      </>
                    )}
                  </Button>
    
                  {convertedFontUrl && (
                    <Button variant="secondary" className="w-full" onClick={handleDownload}>
                      <Download className="mr-2 h-4 w-4" />
                      변환된 폰트 다운로드
                    </Button>
                  )}
                  <a ref={downloadLinkRef} className="hidden" />
                </div>
              </CardContent>
            </Card>
          </div>
    
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">폰트 미리보기</h2>
              <Tabs defaultValue="custom">
                <TabsList className="mb-4">
                  <TabsTrigger value="custom">사용자 정의</TabsTrigger>
                  <TabsTrigger value="paragraph">단락</TabsTrigger>
                  <TabsTrigger value="alphabet">알파벳</TabsTrigger>
                  <TabsTrigger value="numbers">숫자</TabsTrigger>
                  <TabsTrigger value="korean">한글</TabsTrigger>
                </TabsList>
    
                <TabsContent value="custom">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="preview-text">미리보기 텍스트</Label>
                      <Input
                        id="preview-text"
                        value={previewText}
                        onChange={(e) => setPreviewText(e.target.value)}
                        placeholder="미리보기할 텍스트를 입력하세요"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label htmlFor="font-size">글자 크기: {fontSize}px</Label>
                      </div>
                      <Slider
                        id="font-size"
                        min={8}
                        max={72}
                        step={1}
                        value={[fontSize]}
                        onValueChange={(value) => setFontSize(value[0])}
                      />
                    </div>
                    <FontPreview text={previewText} fontFamily={fontFamily} fontSize={fontSize} />
                  </div>
                </TabsContent>
    
                <TabsContent value="paragraph">
                  <FontPreview
                    text="웹 폰트는 웹 페이지를 방문하는 사용자가 컴퓨터에 해당 폰트가 설치되어 있지 않더라도 특정 글꼴로 텍스트를 볼 수 있게 해주는 기술입니다. 이를 통해 디자이너와 개발자는 웹사이트의 시각적 일관성을 유지하고 브랜드 아이덴티티를 강화할 수 있습니다."
                    fontFamily={fontFamily}
                    fontSize={fontSize}
                  />
                </TabsContent>
    
                <TabsContent value="alphabet">
                  <FontPreview
                    text="abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                    fontFamily={fontFamily}
                    fontSize={fontSize}
                  />
                </TabsContent>
    
                <TabsContent value="numbers">
                  <FontPreview
                    text="0123456789 !@#$%^&amp;*()_+-=[]{}|;':&quot;,.//&lt;&gt;?"
                    fontFamily={fontFamily}
                    fontSize={fontSize}
                  />
                </TabsContent>
    
                <TabsContent value="korean">
                  <FontPreview
                    text="가나다라마바사아자차카타파하 ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ"
                    fontFamily={fontFamily}
                    fontSize={fontSize}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
    )
}
