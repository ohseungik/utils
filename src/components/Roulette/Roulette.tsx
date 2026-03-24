"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Trash2, RotateCw } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface RouletteItem {
  id: string;
  text: string;
  color: string;
}

const COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8",
  "#F7DC6F", "#BB8FCE", "#85C1E2", "#F8B739", "#52B788",
  "#FF8FA3", "#6A67CE", "#FF99C8", "#FCF6BD", "#C9ADA7"
];

export default function Roulette() {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [items, setItems] = useState<RouletteItem[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("rouletteItems");
    if (saved) {
      try {
        const parsedItems = JSON.parse(saved);
        setItems(parsedItems);
      } catch {
        // Set default items if parse fails
        setDefaultItems();
      }
    } else {
      setDefaultItems();
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem("rouletteItems", JSON.stringify(items));
    }
  }, [items]);

  const setDefaultItems = () => {
    const defaultItems = [
      { id: "1", text: "짜장면", color: COLORS[0] },
      { id: "2", text: "짬뽕", color: COLORS[1] },
      { id: "3", text: "돈까스", color: COLORS[2] },
      { id: "4", text: "햄버거", color: COLORS[3] },
      { id: "5", text: "제육볶음", color: COLORS[4] }
    ];
    setItems(defaultItems);
  };

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || items.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw wheel segments
    const anglePerItem = (2 * Math.PI) / items.length;
    
    items.forEach((item, index) => {
      const startAngle = rotation + index * anglePerItem - Math.PI / 2;
      const endAngle = startAngle + anglePerItem;

      // Draw segment
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = item.color;
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + anglePerItem / 2);
      ctx.textAlign = "center";
      ctx.fillStyle = "#fff";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText(item.text, radius * 0.65, 0);
      ctx.restore();
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw pointer (at top)
    ctx.beginPath();
    ctx.moveTo(centerX - 15, 20);
    ctx.lineTo(centerX + 15, 20);
    ctx.lineTo(centerX, 40);
    ctx.closePath();
    ctx.fillStyle = "#FF4444";
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [items, rotation]);

  // Draw roulette wheel
  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  const handleAddItem = () => {
    if (!inputValue.trim()) {
      toast.error(t("tools.roulette.emptyItem"));
      return;
    }

    if (items.length >= 15) {
      toast.error(t("tools.roulette.maxItems"));
      return;
    }

    const newItem: RouletteItem = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      color: COLORS[items.length % COLORS.length]
    };

    setItems([...items, newItem]);
    setInputValue("");
    toast.success(t("tools.roulette.itemAdded"));
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 2) {
      toast.error(t("tools.roulette.minItems"));
      return;
    }
    setItems(items.filter(item => item.id !== id));
    toast.success(t("tools.roulette.itemRemoved"));
  };

  const handleClearAll = () => {
    setItems([]);
    setResult(null);
    localStorage.removeItem("rouletteItems");
    toast.success(t("tools.roulette.allCleared"));
  };

  const handleSpin = () => {
    if (items.length < 2) {
      toast.error(t("tools.roulette.needMoreItems"));
      return;
    }

    if (isSpinning) return;

    setIsSpinning(true);
    setResult(null);

    // Random spin: 5-8 full rotations + random angle
    const spins = 5 + Math.random() * 3;
    const randomAngle = Math.random() * 2 * Math.PI;
    const totalRotation = spins * 2 * Math.PI + randomAngle;

    const duration = 3000; // 3 seconds
    const startTime = Date.now();
    const startRotation = rotation;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentRotation = startRotation + totalRotation * easeOut;

      setRotation(currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        // Calculate result
        const normalizedRotation = (currentRotation % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        const anglePerItem = (2 * Math.PI) / items.length;
        // Pointer is at top (270 degrees or -90 degrees = 3π/2)
        const pointerAngle = Math.PI / 2; // Adjust for pointer at top
        const selectedIndex = Math.floor(((2 * Math.PI - normalizedRotation + pointerAngle) % (2 * Math.PI)) / anglePerItem) % items.length;
        const selectedItem = items[selectedIndex];
        setResult(selectedItem.text);
        toast.success(`${t("tools.roulette.result")}: ${selectedItem.text}`);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{t("tools.roulette.pageTitle")}</h1>
        <p className="text-muted-foreground">{t("tools.roulette.pageDescription")}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Roulette Wheel */}
        <Card>
          <CardHeader>
            <CardTitle>{t("tools.roulette.wheel")}</CardTitle>
            <CardDescription>{t("tools.roulette.wheelDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={400}
                height={400}
                className="max-w-full h-auto"
              />
            </div>
            
            <Button
              onClick={handleSpin}
              disabled={isSpinning || items.length < 2}
              size="lg"
              className="w-full max-w-xs"
            >
              <RotateCw className={`mr-2 h-5 w-5 ${isSpinning ? "animate-spin" : ""}`} />
              {isSpinning ? t("tools.roulette.spinning") : t("tools.roulette.spin")}
            </Button>

            {result && (
              <Card className="w-full max-w-xs bg-primary text-primary-foreground">
                <CardContent className="p-4 text-center">
                  <p className="text-sm font-medium">{t("tools.roulette.result")}</p>
                  <p className="text-2xl font-bold mt-2">{result}</p>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Items Management */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t("tools.roulette.items")} ({items.length})
            </CardTitle>
            <CardDescription>{t("tools.roulette.itemsDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Item */}
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddItem()}
                placeholder={t("tools.roulette.inputPlaceholder")}
                disabled={isSpinning}
              />
              <Button
                onClick={handleAddItem}
                disabled={isSpinning}
                size="icon"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Items List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium">{item.text}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={isSpinning}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {items.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                {t("tools.roulette.noItems")}
              </p>
            )}

            {/* Clear All Button */}
            {items.length > 0 && (
              <Button
                variant="destructive"
                onClick={handleClearAll}
                disabled={isSpinning}
                className="w-full"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t("tools.roulette.clearAll")}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
