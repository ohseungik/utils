"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Ruler,
  Copy,
  RefreshCw,
  Settings2,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

type UnitType =
  | "px"
  | "rem"
  | "em"
  | "vh"
  | "vw"
  | "vmin"
  | "vmax"
  | "pt"
  | "cm"
  | "in";

interface ConversionResult {
  unit: UnitType;
  value: string;
  description: string;
}

export default function UnitConverterPage() {
  const { t } = useLanguage();
  const [inputValue, setInputValue] = useState<string>("16");
  const [inputUnit, setInputUnit] = useState<UnitType>("px");
  const [baseFontSize, setBaseFontSize] = useState<number>(16);
  const [viewportWidth, setViewportWidth] = useState<number>(1920);
  const [viewportHeight, setViewportHeight] = useState<number>(1080);
  const [results, setResults] = useState<ConversionResult[]>([]);

  // 단위 설명
  const unitDescriptions: Record<UnitType, string> = {
    px: "픽셀 - 절대 단위, 화면의 물리적 픽셀",
    rem: "Root EM - 루트 요소(html)의 폰트 크기 기준",
    em: "EM - 부모 요소의 폰트 크기 기준",
    vh: "Viewport Height - 뷰포트 높이의 1%",
    vw: "Viewport Width - 뷰포트 너비의 1%",
    vmin: "Viewport Minimum - vh와 vw 중 작은 값",
    vmax: "Viewport Maximum - vh와 vw 중 큰 값",
    pt: "Point - 1pt = 1/72 inch (인쇄 단위)",
    cm: "Centimeter - 센티미터",
    in: "Inch - 인치 (1in = 96px)",
  };

  // 단위 변환 함수
  const convertUnit = (
    value: number,
    fromUnit: UnitType,
    toUnit: UnitType,
  ): number => {
    // 먼저 모든 값을 px로 변환
    let pxValue: number;

    switch (fromUnit) {
      case "px":
        pxValue = value;
        break;
      case "rem":
        pxValue = value * baseFontSize;
        break;
      case "em":
        pxValue = value * baseFontSize;
        break;
      case "vh":
        pxValue = (value * viewportHeight) / 100;
        break;
      case "vw":
        pxValue = (value * viewportWidth) / 100;
        break;
      case "vmin":
        pxValue = (value * Math.min(viewportWidth, viewportHeight)) / 100;
        break;
      case "vmax":
        pxValue = (value * Math.max(viewportWidth, viewportHeight)) / 100;
        break;
      case "pt":
        pxValue = (value * 96) / 72;
        break;
      case "cm":
        pxValue = (value * 96) / 2.54;
        break;
      case "in":
        pxValue = value * 96;
        break;
      default:
        pxValue = value;
    }

    // px에서 목표 단위로 변환
    switch (toUnit) {
      case "px":
        return pxValue;
      case "rem":
        return pxValue / baseFontSize;
      case "em":
        return pxValue / baseFontSize;
      case "vh":
        return (pxValue * 100) / viewportHeight;
      case "vw":
        return (pxValue * 100) / viewportWidth;
      case "vmin":
        return (pxValue * 100) / Math.min(viewportWidth, viewportHeight);
      case "vmax":
        return (pxValue * 100) / Math.max(viewportWidth, viewportHeight);
      case "pt":
        return (pxValue * 72) / 96;
      case "cm":
        return (pxValue * 2.54) / 96;
      case "in":
        return pxValue / 96;
      default:
        return pxValue;
    }
  };

  // 변환 수행
  useEffect(() => {
    const numValue = Number.parseFloat(inputValue);

    if (isNaN(numValue)) {
      setResults([]);
      return;
    }

    const allUnits: UnitType[] = [
      "px",
      "rem",
      "em",
      "vh",
      "vw",
      "vmin",
      "vmax",
      "pt",
      "cm",
      "in",
    ];
    const conversions: ConversionResult[] = allUnits
      .filter((unit) => unit !== inputUnit)
      .map((unit) => {
        const convertedValue = convertUnit(numValue, inputUnit, unit);
        return {
          unit,
          value: convertedValue.toFixed(4),
          description: unitDescriptions[unit],
        };
      });

    setResults(conversions);
  }, [inputValue, inputUnit, baseFontSize, viewportWidth, viewportHeight]);

  // 클립보드 복사
  const copyToClipboard = (value: string, unit: string) => {
    navigator.clipboard.writeText(`${value}${unit}`);
    toast(`${value}${unit}이(가) 클립보드에 복사되었습니다.`);
  };

  // 프리셋 적용
  const applyPreset = (preset: "desktop" | "tablet" | "mobile") => {
    switch (preset) {
      case "desktop":
        setViewportWidth(1920);
        setViewportHeight(1080);
        break;
      case "tablet":
        setViewportWidth(768);
        setViewportHeight(1024);
        break;
      case "mobile":
        setViewportWidth(375);
        setViewportHeight(667);
        break;
    }
    toast(
      `${preset === "desktop" ? "데스크톱" : preset === "tablet" ? "태블릿" : "모바일"} 뷰포트 크기가 적용되었습니다.`,
    );
  };

  // 초기화
  const resetSettings = () => {
    setBaseFontSize(16);
    setViewportWidth(1920);
    setViewportHeight(1080);
    toast("초기화 완료: 설정이 기본값으로 초기화되었습니다.");
  };

  // 일반적인 CSS 속성 예시
  const commonProperties = [
    {
      name: "font-size",
      values: ["12px", "14px", "16px", "18px", "20px", "24px"],
    },
    { name: "padding", values: ["4px", "8px", "12px", "16px", "20px", "24px"] },
    { name: "margin", values: ["8px", "16px", "24px", "32px", "40px", "48px"] },
    {
      name: "width",
      values: ["100%", "50%", "320px", "768px", "1024px", "1440px"],
    },
    {
      name: "height",
      values: ["100vh", "50vh", "200px", "400px", "600px", "800px"],
    },
  ];

  return (
    <div className="container py-10">
      <div className="flex flex-col items-center max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Ruler className="h-8 w-8 mr-2" />
          <h1 className="text-3xl font-bold">{t("tools.unit.pageTitle")}</h1>
        </div>

        <p className="text-muted-foreground text-center mb-8">
          {t("tools.unit.pageDescription")}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          {/* 설정 패널 */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings2 className="h-5 w-5" />
                  설정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="base-font-size">
                    기본 폰트 크기 (rem/em 기준)
                  </Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      id="base-font-size"
                      min={8}
                      max={32}
                      step={1}
                      value={[baseFontSize]}
                      onValueChange={(value) => setBaseFontSize(value[0])}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={baseFontSize}
                      onChange={(e) => setBaseFontSize(Number(e.target.value))}
                      className="w-20"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {baseFontSize}px (일반적으로 16px)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>뷰포트 크기 (vh/vw 기준)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label
                        htmlFor="viewport-width"
                        className="text-xs text-muted-foreground"
                      >
                        너비
                      </Label>
                      <Input
                        id="viewport-width"
                        type="number"
                        value={viewportWidth}
                        onChange={(e) =>
                          setViewportWidth(Number(e.target.value))
                        }
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="viewport-height"
                        className="text-xs text-muted-foreground"
                      >
                        높이
                      </Label>
                      <Input
                        id="viewport-height"
                        type="number"
                        value={viewportHeight}
                        onChange={(e) =>
                          setViewportHeight(Number(e.target.value))
                        }
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {viewportWidth} x {viewportHeight}px
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>뷰포트 프리셋</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => applyPreset("desktop")}
                      className="flex-col h-auto py-2 bg-transparent"
                    >
                      <Monitor className="h-4 w-4 mb-1" />
                      <span className="text-xs">Desktop</span>
                      <span className="text-[10px] text-muted-foreground">
                        1920x1080
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => applyPreset("tablet")}
                      className="flex-col h-auto py-2 bg-transparent"
                    >
                      <Tablet className="h-4 w-4 mb-1" />
                      <span className="text-xs">Tablet</span>
                      <span className="text-[10px] text-muted-foreground">
                        768x1024
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => applyPreset("mobile")}
                      className="flex-col h-auto py-2 bg-transparent"
                    >
                      <Smartphone className="h-4 w-4 mb-1" />
                      <span className="text-xs">Mobile</span>
                      <span className="text-[10px] text-muted-foreground">
                        375x667
                      </span>
                    </Button>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={resetSettings}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  설정 초기화
                </Button>

                <div className="pt-4 border-t space-y-2">
                  <h3 className="font-medium text-sm">현재 설정 정보</h3>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">1rem =</span>
                      <span>{baseFontSize}px</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">1vh =</span>
                      <span>{(viewportHeight / 100).toFixed(2)}px</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">1vw =</span>
                      <span>{(viewportWidth / 100).toFixed(2)}px</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 메인 변환 패널 */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>단위 변환</CardTitle>
                <CardDescription>변환할 값과 단위를 입력하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="input-value">값</Label>
                    <Input
                      id="input-value"
                      type="number"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="16"
                      className="text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="input-unit">단위</Label>
                    <Select
                      value={inputUnit}
                      onValueChange={(value) => setInputUnit(value as UnitType)}
                    >
                      <SelectTrigger id="input-unit" className="text-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="px">px (픽셀)</SelectItem>
                        <SelectItem value="rem">rem</SelectItem>
                        <SelectItem value="em">em</SelectItem>
                        <SelectItem value="vh">vh</SelectItem>
                        <SelectItem value="vw">vw</SelectItem>
                        <SelectItem value="vmin">vmin</SelectItem>
                        <SelectItem value="vmax">vmax</SelectItem>
                        <SelectItem value="pt">pt (포인트)</SelectItem>
                        <SelectItem value="cm">cm</SelectItem>
                        <SelectItem value="in">in (인치)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {inputValue && !isNaN(Number.parseFloat(inputValue)) && (
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <p className="text-sm text-muted-foreground mb-1">입력값</p>
                    <p className="text-2xl font-bold">
                      {inputValue}
                      {inputUnit}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {unitDescriptions[inputUnit]}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>변환 결과</CardTitle>
                <CardDescription>모든 단위로 변환된 값</CardDescription>
              </CardHeader>
              <CardContent>
                {results.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>값을 입력하면 변환 결과가 표시됩니다</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {results.map((result) => (
                      <div
                        key={result.unit}
                        className="border rounded-md p-3 bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{result.unit}</Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() =>
                              copyToClipboard(result.value, result.unit)
                            }
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-xl font-bold font-mono mb-1">
                          {result.value}
                          {result.unit}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {result.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>일반적인 CSS 속성 예시</CardTitle>
                <CardDescription>
                  자주 사용하는 CSS 속성의 값을 빠르게 변환하세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="font-size">
                  <TabsList className="grid grid-cols-5 w-full">
                    {commonProperties.map((prop) => (
                      <TabsTrigger
                        key={prop.name}
                        value={prop.name}
                        className="text-xs"
                      >
                        {prop.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {commonProperties.map((prop) => (
                    <TabsContent
                      key={prop.name}
                      value={prop.name}
                      className="space-y-2 mt-4"
                    >
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {prop.values.map((value) => {
                          const match = value.match(/^([\d.]+)(.+)$/);
                          if (!match) return null;
                          const numValue = Number.parseFloat(match[1]);
                          const unit = match[2] as UnitType;

                          return (
                            <Button
                              key={value}
                              variant="outline"
                              className="justify-start bg-transparent"
                              onClick={() => {
                                setInputValue(numValue.toString());
                                setInputUnit(unit);
                              }}
                            >
                              <code className="text-sm">{value}</code>
                            </Button>
                          );
                        })}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
