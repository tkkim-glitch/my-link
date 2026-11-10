import { useId } from "react";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export interface MainLink {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  icon: LucideIcon;
  emoji?: string;
  badge?: string;
  isExternal?: boolean;
}

export type LinkBlock = MainLink | { id: string; title: string; type: "header" };

export function ProfileLinkList({ links }: { links: readonly LinkBlock[] }) {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className="space-y-4">
      <h2 id={headingId} className="px-2 text-[13px] font-semibold text-tds-grey-600">
        주요 바로가기
      </h2>

      {links.length === 0 && (
        <p className="px-2 py-4 text-sm text-tds-grey-600">등록된 링크가 없어요</p>
      )}

      {links.map((item) => {
        if ("type" in item) {
          return (
            <h3 key={item.id} className="border-b border-tds-grey-200 px-2 pb-2 text-[13px] font-semibold text-tds-grey-600">
              {item.title}
            </h3>
          );
        }

        const Icon = item.icon;
        return (
          <a
            key={item.id}
            href={item.href}
            target={item.isExternal ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="tds-pressable block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tds-blue-500"
          >
            <Card className="flex-row items-center justify-between gap-3.5 rounded-2xl border border-tds-grey-200 bg-white px-6 py-3.5 ring-0 transition-colors duration-200 hover:bg-tds-grey-50">
              <div className="flex min-w-0 items-center gap-3.5">
                <span aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-tds-grey-100 text-tds-blue-500">
                  {item.emoji ? <span>{item.emoji}</span> : <Icon className="size-5" />}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-lg font-semibold text-tds-grey-900">
                      {item.title}
                    </span>
                    {item.badge && (
                      <span className="shrink-0 rounded-full bg-tds-blue-50 px-2 py-0.5 text-[11px] font-semibold text-tds-blue-500">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {item.subtitle && (
                    <p className="mt-0.5 truncate text-[15px] leading-normal text-tds-grey-600">
                      {item.subtitle}
                    </p>
                  )}
                </div>
              </div>

              <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-tds-grey-400" />
            </Card>
          </a>
        );
      })}
    </section>
  );
}
