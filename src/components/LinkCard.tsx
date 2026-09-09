"use client";

import { useState } from "react";
import type { Link } from "@/lib/types";

type Props = {
  link: Link;
  initialCount: number;
};

/** 새 탭으로 이동하면서, 같은 클릭에 클릭 수 기록 요청을 함께 보냅니다. */
function recordClick(linkId: string) {
  const body = JSON.stringify({ linkId });

  // sendBeacon은 페이지를 떠나도 전송이 보장되어 이 용도에 가장 알맞습니다.
  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon("/api/clicks", blob)) return;
  }

  void fetch("/api/clicks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    // 집계 실패가 링크 이동을 막아서는 안 됩니다.
  });
}

export default function LinkCard({ link, initialCount }: Props) {
  const [count, setCount] = useState(initialCount);

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        setCount((current) => current + 1); // 낙관적 업데이트
        recordClick(link.id);
      }}
      className="relative flex items-center justify-center rounded-2xl border border-sky-300 bg-sky-100 px-14 py-4 text-sky-950 transition-colors hover:border-sky-400 hover:bg-sky-200 active:bg-sky-300 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-50 dark:hover:border-sky-700 dark:hover:bg-sky-900"
    >
      <span className="truncate text-sm font-medium">{link.label}</span>

      <span className="absolute right-4 text-xs tabular-nums text-sky-700/60 dark:text-sky-300/60">
        {count.toLocaleString("ko-KR")}회
      </span>
    </a>
  );
}
