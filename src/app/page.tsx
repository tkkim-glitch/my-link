"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Globe,
  FileText,
  Coffee,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Heart,
  Share2,
  Code2,
  Layers,
  User,
  FolderGit2,
  ChevronRight,
  BookOpen,
  MapPin,
  Briefcase,
  Terminal,
} from "lucide-react";

function GithubIcon({ className = "h-4 w-4" }: { className?: string }) {
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

function LinkedinIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.77v8.37H6.46v-8.37M7.84 6.88a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24" />
    </svg>
  );
}

type TabType = "links" | "projects" | "skills" | "about";

interface LinkItem {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: typeof Globe;
  badge?: string;
  badgeColor?: string;
  gradient: string;
}

interface ProjectItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  role: string;
  period: string;
  link?: string;
  github?: string;
  featured?: boolean;
}

const SOCIAL_LINKS = [
  {
    name: "GitHub",
    href: "https://github.com",
    icon: GithubIcon,
    color: "hover:text-zinc-900 dark:hover:text-white hover:border-zinc-400",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: LinkedinIcon,
    color: "hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400",
  },
  {
    name: "Tech Blog",
    href: "https://velog.io",
    icon: BookOpen,
    color: "hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-400",
  },
  {
    name: "Email",
    href: "mailto:contact.taekyung@example.com",
    icon: Mail,
    color: "hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-400",
  },
];

const MAIN_LINKS: LinkItem[] = [
  {
    id: "portfolio",
    title: "개인 포트폴리오 웹사이트",
    description: "진행한 프로젝트 상세 정보와 인터랙티브 데모 살펴보기",
    href: "https://example.com/portfolio",
    icon: Globe,
    badge: "Featured",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    gradient: "from-blue-500/20 to-indigo-500/20 text-blue-600 dark:text-blue-400",
  },
  {
    id: "blog",
    title: "기술 블로그 & 개발 아티클",
    description: "트러블슈팅, 최신 프론트엔드 아키텍처 및 개발 회고록",
    href: "https://velog.io",
    icon: BookOpen,
    badge: "Updated",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    gradient: "from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "github",
    title: "GitHub 오픈소스 프로젝트",
    description: "공개 저장소, 라이브러리 및 사이드 프로젝트 코드 확인",
    href: "https://github.com",
    icon: FolderGit2,
    gradient: "from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400",
  },
  {
    id: "coffee",
    title: "1:1 커피챗 & 멘토링 신청",
    description: "기술 이야기, 커리어 고민, 가벼운 커피챗 언제든 환영합니다",
    href: "https://calendly.com",
    icon: Coffee,
    badge: "Open",
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    gradient: "from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400",
  },
  {
    id: "resume",
    title: "이력서 열람 및 다운로드",
    description: "경력 사항, 핵심 역량 및 주요 성과가 정리된 노션 이력서",
    href: "#",
    icon: FileText,
    gradient: "from-cyan-500/20 to-blue-500/20 text-cyan-600 dark:text-cyan-400",
  },
];

const PROJECTS: ProjectItem[] = [
  {
    id: "mylink",
    title: "MyLink (마이링크)",
    description:
      "자신만의 프로필과 포트폴리오 링크를 감각적인 인터페이스로 공유하는 올인원 링크 허브 플랫폼입니다.",
    tags: ["Next.js 16", "React 19", "Tailwind CSS v4", "TypeScript"],
    role: "Frontend Lead",
    period: "2026",
    link: "https://example.com",
    github: "https://github.com",
    featured: true,
  },
  {
    id: "devpulse",
    title: "DevPulse - 개발 트렌드 큐레이션",
    description:
      "국내외 최신 기술 뉴스, 깃허브 트렌딩 레포지토리 및 기술 블로그 아티클을 실시간 요약하여 제공합니다.",
    tags: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    role: "Fullstack",
    period: "2025 - 2026",
    link: "https://example.com",
    github: "https://github.com",
    featured: false,
  },
  {
    id: "flowboard",
    title: "FlowBoard - 실시간 협업 칸반",
    description:
      "WebSocket 기반의 부드러운 드래그 앤 드롭 및 실시간 동기화를 지원하는 팀 생산성 도구입니다.",
    tags: ["React", "Zustand", "Tailwind CSS", "Socket.io"],
    role: "Frontend Developer",
    period: "2025",
    link: "https://example.com",
    github: "https://github.com",
    featured: false,
  },
];

