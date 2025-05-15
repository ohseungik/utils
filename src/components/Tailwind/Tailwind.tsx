"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Copy, RefreshCw, Trash2, Wand2, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { convertCssToTailwind } from "@/lib/tailwindUtils"

export default function CssToTailwind() {
  const [inputCss, setInputCss] = useState<string>("")
  const [outputTailwind, setOutputTailwind] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [options, setOptions] = useState({
    includeComments: true,
    sortClasses: true,
    useShorthand: true,
  })

  const outputRef = useRef<HTMLTextAreaElement>(null)

  const handleConvert = async () => {
    if (!inputCss.trim()) {
      toast("변환할 CSS 코드를 입력해주세요");
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const result = await convertCssToTailwind(inputCss, options)
      setOutputTailwind(result)
      toast("CSS가 Tailwind 클래스로 변환되었습니다")
    } catch (err) {
      console.error("변환 오류:", err)
      setError(err instanceof Error ? err.message : "변환 중 오류가 발생했습니다")
      toast("CSS를 Tailwind로 변환하는 중 오류가 발생했습니다")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCopyOutput = () => {
    if (!outputTailwind) {
      toast("복사할 결과가 없습니다")
      return
    }

    navigator.clipboard
      .writeText(outputTailwind)
      .then(() => {
        toast("결과가 클립보드에 복사되었습니다")
      })
      .catch((error) => {
        console.error("복사 오류:", error)
        toast("클립보드에 복사하는 중 오류가 발생했습니다")
      })
  }

  const handleClear = () => {
    setInputCss("")
    setOutputTailwind("")
    setError(null)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">CSS 입력</h2>
              <Button variant="outline" size="sm" onClick={handleClear} disabled={!inputCss}>
                <Trash2 className="mr-2 h-4 w-4" />
                초기화
              </Button>
            </div>
            <Textarea
              placeholder="여기에 CSS 코드를 입력하세요..."
              className="min-h-[300px] font-mono text-sm"
              value={inputCss}
              onChange={(e) => setInputCss(e.target.value)}
            />
            <div className="mt-4">
              <Button onClick={handleConvert} disabled={isProcessing || !inputCss} className="w-full">
                {isProcessing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    변환 중...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Tailwind로 변환
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Tailwind 결과</h2>
              <Button variant="outline" size="sm" onClick={handleCopyOutput} disabled={!outputTailwind}>
                <Copy className="mr-2 h-4 w-4" />
                복사
              </Button>
            </div>

            {error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>변환 오류</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <Textarea
                ref={outputRef}
                placeholder="변환된 Tailwind 클래스가 여기에 표시됩니다..."
                className="min-h-[300px] font-mono text-sm"
                value={outputTailwind}
                readOnly
              />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="options">
            <TabsList className="mb-4">
              <TabsTrigger value="options">변환 옵션</TabsTrigger>
              <TabsTrigger value="guide">사용 가이드</TabsTrigger>
            </TabsList>

            <TabsContent value="options">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="include-comments"
                    checked={options.includeComments}
                    onCheckedChange={(checked) => setOptions({ ...options, includeComments: checked })}
                  />
                  <Label htmlFor="include-comments">주석 포함</Label>
                </div>
                <p className="text-sm text-muted-foreground">변환된 결과에 원본 CSS 속성에 대한 주석을 포함합니다.</p>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="sort-classes"
                    checked={options.sortClasses}
                    onCheckedChange={(checked) => setOptions({ ...options, sortClasses: checked })}
                  />
                  <Label htmlFor="sort-classes">클래스 정렬</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Tailwind 클래스를 레이아웃, 타이포그래피, 색상 등의 카테고리별로 정렬합니다.
                </p>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="use-shorthand"
                    checked={options.useShorthand}
                    onCheckedChange={(checked) => setOptions({ ...options, useShorthand: checked })}
                  />
                  <Label htmlFor="use-shorthand">축약형 사용</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  가능한 경우 축약형 Tailwind 클래스를 사용합니다. (예: p-4 대신 py-4 px-4)
                </p>
              </div>
            </TabsContent>

            <TabsContent value="guide">
              <div className="space-y-4">
                <h3 className="font-medium">CSS → Tailwind 변환 가이드</h3>
                <p className="text-sm text-muted-foreground">
                  이 도구는 일반 CSS 코드를 Tailwind CSS 클래스로 변환합니다. 변환 과정에서 다음 사항을 참고하세요:
                </p>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">지원되는 CSS 속성</h4>
                  <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
                    <li>레이아웃: width, height, margin, padding, display, position 등</li>
                    <li>타이포그래피: font-size, font-weight, text-align, line-height 등</li>
                    <li>색상: color, background-color, border-color 등</li>
                    <li>테두리: border-width, border-style, border-radius 등</li>
                    <li>Flexbox 및 Grid 속성</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">제한 사항</h4>
                  <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
                    <li>복잡한 선택자는 완벽하게 변환되지 않을 수 있습니다.</li>
                    <li>모든 CSS 속성이 Tailwind에 직접적인 대응 클래스를 갖고 있지 않습니다.</li>
                    <li>미디어 쿼리는 Tailwind의 반응형 접두사로 변환됩니다. (예: sm:, md:, lg:)</li>
                    <li>CSS 변수와 계산식은 제한적으로 지원됩니다.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">예시</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded-md">
                      <p className="text-sm font-medium mb-2">CSS 입력:</p>
                      <pre className="text-xs overflow-auto p-2 bg-background rounded">
                        {`.card {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  margin: 0.5rem;
  border-radius: 0.25rem;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12);
}`}
                      </pre>
                    </div>
                    <div className="p-4 bg-muted rounded-md">
                      <p className="text-sm font-medium mb-2">Tailwind 출력:</p>
                      <pre className="text-xs overflow-auto p-2 bg-background rounded">
                        {`<div class="flex flex-col p-4 m-2 rounded bg-white shadow">
  <!-- 내용 -->
</div>`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">자주 묻는 질문</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">모든 CSS 속성이 변환되나요?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                모든 CSS 속성이 Tailwind 클래스로 직접 변환되지는 않습니다. Tailwind에서 지원하지 않는 일부 속성은
                변환되지 않거나 가장 가까운 대안으로 변환됩니다.
              </p>
            </div>

            <div>
              <h3 className="font-medium">변환된 코드를 어떻게 사용하나요?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                변환된 Tailwind 클래스를 HTML 요소의 class 속성에 직접 적용하면 됩니다. 기존 CSS 파일을 대체하고
                Tailwind CSS 프레임워크를 프로젝트에 설치해야 합니다.
              </p>
            </div>

            <div>
              <h3 className="font-medium">커스텀 속성(CSS 변수)은 어떻게 처리되나요?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                CSS 변수는 Tailwind의 theme 확장으로 변환되어야 하지만, 이 도구는 기본적인 변환만 제공합니다. 복잡한 CSS
                변수는 수동으로 Tailwind 구성에 추가해야 할 수 있습니다.
              </p>
            </div>

            <div>
              <h3 className="font-medium">변환 결과가 정확하지 않은 경우 어떻게 해야 하나요?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                변환 결과는 항상 수동으로 검토하고 필요에 따라 조정하는 것이 좋습니다. 이 도구는 완벽한 변환보다는
                Tailwind로의 마이그레이션을 돕기 위한 시작점을 제공합니다.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
