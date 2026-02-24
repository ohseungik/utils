"use client";

import FontConverter from "@/components/FontConverter/FontConverter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function FontConverterPage() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("tools.font.title")}</h1>
        <p className="text-muted-foreground">{t("tools.font.description")}</p>
      </div>
      <FontConverter />
    </div>
  );
}
