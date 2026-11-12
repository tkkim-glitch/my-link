"use client";

import { useState, type FormEvent } from "react";
import { ProfileLinkCard, type MainLink } from "@/components/profile/profile-link-list";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { readLinkForm } from "@/lib/link-form";

export function SavedLinkCard({
  link,
  clickCount,
  onSave,
  onDelete,
}: {
  link: MainLink;
  clickCount: number;
  onSave: (values: { title: string; url: string }) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);
  const [editError, setEditError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setEditError("");
    const values = readLinkForm(event.currentTarget);
    if (!values) return;
    setPending(true);
    try {
      await onSave(values);
      setEditing(false);
    } catch (error) {
      setEditError(error instanceof Error ? error.message : "링크를 수정하지 못했어요.");
    } finally {
      setPending(false);
    }
  }

  async function remove() {
    if (pending) return;
    setDeleteError("");
    setPending(true);
    try {
      await onDelete();
      setConfirming(false);
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "링크를 삭제하지 못했어요.");
    } finally {
      setPending(false);
    }
  }

  return (
    <ProfileLinkCard item={link}>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <span className="mr-auto text-sm text-tds-grey-700 tabular-nums">클릭 {clickCount.toLocaleString("ko-KR")}회</span>
        <Button type="button" variant="outline" size="sm" disabled={pending || editing} onClick={() => {
          setEditError("");
          setEditing(true);
        }}>
          수정
        </Button>
        <Dialog open={confirming} onOpenChange={(open) => {
          if (pending) return;
          setDeleteError("");
          setConfirming(open);
        }}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" size="sm" disabled={pending} className="text-destructive">
              삭제
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>정말 삭제하시겠습니까?</DialogTitle>
              <DialogDescription asChild>
                <div className="space-y-2">
                  <p className="break-all font-medium text-tds-grey-900">{link.title}</p>
                  <p>이 작업은 되돌릴 수 없습니다</p>
                </div>
              </DialogDescription>
            </DialogHeader>
            {deleteError && <p role="alert" className="text-sm text-destructive">{deleteError}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" disabled={pending} onClick={() => setConfirming(false)}>
                취소
              </Button>
              <Button type="button" variant="destructive" disabled={pending} onClick={remove}>
                {pending ? "삭제 중…" : "삭제하기"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {editing && (
        <form noValidate onSubmit={save} aria-busy={pending} className="space-y-3 border-t border-tds-grey-200 pt-3">
          <label className="block space-y-1.5 text-sm font-semibold">
            <span>제목</span>
            <Input name="title" defaultValue={link.title} required readOnly={pending} autoFocus />
          </label>
          <label className="block space-y-1.5 text-sm font-semibold">
            <span>URL</span>
            <Input name="url" type="url" defaultValue={link.href} required readOnly={pending} />
          </label>
          {editError && <p role="alert" className="text-sm text-destructive">{editError}</p>}
          <div className="flex flex-wrap justify-end gap-2">
            <Button type="button" variant="outline" disabled={pending} onClick={() => setEditing(false)}>
              취소
            </Button>
            <Button type="submit" disabled={pending} className="bg-tds-blue-500 text-white hover:bg-tds-blue-600">
              {pending ? "저장 중…" : "저장"}
            </Button>
          </div>
        </form>
      )}
    </ProfileLinkCard>
  );
}
