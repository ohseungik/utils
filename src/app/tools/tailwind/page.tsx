"use client";

import CssToTailwind from "@/components/Tailwind/Tailwind";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CssToTailwindPage() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("tools.tailwind.title")}</h1>
        <p className="text-muted-foreground">
          {t("tools.tailwind.description")}
        </p>
      </div>
      <CssToTailwind />
    </div>
  );
}
