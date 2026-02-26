"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, TrendingDown, DollarSign } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Purchase {
  id: number;
  price: number;
  quantity: number;
}

export default function StockCalculator() {
  const { t } = useLanguage();
  const [currency, setCurrency] = useState<"KRW" | "USD">("KRW");
  const [purchases, setPurchases] = useState<Purchase[]>([
    { id: 1, price: 0, quantity: 0 },
    { id: 2, price: 0, quantity: 0 },
  ]);
  const [targetPrice, setTargetPrice] = useState<number>(0);
  const [exchangeRate, setExchangeRate] = useState<number>(0);

  // 환율 가져오기
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch(
          "https://api.frankfurter.app/latest?from=USD&to=KRW",
        );
        const data = await response.json();
        setExchangeRate(data.rates.KRW);
      } catch (error) {
        console.error("Failed to fetch exchange rate:", error);
        setExchangeRate(1427.9); // 기본값
      }
    };
    fetchExchangeRate();
  }, []);

  const addPurchase = () => {
    const newId = Math.max(...purchases.map((p) => p.id), 0) + 1;
    setPurchases([...purchases, { id: newId, price: 0, quantity: 0 }]);
  };

  const removePurchase = (id: number) => {
    if (purchases.length > 1) {
      setPurchases(purchases.filter((p) => p.id !== id));
    }
  };

  const updatePurchase = (
    id: number,
    field: "price" | "quantity",
    value: number,
  ) => {
    setPurchases(
      purchases.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );
  };

  // 계산
  const totalCost = purchases.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const totalQuantity = purchases.reduce((sum, p) => sum + p.quantity, 0);
  const averagePrice = totalQuantity > 0 ? totalCost / totalQuantity : 0;

  const currentValue = targetPrice * totalQuantity;
  const profitLoss = currentValue - totalCost;
  const profitLossPercent = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;

  const currencySymbol = currency === "KRW" ? "₩" : "$";
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(currency === "KRW" ? "ko-KR" : "en-US", {
      minimumFractionDigits: currency === "KRW" ? 0 : 2,
      maximumFractionDigits: currency === "KRW" ? 0 : 2,
    }).format(num);
  };

  return (
    <div className="space-y-6">
      {/* 통화 선택 및 환율 정보 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              {t("tools.stockcalculator.currencySettings")}
            </CardTitle>
            <Select
              value={currency}
              onValueChange={(v: "KRW" | "USD") => setCurrency(v)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="KRW">🇰🇷 KRW</SelectItem>
                <SelectItem value="USD">🇺🇸 USD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {exchangeRate > 0 && (
            <CardDescription>
              $1 = ₩{formatNumber(exchangeRate)} (
              {new Date().toLocaleDateString(
                currency === "KRW" ? "ko-KR" : "en-US",
              )}
              )
            </CardDescription>
          )}
        </CardHeader>
      </Card>

      {/* 매수 내역 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            {t("tools.stockcalculator.purchaseHistory")}
          </CardTitle>
          <CardDescription>
            {t("tools.stockcalculator.purchaseDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {purchases.map((purchase, index) => (
            <div key={purchase.id} className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor={`price-${purchase.id}`}>
                  {t("tools.stockcalculator.purchasePrice")} #{index + 1} (
                  {currencySymbol})
                </Label>
                <Input
                  id={`price-${purchase.id}`}
                  type="number"
                  min="0"
                  step={currency === "KRW" ? "100" : "0.01"}
                  value={purchase.price || ""}
                  onChange={(e) =>
                    updatePurchase(
                      purchase.id,
                      "price",
                      parseFloat(e.target.value) || 0,
                    )
                  }
                  placeholder="0"
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor={`quantity-${purchase.id}`}>
                  {t("tools.stockcalculator.quantity")}
                </Label>
                <Input
                  id={`quantity-${purchase.id}`}
                  type="number"
                  min="0"
                  step="1"
                  value={purchase.quantity || ""}
                  onChange={(e) =>
                    updatePurchase(
                      purchase.id,
                      "quantity",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  placeholder="0"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => removePurchase(purchase.id)}
                disabled={purchases.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button onClick={addPurchase} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            {t("tools.stockcalculator.addPurchase")}
          </Button>
        </CardContent>
      </Card>

      {/* 목표가/현재가 */}
      <Card>
        <CardHeader>
          <CardTitle>{t("tools.stockcalculator.targetPrice")}</CardTitle>
          <CardDescription>
            {t("tools.stockcalculator.targetPriceDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="target-price">
              {t("tools.stockcalculator.currentPrice")} ({currencySymbol})
            </Label>
            <Input
              id="target-price"
              type="number"
              min="0"
              step={currency === "KRW" ? "100" : "0.01"}
              value={targetPrice || ""}
              onChange={(e) => setTargetPrice(parseFloat(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
        </CardContent>
      </Card>

      {/* 계산 결과 */}
      <Card>
        <CardHeader>
          <CardTitle>{t("tools.stockcalculator.results")}</CardTitle>
        </CardHeader>
        <CardContent>
          {totalQuantity > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {t("tools.stockcalculator.totalQuantity")}
                  </p>
                  <p className="text-2xl font-bold">
                    {formatNumber(totalQuantity)}{" "}
                    {t("tools.stockcalculator.shares")}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {t("tools.stockcalculator.totalCost")}
                  </p>
                  <p className="text-2xl font-bold">
                    {currencySymbol}
                    {formatNumber(totalCost)}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {t("tools.stockcalculator.averagePrice")}
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    {currencySymbol}
                    {formatNumber(averagePrice)}
                  </p>
                </div>
              </div>

              {targetPrice > 0 && (
                <div className="pt-4 border-t space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {t("tools.stockcalculator.currentValue")}
                    </p>
                    <p className="text-2xl font-bold">
                      {currencySymbol}
                      {formatNumber(currentValue)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {t("tools.stockcalculator.profitLoss")}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p
                        className={`text-3xl font-bold ${profitLoss >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {profitLoss >= 0 ? "+" : ""}
                        {currencySymbol}
                        {formatNumber(profitLoss)}
                      </p>
                      <p
                        className={`text-xl ${profitLossPercent >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        ({profitLoss >= 0 ? "+" : ""}
                        {profitLossPercent.toFixed(2)}%)
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {t("tools.stockcalculator.emptyState")}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
