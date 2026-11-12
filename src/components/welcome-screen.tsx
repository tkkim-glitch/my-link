"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const exampleLinks = ["GitHub", "기술 블로그", "포트폴리오"];

export function WelcomeScreen() {
  const router = useRouter();
  const { canLogin, busy, error, login } = useAuth();

  async function handleLogin() {
    if (await login()) router.replace("/mypage");
  }

  return (
    <div className="min-h-screen bg-tds-grey-100 font-sans text-tds-grey-900">
      <header className="border-b border-tds-grey-200 bg-white">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="rounded-lg text-[20px] font-bold leading-[1.35] tracking-[-0.015em] focus-visible:outline-2 focus-visible:outline-tds-blue-500">
            MyLink
          </Link>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="tds-pressable h-8 rounded-[10px] bg-tds-grey-100 px-3 text-[13px] font-semibold text-tds-grey-900 hover:bg-tds-grey-200 disabled:opacity-30"
            disabled={!canLogin || busy}
            onClick={handleLogin}
          >
            로그인
          </Button>
        </div>
      </header>

      <main className="mx-auto flex max-w-2xl flex-col items-center px-5 py-12 text-center sm:px-8 sm:py-20">
        <h1 className="text-balance text-[28px] font-bold leading-[1.3] tracking-[-0.02em] min-[420px]:text-[40px] min-[420px]:leading-[1.2] sm:text-[56px] sm:leading-[1.3] sm:tracking-[-0.005em]">
          <span className="block">개발자의 모든 링크를</span>
          <span className="block">한 페이지에</span>
        </h1>
        <p className="mt-4 max-w-xs text-pretty text-[15px] leading-[1.5] text-tds-grey-700 sm:max-w-md">
          GitHub, 기술 블로그, 포트폴리오를 모아 내 프로필을 공유해 보세요.
        </p>
        <Button
          type="button"
          className="tds-pressable mt-6 h-14 w-full max-w-xs rounded-2xl bg-tds-blue-500 px-5 text-[17px] font-bold text-white hover:bg-tds-blue-600 disabled:opacity-30"
          disabled={!canLogin || busy}
          onClick={handleLogin}
        >
          {busy ? "로그인 중…" : "Google로 시작하기"}
        </Button>
        {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}

        <Card role="group" aria-label="프로필 링크 페이지 예시" className="mt-10 w-full max-w-sm gap-4 rounded-[24px] border border-tds-grey-200 bg-white p-5 text-left text-tds-grey-900 ring-0 sm:mt-12 sm:p-6">
          <div className="flex items-center gap-3">
            <div aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-full bg-tds-blue-50 text-[18px] font-semibold text-tds-blue-600">
              M
            </div>
            <p className="text-[18px] font-semibold">내 링크</p>
          </div>
          <ul className="space-y-2">
            {exampleLinks.map((label) => (
              <li key={label} className="flex min-h-10 items-center rounded-xl bg-tds-grey-100 px-4 text-[15px] font-medium text-tds-grey-800">
                {label}
              </li>
            ))}
          </ul>
        </Card>
      </main>
    </div>
  );
}
