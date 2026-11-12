import { ChartNoAxesColumnIncreasing, Link2, MousePointer2, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

type LinkStat = { id: string; title: string; clickCount: number };

const cardClass = "min-w-0 gap-4 rounded-[24px] border border-tds-grey-200 bg-white p-5 text-tds-grey-900 ring-0 sm:p-6";

function ClickNumber({ count, unit = "회" }: { count: number; unit?: string }) {
  return (
    <p className="mt-1 break-all text-[40px] font-bold leading-tight tabular-nums">
      {count.toLocaleString("ko-KR")}<span className="ml-1 text-base font-semibold">{unit}</span>
    </p>
  );
}

function RankedLinks({ links }: { links: readonly LinkStat[] }) {
  if (links.length === 0) return <p className="text-sm text-tds-grey-600">등록된 링크가 없어요.</p>;

  return (
    <ol className="divide-y divide-tds-grey-200 border-t border-tds-grey-200">
      {links.map(({ id, title, clickCount }) => (
        <li key={id} className="flex items-baseline justify-between gap-4 py-3 text-sm">
          <span className="min-w-0 break-words font-medium">{title}</span>
          <span className="shrink-0 tabular-nums text-tds-grey-700">{clickCount.toLocaleString("ko-KR")}회</span>
        </li>
      ))}
    </ol>
  );
}

export function LinkStats({ links, activeLinkCount }: {
  links: readonly LinkStat[];
  activeLinkCount?: number;
}) {
  const total = links.reduce((sum, link) => sum + link.clickCount, 0);
  const ranked = [...links].sort((a, b) => b.clickCount - a.clickCount || a.title.localeCompare(b.title, "ko"));

  if (activeLinkCount === undefined) {
    return (
      <Card className={cardClass}>
        <div>
          <h2 className="text-lg font-bold">링크 통계</h2>
          <p className="mt-3 text-sm font-medium text-tds-grey-700">총 클릭수</p>
          <ClickNumber count={total} />
        </div>
        {ranked.length > 0 && <RankedLinks links={ranked} />}
      </Card>
    );
  }

  const top = ranked[0];
  const maxClicks = top?.clickCount ?? 0;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className={cardClass}>
          <h2 className="flex items-center gap-2 text-sm font-semibold text-tds-grey-700">
            <MousePointer2 aria-hidden="true" className="size-4 text-tds-blue-600" />
            총 클릭수
          </h2>
          <ClickNumber count={total} />
        </Card>
        <Card className={cardClass}>
          <h2 className="flex items-center gap-2 text-sm font-semibold text-tds-grey-700">
            <TrendingUp aria-hidden="true" className="size-4 text-tds-blue-600" />
            가장 인기 있는 링크
          </h2>
          {top && maxClicks > 0 ? (
            <div className="space-y-1">
              <p className="break-words text-xl font-bold">{top.title}</p>
              <p className="text-sm font-semibold text-tds-blue-600 tabular-nums">{maxClicks.toLocaleString("ko-KR")}회</p>
            </div>
          ) : (
            <p className="text-lg font-semibold text-tds-grey-700">아직 클릭이 없어요</p>
          )}
        </Card>
        <Card className={cardClass}>
          <h2 className="flex items-center gap-2 text-sm font-semibold text-tds-grey-700">
            <Link2 aria-hidden="true" className="size-4 text-tds-blue-600" />
            활성 링크 수
          </h2>
          <ClickNumber count={activeLinkCount} unit="개" />
        </Card>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[3fr_2fr]">
        <Card className={cardClass}>
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <ChartNoAxesColumnIncreasing aria-hidden="true" className="size-5 text-tds-blue-600" />
            링크별 클릭수
          </h2>
          {ranked.length === 0 ? (
            <p className="text-sm text-tds-grey-600">등록된 링크가 없어요.</p>
          ) : (
            <ul className="space-y-4">
              {ranked.map(({ id, title, clickCount }) => (
                <li key={id} className="space-y-2">
                  <div className="flex items-baseline justify-between gap-4 text-sm">
                    <span className="min-w-0 break-words font-medium">{title}</span>
                    <span className="shrink-0 tabular-nums text-tds-grey-700">{clickCount.toLocaleString("ko-KR")}회</span>
                  </div>
                  <div aria-hidden="true" className="h-2.5 overflow-hidden rounded-full bg-tds-grey-100">
                    <div
                      className="h-full rounded-full bg-tds-blue-500"
                      style={{ width: `${maxClicks > 0 ? (clickCount / maxClicks) * 100 : 0}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card className={cardClass}>
          <h2 className="text-lg font-bold">링크별 순위</h2>
          <RankedLinks links={ranked} />
        </Card>
      </div>
    </>
  );
}
