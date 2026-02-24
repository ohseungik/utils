"use client";

import ImageOptimizer from "@/components/ImageOptimizer/ImageOptimizer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ImageOptimizerPage() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("tools.image.title")}</h1>
        <p className="text-muted-foreground">{t("tools.image.description")}</p>
      </div>
      <ImageOptimizer />
    </div>
  );
}
