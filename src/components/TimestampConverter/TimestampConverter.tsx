"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatTimestamp, getCurrentTimestamp, getTimezoneOptions } from "@/lib/dateUtils"

export default function TimestampConverter() {
  // Timestamp to Date
  const [timestamp, setTimestamp] = useState("")
  const [timestampType, setTimestampType] = useState("seconds")
  const [timezone, setTimezone] = useState("local")
  const [dateFormat, setDateFormat] = useState("iso")
  const [dateResult, setDateResult] = useState("")
  const [isValidTimestamp, setIsValidTimestamp] = useState(true)

  // Date to Timestamp
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [hours, setHours] = useState("00")
  const [minutes, setMinutes] = useState("00")
  const [seconds, setSeconds] = useState("00")
  const [timestampResult, setTimestampResult] = useState({
    seconds: "",
    milliseconds: "",
  })

  // Current timestamp
  const [currentTimestamp, setCurrentTimestamp] = useState({
    seconds: "",
    milliseconds: "",
  })

  // Timezone options
  const timezoneOptions = getTimezoneOptions()

  // Update current timestamp every second
  useEffect(() => {
    const updateCurrentTimestamp = () => {
      const { seconds, milliseconds } = getCurrentTimestamp()
      setCurrentTimestamp({
        seconds,
        milliseconds,
      })
    }

    updateCurrentTimestamp()
    const interval = setInterval(updateCurrentTimestamp, 1000)
    return () => clearInterval(interval)
  }, [])

  // Convert timestamp to date
  useEffect(() => {
    if (!timestamp) {
      setDateResult("")
      setIsValidTimestamp(true)
      return
    }

    try {
      const timestampValue = Number.parseInt(timestamp, 10)
      if (isNaN(timestampValue)) {
        setIsValidTimestamp(false)
        setDateResult("")
        return
      }

      const result = formatTimestamp(
        timestampValue,
        timestampType === "seconds" ? "seconds" : "milliseconds",
        timezone,
        dateFormat,
      )

      setDateResult(result)
      setIsValidTimestamp(true)
    } catch (error) {
      setIsValidTimestamp(false)
      setDateResult("")
    }
  }, [timestamp, timestampType, timezone, dateFormat])

  // Convert date to timestamp
  useEffect(() => {
    if (!selectedDate) {
      setTimestampResult({ seconds: "", milliseconds: "" })
      return
    }

    try {
      const date = new Date(`${selectedDate}T${hours}:${minutes}:${seconds}`)
      if (isNaN(date.getTime())) {
        setTimestampResult({ seconds: "", milliseconds: "" })
        return
      }

      const timestampSeconds = Math.floor(date.getTime() / 1000).toString()
      const timestampMilliseconds = date.getTime().toString()

      setTimestampResult({
        seconds: timestampSeconds,
        milliseconds: timestampMilliseconds,
      })
    } catch (error) {
      setTimestampResult({ seconds: "", milliseconds: "" })
    }
  }, [selectedDate, hours, minutes, seconds])

  // Set current time
  const setCurrentTime = () => {
    const now = new Date()
    setSelectedDate(now.toISOString().split("T")[0])
    setHours(now.getHours().toString().padStart(2, "0"))
    setMinutes(now.getMinutes().toString().padStart(2, "0"))
    setSeconds(now.getSeconds().toString().padStart(2, "0"))
  }

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // 복사 성공 시 처리 (필요하면 토스트 메시지 등 추가)
      })
      .catch((err) => {
        console.error("클립보드 복사 실패:", err)
      })
  }

  // Generate time options
  const generateTimeOptions = (max: number) => {
    const options = []
    for (let i = 0; i <= max; i++) {
      const value = i.toString().padStart(2, "0")
      options.push(
        <SelectItem key={value} value={value}>
          {value}
        </SelectItem>,
      )
    }
    return options
  }

  return (
    <div className="space-y-6">
      {/* 현재 타임스탬프 표시 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-medium">현재 타임스탬프</h3>
              <p className="text-sm text-muted-foreground">현재 시간의 Unix 타임스탬프입니다</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">초:</span>
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                  {currentTimestamp.seconds}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => copyToClipboard(currentTimestamp.seconds)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">밀리초:</span>
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                  {currentTimestamp.milliseconds}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => copyToClipboard(currentTimestamp.milliseconds)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 변환 탭 */}
      <Tabs defaultValue="timestamp-to-date" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="timestamp-to-date">타임스탬프 → 날짜</TabsTrigger>
          <TabsTrigger value="date-to-timestamp">날짜 → 타임스탬프</TabsTrigger>
        </TabsList>

        {/* 타임스탬프 → 날짜 변환 */}
        <TabsContent value="timestamp-to-date">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timestamp">타임스탬프</Label>
                  <div className="flex gap-2">
                    <Input
                      id="timestamp"
                      placeholder="예: 1620000000"
                      value={timestamp}
                      onChange={(e) => setTimestamp(e.target.value)}
                      className={cn(!isValidTimestamp && timestamp ? "border-red-500" : "")}
                    />
                    <Select value={timestampType} onValueChange={setTimestampType}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="단위" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="seconds">초</SelectItem>
                        <SelectItem value="milliseconds">밀리초</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {!isValidTimestamp && timestamp && (
                    <p className="text-sm text-red-500">유효한 타임스탬프를 입력해주세요</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>옵션</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger>
                        <SelectValue placeholder="타임존" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="local">로컬 시간</SelectItem>
                        <SelectItem value="utc">UTC</SelectItem>
                        {timezoneOptions.map((tz) => (
                          <SelectItem key={tz.value} value={tz.value}>
                            {tz.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={dateFormat} onValueChange={setDateFormat}>
                      <SelectTrigger>
                        <SelectValue placeholder="날짜 형식" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="iso">ISO 8601</SelectItem>
                        <SelectItem value="locale">로컬 형식</SelectItem>
                        <SelectItem value="relative">상대 시간</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>변환 결과</Label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 p-3 bg-muted rounded-md min-h-[40px]">
                    {dateResult || (
                      <span className="text-muted-foreground">타임스탬프를 입력하면 변환 결과가 여기에 표시됩니다</span>
                    )}
                  </div>
                  {dateResult && (
                    <Button variant="outline" size="icon" onClick={() => copyToClipboard(dateResult)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 날짜 → 타임스탬프 변환 */}
        <TabsContent value="date-to-timestamp">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date-input">날짜 선택</Label>
                  <Input
                    id="date-input"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>시간 입력</Label>
                    <Button variant="outline" size="sm" className="h-8" onClick={setCurrentTime}>
                      <RefreshCw className="h-3.5 w-3.5 mr-1" />
                      현재 시간
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Select value={hours} onValueChange={setHours}>
                      <SelectTrigger>
                        <SelectValue placeholder="시" />
                      </SelectTrigger>
                      <SelectContent>{generateTimeOptions(23)}</SelectContent>
                    </Select>

                    <Select value={minutes} onValueChange={setMinutes}>
                      <SelectTrigger>
                        <SelectValue placeholder="분" />
                      </SelectTrigger>
                      <SelectContent>{generateTimeOptions(59)}</SelectContent>
                    </Select>

                    <Select value={seconds} onValueChange={setSeconds}>
                      <SelectTrigger>
                        <SelectValue placeholder="초" />
                      </SelectTrigger>
                      <SelectContent>{generateTimeOptions(59)}</SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>변환 결과</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">초 단위 타임스탬프</div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 p-2 bg-muted rounded-md">
                        {timestampResult.seconds || "결과가 여기에 표시됩니다"}
                      </code>
                      {timestampResult.seconds && (
                        <Button variant="outline" size="icon" onClick={() => copyToClipboard(timestampResult.seconds)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">밀리초 단위 타임스탬프</div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 p-2 bg-muted rounded-md">
                        {timestampResult.milliseconds || "결과가 여기에 표시됩니다"}
                      </code>
                      {timestampResult.milliseconds && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(timestampResult.milliseconds)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
