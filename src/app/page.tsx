import LinkList from "@/components/LinkList";
import ProfileHeader from "@/components/ProfileHeader";
import { links, profile } from "@/data/profile";
import { getClickCounts } from "@/lib/clicks";

// 클릭 수는 항상 최신이어야 하므로 요청마다 렌더링합니다.
export const dynamic = "force-dynamic";

export default async function Home() {
  const counts = await getClickCounts();

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col px-6 py-14 sm:py-20">
      <ProfileHeader profile={profile} />

      <div className="mt-10">
        <LinkList links={links} counts={counts} />
      </div>

      <footer className="mt-auto pt-12 text-center text-xs text-zinc-400 dark:text-zinc-600">
        🌳 링크나무로 만들었습니다
      </footer>
    </main>
  );
}
