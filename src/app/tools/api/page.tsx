"use client";

import APITester from "@/components/APITester/APITester";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ApiTesterPage() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("tools.api.title")}</h1>
        <p className="text-muted-foreground">{t("tools.api.description")}</p>
      </div>
      <APITester />
    </div>
  );
}
