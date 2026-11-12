"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { useAuth } from "@/components/auth-provider";
import { AddLinkDialog } from "@/components/profile/add-link-dialog";
import { ProfileLinkCard, ProfileLinkList } from "@/components/profile/profile-link-list";
import { LinkStats } from "@/components/profile/link-stats";
import { SavedLinkCard } from "@/components/profile/saved-link-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { profileFromAccount, type ProfileFields, type UserProfile } from "@/lib/user-profile";
import { publicProfilePath } from "@/lib/public-profile-path";
import { useUserLinks } from "@/lib/use-user-links";

const primaryButton =
  "h-12 rounded-[14px] bg-tds-blue-500 px-4 text-[15px] font-semibold text-white hover:bg-tds-blue-600 focus-visible:ring-tds-blue-500/50";

export default function MyPage() {
  const router = useRouter();
  const { user, profile, profileError, loading, canLogin, busy, error, login, logout, saveProfile } = useAuth();

  async function handleLogout() {
    if (await logout()) router.replace("/");
  }

  return (
    <main className="mx-auto w-full max-w-lg space-y-6 px-6 py-8 text-tds-grey-900">
      <Button asChild variant="outline" size="sm">
        <Link href="/">메인으로 돌아가기</Link>
      </Button>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      {loading ? (
        <p role="status" className="text-sm text-tds-grey-600">로그인 상태를 확인하고 있어요.</p>
      ) : user ? (
        <div key={user.uid} className="space-y-6">
          <AccountProfile
            profile={profile ?? profileFromAccount(user)}
            accountName={user.displayName || "Google 사용자"}
            email={user.email ?? user.providerData.find(({ providerId }) => providerId === "google.com")?.email ?? ""}
            busy={busy}
            onLogout={handleLogout}
            onSave={profile ? saveProfile : undefined}
          />
          {profileError && <p role="alert" className="break-words text-sm text-destructive">{profileError}</p>}
          <UserLinkManager uid={user.uid} />
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold tracking-tight">마이페이지</h1>
          <p className="text-tds-grey-700">내 링크를 관리하려면 Google로 로그인해 주세요.</p>
          <Button type="button" className={primaryButton} disabled={!canLogin || busy} onClick={login}>
            Google로 로그인
          </Button>
        </>
      )}
    </main>
  );
}

