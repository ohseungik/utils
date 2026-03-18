"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeftRight, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface DiffLine {
  type: "added" | "removed" | "unchanged";
  value: string;
  lineNumber?: number;
}

// 간단한 라인 단위 diff 알고리즘
function computeDiff(original: string, modified: string): DiffLine[] {
  const originalLines = original.split("\n");
  const modifiedLines = modified.split("\n");
  const result: DiffLine[] = [];

  // LCS (Longest Common Subsequence) 기반 diff
  const matrix: number[][] = [];
  for (let i = 0; i <= originalLines.length; i++) {
    matrix[i] = [];
    for (let j = 0; j <= modifiedLines.length; j++) {
      if (i === 0 || j === 0) {
        matrix[i][j] = 0;
      } else if (originalLines[i - 1] === modifiedLines[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1] + 1;
      } else {
        matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
      }
    }
  }

  // 역추적하여 diff 생성
  let i = originalLines.length;
  let j = modifiedLines.length;

  const diffResult: DiffLine[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && originalLines[i - 1] === modifiedLines[j - 1]) {
      diffResult.unshift({
        type: "unchanged",
        value: originalLines[i - 1],
        lineNumber: i,
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || matrix[i][j - 1] >= matrix[i - 1][j])) {
      diffResult.unshift({
        type: "added",
        value: modifiedLines[j - 1],
      });
      j--;
    } else if (i > 0) {
      diffResult.unshift({
        type: "removed",
        value: originalLines[i - 1],
        lineNumber: i,
      });
      i--;
    }
  }

  return diffResult;
}

export default function DiffChecker() {
  const { t } = useLanguage();
  const [originalText, setOriginalText] = useState<string>("");
  const [modifiedText, setModifiedText] = useState<string>("");
  const [showDiff, setShowDiff] = useState(false);
  const [diffResult, setDiffResult] = useState<DiffLine[]>([]);

  const handleCompare = () => {
    if (!originalText && !modifiedText) {
      toast.error(t("tools.diffchecker.emptyTexts"));
      return;
    }

    const result = computeDiff(originalText, modifiedText);
    setDiffResult(result);
    setShowDiff(true);
    toast.success(t("tools.diffchecker.compared"));
  };

  const handleClearOriginal = () => {
    setOriginalText("");
    toast.success(t("tools.diffchecker.originalCleared"));
  };

  const handleClearModified = () => {
    setModifiedText("");
    toast.success(t("tools.diffchecker.modifiedCleared"));
  };

  const handleSwap = () => {
    const temp = originalText;
    setOriginalText(modifiedText);
    setModifiedText(temp);
    toast.success(t("tools.diffchecker.swapped"));
  };

  const handleReset = () => {
    setOriginalText("");
    setModifiedText("");
    setShowDiff(false);
    setDiffResult([]);
    toast.success(t("tools.diffchecker.reset"));
  };

  const renderDiffLine = (line: DiffLine, index: number) => {
    let bgColor = "";
    let textColor = "";
    let prefix = "";

    switch (line.type) {
      case "added":
        bgColor = "bg-green-100 dark:bg-green-900/30";
        textColor = "text-green-900 dark:text-green-100";
        prefix = "+ ";
        break;
      case "removed":
        bgColor = "bg-red-100 dark:bg-red-900/30";
        textColor = "text-red-900 dark:text-red-100";
        prefix = "- ";
        break;
      case "unchanged":
        bgColor = "bg-background";
        textColor = "text-foreground";
        prefix = "  ";
        break;
    }

    return (
      <div
        key={index}
        className={`${bgColor} ${textColor} px-4 py-1 font-mono text-sm whitespace-pre-wrap break-all`}
      >
        <span className="select-none opacity-50 mr-2">
          {String(index + 1).padStart(3, " ")}
        </span>
        <span className="select-none font-bold mr-1">{prefix}</span>
        {line.value || " "}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 입력 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 원본 */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="original" className="text-lg font-semibold">
                {t("tools.diffchecker.original")}
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearOriginal}
                disabled={!originalText}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                {t("common.clear")}
              </Button>
            </div>
            <Textarea
              id="original"
              placeholder={t("tools.diffchecker.originalPlaceholder")}
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
          </CardContent>
        </Card>

        {/* 수정본 */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="modified" className="text-lg font-semibold">
                {t("tools.diffchecker.modified")}
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearModified}
                disabled={!modifiedText}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                {t("common.clear")}
              </Button>
            </div>
            <Textarea
              id="modified"
              placeholder={t("tools.diffchecker.modifiedPlaceholder")}
              value={modifiedText}
              onChange={(e) => setModifiedText(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
          </CardContent>
        </Card>
      </div>

      {/* 액션 버튼 */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button onClick={handleCompare} size="lg">
          {t("tools.diffchecker.compare")}
        </Button>
        <Button onClick={handleSwap} variant="outline" size="lg">
          <ArrowLeftRight className="h-4 w-4 mr-2" />
          {t("tools.diffchecker.swap")}
        </Button>
        <Button onClick={handleReset} variant="outline" size="lg">
          {t("common.reset")}
        </Button>
      </div>

      {/* Diff 결과 */}
      {showDiff && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-lg font-semibold">
                {t("tools.diffchecker.result")}
              </Label>
              <div className="flex gap-4 text-sm">
                <span className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 bg-green-100 dark:bg-green-900/30 border"></span>
                  {t("tools.diffchecker.added")}
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 bg-red-100 dark:bg-red-900/30 border"></span>
                  {t("tools.diffchecker.removed")}
                </span>
              </div>
            </div>

            <div className="border rounded-md overflow-hidden">
              {diffResult.length > 0 ? (
                <div className="max-h-[600px] overflow-auto">
                  {diffResult.map((line, index) => renderDiffLine(line, index))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  {t("tools.diffchecker.noDifference")}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 사용 방법 */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">
            {t("tools.diffchecker.howToUse")}
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
            <li>{t("tools.diffchecker.help1")}</li>
            <li>{t("tools.diffchecker.help2")}</li>
            <li>{t("tools.diffchecker.help3")}</li>
            <li>{t("tools.diffchecker.help4")}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
