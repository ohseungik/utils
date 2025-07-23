"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { AlertCircle, CheckCircle, Copy, FileText, Hash, HelpCircle, RotateCcw, Zap } from "lucide-react"
import { useEffect, useState } from "react"

interface MatchResult {
  match: string
  index: number
  groups: string[]
  namedGroups: Record<string, string>
}

interface RegexFlags {
  global: boolean
  ignoreCase: boolean
  multiline: boolean
  dotAll: boolean
  unicode: boolean
  sticky: boolean
}

const defaultFlags: RegexFlags = {
  global: true,
  ignoreCase: false,
  multiline: false,
  dotAll: false,
  unicode: false,
  sticky: false,
}

const regexExamples = [
  {
    name: "이메일 주소",
    pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
    description: "이메일 주소 형식을 검증합니다",
    testText: "연락처: john@example.com, jane.doe@company.co.kr",
  },
  {
    name: "전화번호 (한국)",
    pattern: "0\\d{1,2}-\\d{3,4}-\\d{4}",
    description: "한국 전화번호 형식을 매치합니다",
    testText: "전화: 02-1234-5678, 010-9876-5432",
  },
  {
    name: "URL",
    pattern: "https?://[\\w\\-._~:/?#[\\]@!$&'()*+,;=%]+",
    description: "HTTP/HTTPS URL을 매치합니다",
    testText: "사이트: https://www.example.com, http://test.co.kr/path?param=value",
  },
  {
    name: "HTML 태그",
    pattern: "<[^>]+>",
    description: "HTML 태그를 매치합니다",
    testText: "<div class='container'><p>Hello <strong>World</strong></p></div>",
  },
  {
    name: "숫자 (정수/소수)",
    pattern: "-?\\d+(\\.\\d+)?",
    description: "정수와 소수를 매치합니다",
    testText: "가격: 1,500원, 할인율: -10.5%, 온도: 23.7도",
  },
  {
    name: "한글",
    pattern: "[가-힣]+",
    description: "한글 문자를 매치합니다",
    testText: "Hello 안녕하세요 World 반갑습니다 123",
  },
]

