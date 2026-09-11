import Image from "next/image";
import type { Profile } from "@/lib/types";

export default function ProfileHeader({ profile }: { profile: Profile }) {
  return (
    <header className="flex flex-col items-center gap-6 text-center">
      <Image
        src={profile.avatarUrl}
        alt={`${profile.name} 프로필 사진`}
        width={144}
        height={144}
        priority
        className="h-28 w-28 rounded-full object-cover ring-4 ring-[var(--avatar-ring)] shadow-[var(--avatar-shadow)] sm:h-32 sm:w-32"
      />

      <div className="space-y-2.5">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          {profile.name}
        </h1>
        <p className="text-sm leading-relaxed text-[var(--muted)] sm:text-[0.95rem]">
          {profile.bio}
        </p>
      </div>
    </header>
  );
}