function AccountProfile({
  profile,
  accountName,
  email,
  busy,
  onLogout,
  onSave,
}: {
  profile: UserProfile;
  accountName: string;
  email: string;
  busy: boolean;
  onLogout: () => Promise<void>;
  onSave?: (fields: ProfileFields) => Promise<void>;
}) {
  const [failedPhoto, setFailedPhoto] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const publicPath = profile.publicUsername ? publicProfilePath(profile.publicUsername) : "";
  const menuItemClass = "flex justify-between gap-2 rounded-lg px-3 py-2 outline-none data-highlighted:bg-tds-grey-100 data-disabled:text-tds-grey-600";

  async function copyPublicLink() {
    if (!publicPath) return;
    try {
      await navigator.clipboard.writeText(new URL(publicPath, window.location.origin).href);
      setCopyStatus("공개 프로필 링크를 복사했어요.");
    } catch {
      setCopyStatus("공개 프로필 링크를 복사하지 못했어요.");
    }
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!onSave || saving) return;
    const data = new FormData(event.currentTarget);
    setSaveError("");
    setSaving(true);
    try {
      await onSave({
        username: String(data.get("username") ?? ""),
        displayName: String(data.get("displayName") ?? ""),
        bio: String(data.get("bio") ?? ""),
      });
      setEditing(false);
      setSaved(true);
    } catch (failure) {
      setSaveError(failure instanceof Error ? failure.message : "프로필을 저장하지 못했어요.");
    } finally {
      setSaving(false);
    }
  }
  const name = profile.displayName || profile.username || "Google 사용자";
  const photo = /^https:\/\//i.test(profile.photoURL) ? profile.photoURL : "";

  return (
    <section aria-label="내 프로필" className="flex flex-wrap items-start gap-4 rounded-[24px] border border-tds-grey-200 bg-white p-5">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            type="button"
            aria-label="계정 메뉴"
            className="tds-pressable size-14 shrink-0 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tds-blue-500"
          >
            {photo && failedPhoto !== photo ? (
              <Image
                src={photo}
                width={56}
                height={56}
                unoptimized
                referrerPolicy="no-referrer"
                alt=""
                className="size-14 shrink-0 rounded-full object-cover"
                onError={() => setFailedPhoto(photo)}
              />
            ) : (
              <span aria-hidden="true" className="grid size-14 shrink-0 place-items-center rounded-full bg-tds-blue-50 text-xl font-bold text-tds-blue-600">
                {Array.from(name)[0]}
              </span>
            )}
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="start"
            sideOffset={8}
            collisionPadding={16}
            className="z-50 w-72 max-w-[calc(100vw-2rem)] rounded-[16px] border border-tds-grey-200 bg-white p-2 text-sm text-tds-grey-900 shadow-lg"
          >
            <DropdownMenu.Label className="px-3 py-2">
              <p className="break-words font-semibold">{accountName}</p>
              {email && <p className="mt-1 break-all text-tds-grey-700">{email}</p>}
            </DropdownMenu.Label>
            <DropdownMenu.Separator className="my-1 h-px bg-tds-grey-200" />
            {publicPath ? (
              <DropdownMenu.Item asChild className={menuItemClass}>
                <a href={publicPath} target="_blank" rel="noopener noreferrer">내 페이지 미리보기</a>
              </DropdownMenu.Item>
            ) : (
              <DropdownMenu.Item disabled className={menuItemClass}>
                <span>내 페이지 미리보기</span>
                <span className="shrink-0 text-xs">프로필 저장 후 이용</span>
              </DropdownMenu.Item>
            )}
            <DropdownMenu.Item
              disabled={!publicPath}
              onSelect={() => void copyPublicLink()}
              className={menuItemClass}
            >
              <span>내 페이지 링크 복사</span>
              {!publicPath && <span className="shrink-0 text-xs">프로필 저장 후 이용</span>}
            </DropdownMenu.Item>
            <DropdownMenu.Separator className="my-1 h-px bg-tds-grey-200" />
            <DropdownMenu.Item asChild className={menuItemClass}>
              <Link href="/stats">통계</Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item
              disabled={busy}
              onSelect={() => { void onLogout(); }}
              className="cursor-pointer rounded-lg px-3 py-2 font-semibold outline-none data-highlighted:bg-tds-grey-100 data-disabled:opacity-50"
            >
              로그아웃
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
      <div className="min-w-0 flex-1 basis-48">
        {editing ? (
          <form noValidate onSubmit={handleSave} aria-busy={saving} className="space-y-3">
            <label className="block space-y-1 text-sm font-semibold">
              <span>공유 주소용 아이디</span>
              <Input name="username" defaultValue={profile.username} readOnly={saving} required autoFocus autoCapitalize="none" spellCheck={false} />
            </label>
            <label className="block space-y-1 text-sm font-semibold">
              <span>표시 이름</span>
              <Input name="displayName" defaultValue={profile.displayName} readOnly={saving} required />
            </label>
            <label className="block space-y-1 text-sm font-semibold">
              <span>소개글</span>
              <textarea
                name="bio"
                defaultValue={profile.bio}
                readOnly={saving}
                rows={3}
                className="w-full resize-y rounded-xl border border-tds-grey-200 px-3 py-2 text-sm font-normal focus-visible:outline-2 focus-visible:outline-tds-blue-500"
              />
            </label>
            <p className="text-sm text-tds-grey-700">공개 주소에는 공유 주소용 아이디가 사용돼요. 이름·소개글·등록한 링크가 공개돼요.</p>
            {saveError && <p role="alert" className="text-sm text-destructive">{saveError}</p>}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" disabled={saving} onClick={() => setEditing(false)}>취소</Button>
              <Button type="submit" disabled={saving} className="bg-tds-blue-500 text-white hover:bg-tds-blue-600">
                {saving ? "저장 중…" : "저장"}
              </Button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="break-words text-lg font-bold">{name}</p>
                {profile.username && <p className="break-words text-sm text-tds-grey-700">@{profile.username}</p>}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="프로필 수정"
                disabled={!onSave}
                onClick={() => {
                  setSaveError("");
                  setSaved(false);
                  setCopyStatus("");
                  setEditing(true);
                }}
              >
                <Pencil aria-hidden="true" />
              </Button>
            </div>
            {profile.bio && <p className="mt-2 whitespace-pre-wrap break-words text-sm text-tds-grey-700">{profile.bio}</p>}
            {copyStatus && <p role="status" className="mt-2 text-sm text-tds-grey-700">{copyStatus}</p>}
            {saved && <p role="status" className="mt-2 text-sm text-tds-green-500">프로필을 저장했어요.</p>}
          </>
        )}
      </div>
    </section>
  );
}

function UserLinkManager({ uid }: { uid: string }) {
  const { links, loading, linksLoadError, saveLink, changeSavedLink } = useUserLinks(uid);
  const linksById = new Map(links.map((link) => [link.id, link]));

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">마이페이지</h1>
          <p className="mt-1 text-sm text-tds-grey-700">내 링크 관리</p>
        </div>
        <AddLinkDialog
          onAdd={saveLink}
          trigger={
            <Button type="button" className={primaryButton}>
              <Plus aria-hidden="true" />
              링크 추가
            </Button>
          }
        />
      </header>

      {linksLoadError && <p role="alert" className="text-sm text-destructive">{linksLoadError}</p>}
      {loading && links.length === 0 && (
        <p role="status" className="text-sm text-tds-grey-600">내 링크를 불러오고 있어요.</p>
      )}
      {(links.length > 0 || (!loading && !linksLoadError)) && (
        <ProfileLinkList
          links={links}
          heading="등록한 링크"
          renderLink={(link) => {
            const savedLink = linksById.get(link.id);
            if (!savedLink) return <ProfileLinkCard key={link.id} item={link} />;
            return (
              <SavedLinkCard
                key={link.id}
                link={savedLink}
                clickCount={savedLink.clickCount}
                onSave={(values) => changeSavedLink(savedLink, values)}
                onDelete={() => changeSavedLink(savedLink)}
              />
            );
          }}
        />
      )}
      {(!loading && !linksLoadError || links.length > 0) && <LinkStats links={links} />}
    </>
  );
}
