import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Image, Type, Code, FileJson } from "lucide-react"

export const metadata: Metadata = {
  title: "웹 도구 모음",
  description: "다양한 웹 도구를 한 곳에서 사용해보세요",
}

interface ToolCardProps {
  title: string
  description: string
  icon: React.ReactNode
  href: string
}

function ToolCard({ title, description, icon, href }: ToolCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">{/* 추가 콘텐츠가 필요하면 여기에 */}</CardContent>
      <CardFooter>
        <Link href={href} className="w-full">
          <Button className="w-full">도구 사용하기</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default function Home() {
  const tools = [
    {
      title: "이미지 최적화",
      description: "이미지 압축, WebP 변환, 리사이징 기능을 제공합니다",
      icon: <Image className="h-5 w-5" />,
      href: "/tools/image",
    },
    {
      title: "폰트 프리뷰 및 변환기",
      description: "웹 폰트 미리보기 및 다양한 포맷(WOFF, TTF) 변환 기능을 제공합니다",
      icon: <Type className="h-5 w-5" />,
      href: "/tools/font",
    },
    {
      title: "CSS 코드 압축기",
      description: "CSS 코드를 Minify하고 포맷을 변환하는 기능을 제공합니다",
      icon: <Code className="h-5 w-5" />,
      href: "/tools/css",
    },
    {
      title: "JSON 포매터 & 뷰어",
      description: "JSON을 보기 좋게 정리하고 편집할 수 있는 도구입니다",
      icon: <FileJson className="h-5 w-5" />,
      href: "/tools/json",
    },
  ]

  return (
    <div className="container mx-auto max-w-6xl py-6">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">웹 도구 모음</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          다양한 웹 개발 및 디자인 작업에 필요한 도구들을 한 곳에서 사용해보세요. 모든 처리는 브라우저에서 이루어지며
          파일은 서버로 전송되지 않습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <ToolCard
            key={tool.href}
            title={tool.title}
            description={tool.description}
            icon={tool.icon}
            href={tool.href}
          />
        ))}
      </div>
    </div>
  )
}

