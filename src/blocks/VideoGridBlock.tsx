import type { SectionOf, Video } from '@/content';
import CmsImage from '@/components/ui/CmsImage';
import Icon from '@/components/ui/Icon';
import SectionLabel from '@/components/ui/SectionLabel';
import { formatMonthYear, useLocale } from '@/lib/locale';
import { toYouTubeEmbed } from '@/lib/youtube';

export default function VideoGridBlock({ block, videos }: { block: SectionOf<'videoGrid'>; videos: Video[] }) {
  const locale = useLocale();
  const { channel } = block;

  return (
    <div className="px-6 md:px-20 pb-20 pt-10">
      {/* Channel info */}
      {block.showChannelCard !== false && (
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-10 p-7 relative overflow-hidden bg-deep"
          style={{ borderLeft: '3px solid #C8922A', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}
        >
          <div
            aria-hidden="true"
            className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 font-display text-cream"
            style={{ background: 'linear-gradient(135deg, #C8922A, #a87520)', fontSize: '22px' }}
          >
            {channel.initials}
          </div>
          <div>
            <div className="text-cream text-xl font-bold font-heading">{channel.name}</div>
            <div className="text-cream/50 text-sm mt-1">{channel.details}</div>
          </div>
          <a
            href={channel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="sm:ml-auto text-[12px] font-bold tracking-[1px] uppercase px-7 py-3 no-underline transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap bg-gold text-charcoal font-heading"
            style={{ boxShadow: '0 4px 20px rgba(200,146,42,0.3)' }}
          >
            {channel.buttonLabel}
          </a>
        </div>
      )}

      {/* Featured video */}
      <div className="w-full mb-10 overflow-hidden bg-deep" style={{ aspectRatio: '16/9', boxShadow: '0 8px 40px rgba(0,0,0,0.4)' }}>
        <iframe
          src={toYouTubeEmbed(block.featuredVideo.embedUrl)}
          title={block.featuredVideo.title}
          className="w-full h-full border-none"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>

      <SectionLabel className="mb-6">{block.label}</SectionLabel>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {videos.map((v) => (
          <a
            key={v.slug}
            href={v.youtubeUrl ?? channel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1.5 no-underline block rounded-sm bg-deep"
            style={{ border: '1px solid rgba(200,146,42,0.1)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
          >
            <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
              <CmsImage image={v.thumbnail} width={480} height={270} sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw" className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(200,146,42,0.9)' }}>
                  <Icon name="play" className="text-charcoal text-sm ml-0.5" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-charcoal/90 text-cream text-[11px] px-1.5 py-0.5 font-medium">{v.duration}</div>
            </div>
            <div className="p-4">
              <div className="text-cream text-[13px] font-semibold leading-[1.4] mb-2 font-heading">{v.title}</div>
              <div className="text-cream/45 text-xs">{formatMonthYear(v.date, locale)}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
