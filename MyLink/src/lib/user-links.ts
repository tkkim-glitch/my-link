import { collection, Timestamp, type DocumentData, type QueryDocumentSnapshot } from "firebase/firestore";
import { LinkIcon } from "lucide-react";
import type { MainLink } from "@/components/profile/profile-link-list";

export type SavedLink = MainLink & { documentId: string; createdAt: Timestamp | null; clickCount: number };

export async function getSavedLinksCollection(uid: string) {
  const { db, auth } = await import("@/lib/firebase");
  if (auth.currentUser?.uid !== uid) throw new Error("The active account has changed.");
  return collection(db, "users", uid, "links");
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

export function readSavedLink(doc: QueryDocumentSnapshot<DocumentData>): SavedLink[] {
  const { title, url, createdAt, clickCount } = doc.data();
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
    clickCount: typeof clickCount === "number" && Number.isSafeInteger(clickCount) && clickCount >= 0 ? clickCount : 0,
  }];
}
