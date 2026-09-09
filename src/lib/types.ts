export type Profile = {
  name: string;
  bio: string;
  avatarUrl: string;
};

export type Link = {
  /** 클릭 수 집계의 키가 되는 고유 ID. 한번 정하면 바꾸지 않습니다. */
  id: string;
  label: string;
  url: string;
};

/** linkId -> 클릭 수 */
export type ClickCounts = Record<string, number>;
