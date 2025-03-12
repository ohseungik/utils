"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Upload, Download, ImageIcon, RefreshCw } from "lucide-react"
import ImageDropzone from "@/components/ImageOptimizer/ImageDropzone"
import ImagePreview from "@/components/ImageOptimizer/ImagePreview"
import { optimizeImage, checkWebPSupport } from "@/lib/imageUtils"
import { toast } from "sonner"

export default function ImageOptimizer() {
  const [originalImage, setOriginalImage] = useState<File | null>(null)
  const [optimizedImageUrl, setOptimizedImageUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 })
  const [webPSupported, setWebPSupported] = useState(true)
  const [settings, setSettings] = useState({
    quality: 80,
    width: 0,
    height: 0,
    maintainAspectRatio: true,
    convertToWebP: true,
  })
  const originalImageUrl = originalImage ? URL.createObjectURL(originalImage) : null
  const downloadLinkRef = useRef<HTMLAnchorElement>(null)

  // WebP 지원 여부 확인
  useEffect(() => {
    const checkSupport = async () => {
      const isSupported = await checkWebPSupport()
      setWebPSupported(isSupported)
      if (!isSupported) {
        setSettings((prev) => ({ ...prev, convertToWebP: false }))
        toast("WebP 지원 안됨 브라우저가 WebP 형식을 지원하지 않습니다. 원본 형식을 사용합니다.");
      }
    }

    checkSupport()
  }, [])

  // 원본 이미지 크기 로드
  useEffect(() => {
    if (originalImage && originalImageUrl) {
      const img = new Image()
      img.onload = () => {
        setOriginalDimensions({
          width: img.width,
          height: img.height,
        })
      }
      img.src = originalImageUrl
    }
  }, [originalImage, originalImageUrl])

  const handleImageUpload = (file: File) => {
    setOriginalImage(file)
    setOptimizedImageUrl(null)
  }

  const handleOptimize = async () => {
    if (!originalImage) return

    setIsProcessing(true)
    try {
      // WebP가 지원되지 않지만 선택된 경우 경고 표시
      if (settings.convertToWebP && !webPSupported) {
        toast("WebP 지원 안됨 브라우저가 WebP 형식을 지원하지 않습니다. 원본 형식을 사용합니다.");
        setSettings((prev) => ({ ...prev, convertToWebP: false }))
      }

      const result = await optimizeImage(originalImage, {
        ...settings,
        originalWidth: originalDimensions.width,
        originalHeight: originalDimensions.height,
      })

      setOptimizedImageUrl(result)
      toast("이미지 최적화 완료 이미지가 처리되었으며 다운로드할 준비가 되었습니다.");
    } catch (error) {
      console.error("최적화 오류:", error)
      toast("최적화 실패 이미지 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!optimizedImageUrl || !downloadLinkRef.current) return

    const extension = settings.convertToWebP ? "webp" : originalImage?.name.split(".").pop()
    const fileName = `최적화-${originalImage?.name.split(".")[0]}.${extension}`

    downloadLinkRef.current.href = optimizedImageUrl
    downloadLinkRef.current.download = fileName
    downloadLinkRef.current.click()
  }

  const handleReset = () => {
    setOriginalImage(null)
    setOptimizedImageUrl(null)
    setSettings({
      quality: 80,
      width: 0,
      height: 0,
      maintainAspectRatio: true,
      convertToWebP: webPSupported,
    })
    setOriginalDimensions({ width: 0, height: 0 })
  }

  // 가로 크기에 따른 세로 크기 계산 (비율 유지)
  const updateHeight = (width: number) => {
    if (!width || originalDimensions.width === 0) return 0
    const aspectRatio = originalDimensions.width / originalDimensions.height
    return Math.round(width / aspectRatio)
  }

  // 세로 크기에 따른 가로 크기 계산 (비율 유지)
  const updateWidth = (height: number) => {
    if (!height || originalDimensions.height === 0) return 0
    const aspectRatio = originalDimensions.width / originalDimensions.height
    return Math.round(height * aspectRatio)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">원본 이미지</h2>
            {originalImage ? (
              <ImagePreview imageUrl={originalImageUrl} fileName={originalImage.name} fileSize={originalImage.size} />
            ) : (
              <ImageDropzone onImageUpload={handleImageUpload} />
            )}
            {originalImage && (
              <Button variant="outline" className="mt-4 w-full" onClick={handleReset}>
                <RefreshCw className="mr-2 h-4 w-4" />
                초기화
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">최적화된 이미지</h2>
            {optimizedImageUrl ? (
              <>
                <ImagePreview
                  imageUrl={optimizedImageUrl}
                  fileName={originalImage?.name || ""}
                  fileSize={0} // 컴포넌트에서 계산됨
                />
                <Button className="mt-4 w-full" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  최적화된 이미지 다운로드
                </Button>
                <a ref={downloadLinkRef} className="hidden" />
              </>
            ) : (
              <div className="border-2 border-dashed rounded-lg p-12 text-center h-[300px] flex flex-col items-center justify-center text-muted-foreground">
                <ImageIcon className="h-12 w-12 mb-4" />
                <p>최적화된 이미지가 여기에 표시됩니다</p>
                <p className="text-sm mt-2">이미지를 업로드하고 설정을 조정하여 최적화하세요</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">최적화 설정</h2>
          <Tabs defaultValue="compression">
            <TabsList className="mb-4">
              <TabsTrigger value="compression">압축</TabsTrigger>
              <TabsTrigger value="resize">크기 조정</TabsTrigger>
              <TabsTrigger value="format">형식</TabsTrigger>
            </TabsList>

            <TabsContent value="compression">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label htmlFor="quality">품질: {settings.quality}%</Label>
                  </div>
                  <Slider
                    id="quality"
                    min={1}
                    max={100}
                    step={1}
                    value={[settings.quality]}
                    onValueChange={(value) => setSettings({ ...settings, quality: value[0] })}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    낮은 품질 = 작은 파일 크기, 하지만 이미지 품질에 영향을 줄 수 있습니다
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="resize">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="width">가로 (px)</Label>
                    <Input
                      id="width"
                      type="number"
                      placeholder="자동"
                      value={settings.width || ""}
                      onChange={(e) => {
                        const width = Number.parseInt(e.target.value) || 0
                        setSettings({
                          ...settings,
                          width: width,
                          height: settings.maintainAspectRatio ? updateHeight(width) : settings.height,
                        })
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="height">세로 (px)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="자동"
                      value={settings.height || ""}
                      onChange={(e) => {
                        const height = Number.parseInt(e.target.value) || 0
                        setSettings({
                          ...settings,
                          height: height,
                          width: settings.maintainAspectRatio ? updateWidth(height) : settings.width,
                        })
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="aspect-ratio"
                    checked={settings.maintainAspectRatio}
                    onCheckedChange={(checked) => setSettings({ ...settings, maintainAspectRatio: checked })}
                  />
                  <Label htmlFor="aspect-ratio">비율 유지</Label>
                </div>
                <p className="text-sm text-muted-foreground">두 필드를 모두 비워두면 원본 크기가 유지됩니다</p>
              </div>
            </TabsContent>

            <TabsContent value="format">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="webp-conversion"
                    checked={settings.convertToWebP}
                    disabled={!webPSupported}
                    onCheckedChange={(checked) => setSettings({ ...settings, convertToWebP: checked })}
                  />
                  <Label htmlFor="webp-conversion" className={!webPSupported ? "text-muted-foreground" : ""}>
                    WebP 형식으로 변환 {!webPSupported && "(브라우저에서 지원하지 않음)"}
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  WebP는 PNG나 JPEG보다 더 나은 압축률을 제공하면서 좋은 품질을 유지합니다
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <Button className="mt-6 w-full" onClick={handleOptimize} disabled={!originalImage || isProcessing}>
            {isProcessing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                처리 중...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                이미지 최적화
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