const SKILL_CATEGORIES = [
  {
    title: "Frontend",
    skills: [
      { name: "React 19", level: "Advanced" },
      { name: "Next.js 16", level: "Advanced" },
      { name: "TypeScript", level: "Advanced" },
      { name: "Tailwind CSS", level: "Advanced" },
      { name: "Zustand / Redux", level: "Proficient" },
      { name: "TanStack Query", level: "Proficient" },
    ],
  },
  {
    title: "Backend & Database",
    skills: [
      { name: "Node.js", level: "Proficient" },
      { name: "Express / NestJS", level: "Intermediate" },
      { name: "PostgreSQL", level: "Intermediate" },
      { name: "Supabase / Firebase", level: "Proficient" },
      { name: "RESTful API", level: "Advanced" },
    ],
  },
  {
    title: "Tools & DevOps",
    skills: [
      { name: "Git & GitHub Actions", level: "Advanced" },
      { name: "Vercel / AWS", level: "Proficient" },
      { name: "Docker", level: "Intermediate" },
      { name: "Figma", level: "Proficient" },
    ],
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("links");
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [cheerCount, setCheerCount] = useState<number>(128);
  const [hasCheered, setHasCheered] = useState<boolean>(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const saved = localStorage.getItem("mylink_cheer_count");
      if (saved) {
        setCheerCount(parseInt(saved, 10));
      }
      const cheered = localStorage.getItem("mylink_has_cheered");
      if (cheered) {
        setHasCheered(cheered === "true");
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedText("프로필 링크가 복사되었습니다!");
      setTimeout(() => setCopiedText(null), 2500);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("contact.taekyung@example.com");
    setCopiedText("이메일 주소가 복사되었습니다!");
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handleCheer = () => {
    const newCount = cheerCount + (hasCheered ? -1 : 1);
    setCheerCount(newCount);
    setHasCheered(!hasCheered);
    localStorage.setItem("mylink_cheer_count", newCount.toString());
    localStorage.setItem("mylink_has_cheered", (!hasCheered).toString());
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-zinc-50 text-zinc-900 selection:bg-indigo-500 selection:text-white dark:bg-zinc-950 dark:text-zinc-100 font-sans transition-colors duration-300">
      {/* 배경 앰비언트 글로우 이펙트 */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-500/15 blur-3xl dark:bg-indigo-600/10" />
        <div className="absolute top-1/4 -right-32 h-96 w-96 rounded-full bg-violet-500/15 blur-3xl dark:bg-violet-600/10" />
        <div className="absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl dark:bg-cyan-600/10" />
      </div>

      {/* 복사 알림 토스트 */}
      {copiedText && (
        <div className="fixed top-6 left-1/2 z-50 -translate-x-1/2 flex items-center gap-2 rounded-full bg-zinc-900/90 dark:bg-white/90 px-4 py-2.5 text-sm font-medium text-white dark:text-zinc-900 shadow-xl backdrop-blur-md transition-all animate-bounce">
          <Check className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />
          <span>{copiedText}</span>
        </div>
      )}

      {/* 메인 컨테이너 */}
      <div className="relative z-10 mx-auto max-w-xl px-4 py-10 sm:px-6 sm:py-16">
        {/* 상단 퀵 액션 바 */}
        <div className="mb-6 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span>커피챗 & 새로운 기회 환영</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyLink}
              title="프로필 링크 복사"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200/80 bg-white/80 text-zinc-600 shadow-xs backdrop-blur-md transition-all hover:scale-105 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={handleCheer}
              title="응원하기"
              className={`flex items-center gap-1.5 rounded-full border px-3 h-9 text-xs font-semibold backdrop-blur-md transition-all hover:scale-105 ${
                hasCheered
                  ? "border-rose-400/40 bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
                  : "border-zinc-200/80 bg-white/80 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-400 hover:text-rose-500"
              }`}
            >
              <Heart
                className={`h-3.5 w-3.5 transition-transform ${
                  hasCheered ? "fill-rose-500 text-rose-500 scale-110" : ""
                }`}
              />
              <span>{cheerCount}</span>
            </button>
          </div>
        </div>

        {/* 프로필 메인 카드 */}
        <div className="relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/70 p-6 sm:p-8 shadow-xl shadow-zinc-200/50 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/70 dark:shadow-none">
          {/* 장식용 상단 그라데이션 라인 */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />

          {/* 프로필 헤더 */}
          <div className="flex flex-col items-center text-center">
            {/* 아바타 */}
            <div className="relative mb-4 group">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-violet-500 opacity-70 blur-xs transition-all duration-300 group-hover:opacity-100 group-hover:blur-sm" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-3xl font-extrabold text-white shadow-lg ring-4 ring-white dark:ring-zinc-900">
                <span>김</span>
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-white ring-2 ring-white dark:ring-zinc-900 shadow-sm" title="인증된 프로필">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* 이름 및 직함 */}
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
                  김태경
                </h1>
                <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  Dev
                </span>
              </div>
              <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                Frontend & Software Developer
              </p>
            </div>

            {/* 위치 및 주요 정보 */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                Seoul, South Korea
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5" />
                3+ Years Exp
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Terminal className="h-3.5 w-3.5" />
                Web & Mobile
              </span>
            </div>

            {/* 한 줄 소개 */}
            <p className="mt-4 max-w-md text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
              기술을 통해 복잡한 문제를 단순하게 풀고, 사용자에게 깊은 몰입과 편안함을 선사하는 유려한 디지털 경험을 설계합니다.
            </p>

            {/* 소셜 아이콘 바 */}
            <div className="mt-6 flex items-center justify-center gap-2">
              {SOCIAL_LINKS.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.name}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200/80 bg-zinc-50/80 text-zinc-600 shadow-xs backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-800/80 dark:text-zinc-400 ${item.color}`}
                  >
                    <IconComponent className="h-4 w-4" />
                  </a>
                );
              })}
              <button
                onClick={handleCopyEmail}
                title="이메일 복사"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200/80 bg-zinc-50/80 text-zinc-600 shadow-xs backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-800/80 dark:text-zinc-400 dark:hover:text-white"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* 탭 네비게이션 */}
          <div className="mt-8 flex rounded-xl bg-zinc-100/80 p-1 border border-zinc-200/60 dark:bg-zinc-800/60 dark:border-zinc-800">
            <button
              onClick={() => setActiveTab("links")}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all duration-200 ${
                activeTab === "links"
                  ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              <Globe className="h-3.5 w-3.5" />
              <span>링크</span>
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all duration-200 ${
                activeTab === "projects"
                  ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>프로젝트</span>
            </button>
            <button
              onClick={() => setActiveTab("skills")}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all duration-200 ${
                activeTab === "skills"
                  ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>스킬</span>
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all duration-200 ${
                activeTab === "about"
                  ? "bg-white text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-white"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              <User className="h-3.5 w-3.5" />
              <span>소개</span>
            </button>
          </div>

          {/* 탭 콘텐츠 영역 */}
          <div className="mt-6">
            {/* 1. 링크 탭 */}
            {activeTab === "links" && (
              <div className="flex flex-col gap-3">
                {MAIN_LINKS.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.id}
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/60 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-400/80 hover:bg-white hover:shadow-md hover:shadow-indigo-500/5 dark:border-zinc-800 dark:bg-zinc-800/40 dark:hover:border-indigo-500/50 dark:hover:bg-zinc-800/90"
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr ${link.gradient} shadow-xs transition-transform duration-300 group-hover:scale-105`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {link.title}
                            </span>
                            {link.badge && (
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${link.badgeColor}`}
                              >
                                {link.badge}
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                            {link.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 shrink-0 text-zinc-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                    </a>
                  );
                })}
              </div>
            )}

            {/* 2. 프로젝트 탭 */}
            {activeTab === "projects" && (
              <div className="flex flex-col gap-3.5">
                {PROJECTS.map((proj) => (
                  <div
                    key={proj.id}
                    className="relative rounded-2xl border border-zinc-200/80 bg-white/60 p-5 transition-all duration-300 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-800/40 dark:hover:border-zinc-700"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-zinc-900 dark:text-zinc-100">
                            {proj.title}
                          </h3>
                          {proj.featured && (
                            <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-600 border border-indigo-500/20 dark:text-indigo-400">
                              메인 프로젝트
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                          {proj.role} • {proj.period}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {proj.github && (
                          <a
                            href={proj.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200/80 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-700"
                            title="GitHub 저장소"
                          >
                            <GithubIcon className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {proj.link && (
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200/80 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-700"
                            title="라이브 데모"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                      {proj.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {proj.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 3. 스킬 탭 */}
            {activeTab === "skills" && (
              <div className="flex flex-col gap-4">
                {SKILL_CATEGORIES.map((cat) => (
                  <div
                    key={cat.title}
                    className="rounded-2xl border border-zinc-200/80 bg-white/60 p-4 dark:border-zinc-800 dark:bg-zinc-800/40"
                  >
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">
                      {cat.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {cat.skills.map((skill) => (
                        <div
                          key={skill.name}
                          className="flex items-center gap-1.5 rounded-lg border border-zinc-200/70 bg-zinc-50/80 px-2.5 py-1 text-xs dark:border-zinc-700/60 dark:bg-zinc-800/80"
                        >
                          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                            {skill.name}
                          </span>
                          <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                            • {skill.level}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4. 소개 탭 */}
            {activeTab === "about" && (
              <div className="rounded-2xl border border-zinc-200/80 bg-white/60 p-5 space-y-4 dark:border-zinc-800 dark:bg-zinc-800/40">
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                    💡 개발 가치관 & 관심사
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                    단순히 동작하는 코드를 넘어, <strong>유지보수하기 쉽고 명확한 구조</strong>를 지향합니다.
                    사용자가 기술의 복잡성을 느끼지 않도록 부드러운 인터랙션과 완성도 높은 디자인 시스템을 구축하는 것에 큰 매력을 느낍니다.
                  </p>
                </div>

                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3">
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                    🎯 목표 및 방향성
                  </h3>
                  <ul className="mt-2 space-y-1.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 list-disc list-inside">
                    <li>확장 가능한 컴포넌트 주도 아키텍처 (CDD) 설계</li>
                    <li>웹 성능 최적화 및 Core Web Vitals 개선</li>
                    <li>팀원들과 투명하게 공유하고 함께 성장하는 엔지니어링 문화</li>
                  </ul>
                </div>

                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3 flex items-center justify-between">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    함께 일하고 싶거나 질문이 있으신가요?
                  </span>
                  <button
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-xs transition-all hover:bg-indigo-700"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span>이메일 문의</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 하단 태그 */}
          <div className="mt-8 border-t border-zinc-100 pt-5 dark:border-zinc-800 flex flex-wrap justify-center gap-1.5">
            {["#Frontend", "#Nextjs", "#TypeScript", "#CleanCode", "#UIUX"].map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-zinc-100/90 px-2.5 py-1 text-[11px] font-medium text-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 푸터 */}
        <footer className="mt-8 text-center text-xs text-zinc-400 dark:text-zinc-600 space-y-1">
          <p>© 2026 김태경. All rights reserved.</p>
          <p className="font-mono text-[11px]">Crafted with Next.js 16 & Tailwind CSS</p>
        </footer>
      </div>
    </div>
  );
}

