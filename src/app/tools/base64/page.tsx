"use client";

import Base64Converter from "@/components/Base64Converter/Base64Converter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Base64ConverterPage() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("tools.base64.title")}</h1>
        <p className="text-muted-foreground">{t("tools.base64.description")}</p>
      </div>
      <Base64Converter />
    </div>
  );
}
