"use client";

import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { Download, Bold, Italic, RotateCcw, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  isBold: boolean;
  isItalic: boolean;
}

export default function TextToImagePage() {
  const { t } = useLanguage();
  const [backgroundColor, setBgColor] = useState("#3079E6");
  const [imageFormat, setImageFormat] = useState("png");
  const [canvasWidth] = useState(600);
  const [canvasHeight] = useState(400);

  // 텍스트 요소들 관리
  const [textElements, setTextElements] = useState<TextElement[]>([
    {
      id: "1",
      text: "Text To Image",
      x: 300,
      y: 200,
      fontSize: 32,
      fontFamily: "Arial",
      color: "#ffffff",
      isBold: false,
      isItalic: false,
    },
  ]);

  const [selectedElementId, setSelectedElementId] = useState("1");
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fontOptions = [
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Georgia",
    "Verdana",
    "Courier New",
    "Impact",
    "Comic Sans MS",
    "Trebuchet MS",
    "Arial Black",
  ];

  // 현재 선택된 요소 가져오기
  const selectedElement = textElements.find(
    (el) => el.id === selectedElementId,
  );

  // 선택된 요소 업데이트
  const updateSelectedElement = (updates: Partial<TextElement>) => {
    setTextElements((prev) =>
      prev.map((el) =>
        el.id === selectedElementId ? { ...el, ...updates } : el,
      ),
    );
  };

  const generateImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 캔버스 크기 설정
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // 배경색 설정
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 모든 텍스트 요소 그리기
    textElements.forEach((element) => {
      ctx.fillStyle = element.color;

      // 폰트 스타일 조합
      let fontStyle = "";
      if (element.isItalic) fontStyle += "italic ";
      if (element.isBold) fontStyle += "bold ";

      ctx.font = `${fontStyle}${element.fontSize}px ${element.fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // 텍스트를 줄바꿈 처리하여 그리기
      const lines = element.text.split("\n");
      const lineHeight = element.fontSize * 1.2;
      const totalHeight = lines.length * lineHeight;
      const startY = element.y - totalHeight / 2 + lineHeight / 2;

      lines.forEach((line, index) => {
        const y = startY + index * lineHeight;
        ctx.fillText(line, element.x, y);
      });

      // 선택된 요소에 핸들 표시
      if (element.id === selectedElementId) {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);

        // 텍스트 영역 주변에 점선 박스 그리기
        const textWidth = Math.max(
          ...lines.map((line) => ctx.measureText(line).width),
        );
        const boxX = element.x - textWidth / 2 - 10;
        const boxY = startY - lineHeight / 2 - 10;
        const boxWidth = textWidth + 20;
        const boxHeight = totalHeight + 20;

        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // 핸들 그리기
        const handleSize = 6;
        const handles = [
          { x: boxX - handleSize / 2, y: boxY - handleSize / 2 }, // 좌상
          { x: boxX + boxWidth - handleSize / 2, y: boxY - handleSize / 2 }, // 우상
          { x: boxX - handleSize / 2, y: boxY + boxHeight - handleSize / 2 }, // 좌하
          {
            x: boxX + boxWidth - handleSize / 2,
            y: boxY + boxHeight - handleSize / 2,
          }, // 우하
        ];

        ctx.fillStyle = "#ffffff";
        handles.forEach((handle) => {
          ctx.fillRect(handle.x, handle.y, handleSize, handleSize);
        });

        ctx.setLineDash([]);
      }
    });
  }, [
    textElements,
    selectedElementId,
    backgroundColor,
    canvasWidth,
    canvasHeight,
  ]);

  // 텍스트 요소가 클릭된 위치에 있는지 확인
  const getElementAtPosition = (x: number, y: number): TextElement | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // 역순으로 확인 (위에 있는 요소부터)
    for (let i = textElements.length - 1; i >= 0; i--) {
      const element = textElements[i];

      let fontStyle = "";
      if (element.isItalic) fontStyle += "italic ";
      if (element.isBold) fontStyle += "bold ";
      ctx.font = `${fontStyle}${element.fontSize}px ${element.fontFamily}`;

      const lines = element.text.split("\n");
      const lineHeight = element.fontSize * 1.2;
      const totalHeight = lines.length * lineHeight;
      const textWidth = Math.max(
        ...lines.map((line) => ctx.measureText(line).width),
      );

      const textLeft = element.x - textWidth / 2;
      const textRight = element.x + textWidth / 2;
      const textTop = element.y - totalHeight / 2;
      const textBottom = element.y + totalHeight / 2;

      if (x >= textLeft && x <= textRight && y >= textTop && y <= textBottom) {
        return element;
      }
    }

    return null;
  };

  // 마우스 이벤트 핸들러
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    const clickedElement = getElementAtPosition(mouseX, mouseY);

    if (clickedElement) {
      // 기존 텍스트 요소 선택 및 드래그 시작
      setSelectedElementId(clickedElement.id);
      setIsDragging(true);
      setDragOffset({
        x: mouseX - clickedElement.x,
        y: mouseY - clickedElement.y,
      });
    } else {
      // 배경 클릭 시 새로운 텍스트 요소 추가
      const newId = Date.now().toString();
      const newElement: TextElement = {
        id: newId,
        text: "New Text",
        x: mouseX,
        y: mouseY,
        fontSize: 32,
        fontFamily: "Arial",
        color: "#ffffff",
        isBold: false,
        isItalic: false,
      };

      setTextElements((prev) => [...prev, newElement]);
      setSelectedElementId(newId);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !selectedElement) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    const newX = mouseX - dragOffset.x;
    const newY = mouseY - dragOffset.y;

    // 캔버스 경계 내에서만 이동 가능
    const clampedX = Math.max(50, Math.min(canvasWidth - 50, newX));
    const clampedY = Math.max(50, Math.min(canvasHeight - 50, newY));

    updateSelectedElement({ x: clampedX, y: clampedY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  // 텍스트 요소 삭제
  const deleteSelectedElement = () => {
    if (textElements.length <= 1) {
      toast("최소 하나의 텍스트 요소는 있어야 합니다.");
      return;
    }

    setTextElements((prev) => prev.filter((el) => el.id !== selectedElementId));
    setSelectedElementId(
      textElements.find((el) => el.id !== selectedElementId)?.id || "",
    );
  };

  // 새 텍스트 요소 추가
  const addNewElement = () => {
    const newId = Date.now().toString();
    const newElement: TextElement = {
      id: newId,
      text: "New Text",
      x: 300,
      y: 200,
      fontSize: 32,
      fontFamily: "Arial",
      color: "#ffffff",
      isBold: false,
      isItalic: false,
    };

    setTextElements((prev) => [...prev, newElement]);
    setSelectedElementId(newId);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      // 다운로드용으로 핸들 없이 다시 그리기
      const tempSelectedId = selectedElementId;
      setSelectedElementId("");

      setTimeout(() => {
        const link = document.createElement("a");
        link.download = `text-image.${imageFormat}`;
        link.href = canvas.toDataURL(`image/${imageFormat}`);
        link.click();

        setSelectedElementId(tempSelectedId);

        toast("이미지가 성공적으로 다운로드되었습니다.");
      }, 100);
    } catch (error) {
      toast("이미지 다운로드 중 오류가 발생했습니다.");
    }
  };

  const resetSettings = () => {
    setTextElements([
      {
        id: "1",
        text: "Text To Image",
        x: 300,
        y: 200,
        fontSize: 32,
        fontFamily: "Arial",
        color: "#ffffff",
        isBold: false,
        isItalic: false,
      },
    ]);
    setSelectedElementId("1");
    setBgColor("#3079E6");
    setImageFormat("png");
    setIsDragging(false);
  };

  // 설정이 변경될 때마다 이미지 재생성
  useEffect(() => {
    generateImage();
  }, [generateImage]);

  // useEffect 추가 (기존 generateImage useEffect 아래에)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 텍스트 입력 중이 아닐 때만 Delete 키 처리
      const activeElement = document.activeElement;
      const isInputFocused =
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA");

      if (e.key === "Delete" && !isInputFocused) {
        e.preventDefault();
        deleteSelectedElement();
      }
    };

    // 키보드 이벤트 리스너 추가
    document.addEventListener("keydown", handleKeyDown);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedElementId, textElements.length]); // deleteSelectedElement 함수가 의존하는 값들

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              {t("tools.texttoimage.pageTitle")}
            </h1>
            <p className="text-muted-foreground">
              {t("tools.texttoimage.pageDescription")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 왼쪽: 텍스트 입력 및 설정 */}
          <div className="space-y-6">
            {/* 텍스트 요소 목록 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Text Elements</span>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={addNewElement}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={deleteSelectedElement}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {textElements.map((element) => (
                    <div
                      key={element.id}
                      className={`p-2 border rounded cursor-pointer transition-colors ${
                        element.id === selectedElementId
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }`}
                      onClick={() => setSelectedElementId(element.id)}
                    >
                      <div className="text-sm font-medium truncate">
                        {element.text || "Empty Text"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {element.fontFamily} {element.fontSize}px
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {selectedElement && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Text</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="변환할 텍스트를 입력하세요..."
                      value={selectedElement.text}
                      onChange={(e) =>
                        updateSelectedElement({ text: e.target.value })
                      }
                      className="min-h-[120px] text-base"
                    />
                  </CardContent>
                </Card>

                {/* 색상 설정 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Fill</Label>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded border-2 border-gray-300 cursor-pointer"
                        style={{ backgroundColor: backgroundColor }}
                        onClick={() =>
                          document.getElementById("bgColorPicker")?.click()
                        }
                      />
                      <Input
                        id="bgColorPicker"
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="sr-only"
                      />
                      <Input
                        value={backgroundColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="flex-1 font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Text</Label>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded border-2 border-gray-300 cursor-pointer"
                        style={{ backgroundColor: selectedElement.color }}
                        onClick={() =>
                          document.getElementById("textColorPicker")?.click()
                        }
                      />
                      <Input
                        id="textColorPicker"
                        type="color"
                        value={selectedElement.color}
                        onChange={(e) =>
                          updateSelectedElement({ color: e.target.value })
                        }
                        className="sr-only"
                      />
                      <Input
                        value={selectedElement.color}
                        onChange={(e) =>
                          updateSelectedElement({ color: e.target.value })
                        }
                        className="flex-1 font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* 폰트 설정 */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Font</Label>
                    <Select
                      value={selectedElement.fontFamily}
                      onValueChange={(value) =>
                        updateSelectedElement({ fontFamily: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fontOptions.map((font) => (
                          <SelectItem key={font} value={font}>
                            {font}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-4">
                    <div className="space-y-2">
                      <Label>Bold</Label>
                      <Button
                        variant={selectedElement.isBold ? "default" : "outline"}
                        size="sm"
                        onClick={() =>
                          updateSelectedElement({
                            isBold: !selectedElement.isBold,
                          })
                        }
                        className="w-12 h-10"
                      >
                        <Bold className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label>Italic</Label>
                      <Button
                        variant={
                          selectedElement.isItalic ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          updateSelectedElement({
                            isItalic: !selectedElement.isItalic,
                          })
                        }
                        className="w-12 h-10"
                      >
                        <Italic className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* 폰트 크기 */}
                <div className="space-y-3">
                  <Label>Font Size</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[selectedElement.fontSize]}
                      onValueChange={(value) =>
                        updateSelectedElement({ fontSize: value[0] })
                      }
                      max={100}
                      min={12}
                      step={1}
                      className="flex-1"
                    />
                    <div className="w-12 h-8 bg-purple-100 rounded flex items-center justify-center text-sm font-medium text-purple-700">
                      {selectedElement.fontSize}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* 이미지 형식 */}
            <div className="space-y-2">
              <Label>이미지 형식</Label>
              <Select value={imageFormat} onValueChange={setImageFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="jpeg">JPEG</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={resetSettings}
              variant="outline"
              className="w-full bg-transparent"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              초기화
            </Button>
          </div>

          {/* 오른쪽: 미리보기 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Image</h3>
              <Button
                onClick={downloadImage}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>

            <div className="relative border-2 border-dashed border-gray-200 rounded-lg p-4 bg-gray-50">
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto border-2 border-blue-300 bg-white rounded shadow-sm mx-auto block cursor-crosshair"
                style={{ maxHeight: "500px" }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
              <div className="absolute top-2 right-2 text-xs text-gray-500 bg-white px-2 py-1 rounded">
                {canvasWidth} × {canvasHeight}
              </div>
            </div>

            <div className="text-sm text-muted-foreground text-center space-y-1">
              <div>
                • 텍스트를 클릭하고 드래그하여 위치를 조절할 수 있습니다
              </div>
              <div>• 배경을 클릭하면 새로운 텍스트 요소가 추가됩니다</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
