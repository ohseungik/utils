"use client";

import WordCounter from "@/components/WordCounter/WordCounter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function WordCounterPage() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {t("tools.wordcounter.pageTitle")}
        </h1>
        <p className="text-muted-foreground">
          {t("tools.wordcounter.pageSubtitle")}
        </p>
      </div>
      <WordCounter />
    </div>
  );
}
