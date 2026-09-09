import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "linknamu";

// 개발 모드에서는 HMR 때마다 새 커넥션이 쌓이지 않도록 전역에 캐싱합니다.
const globalForMongo = globalThis as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

function getClientPromise(): Promise<MongoClient> | null {
  if (!uri) return null;

  if (!globalForMongo._mongoClientPromise) {
    globalForMongo._mongoClientPromise = new MongoClient(uri).connect();
  }
  return globalForMongo._mongoClientPromise;
}

/**
 * MONGODB_URI가 설정되어 있으면 Db를, 아니면 null을 반환합니다.
 * null인 경우 호출부는 인메모리 폴백을 사용합니다.
 */
export async function getDb(): Promise<Db | null> {
  const clientPromise = getClientPromise();
  if (!clientPromise) return null;

  try {
    const client = await clientPromise;
    return client.db(dbName);
  } catch (error) {
    // 연결 실패로 페이지 전체가 죽지 않도록 폴백을 허용합니다.
    console.error("[mongodb] 연결 실패, 인메모리 폴백을 사용합니다:", error);
    globalForMongo._mongoClientPromise = undefined;
    return null;
  }
}
