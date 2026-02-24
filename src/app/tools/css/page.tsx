"use client";

import CssMinifier from "@/components/CSSMinifier/CSSMinifier";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CssMinifierPage() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("tools.css.title")}</h1>
        <p className="text-muted-foreground">{t("tools.css.description")}</p>
      </div>
      <CssMinifier />
    </div>
  );
}
