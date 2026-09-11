import type { Link, Profile } from "@/lib/types";

// TODO: 아래는 전부 보여주기용 더미 값입니다. 실제 정보로 교체하세요.
export const profile: Profile = {
  name: "임명호",
  bio: "공인회계사 | 요즘은 클로드코드에 관심이 많아요.",
  avatarUrl: "/profile.jpg", // public/ 에 사진을 넣고 경로만 바꾸면 됩니다
};

export const links: Link[] = [
  { id: "github", label: "GitHub", url: "https://github.com" },
  { id: "band", label: "네이버 밴드", url: "https://band.us" },
  { id: "facebook", label: "Facebook", url: "https://facebook.com" },
  { id: "instagram", label: "Instagram", url: "https://instagram.com" },
  { id: "email", label: "📫 이메일", url: "mailto:litewind@naver.com" },
];

/** 외부에서 들어온 linkId가 실제 존재하는 링크인지 검증합니다. */
export function isKnownLinkId(linkId: string): boolean {
  return links.some((link) => link.id === linkId);
}
