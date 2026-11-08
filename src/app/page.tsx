export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-zinc-50 to-zinc-100 text-zinc-900 dark:from-zinc-950 dark:to-zinc-900 dark:text-zinc-100">
      <div className="w-full max-w-md rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur border border-zinc-200/80 dark:border-zinc-800 p-8 shadow-xl shadow-zinc-200/40 dark:shadow-none text-center">
        {/* 아바타 / 프로필 아이콘 */}
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-3xl font-bold text-white shadow-md shadow-blue-500/20">
          김
        </div>

        {/* 이름 */}
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          김태경
        </h1>

        {/* 직함 / 태그 */}
        <p className="mt-1 text-sm font-medium text-blue-600 dark:text-blue-400">
          Student & Developer
        </p>

        {/* 소개글 */}
        <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          안녕하세요! 바이브 코딩을 배우고 있는 대학생입니다.
        </p>

        {/* 심플한 구분선 및 태그 */}
        <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap justify-center gap-2">
          <span className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">
            #바이브코딩
          </span>
          <span className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">
            #대학생
          </span>
          <span className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">
            #Nextjs
          </span>
        </div>
      </div>
    </main>
  );
}
