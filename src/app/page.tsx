import LinkList from "@/components/LinkList";
import ProfileHeader from "@/components/ProfileHeader";
import { links, profile } from "@/data/profile";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col px-7 py-16 sm:px-8 sm:py-24">
      <ProfileHeader profile={profile} />

      <div className="mt-12">
        {/* 클릭 수는 LinkList 가 브라우저에서 /api/clicks 로 한 번에 받아옵니다.
            그래서 이 페이지 자체는 정적으로 렌더링되고, 첫 화면에는 0회가 보입니다. */}
        <LinkList links={links} />
      </div>

      <footer className="mt-auto pt-16 text-center text-xs text-[var(--muted)]/75">
        🌳 링크나무로 만들었습니다
      </footer>
    </main>
  );
}
