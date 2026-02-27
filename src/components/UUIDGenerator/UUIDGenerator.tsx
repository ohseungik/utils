"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  Copy,
  Trash2,
  Check,
  X,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  generateUUID,
  generateMultipleUUIDs,
  formatUUID,
  isValidUUID,
} from "@/lib/uuidUtils";

interface UUIDItem {
  id: number;
  value: string;
}

export default function UUIDGenerator() {
  const { t } = useLanguage();
  const [uuids, setUuids] = useState<UUIDItem[]>([]);
  const [count, setCount] = useState<number>(1);
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [hyphens, setHyphens] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // UUID 생성
  const handleGenerate = () => {
    const newUUIDs = generateMultipleUUIDs(count);
    const formattedUUIDs = newUUIDs.map((uuid, index) => ({
      id: Date.now() + index,
      value: formatUUID(uuid, { uppercase, hyphens }),
    }));

    setUuids((prev) => [...formattedUUIDs, ...prev]);
    toast.success(`${count}${t("tools.uuid.generated")}`);
  };

  // UUID 복사
  const handleCopy = async (uuid: string, id: number) => {
    try {
      await navigator.clipboard.writeText(uuid);
      setCopiedId(id);
      toast.success(t("tools.uuid.copied"));
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast.error(t("tools.uuid.copyError"));
    }
  };

  // 모든 UUID 복사
  const handleCopyAll = async () => {
    if (uuids.length === 0) {
      toast.error(t("tools.uuid.noUUIDs"));
      return;
    }

    try {
      const allUUIDs = uuids.map((item) => item.value).join("\n");
      await navigator.clipboard.writeText(allUUIDs);
      toast.success(t("tools.uuid.allCopied"));
    } catch (error) {
      toast.error(t("tools.uuid.copyError"));
    }
  };

  // UUID 삭제
  const handleDelete = (id: number) => {
    setUuids((prev) => prev.filter((item) => item.id !== id));
    toast.success(t("tools.uuid.deleted"));
  };

  // 모든 UUID 삭제
  const handleClearAll = () => {
    setUuids([]);
    toast.success(t("tools.uuid.cleared"));
  };

  // 포맷 변경 시 기존 UUID들도 업데이트
  const handleFormatChange = (
    type: "uppercase" | "hyphens",
    value: boolean
  ) => {
    if (type === "uppercase") {
      setUppercase(value);
    } else {
      setHyphens(value);
    }

    // 기존 UUID들 포맷 업데이트
    setUuids((prev) =>
      prev.map((item) => ({
        ...item,
        value: formatUUID(item.value, {
          uppercase: type === "uppercase" ? value : uppercase,
          hyphens: type === "hyphens" ? value : hyphens,
        }),
      }))
    );
  };

  return (
    <div className="container mx-auto max-w-6xl space-y-6 p-4">
      {/* 헤더 */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("tools.uuid.pageTitle")}
        </h1>
        <p className="text-muted-foreground">
          {t("tools.uuid.pageDescription")}
        </p>
      </div>

      {/* 설정 카드 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            {t("tools.uuid.settings")}
          </CardTitle>
          <CardDescription>{t("tools.uuid.settingsDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 생성 개수 */}
          <div className="space-y-2">
            <Label htmlFor="count">{t("tools.uuid.count")}</Label>
            <div className="flex gap-2">
              <Input
                id="count"
                type="number"
                min={1}
                max={100}
                value={count}
                onChange={(e) =>
                  setCount(Math.max(1, Math.min(100, Number(e.target.value))))
                }
                className="max-w-[200px]"
              />
              <Button onClick={handleGenerate} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                {t("common.generate")}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("tools.uuid.countDescription")}
            </p>
          </div>

          {/* 포맷 옵션 */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="uppercase">{t("tools.uuid.uppercase")}</Label>
                <p className="text-sm text-muted-foreground">
                  {t("tools.uuid.uppercaseDescription")}
                </p>
              </div>
              <Switch
                id="uppercase"
                checked={uppercase}
                onCheckedChange={(value) => handleFormatChange("uppercase", value)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="hyphens">{t("tools.uuid.hyphens")}</Label>
                <p className="text-sm text-muted-foreground">
                  {t("tools.uuid.hyphensDescription")}
                </p>
              </div>
              <Switch
                id="hyphens"
                checked={hyphens}
                onCheckedChange={(value) => handleFormatChange("hyphens", value)}
              />
            </div>
          </div>

          {/* 포맷 미리보기 */}
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm font-medium mb-2">
              {t("tools.uuid.formatPreview")}
            </p>
            <code className="text-sm">
              {formatUUID(
                "a1b2c3d4-e5f6-47a8-b9c0-d1e2f3a4b5c6",
                { uppercase, hyphens }
              )}
            </code>
          </div>
        </CardContent>
      </Card>

      {/* 생성된 UUID 목록 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("tools.uuid.generatedUUIDs")}</CardTitle>
              <CardDescription>
                {t("tools.uuid.totalCount")} {uuids.length}{t("tools.uuid.totalCountUnit")}
              </CardDescription>
            </div>
            {uuids.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyAll}
                  className="gap-2"
                >
                  <Copy className="h-4 w-4" />
                  {t("tools.uuid.copyAll")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  {t("common.clear")}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {uuids.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {t("tools.uuid.emptyState")}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {uuids.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                >
                  <code className="text-sm font-mono flex-1">
                    {item.value}
                  </code>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(item.value, item.id)}
                      className="gap-2"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-green-500">
                            {t("tools.uuid.copied")}
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          {t("common.copy")}
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 도움말 */}
      <Card>
        <CardHeader>
          <CardTitle>{t("tools.uuid.helpTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">1</Badge>
              <p className="text-sm">{t("tools.uuid.help1")}</p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">2</Badge>
              <p className="text-sm">{t("tools.uuid.help2")}</p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">3</Badge>
              <p className="text-sm">{t("tools.uuid.help3")}</p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">4</Badge>
              <p className="text-sm">{t("tools.uuid.help4")}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
