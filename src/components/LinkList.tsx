import LinkCard from "@/components/LinkCard";
import type { ClickCounts, Link } from "@/lib/types";

type Props = {
  links: Link[];
  counts: ClickCounts;
};

export default function LinkList({ links, counts }: Props) {
  return (
    <nav aria-label="링크 목록" className="flex flex-col gap-3">
      {links.map((link) => (
        <LinkCard key={link.id} link={link} initialCount={counts[link.id] ?? 0} />
      ))}
    </nav>
  );
}
