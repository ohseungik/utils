"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Keyboard, Copy, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface KeyInfo {
  key: string;
  code: string;
  keyCode: number;
}

export default function KeyCodeTrackerPage() {
  const { t } = useLanguage();
  const [keyInfo, setKeyInfo] = useState<KeyInfo | null>(null);
  const interactiveAreaRef = useRef<HTMLDivElement>(null); // 포커스할 영역에 대한 ref 추가

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // interactiveAreaRef가 현재 포커스된 요소인지 확인
    if (
      interactiveAreaRef.current &&
      interactiveAreaRef.current === document.activeElement
    ) {
      event.preventDefault(); // 기본 동작 방지 (예: Backspace로 뒤로 가기, Spacebar로 스크롤)
      setKeyInfo({
        key: event.key,
        code: event.code,
        keyCode: event.keyCode,
      });
    }
  }, []); // 의존성 배열 비워둠: interactiveAreaRef.current는 useEffect 내에서만 접근

  useEffect(() => {
    // window에 전역 keydown 리스너 추가
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      // 컴포넌트 언마운트 시 리스너 제거
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]); // handleKeyDown 함수가 변경될 때마다 리스너를 다시 등록

  const handleClear = () => {
    setKeyInfo(null);
    toast(t("tools.keycode.clearSuccess"));
    // 초기화 후 다시 포커스를 주어 바로 입력 가능하게 함
    interactiveAreaRef.current?.focus();
  };

  const handleCopy = async (text: string, label: string) => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      toast(`${label}${t("tools.keycode.copySuccess")}`);
    } catch (err) {
      toast(t("tools.keycode.copyError"));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              {t("tools.keycode.pageTitle")}
            </h1>
            <p className="text-muted-foreground">
              {t("tools.keycode.pageDescription")}
            </p>
          </div>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{t("tools.keycode.cardTitle")}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                disabled={!keyInfo}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {t("tools.keycode.resetButton")}
              </Button>
            </CardTitle>
            <CardDescription>
              {t("tools.keycode.cardDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div
              ref={interactiveAreaRef} // ref 적용
              tabIndex={0} // 포커스 가능하게 설정
              className="flex flex-col items-center justify-center min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 p-8 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text" // 포커스 스타일 및 커서 추가
            >
              {keyInfo ? (
                <div className="space-y-4">
                  <div className="text-6xl font-bold text-primary">
                    {keyInfo.key === " " ? "Space" : keyInfo.key}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
                    {" "}
                    {/* max-w-md -> max-w-2xl로 변경 */}
                    <div className="flex flex-col items-center p-3 bg-white rounded-md shadow-sm">
                      <span className="text-xs text-muted-foreground">
                        event.key
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-lg font-semibold break-all">
                          {keyInfo.key}
                        </span>{" "}
                        {/* break-all 추가 */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopy(keyInfo.key, "Key")}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-white rounded-md shadow-sm">
                      <span className="text-xs text-muted-foreground">
                        event.code
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-lg font-semibold break-all">
                          {keyInfo.code}
                        </span>{" "}
                        {/* break-all 추가 */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopy(keyInfo.code, "Code")}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-white rounded-md shadow-sm">
                      <span className="text-xs text-muted-foreground">
                        event.keyCode
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-lg font-semibold break-all">
                          {keyInfo.keyCode}
                        </span>{" "}
                        {/* break-all 추가 */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleCopy(keyInfo.keyCode.toString(), "KeyCode")
                          }
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  <Keyboard className="w-16 h-16 text-gray-400" />
                  <p className="text-xl font-medium text-gray-600">
                    {t("tools.keycode.placeholder")}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t("tools.keycode.placeholderDescription")}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
