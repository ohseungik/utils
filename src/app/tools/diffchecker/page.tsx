"use client";

import DiffChecker from "@/components/DiffChecker/DiffChecker";
import { useLanguage } from "@/contexts/LanguageContext";

export default function DiffCheckerPage() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("tools.diffchecker.title")}</h1>
        <p className="text-muted-foreground">{t("tools.diffchecker.description")}</p>
      </div>
      <DiffChecker />
    </div>
  );
}
