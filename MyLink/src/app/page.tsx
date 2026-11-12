"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Check,
  Heart,
  Share2,
  BookOpen,
  ExternalLink,
  Copy,
  Camera,
  Music2,
  Play,
  AtSign,
  ChartNoAxesColumnIncreasing,
  ChevronDown,
  LogOut,
  UserRound,
} from "lucide-react";
import { PublicLinkClick } from "@/components/profile/public-link-click";
import { ProfileLinkCard, ProfileLinkList } from "@/components/profile/profile-link-list";
import Link from "next/link";
import { DropdownMenu } from "radix-ui";
import { WelcomeScreen } from "@/components/welcome-screen";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { publicProfilePath } from "@/lib/public-profile-path";
import { profileFromAccount } from "@/lib/user-profile";
import { useUserLinks } from "@/lib/use-user-links";

const profileMenuItemClass =
  "flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 outline-none data-highlighted:bg-tds-grey-100 data-disabled:cursor-default data-disabled:opacity-50";

type TabType = "links" | "projects" | "skills" | "about";

function GithubIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function LinkedinIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.77v8.37H6.46v-8.37M7.84 6.88a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24" />
    </svg>
  );
}

const SOCIAL_PLATFORMS = {
  github: { label: "GitHub", icon: GithubIcon, color: "" },
  linkedin: { label: "LinkedIn", icon: LinkedinIcon, color: "text-tds-blue-500" },
  blog: { label: "블로그", icon: BookOpen, color: "text-tds-green-500" },
  instagram: { label: "Instagram", icon: Camera, color: "" },
  youtube: { label: "YouTube", icon: Play, color: "" },
  x: { label: "X", icon: AtSign, color: "" },
  tiktok: { label: "TikTok", icon: Music2, color: "" },
  email: { label: "이메일 복사", icon: Copy, color: "text-tds-grey-600" },
};

type SocialPlatform = keyof typeof SOCIAL_PLATFORMS;
type Social = { id: string; platform: SocialPlatform; url: string };
type ProfileExtras = { avatarUrl: string; socials: Social[] };

const DEFAULT_PROFILE_EXTRAS: ProfileExtras = {
  avatarUrl: "",
  socials: [
    { id: "github", platform: "github", url: "https://github.com" },
    { id: "linkedin", platform: "linkedin", url: "https://linkedin.com" },
    { id: "blog", platform: "blog", url: "https://velog.io" },
    { id: "email", platform: "email", url: "contact.taekyung@example.com" },
  ],
};

const SOCIAL_CHIP_CLASS =
  "tds-pressable inline-flex h-[34px] items-center gap-1.5 rounded-full bg-tds-grey-100 px-3.5 text-[13px] font-medium text-tds-grey-800 hover:bg-tds-grey-200";

