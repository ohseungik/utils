"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Image, Menu, X, Type, Code, FileJson, Globe, FileCode, Wand2, QrCode, Clock, Play, FileCode2, FileArchive, ImagePlus, SignatureIcon, RegexIcon, FileIcon, KeyboardIcon, Link2, Hash } from "lucide-react"
import { useState, useEffect } from "react"
import { useMobile } from "@/hooks/useMobile"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    title: "이미지 최적화",
    href: "/tools/image",
    icon: <Image className="h-5 w-5" />,
  },
  {
    title: "폰트 프리뷰 및 변환기",
    href: "/tools/font",
    icon: <Type className="h-5 w-5" />,
  },
  {
    title: "CSS 코드 압축기",
    href: "/tools/css",
    icon: <Code className="h-5 w-5" />,
  },
  {
    title: "JSON 포매터 & 뷰어",
    href: "/tools/json",
    icon: <FileJson className="h-5 w-5" />,
  },
  {
    title: "API 테스트 도구",
    href: "/tools/api",
    icon: <Globe className="h-5 w-5" />,
  },
  {
    title: "Base64 인코딩/디코딩",
    href: "/tools/base64",
    icon: <FileCode className="h-5 w-5" />,
  },
  {
    title: "CSS → Tailwind 변환기",
    href: "/tools/tailwind",
    icon: <Wand2 className="h-5 w-5" />,
  },
  {
    title: "QR코드 생성기",
    href: "/tools/qrcode",
    icon: <QrCode className="h-5 w-5" />,
  },
  {
    title: "타임스탬프 변환기",
    href: "/tools/timestamp",
    icon: <Clock className="h-5 w-5" />,
  },
  {
    title: "밀어서 결제하기 테스트",
    href: "/tools/swipepay",
    icon: <FileJson className="h-5 w-5" />,
  },
  {
    title: "코드 플레이그라운드",
    href: "/tools/codeplayground",
    icon: <Play className="h-5 w-5" />,
  },
  {
    title: "SQL 쿼리 포매터",
    href: "/tools/sql",
    icon: <FileCode2 className="h-5 w-5" />,
  },
  {
    title: "XML 포매터",
    href: "/tools/xml",
    icon: <FileArchive className="h-5 w-5" />,
  },
  {
    title: "Text to Image 변환기",
    href: "/tools/texttoimage",
    icon: <ImagePlus className="h-5 w-5" />,
  },
  {
    title: "서명 생성기",
    href: "/tools/signature",
    icon: <SignatureIcon className="h-5 w-5" />,
  },
  {
    title: "regex 정규표현식 매칭 도구",
    href: "/tools/regex",
    icon: <RegexIcon className="h-5 w-5" />,
  },
  {
    title: "브라우저 저장소 관리 도구",
    href: "/tools/storage",
    icon: <FileIcon className="h-5 w-5" />,
  },
  {
    title: "keycode 추적기",
    href: "/tools/keycode",
    icon: <KeyboardIcon className="h-5 w-5" />,
  },
  {
    title: "URL Query String 파서 & 빌더",
    href: "/tools/querystring",
    icon: <Link2 className="h-5 w-5" />,
  },
  {
    title: "Hash 생성기",
    href: "/tools/hash",
    icon: <Hash className="h-5 w-5" />,
  },
  // 향후 도구들이 여기에 추가될 예정
]

export default function Sidebar() {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [isOpen, setIsOpen] = useState(!isMobile)

  // 페이지 경로가 변경될 때 모바일에서는 사이드바를 닫습니다
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false)
    } else {
      // PC에서는 항상 열린 상태로 유지
      setIsOpen(true)
    }
  }, [pathname, isMobile])

  // 모바일에서 사이드바가 열릴 때 스크롤을 방지합니다
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobile, isOpen])

  return (
    <>
      {/* 모바일 토글 버튼 - 사이드바 외부에 위치 */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "fixed z-50 top-4 transition-all duration-300",
            isOpen ? "left-[calc(16rem-2.5rem)]" : "left-4",
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      )}

      {/* 모바일 오버레이 */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40" onClick={() => setIsOpen(false)} />
      )}

      {/* 사이드바 */}
      <div
        className={cn(
          "transition-all duration-300 z-40 bg-background border-r h-screen",
          isMobile ? cn("fixed", isOpen ? "w-64 left-0" : "w-0 -left-full") : "relative w-64", // PC에서는 항상 고정 너비
        )}
      >
        <div className="p-4 h-16 flex items-center border-b">
          {/* 타이틀 */}
          <Link href={"/"}>
            <h1 className="font-bold text-xl">웹 도구</h1>
          </Link>
        </div>

        <nav className="p-2 overflow-y-auto max-h-[calc(100vh-4rem)]">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  <Button
                    variant={pathname.includes(item.href) ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => isMobile && setIsOpen(false)}
                  >
                    {item.icon}
                    <span className="ml-2">{item.title}</span>
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* 모바일에서 사이드바가 열릴 때 메인 콘텐츠 영역에 패딩 추가 */}
      {isMobile && isOpen && <div className="w-64 shrink-0 md:hidden" />}
    </>
  )
}

