# 진행 상황

마지막 갱신: 2026-09-14

프로젝트 소개·설치·구조는 [README.md](README.md), 기획 범위는 [PRD.md](PRD.md)를 참고하세요.
이 문서는 **지금 어디까지 됐고 다음에 뭘 해야 하는지**만 다룹니다.

## 한 줄 요약

MVP 기능이 완성됐고, MongoDB Atlas에 클릭 수가 실제로 기록되는 것까지 확인했습니다.
**남은 것은 Vercel 배포입니다.**

## 완료

- [x] Next.js 16 (App Router) + TypeScript + Tailwind v4 프로젝트 구성
- [x] 프로필 표시 — `ProfileHeader` (이름 · 소개 · 사진)
- [x] 링크 카드 목록 — `LinkList` / `LinkCard`, 새 탭 이동
- [x] 클릭 수 집계 — `GET·POST /api/clicks`, MongoDB 저장 + 인메모리 폴백
- [x] 모바일 우선 반응형 + 다크 모드
- [x] GitHub 공개 저장소 생성 및 초기 커밋 푸시
- [x] 프로필 내용 교체 — 이름 · 한 줄 소개 · 사진(`public/profile.jpg`)
- [x] 이메일 링크 카드 추가 — `mailto:`, 클립보드 복사 폴백 포함
- [x] 디자인 리뉴얼 — Pretendard, 하늘색 그라데이션 배경, 글래스 모피즘 카드
- [x] MongoDB Atlas 연결 — `.env.local`의 `MONGODB_URI`, `linkClicks` 컬렉션에 실제 기록 확인
- [x] 클릭 수 클라이언트 조회 — 페이지 진입 시 `GET /api/clicks` 한 번으로 전체 수치 반영

### 검증 결과 (2026-09-14 기준)

| 검사 | 명령 | 결과 |
| --- | --- | --- |
| 타입 검사 | `npx tsc --noEmit` | 통과 (오류 0) |
| 린트 | `npx eslint src/` | 통과 (경고 0) |
| Atlas 연결 | `db.command({ ping: 1 })` | `{ ok: 1 }` |
| 클릭 기록 | `POST /api/clicks` × 2 | `count: 1 → 2`, Atlas 문서에 반영됨 |
| 클릭 조회 | `GET /api/clicks` | `{"github":2,"instagram":1}` |
| 첫 화면 | `curl /` | 카드 5개 모두 `0회` (조회 전 초기값) |
| 프로덕션 빌드 | `npm run build` | **미실행** (2026-09-09 이후 확인 안 됨) |

검증에 쓴 테스트 문서는 확인 후 지웠으므로 `linkClicks` 컬렉션은 비어 있습니다.
`npm run build`는 개발 서버가 같은 `.next` 디렉터리를 쓰고 있어 여전히 건너뛴 상태입니다.
배포 전에 dev 서버를 멈추고 한 번 확인해야 합니다. 자동화된 테스트는 여전히 없습니다.

## 남은 일

우선순위 순입니다.

1. **Vercel 배포** — 저장소를 연결하고 환경 변수(`MONGODB_URI`, `MONGODB_DB`)를 등록합니다.
   `.env.local`은 커밋되지 않으므로 Vercel 대시보드에 직접 넣어야 합니다.
   Atlas의 Network Access에서 Vercel 접근 허용(`0.0.0.0/0`)도 필요합니다.
2. **링크 URL을 실제 계정 주소로 교체** — `src/data/profile.ts`의 GitHub·밴드·Facebook·Instagram이
   아직 `https://github.com` 처럼 도메인 루트만 가리킵니다. 이메일만 실제 주소입니다.
   `id`는 클릭 수 집계의 키이므로 한번 정하면 바꾸지 마세요.
3. **favicon 교체** — `src/app/favicon.ico`가 Next.js 기본값입니다.
   title·description·OG 태그는 `profile` 값에서 자동 생성되므로 따로 손볼 것이 없습니다.
4. **DB 비밀번호 교체** — 현재 Atlas 사용자 비밀번호가 `Mongodb`로 약합니다.
   공개 배포 전에 Atlas에서 바꾸고 `.env.local`·Vercel 환경 변수를 함께 갱신하세요.

## 알아둘 점

