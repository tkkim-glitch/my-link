import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { LinkIcon } from "lucide-react";
import { collection, doc, getDoc, getDocs, getFirestore, Timestamp } from "firebase/firestore/lite";
import { PublicLinkClick } from "@/components/profile/public-link-click";
import { ProfileLinkCard, ProfileLinkList, type MainLink } from "@/components/profile/profile-link-list";
import { app } from "@/lib/firebase";
import { publicUsername } from "@/lib/public-profile-path";

function safeLink(value: unknown) {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

type PublicProfileParams = { params: Promise<{ username: string }> };

export default function PublicProfilePage({ params }: PublicProfileParams) {
  return (
    <Suspense fallback={<p role="status" className="mx-auto max-w-lg px-5 py-8 text-sm text-tds-grey-700">공개 프로필을 불러오고 있어요.</p>}>
      <PublicProfileContent params={params} />
    </Suspense>
  );
}

async function PublicProfileContent({ params }: PublicProfileParams) {
  const { username } = await params;
  const key = publicUsername(username);
  if (!key) notFound();

  const db = getFirestore(app);
  const profile = (await getDoc(doc(db, "publicProfilesByUsername", key))).data();
  if (!profile || typeof profile.uid !== "string" || !profile.uid || typeof profile.displayName !== "string" || typeof profile.username !== "string" || profile.username.toLowerCase() !== key) notFound();

  const snapshot = await getDocs(collection(db, "users", profile.uid, "links"));
  const entries = snapshot.docs.flatMap((item): { link: MainLink; createdAt: number }[] => {
    const { title, url, createdAt } = item.data();
    const href = safeLink(url);
    if (typeof title !== "string" || !title.trim() || !href) return [];
    return [{
      link: { id: item.id, title: title.trim(), href, subtitle: href, icon: LinkIcon, isExternal: true },
      createdAt: createdAt instanceof Timestamp ? createdAt.toMillis() : -Infinity,
    }];
  });
  const links = entries.sort((a, b) => b.createdAt - a.createdAt || a.link.id.localeCompare(b.link.id)).map(({ link }) => link);

  return (
    <main className="min-h-screen bg-tds-grey-100 px-5 py-8 text-tds-grey-900">
      <div className="mx-auto max-w-lg space-y-6">
        <Link href="/" className="text-sm font-semibold text-tds-blue-600">MyLink</Link>
        <section className="rounded-[24px] border border-tds-grey-200 bg-white p-6">
          <h1 className="break-words text-[28px] font-bold">{profile.displayName || profile.username}</h1>
          <p className="mt-1 text-sm text-tds-grey-700">@{profile.username}</p>
          {typeof profile.bio === "string" && profile.bio && (
            <p className="mt-3 whitespace-pre-wrap break-words text-[15px] leading-relaxed text-tds-grey-700">{profile.bio}</p>
          )}
        </section>
        <ProfileLinkList
          links={links}
          renderLink={(link) => (
            <PublicLinkClick key={link.id} username={key} linkId={link.id}>
              <ProfileLinkCard item={link} />
            </PublicLinkClick>
          )}
        />
      </div>
    </main>
  );
}
