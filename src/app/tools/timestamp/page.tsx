"use client";

import TimestampConverter from "@/components/TimestampConverter/TimestampConverter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TimestampConverterPage() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {t("tools.timestamp.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("tools.timestamp.description")}
        </p>
      </div>

      <TimestampConverter />
    </div>
  );
}
