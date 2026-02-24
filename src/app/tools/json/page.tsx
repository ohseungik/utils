"use client";

import JSONFormatter from "@/components/JSONFormatter/JSONFormatter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function JSONFormatterPage() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("tools.json.title")}</h1>
        <p className="text-muted-foreground">{t("tools.json.description")}</p>
      </div>
      <JSONFormatter />
    </div>
  );
}
