import type { IconName } from '@/content';

const CLASSES: Record<IconName, string> = {
  camera: 'ri-camera-line',
  live: 'ri-live-line',
  team: 'ri-team-line',
  film: 'ri-film-line',
  stack: 'ri-stack-line',
  time: 'ri-time-line',
  home: 'ri-home-4-line',
  chart: 'ri-line-chart-line',
  play: 'ri-play-fill',
};

/** Decorative icon from the named set editors choose from. */
export default function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  return <i className={`${CLASSES[name]} ${className}`} aria-hidden="true" />;
}
