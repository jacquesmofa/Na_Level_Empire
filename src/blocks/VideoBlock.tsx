import type { SectionOf } from '@/content';
import SectionLabel from '@/components/ui/SectionLabel';
import { toYouTubeEmbed } from '@/lib/youtube';

export default function VideoBlock({ block }: { block: SectionOf<'video'> }) {
  return (
    <section className="px-6 md:px-20 py-16 bg-charcoal">
      {block.label && <SectionLabel className="mb-6">{block.label}</SectionLabel>}
      <div className="w-full overflow-hidden bg-deep" style={{ aspectRatio: '16/9', boxShadow: '0 8px 40px rgba(0,0,0,0.4)' }}>
        <iframe
          src={toYouTubeEmbed(block.youtubeUrl)}
          title={block.title}
          className="w-full h-full border-none"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
      {block.caption && <p className="text-cream/50 text-sm mt-4">{block.caption}</p>}
    </section>
  );
}
