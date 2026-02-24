"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Copy,
  RefreshCw,
  Type,
  FileText,
  AlignLeft,
  ListOrdered,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface TextStats {
  totalCharacters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTime: number;
}

export default function WordCounter() {
  const [text, setText] = useState<string>("");
  const [stats, setStats] = useState<TextStats>({
    totalCharacters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    lines: 0,
    readingTime: 0,
  });

  // 텍스트가 변경될 때마다 통계 계산
  useEffect(() => {
    calculateStats(text);
  }, [text]);

  const calculateStats = (input: string) => {
    // 전체 글자수
    const totalCharacters = input.length;

    // 공백 제외 글자수
    const charactersNoSpaces = input.replace(/\s/g, "").length;

    // 단어수 - 공백으로 구분, 빈 문자열 제외
    const words = input.trim() === "" ? 0 : input.trim().split(/\s+/).length;

    // 문장수 - 마침표, 느낌표, 물음표로 구분
    const sentences =
      input.trim() === ""
        ? 0
        : input.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;

    // 단락수 - 빈 줄로 구분
    const paragraphs =
      input.trim() === ""
        ? 0
        : input.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;

    // 줄 수
    const lines = input === "" ? 0 : input.split("\n").length;

    // 읽는 시간 (분) - 평균 200단어/분 기준
    const readingTime = Math.ceil(words / 200);

    setStats({
      totalCharacters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      lines,
      readingTime,
    });
  };

  const handleCopy = async () => {
    if (!text.trim()) {
      toast("복사할 텍스트가 없습니다");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      toast("텍스트가 클립보드에 복사되었습니다");
    } catch (error) {
      console.error("복사 오류:", error);
      toast("텍스트 복사에 실패했습니다");
    }
  };

  const handleClear = () => {
    setText("");
    toast("텍스트가 초기화되었습니다");
  };

  const handleToUpperCase = () => {
    setText(text.toUpperCase());
    toast("대문자로 변환되었습니다");
  };

  const handleToLowerCase = () => {
    setText(text.toLowerCase());
    toast("소문자로 변환되었습니다");
  };

  const handleCapitalize = () => {
    const capitalized = text
      .split(". ")
      .map((sentence) => sentence.charAt(0).toUpperCase() + sentence.slice(1))
      .join(". ");
    setText(capitalized);
    toast("문장의 첫 글자가 대문자로 변환되었습니다");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 텍스트 입력 영역 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                텍스트 입력
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="text-input">분석할 텍스트를 입력하세요</Label>
                <Textarea
                  id="text-input"
                  placeholder="여기에 텍스트를 입력하거나 붙여넣으세요..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[400px] mt-2 font-mono"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="mr-2 h-4 w-4" />
                  복사
                </Button>
                <Button variant="outline" size="sm" onClick={handleClear}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  초기화
                </Button>
                <Button variant="outline" size="sm" onClick={handleToUpperCase}>
                  대문자로
                </Button>
                <Button variant="outline" size="sm" onClick={handleToLowerCase}>
                  소문자로
                </Button>
                <Button variant="outline" size="sm" onClick={handleCapitalize}>
                  문장 첫 글자 대문자
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 통계 영역 */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                텍스트 통계
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <StatItem
                  label="전체 글자수"
                  value={stats.totalCharacters}
                  icon={<Type className="h-4 w-4" />}
                />
                <StatItem
                  label="공백 제외"
                  value={stats.charactersNoSpaces}
                  icon={<Type className="h-4 w-4" />}
                />
                <StatItem
                  label="단어수"
                  value={stats.words}
                  icon={<AlignLeft className="h-4 w-4" />}
                />
                <StatItem
                  label="문장수"
                  value={stats.sentences}
                  icon={<ListOrdered className="h-4 w-4" />}
                />
                <StatItem
                  label="단락수"
                  value={stats.paragraphs}
                  icon={<FileText className="h-4 w-4" />}
                />
                <StatItem
                  label="줄 수"
                  value={stats.lines}
                  icon={<AlignLeft className="h-4 w-4" />}
                />
              </div>

              {stats.words > 0 && (
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      예상 읽기 시간
                    </span>
                    <Badge variant="secondary">{stats.readingTime}분</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    평균 200단어/분 기준
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 추가 정보 카드 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">💡 도움말</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• 실시간으로 글자수와 단어수가 계산됩니다</li>
                <li>• 단어는 공백으로 구분됩니다</li>
                <li>• 문장은 마침표, 느낌표, 물음표로 구분됩니다</li>
                <li>• 단락은 빈 줄로 구분됩니다</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface StatItemProps {
  label: string;
  value: number;
  icon: React.ReactNode;
}

function StatItem({ label, value, icon }: StatItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="text-lg font-bold">{value.toLocaleString()}</span>
    </div>
  );
}
