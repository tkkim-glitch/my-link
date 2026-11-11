"use client";

import { useState, type FormEvent, type ReactElement } from "react";
import { LinkIcon } from "lucide-react";

import type { MainLink } from "@/components/profile/profile-link-list";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { readLinkForm } from "@/lib/link-form";

const primaryButton =
  "h-12 rounded-[14px] bg-tds-blue-500 px-4 text-[15px] font-semibold text-white hover:bg-tds-blue-600 focus-visible:ring-tds-blue-500/50";
const inputStyle =
  "h-12 rounded-xl border-tds-grey-200 bg-tds-grey-100 px-4 text-base placeholder:text-tds-grey-600 focus-visible:border-tds-blue-500 focus-visible:ring-tds-blue-500/20";

export function AddLinkDialog({
  trigger,
  onAdd,
}: {
  trigger: ReactElement;
  onAdd: (link: MainLink) => void | Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  function handleOpenChange(nextOpen: boolean) {
    if (saving) return;
    setSaveError("");
    setOpen(nextOpen);
  }

  async function handleAddLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setSaveError("");
    const form = event.currentTarget;
    const link = readLinkForm(form);
    if (!link) return;

    setSaving(true);
    try {
      await onAdd({
        id: "new-" + crypto.getRandomValues(new Uint32Array(4)).join("-"),
        title: link.title,
        href: link.url,
        subtitle: link.url,
        icon: LinkIcon,
        isExternal: true,
      });
      form.reset();
      setOpen(false);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "링크를 저장하지 못했어요. 다시 시도해 주세요.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-[20px] bg-white p-6 text-tds-grey-900 shadow-[0_12px_32px_rgba(25,31,40,0.14)] ring-0">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">링크 추가</DialogTitle>
          <DialogDescription className="text-[15px] text-tds-grey-700">
            목록에 표시할 제목과 이동할 주소를 입력해 주세요.
          </DialogDescription>
        </DialogHeader>

        <form noValidate onSubmit={handleAddLink} aria-busy={saving} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="link-title" className="block text-sm font-semibold">제목</label>
            <Input id="link-title" name="title" placeholder="링크 제목 입력" required readOnly={saving} className={inputStyle} />
          </div>
          <div className="space-y-2">
            <label htmlFor="link-url" className="block text-sm font-semibold">주소</label>
            <Input id="link-url" name="url" type="url" placeholder="https://..." required readOnly={saving} className={inputStyle} />
          </div>
          {saveError && <p role="alert" className="text-sm text-destructive">{saveError}</p>}
          <Button type="submit" disabled={saving} className={`${primaryButton} w-full`}>
            {saving ? "저장 중…" : "추가"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
