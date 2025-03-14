"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Copy,
  FileJson,
  RefreshCw,
  Trash2,
  Check,
  AlertCircle,
  Download,
  Upload,
  Search,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { toast } from "sonner"
import { formatJson, minifyJson, validateJson } from "@/lib/jsonUtils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

interface JsonNode {
  key: string
  value: unknown
  type: string
  children?: JsonNode[]
  path: string
}

export default function JSONFormatter() {
  const [inputJson, setInputJson] = useState<string>("")
  const [outputJson, setOutputJson] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [jsonTree, setJsonTree] = useState<JsonNode[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set())
  const [options, setOptions] = useState({
    indentSize: 2,
    sortKeys: false,
  })

  const outputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 입력 JSON이 변경될 때마다 유효성 검사
  useEffect(() => {
    if (inputJson.trim()) {
      const { isValid, error } = validateJson(inputJson)
      setIsValid(isValid)
      setErrorMessage(error || "")
    } else {
      setIsValid(null)
      setErrorMessage("")
    }
  }, [inputJson])

  const buildJsonTree = (json: unknown, path = ""): JsonNode[] => {
    if (!json) return []

    if (Array.isArray(json)) {
      return json.map((item, index) => {
        const itemPath = `${path}[${index}]`
        const itemType = typeof item

        if (item !== null && typeof item === "object") {
          return {
            key: `[${index}]`,
            value: item,
            type: Array.isArray(item) ? "array" : "object",
            children: buildJsonTree(item, itemPath),
            path: itemPath,
          }
        } else {
          return {
            key: `[${index}]`,
            value: item,
            type: itemType,
            path: itemPath,
          }
        }
      })
    } else if (typeof json === "object" && json !== null) {
      return Object.keys(json).map((key) => {
        const itemPath = path ? `${path}.${key}` : key
        const value = (json as { [key: string]: unknown })[key]
        const valueType = typeof value

        if (value !== null && typeof value === "object") {
          return {
            key,
            value,
            type: Array.isArray(value) ? "array" : "object",
            children: buildJsonTree(value, itemPath),
            path: itemPath,
          }
        } else {
          return {
            key,
            value,
            type: valueType,
            path: itemPath,
          }
        }
      })
    }

    return []
  }

  const handleFormat = async () => {
    if (!inputJson.trim()) {
      toast("입력 오류 JSON을 입력해주세요")
      return
    }

    setIsProcessing(true)
    try {
      const { isValid, error, formattedJson } = formatJson(inputJson, options)

      if (!isValid) {
        setIsValid(false)
        setErrorMessage(error || "유효하지 않은 JSON 형식입니다.")
        toast("포맷팅 실패 유효하지 않은 JSON 형식입니다.")
      } else {
        setIsValid(true)
        setErrorMessage("")
        setOutputJson(formattedJson || "")

        // JSON 트리 구성
        try {
          const parsedJson = JSON.parse(formattedJson || "")
          const tree = buildJsonTree(parsedJson)
          setJsonTree(tree)
          // 기본적으로 첫 번째 레벨만 확장
          const newExpandedPaths = new Set<string>()
          tree.forEach((node) => {
            newExpandedPaths.add(node.path)
          })
          setExpandedPaths(newExpandedPaths)
        } catch (e) {
          console.error("JSON 트리 구성 오류:", e)
        }

        toast("포맷팅 완료 JSON이 성공적으로 포맷팅되었습니다.")
      }
    } catch (error) {
      console.error("포맷팅 오류:", error)
      toast("포맷팅 실패 JSON 포맷팅 중 오류가 발생했습니다.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleMinify = async () => {
    if (!inputJson.trim()) {
      toast("입력 오류 JSON을 입력해주세요")
      return
    }

    setIsProcessing(true)
    try {
      const { isValid, error, minifiedJson } = minifyJson(inputJson)

      if (!isValid) {
        setIsValid(false)
        setErrorMessage(error || "유효하지 않은 JSON 형식입니다.")
        toast("압축 실패 유효하지 않은 JSON 형식입니다.")
      } else {
        setIsValid(true)
        setErrorMessage("")
        setOutputJson(minifiedJson || "")

        // JSON 트리 구성
        try {
          const parsedJson = JSON.parse(minifiedJson || "")
          setJsonTree(buildJsonTree(parsedJson))
        } catch (e) {
          console.error("JSON 트리 구성 오류:", e)
        }

        toast("압축 완료 JSON이 성공적으로 압축되었습니다.")
      }
    } catch (error) {
      console.error("압축 오류:", error)
      toast("압축 실패 JSON 압축 중 오류가 발생했습니다.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCopyOutput = () => {
    if (!outputJson) {
      toast("복사 오류 복사할 결과가 없습니다")
      return
    }

    navigator.clipboard
      .writeText(outputJson)
      .then(() => {
        toast("복사 완료 결과가 클립보드에 복사되었습니다")
      })
      .catch((error) => {
        console.error("복사 오류:", error)
        toast("복사 실패 클립보드에 복사하는 중 오류가 발생했습니다")
      })
  }

  const handleClear = () => {
    setInputJson("")
    setOutputJson("")
    setIsValid(null)
    setErrorMessage("")
    setJsonTree([])
    setSearchQuery("")
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setInputJson(content)
    }
    reader.onerror = () => {
      toast("파일 읽기 오류 파일을 읽는 중 오류가 발생했습니다")
    }
    reader.readAsText(file)
  }

  const handleDownload = () => {
    if (!outputJson) {
      toast("다운로드 오류 다운로드할 결과가 없습니다")
      return
    }

    const blob = new Blob([outputJson], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "formatted-json.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const togglePath = (path: string) => {
    const newExpandedPaths = new Set(expandedPaths)
    if (newExpandedPaths.has(path)) {
      newExpandedPaths.delete(path)
    } else {
      newExpandedPaths.add(path)
    }
    setExpandedPaths(newExpandedPaths)
  }

  const expandAll = () => {
    const allPaths = new Set<string>()

    const collectPaths = (nodes: JsonNode[]) => {
      nodes.forEach((node) => {
        allPaths.add(node.path)
        if (node.children) {
          collectPaths(node.children)
        }
      })
    }

    collectPaths(jsonTree)
    setExpandedPaths(allPaths)
  }

  const collapseAll = () => {
    setExpandedPaths(new Set())
  }

  const renderJsonNode = (node: JsonNode, level = 0) => {
    const isExpanded = expandedPaths.has(node.path)
    const hasChildren = node.children && node.children.length > 0
    const isMatch =
      searchQuery &&
      (node.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (typeof node.value === "string" && node.value.toLowerCase().includes(searchQuery.toLowerCase())))

    const nodeClasses = `pl-${level * 4} py-1 border-l-2 hover:bg-muted/50 ${isMatch ? "bg-yellow-100 dark:bg-yellow-900/30" : ""}`

    return (
      <div key={node.path} className={nodeClasses}>
        <div className="flex items-center">
          {hasChildren ? (
            <button onClick={() => togglePath(node.path)} className="mr-1 p-1 rounded-sm hover:bg-muted">
              {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </button>
          ) : (
            <span className="w-5"></span>
          )}

          <span className="font-medium text-blue-600 dark:text-blue-400">{node.key}: </span>

          {!hasChildren && (
            <>
              {node.type === "string" && <span className="text-green-600 dark:text-green-400">{node.value as number}</span>}
              {node.type === "number" && <span className="text-purple-600 dark:text-purple-400">{node.value as number}</span>}
              {node.type === "boolean" && (
                <span className="text-orange-600 dark:text-orange-400">{String(node.value)}</span>
              )}
              {node.value === null && <span className="text-gray-600 dark:text-gray-400">null</span>}
            </>
          )}

          {hasChildren && (
            <span className="text-gray-600 dark:text-gray-400">
              {node.type === "array" ? "Array" : "Object"}
              <Badge variant="outline" className="ml-2 text-xs">
                {node.children?.length} {node.type === "array" ? "items" : "properties"}
              </Badge>
            </span>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-2">{node.children?.map((childNode) => renderJsonNode(childNode, level + 1))}</div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">입력 JSON</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  파일 열기
                </Button>
                <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleFileUpload} />
                <Button variant="outline" size="sm" onClick={handleClear} disabled={!inputJson}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  초기화
                </Button>
              </div>
            </div>
            <Textarea
              placeholder="여기에 JSON을 입력하세요..."
              className="min-h-[300px] font-mono text-sm"
              value={inputJson}
              onChange={(e) => setInputJson(e.target.value)}
            />

            {isValid === false && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>유효하지 않은 JSON</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {isValid === true && (
              <Alert className="mt-4 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertTitle className="text-green-600 dark:text-green-400">유효한 JSON</AlertTitle>
                <AlertDescription>JSON 형식이 올바릅니다.</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">출력 결과</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopyOutput} disabled={!outputJson}>
                  <Copy className="h-4 w-4 mr-2" />
                  복사
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload} disabled={!outputJson}>
                  <Download className="h-4 w-4 mr-2" />
                  다운로드
                </Button>
              </div>
            </div>
            <Textarea
              ref={outputRef}
              placeholder="결과가 여기에 표시됩니다..."
              className="min-h-[300px] font-mono text-sm"
              value={outputJson}
              readOnly
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="format">
            <TabsList className="mb-4">
              <TabsTrigger value="format">포맷팅</TabsTrigger>
              <TabsTrigger value="minify">압축</TabsTrigger>
              <TabsTrigger value="options">옵션</TabsTrigger>
            </TabsList>

            <TabsContent value="format">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  JSON을 보기 좋게 포맷팅합니다. 들여쓰기와 줄바꿈을 추가하여 가독성을 높입니다.
                </p>
                <Button className="w-full" onClick={handleFormat} disabled={!inputJson || isProcessing}>
                  {isProcessing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      처리 중...
                    </>
                  ) : (
                    <>
                      <FileJson className="mr-2 h-4 w-4" />
                      JSON 포맷팅하기
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="minify">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  JSON을 압축하여 파일 크기를 줄입니다. 공백과 줄바꿈을 제거하여 전송 속도를 개선합니다.
                </p>
                <Button className="w-full" onClick={handleMinify} disabled={!inputJson || isProcessing}>
                  {isProcessing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      처리 중...
                    </>
                  ) : (
                    <>
                      <FileJson className="mr-2 h-4 w-4" />
                      JSON 압축하기
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="options">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="indent-size">들여쓰기 크기</Label>
                  <Input
                    id="indent-size"
                    type="number"
                    min="1"
                    max="8"
                    value={options.indentSize}
                    onChange={(e) => setOptions({ ...options, indentSize: Number.parseInt(e.target.value) || 2 })}
                    className="w-full max-w-xs"
                  />
                  <p className="text-xs text-muted-foreground">포맷팅 시 사용할 들여쓰기 공백 수</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="sort-keys"
                    checked={options.sortKeys}
                    onCheckedChange={(checked) => setOptions({ ...options, sortKeys: checked })}
                  />
                  <Label htmlFor="sort-keys">키 정렬</Label>
                </div>
                <p className="text-xs text-muted-foreground">객체의 키를 알파벳 순으로 정렬합니다</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {jsonTree.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">JSON 트리 뷰</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={expandAll}>
                  모두 펼치기
                </Button>
                <Button variant="outline" size="sm" onClick={collapseAll}>
                  모두 접기
                </Button>
              </div>
            </div>

            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="JSON 트리 검색..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="border rounded-md p-4 max-h-[400px] overflow-auto font-mono text-sm">
              {jsonTree.map((node) => renderJsonNode(node))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