export default function RegexTester() {
  const [pattern, setPattern] = useState("")
  const [testText, setTestText] = useState("")
  const [flags, setFlags] = useState<RegexFlags>(defaultFlags)
  const [matches, setMatches] = useState<MatchResult[]>([])
  const [isValidRegex, setIsValidRegex] = useState(true)
  const [regexError, setRegexError] = useState("")

  const updateFlag = (flag: keyof RegexFlags, value: boolean) => {
    setFlags((prev) => ({ ...prev, [flag]: value }))
  }

  const getFlagsString = () => {
    let flagsStr = ""
    if (flags.global) flagsStr += "g"
    if (flags.ignoreCase) flagsStr += "i"
    if (flags.multiline) flagsStr += "m"
    if (flags.dotAll) flagsStr += "s"
    if (flags.unicode) flagsStr += "u"
    if (flags.sticky) flagsStr += "y"
    return flagsStr
  }

  const testRegex = () => {
    if (!pattern) {
      setMatches([])
      setIsValidRegex(true)
      setRegexError("")
      return
    }

    try {
      const regex = new RegExp(pattern, getFlagsString())
      setIsValidRegex(true)
      setRegexError("")

      const results: MatchResult[] = []
      let match

      if (flags.global) {
        while ((match = regex.exec(testText)) !== null) {
          results.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
            namedGroups: match.groups || {},
          })

          // 무한 루프 방지
          if (match.index === regex.lastIndex) {
            regex.lastIndex++
          }
        }
      } else {
        match = regex.exec(testText)
        if (match) {
          results.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
            namedGroups: match.groups || {},
          })
        }
      }

      setMatches(results)
    } catch (error) {
      setIsValidRegex(false)
      setRegexError(error instanceof Error ? error.message : "정규표현식 오류")
      setMatches([])
    }
  }

  useEffect(() => {
    testRegex()
  }, [pattern, testText, flags])

  const getHighlightedText = () => {
    if (!testText || matches.length === 0) {
      return testText
    }

    let highlightedText = testText
    const sortedMatches = [...matches].sort((a, b) => b.index - a.index)

    sortedMatches.forEach((match, index) => {
      const replacement = `<span class="bg-yellow-200 px-1 rounded font-medium" data-match-index="${matches.indexOf(match)}">${match.match}</span>`
      highlightedText =
        highlightedText.substring(0, match.index) +
        replacement +
        highlightedText.substring(match.index + match.match.length)
    })

    return highlightedText
  }

  const loadExample = (example: (typeof regexExamples)[0]) => {
    setPattern(example.pattern)
    setTestText(example.testText)
    toast(`${example.name} 예제가 로드되었습니다.`);
  }

  const copyRegex = () => {
    const regexString = `/${pattern}/${getFlagsString()}`
    navigator.clipboard.writeText(regexString)
    toast("정규표현식이 클립보드에 복사되었습니다.");
  }

  const clearAll = () => {
    setPattern("")
    setTestText("")
    setMatches([])
    setFlags(defaultFlags)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">정규표현식 테스트 도구</h1>
          <p className="text-gray-600">정규표현식을 테스트하고 매치 결과를 실시간으로 확인하세요</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* 메인 영역 */}
          <div className="lg:col-span-3 space-y-6">
            {/* 정규표현식 입력 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  정규표현식
                </CardTitle>
                <CardDescription>테스트할 정규표현식을 입력하세요</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="regex-pattern">패턴</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">/</span>
                    <Input
                      id="regex-pattern"
                      value={pattern}
                      onChange={(e) => setPattern(e.target.value)}
                      placeholder="정규표현식을 입력하세요..."
                      className={`flex-1 ${!isValidRegex ? "border-red-300" : ""}`}
                    />
                    <span className="text-gray-500">/{getFlagsString()}</span>
                  </div>
                  {!isValidRegex && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {regexError}
                    </p>
                  )}
                </div>

                {/* 플래그 */}
                <div className="space-y-2">
                  <Label>플래그</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="flag-global"
                        checked={flags.global}
                        onCheckedChange={(checked) => updateFlag("global", checked as boolean)}
                      />
                      <Label htmlFor="flag-global" className="text-sm">
                        g (Global) - 전역 검색
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="flag-ignorecase"
                        checked={flags.ignoreCase}
                        onCheckedChange={(checked) => updateFlag("ignoreCase", checked as boolean)}
                      />
                      <Label htmlFor="flag-ignorecase" className="text-sm">
                        i (Ignore Case) - 대소문자 무시
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="flag-multiline"
                        checked={flags.multiline}
                        onCheckedChange={(checked) => updateFlag("multiline", checked as boolean)}
                      />
                      <Label htmlFor="flag-multiline" className="text-sm">
                        m (Multiline) - 다중행
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="flag-dotall"
                        checked={flags.dotAll}
                        onCheckedChange={(checked) => updateFlag("dotAll", checked as boolean)}
                      />
                      <Label htmlFor="flag-dotall" className="text-sm">
                        s (Dot All) - . 이 개행문자 포함
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="flag-unicode"
                        checked={flags.unicode}
                        onCheckedChange={(checked) => updateFlag("unicode", checked as boolean)}
                      />
                      <Label htmlFor="flag-unicode" className="text-sm">
                        u (Unicode) - 유니코드
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="flag-sticky"
                        checked={flags.sticky}
                        onCheckedChange={(checked) => updateFlag("sticky", checked as boolean)}
                      />
                      <Label htmlFor="flag-sticky" className="text-sm">
                        y (Sticky) - 고정 위치
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={copyRegex} disabled={!pattern} variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    정규표현식 복사
                  </Button>
                  <Button onClick={clearAll} variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    모두 지우기
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 테스트 텍스트 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  테스트 텍스트
                </CardTitle>
                <CardDescription>정규표현식을 테스트할 텍스트를 입력하세요</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="test-text">텍스트</Label>
                  <Textarea
                    id="test-text"
                    value={testText}
                    onChange={(e) => setTestText(e.target.value)}
                    placeholder="테스트할 텍스트를 입력하세요..."
                    rows={8}
                    className="resize-none"
                  />
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>글자 수: {testText.length}</span>
                  <span>매치 수: {matches.length}</span>
                  {isValidRegex ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-3 w-3" />
                      유효한 정규표현식
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-600">
                      <AlertCircle className="h-3 w-3" />
                      잘못된 정규표현식
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 매치 결과 */}
            {testText && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    매치 결과
                  </CardTitle>
                  <CardDescription>
                    {matches.length > 0 ? `${matches.length}개의 매치가 발견되었습니다` : "매치된 결과가 없습니다"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap text-sm leading-relaxed font-mono"
                    dangerouslySetInnerHTML={{ __html: getHighlightedText() }}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 매치 정보 */}
            {matches.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">매치 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {matches.map((match, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">매치 #{index + 1}</span>
                        <span className="text-xs text-gray-500">위치: {match.index}</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">매치:</span> {match.match}
                        </p>
                        {match.groups.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-gray-700">캡처 그룹:</p>
                            {match.groups.map((group, groupIndex) => (
                              <p key={groupIndex} className="text-xs text-gray-600 ml-2">
                                {groupIndex + 1} : {group}
                              </p>
                            ))}
                          </div>
                        )}
                        {Object.keys(match.namedGroups).length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-gray-700">명명된 그룹:</p>
                            {Object.entries(match.namedGroups).map(([name, value]) => (
                              <p key={name} className="text-xs text-gray-600 ml-2">
                                {name} : {value}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* 예제 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  예제
                </CardTitle>
                <CardDescription>자주 사용하는 정규표현식 예제</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {regexExamples.map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left h-auto p-3 bg-transparent"
                    onClick={() => loadExample(example)}
                  >
                    <div>
                      <p className="font-medium text-sm">{example.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{example.description}</p>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* 도움말 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">빠른 참조</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-gray-600 space-y-2">
                <div>
                  <p className="font-medium">기본 문자:</p>
                  <p>. (모든 문자), \d (숫자), \w (단어), \s (공백)</p>
                </div>
                <div>
                  <p className="font-medium">수량자:</p>
                  <p>* (0개 이상), + (1개 이상), ? (0개 또는 1개)</p>
                </div>
                <div>
                  <p className="font-medium">앵커:</p>
                  <p>^ (시작), $ (끝), \b (단어 경계)</p>
                </div>
                <div>
                  <p className="font-medium">그룹:</p>
                  <p>() (캡처 그룹), (?:) (비캡처 그룹)</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
