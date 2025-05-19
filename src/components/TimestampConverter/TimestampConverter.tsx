"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Copy, RefreshCw } from "lucide-react"
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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
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
      const date = new Date(selectedDate)
      date.setHours(Number.parseInt(hours, 10) || 0)
      date.setMinutes(Number.parseInt(minutes, 10) || 0)
      date.setSeconds(Number.parseInt(seconds, 10) || 0)

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
    setSelectedDate(now)
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

  // Handle time input changes
  const handleHoursChange = (value: string) => {
    const numValue = Number.parseInt(value, 10)
    if (isNaN(numValue)) {
      setHours("00")
    } else if (numValue >= 0 && numValue <= 23) {
      setHours(numValue.toString().padStart(2, "0"))
    }
  }

  const handleMinutesChange = (value: string) => {
    const numValue = Number.parseInt(value, 10)
    if (isNaN(numValue)) {
      setMinutes("00")
    } else if (numValue >= 0 && numValue <= 59) {
      setMinutes(numValue.toString().padStart(2, "0"))
    }
  }

  const handleSecondsChange = (value: string) => {
    const numValue = Number.parseInt(value, 10)
    if (isNaN(numValue)) {
      setSeconds("00")
    } else if (numValue >= 0 && numValue <= 59) {
      setSeconds(numValue.toString().padStart(2, "0"))
    }
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
                  <Label>날짜 선택</Label>
                  <div className="flex flex-col space-y-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : <span>날짜 선택</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>시간 입력</Label>
                    <Button variant="outline" size="sm" className="h-8" onClick={setCurrentTime}>
                      <RefreshCw className="h-3.5 w-3.5 mr-1" />
                      현재 시간
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label htmlFor="hours" className="sr-only">
                        시
                      </Label>
                      <Input
                        id="hours"
                        placeholder="시"
                        value={hours}
                        onChange={(e) => handleHoursChange(e.target.value)}
                        className="text-center"
                      />
                    </div>
                    <span className="flex items-center">:</span>
                    <div className="flex-1">
                      <Label htmlFor="minutes" className="sr-only">
                        분
                      </Label>
                      <Input
                        id="minutes"
                        placeholder="분"
                        value={minutes}
                        onChange={(e) => handleMinutesChange(e.target.value)}
                        className="text-center"
                      />
                    </div>
                    <span className="flex items-center">:</span>
                    <div className="flex-1">
                      <Label htmlFor="seconds" className="sr-only">
                        초
                      </Label>
                      <Input
                        id="seconds"
                        placeholder="초"
                        value={seconds}
                        onChange={(e) => handleSecondsChange(e.target.value)}
                        className="text-center"
                      />
                    </div>
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
