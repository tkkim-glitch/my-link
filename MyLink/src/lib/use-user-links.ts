"use client";

import { useEffect, useRef, useState } from "react";
import { FirebaseError } from "firebase/app";
import { addDoc, deleteDoc, doc, onSnapshot, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import { getSavedLinksCollection, readSavedLink, type SavedLink } from "@/lib/user-links";
import type { MainLink } from "@/components/profile/profile-link-list";

function newestLinkFirst(a: SavedLink, b: SavedLink) {
  if (!a.createdAt) return b.createdAt ? 1 : a.id.localeCompare(b.id);
  if (!b.createdAt) return -1;
  return b.createdAt.seconds - a.createdAt.seconds ||
    b.createdAt.nanoseconds - a.createdAt.nanoseconds ||
    a.id.localeCompare(b.id);
}

export function useUserLinks(uid: string) {
  const [savedLinks, setSavedLinks] = useState<SavedLink[]>([]);
  const [addedLinks, setAddedLinks] = useState<SavedLink[]>([]);
  const pendingLinkChanges = useRef(new Set<string>());
  const [linksLoadError, setLinksLoadError] = useState("");
  const [loading, setLoading] = useState(true);

  async function saveLink(link: MainLink) {
    try {
      const doc = await addDoc(await getSavedLinksCollection(uid), {
        title: link.title,
        url: link.href,
        createdAt: serverTimestamp(),
      });
      setAddedLinks((current) => [...current, {
        ...link,
        id: `firestore-${doc.id}`,
        documentId: doc.id,
        createdAt: Timestamp.now(),
        clickCount: 0,
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
      const reference = doc(await getSavedLinksCollection(uid), link.documentId);
      if (values) {
        await updateDoc(reference, { ...values, updatedAt: serverTimestamp() });
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
      setLoading(false);
      setLinksLoadError(error instanceof FirebaseError && error.code === "permission-denied"
        ? "저장된 링크를 불러올 권한이 없어요."
        : "저장된 링크를 불러오지 못했어요. 새로고침 후 다시 시도해 주세요.");
    }

    void getSavedLinksCollection(uid).then((linksCollection) => {
      if (disposed) return;

      unsubscribe = onSnapshot(linksCollection, { includeMetadataChanges: true }, (snapshot) => {
        if (disposed) return;
        if (!snapshot.metadata.fromCache) setLoading(false);
        // Read the whole collection so older documents without createdAt are included.
        const pending = new Set(pendingLinkChanges.current);
        const items = snapshot.docs.flatMap((doc): SavedLink[] => {
          if (doc.metadata.hasPendingWrites || pending.has(doc.id)) return [];
          return readSavedLink(doc);
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
  }, [uid]);

  return { links: sortedSavedLinks, loading, linksLoadError, saveLink, changeSavedLink };
}
