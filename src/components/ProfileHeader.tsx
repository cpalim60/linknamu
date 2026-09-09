import Image from "next/image";
import type { Profile } from "@/lib/types";

export default function ProfileHeader({ profile }: { profile: Profile }) {
  return (
    <header className="flex flex-col items-center gap-5 text-center">
      <Image
        src={profile.avatarUrl}
        alt={`${profile.name} 프로필 사진`}
        width={112}
        height={112}
        priority
        className="h-28 w-28 rounded-full border border-black/10 object-cover dark:border-white/15"
      />
      <div className="space-y-2">
        <h1 className="text-lg font-semibold tracking-tight">{profile.name}</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{profile.bio}</p>
      </div>
    </header>
  );
}
