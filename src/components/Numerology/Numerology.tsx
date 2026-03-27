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
import { Badge } from "@/components/ui/badge";
import { Calculator, Sparkles, Info } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  calculateLifePathNumber,
  calculateExpressionNumber,
  calculateSoulUrgeNumber,
  calculatePersonalityNumber,
  getNumberMeaning,
} from "@/lib/numerologyUtils";

interface NumerologyResult {
  lifePathNumber: number | null;
  expressionNumber: number | null;
  soulUrgeNumber: number | null;
  personalityNumber: number | null;
}

export default function Numerology() {
  const { t } = useLanguage();
  const [fullName, setFullName] = useState<string>("");
  const [birthdate, setBirthdate] = useState<string>("");
  const [result, setResult] = useState<NumerologyResult | null>(null);

  const handleCalculate = () => {
    if (!fullName.trim() && !birthdate.trim()) {
      toast.error(t("tools.numerology.enterData"));
      return;
    }

    const lifePathNumber = birthdate ? calculateLifePathNumber(birthdate) : null;
    const expressionNumber = fullName ? calculateExpressionNumber(fullName) : null;
    const soulUrgeNumber = fullName ? calculateSoulUrgeNumber(fullName) : null;
    const personalityNumber = fullName ? calculatePersonalityNumber(fullName) : null;

    setResult({
      lifePathNumber,
      expressionNumber,
      soulUrgeNumber,
      personalityNumber,
    });

    toast.success(t("tools.numerology.calculated"));
  };

  const handleReset = () => {
    setFullName("");
    setBirthdate("");
    setResult(null);
    toast.success(t("tools.numerology.reset"));
  };

  return (
    <div className="container mx-auto max-w-6xl space-y-6 p-4">
      {/* 헤더 */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {t("tools.numerology.pageTitle")}
        </h1>
        <p className="text-muted-foreground">
          {t("tools.numerology.pageDescription")}
        </p>
      </div>

      {/* 입력 카드 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            {t("tools.numerology.inputSection")}
          </CardTitle>
          <CardDescription>
            {t("tools.numerology.inputDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 이름 입력 */}
          <div className="space-y-2">
            <Label htmlFor="fullName">{t("tools.numerology.fullName")}</Label>
            <Input
              id="fullName"
              type="text"
              placeholder={t("tools.numerology.fullNamePlaceholder")}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {t("tools.numerology.fullNameHint")}
            </p>
          </div>

          {/* 생년월일 입력 */}
          <div className="space-y-2">
            <Label htmlFor="birthdate">{t("tools.numerology.birthdate")}</Label>
            <Input
              id="birthdate"
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {t("tools.numerology.birthdateHint")}
            </p>
          </div>

          {/* 버튼 */}
          <div className="flex gap-2">
            <Button onClick={handleCalculate} className="flex-1">
              <Calculator className="mr-2 h-4 w-4" />
              {t("tools.numerology.calculate")}
            </Button>
            <Button onClick={handleReset} variant="outline">
              {t("common.reset")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 결과 카드 */}
      {result && (
        <div className="grid gap-4 md:grid-cols-2">
          {/* 생명수 */}
          {result.lifePathNumber !== null && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                  {t("tools.numerology.lifePathNumber")}
                </CardTitle>
                <CardDescription>
                  {t("tools.numerology.lifePathDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center">
                  <Badge
                    variant="outline"
                    className="text-4xl font-bold px-6 py-3"
                  >
                    {result.lifePathNumber}
                  </Badge>
                </div>
                <div className="space-y-2 rounded-lg bg-muted p-4">
                  <p className="font-semibold text-sm">
                    {t(
                      getNumberMeaning(result.lifePathNumber, "lifePath")
                        ?.keyword || ""
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t(
                      getNumberMeaning(result.lifePathNumber, "lifePath")
                        ?.description || ""
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 표현수 */}
          {result.expressionNumber !== null && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-green-500" />
                  {t("tools.numerology.expressionNumber")}
                </CardTitle>
                <CardDescription>
                  {t("tools.numerology.expressionDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center">
                  <Badge
                    variant="outline"
                    className="text-4xl font-bold px-6 py-3"
                  >
                    {result.expressionNumber}
                  </Badge>
                </div>
                <div className="space-y-2 rounded-lg bg-muted p-4">
                  <p className="font-semibold text-sm">
                    {t(
                      getNumberMeaning(result.expressionNumber, "expression")
                        ?.keyword || ""
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t(
                      getNumberMeaning(result.expressionNumber, "expression")
                        ?.description || ""
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 영혼충동수 */}
          {result.soulUrgeNumber !== null && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  {t("tools.numerology.soulUrgeNumber")}
                </CardTitle>
                <CardDescription>
                  {t("tools.numerology.soulUrgeDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center">
                  <Badge
                    variant="outline"
                    className="text-4xl font-bold px-6 py-3"
                  >
                    {result.soulUrgeNumber}
                  </Badge>
                </div>
                <div className="space-y-2 rounded-lg bg-muted p-4">
                  <p className="font-semibold text-sm">
                    {t(
                      getNumberMeaning(result.soulUrgeNumber, "soulUrge")
                        ?.keyword || ""
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t(
                      getNumberMeaning(result.soulUrgeNumber, "soulUrge")
                        ?.description || ""
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 성격수 */}
          {result.personalityNumber !== null && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-orange-500" />
                  {t("tools.numerology.personalityNumber")}
                </CardTitle>
                <CardDescription>
                  {t("tools.numerology.personalityDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center">
                  <Badge
                    variant="outline"
                    className="text-4xl font-bold px-6 py-3"
                  >
                    {result.personalityNumber}
                  </Badge>
                </div>
                <div className="space-y-2 rounded-lg bg-muted p-4">
                  <p className="font-semibold text-sm">
                    {t(
                      getNumberMeaning(result.personalityNumber, "personality")
                        ?.keyword || ""
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t(
                      getNumberMeaning(result.personalityNumber, "personality")
                        ?.description || ""
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* 안내 카드 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            {t("tools.numerology.aboutNumerology")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">{t("tools.numerology.whatIsNumerology")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("tools.numerology.whatIsNumerologyDesc")}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">{t("tools.numerology.howToUse")}</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>{t("tools.numerology.howToUse1")}</li>
              <li>{t("tools.numerology.howToUse2")}</li>
              <li>{t("tools.numerology.howToUse3")}</li>
              <li>{t("tools.numerology.howToUse4")}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
