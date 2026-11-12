"use client";

import type { MouseEvent, ReactNode } from "react";

type ClickOwner = { username: string; ownerUid?: never } | { ownerUid: string; username?: never };

export function PublicLinkClick({ username, ownerUid, linkId, children }: ClickOwner & {
  linkId: string;
  children: ReactNode;
}) {
  function track(event: MouseEvent<HTMLDivElement>) {
    if (event.defaultPrevented || ![0, 1].includes(event.button)) return;
    if (!(event.target instanceof Element) || !event.target.closest("a[href]")) return;

    void fetch("/api/public-link-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, ownerUid, linkId }),
      keepalive: true,
    }).then((response) => {
      if (!response.ok) console.warn("[public-link-click] Request failed", response.status);
    }).catch((error) => console.warn("[public-link-click] Request failed", error));
  }

  return <div onClick={track} onAuxClick={track}>{children}</div>;
}
