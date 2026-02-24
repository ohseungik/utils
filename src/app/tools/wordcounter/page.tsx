import WordCounter from "@/components/WordCounter/WordCounter";

export const metadata = {
  title: "글자수 & 단어수 카운터 | 웹 도구 모음",
  description:
    "텍스트의 글자수, 단어수, 문장수, 단락수를 실시간으로 계산하는 도구입니다",
};

export default function WordCounterPage() {
  return (
    <div className="container mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">글자수 & 단어수 카운터</h1>
        <p className="text-muted-foreground">
          텍스트의 글자수, 단어수, 문장수, 단락수를 실시간으로 분석하고 예상
          읽기 시간을 계산합니다
        </p>
      </div>
      <WordCounter />
    </div>
  );
}
