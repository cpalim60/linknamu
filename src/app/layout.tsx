import type { Metadata } from "next";
import { profile } from "@/data/profile";
import "./globals.css";

export const metadata: Metadata = {
  title: `${profile.name} | 링크나무`,
  description: profile.bio,
  openGraph: {
    title: `${profile.name} | 링크나무`,
    description: profile.bio,
    type: "profile",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        {/* Pretendard: 한글·라틴을 함께 덮는 둥근 산세리프. 동적 서브셋이라 필요한 글자만 받아옵니다.
            globals.css 의 @import 는 Tailwind 가 펼쳐지며 뒤로 밀려 쓸 수 없어 link 로 싣습니다. */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css"
        />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
