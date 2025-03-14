"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Globe, Send, RefreshCw, Trash2, Copy, Save, Clock, Plus, X, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { sendApiRequest, generateUUID } from "@/lib/apiUtils"
import { ScrollArea } from "@/components/ui/scroll-area"

// HTTP 메서드 타입
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS"

// 요청 헤더 타입
interface RequestHeader {
  id: string
  key: string
  value: string
  enabled: boolean
}

// 요청 파라미터 타입
interface RequestParam {
  id: string
  key: string
  value: string
  enabled: boolean
}

// 요청 본문 타입
type BodyType = "none" | "json" | "form-data" | "x-www-form-urlencoded" | "raw"

// 저장된 요청 타입
interface SavedRequest {
  id: string
  name: string
  url: string
  method: HttpMethod
  headers: RequestHeader[]
  params: RequestParam[]
  bodyType: BodyType
  body: string
}

// 응답 타입
interface ApiResponse {
  status: number
  statusText: string
  headers: Record<string, string>
  body: string
  time: number
  size: number
}

export default function APITester() {
  // 요청 상태
  const [url, setUrl] = useState<string>("")
  const [method, setMethod] = useState<HttpMethod>("GET")
  const [headers, setHeaders] = useState<RequestHeader[]>([
    { id: generateUUID(), key: "", value: "", enabled: true },
  ])
  const [params, setParams] = useState<RequestParam[]>([{ id: generateUUID(), key: "", value: "", enabled: true }])
  const [bodyType, setBodyType] = useState<BodyType>("none")
  const [requestBody, setRequestBody] = useState<string>("")

  // 응답 상태
  const [response, setResponse] = useState<ApiResponse | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // 저장된 요청
  const [savedRequests, setSavedRequests] = useState<SavedRequest[]>([])
  const [currentRequestName, setCurrentRequestName] = useState<string>("")

  // 기타 상태
  const [activeTab, setActiveTab] = useState<string>("params")
  const [responseTab, setResponseTab] = useState<string>("body")

  // 로컬 스토리지에서 저장된 요청 불러오기
  useEffect(() => {
    const saved = localStorage.getItem("savedApiRequests")
    if (saved) {
      try {
        setSavedRequests(JSON.parse(saved))
      } catch (e) {
        console.error("저장된 요청을 불러오는 중 오류가 발생했습니다:", e)
      }
    }
  }, [])

  // 헤더 추가
  const addHeader = () => {
    setHeaders([...headers, { id: generateUUID(), key: "", value: "", enabled: true }])
  }

  // 헤더 제거
  const removeHeader = (id: string) => {
    setHeaders(headers.filter((header) => header.id !== id))
  }

  // 헤더 업데이트
  const updateHeader = (id: string, field: "key" | "value" | "enabled", value: string | boolean) => {
    setHeaders(headers.map((header) => (header.id === id ? { ...header, [field]: value } : header)))
  }

  // 파라미터 추가
  const addParam = () => {
    setParams([...params, { id: generateUUID(), key: "", value: "", enabled: true }])
  }

  // 파라미터 제거
  const removeParam = (id: string) => {
    setParams(params.filter((param) => param.id !== id))
  }

  // 파라미터 업데이트
  const updateParam = (id: string, field: "key" | "value" | "enabled", value: string | boolean) => {
    setParams(params.map((param) => (param.id === id ? { ...param, [field]: value } : param)))
  }

  // URL에 파라미터 추가
  const getUrlWithParams = () => {
    if (!url) return ""

    const enabledParams = params.filter((param) => param.enabled && param.key)
    if (enabledParams.length === 0) return url

    const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`)
    enabledParams.forEach((param) => {
      urlObj.searchParams.append(param.key, param.value)
    })

    return urlObj.toString()
  }

  // 요청 보내기
  const sendRequest = async () => {
    if (!url) {
      toast("URL이 필요합니다 요청을 보낼 URL을 입력해주세요")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // 헤더 준비
      const headerObj: Record<string, string> = {}
      headers
        .filter((h) => h.enabled && h.key)
        .forEach((h) => {
          headerObj[h.key] = h.value
        })

      // 본문 준비
      let processedBody: any = null
      if (bodyType === "json" && requestBody) {
        try {
          processedBody = JSON.parse(requestBody)
          // Content-Type 헤더 자동 추가
          if (!headerObj["Content-Type"]) {
            headerObj["Content-Type"] = "application/json"
          }
        } catch (e) {
          toast("JSON 파싱 오류 유효한 JSON 형식이 아닙니다")
          setIsLoading(false)
          return
        }
      } else if (bodyType === "form-data") {
        processedBody = new FormData()
        try {
          const formData = JSON.parse(requestBody)
          Object.entries(formData).forEach(([key, value]) => {
            processedBody.append(key, value as string)
          })
        } catch (e) {
          toast("Form 데이터 파싱 오류 유효한 JSON 객체 형식이 아닙니다")
          setIsLoading(false)
          return
        }
      } else if (bodyType === "x-www-form-urlencoded") {
        const formData = new URLSearchParams()
        try {
          const urlEncodedData = JSON.parse(requestBody)
          Object.entries(urlEncodedData).forEach(([key, value]) => {
            formData.append(key, value as string)
          })
          processedBody = formData
          // Content-Type 헤더 자동 추가
          if (!headerObj["Content-Type"]) {
            headerObj["Content-Type"] = "application/x-www-form-urlencoded"
          }
        } catch (e) {
          toast("URL 인코딩 데이터 파싱 오류 유효한 JSON 객체 형식이 아닙니다")
          setIsLoading(false)
          return
        }
      } else if (bodyType === "raw" && requestBody) {
        processedBody = requestBody
      }

      // URL 준비 (파라미터 포함)
      const finalUrl = getUrlWithParams()

      // 요청 시작 시간
      const startTime = performance.now()

      // 요청 보내기
      const result = await sendApiRequest({
        url: finalUrl,
        method,
        headers: headerObj,
        body: processedBody,
      })

      // 요청 종료 시간
      const endTime = performance.now()
      const responseTime = endTime - startTime

      // 응답 크기 계산
      const responseSize = new Blob([result.body]).size

      // 응답 설정
      setResponse({
        status: result.status,
        statusText: result.statusText,
        headers: result.headers,
        body: result.body,
        time: responseTime,
        size: responseSize,
      })

      // 응답 탭을 본문으로 설정
      setResponseTab("body")

      toast(`요청 완료 상태 코드: ${result.status} ${result.statusText}`)
    } catch (err) {
      console.error("API 요청 오류:", err)
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다")
      toast("요청 실패 알 수 없는 오류가 발생했습니다")
    } finally {
      setIsLoading(false)
    }
  }

  // 요청 저장
  const saveRequest = () => {
    if (!url) {
      toast("URL이 필요합니다 저장할 요청의 URL을 입력해주세요")
      return
    }

    if (!currentRequestName) {
      toast("이름이 필요합니다 저장할 요청의 이름을 입력해주세요")
      return
    }

    const newRequest: SavedRequest = {
      id: generateUUID(),
      name: currentRequestName,
      url,
      method,
      headers,
      params,
      bodyType,
      body: requestBody,
    }

    const updatedRequests = [...savedRequests, newRequest]
    setSavedRequests(updatedRequests)

    // 로컬 스토리지에 저장
    localStorage.setItem("savedApiRequests", JSON.stringify(updatedRequests))

    toast(`요청 저장 완료 "${currentRequestName}" 요청이 저장되었습니다`)

    setCurrentRequestName("")
  }

  // 저장된 요청 불러오기
  const loadRequest = (request: SavedRequest) => {
    setUrl(request.url)
    setMethod(request.method)
    setHeaders(request.headers)
    setBodyType(request.bodyType)
    setRequestBody(request.body)

    // URL에서 쿼리 파라미터 파싱
    try {
      if (request.url && (request.url.includes("?") || request.url.includes("&"))) {
        const urlObj = new URL(request.url.startsWith("http") ? request.url : `https://${request.url}`)

        // URL에서 파라미터 추출
        const newParams = Array.from(urlObj.searchParams.entries()).map(([key, value]) => ({
          id: generateUUID(),
          key,
          value,
          enabled: true,
        }))

        if (newParams.length > 0) {
          // 빈 파라미터 추가
          if (!newParams.some((p) => p.key === "" && p.value === "")) {
            newParams.push({ id: generateUUID(), key: "", value: "", enabled: true })
          }

          setParams(newParams)
          // 파라미터 탭으로 전환
          setActiveTab("params")
        }
      } else {
        // URL에 쿼리 파라미터가 없는 경우 기본 파라미터 설정
        setParams([{ id: generateUUID(), key: "", value: "", enabled: true }])
      }
    } catch (e) {
      console.error("URL 파싱 오류:", e)
      // 오류 발생 시 기본 파라미터 설정
      setParams([{ id: generateUUID(), key: "", value: "", enabled: true }])
    }

    toast(`요청 불러오기 완료 ${request.name} 요청을 불러왔습니다`)
  }

  // 저장된 요청 삭제
  const deleteRequest = (id: string) => {
    const updatedRequests = savedRequests.filter((req) => req.id !== id)
    setSavedRequests(updatedRequests)

    // 로컬 스토리지 업데이트
    localStorage.setItem("savedApiRequests", JSON.stringify(updatedRequests))

    toast("요청 삭제 완료 요청이 삭제되었습니다")
  }

  // 모든 필드 초기화
  const clearAll = () => {
    setUrl("")
    setMethod("GET")
    setHeaders([{ id: generateUUID(), key: "", value: "", enabled: true }])
    setParams([{ id: generateUUID(), key: "", value: "", enabled: true }])
    setBodyType("none")
    setRequestBody("")
    setResponse(null)
    setError(null)
    setCurrentRequestName("")

    toast("초기화 완료 모든 필드가 초기화되었습니다")
  }

  // 응답 복사
  const copyResponse = () => {
    if (!response) return

    navigator.clipboard
      .writeText(response.body)
      .then(() => {
        toast("복사 완료 응답 본문이 클립보드에 복사되었습니다")
      })
      .catch((err) => {
        console.error("복사 오류:", err)
        toast("복사 실패 클립보드에 복사하는 중 오류가 발생했습니다")
      })
  }

  // 응답 상태에 따른 배지 색상
  const getStatusBadgeVariant = (status: number) => {
    if (status >= 200 && status < 300) return "success"
    if (status >= 300 && status < 400) return "warning"
    if (status >= 400) return "destructive"
    return "default"
  }

  // 응답 시간 포맷
  const formatResponseTime = (time: number) => {
    if (time < 1000) return `${Math.round(time)}ms`
    return `${(time / 1000).toFixed(2)}s`
  }

  // 응답 크기 포맷
  const formatResponseSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)}KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)}MB`
  }

  // JSON 포맷팅
  const formatResponseJson = () => {
    if (!response) return ""

    try {
      const parsed = JSON.parse(response.body)
      return JSON.stringify(parsed, null, 2)
    } catch (e) {
      return response.body
    }
  }

  // 본문 타입에 따른 placeholder 텍스트
  const getBodyPlaceholder = () => {
    switch (bodyType) {
      case "json":
        return `{
            "key": "value",
            "number": 123,
            "boolean": true,
            "array": [1, 2, 3],
            "object": {
                "nested": "value"
            }
        }`
    
      case "form-data":
        return `{
            "name": "John Doe",
            "email": "john@example.com",
            "file": "파일 업로드는 지원되지 않습니다"
        }`

      case "x-www-form-urlencoded":
        return `{
            "name": "John Doe",
            "email": "john@example.com"
        }`

      case "raw":
        return "텍스트 본문을 입력하세요"

      default:
        return ""
    }
  }

    // URL 입력 핸들러 수정 (약 85줄 근처)
  // setUrl 함수 부분을 수정합니다
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value
    setUrl(newUrl)

    // URL에 쿼리 파라미터가 있는지 확인하고 파싱
    try {
      if (newUrl && (newUrl.includes("?") || newUrl.includes("&"))) {
        const urlObj = new URL(newUrl.startsWith("http") ? newUrl : `https://${newUrl}`)

        // 기존 파라미터 유지하면서 새 파라미터만 추가
        const newParams = Array.from(urlObj.searchParams.entries()).map(([key, value]) => ({
          id: generateUUID(),
          key,
          value,
          enabled: true,
        }))

        if (newParams.length > 0) {
          // 기존 빈 파라미터는 제거하고 새 파라미터 추가
          const existingParams = params.filter((p) => p.key !== "" || p.value !== "")
          const mergedParams = [...existingParams]

          // 중복되지 않는 새 파라미터만 추가
          newParams.forEach((newParam) => {
            if (!existingParams.some((p) => p.key === newParam.key && p.value === newParam.value)) {
              mergedParams.push(newParam)
            }
          })

          // 빈 파라미터가 없으면 하나 추가
          if (!mergedParams.some((p) => p.key === "" && p.value === "")) {
            mergedParams.push({ id: generateUUID(), key: "", value: "", enabled: true })
          }

          setParams(mergedParams)

          // 파라미터 탭으로 전환
          setActiveTab("params")
        }
      }
    } catch (e) {
      // URL 파싱 오류는 무시 (사용자가 URL을 입력 중일 수 있음)
      console.log("URL 파싱 중 오류:", e)
    }
  }

  return (
    <div className="space-y-6">
      {/* 요청 URL 및 메서드 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/5">
              <Label htmlFor="method">HTTP 메서드</Label>
              <Select value={method} onValueChange={(value) => setMethod(value as HttpMethod)}>
                <SelectTrigger id="method" className="mt-2">
                  <SelectValue placeholder="메서드 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                  <SelectItem value="HEAD">HEAD</SelectItem>
                  <SelectItem value="OPTIONS">OPTIONS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label htmlFor="url">요청 URL</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="url"
                  placeholder="https://api.example.com/endpoint"
                  value={url}
                  onChange={handleUrlChange}
                  className="flex-1"
                />
                <Button onClick={sendRequest} disabled={isLoading || !url} className="whitespace-nowrap">
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      요청 중...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      요청 보내기
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-between items-center mt-4 gap-2">
            <div className="flex items-center gap-2">
              <Input
                placeholder="요청 이름"
                value={currentRequestName}
                onChange={(e) => setCurrentRequestName(e.target.value)}
                className="w-48"
              />
              <Button variant="outline" size="sm" onClick={saveRequest} disabled={!url || !currentRequestName}>
                <Save className="mr-2 h-4 w-4" />
                저장
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={clearAll}>
              <Trash2 className="mr-2 h-4 w-4" />
              모두 지우기
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 저장된 요청 목록 */}
        <Card className="md:col-span-1">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">저장된 요청</h2>
            {savedRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Globe className="mx-auto h-12 w-12 mb-2 opacity-20" />
                <p>저장된 요청이 없습니다</p>
                <p className="text-sm">요청을 저장하면 여기에 표시됩니다</p>
              </div>
            ) : (
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">
                  {savedRequests.map((req) => (
                    <div key={req.id} className="border rounded-md p-3 hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium truncate flex-1 mr-2">{req.name}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteRequest(req.id)}
                          className="h-6 w-6 p-0 flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">삭제</span>
                        </Button>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs flex-shrink-0">
                            {req.method}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground break-all">{req.url}</div>
                        <Button variant="outline" size="sm" className="w-full h-8" onClick={() => loadRequest(req)}>
                          불러오기
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* 요청 설정 */}
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="params">파라미터</TabsTrigger>
                <TabsTrigger value="headers">헤더</TabsTrigger>
                <TabsTrigger value="body">본문</TabsTrigger>
              </TabsList>

              <TabsContent value="params">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">쿼리 파라미터</h3>
                    <Button variant="outline" size="sm" onClick={addParam}>
                      <Plus className="h-4 w-4 mr-2" />
                      파라미터 추가
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {params.map((param) => (
                      <div key={param.id} className="flex items-center gap-2">
                        <Switch
                          checked={param.enabled}
                          onCheckedChange={(checked) => updateParam(param.id, "enabled", checked)}
                        />
                        <Input
                          placeholder="키"
                          value={param.key}
                          onChange={(e) => updateParam(param.id, "key", e.target.value)}
                          className="flex-1"
                          disabled={!param.enabled}
                        />
                        <Input
                          placeholder="값"
                          value={param.value}
                          onChange={(e) => updateParam(param.id, "value", e.target.value)}
                          className="flex-1"
                          disabled={!param.enabled}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeParam(param.id)}
                          className="h-10 w-10 p-0"
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">삭제</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="headers">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">요청 헤더</h3>
                    <Button variant="outline" size="sm" onClick={addHeader}>
                      <Plus className="h-4 w-4 mr-2" />
                      헤더 추가
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {headers.map((header) => (
                      <div key={header.id} className="flex items-center gap-2">
                        <Switch
                          checked={header.enabled}
                          onCheckedChange={(checked) => updateHeader(header.id, "enabled", checked)}
                        />
                        <Input
                          placeholder="헤더 이름"
                          value={header.key}
                          onChange={(e) => updateHeader(header.id, "key", e.target.value)}
                          className="flex-1"
                          disabled={!header.enabled}
                        />
                        <Input
                          placeholder="헤더 값"
                          value={header.value}
                          onChange={(e) => updateHeader(header.id, "value", e.target.value)}
                          className="flex-1"
                          disabled={!header.enabled}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeHeader(header.id)}
                          className="h-10 w-10 p-0"
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">삭제</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="body">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="body-type">본문 타입</Label>
                    <Select
                      value={bodyType}
                      onValueChange={(value) => setBodyType(value as BodyType)}
                      disabled={method === "GET" || method === "HEAD"}
                    >
                      <SelectTrigger id="body-type" className="mt-2">
                        <SelectValue placeholder="본문 타입 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">없음</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="form-data">Form Data</SelectItem>
                        <SelectItem value="x-www-form-urlencoded">x-www-form-urlencoded</SelectItem>
                        <SelectItem value="raw">Raw</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {bodyType !== "none" && (
                    <div>
                      <Label htmlFor="request-body">요청 본문</Label>
                      <Textarea
                        id="request-body"
                        placeholder={getBodyPlaceholder()}
                        value={requestBody}
                        onChange={(e) => setRequestBody(e.target.value)}
                        className="mt-2 min-h-[200px] font-mono text-sm"
                        disabled={method === "GET" || method === "HEAD"}
                      />
                    </div>
                  )}

                  {(method === "GET" || method === "HEAD") && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>본문 없음</AlertTitle>
                      <AlertDescription>GET 및 HEAD 요청은 일반적으로 본문을 포함하지 않습니다.</AlertDescription>
                    </Alert>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* 응답 결과 */}
      {(response || error) && (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">응답 결과</h2>

            {error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>요청 오류</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              response && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={getStatusBadgeVariant(response.status) as any} className="px-3 py-1 text-sm">
                      {response.status} {response.statusText}
                    </Badge>

                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatResponseTime(response.time)}
                    </div>

                    <div className="text-sm text-muted-foreground">{formatResponseSize(response.size)}</div>

                    <div className="ml-auto">
                      <Button variant="outline" size="sm" onClick={copyResponse}>
                        <Copy className="mr-2 h-4 w-4" />
                        응답 복사
                      </Button>
                    </div>
                  </div>

                  <Tabs value={responseTab} onValueChange={setResponseTab}>
                    <TabsList>
                      <TabsTrigger value="body">본문</TabsTrigger>
                      <TabsTrigger value="headers">헤더</TabsTrigger>
                    </TabsList>

                    <TabsContent value="body">
                      <div className="border rounded-md p-4 mt-2">
                        <pre className="whitespace-pre-wrap font-mono text-sm overflow-auto max-h-[400px]">
                          {formatResponseJson()}
                        </pre>
                      </div>
                    </TabsContent>

                    <TabsContent value="headers">
                      <div className="border rounded-md p-4 mt-2">
                        <div className="space-y-2">
                          {Object.entries(response.headers).map(([key, value]) => (
                            <div key={key} className="flex">
                              <div className="font-medium min-w-[200px] mr-4">{key}:</div>
                              <div className="font-mono text-sm">{value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

