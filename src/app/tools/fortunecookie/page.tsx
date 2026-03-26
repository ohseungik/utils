import FortuneCookie from "@/components/FortuneCookie/FortuneCookie";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "포춘 쿠키 | 웹 도구",
  description: "포춘 쿠키를 열어 오늘의 운세와 행운의 메시지를 확인하세요",
};

export default function FortuneCookiePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <FortuneCookie />
    </div>
  );
}
