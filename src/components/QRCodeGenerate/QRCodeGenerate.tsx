"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { QrCode, Download, RefreshCw, Trash2, Copy, Link2, FileText, Phone, Mail } from "lucide-react"
import { toast } from "sonner"
import { generateQRCode } from "@/lib/qrcodeUtils"

interface QRCodeOptions {
  size: number
  foregroundColor: string
  backgroundColor: string
  errorCorrectionLevel: "L" | "M" | "Q" | "H"
  margin: number
  logoUrl?: string
  logoSize?: number
}

export default function QrCodeGenerator() {
  // 상태 관리
  const [inputText, setInputText] = useState<string>("")
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>("text")
  const [options, setOptions] = useState<QRCodeOptions>({
    size: 200,
    foregroundColor: "#000000",
    backgroundColor: "#FFFFFF",
    errorCorrectionLevel: "M",
    margin: 4,
    logoUrl: "",
    logoSize: 50,
  })

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const downloadLinkRef = useRef<HTMLAnchorElement>(null)

  // 입력 텍스트가 변경될 때마다 QR 코드 생성
  useEffect(() => {
    if (inputText.trim()) {
      handleGenerateQRCode()
    }
  }, [inputText, options])

  // QR 코드 생성 함수
  const handleGenerateQRCode = async () => {
    if (!inputText.trim()) {
      toast("QR코드로 변환할 텍스트나 URL을 입력해주세요")
      return
    }

    setIsGenerating(true)

    try {
      const dataUrl = await generateQRCode(inputText, options)
      setQrCodeDataUrl(dataUrl)
    } catch (error) {
      console.error("QR코드 생성 오류:", error)
      toast("QR코드를 생성하는 중 오류가 발생했습니다")
    } finally {
      setIsGenerating(false)
    }
  }

  // QR 코드 다운로드
  const handleDownload = () => {
    if (!qrCodeDataUrl) return

    if (downloadLinkRef.current) {
      downloadLinkRef.current.href = qrCodeDataUrl
      downloadLinkRef.current.download = "qrcode.png"
      downloadLinkRef.current.click()

      toast("QR코드가 성공적으로 다운로드되었습니다")
    }
  }

  // QR 코드 복사
  const handleCopy = () => {
    if (!qrCodeDataUrl) return

    // 캔버스에서 이미지 데이터 가져오기
    if (canvasRef.current) {
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          // 클립보드에 이미지 복사
          const item = new ClipboardItem({ "image/png": blob })
          navigator.clipboard
            .write([item])
            .then(() => {
              toast("QR코드가 클립보드에 복사되었습니다")
            })
            .catch((error) => {
              console.error("복사 오류:", error)
              toast("클립보드에 복사하는 중 오류가 발생했습니다")
            })
        }
      })
    }
  }

  // 모든 필드 초기화
  const handleClear = () => {
    setInputText("")
    setQrCodeDataUrl(null)
    setOptions({
      size: 200,
      foregroundColor: "#000000",
      backgroundColor: "#FFFFFF",
      errorCorrectionLevel: "M",
      margin: 4,
      logoUrl: "",
      logoSize: 50,
    })
  }

  // 미리 정의된 템플릿 적용
  const applyTemplate = (type: string) => {
    switch (type) {
      case "url":
        setInputText("https://")
        setActiveTab("text")
        break
      case "text":
        setInputText("")
        setActiveTab("text")
        break
      case "email":
        setInputText("mailto:example@example.com")
        setActiveTab("text")
        break
      case "phone":
        setInputText("tel:+821012345678")
        setActiveTab("text")
        break
      case "wifi":
        setInputText("WIFI:S:네트워크이름;T:WPA;P:비밀번호;;")
        setActiveTab("text")
        break
      case "vcard":
        setInputText(
          "BEGIN:VCARD\nVERSION:3.0\nN:성;이름;;;\nFN:이름 성\nTEL;TYPE=CELL:+821012345678\nEMAIL:example@example.com\nEND:VCARD",
        )
        setActiveTab("text")
        break
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">QR코드 내용</h2>
              <Button variant="outline" size="sm" onClick={handleClear}>
                <Trash2 className="mr-2 h-4 w-4" />
                초기화
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="text">텍스트/URL</TabsTrigger>
                <TabsTrigger value="templates">템플릿</TabsTrigger>
              </TabsList>

              <TabsContent value="text">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="input-text">QR코드에 포함할 텍스트 또는 URL</Label>
                    <Input
                      id="input-text"
                      placeholder="텍스트 또는 URL을 입력하세요"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleGenerateQRCode}
                    disabled={isGenerating || !inputText.trim()}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        생성 중...
                      </>
                    ) : (
                      <>
                        <QrCode className="mr-2 h-4 w-4" />
                        QR코드 생성
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="templates">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    자주 사용하는 QR코드 형식을 선택하여 빠르게 생성할 수 있습니다.
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" onClick={() => applyTemplate("url")} className="justify-start">
                      <Link2 className="mr-2 h-4 w-4" />
                      웹사이트 URL
                    </Button>
                    <Button variant="outline" onClick={() => applyTemplate("text")} className="justify-start">
                      <FileText className="mr-2 h-4 w-4" />
                      일반 텍스트
                    </Button>
                    <Button variant="outline" onClick={() => applyTemplate("email")} className="justify-start">
                      <Mail className="mr-2 h-4 w-4" />
                      이메일 주소
                    </Button>
                    <Button variant="outline" onClick={() => applyTemplate("phone")} className="justify-start">
                      <Phone className="mr-2 h-4 w-4" />
                      전화번호
                    </Button>
                    <Button variant="outline" onClick={() => applyTemplate("wifi")} className="justify-start">
                      <QrCode className="mr-2 h-4 w-4" />
                      WiFi 접속 정보
                    </Button>
                    <Button variant="outline" onClick={() => applyTemplate("vcard")} className="justify-start">
                      <QrCode className="mr-2 h-4 w-4" />
                      연락처 (vCard)
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">QR코드 결과</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy} disabled={!qrCodeDataUrl}>
                  <Copy className="mr-2 h-4 w-4" />
                  복사
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload} disabled={!qrCodeDataUrl}>
                  <Download className="mr-2 h-4 w-4" />
                  다운로드
                </Button>
              </div>
            </div>

            <div className="flex justify-center items-center border rounded-lg p-4 min-h-[250px]">
              {qrCodeDataUrl ? (
                <>
                  <img
                    src={qrCodeDataUrl || "/placeholder.svg"}
                    alt="Generated QR Code"
                    className="max-w-full max-h-[250px]"
                    style={{ width: options.size, height: options.size }}
                  />
                  <canvas ref={canvasRef} className="hidden" />
                </>
              ) : (
                <div className="text-center text-muted-foreground">
                  <QrCode className="mx-auto h-16 w-16 mb-2 opacity-20" />
                  <p>QR코드가 여기에 표시됩니다</p>
                  <p className="text-sm mt-1">텍스트나 URL을 입력하고 생성 버튼을 클릭하세요</p>
                </div>
              )}
            </div>
            <a ref={downloadLinkRef} className="hidden" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">QR코드 옵션</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="size">크기: {options.size}px</Label>
              </div>
              <Slider
                id="size"
                min={100}
                max={500}
                step={10}
                value={[options.size]}
                onValueChange={(value) => setOptions({ ...options, size: value[0] })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="foreground-color">전경색</Label>
                <div className="flex mt-2">
                  <Input
                    id="foreground-color"
                    type="color"
                    value={options.foregroundColor}
                    onChange={(e) => setOptions({ ...options, foregroundColor: e.target.value })}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={options.foregroundColor}
                    onChange={(e) => setOptions({ ...options, foregroundColor: e.target.value })}
                    className="flex-1 ml-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="background-color">배경색</Label>
                <div className="flex mt-2">
                  <Input
                    id="background-color"
                    type="color"
                    value={options.backgroundColor}
                    onChange={(e) => setOptions({ ...options, backgroundColor: e.target.value })}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={options.backgroundColor}
                    onChange={(e) => setOptions({ ...options, backgroundColor: e.target.value })}
                    className="flex-1 ml-2"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="error-correction">오류 수정 레벨</Label>
              <Select
                value={options.errorCorrectionLevel}
                onValueChange={(value) =>
                  setOptions({ ...options, errorCorrectionLevel: value as "L" | "M" | "Q" | "H" })
                }
              >
                <SelectTrigger id="error-correction" className="mt-2">
                  <SelectValue placeholder="오류 수정 레벨 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">낮음 (7% 복구)</SelectItem>
                  <SelectItem value="M">중간 (15% 복구)</SelectItem>
                  <SelectItem value="Q">중상 (25% 복구)</SelectItem>
                  <SelectItem value="H">높음 (30% 복구)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                오류 수정 레벨이 높을수록 QR코드가 손상되어도 스캔할 수 있지만, 코드가 더 복잡해집니다.
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="margin">여백: {options.margin}</Label>
              </div>
              <Slider
                id="margin"
                min={0}
                max={10}
                step={1}
                value={[options.margin]}
                onValueChange={(value) => setOptions({ ...options, margin: value[0] })}
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="logo-url">로고 이미지 URL (선택사항)</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="use-logo"
                    checked={!!options.logoUrl}
                    onCheckedChange={(checked) =>
                      setOptions({ ...options, logoUrl: checked ? options.logoUrl || " " : "" })
                    }
                  />
                  <Label htmlFor="use-logo" className="text-sm">
                    로고 사용
                  </Label>
                </div>
              </div>
              <Input
                id="logo-url"
                placeholder="로고 이미지 URL을 입력하세요"
                value={options.logoUrl || ""}
                onChange={(e) => setOptions({ ...options, logoUrl: e.target.value })}
                className="mt-2"
                disabled={!options.logoUrl}
              />
              <p className="text-xs text-muted-foreground mt-1">
                로고를 추가하면 QR코드 중앙에 이미지가 표시됩니다. 오류 수정 레벨을 높게 설정하는 것이 좋습니다.
              </p>
            </div>

            {options.logoUrl && (
              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="logo-size">로고 크기: {options.logoSize}px</Label>
                </div>
                <Slider
                  id="logo-size"
                  min={20}
                  max={100}
                  step={5}
                  value={[options.logoSize || 50]}
                  onValueChange={(value) => setOptions({ ...options, logoSize: value[0] })}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">QR코드 정보</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">QR코드란?</h3>
                <p className="text-sm text-muted-foreground">
                  QR코드(Quick Response Code)는 2차원 바코드로, 다양한 정보를 저장할 수 있습니다. 스마트폰 카메라로
                  스캔하여 웹사이트 방문, 연락처 저장, WiFi 연결 등 다양한 작업을 빠르게 수행할 수 있습니다.
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-2">사용 사례</h3>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li>웹사이트 URL 공유</li>
                  <li>디지털 명함 (vCard)</li>
                  <li>WiFi 네트워크 접속 정보</li>
                  <li>이벤트 티켓 및 쿠폰</li>
                  <li>제품 정보 및 설명서</li>
                  <li>위치 정보 (지도 좌표)</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">특수 형식 안내</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong>URL:</strong> https://example.com
                </p>
                <p>
                  <strong>이메일:</strong> mailto:example@example.com
                </p>
                <p>
                  <strong>전화번호:</strong> tel:+821012345678
                </p>
                <p>
                  <strong>WiFi:</strong> WIFI:S:네트워크이름;T:WPA;P:비밀번호;;
                </p>
                <p>
                  <strong>vCard:</strong> BEGIN:VCARD VERSION:3.0 N:성;이름;;; FN:이름 성 TEL:+821012345678
                  EMAIL:example@example.com END:VCARD
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
