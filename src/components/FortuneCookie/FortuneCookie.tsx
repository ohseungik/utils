"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Sparkles, Cookie } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

// 운세 메시지 데이터
const fortuneData = {
  ko: {
    fortunes: [
      "오늘은 당신에게 특별한 기회가 찾아올 것입니다.",
      "행운은 준비된 자에게 찾아옵니다. 준비하세요!",
      "당신의 노력이 곧 결실을 맺을 것입니다.",
      "오늘 만나는 사람이 중요한 인연이 될 수 있습니다.",
      "긍정적인 마음이 더 큰 행운을 불러올 것입니다.",
      "작은 변화가 큰 차이를 만들어낼 것입니다.",
      "당신의 직감을 믿으세요. 오늘은 특히 정확합니다.",
      "새로운 도전을 두려워하지 마세요. 성공이 기다립니다.",
      "오늘 하루 웃음을 잃지 않는다면 좋은 일이 생길 것입니다.",
      "당신이 찾던 답은 이미 당신 안에 있습니다.",
      "주변 사람들에게 감사를 표현하면 더 큰 행복이 옵니다.",
      "오늘은 당신의 창의력이 빛을 발할 것입니다.",
      "예상치 못한 곳에서 도움의 손길이 올 것입니다.",
      "인내심을 가지세요. 좋은 결과가 곧 찾아올 것입니다.",
      "당신의 열정이 주변 사람들에게 영감을 줄 것입니다.",
      "오늘 내린 결정이 미래를 밝게 만들 것입니다.",
      "작은 친절이 예상치 못한 보상으로 돌아올 것입니다.",
      "당신의 꿈이 현실이 되는 날이 가까워지고 있습니다.",
      "오늘은 새로운 시작을 위한 완벽한 날입니다.",
      "어려움은 일시적입니다. 곧 밝은 빛이 보일 것입니다.",
    ],
    colors: [
      "빨강",
      "파랑",
      "노랑",
      "초록",
      "보라",
      "주황",
      "분홍",
      "하늘색",
      "금색",
      "은색",
    ],
  },
  en: {
    fortunes: [
      "A special opportunity will come your way today.",
      "Fortune favors the prepared mind. Be ready!",
      "Your efforts will soon bear fruit.",
      "The person you meet today could become an important connection.",
      "A positive attitude will bring greater fortune.",
      "A small change will make a big difference.",
      "Trust your instincts. They are especially accurate today.",
      "Don't fear new challenges. Success awaits.",
      "If you don't lose your smile today, good things will happen.",
      "The answer you seek is already within you.",
      "Express gratitude to those around you for greater happiness.",
      "Today your creativity will shine.",
      "Help will come from an unexpected place.",
      "Be patient. Good results are coming soon.",
      "Your passion will inspire those around you.",
      "The decision you make today will brighten your future.",
      "A small kindness will return as an unexpected reward.",
      "The day your dreams become reality is approaching.",
      "Today is the perfect day for a new beginning.",
      "Difficulties are temporary. Bright light will soon appear.",
    ],
    colors: [
      "Red",
      "Blue",
      "Yellow",
      "Green",
      "Purple",
      "Orange",
      "Pink",
      "Sky Blue",
      "Gold",
      "Silver",
    ],
  },
};

export default function FortuneCookie() {
  const { t, language } = useLanguage();
  const [isOpened, setIsOpened] = useState(false);
  const [fortune, setFortune] = useState<{
    message: string;
    luckyNumber: number;
    luckyColor: string;
  } | null>(null);

  // 현재 언어에 맞는 데이터 가져오기
  const currentData = useMemo(() => fortuneData[language], [language]);

  const openCookie = () => {
    const randomFortune = currentData.fortunes[Math.floor(Math.random() * currentData.fortunes.length)];
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    const randomColor = currentData.colors[Math.floor(Math.random() * currentData.colors.length)];

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
