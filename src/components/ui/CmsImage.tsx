import type { CSSProperties } from 'react';

type Props = {
  image: { url: string; alt: string };
  className?: string;
  style?: CSSProperties;
  /** First visible image on a page: load immediately. */
  priority?: boolean;
};

/**
 * Every content image goes through here. Phase (c) adds Cloudinary sizing
 * (f_auto, q_auto, width) and srcset in this one place.
 */
export default function CmsImage({ image, className, style, priority = false }: Props) {
  return (
    <img
      src={image.url}
      alt={image.alt}
      className={className}
      style={style}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      {...(priority ? { fetchPriority: 'high' as const } : {})}
    />
  );
}
