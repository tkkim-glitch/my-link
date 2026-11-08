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
          Frontend & Software Developer
        </p>

        {/* 소개글 */}
        <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          기술을 통해 일상의 문제를 해결하고 가치 있는 사용자 경험을 만드는 개발자입니다. 새로운 기술을 탐구하고 코드로 구현해 나가는 과정을 즐깁니다.
        </p>

        {/* 심플한 구분선 및 태그 */}
        <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap justify-center gap-2">
          <span className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">
            #WebDeveloper
          </span>
          <span className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">
            #Frontend
          </span>
          <span className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">
            #Nextjs
          </span>
          <span className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">
            #CleanCode
          </span>
        </div>
      </div>
    </main>
  );
}
