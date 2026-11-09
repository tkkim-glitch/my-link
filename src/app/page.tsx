"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Globe,
  FileText,
  Coffee,
  Check,
  Heart,
  Share2,
  ChevronRight,
  BookOpen,
  FolderGit2,
  ExternalLink,
  Copy,
} from "lucide-react";

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

interface MainLink {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  icon: typeof Globe;
  badge?: string;
  isExternal?: boolean;
}

const MAIN_LINKS: MainLink[] = [
  {
    id: "portfolio",
    title: "개인 포트폴리오",
    subtitle: "진행한 프로젝트와 인터랙티브 데모를 모아두었어요",
    href: "https://example.com/portfolio",
    icon: Globe,
    badge: "추천",
    isExternal: true,
  },
  {
    id: "blog",
    title: "기술 블로그",
    subtitle: "프론트엔드 개발 과정과 기술적인 고민을 기록해요",
    href: "https://velog.io",
    icon: BookOpen,
    badge: "최신글",
    isExternal: true,
  },
  {
    id: "github",
    title: "깃허브 저장소",
    subtitle: "오픈소스 기여 및 사이드 프로젝트 코드를 확인해 보세요",
    href: "https://github.com",
    icon: FolderGit2,
    isExternal: true,
  },
  {
    id: "resume",
    title: "이력서 열람하기",
    subtitle: "경력 사항과 상세 프로젝트 성과를 정리해 두었어요",
    href: "#",
    icon: FileText,
  },
  {
    id: "coffee",
    title: "1:1 커피챗 신청하기",
    subtitle: "커리어 고민이나 가벼운 기술 이야기 모두 환영해요",
    href: "https://calendly.com",
    icon: Coffee,
    badge: "열려있음",
    isExternal: true,
  },
];

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
  const [activeTab, setActiveTab] = useState<TabType>("links");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [cheerCount, setCheerCount] = useState<number>(142);
  const [hasCheered, setHasCheered] = useState<boolean>(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const saved = localStorage.getItem("tds_cheer_count");
      if (saved) {
        setCheerCount(parseInt(saved, 10));
      }
      const cheered = localStorage.getItem("tds_has_cheered");
      if (cheered) {
        setHasCheered(cheered === "true");
      }
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

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("contact.taekyung@example.com");
    showToast("이메일 주소를 복사했어요");
  };

  const handleCheer = () => {
    const newCount = cheerCount + (hasCheered ? -1 : 1);
    setCheerCount(newCount);
    setHasCheered(!hasCheered);
    localStorage.setItem("tds_cheer_count", newCount.toString());
    localStorage.setItem("tds_has_cheered", (!hasCheered).toString());
    if (!hasCheered) {
      showToast("응원해 주셔서 감사해요!");
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F4F6] text-[#191F28] font-sans pb-28">
      {/* 1. TDS 상단 앱 바 (TopAppBar) */}
      <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between bg-[#F2F4F6]/90 px-5 backdrop-blur-md">
        <span className="text-[17px] font-bold text-[#191F28] tracking-tight">
          마이링크
        </span>

        <div className="flex items-center gap-2">
          {/* 응원 버튼 (TDS 서브 버튼) */}
          <button
            onClick={handleCheer}
            aria-label="응원하기"
            className={`tds-pressable flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold transition-colors ${
              hasCheered
                ? "bg-[#E8F3FF] text-[#3182F6]"
                : "bg-white text-[#4E5968] hover:bg-[#F9FAFB]"
            }`}
          >
            <Heart
              className={`h-4 w-4 ${hasCheered ? "fill-[#3182F6] text-[#3182F6]" : "text-[#8B95A1]"}`}
            />
            <span className="tabular-nums">{cheerCount}</span>
          </button>

          {/* 공유 버튼 */}
          <button
            onClick={handleCopyLink}
            aria-label="링크 복사하기"
            className="tds-pressable flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#4E5968] hover:bg-[#F9FAFB]"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* 2. TDS 토스트 메시지 (TDS Toast) */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 z-50 -translate-x-1/2 flex items-center gap-2.5 rounded-[14px] bg-[#191F28] px-5 py-3.5 text-[15px] font-medium text-white shadow-[0_8px_24px_rgba(25,31,40,0.16)] transition-all animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#03B26C] text-white">
            <Check className="h-3 w-3 stroke-[3]" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 메인 모바일 셸 컨테이너 */}
      <main className="mx-auto max-w-lg px-4 pt-3">
        {/* 3. 프로필 히어로 카드 (TDS Card) */}
        <section className="rounded-[24px] bg-white p-6 mb-3 shadow-[0_2px_8px_rgba(25,31,40,0.04)]">
          <div className="flex items-start gap-4">
            {/* 아바타 */}
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#E8F3FF] text-2xl font-bold text-[#3182F6]">
              김
            </div>

            {/* 인적사항 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-[22px] font-bold text-[#191F28] tracking-tight">
                  김태경
                </h1>
                <span className="inline-flex items-center rounded-full bg-[#E8F3FF] px-2.5 py-0.5 text-[11px] font-semibold text-[#3182F6]">
                  개발자
                </span>
              </div>
              <p className="mt-0.5 text-[14px] font-medium text-[#4E5968]">
                Frontend & Software Engineer
              </p>
            </div>
          </div>

          {/* 소개글 (TDS 해요체 원칙) */}
          <p className="mt-4 text-[15px] leading-relaxed text-[#333D4B]">
            기술을 통해 일상의 불편을 줄이고, 누구에게나 당연하고 편리한 사용자 경험을 설계해요. 가독성과 확장성을 갖춘 단단한 코드를 지향해요.
          </p>

          {/* 소셜 링크 칩 (TDS Chips) */}
          <div className="mt-5 flex flex-wrap gap-2 pt-4 border-t border-[#E5E8EB]">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="tds-pressable inline-flex h-[34px] items-center gap-1.5 rounded-full bg-[#F2F4F6] px-3.5 text-[13px] font-medium text-[#333D4B] hover:bg-[#E5E8EB]"
            >
              <GithubIcon className="h-4 w-4" />
              <span>GitHub</span>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="tds-pressable inline-flex h-[34px] items-center gap-1.5 rounded-full bg-[#F2F4F6] px-3.5 text-[13px] font-medium text-[#333D4B] hover:bg-[#E5E8EB]"
            >
              <LinkedinIcon className="h-4 w-4 text-[#3182F6]" />
              <span>LinkedIn</span>
            </a>
            <a
              href="https://velog.io"
              target="_blank"
              rel="noopener noreferrer"
              className="tds-pressable inline-flex h-[34px] items-center gap-1.5 rounded-full bg-[#F2F4F6] px-3.5 text-[13px] font-medium text-[#333D4B] hover:bg-[#E5E8EB]"
            >
              <BookOpen className="h-4 w-4 text-[#03B26C]" />
              <span>블로그</span>
            </a>
            <button
              onClick={handleCopyEmail}
              className="tds-pressable inline-flex h-[34px] items-center gap-1.5 rounded-full bg-[#F2F4F6] px-3.5 text-[13px] font-medium text-[#333D4B] hover:bg-[#E5E8EB]"
            >
              <Copy className="h-4 w-4 text-[#6B7684]" />
              <span>이메일 복사</span>
            </button>
          </div>
        </section>

        {/* 4. TDS 세그먼트 컨트롤 (Segmented Control) */}
        <div className="mb-3 flex rounded-[14px] bg-[#E5E8EB]/70 p-1">
          <button
            onClick={() => setActiveTab("links")}
            className={`tds-pressable flex-1 rounded-[11px] py-2 text-[14px] transition-all ${
              activeTab === "links"
                ? "bg-white font-bold text-[#191F28] shadow-[0_1px_2px_rgba(25,31,40,0.06)]"
                : "font-medium text-[#6B7684] hover:text-[#191F28]"
            }`}
          >
            링크
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`tds-pressable flex-1 rounded-[11px] py-2 text-[14px] transition-all ${
              activeTab === "projects"
                ? "bg-white font-bold text-[#191F28] shadow-[0_1px_2px_rgba(25,31,40,0.06)]"
                : "font-medium text-[#6B7684] hover:text-[#191F28]"
            }`}
          >
            프로젝트
          </button>
          <button
            onClick={() => setActiveTab("skills")}
            className={`tds-pressable flex-1 rounded-[11px] py-2 text-[14px] transition-all ${
              activeTab === "skills"
                ? "bg-white font-bold text-[#191F28] shadow-[0_1px_2px_rgba(25,31,40,0.06)]"
                : "font-medium text-[#6B7684] hover:text-[#191F28]"
            }`}
          >
            기술 스택
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`tds-pressable flex-1 rounded-[11px] py-2 text-[14px] transition-all ${
              activeTab === "about"
                ? "bg-white font-bold text-[#191F28] shadow-[0_1px_2px_rgba(25,31,40,0.06)]"
                : "font-medium text-[#6B7684] hover:text-[#191F28]"
            }`}
          >
            소개
          </button>
        </div>

        {/* 5. 탭 콘텐츠 영역 */}
        {/* 탭 1: 링크 (TDS ListRow Card) */}
        {activeTab === "links" && (
          <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_2px_8px_rgba(25,31,40,0.04)]">
            <div className="px-5 py-3.5 border-b border-[#E5E8EB]">
              <span className="text-[13px] font-semibold text-[#8B95A1]">
                주요 바로가기
              </span>
            </div>

            <div className="divide-y divide-[#E5E8EB]">
              {MAIN_LINKS.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    target={item.isExternal ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="tds-pressable flex items-center justify-between px-5 py-4 hover:bg-[#F9FAFB] transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#F2F4F6] text-[#3182F6]">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[16px] font-semibold text-[#191F28] truncate">
                            {item.title}
                          </span>
                          {item.badge && (
                            <span className="rounded-full bg-[#E8F3FF] px-2 py-0.5 text-[11px] font-semibold text-[#3182F6]">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-[13px] text-[#6B7684] truncate">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="h-5 w-5 shrink-0 text-[#B0B8C1]" />
                  </a>
                );
              })}
            </div>
          </div>
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
                    <h3 className="text-[17px] font-bold text-[#191F28]">
                      {proj.title}
                    </h3>
                    <p className="mt-0.5 text-[13px] text-[#8B95A1]">
                      {proj.role} • {proj.period}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {proj.github && (
                      <a
                        href={proj.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tds-pressable flex h-8 w-8 items-center justify-center rounded-full bg-[#F2F4F6] text-[#4E5968] hover:bg-[#E5E8EB]"
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
                        className="tds-pressable flex h-8 w-8 items-center justify-center rounded-full bg-[#E8F3FF] text-[#3182F6] hover:bg-[#D5E8FF]"
                        title="데모 보러가기"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>

                <p className="mt-3 text-[14px] leading-relaxed text-[#4E5968]">
                  {proj.description}
                </p>

                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {proj.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#F2F4F6] px-2.5 py-1 text-[12px] font-medium text-[#4E5968]"
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
                <h3 className="text-[14px] font-bold text-[#8B95A1] mb-3">
                  {group.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-[#F2F4F6] px-3.5 py-1.5 text-[13px] font-semibold text-[#191F28]"
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
              <h3 className="text-[17px] font-bold text-[#191F28]">
                어떤 개발자인지 소개해요
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[#4E5968]">
                사용자가 매일 접하는 화면에서 불필요한 번거로움을 덜어내는 일에 큰 보람을 느껴요. 복잡한 시스템일수록 직관적인 화면 뒤로 숨기고, 빠른 반응 속도와 편안한 조작감을 제공하는 것을 중요하게 생각해요.
              </p>
            </div>

            <div className="pt-4 border-t border-[#E5E8EB]">
              <h4 className="text-[15px] font-bold text-[#191F28]">
                이렇게 일하고 있어요
              </h4>
              <ul className="mt-2 space-y-2 text-[14px] text-[#4E5968]">
                <li className="flex items-start gap-2">
                  <span className="text-[#3182F6] font-bold">•</span>
                  <span><strong>사용자 관점 우선</strong>: 기능 중심이 아닌 사용자의 행동 흐름을 먼저 고민해요.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3182F6] font-bold">•</span>
                  <span><strong>명확하고 읽기 쉬운 코드</strong>: 함께 일하는 동료가 바로 이해할 수 있는 코드를 작성해요.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3182F6] font-bold">•</span>
                  <span><strong>지속적인 배움과 공유</strong>: 새로운 기술을 익히고 팀과 나누는 과정을 즐겨요.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-[16px] bg-[#F2F4F6] p-4 flex items-center justify-between">
              <div>
                <div className="text-[14px] font-bold text-[#191F28]">
                  함께 이야기 나누고 싶으신가요?
                </div>
                <div className="text-[12px] text-[#6B7684]">
                  이메일로 문의주시면 빠르게 답변드릴게요.
                </div>
              </div>
              <button
                onClick={handleCopyEmail}
                className="tds-pressable inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[13px] font-semibold text-[#191F28] shadow-[0_1px_2px_rgba(25,31,40,0.04)]"
              >
                <Mail className="h-3.5 w-3.5 text-[#3182F6]" />
                <span>메일 보내기</span>
              </button>
            </div>
          </div>
        )}

        {/* 푸터 정보 */}
        <footer className="mt-8 text-center text-[13px] text-[#8B95A1] space-y-1">
          <p>© 2026 김태경. 모든 권리를 보유해요.</p>
          <p className="text-[11px] text-[#B0B8C1]">Designed with Toss Design System (TDS)</p>
        </footer>
      </main>

      {/* 6. TDS 하단 고정 액션 버튼 (BottomCTA) */}
      <div className="fixed bottom-0 left-0 right-0 z-20 pointer-events-none">
        {/* 보호 그라디언트 (TDS 24~32px white/grey-100 → transparent) */}
        <div className="h-8 w-full bg-gradient-to-t from-[#F2F4F6] to-transparent" />
        <div className="bg-[#F2F4F6] px-4 pb-4 pt-1 pointer-events-auto">
          <div className="mx-auto max-w-lg">
            <a
              href="https://calendly.com"
              target="_blank"
              rel="noopener noreferrer"
              className="tds-pressable flex h-14 w-full items-center justify-center rounded-2xl bg-[#3182F6] hover:bg-[#1B64DA] text-[17px] font-bold text-white shadow-[0_4px_12px_rgba(49,130,246,0.24)]"
            >
              1:1 커피챗 신청하기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
