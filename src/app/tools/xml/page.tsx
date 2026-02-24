"use client";

import { useState } from "react";
import { Copy, RotateCcw, Wand2, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function XmlFormatterPage() {
  const { t } = useLanguage();
  const [inputXml, setInputXml] = useState("");
  const [formattedXml, setFormattedXml] = useState("");

  const formatXML = (xml: string): string => {
    if (!xml.trim()) return "";

    try {
      // XML 문자열 정리
      const formatted = xml.replace(/>\s*</g, "><").trim();

      // 들여쓰기를 위한 변수
      let indent = 0;
      const indentSize = 2;
      let result = "";
      let inTag = false;
      let inClosingTag = false;

      for (let i = 0; i < formatted.length; i++) {
        const char = formatted[i];
        const nextChar = formatted[i + 1];

        if (char === "<") {
          // 새 줄 추가 (첫 번째 태그가 아닌 경우)
          if (result.length > 0 && !result.endsWith("\n")) {
            result += "\n";
          }

          // 닫는 태그인지 확인
          if (nextChar === "/") {
            inClosingTag = true;
            indent = Math.max(0, indent - indentSize);
          }

          // 들여쓰기 추가
          result += " ".repeat(indent);
          inTag = true;
        }

        result += char;

        if (char === ">") {
          inTag = false;

          // 자체 닫는 태그가 아니고 닫는 태그가 아닌 경우 들여쓰기 증가
          if (
            !formatted.substring(i - 1, i + 1).includes("/") &&
            !inClosingTag
          ) {
            // 다음 문자가 '<'가 아닌 경우 (텍스트 내용이 있는 경우)
            if (nextChar && nextChar !== "<") {
              // 텍스트 내용 처리
              let textEnd = i + 1;
              while (textEnd < formatted.length && formatted[textEnd] !== "<") {
                textEnd++;
              }
              const textContent = formatted.substring(i + 1, textEnd).trim();
              if (textContent) {
                result += textContent;
                i = textEnd - 1;
              }
            } else {
              indent += indentSize;
            }
          }

          inClosingTag = false;
        }
      }

      // 최종 정리
      return result
        .split("\n")
        .map((line) => line.trimRight())
        .filter((line) => line.length > 0)
        .join("\n");
    } catch (error) {
      throw new Error("Invalid XML format");
    }
  };

  const handleFormat = () => {
    try {
      const formatted = formatXML(inputXml);
      setFormattedXml(formatted);
    } catch (error) {
      toast(
        error instanceof Error ? error.message : t("tools.xml.formatError"),
      );
    }
  };

  const handleCopy = async () => {
    if (!formattedXml) return;

    try {
      await navigator.clipboard.writeText(formattedXml);
      toast(t("tools.xml.copySuccess"));
    } catch (err) {
      toast(t("tools.xml.copyError"));
    }
  };

  const handleClear = () => {
    setInputXml("");
    setFormattedXml("");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">{t("tools.xml.pageTitle")}</h1>
          <p className="text-muted-foreground">
            {t("tools.xml.pageDescription")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 입력 영역 */}
          <Card>
            <CardHeader>
              <CardTitle>{t("tools.xml.originalXml")}</CardTitle>
              <CardDescription>
                {t("tools.xml.inputDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder={t("tools.xml.inputPlaceholder")}
                value={inputXml}
                onChange={(e) => setInputXml(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
              />
              <div className="flex gap-2">
                <Button onClick={handleFormat} className="flex-1">
                  <Wand2 className="w-4 h-4 mr-2" />
                  {t("tools.xml.formatButton")}
                </Button>
                <Button variant="outline" onClick={handleClear}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {t("tools.xml.resetButton")}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 결과 영역 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t("tools.xml.formattedXml")}</span>
                {formattedXml && (
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    <Copy className="w-4 h-4 mr-2" />
                    {t("tools.xml.copyButton")}
                  </Button>
                )}
              </CardTitle>
              <CardDescription>
                {t("tools.xml.outputDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="min-h-[400px] p-4 bg-muted rounded-md">
                {formattedXml ? (
                  <pre className="font-mono text-sm whitespace-pre-wrap break-words">
                    {formattedXml}
                  </pre>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    {t("tools.xml.emptyState")}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 사용 예시 */}
        <Card>
          <CardHeader>
            <CardTitle>{t("tools.xml.exampleTitle")}</CardTitle>
            <CardDescription>
              {t("tools.xml.exampleDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">
                  {t("tools.xml.beforeFormat")}
                </h4>
                <code className="block p-3 bg-muted rounded text-xs">
                  {
                    '<root><user id="1"><name>John</name><email>john@example.com</email></user><user id="2"><name>Jane</name><email>jane@example.com</email></user></root>'
                  }
                </code>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">
                  {t("tools.xml.afterFormat")}
                </h4>
                <code className="block p-3 bg-muted rounded text-xs whitespace-pre">
                  {`<root>
  <user id="1">
    <name>John</name>
    <email>john@example.com</email>
  </user>
  <user id="2">
    <name>Jane</name>
    <email>jane@example.com</email>
  </user>
</root>`}
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
