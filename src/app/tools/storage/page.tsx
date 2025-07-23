"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { AlertCircle, Copy, Database, Download, Eye, EyeOff, Plus, RefreshCw, Search, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

interface StorageItem {
  key: string
  value: string
  size: number
  isJSON: boolean
  parsedValue?: any
}

type StorageType = "localStorage" | "sessionStorage"

export default function StorageViewer() {
  const [activeTab, setActiveTab] = useState<StorageType>("localStorage")
  const [localStorageItems, setLocalStorageItems] = useState<StorageItem[]>([])
  const [sessionStorageItems, setSessionStorageItems] = useState<StorageItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newItem, setNewItem] = useState({ key: "", value: "" })
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [isClient, setIsClient] = useState(false)

  // 클라이언트 사이드에서만 실행되도록 보장
  useEffect(() => {
    setIsClient(true)
  }, [])

  const parseStorageItems = (storage: Storage): StorageItem[] => {
    const items: StorageItem[] = []

    try {
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i)
        if (!key) continue

        const value = storage.getItem(key) || ""
        let isJSON = false
        let parsedValue = null

        try {
          parsedValue = JSON.parse(value)
          isJSON = true
        } catch {
          // Not JSON, keep as string
        }

        items.push({
          key,
          value,
          size: new Blob([value]).size,
          isJSON,
          parsedValue,
        })
      }
    } catch (error) {
      console.error("Error parsing storage items:", error)
    }

    return items.sort((a, b) => a.key.localeCompare(b.key))
  }

  const loadData = () => {
    if (!isClient) return

    try {
      // 로컬스토리지 로드
      if (typeof window !== "undefined" && window.localStorage) {
        setLocalStorageItems(parseStorageItems(localStorage))
      }

      // 세션스토리지 로드
      if (typeof window !== "undefined" && window.sessionStorage) {
        setSessionStorageItems(parseStorageItems(sessionStorage))
      }
    } catch (error) {
      console.error("Error loading data:", error)
      toast("스토리지 데이터를 불러오는 중 오류가 발생했습니다.");
    }
  }

  useEffect(() => {
    if (isClient) {
      loadData()

      // 스토리지 변경 감지
      const handleStorageChange = () => {
        loadData()
      }

      window.addEventListener("storage", handleStorageChange)
      return () => window.removeEventListener("storage", handleStorageChange)
    }
  }, [isClient])

  const addStorageItem = (storage: Storage, key: string, value: string) => {
    try {
      storage.setItem(key, value)
      loadData()
    } catch (error) {
      console.error("Error adding storage item:", error)
      toast("스토리지 용량이 부족하거나 오류가 발생했습니다.");
    }
  }

  const deleteStorageItem = (storage: Storage, key: string) => {
    try {
      storage.removeItem(key)
      loadData()
    } catch (error) {
      console.error("Error deleting storage item:", error)
      toast("항목 삭제 중 오류가 발생했습니다.");
    }
  }

  const clearStorage = (storage: Storage) => {
    try {
      storage.clear()
      loadData()
    } catch (error) {
      console.error("Error clearing storage:", error)
      toast("스토리지 삭제 중 오류가 발생했습니다.");
    }
  }

  const handleAddItem = () => {
    if (!newItem.key.trim()) {
      toast("항목의 키를 입력해주세요.");
      return
    }

    try {
      if (activeTab === "localStorage") {
        addStorageItem(localStorage, newItem.key, newItem.value)
      } else if (activeTab === "sessionStorage") {
        addStorageItem(sessionStorage, newItem.key, newItem.value)
      }

      setNewItem({ key: "", value: "" })
      setShowAddForm(false)

      toast(`${newItem.key} 항목이 추가되었습니다.`);
    } catch (error) {
      toast("항목 추가 중 오류가 발생했습니다.");
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast("클립보드에 복사되었습니다.");
  }

  const exportData = () => {
    const data = {
      localStorage: localStorageItems,
      sessionStorage: sessionStorageItems,
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `storage-data-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)

    toast("스토리지 데이터가 다운로드되었습니다.");
  }

  const toggleExpanded = (key: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(key)) {
      newExpanded.delete(key)
    } else {
      newExpanded.add(key)
    }
    setExpandedItems(newExpanded)
  }

  const formatValue = (item: StorageItem) => {
    if (item.isJSON && item.parsedValue) {
      return JSON.stringify(item.parsedValue, null, 2)
    }
    return item.value
  }

  const getCurrentItems = () => {
    let items: StorageItem[] = []

    if (activeTab === "localStorage") {
      items = localStorageItems.filter(
        (item) =>
          item.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.value.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    } else if (activeTab === "sessionStorage") {
      items = sessionStorageItems.filter(
        (item) =>
          item.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.value.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    return items
  }

  const getStorageSize = (items: StorageItem[]) => {
    const totalSize = items.reduce((sum, item) => sum + item.size, 0)
    return totalSize < 1024 ? `${totalSize} bytes` : `${(totalSize / 1024).toFixed(2)} KB`
  }

  const addTestItem = () => {
    const testKey = `test-item-${Date.now()}`
    const testValue = "테스트 데이터"

    if (activeTab === "localStorage") {
      addStorageItem(localStorage, testKey, testValue)
    } else {
      addStorageItem(sessionStorage, testKey, testValue)
    }

    toast(`${testKey} 항목이 추가되었습니다.`);
  }

  // 클라이언트 사이드에서만 렌더링
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  const currentItems = getCurrentItems()

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">브라우저 스토리지 뷰어</h1>
          <p className="text-gray-600">브라우저의 로컬스토리지와 세션스토리지를 조회하고 관리하세요</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* 사이드바 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 탭 선택 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">스토리지 타입</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={activeTab === "localStorage" ? "default" : "outline"}
                  className={`w-full justify-start ${activeTab === "localStorage" ? "" : "bg-transparent"}`}
                  onClick={() => {
                    setActiveTab("localStorage")
                    setSearchTerm("")
                    setShowAddForm(false)
                  }}
                >
                  <Database className="h-4 w-4 mr-2" />
                  로컬스토리지 ({localStorageItems.length})
                </Button>
                <Button
                  variant={activeTab === "sessionStorage" ? "default" : "outline"}
                  className={`w-full justify-start ${activeTab === "sessionStorage" ? "" : "bg-transparent"}`}
                  onClick={() => {
                    setActiveTab("sessionStorage")
                    setSearchTerm("")
                    setShowAddForm(false)
                  }}
                >
                  <Database className="h-4 w-4 mr-2" />
                  세션스토리지 ({sessionStorageItems.length})
                </Button>
              </CardContent>
            </Card>

            {/* 통계 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">통계</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">로컬스토리지</span>
                  <span className="text-sm font-medium">{localStorageItems.length}개</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">세션스토리지</span>
                  <span className="text-sm font-medium">{sessionStorageItems.length}개</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">로컬스토리지 크기</span>
                  <span className="text-sm font-medium">{getStorageSize(localStorageItems)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">세션스토리지 크기</span>
                  <span className="text-sm font-medium">{getStorageSize(sessionStorageItems)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">현재 탭 항목</span>
                  <span className="text-sm font-medium">{currentItems.length}개</span>
                </div>
              </CardContent>
            </Card>

            {/* 액션 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">액션</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button onClick={loadData} variant="outline" className="w-full bg-transparent">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  새로고침
                </Button>
                <Button onClick={exportData} variant="outline" className="w-full bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  JSON 내보내기
                </Button>
                <Button onClick={addTestItem} variant="outline" className="w-full bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  테스트 항목 추가
                </Button>
                <Button
                  onClick={() => {
                    if (activeTab === "localStorage") {
                      clearStorage(localStorage)
                    } else if (activeTab === "sessionStorage") {
                      clearStorage(sessionStorage)
                    }
                    toast(`모든 ${activeTab === "localStorage" ? "로컬스토리지" : "세션스토리지"} 항목이 삭제되었습니다.`);
                  }}
                  variant="outline"
                  className="w-full text-red-600 hover:text-red-700 bg-transparent"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  전체 삭제
                </Button>
              </CardContent>
            </Card>

            {/* 도움말 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">도움말</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 space-y-2">
                <p>
                  <strong>로컬스토리지:</strong> 브라우저를 닫아도 데이터가 유지됩니다.
                </p>
                <p>
                  <strong>세션스토리지:</strong> 탭을 닫으면 데이터가 삭제됩니다.
                </p>
                <p>
                  <strong>JSON 표시:</strong> JSON 형태의 데이터는 자동으로 포맷팅됩니다.
                </p>
                <p>
                  <strong>검색:</strong> 키와 값 모두에서 검색이 가능합니다.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 메인 영역 */}
          <div className="lg:col-span-3 space-y-6">
            {/* 검색 및 추가 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    {activeTab === "localStorage" ? "로컬스토리지" : "세션스토리지"}
                  </span>
                  <Button onClick={() => setShowAddForm(!showAddForm)} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    항목 추가
                  </Button>
                </CardTitle>
                <CardDescription>
                  {activeTab === "localStorage"
                    ? "브라우저 로컬스토리지 항목 - 영구 저장"
                    : "브라우저 세션스토리지 항목 - 세션 종료 시 삭제"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 검색 */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="키 또는 값으로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* 추가 폼 */}
                {showAddForm && (
                  <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-key">키 (Key)</Label>
                        <Input
                          id="new-key"
                          value={newItem.key}
                          onChange={(e) => setNewItem({ ...newItem, key: e.target.value })}
                          placeholder="예: user_settings"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-value">값 (Value)</Label>
                        <Input
                          id="new-value"
                          value={newItem.value}
                          onChange={(e) => setNewItem({ ...newItem, value: e.target.value })}
                          placeholder='예: {"theme": "dark"}'
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddItem} size="sm">
                        추가
                      </Button>
                      <Button onClick={() => setShowAddForm(false)} variant="outline" size="sm">
                        취소
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 항목 목록 */}
            {currentItems.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-gray-500">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>
                      {searchTerm
                        ? "검색 결과가 없습니다"
                        : activeTab === "localStorage"
                          ? "로컬스토리지 항목이 없습니다"
                          : "세션스토리지 항목이 없습니다"}
                    </p>
                    <p className="text-sm mt-2">
                      {!searchTerm && "새 항목을 추가하거나 다른 웹사이트에서 이 도구를 사용해보세요."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {currentItems.map((item, index) => (
                  <Card key={`${activeTab}-${index}`}>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{item.key}</h3>
                            {item.isJSON && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">JSON</span>
                            )}
                            <span className="text-xs text-gray-500">{item.size} bytes</span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => toggleExpanded(item.key)}>
                              {expandedItems.has(item.key) ? (
                                <EyeOff className="h-3 w-3" />
                              ) : (
                                <Eye className="h-3 w-3" />
                              )}
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => copyToClipboard(item.value)}>
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (activeTab === "localStorage") {
                                  deleteStorageItem(localStorage, item.key)
                                } else {
                                  deleteStorageItem(sessionStorage, item.key)
                                }
                                toast(`${item.key} 항목이 삭제되었습니다.`);
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        {expandedItems.has(item.key) && (
                          <div className="mt-3">
                            <Textarea
                              value={formatValue(item)}
                              readOnly
                              rows={Math.min(10, formatValue(item).split("\n").length)}
                              className="font-mono text-sm"
                            />
                          </div>
                        )}
                        {!expandedItems.has(item.key) && (
                          <div className="text-sm text-gray-600">
                            <p className="truncate">
                              <span className="font-medium">값:</span> {item.value || "(빈 값)"}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
