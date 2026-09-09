import { isKnownLinkId } from "@/data/profile";
import { getClickCounts, incrementClick } from "@/lib/clicks";

/** GET /api/clicks — 링크별 클릭 수 전체를 반환합니다. */
export async function GET() {
  const counts = await getClickCounts();
  return Response.json({ counts });
}

/** POST /api/clicks — { linkId } 의 클릭 수를 1 증가시킵니다. */
export async function POST(request: Request) {
  let linkId: unknown;

  try {
    ({ linkId } = await request.json());
  } catch {
    return Response.json({ error: "잘못된 요청 본문입니다." }, { status: 400 });
  }

  if (typeof linkId !== "string" || !isKnownLinkId(linkId)) {
    return Response.json({ error: "알 수 없는 linkId 입니다." }, { status: 400 });
  }

  const count = await incrementClick(linkId);
  return Response.json({ linkId, count });
}
