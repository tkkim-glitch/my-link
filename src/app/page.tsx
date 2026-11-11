"use client";

import { useState, useEffect, useRef } from "react";
import { FirebaseError } from "firebase/app";
import { addDoc, collection, deleteDoc, doc, onSnapshot, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import {
  Mail,
  Globe,
  FileText,
  Coffee,
  Check,
  Heart,
  Share2,
  BookOpen,
  FolderGit2,
  ExternalLink,
  Copy,
  Camera,
  Music2,
  Play,
  AtSign,
  LinkIcon,
} from "lucide-react";
import { AddLinkDialog } from "@/components/profile/add-link-dialog";
import { SavedLinkCard } from "@/components/profile/saved-link-card";
import { ProfileLinkCard, ProfileLinkList, type LinkBlock, type MainLink } from "@/components/profile/profile-link-list";
import { Button } from "@/components/ui/button";
import mockLinks from "@/data/mock-links.json";

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
type PublicProfile = { displayName: string; bio: string; avatarUrl: string; socials: Social[] };

const DEFAULT_PROFILE: PublicProfile = {
  displayName: "김태경",
  bio: "기술을 통해 일상의 불편을 줄이고, 누구에게나 당연하고 편리한 사용자 경험을 설계해요. 가독성과 확장성을 갖춘 단단한 코드를 지향해요.",
  avatarUrl: "",
  socials: [
    { id: "github", platform: "github", url: "https://github.com" },
    { id: "linkedin", platform: "linkedin", url: "https://linkedin.com" },
    { id: "blog", platform: "blog", url: "https://velog.io" },
    { id: "email", platform: "email", url: "contact.taekyung@example.com" },
  ],
};

const LINK_ICONS = { Globe, BookOpen, FolderGit2, FileText, Coffee, ExternalLink, Mail };
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

function readProfile(): PublicProfile {
  const data = readStorage("mylink_profile_data");
  if (!isRecord(data) || typeof data.displayName !== "string" || !data.displayName.trim() ||
      typeof data.bio !== "string" || !Array.isArray(data.socials)) {
    return DEFAULT_PROFILE;
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
    displayName: data.displayName.trim(),
    bio: data.bio,
    avatarUrl: data.avatarUrl ? webUrl(data.avatarUrl, window.location.origin) : "",
    socials,
  };
}

function parseLinks(data: unknown[]): LinkBlock[] | null {
  const blocks = data.flatMap((item: unknown): { order: number; enabled: boolean; block: LinkBlock }[] => {
    if (!isRecord(item) || typeof item.id !== "string" || typeof item.title !== "string" ||
        !item.title.trim() || typeof item.enabled !== "boolean" ||
        typeof item.order !== "number" || !Number.isFinite(item.order)) return [];

    const { id, title, order, enabled, type, iconName, url, subtitle, badge } = item;
    if (type === "header") return [{ order, enabled, block: { id, title, type } }];
    const isExternal = item.isExternal !== false;
    const href = !isExternal && typeof url === "string" && url.startsWith("#") ? url : webUrl(url);
    if (type !== "link" || (enabled && !href)) return [];

    const icon = typeof iconName === "string" && Object.hasOwn(LINK_ICONS, iconName)
      ? LINK_ICONS[iconName as keyof typeof LINK_ICONS]
      : Globe;
    const emoji = typeof iconName === "string" && /\p{Extended_Pictographic}/u.test(iconName)
      ? iconName
      : undefined;
    return [{
      order,
      enabled,
      block: {
        id,
        title,
        href,
        icon,
        emoji,
        isExternal,
        subtitle: typeof subtitle === "string" ? subtitle : undefined,
        badge: typeof badge === "string" ? badge : undefined,
      },
    }];
  });

  if (data.length > 0 && blocks.length === 0) return null;
  return blocks.filter(({ enabled }) => enabled)
    .sort((a, b) => a.order - b.order)
    .map(({ block }) => block);
}

type SavedLink = MainLink & { documentId: string; createdAt: Timestamp | null };

async function getSavedLinksCollection() {
  const { db } = await import("@/lib/firebase");
  return collection(db, "users", "anonymous", "links");
}

function newestLinkFirst(a: SavedLink, b: SavedLink) {
  if (!a.createdAt) return b.createdAt ? 1 : a.id.localeCompare(b.id);
  if (!b.createdAt) return -1;
  return b.createdAt.seconds - a.createdAt.seconds ||
    b.createdAt.nanoseconds - a.createdAt.nanoseconds ||
    a.id.localeCompare(b.id);
}

const DEFAULT_LINKS = parseLinks(mockLinks) ?? [];

function readLinks(): LinkBlock[] {
  const saved = readStorage("mylink_links_data");
  return Array.isArray(saved) ? parseLinks(saved) ?? DEFAULT_LINKS : DEFAULT_LINKS;
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
  const [activeTab, setActiveTab] = useState<TabType>("links");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [cheerCount, setCheerCount] = useState<number>(142);
  const [hasCheered, setHasCheered] = useState<boolean>(false);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [links, setLinks] = useState<LinkBlock[]>(DEFAULT_LINKS);
  const [savedLinks, setSavedLinks] = useState<SavedLink[]>([]);
  const [addedLinks, setAddedLinks] = useState<SavedLink[]>([]);
  const pendingLinkChanges = useRef(new Set<string>());
  const [linksLoadError, setLinksLoadError] = useState("");
  const [avatarFailed, setAvatarFailed] = useState(false);

  async function saveLink(link: MainLink) {
    try {
      const doc = await addDoc(await getSavedLinksCollection(), {
        title: link.title,
        url: link.href,
        createdAt: serverTimestamp(),
      });
      setAddedLinks((current) => [...current, {
        ...link,
        id: `firestore-${doc.id}`,
        documentId: doc.id,
        createdAt: Timestamp.now(),
      }]);
    } catch (error) {
      if (error instanceof FirebaseError && error.code === "permission-denied") {
        throw new Error("Firestore에 링크를 저장할 권한이 없어요.");
      }
      throw new Error("링크를 저장하지 못했어요. 다시 시도해 주세요.");
    }
  }

  async function changeSavedLink(link: SavedLink, values?: { title: string; url: string }) {
    const pending = pendingLinkChanges.current;
    if (pending.has(link.documentId)) return;
    pending.add(link.documentId);
    try {
      const reference = doc(await getSavedLinksCollection(), link.documentId);
      if (values) {
        await updateDoc(reference, values);
        const update = (item: SavedLink) => item.documentId === link.documentId
          ? { ...item, title: values.title, href: values.url, subtitle: values.url }
          : item;
        setSavedLinks((current) => current.map(update));
        setAddedLinks((current) => current.map(update));
      } else {
        const keep = (item: SavedLink) => item.documentId !== link.documentId;
        await deleteDoc(reference);
        setSavedLinks((current) => current.filter(keep));
        setAddedLinks((current) => current.filter(keep));
      }
    } catch (error) {
      const action = values ? "수정" : "삭제";
      if (error instanceof FirebaseError && error.code === "permission-denied") {
        throw new Error("이 링크를 " + action + "할 권한이 없어요.");
      }
      throw new Error("링크를 " + action + "하지 못했어요. 다시 시도해 주세요.");
    } finally {
      pending.delete(link.documentId);
    }
  }

  // The snapshot replaces the local estimate for any document it has already received.
  const savedLinksById = new Map(addedLinks.map((link) => [link.id, link]));
  for (const link of savedLinks) savedLinksById.set(link.id, link);
  const sortedSavedLinks = [...savedLinksById.values()].sort(newestLinkFirst);

  useEffect(() => {
    let disposed = false;
    let unsubscribe: (() => void) | undefined;

    function showLoadError(error: unknown) {
      if (disposed) return;
      setLinksLoadError(error instanceof FirebaseError && error.code === "permission-denied"
        ? "저장된 링크를 불러올 권한이 없어요."
        : "저장된 링크를 불러오지 못했어요. 새로고침 후 다시 시도해 주세요.");
    }

    void getSavedLinksCollection().then((linksCollection) => {
      if (disposed) return;

      unsubscribe = onSnapshot(linksCollection, { includeMetadataChanges: true }, (snapshot) => {
        // Read the whole collection so older documents without createdAt are included.
        const pending = new Set(pendingLinkChanges.current);
        const items = snapshot.docs.flatMap((doc): SavedLink[] => {
          if (doc.metadata.hasPendingWrites || pending.has(doc.id)) return [];
          const { title, url, createdAt } = doc.data();
          const href = webUrl(url);
          if (typeof title !== "string" || !title.trim() || !href) return [];
          return [{
            id: `firestore-${doc.id}`,
            documentId: doc.id,
            title: title.trim(),
            href,
            subtitle: href,
            icon: LinkIcon,
            isExternal: true,
            createdAt: createdAt instanceof Timestamp ? createdAt : null,
          }];
        });

        // Local delete events omit the document, so keep its last confirmed value too.
        setSavedLinks((current) => [
          ...items,
          ...current.filter((item) => pending.has(item.documentId)),
        ]);
        const confirmedIds = new Set(items.map((item) => item.documentId));
        setAddedLinks((current) => current.filter((item) => !confirmedIds.has(item.documentId)));
      }, showLoadError);
    }).catch(showLoadError);

    return () => {
      disposed = true;
      unsubscribe?.();
    };
  }, []);

  const contactEmail = profile.socials.find(({ platform }) => platform === "email")?.url;
  const coffeeLink = links.find((item): item is MainLink => "href" in item && item.id === "coffee");

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setProfile(readProfile());
      setLinks(readLinks());

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

  return (
    <div className="min-h-screen bg-tds-grey-100 text-tds-grey-900 font-sans pb-28">
      {/* 1. TDS 상단 앱 바 (TopAppBar) */}
      <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between bg-tds-grey-100/90 px-5 backdrop-blur-md">
        <span className="text-[17px] font-bold text-tds-grey-900 tracking-tight">
          마이링크
        </span>

        <div className="flex items-center gap-2">
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
        </div>
      </header>

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
              {profile.avatarUrl && !avatarFailed ? (
                // 브라우저에 저장된 임의의 이미지 URL을 직접 로드해요.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatarUrl}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={() => setAvatarFailed(true)}
                />
              ) : Array.from(profile.displayName)[0]}
            </div>

            {/* 인적사항 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-[22px] font-bold text-tds-grey-900 tracking-tight">
                  {profile.displayName}
                </h1>
                {profile === DEFAULT_PROFILE && (
                  <span className="inline-flex items-center rounded-full bg-tds-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-tds-blue-500">
                    개발자
                  </span>
                )}
              </div>
              {profile === DEFAULT_PROFILE && (
                <p className="mt-0.5 text-[14px] font-medium text-tds-grey-700">
                  Frontend & Software Engineer
                </p>
              )}
            </div>
          </div>

          {/* 소개글 (TDS 해요체 원칙) */}
          {profile.bio && (
            <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-tds-grey-800">
              {profile.bio}
            </p>
          )}

          {/* 소셜 링크 칩 (TDS Chips) */}
          {profile.socials.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2 pt-4 border-t border-tds-grey-200">
              {profile.socials.map(({ id, platform, url }) => {
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
          <div className="space-y-4">
            <ProfileLinkList
              links={[...links, ...sortedSavedLinks]}
              renderLink={(link) => {
                const savedLink = "documentId" in link ? savedLinksById.get(link.id) : undefined;
                if (!savedLink) return <ProfileLinkCard key={link.id} item={link} />;
                return (
                  <SavedLinkCard
                    key={link.id}
                    link={savedLink}
                    onSave={(values) => changeSavedLink(savedLink, values)}
                    onDelete={() => changeSavedLink(savedLink)}
                  />
                );
              }}
            />
            {linksLoadError && <p role="alert" className="px-2 text-sm text-destructive">{linksLoadError}</p>}
            <AddLinkDialog
              onAdd={saveLink}
              trigger={
                <Button
                  type="button"
                  variant="secondary"
                  className="h-12 w-full rounded-[14px] border-tds-grey-200 bg-tds-grey-100 text-[15px] font-semibold text-tds-grey-900 hover:bg-tds-grey-200 focus-visible:ring-tds-blue-500/50"
                >
                  + 링크 추가
                </Button>
              }
            />
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
          <p>© 2026 {profile.displayName}. 모든 권리를 보유해요.</p>
          <p className="text-[11px] text-tds-grey-400">Designed with Toss Design System (TDS)</p>
        </footer>
      </main>

      {/* 6. TDS 하단 고정 액션 버튼 (BottomCTA) */}
      {coffeeLink && (
        <div className="fixed bottom-0 left-0 right-0 z-20 pointer-events-none">
          {/* 보호 그라디언트 (TDS 24~32px white/grey-100 → transparent) */}
          <div className="h-8 w-full bg-gradient-to-t from-tds-grey-100 to-transparent" />
          <div className="bg-tds-grey-100 px-4 pb-4 pt-1 pointer-events-auto">
            <div className="mx-auto max-w-lg">
              <a
                href={coffeeLink.href}
                target={coffeeLink.isExternal ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="tds-pressable flex h-14 w-full items-center justify-center rounded-2xl bg-tds-blue-500 hover:bg-tds-blue-600 text-[17px] font-bold text-white shadow-[0_4px_12px_rgba(49,130,246,0.24)]"
              >
                {coffeeLink.title}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
