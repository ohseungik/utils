"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Copy, Pin, Trash2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface LottoNumbers {
  id: string;
  numbers: number[];
  powerball?: number;
  isPinned: boolean;
  timestamp: number;
}

type LottoType = "korea" | "powerball";

export default function LottoGenerator() {
  const { t } = useLanguage();
  const [lottoType, setLottoType] = useState<LottoType>("korea");
  const [generatedNumbers, setGeneratedNumbers] = useState<LottoNumbers[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("lottoNumbers");
    if (saved) {
      try {
        setGeneratedNumbers(JSON.parse(saved));
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  // Save to localStorage whenever numbers change
  useEffect(() => {
    if (generatedNumbers.length > 0) {
      localStorage.setItem("lottoNumbers", JSON.stringify(generatedNumbers));
    }
  }, [generatedNumbers]);

  const generateKoreaLotto = (): number[] => {
    const numbers = new Set<number>();
    while (numbers.size < 6) {
      numbers.add(Math.floor(Math.random() * 45) + 1);
    }
    return Array.from(numbers).sort((a, b) => a - b);
  };

  const generatePowerball = (): { numbers: number[]; powerball: number } => {
    const numbers = new Set<number>();
    while (numbers.size < 5) {
      numbers.add(Math.floor(Math.random() * 69) + 1);
    }
    const powerball = Math.floor(Math.random() * 26) + 1;
    return {
      numbers: Array.from(numbers).sort((a, b) => a - b),
      powerball,
    };
  };

  const handleGenerate = () => {
    const newNumber: LottoNumbers = {
      id: Date.now().toString(),
      numbers: [],
      isPinned: false,
      timestamp: Date.now(),
    };

    if (lottoType === "korea") {
      newNumber.numbers = generateKoreaLotto();
    } else {
      const result = generatePowerball();
      newNumber.numbers = result.numbers;
      newNumber.powerball = result.powerball;
    }

    setGeneratedNumbers((prev) => [newNumber, ...prev]);
    toast.success(t("tools.lotto.generated"));
  };

  const handleCopy = (item: LottoNumbers) => {
    const text =
      lottoType === "korea"
        ? item.numbers.join(", ")
        : `${item.numbers.join(", ")} + ${item.powerball}`;
    
    navigator.clipboard.writeText(text);
    toast.success(t("tools.lotto.copied"));
  };

  const handlePin = (id: string) => {
    setGeneratedNumbers((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isPinned: !item.isPinned } : item
      ).sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return b.timestamp - a.timestamp;
      })
    );
    toast.success(t("tools.lotto.pinned"));
  };

  const handleDelete = (id: string) => {
    setGeneratedNumbers((prev) => prev.filter((item) => item.id !== id));
    toast.success(t("tools.lotto.deleted"));
  };

  const handleClearAll = () => {
    setGeneratedNumbers([]);
    localStorage.removeItem("lottoNumbers");
    toast.success(t("tools.lotto.cleared"));
  };

  const getNumberColor = (num: number, isKorea: boolean): string => {
    if (!isKorea) {
      // Powerball uses a different color scheme
      if (num <= 14) return "bg-yellow-500";
      if (num <= 28) return "bg-blue-500";
      if (num <= 42) return "bg-red-500";
      if (num <= 56) return "bg-gray-600";
      return "bg-green-500";
    }

    // Korea lotto color scheme
    if (num <= 10) return "bg-yellow-500";
    if (num <= 20) return "bg-blue-500";
    if (num <= 30) return "bg-red-500";
    if (num <= 40) return "bg-gray-600";
    return "bg-green-500";
  };

  const filteredNumbers = generatedNumbers.filter((item) => {
    if (lottoType === "korea") return item.powerball === undefined;
    return item.powerball !== undefined;
  });

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6" />
            {t("tools.lotto.title")}
          </CardTitle>
          <CardDescription>{t("tools.lotto.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs value={lottoType} onValueChange={(v) => setLottoType(v as LottoType)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="korea">🇰🇷 {t("tools.lotto.korea")}</TabsTrigger>
              <TabsTrigger value="powerball">🇺🇸 {t("tools.lotto.powerball")}</TabsTrigger>
            </TabsList>
            <TabsContent value="korea" className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">{t("tools.lotto.koreaDescription")}</p>
                <Button onClick={handleGenerate} size="lg" className="w-full sm:w-auto">
                  <Sparkles className="h-4 w-4 mr-2" />
                  {t("tools.lotto.generate")}
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="powerball" className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">{t("tools.lotto.powerballDescription")}</p>
                <Button onClick={handleGenerate} size="lg" className="w-full sm:w-auto">
                  <Sparkles className="h-4 w-4 mr-2" />
                  {t("tools.lotto.generate")}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {filteredNumbers.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t("tools.lotto.generatedNumbers")}</CardTitle>
              <Button variant="outline" size="sm" onClick={handleClearAll}>
                <Trash2 className="h-4 w-4 mr-2" />
                {t("tools.lotto.clearAll")}
              </Button>
            </div>
            <CardDescription>
              {t("tools.lotto.total")}: {filteredNumbers.length}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredNumbers.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  {item.isPinned && (
                    <Pin className="h-4 w-4 text-primary fill-primary" />
                  )}
                  <div className="flex flex-wrap items-center gap-2">
                    {item.numbers.map((num, idx) => (
                      <Badge
                        key={idx}
                        className={`${getNumberColor(num, lottoType === "korea")} text-white font-bold text-base px-3 py-1`}
                      >
                        {num}
                      </Badge>
                    ))}
                    {item.powerball !== undefined && (
                      <>
                        <span className="text-muted-foreground mx-1">+</span>
                        <Badge className="bg-orange-500 text-white font-bold text-base px-3 py-1">
                          {item.powerball}
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handlePin(item.id)}
                    className={item.isPinned ? "text-primary" : ""}
                  >
                    <Pin className={`h-4 w-4 ${item.isPinned ? "fill-primary" : ""}`} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleCopy(item)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t("tools.lotto.howToUse")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="flex gap-2">
            <span className="font-semibold">1.</span>
            <p>{t("tools.lotto.step1")}</p>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold">2.</span>
            <p>{t("tools.lotto.step2")}</p>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold">3.</span>
            <p>{t("tools.lotto.step3")}</p>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold">4.</span>
            <p>{t("tools.lotto.step4")}</p>
          </div>
          <p className="text-xs pt-2 border-t">{t("tools.lotto.disclaimer")}</p>
        </CardContent>
      </Card>
    </div>
  );
}
