"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Link2, Plus, Trash2, Copy, RefreshCw, Download, Upload, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from 'sonner';

interface QueryParam {
  id: string
  key: string
  value: string
}

export default function QueryStringPage() {
  const [url, setUrl] = useState<string>("")
  const [parsedParams, setParsedParams] = useState<QueryParam[]>([])
  const [builderParams, setBuilderParams] = useState<QueryParam[]>([{ id: "1", key: "", value: "" }])
  const [baseUrl, setBaseUrl] = useState<string>("")
  const [builtUrl, setBuiltUrl] = useState<string>("")
  const [parseError, setParseError] = useState<string>("")

  // URL 파싱
  const parseUrl = () => {
    try {
      setParseError("")

      if (!url.trim()) {
        setParseError("URL을 입력해주세요.")
        setParsedParams([])
        return
      }

      // URL 객체로 파싱 시도
      let urlObj: URL
      try {
        urlObj = new URL(url)
      } catch {
        // 전체 URL이 아닌 경우, 쿼리 스트링만 파싱
        const queryString = url.includes("?") ? url.split("?")[1] : url
        urlObj = new URL(`http://example.com?${queryString}`)
      }

      const params: QueryParam[] = []
      urlObj.searchParams.forEach((value, key) => {
        params.push({
          id: Math.random().toString(36).substring(2, 9),
          key,
          value,
        })
      })

      if (params.length === 0) {
        setParseError("쿼리 파라미터를 찾을 수 없습니다.")
      }

      setParsedParams(params)
      toast(`${params.length}개의 파라미터를 찾았습니다.`);
    } catch (error) {
      setParseError("유효하지 않은 URL 형식입니다.")
      setParsedParams([])
      toast("URL 파싱에 실패했습니다.");
    }
  }

  // URL 빌드
  useEffect(() => {
    try {
      const validParams = builderParams.filter((param) => param.key.trim() !== "")

      if (!baseUrl.trim() && validParams.length === 0) {
        setBuiltUrl("")
        return
      }

      const base = baseUrl.trim() || "https://example.com"
      const urlObj = new URL(base)

      // 기존 쿼리 파라미터 제거
      urlObj.search = ""

      // 새 파라미터 추가
      validParams.forEach((param) => {
        if (param.key.trim()) {
          urlObj.searchParams.append(param.key.trim(), param.value)
        }
      })

      setBuiltUrl(urlObj.toString())
    } catch (error) {
      // Base URL이 유효하지 않은 경우 쿼리 스트링만 표시
      const validParams = builderParams.filter((param) => param.key.trim() !== "")
      if (validParams.length > 0) {
        const queryString = validParams
          .map((param) => `${encodeURIComponent(param.key)}=${encodeURIComponent(param.value)}`)
          .join("&")
        setBuiltUrl(`?${queryString}`)
      } else {
        setBuiltUrl("")
      }
    }
  }, [baseUrl, builderParams])

  // 파라미터 추가
  const addBuilderParam = () => {
    setBuilderParams([...builderParams, { id: Math.random().toString(36).substring(2, 9), key: "", value: "" }])
  }

  // 파라미터 삭제
  const removeBuilderParam = (id: string) => {
    if (builderParams.length === 1) {
      setBuilderParams([{ id: "1", key: "", value: "" }])
    } else {
      setBuilderParams(builderParams.filter((param) => param.id !== id))
    }
  }

  // 파라미터 업데이트
  const updateBuilderParam = (id: string, field: "key" | "value", newValue: string) => {
    setBuilderParams(builderParams.map((param) => (param.id === id ? { ...param, [field]: newValue } : param)))
  }

  // 파싱된 파라미터를 빌더로 가져오기
  const loadToBuilder = () => {
    if (parsedParams.length === 0) {
      toast("먼저 URL을 파싱해주세요.");
      return
    }

    setBuilderParams(parsedParams.map((param) => ({ ...param })))

    // Base URL 설정
    try {
      const urlObj = new URL(url)
      setBaseUrl(`${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`)
    } catch {
      setBaseUrl("")
    }

    toast("불러오기 완료: 파싱된 파라미터를 빌더로 가져왔습니다.");
  }

  // 초기화
  const resetBuilder = () => {
    setBuilderParams([{ id: "1", key: "", value: "" }])
    setBaseUrl("")
    toast("초기화 완료: 빌더가 초기화되었습니다.");
  }

  // 클립보드에 복사
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast("클립보드에 복사되었습니다.");
  }

  // JSON으로 내보내기
  const exportAsJson = (params: QueryParam[]) => {
    const data = params.reduce(
      (acc, param) => {
        if (param.key) {
          acc[param.key] = param.value
        }
        return acc
      },
      {} as Record<string, string>,
    )

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `query-params-${new Date().toISOString()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast("내보내기 완료: JSON 파일로 저장되었습니다.");
  }

  // 예시 URL 목록
  const exampleUrls = [
    "https://example.com/search?q=test&page=1&sort=desc",
    "https://api.example.com/users?filter=active&limit=10&offset=0",
    "https://shop.example.com/products?category=electronics&price_min=100&price_max=500&brand=samsung",
    "?utm_source=google&utm_medium=cpc&utm_campaign=spring_sale",
  ]

  return (
    <div className="container py-10">
      <div className="flex flex-col items-center max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Link2 className="h-8 w-8 mr-2" />
          <h1 className="text-3xl font-bold">URL Query String 파서 & 빌더</h1>
        </div>

        <p className="text-muted-foreground text-center mb-8">
          URL의 쿼리 스트링을 파싱하거나 새로운 쿼리 스트링을 생성할 수 있는 도구입니다.
        </p>

        <Tabs defaultValue="parser" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="parser">파서 (Parser)</TabsTrigger>
            <TabsTrigger value="builder">빌더 (Builder)</TabsTrigger>
          </TabsList>

          {/* 파서 탭 */}
          <TabsContent value="parser" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>URL 파싱</CardTitle>
                <CardDescription>전체 URL 또는 쿼리 스트링을 입력하여 파라미터를 추출합니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url-input">URL 또는 Query String</Label>
                  <div className="flex gap-2">
                    <Input
                      id="url-input"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com?key1=value1&key2=value2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          parseUrl()
                        }
                      }}
                    />
                    <Button onClick={parseUrl}>파싱</Button>
                  </div>
                </div>

                {parseError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{parseError}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label>예시 URL</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {exampleUrls.map((exampleUrl, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="justify-start h-auto py-2 text-left bg-transparent"
                        onClick={() => setUrl(exampleUrl)}
                      >
                        <span className="text-xs truncate">{exampleUrl}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>파싱 결과</CardTitle>
                    <CardDescription>추출된 쿼리 파라미터 목록</CardDescription>
                  </div>
                  {parsedParams.length > 0 && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => exportAsJson(parsedParams)}>
                        <Download className="h-4 w-4 mr-1" />
                        JSON
                      </Button>
                      <Button variant="outline" size="sm" onClick={loadToBuilder}>
                        <Upload className="h-4 w-4 mr-1" />
                        빌더로
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {parsedParams.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <AlertCircle className="h-12 w-12 mb-2 opacity-50" />
                    <p>파싱된 파라미터가 없습니다</p>
                    <p className="text-xs">URL을 입력하고 파싱 버튼을 클릭하세요</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {parsedParams.map((param) => (
                        <div key={param.id} className="border rounded-md p-3 bg-muted/30">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-xs text-muted-foreground">Key</Label>
                              <div className="flex items-center gap-2 mt-1">
                                <code className="text-sm bg-background px-2 py-1 rounded flex-1">{param.key}</code>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => copyToClipboard(param.key)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Value</Label>
                              <div className="flex items-center gap-2 mt-1">
                                <code className="text-sm bg-background px-2 py-1 rounded flex-1 break-all">
                                  {param.value || <span className="text-muted-foreground">(empty)</span>}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => copyToClipboard(param.value)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 pt-2 border-t">
                            <Label className="text-xs text-muted-foreground">Decoded Value</Label>
                            <p className="text-sm mt-1 break-all">
                              {decodeURIComponent(param.value) || (
                                <span className="text-muted-foreground">(empty)</span>
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 빌더 탭 */}
          <TabsContent value="builder" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Query String 빌더</CardTitle>
                    <CardDescription>파라미터를 추가하여 쿼리 스트링을 생성합니다.</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={resetBuilder}>
                    <RefreshCw className="h-4 w-4 mr-1" />
                    초기화
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="base-url">Base URL (선택사항)</Label>
                  <Input
                    id="base-url"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    placeholder="https://example.com/path"
                  />
                  <p className="text-xs text-muted-foreground">Base URL 없이 쿼리 스트링만 생성하려면 비워두세요</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Query Parameters</Label>
                    <Button variant="outline" size="sm" onClick={addBuilderParam}>
                      <Plus className="h-4 w-4 mr-1" />
                      추가
                    </Button>
                  </div>

                  <ScrollArea className="h-[300px] border rounded-md p-4">
                    <div className="space-y-3">
                      {builderParams.map((param, index) => (
                        <div key={param.id} className="flex gap-2 items-start">
                          <div className="flex-1 grid grid-cols-2 gap-2">
                            <Input
                              value={param.key}
                              onChange={(e) => updateBuilderParam(param.id, "key", e.target.value)}
                              placeholder="Key"
                            />
                            <Input
                              value={param.value}
                              onChange={(e) => updateBuilderParam(param.id, "value", e.target.value)}
                              placeholder="Value"
                            />
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10 bg-transparent"
                            onClick={() => removeBuilderParam(param.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>생성된 URL</CardTitle>
                    <CardDescription>파라미터로부터 생성된 최종 URL</CardDescription>
                  </div>
                  {builtUrl && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(builtUrl)}>
                        <Copy className="h-4 w-4 mr-1" />
                        복사
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportAsJson(builderParams.filter((p) => p.key.trim() !== ""))}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        JSON
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {builtUrl ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Complete URL</Label>
                      <Textarea
                        value={builtUrl}
                        readOnly
                        className="min-h-[100px] font-mono text-sm"
                        onClick={(e) => e.currentTarget.select()}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Query String Only</Label>
                      <Textarea
                        value={builtUrl.includes("?") ? builtUrl.split("?")[1] : builtUrl}
                        readOnly
                        className="min-h-[80px] font-mono text-sm"
                        onClick={(e) => e.currentTarget.select()}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <Label className="text-xs text-muted-foreground">파라미터 수</Label>
                        <p className="text-2xl font-bold">{builderParams.filter((p) => p.key.trim() !== "").length}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">URL 길이</Label>
                        <p className="text-2xl font-bold">{builtUrl.length}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <AlertCircle className="h-12 w-12 mb-2 opacity-50" />
                    <p>생성된 URL이 없습니다</p>
                    <p className="text-xs">파라미터를 추가하여 URL을 생성하세요</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
