# 진행 상황

마지막 갱신: 2026-09-09

프로젝트 소개·설치·구조는 [README.md](README.md), 기획 범위는 [PRD.md](PRD.md)를 참고하세요.
이 문서는 **지금 어디까지 됐고 다음에 뭘 해야 하는지**만 다룹니다.

## 한 줄 요약

MVP 기능 코드는 모두 동작하는 상태로 완성됐고, GitHub 공개 저장소에 올렸습니다.
**아직 실제 데이터·DB·배포가 연결되지 않아 서비스로는 동작하지 않습니다.**

## 완료

- [x] Next.js 16 (App Router) + TypeScript + Tailwind v4 프로젝트 구성
- [x] 프로필 표시 — `ProfileHeader` (이름 · 소개 · 사진)
- [x] 링크 카드 목록 — `LinkList` / `LinkCard`, 새 탭 이동
- [x] 클릭 수 집계 — `GET·POST /api/clicks`, MongoDB 저장 + 인메모리 폴백
- [x] 모바일 우선 반응형 + 다크 모드
- [x] GitHub 공개 저장소 생성 및 초기 커밋 푸시

### 검증 결과 (2026-09-09 기준)

| 검사 | 명령 | 결과 |
| --- | --- | --- |
| 타입 검사 | `npx tsc --noEmit` | 통과 (오류 0) |
| 린트 | `npm run lint` | 통과 (경고 0) |
| 프로덕션 빌드 | `npm run build` | 성공 (`/`, `/api/clicks` 동적 · `/_not-found` 정적) |

자동화된 테스트는 아직 없습니다. 위 세 가지가 현재의 유일한 검증 수단입니다.

## 남은 일

우선순위 순입니다.

1. **실제 프로필·링크로 교체** — `src/data/profile.ts`는 아직 더미 값입니다.
   링크 URL이 `https://github.com` 처럼 도메인 루트만 있어 실제 계정을 가리키지 않습니다.
   `id`는 클릭 수 집계의 키이므로 한번 정하면 바꾸지 마세요.
2. **MongoDB Atlas 연결** — 클러스터를 만들고 `.env.local`에 `MONGODB_URI`를 채웁니다.
   연결 전까지 클릭 수는 서버 메모리에만 쌓이고 재시작하면 사라집니다.
3. **Vercel 배포** — 저장소를 연결하고 환경 변수(`MONGODB_URI`, 필요 시 `MONGODB_DB`)를 등록합니다.
   Atlas의 Network Access에서 Vercel 접근 허용이 필요합니다.
4. **프로필 사진 교체** — 현재 `public/avatar.svg` 플레이스홀더입니다.
5. **메타데이터 정리** — `src/app/layout.tsx`의 title·description, OG 태그, favicon.

## 알아둘 점

### 인메모리 폴백은 배포 환경에서 신뢰할 수 없습니다

`MONGODB_URI`가 없으면 `src/lib/clicks.ts`가 프로세스 메모리에 카운트를 담습니다.
로컬 개발에는 편하지만 Vercel 서버리스에서는 인스턴스마다 메모리가 따로여서
집계가 인스턴스별로 갈라집니다. **배포 전에 Atlas 연결이 반드시 필요합니다.**

### 클릭 수는 조작 가능합니다

`POST /api/clicks`는 `linkId`가 실제 존재하는 링크인지만 검증합니다.
중복 제거·요청 제한이 없어 같은 요청을 반복하면 숫자를 올릴 수 있습니다.
개인 페이지 수준에서는 허용 가능한 트레이드오프로 두었습니다.
정확한 수치가 필요해지면 IP·세션 단위 제한을 추가해야 합니다.

### 매 요청 렌더링

`src/app/page.tsx`가 `export const dynamic = "force-dynamic"`이라
요청마다 클릭 수를 다시 조회합니다. 최신 수치를 보여주기 위한 의도적 선택이지만,
트래픽이 늘면 캐싱(`revalidate`)을 검토할 지점입니다.

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
