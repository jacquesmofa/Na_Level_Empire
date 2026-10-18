import type { CSSProperties } from 'react';
import { cld, cldSrcSet, DEFAULT_WIDTHS } from '@/lib/image';

type Props = {
  image: { url: string; alt: string };
  /** Intrinsic size used for the width/height attributes (sets the aspect ratio, prevents layout shift). */
  width: number;
  height: number;
  /** How wide the image is shown, for the browser to pick a size, e.g. "(min-width: 1024px) 25vw, 100vw". */
  sizes?: string;
  widths?: number[];
  className?: string;
  style?: CSSProperties;
  /** First visible image on a page: load immediately with high priority. */
  priority?: boolean;
};

/** Every content image goes through here: Cloudinary format, quality and width, plus srcset. */
export default function CmsImage({ image, width, height, sizes = '100vw', widths = DEFAULT_WIDTHS, className, style, priority = false }: Props) {
  const srcSet = cldSrcSet(image.url, widths);
  return (
    <img
      src={cld(image.url, { width: Math.min(width * 2, widths.at(-1) ?? width) })}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      width={width}
      height={height}
      alt={image.alt}
      className={className}
      style={style}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      {...(priority ? { fetchPriority: 'high' as const } : {})}
    />
  );
}
