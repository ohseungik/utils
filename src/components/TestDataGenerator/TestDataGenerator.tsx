"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Database } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface TestCase {
  category: string;
  value: string;
  description: string;
  language: string;
  dataType: string;
}

export default function TestDataGenerator() {
  const { t } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<string>("java");
  const [selectedDataType, setSelectedDataType] = useState<string>("string");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Test data cases
  const testCases: TestCase[] = useMemo(() => [
    // String - Null/Undefined
    { category: "null", value: "null", description: "Java null 참조", language: "java", dataType: "string" },
    { category: "null", value: "None", description: "Python None 값", language: "python", dataType: "string" },
    { category: "null", value: "null", description: "JavaScript null", language: "javascript", dataType: "string" },
    { category: "null", value: "nil", description: "Go nil 참조", language: "go", dataType: "string" },
    
    // String - Empty/Whitespace
    { category: "empty", value: '""', description: "길이 0인 문자열", language: "java", dataType: "string" },
    { category: "empty", value: "''", description: "길이 0인 문자열", language: "python", dataType: "string" },
    { category: "empty", value: '""', description: "길이 0인 문자열", language: "javascript", dataType: "string" },
    { category: "empty", value: '""', description: "길이 0인 문자열", language: "go", dataType: "string" },
    { category: "empty", value: '" "', description: "공백 문자 하나", language: "java", dataType: "string" },
    { category: "empty", value: "' '", description: "공백 문자 하나", language: "python", dataType: "string" },
    { category: "empty", value: '" "', description: "공백 문자 하나", language: "javascript", dataType: "string" },
    { category: "empty", value: '" "', description: "공백 문자 하나", language: "go", dataType: "string" },
    { category: "empty", value: '"   "', description: "공백 여러 개", language: "java", dataType: "string" },
    { category: "empty", value: '"\\n\\t\\r"', description: "개행/탭 문자", language: "java", dataType: "string" },

    // String - Special Cases
    { category: "special", value: '"0"', description: "숫자를 표현한 문자열", language: "java", dataType: "string" },
    { category: "special", value: '"false"', description: "boolean을 표현한 문자열", language: "java", dataType: "string" },
    { category: "special", value: '"null"', description: "null을 표현한 문자열", language: "java", dataType: "string" },
    { category: "special", value: '"undefined"', description: "undefined를 표현한 문자열", language: "javascript", dataType: "string" },
    { category: "special", value: '"NaN"', description: "NaN을 표현한 문자열", language: "javascript", dataType: "string" },

    // String - Boundary
    { category: "boundary", value: '"A".repeat(1000000)', description: "매우 긴 문자열 (1MB)", language: "javascript", dataType: "string" },
    { category: "boundary", value: '"가".repeat(65535)', description: "최대 길이 문자열", language: "java", dataType: "string" },

    // String - Format
    { category: "format", value: '"test@email"', description: "잘못된 이메일 형식", language: "java", dataType: "string" },
    { category: "format", value: '"http:/missing-slash"', description: "잘못된 URL 형식", language: "java", dataType: "string" },
    { category: "format", value: '"2024-13-45"', description: "잘못된 날짜 형식", language: "java", dataType: "string" },
    { category: "format", value: '"+82-10-1234-5678"', description: "특수 문자가 포함된 전화번호", language: "java", dataType: "string" },

    // String - Unicode/Encoding
    { category: "unicode", value: '"안녕하세요"', description: "한글 문자열", language: "java", dataType: "string" },
    { category: "unicode", value: '"你好世界"', description: "중국어 문자열", language: "java", dataType: "string" },
    { category: "unicode", value: '"مرحبا"', description: "아랍어 문자열 (RTL)", language: "java", dataType: "string" },
    { category: "unicode", value: '"😀🎉🚀"', description: "이모지 문자열", language: "java", dataType: "string" },
    { category: "unicode", value: '"\\uD83D\\uDE00"', description: "유니코드 이스케이프", language: "java", dataType: "string" },

    // String - Security
    { category: "security", value: '"\' OR 1=1 --"', description: "SQL 인젝션", language: "java", dataType: "string" },
    { category: "security", value: '"<script>alert(1)</script>"', description: "XSS 공격", language: "java", dataType: "string" },
    { category: "security", value: '"../../../etc/passwd"', description: "경로 조작 공격", language: "java", dataType: "string" },
    { category: "security", value: '"\${7*7}"', description: "템플릿 인젝션", language: "java", dataType: "string" },
    { category: "security", value: '"; DROP TABLE users; --"', description: "SQL 삭제 공격", language: "java", dataType: "string" },
    { category: "security", value: '"%00"', description: "Null byte 인젝션", language: "java", dataType: "string" },

    // Integer - Null
    { category: "null", value: "null", description: "Integer null 참조", language: "java", dataType: "integer" },
    { category: "null", value: "None", description: "Python None", language: "python", dataType: "integer" },
    { category: "null", value: "null", description: "JavaScript null", language: "javascript", dataType: "integer" },
    { category: "null", value: "nil", description: "Go nil", language: "go", dataType: "integer" },

    // Integer - Empty/Special
    { category: "empty", value: "0", description: "0 (거짓값)", language: "java", dataType: "integer" },
    { category: "special", value: "-0", description: "음수 0", language: "javascript", dataType: "integer" },
    { category: "special", value: "NaN", description: "Not a Number", language: "javascript", dataType: "integer" },
    { category: "special", value: "Infinity", description: "무한대", language: "javascript", dataType: "integer" },
    { category: "special", value: "-Infinity", description: "음의 무한대", language: "javascript", dataType: "integer" },

    // Integer - Boundary
    { category: "boundary", value: "2147483647", description: "int 최댓값 (Java)", language: "java", dataType: "integer" },
    { category: "boundary", value: "-2147483648", description: "int 최솟값 (Java)", language: "java", dataType: "integer" },
    { category: "boundary", value: "9007199254740991", description: "JavaScript 최대 안전 정수", language: "javascript", dataType: "integer" },
    { category: "boundary", value: "-9007199254740991", description: "JavaScript 최소 안전 정수", language: "javascript", dataType: "integer" },
    { category: "boundary", value: "2147483648", description: "int 오버플로우 (Java)", language: "java", dataType: "integer" },
    { category: "boundary", value: "-2147483649", description: "int 언더플로우 (Java)", language: "java", dataType: "integer" },

    // Integer - Format
    { category: "format", value: '"123"', description: "문자열로 표현된 숫자", language: "java", dataType: "integer" },
    { category: "format", value: '"0x1A"', description: "16진수 문자열", language: "java", dataType: "integer" },
    { category: "format", value: '"1e10"', description: "과학적 표기법 문자열", language: "java", dataType: "integer" },

    // Float - Null
    { category: "null", value: "null", description: "Float null 참조", language: "java", dataType: "float" },
    { category: "null", value: "None", description: "Python None", language: "python", dataType: "float" },
    { category: "null", value: "null", description: "JavaScript null", language: "javascript", dataType: "float" },
    { category: "null", value: "nil", description: "Go nil", language: "go", dataType: "float" },

    // Float - Special
    { category: "special", value: "0.0", description: "0.0", language: "java", dataType: "float" },
    { category: "special", value: "-0.0", description: "음수 0.0", language: "java", dataType: "float" },
    { category: "special", value: "NaN", description: "Not a Number", language: "java", dataType: "float" },
    { category: "special", value: "Infinity", description: "무한대", language: "java", dataType: "float" },
    { category: "special", value: "-Infinity", description: "음의 무한대", language: "java", dataType: "float" },

    // Float - Boundary
    { category: "boundary", value: "3.4028235e38", description: "float 최댓값 (Java)", language: "java", dataType: "float" },
    { category: "boundary", value: "-3.4028235e38", description: "float 최솟값 (Java)", language: "java", dataType: "float" },
    { category: "boundary", value: "1.4e-45", description: "float 최소 양수 (Java)", language: "java", dataType: "float" },
    { category: "boundary", value: "0.1 + 0.2", description: "부동소수점 정밀도 오차", language: "javascript", dataType: "float" },

    // Float - Format
    { category: "format", value: '"3.14"', description: "문자열로 표현된 소수", language: "java", dataType: "float" },
    { category: "format", value: '"1.23e-4"', description: "과학적 표기법", language: "java", dataType: "float" },

    // Boolean - Null
    { category: "null", value: "null", description: "Boolean null 참조", language: "java", dataType: "boolean" },
    { category: "null", value: "None", description: "Python None", language: "python", dataType: "boolean" },
    { category: "null", value: "null", description: "JavaScript null", language: "javascript", dataType: "boolean" },
    { category: "null", value: "nil", description: "Go nil", language: "go", dataType: "boolean" },

    // Boolean - Special
    { category: "special", value: "true", description: "참 값", language: "java", dataType: "boolean" },
    { category: "special", value: "false", description: "거짓 값", language: "java", dataType: "boolean" },
    { category: "special", value: "0", description: "거짓으로 평가되는 0", language: "javascript", dataType: "boolean" },
    { category: "special", value: "1", description: "참으로 평가되는 1", language: "javascript", dataType: "boolean" },
    { category: "special", value: '""', description: "거짓으로 평가되는 빈 문자열", language: "javascript", dataType: "boolean" },
    { category: "special", value: '"false"', description: "문자열 false (참으로 평가됨)", language: "javascript", dataType: "boolean" },

    // Array - Null
    { category: "null", value: "null", description: "Array null 참조", language: "java", dataType: "array" },
    { category: "null", value: "None", description: "Python None", language: "python", dataType: "array" },
    { category: "null", value: "null", description: "JavaScript null", language: "javascript", dataType: "array" },
    { category: "null", value: "nil", description: "Go nil", language: "go", dataType: "array" },

    // Array - Empty
    { category: "empty", value: "[]", description: "빈 배열", language: "java", dataType: "array" },
    { category: "empty", value: "[null]", description: "null만 포함된 배열", language: "java", dataType: "array" },
    { category: "empty", value: "[null, null, null]", description: "여러 null 요소", language: "java", dataType: "array" },

    // Array - Special
    { category: "special", value: "[1, 2, 3]", description: "정상적인 배열", language: "java", dataType: "array" },
    { category: "special", value: '[1, "two", null, true]', description: "혼합 타입 배열", language: "javascript", dataType: "array" },
    { category: "special", value: "[[1, 2], [3, 4]]", description: "중첩 배열", language: "java", dataType: "array" },
    { category: "special", value: "[1, [2, [3, [4]]]]", description: "깊이 중첩된 배열", language: "javascript", dataType: "array" },
    
    // Array - Boundary
    { category: "boundary", value: "new Array(1000000)", description: "매우 큰 배열", language: "javascript", dataType: "array" },
    { category: "boundary", value: "[1]", description: "단일 요소 배열", language: "java", dataType: "array" },

    // Date - Null
    { category: "null", value: "null", description: "Date null 참조", language: "java", dataType: "date" },
    { category: "null", value: "None", description: "Python None", language: "python", dataType: "date" },
    { category: "null", value: "null", description: "JavaScript null", language: "javascript", dataType: "date" },
    { category: "null", value: "nil", description: "Go nil", language: "go", dataType: "date" },

    // Date - Special
    { category: "special", value: "new Date(0)", description: "Unix Epoch (1970-01-01)", language: "javascript", dataType: "date" },
    { category: "special", value: "new Date(NaN)", description: "Invalid Date", language: "javascript", dataType: "date" },
    { category: "special", value: "new Date(-1)", description: "Epoch 이전 날짜", language: "javascript", dataType: "date" },

    // Date - Boundary
    { category: "boundary", value: "new Date(8640000000000000)", description: "최대 날짜", language: "javascript", dataType: "date" },
    { category: "boundary", value: "new Date(-8640000000000000)", description: "최소 날짜", language: "javascript", dataType: "date" },

    // Date - Format
    { category: "format", value: '"2024-02-30"', description: "존재하지 않는 날짜", language: "java", dataType: "date" },
    { category: "format", value: '"2024-13-01"', description: "잘못된 월", language: "java", dataType: "date" },
    { category: "format", value: '"2024-12-32"', description: "잘못된 일", language: "java", dataType: "date" },
    { category: "format", value: '"25:00:00"', description: "잘못된 시간", language: "java", dataType: "date" },
    { category: "format", value: '"2024/02/29"', description: "윤년 날짜", language: "java", dataType: "date" },
    { category: "format", value: '"2023/02/29"', description: "평년의 2월 29일 (존재하지 않음)", language: "java", dataType: "date" },
  ], []);

  // Filter test cases based on selections
  const filteredCases = useMemo(() => {
    return testCases.filter((testCase) => {
      const languageMatch = testCase.language === selectedLanguage;
      const dataTypeMatch = testCase.dataType === selectedDataType;
      const categoryMatch = selectedCategory === "all" || testCase.category === selectedCategory;
      
      return languageMatch && dataTypeMatch && categoryMatch;
    });
  }, [selectedLanguage, selectedDataType, selectedCategory, testCases]);

  // Get unique categories for current selection
  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    testCases
      .filter((tc) => tc.language === selectedLanguage && tc.dataType === selectedDataType)
      .forEach((tc) => categories.add(tc.category));
    return Array.from(categories);
  }, [selectedLanguage, selectedDataType, testCases]);

  const handleCopy = async (value: string, index: number) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedIndex(index);
      toast.success(t("tools.testdata.copied"));
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      toast.error(t("tools.testdata.copyError"));
    }
  };

  const handleCopyAll = async () => {
    try {
      const allValues = filteredCases.map((tc) => tc.value).join("\n");
      await navigator.clipboard.writeText(allValues);
      toast.success(t("tools.testdata.allCopied"));
    } catch {
      toast.error(t("tools.testdata.copyError"));
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      null: "bg-gray-500",
      empty: "bg-blue-500",
      special: "bg-purple-500",
      boundary: "bg-orange-500",
      format: "bg-yellow-500",
      unicode: "bg-green-500",
      security: "bg-red-500",
    };
    return colors[category] || "bg-gray-500";
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6" />
            {t("tools.testdata.settings")}
          </CardTitle>
          <CardDescription>{t("tools.testdata.settingsDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Language Selection */}
            <div className="space-y-2">
              <Label>{t("tools.testdata.language")}</Label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="java">{t("tools.testdata.languages.java")}</SelectItem>
                  <SelectItem value="python">{t("tools.testdata.languages.python")}</SelectItem>
                  <SelectItem value="javascript">{t("tools.testdata.languages.javascript")}</SelectItem>
                  <SelectItem value="go">{t("tools.testdata.languages.go")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Data Type Selection */}
            <div className="space-y-2">
              <Label>{t("tools.testdata.dataType")}</Label>
              <Select value={selectedDataType} onValueChange={setSelectedDataType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="string">{t("tools.testdata.dataTypes.string")}</SelectItem>
                  <SelectItem value="integer">{t("tools.testdata.dataTypes.integer")}</SelectItem>
                  <SelectItem value="float">{t("tools.testdata.dataTypes.float")}</SelectItem>
                  <SelectItem value="boolean">{t("tools.testdata.dataTypes.boolean")}</SelectItem>
                  <SelectItem value="array">{t("tools.testdata.dataTypes.array")}</SelectItem>
                  <SelectItem value="date">{t("tools.testdata.dataTypes.date")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <Label>{t("tools.testdata.filterCategory")}</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("tools.testdata.allCategories")}</SelectItem>
                  {availableCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {t(`tools.testdata.categories.${cat}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Cases Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("tools.testdata.testCases")}</CardTitle>
              <CardDescription>
                {t("tools.testdata.totalCount")} {filteredCases.length} {t("tools.testdata.cases")}
              </CardDescription>
            </div>
            {filteredCases.length > 0 && (
              <Button onClick={handleCopyAll} variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                {t("tools.testdata.copyAll")}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {filteredCases.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {t("tools.testdata.emptyState")}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCases.map((testCase, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent transition-colors"
                >
                  <Badge className={`${getCategoryColor(testCase.category)} text-white shrink-0`}>
                    {t(`tools.testdata.categories.${testCase.category}`)}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <code className="text-sm font-mono bg-muted px-2 py-1 rounded block truncate">
                      {testCase.value}
                    </code>
                    <p className="text-xs text-muted-foreground mt-1">{testCase.description}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy(testCase.value, index)}
                    className="shrink-0"
                  >
                    {copiedIndex === index ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t("tools.testdata.aboutEdgeCases")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">{t("tools.testdata.whatIsEdgeCase")}</h4>
            <p className="text-sm text-muted-foreground">
              {t("tools.testdata.whatIsEdgeCaseDesc")}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">{t("tools.testdata.whyNeeded")}</h4>
            <p className="text-sm text-muted-foreground">
              {t("tools.testdata.whyNeededDesc")}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
