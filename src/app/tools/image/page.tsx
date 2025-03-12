import ImageOptimizer from '@/components/ImageOptimizer/ImageOptimizer';

export const metadata = {
  title: "이미지 최적화 | 웹 도구 모음",
  description: "이미지 압축, 변환, 리사이징을 쉽게 할 수 있는 도구",
}

export default function ImageOptimizerPage() {
  return (
    <div className="container mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">이미지 최적화</h1>
        <p className="text-muted-foreground">이미지 압축, WebP 변환, 리사이징 기능을 쉽게 사용해보세요</p>
      </div>
      <ImageOptimizer />
    </div>
  )
}

