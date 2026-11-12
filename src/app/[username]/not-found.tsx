import Link from "next/link";

export default function PublicProfileNotFound() {
  return (
    <main className="mx-auto max-w-lg space-y-4 px-6 py-16 text-tds-grey-900">
      <h1 className="text-2xl font-bold">404 · 공개 프로필을 찾을 수 없어요</h1>
      <Link href="/" className="text-sm font-semibold text-tds-blue-600">메인으로 돌아가기</Link>
    </main>
  );
}
