import type { SectionOf } from '@/content';
import SectionLabel from '@/components/ui/SectionLabel';

export default function RichTextBlock({ block }: { block: SectionOf<'richText'> }) {
  return (
    <div className={`px-6 md:px-20 py-12 ${block.width === 'wide' ? 'max-w-4xl' : 'max-w-2xl'}`}>
      {block.label && <SectionLabel className="mb-8">{block.label}</SectionLabel>}
      {block.paragraphs.map((p, i) => (
        <p key={i} className="text-cream/60 text-base leading-[1.8] mb-5 last:mb-0">
          {p}
        </p>
      ))}
    </div>
  );
}
