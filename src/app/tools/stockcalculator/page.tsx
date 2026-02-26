"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import StockCalculator from "@/components/StockCalculator/StockCalculator";

export default function StockCalculatorPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">
          {t("tools.stockcalculator.pageTitle")}
        </h1>
        <p className="text-muted-foreground">
          {t("tools.stockcalculator.pageDescription")}
        </p>
      </div>

      <StockCalculator />

      {/* 사용 방법 안내 */}
      <div className="mt-8 p-6 bg-muted/50 rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">
          {t("tools.stockcalculator.howToUse")}
        </h2>
        <ul className="space-y-2 list-disc list-inside text-sm text-muted-foreground">
          <li>{t("tools.stockcalculator.step1")}</li>
          <li>{t("tools.stockcalculator.step2")}</li>
          <li>{t("tools.stockcalculator.step3")}</li>
          <li>{t("tools.stockcalculator.step4")}</li>
        </ul>
        <p className="text-xs text-muted-foreground mt-4">
          {t("tools.stockcalculator.disclaimer")}
        </p>
      </div>
    </div>
  );
}
