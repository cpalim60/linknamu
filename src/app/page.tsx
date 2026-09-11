import LinkList from "@/components/LinkList";
import ProfileHeader from "@/components/ProfileHeader";
import { links, profile } from "@/data/profile";
import { getClickCounts } from "@/lib/clicks";

// 클릭 수는 항상 최신이어야 하므로 요청마다 렌더링합니다.
export const dynamic = "force-dynamic";

export default async function Home() {
  const counts = await getClickCounts();

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col px-7 py-16 sm:px-8 sm:py-24">
      <ProfileHeader profile={profile} />

      <div className="mt-12">
        <LinkList links={links} counts={counts} />
      </div>

      <footer className="mt-auto pt-16 text-center text-xs text-[var(--muted)]/75">
        🌳 링크나무로 만들었습니다
      </footer>
    </main>
  );
}
