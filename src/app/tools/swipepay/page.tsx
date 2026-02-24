"use client";

import SwipePay from "@/components/SwipePay/SwipePay";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SwipePayPage() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("tools.swipepay.title")}</h1>
      </div>

      <SwipePay />
    </div>
  );
}
