import { getDb } from "@/lib/mongodb";
import type { ClickCounts } from "@/lib/types";

const COLLECTION = "linkClicks";

type ClickDoc = {
  _id: string;
  count: number;
  updatedAt: Date;
};

// MONGODB_URI가 없을 때 쓰는 폴백. 서버가 재시작되면 초기화됩니다.
const globalForClicks = globalThis as typeof globalThis & {
  _memoryClickCounts?: Map<string, number>;
};
const memoryCounts = (globalForClicks._memoryClickCounts ??= new Map());

/** 모든 링크의 클릭 수를 가져옵니다. */
export async function getClickCounts(): Promise<ClickCounts> {
  const db = await getDb();
  if (!db) return Object.fromEntries(memoryCounts);

  try {
    const docs = await db.collection<ClickDoc>(COLLECTION).find({}).toArray();
    return Object.fromEntries(docs.map((doc) => [doc._id, doc.count]));
  } catch (error) {
    console.error("[clicks] 조회 실패:", error);
    return Object.fromEntries(memoryCounts);
  }
}

/** 링크 클릭을 1 증가시키고, 증가된 값을 반환합니다. */
export async function incrementClick(linkId: string): Promise<number> {
  const db = await getDb();

  if (db) {
    try {
      const doc = await db
        .collection<ClickDoc>(COLLECTION)
        .findOneAndUpdate(
          { _id: linkId },
          { $inc: { count: 1 }, $set: { updatedAt: new Date() } },
          { upsert: true, returnDocument: "after" },
        );
      if (doc) return doc.count;
    } catch (error) {
      console.error("[clicks] 기록 실패, 인메모리 폴백을 사용합니다:", error);
    }
  }

  const next = (memoryCounts.get(linkId) ?? 0) + 1;
  memoryCounts.set(linkId, next);
  return next;
}