### 폰트가 외부 CDN에 의존합니다

Pretendard를 jsDelivr에서 받아옵니다(`src/app/layout.tsx`의 `<link>`).
CDN 장애나 오프라인에서는 시스템 한글 폰트로 폴백됩니다.
의존을 없애려면 `pretendard` 패키지를 설치해 `next/font/local`로 바꾸면 됩니다.

`globals.css`에 `@import url(...)`로 넣으면 안 됩니다.
Tailwind가 `@import "tailwindcss"`를 펼치면서 뒤로 밀려
`@import rules must precede all rules` 오류로 빌드가 깨집니다. 그래서 `<link>`로 싣고 있습니다.

### `mailto:`는 방문자 환경에 따라 조용히 실패합니다

기본 메일 앱이 지정돼 있지 않으면 브라우저가 아무 반응도 보이지 않습니다
(실제로 이 PC에서 재현됐습니다 — Windows의 mailto 기본 앱 ProgId가 끊긴 상태).
브라우저가 실행 성공 여부를 알려주지 않아 감지가 불가능하므로,
`LinkCard`는 **항상 주소를 클립보드에 복사하면서 `mailto:`도 함께 시도**합니다.
복사되면 카드 오른쪽에 2초간 "주소 복사됨"이 표시됩니다.

### 색은 CSS 변수 한 곳에서 바뀝니다

`src/app/globals.css`의 `:root` 블록에 배경 그라데이션·글래스 카드·그림자·본문 색이 모여 있고,
`prefers-color-scheme: dark`에서 같은 변수를 덮어씁니다.
컴포넌트에는 `dark:` 변형이 없으므로 색 조정은 이 파일만 고치면 됩니다.

### 인메모리 폴백은 배포 환경에서 신뢰할 수 없습니다

`MONGODB_URI`가 없으면 `src/lib/clicks.ts`가 프로세스 메모리에 카운트를 담습니다.
로컬 개발에는 편하지만 Vercel 서버리스에서는 인스턴스마다 메모리가 따로여서
집계가 인스턴스별로 갈라집니다. **배포 시 환경 변수 등록을 빠뜨리면 조용히 이 상태가 됩니다.**

### 클릭 수는 조작 가능합니다

`POST /api/clicks`는 `linkId`가 실제 존재하는 링크인지만 검증합니다.
중복 제거·요청 제한이 없어 같은 요청을 반복하면 숫자를 올릴 수 있습니다.
개인 페이지 수준에서는 허용 가능한 트레이드오프로 두었습니다.
정확한 수치가 필요해지면 IP·세션 단위 제한을 추가해야 합니다.

### 클릭 수는 브라우저에서 조회합니다

`src/app/page.tsx`는 정적으로 렌더링되고, 클릭 수는 `LinkList`(클라이언트 컴포넌트)가
마운트 시 `GET /api/clicks` 한 번으로 받아옵니다. 그래서 첫 화면에는 `0회`가 보였다가
응답이 도착하면 실제 값으로 바뀝니다. 대신 페이지 HTML 자체는 캐시될 수 있어 빠릅니다.

`LinkList`는 서버에서 받은 값(`fetched`)과 이 페이지에서 발생한 클릭(`added`)을 따로 들고 있습니다.
합쳐서 저장하면 조회 응답이 늦게 도착했을 때 방금 누른 낙관적 +1이 덮여 사라집니다.

### `claude.md` 파일명

루트의 파일명이 소문자 `claude.md`입니다. Windows는 대소문자를 구분하지 않아
현재는 인식되지만, Linux·macOS에서 클론하면 Claude Code가 찾지 못합니다.
`git mv claude.md CLAUDE.md`로 정리하는 편이 안전합니다.

### `AGENTS.md`는 자동 생성됩니다

`next dev` 실행 시 Next.js가 `AGENTS.md`의 규칙 블록을 다시 써 넣습니다.
지워도 되살아나므로, 변경분이 생기면 그대로 커밋하는 편이 트리를 깨끗하게 유지합니다.

### git 사용자 정보

전역 설정이 없어 이 저장소에만 `cpalim60 <cpalim60@gmail.com>`으로 지정했습니다.
다른 프로젝트에서도 쓰려면 `git config --global`로 따로 설정해야 합니다.
