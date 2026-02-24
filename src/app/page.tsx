"use client"

import type React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Image,
  Type,
  Code,
  FileJson,
  Globe,
  FileCode,
  Wand2,
  QrCode,
  Clock,
  Play,
  FileCode2,
  FileArchive,
  ImagePlus,
  SignatureIcon,
  RegexIcon,
  FileIcon,
  KeyboardIcon,
  Link2,
  Hash,
  Ruler,
  FileText,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  buttonText: string;
}

function ToolCard({ title, description, icon, href, buttonText }: ToolCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {/* 추가 콘텐츠가 필요하면 여기에 */}
      </CardContent>
      <CardFooter>
        <Link href={href} className="w-full">
          <Button className="w-full">{buttonText}</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

const getTools = () => [
  {
    titleKey: "tools.image.title",
    descriptionKey: "tools.image.description",
    icon: <Image className="h-5 w-5" />,
    href: "/tools/image",
  },
  {
    titleKey: "tools.font.title",
    descriptionKey: "tools.font.description",
    icon: <Type className="h-5 w-5" />,
    href: "/tools/font",
  },
  {
    titleKey: "tools.css.title",
    descriptionKey: "tools.css.description",
    icon: <Code className="h-5 w-5" />,
    href: "/tools/css",
  },
  {
    titleKey: "tools.json.title",
    descriptionKey: "tools.json.description",
    icon: <FileJson className="h-5 w-5" />,
    href: "/tools/json",
  },
  {
    titleKey: "tools.api.title",
    descriptionKey: "tools.api.description",
    icon: <Globe className="h-5 w-5" />,
    href: "/tools/api",
  },
  {
    titleKey: "tools.base64.title",
    descriptionKey: "tools.base64.description",
    icon: <FileCode className="h-5 w-5" />,
    href: "/tools/base64",
  },
  {
    titleKey: "tools.tailwind.title",
    descriptionKey: "tools.tailwind.description",
    icon: <Wand2 className="h-5 w-5" />,
    href: "/tools/tailwind",
  },
  {
    titleKey: "tools.qrcode.title",
    descriptionKey: "tools.qrcode.description",
    icon: <QrCode className="h-5 w-5" />,
    href: "/tools/qrcode",
  },
  {
    titleKey: "tools.timestamp.title",
    descriptionKey: "tools.timestamp.description",
    icon: <Clock className="h-5 w-5" />,
    href: "/tools/timestamp",
  },
  {
    titleKey: "tools.swipepay.title",
    descriptionKey: "tools.swipepay.description",
    icon: <FileJson className="h-5 w-5" />,
    href: "/tools/swipepay",
  },
  {
    titleKey: "tools.codeplayground.title",
    descriptionKey: "tools.codeplayground.description",
    icon: <Play className="h-5 w-5" />,
    href: "/tools/codeplayground",
  },
  {
    titleKey: "tools.sql.title",
    descriptionKey: "tools.sql.description",
    icon: <FileCode2 className="h-5 w-5" />,
    href: "/tools/sql",
  },
  {
    titleKey: "tools.xml.title",
    descriptionKey: "tools.xml.description",
    icon: <FileArchive className="h-5 w-5" />,
    href: "/tools/xml",
  },
  {
    titleKey: "tools.texttoimage.title",
    descriptionKey: "tools.texttoimage.description",
    icon: <ImagePlus className="h-5 w-5" />,
    href: "/tools/texttoimage",
  },
  {
    titleKey: "tools.signature.title",
    descriptionKey: "tools.signature.description",
    icon: <SignatureIcon className="h-5 w-5" />,
    href: "/tools/signature",
  },
  {
    titleKey: "tools.regex.title",
    descriptionKey: "tools.regex.description",
    icon: <RegexIcon className="h-5 w-5" />,
    href: "/tools/regex",
  },
  {
    titleKey: "tools.storage.title",
    descriptionKey: "tools.storage.description",
    icon: <FileIcon className="h-5 w-5" />,
    href: "/tools/storage",
  },
  {
    titleKey: "tools.keycode.title",
    descriptionKey: "tools.keycode.description",
    icon: <KeyboardIcon className="h-5 w-5" />,
    href: "/tools/keycode",
  },
  {
    titleKey: "tools.querystring.title",
    descriptionKey: "tools.querystring.description",
    icon: <Link2 className="h-5 w-5" />,
    href: "/tools/querystring",
  },
  {
    titleKey: "tools.hash.title",
    descriptionKey: "tools.hash.description",
    icon: <Hash className="h-5 w-5" />,
    href: "/tools/hash",
  },
  {
    titleKey: "tools.unit.title",
    descriptionKey: "tools.unit.description",
    icon: <Ruler className="h-5 w-5" />,
    href: "/tools/unit",
  },
  {
    titleKey: "tools.wordcounter.title",
    descriptionKey: "tools.wordcounter.description",
    icon: <FileText className="h-5 w-5" />,
    href: "/tools/wordcounter",
  },
];

export default function Home() {
  const { t } = useLanguage();
  const tools = getTools();

  return (
    <div className="container mx-auto max-w-6xl py-6">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">{t("home.title")}</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {t("home.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <ToolCard
            key={tool.href}
            title={t(tool.titleKey)}
            description={t(tool.descriptionKey)}
            icon={tool.icon}
            href={tool.href}
            buttonText={t("common.useTool")}
          />
        ))}
      </div>
    </div>
  );
}
