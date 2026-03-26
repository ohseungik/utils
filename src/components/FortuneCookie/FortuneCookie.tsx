"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Sparkles, Cookie } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function FortuneCookie() {
  const { t } = useLanguage();
  const [isOpened, setIsOpened] = useState(false);
  const [fortune, setFortune] = useState<{
    message: string;
    luckyNumber: number;
    luckyColor: string;
  } | null>(null);

  const fortunes = t("tools.fortunecookie.fortunes") as unknown as string[];
  const colors = t("tools.fortunecookie.colors") as unknown as string[];

  const openCookie = () => {
    const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    setFortune({
      message: randomFortune,
      luckyNumber: randomNumber,
      luckyColor: randomColor,
    });
    setIsOpened(true);
  };

  const handleShare = () => {
    if (!fortune) return;

    const shareText = `${t("tools.fortunecookie.yourFortune")}: ${fortune.message}\n${t("tools.fortunecookie.luckyNumber")}: ${fortune.luckyNumber}\n${t("tools.fortunecookie.luckyColor")}: ${fortune.luckyColor}`;

    navigator.clipboard.writeText(shareText);
    toast.success(t("tools.fortunecookie.fortuneShared"));
  };

  const resetCookie = () => {
    setIsOpened(false);
    setFortune(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("tools.fortunecookie.pageTitle")}
        </h1>
        <p className="text-muted-foreground">
          {t("tools.fortunecookie.pageDescription")}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cookie className="h-5 w-5" />
            {t("tools.fortunecookie.title")}
          </CardTitle>
          <CardDescription>{t("tools.fortunecookie.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isOpened ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-6">
              <div 
                className="relative cursor-pointer transition-transform hover:scale-110 active:scale-95"
                onClick={openCookie}
              >
                <Cookie className="h-32 w-32 text-amber-600" />
                <Sparkles className="h-8 w-8 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
              </div>
              <p className="text-lg font-medium text-center">
                {t("tools.fortunecookie.clickToOpen")}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-lg p-6 space-y-4 border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-amber-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">
                      {t("tools.fortunecookie.yourFortune")}
                    </h3>
                    <p className="text-base leading-relaxed">{fortune?.message}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {t("tools.fortunecookie.luckyNumber")}
                      </p>
                      <p className="text-3xl font-bold text-primary">
                        {fortune?.luckyNumber}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {t("tools.fortunecookie.luckyColor")}
                      </p>
                      <Badge 
                        variant="secondary" 
                        className="text-base font-bold px-4 py-1"
                      >
                        {fortune?.luckyColor}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {t("tools.fortunecookie.share")}
                </Button>
                <Button
                  onClick={resetCookie}
                  className="flex-1"
                >
                  <Cookie className="h-4 w-4 mr-2" />
                  {t("tools.fortunecookie.openAnother")}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>💡 {t("tools.lotto.howToUse")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>{t("tools.fortunecookie.clickToOpen")}</li>
            <li>매일 하루에 한 번 포춘 쿠키를 열어보세요</li>
            <li>행운의 숫자와 색상을 확인하세요</li>
            <li>공유 버튼으로 친구들과 나눌 수 있습니다</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
