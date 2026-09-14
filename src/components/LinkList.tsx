"use client";

import { useCallback, useEffect, useState } from "react";
import LinkCard from "@/components/LinkCard";
import type { ClickCounts, Link } from "@/lib/types";

type Props = {
  links: Link[];
};

export default function LinkList({ links }: Props) {
  // 서버에서 받아온 값과 이 페이지에서 방금 발생한 클릭을 따로 둡니다.
  // 합쳐 두면 조회 응답이 늦게 도착했을 때 낙관적 +1이 덮여 사라집니다.
  const [fetched, setFetched] = useState<ClickCounts>({});
  const [added, setAdded] = useState<ClickCounts>({});

  // 페이지가 열릴 때 모든 링크의 클릭 수를 한 번에 가져옵니다.
  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/clicks", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`조회 실패: ${response.status}`);
        return response.json() as Promise<{ counts?: ClickCounts }>;
      })
      .then((data) => setFetched(data.counts ?? {}))
      .catch(() => {
        // 조회에 실패하면 0회 표시를 그대로 둡니다. 링크 이동에는 영향이 없습니다.
      });

    return () => controller.abort();
  }, []);

  const handleClicked = useCallback((linkId: string) => {
    setAdded((current) => ({ ...current, [linkId]: (current[linkId] ?? 0) + 1 }));
  }, []);

  return (
    <nav aria-label="링크 목록" className="flex flex-col gap-3.5">
      {links.map((link) => (
        <LinkCard
          key={link.id}
          link={link}
          count={(fetched[link.id] ?? 0) + (added[link.id] ?? 0)}
          onClicked={handleClicked}
        />
      ))}
    </nav>
  );
}
