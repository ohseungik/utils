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
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
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
      toast(t("common.copy") + " - " + t("common.error"));
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      toast(t("common.success"));
    } catch (error) {
      console.error("복사 오류:", error);
      toast(t("common.error"));
    }
  };

  const handleClear = () => {
    setText("");
    toast(t("common.success"));
  };

  const handleToUpperCase = () => {
    setText(text.toUpperCase());
    toast(t("common.success"));
  };

  const handleToLowerCase = () => {
    setText(text.toLowerCase());
    toast(t("common.success"));
  };

  const handleCapitalize = () => {
    const capitalized = text
      .split(". ")
      .map((sentence) => sentence.charAt(0).toUpperCase() + sentence.slice(1))
      .join(". ");
    setText(capitalized);
    toast(t("common.success"));
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
                {t("tools.wordcounter.textInput")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="text-input">
                  {t("tools.wordcounter.placeholder")}
                </Label>
                <Textarea
                  id="text-input"
                  placeholder={t("tools.wordcounter.placeholder")}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[400px] mt-2 font-mono"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="mr-2 h-4 w-4" />
                  {t("common.copy")}
                </Button>
                <Button variant="outline" size="sm" onClick={handleClear}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {t("common.clear")}
                </Button>
                <Button variant="outline" size="sm" onClick={handleToUpperCase}>
                  {t("tools.wordcounter.toUpperCase")}
                </Button>
                <Button variant="outline" size="sm" onClick={handleToLowerCase}>
                  {t("tools.wordcounter.toLowerCase")}
                </Button>
                <Button variant="outline" size="sm" onClick={handleCapitalize}>
                  {t("tools.wordcounter.capitalize")}
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
                {t("tools.wordcounter.textStats")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <StatItem
                  label={t("tools.wordcounter.totalCharacters")}
                  value={stats.totalCharacters}
                  icon={<Type className="h-4 w-4" />}
                />
                <StatItem
                  label={t("tools.wordcounter.charactersNoSpaces")}
                  value={stats.charactersNoSpaces}
                  icon={<Type className="h-4 w-4" />}
                />
                <StatItem
                  label={t("tools.wordcounter.words")}
                  value={stats.words}
                  icon={<AlignLeft className="h-4 w-4" />}
                />
                <StatItem
                  label={t("tools.wordcounter.sentences")}
                  value={stats.sentences}
                  icon={<ListOrdered className="h-4 w-4" />}
                />
                <StatItem
                  label={t("tools.wordcounter.paragraphs")}
                  value={stats.paragraphs}
                  icon={<FileText className="h-4 w-4" />}
                />
                <StatItem
                  label={t("tools.wordcounter.lines")}
                  value={stats.lines}
                  icon={<AlignLeft className="h-4 w-4" />}
                />
              </div>

              {stats.words > 0 && (
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {t("tools.wordcounter.readingTime")}
                    </span>
                    <Badge variant="secondary">
                      {stats.readingTime}
                      {t("tools.wordcounter.minutes")}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("tools.wordcounter.readingTimeNote")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 추가 정보 카드 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {t("tools.wordcounter.helpTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• {t("tools.wordcounter.helpItems.0")}</li>
                <li>• {t("tools.wordcounter.helpItems.1")}</li>
                <li>• {t("tools.wordcounter.helpItems.2")}</li>
                <li>• {t("tools.wordcounter.helpItems.3")}</li>
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