function readStorage(key: string): unknown {
  try {
    const value = localStorage.getItem(key);
    return value === null ? null : JSON.parse(value);
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function webUrl(value: unknown, base?: string): string {
  if (typeof value !== "string" || !value.trim()) return "";
  try {
    const url = new URL(value.trim(), base);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
  } catch {
    return "";
  }
}

function isSocialPlatform(value: unknown): value is SocialPlatform {
  return typeof value === "string" && Object.hasOwn(SOCIAL_PLATFORMS, value);
}

function readProfileExtras(): ProfileExtras {
  const data = readStorage("mylink_profile_data");
  if (!isRecord(data) || !Array.isArray(data.socials)) {
    return DEFAULT_PROFILE_EXTRAS;
  }

  const socials = data.socials.flatMap((item: unknown): Social[] => {
    if (!isRecord(item) || typeof item.id !== "string" ||
        !isSocialPlatform(item.platform) || item.enabled !== true) return [];

    let url = webUrl(item.url);
    if (item.platform === "email" && typeof item.url === "string") {
      const email = item.url.trim().replace(/^mailto:/i, "").split("?")[0];
      url = /^[^\s@]+@[^\s@]+$/.test(email) ? email : "";
    }
    return url ? [{ id: item.id, platform: item.platform, url }] : [];
  });

  return {
    avatarUrl: data.avatarUrl ? webUrl(data.avatarUrl, window.location.origin) : "",
    socials,
  };
}

const PROJECTS = [
  {
    id: "mylink",
    title: "MyLink (마이링크)",
    role: "프론트엔드 리드",
    period: "2026.01 - 현재",
    description: "나만의 링크와 포트폴리오를 가장 간결하고 유려하게 전하는 올인원 링크 서비스예요.",
    tags: ["Next.js 16", "React 19", "Tailwind CSS", "TypeScript"],
    link: "https://example.com",
    github: "https://github.com",
  },
  {
    id: "devpulse",
    title: "DevPulse (개발 트렌드 큐레이션)",
    role: "풀스택 개발",
    period: "2025 - 2026",
    description: "국내외 최신 기술 소식과 오픈소스 트렌드를 매일 선별해서 알려드려요.",
    tags: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    link: "https://example.com",
    github: "https://github.com",
  },
  {
    id: "flowboard",
    title: "FlowBoard (실시간 협업 툴)",
    role: "프론트엔드 개발",
    period: "2025",
    description: "웹소켓 기반의 부드러운 드래그 앤 드롭으로 팀 프로젝트를 실시간 관리할 수 있어요.",
    tags: ["React", "Zustand", "Tailwind CSS", "Socket.io"],
    link: "https://example.com",
    github: "https://github.com",
  },
];

const SKILL_GROUPS = [
  {
    category: "프론트엔드",
    skills: ["React 19", "Next.js 16", "TypeScript", "Tailwind CSS", "Zustand", "TanStack Query"],
  },
  {
    category: "백엔드 및 데이터",
    skills: ["Node.js", "Express", "PostgreSQL", "Supabase", "Prisma"],
  },
  {
    category: "도구 및 협업",
    skills: ["Git & GitHub", "Vercel", "Docker", "Figma"],
  },
];

export default function Home() {
  const { user, profile: savedProfile, profileError, busy, error, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("links");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [cheerCount, setCheerCount] = useState<number>(142);
  const [hasCheered, setHasCheered] = useState<boolean>(false);
  const [profileExtras, setProfileExtras] = useState(DEFAULT_PROFILE_EXTRAS);
  const [avatarFailed, setAvatarFailed] = useState(false);

  const contactEmail = profileExtras.socials.find(({ platform }) => platform === "email")?.url;

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setProfileExtras(readProfileExtras());

      const savedCount = readStorage("tds_cheer_count");
      if (typeof savedCount === "number" && Number.isInteger(savedCount)) {
        setCheerCount(savedCount);
      }
      setHasCheered(readStorage("tds_has_cheered") === true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      showToast("링크를 클립보드에 복사했어요");
    }
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    showToast("이메일 주소를 복사했어요");
  };

  const handleCheer = () => {
    const newCount = cheerCount + (hasCheered ? -1 : 1);
    setCheerCount(newCount);
    setHasCheered(!hasCheered);
    try {
      localStorage.setItem("tds_cheer_count", newCount.toString());
      localStorage.setItem("tds_has_cheered", (!hasCheered).toString());
    } catch {
      // 저장소를 사용할 수 없어도 현재 화면에는 응원을 반영해요.
    }
    if (!hasCheered) {
      showToast("응원해 주셔서 감사해요!");
    }
  };

  if (!user) return <WelcomeScreen />;

  const profile = savedProfile ?? profileFromAccount(user);
  const displayName = profile.displayName || profile.username || "Google 사용자";
  const publicPath = profile.publicUsername ? publicProfilePath(profile.publicUsername) : "";

  async function copyPublicLink() {
    if (!publicPath) return;
    try {
      await navigator.clipboard.writeText(new URL(publicPath, window.location.origin).href);
      showToast("공개 프로필 링크를 복사했어요.");
    } catch {
      showToast("공개 프로필 링크를 복사하지 못했어요.");
    }
  }

  return (
    <div className="min-h-screen bg-tds-grey-100 text-tds-grey-900 font-sans pb-12">
      {/* 1. TDS 상단 앱 바 (TopAppBar) */}
      <header className="sticky top-0 z-30 flex min-h-14 w-full flex-wrap items-center justify-between gap-2 bg-tds-grey-100/90 px-4 py-2 backdrop-blur-md">
        <span className="text-[17px] font-bold text-tds-grey-900 tracking-tight">
          마이링크
        </span>

        <div className="flex min-w-0 flex-wrap items-center gap-2">
          {/* 응원 버튼 (TDS 서브 버튼) */}
          <button
            onClick={handleCheer}
            aria-label="응원하기"
            className={`tds-pressable flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold ${
              hasCheered
                ? "bg-tds-blue-50 text-tds-blue-500"
                : "bg-white text-tds-grey-700 hover:bg-tds-grey-50"
            }`}
          >
            <Heart
              className={`h-4 w-4 ${hasCheered ? "fill-tds-blue-500 text-tds-blue-500" : "text-tds-grey-500"}`}
            />
            <span className="tabular-nums">{cheerCount}</span>
          </button>

          {/* 공유 버튼 */}
          <button
            onClick={handleCopyLink}
            aria-label="링크 복사하기"
            className="tds-pressable flex h-9 w-9 items-center justify-center rounded-full bg-white text-tds-grey-700 hover:bg-tds-grey-50"
          >
            <Share2 className="h-4 w-4" />
          </button>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button type="button" variant="outline" size="sm" aria-label="프로필 메뉴" className="max-w-40 gap-2 rounded-full bg-white">
                <span aria-hidden="true" className="grid size-5 shrink-0 place-items-center rounded-full bg-tds-blue-50 text-xs font-semibold text-tds-blue-600">
                  {Array.from(displayName)[0]}
                </span>
                <span className="truncate">{displayName}</span>
                <ChevronDown aria-hidden="true" className="size-3.5 shrink-0 text-tds-grey-600" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={8}
                collisionPadding={16}
                className="z-50 w-56 max-w-[calc(100vw-2rem)] rounded-2xl border border-tds-grey-200 bg-white p-2 text-sm text-tds-grey-900 shadow-lg"
              >
                <DropdownMenu.Item asChild className={profileMenuItemClass}>
                  <Link href="/mypage"><UserRound aria-hidden="true" className="size-4 text-tds-grey-600" />마이페이지</Link>
                </DropdownMenu.Item>
                {publicPath ? (
                  <DropdownMenu.Item asChild className={profileMenuItemClass}>
                    <a href={publicPath} target="_blank" rel="noopener noreferrer">
                      <ExternalLink aria-hidden="true" className="size-4 text-tds-grey-600" />내 페이지 미리보기
                    </a>
                  </DropdownMenu.Item>
                ) : (
                  <DropdownMenu.Item disabled className={profileMenuItemClass}>
                    <ExternalLink aria-hidden="true" className="size-4 text-tds-grey-600" />내 페이지 미리보기
                  </DropdownMenu.Item>
                )}
                <DropdownMenu.Item disabled={!publicPath} onSelect={() => void copyPublicLink()} className={profileMenuItemClass}>
                  <Copy aria-hidden="true" className="size-4 text-tds-grey-600" />내 페이지 링크 복사
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild className={profileMenuItemClass}>
                  <Link href="/stats"><ChartNoAxesColumnIncreasing aria-hidden="true" className="size-4 text-tds-blue-500" />통계 확인하기</Link>
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="my-1 h-px bg-tds-grey-200" />
                <DropdownMenu.Item disabled={busy} onSelect={() => void logout()} className={profileMenuItemClass}>
                  <LogOut aria-hidden="true" className="size-4 text-tds-grey-600" />로그아웃
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </header>
      {error && <p role="alert" className="mx-auto max-w-lg px-5 py-2 text-sm text-destructive">{error}</p>}

      {/* 2. TDS 토스트 메시지 (TDS Toast) */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 z-50 -translate-x-1/2 flex items-center gap-2.5 rounded-[14px] bg-tds-grey-900 px-5 py-3.5 text-[15px] font-medium text-white shadow-[0_8px_24px_rgba(25,31,40,0.16)] transition-all animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-tds-green-500 text-white">
            <Check className="h-3 w-3 stroke-[3]" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 메인 모바일 셸 컨테이너 */}
      <main className="mx-auto max-w-lg px-6 pt-3">
        {/* 3. 프로필 히어로 카드 (TDS Card) */}
        <section className="rounded-[24px] bg-white p-6 mb-3 shadow-[0_2px_8px_rgba(25,31,40,0.04)]">
          <div className="flex items-start gap-4">
            {/* 아바타 */}
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-tds-blue-50 text-2xl font-bold text-tds-blue-500">
              {profileExtras.avatarUrl && !avatarFailed ? (
                // 브라우저에 저장된 임의의 이미지 URL을 직접 로드해요.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profileExtras.avatarUrl}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={() => setAvatarFailed(true)}
                />
              ) : Array.from(displayName)[0]}
            </div>

            {/* 인적사항 */}
            <div className="flex-1 min-w-0">
              <h1 className="break-words text-[22px] font-bold tracking-tight text-tds-grey-900">
                {displayName}
              </h1>
              {profile.username && (
                <p className="mt-0.5 break-words text-[14px] font-medium text-tds-grey-700">
                  @{profile.username}
                </p>
              )}
            </div>
          </div>

          {profileError && <p role="alert" className="mt-4 break-words text-sm text-destructive">{profileError}</p>}

          {/* 소개글 (TDS 해요체 원칙) */}
          {profile.bio && (
            <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-tds-grey-800">
              {profile.bio}
            </p>
          )}

          {/* 소셜 링크 칩 (TDS Chips) */}
          {profileExtras.socials.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2 pt-4 border-t border-tds-grey-200">
              {profileExtras.socials.map(({ id, platform, url }) => {
                const { icon: Icon, label, color } = SOCIAL_PLATFORMS[platform];
                const content = (
                  <>
                    <Icon className={`h-4 w-4 ${color}`} />
                    <span>{label}</span>
                  </>
                );
                return platform === "email" ? (
                  <button key={id} onClick={() => handleCopyEmail(url)} className={SOCIAL_CHIP_CLASS}>
                    {content}
                  </button>
                ) : (
                  <a key={id} href={url} target="_blank" rel="noopener noreferrer" className={SOCIAL_CHIP_CLASS}>
                    {content}
                  </a>
                );
              })}
            </div>
          )}
        </section>

        {/* 4. TDS 세그먼트 컨트롤 (Segmented Control) */}
        <div className="mb-3 flex rounded-[14px] bg-tds-grey-200/70 p-1">
          <button
            onClick={() => setActiveTab("links")}
            className={`tds-pressable flex-1 rounded-[11px] py-2 text-[14px] ${
              activeTab === "links"
                ? "bg-white font-bold text-tds-grey-900 shadow-[0_1px_2px_rgba(25,31,40,0.06)]"
                : "font-medium text-tds-grey-600 hover:text-tds-grey-900"
            }`}
          >
            링크
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`tds-pressable flex-1 rounded-[11px] py-2 text-[14px] ${
              activeTab === "projects"
                ? "bg-white font-bold text-tds-grey-900 shadow-[0_1px_2px_rgba(25,31,40,0.06)]"
                : "font-medium text-tds-grey-600 hover:text-tds-grey-900"
            }`}
          >
            프로젝트
          </button>
          <button
            onClick={() => setActiveTab("skills")}
            className={`tds-pressable flex-1 rounded-[11px] py-2 text-[14px] ${
              activeTab === "skills"
                ? "bg-white font-bold text-tds-grey-900 shadow-[0_1px_2px_rgba(25,31,40,0.06)]"
                : "font-medium text-tds-grey-600 hover:text-tds-grey-900"
            }`}
          >
            기술 스택
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`tds-pressable flex-1 rounded-[11px] py-2 text-[14px] ${
              activeTab === "about"
                ? "bg-white font-bold text-tds-grey-900 shadow-[0_1px_2px_rgba(25,31,40,0.06)]"
                : "font-medium text-tds-grey-600 hover:text-tds-grey-900"
            }`}
          >
            소개
          </button>
        </div>

        {/* 5. 탭 콘텐츠 영역 */}
        {activeTab === "links" && (
          <SignedInLinks key={user.uid} uid={user.uid} />
        )}

        {/* 탭 2: 프로젝트 (TDS Project Cards) */}
        {activeTab === "projects" && (
          <div className="space-y-3">
            {PROJECTS.map((proj) => (
              <div
                key={proj.id}
                className="rounded-[24px] bg-white p-5 shadow-[0_2px_8px_rgba(25,31,40,0.04)]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-[17px] font-bold text-tds-grey-900">
                      {proj.title}
                    </h3>
                    <p className="mt-0.5 text-[13px] text-tds-grey-500">
                      {proj.role} • {proj.period}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {proj.github && (
                      <a
                        href={proj.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tds-pressable flex h-8 w-8 items-center justify-center rounded-full bg-tds-grey-100 text-tds-grey-700 hover:bg-tds-grey-200"
                        title="GitHub 코드 확인"
                      >
                        <GithubIcon className="h-4 w-4" />
                      </a>
                    )}
                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tds-pressable flex h-8 w-8 items-center justify-center rounded-full bg-tds-blue-50 text-tds-blue-500 hover:bg-[#D5E8FF]"
                        title="데모 보러가기"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>

                <p className="mt-3 text-[14px] leading-relaxed text-tds-grey-700">
                  {proj.description}
                </p>

                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {proj.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-tds-grey-100 px-2.5 py-1 text-[12px] font-medium text-tds-grey-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 탭 3: 기술 스택 (TDS Skills Section) */}
        {activeTab === "skills" && (
          <div className="space-y-3">
            {SKILL_GROUPS.map((group) => (
              <div
                key={group.category}
                className="rounded-[24px] bg-white p-5 shadow-[0_2px_8px_rgba(25,31,40,0.04)]"
              >
                <h3 className="text-[14px] font-bold text-tds-grey-500 mb-3">
                  {group.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-tds-grey-100 px-3.5 py-1.5 text-[13px] font-semibold text-tds-grey-900"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 탭 4: 소개 (TDS About Section - 해요체 원칙) */}
        {activeTab === "about" && (
          <div className="rounded-[24px] bg-white p-6 shadow-[0_2px_8px_rgba(25,31,40,0.04)] space-y-5">
            <div>
              <h3 className="text-[17px] font-bold text-tds-grey-900">
                어떤 개발자인지 소개해요
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-tds-grey-700">
                사용자가 매일 접하는 화면에서 불필요한 번거로움을 덜어내는 일에 큰 보람을 느껴요. 복잡한 시스템일수록 직관적인 화면 뒤로 숨기고, 빠른 반응 속도와 편안한 조작감을 제공하는 것을 중요하게 생각해요.
              </p>
            </div>

            <div className="pt-4 border-t border-tds-grey-200">
              <h4 className="text-[15px] font-bold text-tds-grey-900">
                이렇게 일하고 있어요
              </h4>
              <ul className="mt-2 space-y-2 text-[14px] text-tds-grey-700">
                <li className="flex items-start gap-2">
                  <span className="text-tds-blue-500 font-bold">•</span>
                  <span><strong>사용자 관점 우선</strong>: 기능 중심이 아닌 사용자의 행동 흐름을 먼저 고민해요.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-tds-blue-500 font-bold">•</span>
                  <span><strong>명확하고 읽기 쉬운 코드</strong>: 함께 일하는 동료가 바로 이해할 수 있는 코드를 작성해요.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-tds-blue-500 font-bold">•</span>
                  <span><strong>지속적인 배움과 공유</strong>: 새로운 기술을 익히고 팀과 나누는 과정을 즐겨요.</span>
                </li>
              </ul>
            </div>

            {contactEmail && (
              <div className="rounded-[16px] bg-tds-grey-100 p-4 flex items-center justify-between">
                <div>
                  <div className="text-[14px] font-bold text-tds-grey-900">
                    함께 이야기 나누고 싶으신가요?
                  </div>
                  <div className="text-[12px] text-tds-grey-600">
                    이메일로 문의주시면 빠르게 답변드릴게요.
                  </div>
                </div>
                <button
                  onClick={() => handleCopyEmail(contactEmail)}
                  className="tds-pressable inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[13px] font-semibold text-tds-grey-900 shadow-[0_1px_2px_rgba(25,31,40,0.04)]"
                >
                  <Mail className="h-3.5 w-3.5 text-tds-blue-500" />
                  <span>메일 보내기</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* 푸터 정보 */}
        <footer className="mt-8 text-center text-[13px] text-tds-grey-500 space-y-1">
          <p>© 2026 {displayName}. 모든 권리를 보유해요.</p>
          <p className="text-[11px] text-tds-grey-400">Designed with Toss Design System (TDS)</p>
        </footer>
      </main>

    </div>
  );
}

function SignedInLinks({ uid }: { uid: string }) {
  const { links, loading, linksLoadError } = useUserLinks(uid);

  if (links.length === 0 && !linksLoadError) {
    return loading ? (
      <p role="status" className="px-2 py-4 text-sm text-tds-grey-600">내 링크를 불러오고 있어요.</p>
    ) : (
      <p className="px-2 py-4 text-sm text-tds-grey-600">아직 추가된 링크가 없어요</p>
    );
  }

  const linksById = new Map(links.map((link) => [link.id, link]));

  return (
    <div className="space-y-4">
      {links.length > 0 && (
        <ProfileLinkList
          links={links}
          renderLink={(item) => {
            const link = linksById.get(item.id);
            const card = <ProfileLinkCard key={item.id} item={item} clickCount={link?.clickCount ?? 0} />;
            return link ? (
              <PublicLinkClick key={item.id} ownerUid={uid} linkId={link.documentId}>
                {card}
              </PublicLinkClick>
            ) : card;
          }}
        />
      )}
      {linksLoadError && <p role="alert" className="px-2 text-sm text-destructive">{linksLoadError}</p>}
    </div>
  );
}
