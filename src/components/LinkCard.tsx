"use client";

import { useEffect, useRef, useState } from "react";
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

/** mailto: 링크에서 이메일 주소만 꺼냅니다. 그 외 링크는 null. */
function mailAddressOf(url: string): string | null {
  if (!url.startsWith("mailto:")) return null;
  const address = decodeURIComponent(url.slice("mailto:".length).split("?")[0]);
  return address || null;
}

export default function LinkCard({ link, initialCount }: Props) {
  const [count, setCount] = useState(initialCount);
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
    },
    [],
  );

  const mailAddress = mailAddressOf(link.url);
  // mailto: 는 메일 앱을 열 뿐이라 새 탭을 만들면 빈 탭만 남습니다.
  const opensNewTab = mailAddress === null;

  /** 기본 메일 앱이 없으면 mailto: 는 조용히 아무 일도 하지 않습니다. 주소만이라도 남겨 둡니다. */
  function copyMailAddress(address: string) {
    if (!navigator.clipboard) return;

    navigator.clipboard
      .writeText(address)
      .then(() => {
        setCopied(true);
        if (copiedTimer.current) clearTimeout(copiedTimer.current);
        copiedTimer.current = setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        // 복사가 막혀도 mailto: 이동 자체는 그대로 진행됩니다.
      });
  }

  return (
    <a
      href={link.url}
      target={opensNewTab ? "_blank" : undefined}
      rel={opensNewTab ? "noopener noreferrer" : undefined}
      onClick={() => {
        setCount((current) => current + 1); // 낙관적 업데이트
        recordClick(link.id);
        if (mailAddress) copyMailAddress(mailAddress);
      }}
      className="relative flex items-center justify-center rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] px-14 py-4.5 shadow-[var(--card-shadow)] backdrop-blur-md transition duration-200 ease-out hover:-translate-y-px hover:bg-[var(--card-bg-hover)] hover:shadow-[var(--card-shadow-hover)] active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <span className="truncate text-sm font-medium">{link.label}</span>

      <span
        aria-live="polite"
        className="absolute right-5 text-xs tabular-nums text-[var(--muted)]/80"
      >
        {copied ? "주소 복사됨" : `${count.toLocaleString("ko-KR")}회`}
      </span>
    </a>
  );
}
