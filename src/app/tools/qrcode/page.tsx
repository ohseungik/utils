"use client";

import QRCodeGenerator from "@/components/QRCodeGenerate/QRCodeGenerate";
import { useLanguage } from "@/contexts/LanguageContext";

export default function QrCodeGeneratorPage() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("tools.qrcode.title")}</h1>
        <p className="text-muted-foreground">{t("tools.qrcode.description")}</p>
      </div>
      <QRCodeGenerator />
    </div>
  );
}
