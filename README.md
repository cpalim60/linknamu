# 링크나무 🌳

내 모든 링크를 한 페이지에 모아두고, 하나의 URL로 공유하는 Link in Bio 서비스입니다.

## 기능

- **프로필** — 이름, 한 줄 소개, 프로필 사진 표시
- **링크 카드** — 링크를 카드 형태로 나열, 새 탭으로 열림
- **클릭 수 집계** — 링크별 클릭 횟수를 MongoDB에 기록하고 카드에 표시
- 모바일 우선 반응형 + 다크 모드

## 시작하기

```bash
npm install
cp .env.example .env.local   # MONGODB_URI 채우기 (선택)
npm run dev
```

http://localhost:3000 에서 확인할 수 있습니다.

### 환경 변수

| 변수 | 설명 |
| --- | --- |
| `MONGODB_URI` | MongoDB Atlas 연결 문자열. 비워두면 클릭 수가 서버 메모리에만 저장되어 재시작 시 초기화됩니다. |
| `MONGODB_DB` | 사용할 DB 이름 (기본값 `linknamu`) |

`.env.local`은 절대 커밋하지 마세요.

## 내 정보로 바꾸기

`src/data/profile.ts` 한 파일만 수정하면 됩니다.

```ts
export const profile: Profile = {
  name: "임명호",
  bio: "세계 최강 바이브코더",
  avatarUrl: "/avatar.svg", // public/ 에 이미지를 넣고 경로를 지정
};

export const links: Link[] = [
  { id: "github", label: "GitHub", url: "https://github.com/...", icon: "🐙" },
];
```

`id`는 클릭 수 집계의 키이므로, 한번 정한 뒤에는 바꾸지 마세요. 바꾸면 기존 집계가 끊깁니다.

## 구조

```
src/
├── app/
│   ├── api/clicks/route.ts  # GET 클릭 수 조회 / POST 클릭 기록
│   ├── layout.tsx
│   └── page.tsx             # 프로필 + 링크 목록
├── components/
│   ├── LinkCard.tsx         # 클릭 시 집계 요청을 보내는 클라이언트 컴포넌트
│   ├── LinkList.tsx
│   └── ProfileHeader.tsx
├── data/profile.ts          # 프로필 · 링크 설정
└── lib/
    ├── clicks.ts            # 클릭 수 조회 · 증가 (MongoDB, 없으면 메모리 폴백)
    ├── mongodb.ts           # 커넥션 싱글턴
    └── types.ts
```

클릭은 `navigator.sendBeacon`으로 전송되므로 링크 이동을 막지 않으며, 집계 요청이 실패해도 이동은 정상 동작합니다. 서버는 `src/data/profile.ts`에 존재하는 `id`만 기록합니다.

## 배포

Vercel에 연결한 뒤 프로젝트 환경 변수에 `MONGODB_URI`(및 필요하면 `MONGODB_DB`)를 등록하면 됩니다. MongoDB Atlas의 Network Access에서 Vercel 접근을 허용해야 합니다.

## 기술 스택

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · MongoDB Atlas · Vercel
