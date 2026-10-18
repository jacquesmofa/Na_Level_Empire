import type { SectionOf, TeamMember } from '@/content';
import CmsImage from '@/components/ui/CmsImage';
import SectionLabel from '@/components/ui/SectionLabel';

export default function TeamGridBlock({ block, team }: { block: SectionOf<'teamGrid'>; team: TeamMember[] }) {
  return (
    <div className="px-6 md:px-20 py-12">
      <SectionLabel className="mb-10">{block.label}</SectionLabel>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {team.map((m) => (
          <div
            key={m.slug}
            className="group overflow-hidden cursor-pointer transition-transform duration-300 hover:-translate-y-1.5 rounded-sm bg-deep"
            style={{ border: '1px solid rgba(200,146,42,0.1)' }}
          >
            <div className="overflow-hidden" style={{ aspectRatio: '3/4' }}>
              <CmsImage image={m.photo} width={400} height={533} sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw" className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="p-5" style={{ borderTop: '2px solid #C8922A' }}>
              <div className="text-cream text-base font-bold font-heading">{m.name}</div>
              <div className="text-gold text-xs tracking-[1px] uppercase mt-1">{m.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
