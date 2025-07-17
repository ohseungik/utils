"use client"

import { useState } from "react"
import { Copy, RotateCcw, Wand2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function Component() {
  const [inputQuery, setInputQuery] = useState("")
  const [formattedQuery, setFormattedQuery] = useState("")

  const formatSQL = (sql: string): string => {
    if (!sql.trim()) return ""

    // SQL 키워드 목록
    const keywords = [
      "SELECT",
      "FROM",
      "WHERE",
      "JOIN",
      "INNER JOIN",
      "LEFT JOIN",
      "RIGHT JOIN",
      "FULL JOIN",
      "ON",
      "GROUP BY",
      "HAVING",
      "ORDER BY",
      "LIMIT",
      "OFFSET",
      "INSERT",
      "INTO",
      "VALUES",
      "UPDATE",
      "SET",
      "DELETE",
      "CREATE",
      "TABLE",
      "ALTER",
      "DROP",
      "INDEX",
      "VIEW",
      "UNION",
      "UNION ALL",
      "CASE",
      "WHEN",
      "THEN",
      "ELSE",
      "END",
      "AS",
      "AND",
      "OR",
      "NOT",
      "IN",
      "EXISTS",
      "BETWEEN",
      "LIKE",
      "IS",
      "NULL",
      "DISTINCT",
      "COUNT",
      "SUM",
      "AVG",
      "MIN",
      "MAX",
      "SUBSTRING",
      "CONCAT",
      "UPPER",
      "LOWER",
      "TRIM",
    ]

    let formatted = sql
      .replace(/\s+/g, " ") // 여러 공백을 하나로
      .trim()

    // 키워드를 대문자로 변환
    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi")
      formatted = formatted.replace(regex, keyword.toUpperCase())
    })

    // 주요 절 앞에 줄바꿈 추가
    const majorClauses = ["FROM", "WHERE", "GROUP BY", "HAVING", "ORDER BY", "LIMIT", "UNION", "UNION ALL"]
    majorClauses.forEach((clause) => {
      const regex = new RegExp(`\\s+(${clause})\\s+`, "gi")
      formatted = formatted.replace(regex, `\n${clause} `)
    })

    // JOIN 절 처리
    const joinTypes = ["JOIN", "INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN"]
    joinTypes.forEach((join) => {
      const regex = new RegExp(`\\s+(${join})\\s+`, "gi")
      formatted = formatted.replace(regex, `\n  ${join} `)
    })

    // ON 절 들여쓰기
    formatted = formatted.replace(/\s+ON\s+/gi, "\n    ON ")

    // SELECT 절의 컬럼들 정리
    formatted = formatted.replace(/SELECT\s+(.+?)\s+FROM/gi, (match, columns) => {
      const columnList = columns.split(",").map((col: string) => col.trim())
      if (columnList.length > 1) {
        return `SELECT\n  ${columnList.join(",\n  ")}\nFROM`
      }
      return `SELECT ${columns}\nFROM`
    })

    // 콤마 후 적절한 공백 추가
    formatted = formatted.replace(/,(?!\s)/g, ", ")

    // 괄호 주변 정리
    formatted = formatted.replace(/\(\s+/g, "(")
    formatted = formatted.replace(/\s+\)/g, ")")

    // 연산자 주변 공백 정리
    formatted = formatted.replace(/\s*=\s*/g, " = ")
    formatted = formatted.replace(/\s*<\s*/g, " < ")
    formatted = formatted.replace(/\s*>\s*/g, " > ")
    formatted = formatted.replace(/\s*<=\s*/g, " <= ")
    formatted = formatted.replace(/\s*>=\s*/g, " >= ")
    formatted = formatted.replace(/\s*<>\s*/g, " <> ")
    formatted = formatted.replace(/\s*!=\s*/g, " != ")

    // AND, OR 앞에 줄바꿈 (WHERE 절 내에서)
    formatted = formatted.replace(/\s+(AND|OR)\s+/gi, "\n  $1 ")

    return formatted.trim()
  }

  const handleFormat = () => {
    const formatted = formatSQL(inputQuery)
    setFormattedQuery(formatted)
  }

  const handleCopy = async () => {
    if (!formattedQuery) return

    try {
      await navigator.clipboard.writeText(formattedQuery)
      toast("포맷팅된 SQL이 클립보드에 복사되었습니다.")
    } catch (err) {
      toast("클립보드 복사에 실패했습니다.")
    }
  }

  const handleClear = () => {
    setInputQuery("")
    setFormattedQuery("")
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">SQL 쿼리 포매터</h1>
        <p className="text-muted-foreground">SQL 쿼리를 입력하면 보기 좋게 포맷팅해드립니다</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 입력 영역 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>원본 SQL</span>
            </CardTitle>
            <CardDescription>포맷팅할 SQL 쿼리를 입력하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="SELECT * FROM users WHERE id = 1 AND name LIKE '%john%' ORDER BY created_at DESC;"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
            <div className="flex gap-2">
              <Button onClick={handleFormat} className="flex-1">
                <Wand2 className="w-4 h-4 mr-2" />
                포맷팅
              </Button>
              <Button variant="outline" onClick={handleClear}>
                <RotateCcw className="w-4 h-4 mr-2" />
                초기화
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 결과 영역 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>포맷팅된 SQL</span>
              {formattedQuery && (
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="w-4 h-4 mr-2" />
                  복사
                </Button>
              )}
            </CardTitle>
            <CardDescription>포맷팅된 결과가 여기에 표시됩니다</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="min-h-[300px] p-4 bg-muted rounded-md">
              {formattedQuery ? (
                <pre className="font-mono text-sm whitespace-pre-wrap break-words">{formattedQuery}</pre>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  포맷팅된 SQL이 여기에 표시됩니다
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 사용 예시 */}
      <Card>
        <CardHeader>
          <CardTitle>사용 예시</CardTitle>
          <CardDescription>다음과 같은 SQL 쿼리들을 포맷팅할 수 있습니다</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">입력 전:</h4>
              <code className="block p-3 bg-muted rounded text-xs">
                select u.id,u.name,p.title from users u left join posts p on u.id=p.user_id where u.active=1 order by
                u.created_at desc limit 10;
              </code>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">포맷팅 후:</h4>
              <code className="block p-3 bg-muted rounded text-xs whitespace-pre">
                {`SELECT
  u.id,
  u.name,
  p.title
FROM users u
  LEFT JOIN posts p
    ON u.id = p.user_id
WHERE u.active = 1
ORDER BY u.created_at DESC
LIMIT 10;`}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
