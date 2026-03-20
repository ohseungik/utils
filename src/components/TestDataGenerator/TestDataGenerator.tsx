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
    // ===== STRING TESTS =====
    // String - Null/Undefined
    { category: "null", value: "null", description: "null 참조", language: "java", dataType: "string" },
    { category: "null", value: "None", description: "None 값", language: "python", dataType: "string" },
    { category: "null", value: "null", description: "null 값", language: "javascript", dataType: "string" },
    { category: "null", value: "undefined", description: "undefined 값", language: "javascript", dataType: "string" },
    { category: "null", value: "nil", description: "nil 참조", language: "go", dataType: "string" },
    
    // String - Empty/Whitespace
    { category: "empty", value: '""', description: "빈 문자열", language: "java", dataType: "string" },
    { category: "empty", value: "''", description: "빈 문자열", language: "python", dataType: "string" },
    { category: "empty", value: '""', description: "빈 문자열", language: "javascript", dataType: "string" },
    { category: "empty", value: '``', description: "빈 템플릿 리터럴", language: "javascript", dataType: "string" },
    { category: "empty", value: '""', description: "빈 문자열", language: "go", dataType: "string" },
    { category: "empty", value: '" "', description: "공백 1개", language: "java", dataType: "string" },
    { category: "empty", value: "' '", description: "공백 1개", language: "python", dataType: "string" },
    { category: "empty", value: '" "', description: "공백 1개", language: "javascript", dataType: "string" },
    { category: "empty", value: '" "', description: "공백 1개", language: "go", dataType: "string" },
    { category: "empty", value: '"  "', description: "공백 2개", language: "java", dataType: "string" },
    { category: "empty", value: '"   "', description: "공백 3개", language: "python", dataType: "string" },
    { category: "empty", value: '"    "', description: "공백 4개", language: "javascript", dataType: "string" },
    { category: "empty", value: '"\\t"', description: "탭 문자", language: "java", dataType: "string" },
    { category: "empty", value: '"\\n"', description: "개행 문자", language: "java", dataType: "string" },
    { category: "empty", value: '"\\r"', description: "캐리지 리턴", language: "java", dataType: "string" },
    { category: "empty", value: '"\\n\\t\\r"', description: "혼합 공백문자", language: "java", dataType: "string" },
    { category: "empty", value: '" \\t\\n "', description: "공백+탭+개행", language: "python", dataType: "string" },

    // String - Special Cases
    { category: "special", value: '"0"', description: "문자열 0", language: "java", dataType: "string" },
    { category: "special", value: '"false"', description: "문자열 false", language: "java", dataType: "string" },
    { category: "special", value: '"true"', description: "문자열 true", language: "python", dataType: "string" },
    { category: "special", value: '"null"', description: "문자열 null", language: "java", dataType: "string" },
    { category: "special", value: '"undefined"', description: "문자열 undefined", language: "javascript", dataType: "string" },
    { category: "special", value: '"NaN"', description: "문자열 NaN", language: "javascript", dataType: "string" },
    { category: "special", value: '"Infinity"', description: "문자열 Infinity", language: "javascript", dataType: "string" },
    { category: "special", value: '"-Infinity"', description: "문자열 -Infinity", language: "javascript", dataType: "string" },
    { category: "special", value: '"[]"', description: "문자열 배열", language: "go", dataType: "string" },
    { category: "special", value: '"{}"', description: "문자열 객체", language: "javascript", dataType: "string" },

    // String - Boundary
    { category: "boundary", value: '"A"', description: "1글자", language: "java", dataType: "string" },
    { category: "boundary", value: '"A".repeat(10)', description: "10글자", language: "javascript", dataType: "string" },
    { category: "boundary", value: '"A" * 100', description: "100글자", language: "python", dataType: "string" },
    { category: "boundary", value: '"A".repeat(1000)', description: "1000글자", language: "javascript", dataType: "string" },
    { category: "boundary", value: '"A" * 10000', description: "10000글자", language: "python", dataType: "string" },
    { category: "boundary", value: '"가".repeat(65535)', description: "최대 길이 (65535)", language: "java", dataType: "string" },
    { category: "boundary", value: '"A".repeat(1000000)', description: "1MB 문자열", language: "javascript", dataType: "string" },

    // String - Format
    { category: "format", value: '"test@"', description: "불완전한 이메일", language: "java", dataType: "string" },
    { category: "format", value: '"@email.com"', description: "이메일 형식 오류", language: "python", dataType: "string" },
    { category: "format", value: '"test email@email.com"', description: "공백 포함 이메일", language: "javascript", dataType: "string" },
    { category: "format", value: '"test@@email.com"', description: "이중 @ 이메일", language: "go", dataType: "string" },
    { category: "format", value: '"http:/"', description: "불완전한 URL", language: "java", dataType: "string" },
    { category: "format", value: '"//example.com"', description: "프로토콜 없는 URL", language: "python", dataType: "string" },
    { category: "format", value: '"ftp://"', description: "도메인 없는 URL", language: "javascript", dataType: "string" },
    { category: "format", value: '"2024-13-01"', description: "잘못된 월(13)", language: "java", dataType: "string" },
    { category: "format", value: '"2024-00-01"', description: "잘못된 월(0)", language: "python", dataType: "string" },
    { category: "format", value: '"2024-02-30"', description: "2월 30일", language: "javascript", dataType: "string" },
    { category: "format", value: '"2024-12-32"', description: "잘못된 일(32)", language: "go", dataType: "string" },
    { category: "format", value: '"25:00:00"', description: "잘못된 시간(25시)", language: "java", dataType: "string" },
    { category: "format", value: '"00:61:00"', description: "잘못된 분(61)", language: "python", dataType: "string" },
    { category: "format", value: '"+1-234"', description: "짧은 전화번호", language: "javascript", dataType: "string" },

    // String - Unicode/Encoding
    { category: "unicode", value: '"안녕하세요"', description: "한글", language: "java", dataType: "string" },
    { category: "unicode", value: '"你好世界"', description: "중국어", language: "python", dataType: "string" },
    { category: "unicode", value: '"こんにちは"', description: "일본어", language: "javascript", dataType: "string" },
    { category: "unicode", value: '"Привет"', description: "러시아어", language: "go", dataType: "string" },
    { category: "unicode", value: '"مرحبا"', description: "아랍어 (RTL)", language: "java", dataType: "string" },
    { category: "unicode", value: '"שלום"', description: "히브리어 (RTL)", language: "python", dataType: "string" },
    { category: "unicode", value: '"Ñoño"', description: "스페인어 특수문자", language: "javascript", dataType: "string" },
    { category: "unicode", value: '"Café"', description: "프랑스어 악센트", language: "go", dataType: "string" },
    { category: "unicode", value: '"😀😃😄"', description: "이모지", language: "java", dataType: "string" },
    { category: "unicode", value: '"🚀🎉💯"', description: "다양한 이모지", language: "python", dataType: "string" },
    { category: "unicode", value: '"👨‍👩‍👧‍👦"', description: "복합 이모지", language: "javascript", dataType: "string" },
    { category: "unicode", value: '"\\uD83D\\uDE00"', description: "유니코드 이스케이프", language: "java", dataType: "string" },
    { category: "unicode", value: '"\\u4F60\\u597D"', description: "중국어 유니코드", language: "python", dataType: "string" },

    // String - Security
    { category: "security", value: '"\' OR 1=1--"', description: "SQL 인젝션 기본", language: "java", dataType: "string" },
    { category: "security", value: '"\' OR \'a\'=\'a"', description: "SQL 인젝션 변형", language: "python", dataType: "string" },
    { category: "security", value: '"; DROP TABLE users--"', description: "SQL DROP 공격", language: "javascript", dataType: "string" },
    { category: "security", value: '"\' UNION SELECT * FROM users--"', description: "SQL UNION 공격", language: "go", dataType: "string" },
    { category: "security", value: '"<script>alert(1)</script>"', description: "XSS 기본", language: "java", dataType: "string" },
    { category: "security", value: '"<img src=x onerror=alert(1)>"', description: "XSS 이미지 공격", language: "python", dataType: "string" },
    { category: "security", value: '"<iframe src=javascript:alert(1)>"', description: "XSS iframe 공격", language: "javascript", dataType: "string" },
    { category: "security", value: '"javascript:alert(1)"', description: "자바스크립트 프로토콜", language: "go", dataType: "string" },
    { category: "security", value: '"../../../etc/passwd"', description: "경로 탐색 공격", language: "java", dataType: "string" },
    { category: "security", value: '"..\\\\..\\\\..\\\\windows\\\\system32"', description: "윈도우 경로 공격", language: "python", dataType: "string" },
    { category: "security", value: '"%00"', description: "Null byte", language: "javascript", dataType: "string" },
    { category: "security", value: '"\${7*7}"', description: "템플릿 인젝션", language: "go", dataType: "string" },
    { category: "security", value: '"{{7*7}}"', description: "템플릿 인젝션 (Jinja)", language: "python", dataType: "string" },
    { category: "security", value: '"`rm -rf /`"', description: "명령어 인젝션", language: "go", dataType: "string" },

    // ===== INTEGER TESTS =====
    // Integer - Null
    { category: "null", value: "null", description: "null 참조", language: "java", dataType: "integer" },
    { category: "null", value: "None", description: "None 값", language: "python", dataType: "integer" },
    { category: "null", value: "null", description: "null 값", language: "javascript", dataType: "integer" },
    { category: "null", value: "undefined", description: "undefined 값", language: "javascript", dataType: "integer" },
    { category: "null", value: "nil", description: "nil 참조", language: "go", dataType: "integer" },

    // Integer - Empty/Special
    { category: "empty", value: "0", description: "0", language: "java", dataType: "integer" },
    { category: "empty", value: "0", description: "0", language: "python", dataType: "integer" },
    { category: "empty", value: "0", description: "0 (falsy)", language: "javascript", dataType: "integer" },
    { category: "empty", value: "0", description: "0", language: "go", dataType: "integer" },
    { category: "special", value: "-0", description: "음수 0", language: "javascript", dataType: "integer" },
    { category: "special", value: "1", description: "1", language: "java", dataType: "integer" },
    { category: "special", value: "-1", description: "-1", language: "python", dataType: "integer" },
    { category: "special", value: "NaN", description: "Not a Number", language: "javascript", dataType: "integer" },
    { category: "special", value: "Infinity", description: "양의 무한대", language: "javascript", dataType: "integer" },
    { category: "special", value: "-Infinity", description: "음의 무한대", language: "javascript", dataType: "integer" },

    // Integer - Boundary
    { category: "boundary", value: "127", description: "byte 최댓값", language: "java", dataType: "integer" },
    { category: "boundary", value: "-128", description: "byte 최솟값", language: "java", dataType: "integer" },
    { category: "boundary", value: "32767", description: "short 최댓값", language: "java", dataType: "integer" },
    { category: "boundary", value: "-32768", description: "short 최솟값", language: "java", dataType: "integer" },
    { category: "boundary", value: "2147483647", description: "int 최댓값", language: "java", dataType: "integer" },
    { category: "boundary", value: "-2147483648", description: "int 최솟값", language: "java", dataType: "integer" },
    { category: "boundary", value: "2147483648", description: "int 오버플로우", language: "java", dataType: "integer" },
    { category: "boundary", value: "-2147483649", description: "int 언더플로우", language: "java", dataType: "integer" },
    { category: "boundary", value: "9223372036854775807", description: "long 최댓값", language: "java", dataType: "integer" },
    { category: "boundary", value: "-9223372036854775808", description: "long 최솟값", language: "java", dataType: "integer" },
    { category: "boundary", value: "9007199254740991", description: "JS 최대 안전 정수", language: "javascript", dataType: "integer" },
    { category: "boundary", value: "-9007199254740991", description: "JS 최소 안전 정수", language: "javascript", dataType: "integer" },
    { category: "boundary", value: "9007199254740992", description: "JS 안전 범위 초과", language: "javascript", dataType: "integer" },
    { category: "boundary", value: "sys.maxsize", description: "Python 최대 정수", language: "python", dataType: "integer" },

    // Integer - Format
    { category: "format", value: '"123"', description: "문자열 숫자", language: "java", dataType: "integer" },
    { category: "format", value: '"+123"', description: "양수 기호 포함", language: "python", dataType: "integer" },
    { category: "format", value: '"0123"', description: "선행 0 포함", language: "javascript", dataType: "integer" },
    { category: "format", value: '"0x1A"', description: "16진수 문자열", language: "go", dataType: "integer" },
    { category: "format", value: '"0o17"', description: "8진수 문자열", language: "python", dataType: "integer" },
    { category: "format", value: '"0b1010"', description: "2진수 문자열", language: "java", dataType: "integer" },
    { category: "format", value: '"1e10"', description: "과학적 표기법", language: "javascript", dataType: "integer" },
    { category: "format", value: '"1_000_000"', description: "언더스코어 구분자", language: "python", dataType: "integer" },
    { category: "format", value: '"12.0"', description: "소수점 포함 정수", language: "javascript", dataType: "integer" },
    { category: "format", value: '"  123  "', description: "공백 포함 숫자", language: "java", dataType: "integer" },

    // ===== FLOAT TESTS =====
    // Float - Null
    { category: "null", value: "null", description: "null 참조", language: "java", dataType: "float" },
    { category: "null", value: "None", description: "None 값", language: "python", dataType: "float" },
    { category: "null", value: "null", description: "null 값", language: "javascript", dataType: "float" },
    { category: "null", value: "undefined", description: "undefined 값", language: "javascript", dataType: "float" },
    { category: "null", value: "nil", description: "nil 참조", language: "go", dataType: "float" },

    // Float - Special
    { category: "special", value: "0.0", description: "0.0", language: "java", dataType: "float" },
    { category: "special", value: "-0.0", description: "음수 0.0", language: "java", dataType: "float" },
    { category: "special", value: "1.0", description: "1.0", language: "python", dataType: "float" },
    { category: "special", value: "-1.0", description: "-1.0", language: "go", dataType: "float" },
    { category: "special", value: "NaN", description: "Not a Number", language: "javascript", dataType: "float" },
    { category: "special", value: "Infinity", description: "양의 무한대", language: "javascript", dataType: "float" },
    { category: "special", value: "-Infinity", description: "음의 무한대", language: "javascript", dataType: "float" },
    { category: "special", value: "float('inf')", description: "Python 무한대", language: "python", dataType: "float" },
    { category: "special", value: "float('-inf')", description: "Python 음의 무한대", language: "python", dataType: "float" },
    { category: "special", value: "float('nan')", description: "Python NaN", language: "python", dataType: "float" },

    // Float - Boundary
    { category: "boundary", value: "3.4028235e38", description: "float 최댓값", language: "java", dataType: "float" },
    { category: "boundary", value: "-3.4028235e38", description: "float 최솟값", language: "java", dataType: "float" },
    { category: "boundary", value: "1.4e-45", description: "float 최소 양수", language: "java", dataType: "float" },
    { category: "boundary", value: "1.7976931348623157e308", description: "double 최댓값", language: "java", dataType: "float" },
    { category: "boundary", value: "4.9e-324", description: "double 최소 양수", language: "java", dataType: "float" },
    { category: "boundary", value: "Number.MAX_VALUE", description: "JS 최댓값", language: "javascript", dataType: "float" },
    { category: "boundary", value: "Number.MIN_VALUE", description: "JS 최솟값", language: "javascript", dataType: "float" },
    { category: "boundary", value: "Number.EPSILON", description: "JS 엡실론", language: "javascript", dataType: "float" },
    { category: "boundary", value: "0.1 + 0.2", description: "부동소수점 오차", language: "javascript", dataType: "float" },
    { category: "boundary", value: "0.1 + 0.1 + 0.1", description: "반복 연산 오차", language: "python", dataType: "float" },

    // Float - Format
    { category: "format", value: '"3.14"', description: "문자열 소수", language: "java", dataType: "float" },
    { category: "format", value: '".5"', description: "선행 0 생략", language: "python", dataType: "float" },
    { category: "format", value: '"5."', description: "후행 소수점", language: "javascript", dataType: "float" },
    { category: "format", value: '"1.23e-4"', description: "과학적 표기법", language: "go", dataType: "float" },
    { category: "format", value: '"1.23E+4"', description: "대문자 지수", language: "java", dataType: "float" },
    { category: "format", value: '"+3.14"', description: "양수 기호", language: "python", dataType: "float" },
    { category: "format", value: '"  3.14  "', description: "공백 포함", language: "javascript", dataType: "float" },
    { category: "format", value: '"3.14159265359"', description: "높은 정밀도", language: "java", dataType: "float" },

    // ===== BOOLEAN TESTS =====
    // Boolean - Null
    { category: "null", value: "null", description: "null 참조", language: "java", dataType: "boolean" },
    { category: "null", value: "None", description: "None 값", language: "python", dataType: "boolean" },
    { category: "null", value: "null", description: "null 값", language: "javascript", dataType: "boolean" },
    { category: "null", value: "undefined", description: "undefined 값", language: "javascript", dataType: "boolean" },
    { category: "null", value: "nil", description: "nil 참조", language: "go", dataType: "boolean" },

    // Boolean - Special
    { category: "special", value: "true", description: "true", language: "java", dataType: "boolean" },
    { category: "special", value: "false", description: "false", language: "java", dataType: "boolean" },
    { category: "special", value: "True", description: "True", language: "python", dataType: "boolean" },
    { category: "special", value: "False", description: "False", language: "python", dataType: "boolean" },
    { category: "special", value: "true", description: "true", language: "javascript", dataType: "boolean" },
    { category: "special", value: "false", description: "false", language: "javascript", dataType: "boolean" },
    { category: "special", value: "true", description: "true", language: "go", dataType: "boolean" },
    { category: "special", value: "false", description: "false", language: "go", dataType: "boolean" },
    { category: "special", value: "0", description: "0 (falsy)", language: "javascript", dataType: "boolean" },
    { category: "special", value: "1", description: "1 (truthy)", language: "javascript", dataType: "boolean" },
    { category: "special", value: '""', description: '빈 문자열 (falsy)', language: "javascript", dataType: "boolean" },
    { category: "special", value: '"false"', description: '문자열 "false" (truthy)', language: "javascript", dataType: "boolean" },
    { category: "special", value: "[]", description: "빈 배열 (truthy)", language: "javascript", dataType: "boolean" },
    { category: "special", value: "{}", description: "빈 객체 (truthy)", language: "javascript", dataType: "boolean" },

    // Boolean - Format
    { category: "format", value: '"true"', description: '문자열 "true"', language: "java", dataType: "boolean" },
    { category: "format", value: '"false"', description: '문자열 "false"', language: "python", dataType: "boolean" },
    { category: "format", value: '"TRUE"', description: '대문자 "TRUE"', language: "javascript", dataType: "boolean" },
    { category: "format", value: '"FALSE"', description: '대문자 "FALSE"', language: "go", dataType: "boolean" },
    { category: "format", value: '"1"', description: '문자열 "1"', language: "java", dataType: "boolean" },
    { category: "format", value: '"0"', description: '문자열 "0"', language: "python", dataType: "boolean" },
    { category: "format", value: '"yes"', description: '문자열 "yes"', language: "javascript", dataType: "boolean" },
    { category: "format", value: '"no"', description: '문자열 "no"', language: "go", dataType: "boolean" },

    // ===== ARRAY TESTS =====
    // Array - Null
    { category: "null", value: "null", description: "null 참조", language: "java", dataType: "array" },
    { category: "null", value: "None", description: "None 값", language: "python", dataType: "array" },
    { category: "null", value: "null", description: "null 값", language: "javascript", dataType: "array" },
    { category: "null", value: "undefined", description: "undefined 값", language: "javascript", dataType: "array" },
    { category: "null", value: "nil", description: "nil 참조", language: "go", dataType: "array" },

    // Array - Empty
    { category: "empty", value: "[]", description: "빈 배열", language: "java", dataType: "array" },
    { category: "empty", value: "[]", description: "빈 리스트", language: "python", dataType: "array" },
    { category: "empty", value: "[]", description: "빈 배열", language: "javascript", dataType: "array" },
    { category: "empty", value: "[]", description: "빈 슬라이스", language: "go", dataType: "array" },
    { category: "empty", value: "[null]", description: "null 1개", language: "java", dataType: "array" },
    { category: "empty", value: "[None]", description: "None 1개", language: "python", dataType: "array" },
    { category: "empty", value: "[null, null]", description: "null 2개", language: "javascript", dataType: "array" },
    { category: "empty", value: "[nil, nil, nil]", description: "nil 3개", language: "go", dataType: "array" },

    // Array - Special
    { category: "special", value: "[1]", description: "단일 요소", language: "java", dataType: "array" },
    { category: "special", value: "[1, 2, 3]", description: "정수 배열", language: "python", dataType: "array" },
    { category: "special", value: '["a", "b", "c"]', description: "문자열 배열", language: "javascript", dataType: "array" },
    { category: "special", value: "[true, false]", description: "불린 배열", language: "go", dataType: "array" },
    { category: "special", value: '[1, "two", 3.0]', description: "혼합 타입", language: "python", dataType: "array" },
    { category: "special", value: '[1, "two", null, true]', description: "다양한 타입", language: "javascript", dataType: "array" },
    { category: "special", value: "[[1, 2], [3, 4]]", description: "2차원 배열", language: "java", dataType: "array" },
    { category: "special", value: "[[[1, 2]], [[3, 4]]]", description: "3차원 배열", language: "python", dataType: "array" },
    { category: "special", value: "[1, [2, [3, [4]]]]", description: "깊은 중첩", language: "javascript", dataType: "array" },
    { category: "special", value: "[[], [[]], [[[]]]]", description: "빈 배열 중첩", language: "go", dataType: "array" },

    // Array - Boundary
    { category: "boundary", value: "new Array(0)", description: "크기 0 배열", language: "javascript", dataType: "array" },
    { category: "boundary", value: "new Array(1000)", description: "크기 1000 배열", language: "javascript", dataType: "array" },
    { category: "boundary", value: "new Array(1000000)", description: "매우 큰 배열", language: "javascript", dataType: "array" },
    { category: "boundary", value: "[0] * 1000", description: "반복 생성 1000", language: "python", dataType: "array" },
    { category: "boundary", value: "new int[Integer.MAX_VALUE]", description: "최대 크기 시도", language: "java", dataType: "array" },
    { category: "boundary", value: "make([]int, 1000000)", description: "큰 슬라이스", language: "go", dataType: "array" },

    // Array - Format  
    { category: "format", value: "[1,2,3]", description: "공백 없음", language: "java", dataType: "array" },
    { category: "format", value: "[1, 2, 3,]", description: "후행 쉼표", language: "python", dataType: "array" },
    { category: "format", value: "[ 1 , 2 , 3 ]", description: "불규칙 공백", language: "javascript", dataType: "array" },
    { category: "format", value: '"[1,2,3]"', description: "문자열 배열", language: "go", dataType: "array" },

    // ===== DATE TESTS =====
    // Date - Null
    { category: "null", value: "null", description: "null 참조", language: "java", dataType: "date" },
    { category: "null", value: "None", description: "None 값", language: "python", dataType: "date" },
    { category: "null", value: "null", description: "null 값", language: "javascript", dataType: "date" },
    { category: "null", value: "undefined", description: "undefined 값", language: "javascript", dataType: "date" },
    { category: "null", value: "nil", description: "nil 참조", language: "go", dataType: "date" },

    // Date - Special
    { category: "special", value: "new Date(0)", description: "Unix Epoch", language: "javascript", dataType: "date" },
    { category: "special", value: "new Date(-1)", description: "Epoch 이전", language: "javascript", dataType: "date" },
    { category: "special", value: "new Date(NaN)", description: "Invalid Date", language: "javascript", dataType: "date" },
    { category: "special", value: "datetime(1970, 1, 1)", description: "Epoch 시작", language: "python", dataType: "date" },
    { category: "special", value: "datetime(1969, 12, 31)", description: "Epoch 이전", language: "python", dataType: "date" },
    { category: "special", value: "time.Time{}", description: "Zero Time", language: "go", dataType: "date" },
    { category: "special", value: "LocalDate.of(1970, 1, 1)", description: "Epoch", language: "java", dataType: "date" },

    // Date - Boundary
    { category: "boundary", value: "new Date(8640000000000000)", description: "최대 날짜", language: "javascript", dataType: "date" },
    { category: "boundary", value: "new Date(-8640000000000000)", description: "최소 날짜", language: "javascript", dataType: "date" },
    { category: "boundary", value: "datetime.max", description: "Python 최대", language: "python", dataType: "date" },
    { category: "boundary", value: "datetime.min", description: "Python 최소", language: "python", dataType: "date" },
    { category: "boundary", value: "LocalDate.MAX", description: "Java 최대", language: "java", dataType: "date" },
    { category: "boundary", value: "LocalDate.MIN", description: "Java 최소", language: "java", dataType: "date" },

    // Date - Format
    { category: "format", value: '"2024-02-30"', description: "존재하지 않는 날짜", language: "java", dataType: "date" },
    { category: "format", value: '"2024-13-01"', description: "잘못된 월(13)", language: "python", dataType: "date" },
    { category: "format", value: '"2024-00-01"', description: "잘못된 월(0)", language: "javascript", dataType: "date" },
    { category: "format", value: '"2024-12-32"', description: "잘못된 일(32)", language: "go", dataType: "date" },
    { category: "format", value: '"2024-12-00"', description: "잘못된 일(0)", language: "java", dataType: "date" },
    { category: "format", value: '"25:00:00"', description: "잘못된 시간(25)", language: "python", dataType: "date" },
    { category: "format", value: '"00:61:00"', description: "잘못된 분(61)", language: "javascript", dataType: "date" },
    { category: "format", value: '"00:00:61"', description: "잘못된 초(61)", language: "go", dataType: "date" },
    { category: "format", value: '"2023-02-29"', description: "평년 2월 29일", language: "java", dataType: "date" },
    { category: "format", value: '"2024-02-29"', description: "윤년 2월 29일", language: "python", dataType: "date" },
    { category: "format", value: '"2024/02/29"', description: "슬래시 구분자", language: "javascript", dataType: "date" },
    { category: "format", value: '"2024.02.29"', description: "점 구분자", language: "go", dataType: "date" },
    { category: "format", value: '"20240229"', description: "구분자 없음", language: "java", dataType: "date" },
    { category: "format", value: '"Feb 29, 2024"', description: "영문 월", language: "python", dataType: "date" },
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
