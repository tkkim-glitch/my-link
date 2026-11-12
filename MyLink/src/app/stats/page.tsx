"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { onSnapshot, orderBy, query } from "firebase/firestore";
import { useAuth } from "@/components/auth-provider";
import { LinkStats } from "@/components/profile/link-stats";
import { Button } from "@/components/ui/button";
import { getSavedLinksCollection, readSavedLink, type SavedLink } from "@/lib/user-links";

export default function StatsPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) router.replace("/");
  }, [loading, user, router]);

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 px-5 py-8 sm:px-8 text-tds-grey-900">
      {user ? <AccountStats key={user.uid} uid={user.uid} isPublished={Boolean(profile?.publicUsername)} /> : (
        <p role="status" className="text-sm text-tds-grey-700">
          {loading ? "로그인 상태를 확인하고 있어요." : "로그인 화면으로 이동하고 있어요."}
        </p>
      )}
    </main>
  );
}

function AccountStats({ uid, isPublished }: { uid: string; isPublished: boolean }) {
  const [ordered, setOrdered] = useState<SavedLink[] | null>(null);
  const [all, setAll] = useState<SavedLink[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let disposed = false;
    const unsubscribes: (() => void)[] = [];

    function showError() {
      if (!disposed) setError(true);
    }

    void getSavedLinksCollection(uid).then((links) => {
      if (disposed) return;
      unsubscribes.push(onSnapshot(query(links, orderBy("clickCount", "desc")), { includeMetadataChanges: true }, (snapshot) => {
        if (!disposed && !snapshot.metadata.fromCache) setOrdered(snapshot.docs.flatMap(readSavedLink));
      }, showError));
      // Firestore orderBy omits documents without the field; read them from the full collection.
      unsubscribes.push(onSnapshot(links, { includeMetadataChanges: true }, (snapshot) => {
        if (!disposed && !snapshot.metadata.fromCache) setAll(snapshot.docs.flatMap(readSavedLink));
      }, showError));
    }).catch(showError);

    return () => {
      disposed = true;
      unsubscribes.forEach((unsubscribe) => unsubscribe());
    };
  }, [uid]);

  const allById = new Map((all ?? []).map((link) => [link.id, link]));
  const links = (ordered ?? []).flatMap((link) => {
    const current = allById.get(link.id);
    if (!current) return [];
    allById.delete(link.id);
    return [current];
  });
  links.push(...allById.values());

  return (
    <>
      <Button asChild variant="outline" size="sm"><Link href="/mypage">마이페이지로 돌아가기</Link></Button>
      <h1 className="text-[28px] font-bold tracking-tight">통계 대시보드</h1>
      {error ? (
        <p role="alert" className="text-sm text-destructive">링크 통계를 불러오지 못했어요.</p>
      ) : ordered && all ? (
        <LinkStats links={links} activeLinkCount={isPublished ? links.length : 0} />
      ) : (
        <p role="status" className="text-sm text-tds-grey-700">링크 통계를 불러오고 있어요.</p>
      )}
    </>
  );
}
