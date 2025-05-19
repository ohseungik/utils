import TimestampConverter from "@/components/TimestampConverter/TimestampConverter"

export const metadata = {
  title: "타임스탬프 변환기 | 웹 도구",
  description: "Unix 타임스탬프와 날짜/시간 형식 간의 변환 도구입니다",
}

export default function TimestampConverterPage() {
  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">타임스탬프 변환기</h1>
        <p className="text-muted-foreground">
          Unix 타임스탬프를 사람이 읽을 수 있는 날짜/시간 형식으로 변환하거나, 날짜/시간을 Unix 타임스탬프로 변환할 수
          있습니다.
        </p>
      </div>

      <TimestampConverter />
    </div>
  )
}
