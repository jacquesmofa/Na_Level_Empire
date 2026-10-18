/**
 * Cloudinary URL helper. Content stores the plain delivery URL as uploaded,
 * e.g. https://res.cloudinary.com/beavj5sp/image/upload/v1712345678/nlem/projects/gala.jpg
 * and this adds the transformations at render time:
 *   f_auto  best format for the browser (AVIF/WebP/JPEG)
 *   q_auto  automatic quality
 *   w_N     width in pixels, c_limit never upscales
 * Any other URL is returned unchanged.
 */
import { SITE_CONFIG } from '@/site.config';

export const CLOUDINARY_CLOUD = SITE_CONFIG.cloudinary.cloud;
const UPLOAD_PREFIX = `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/`;

export const DEFAULT_WIDTHS = [400, 800, 1200, 1600];

export function isCloudinary(url: string): boolean {
  return url.startsWith(UPLOAD_PREFIX);
}

export function cld(url: string, { width }: { width: number }): string {
  if (!isCloudinary(url)) return url;
  return `${UPLOAD_PREFIX}f_auto,q_auto,w_${Math.round(width)},c_limit/${url.slice(UPLOAD_PREFIX.length)}`;
}

export function cldSrcSet(url: string, widths: number[] = DEFAULT_WIDTHS): string | undefined {
  if (!isCloudinary(url)) return undefined;
  return widths.map((w) => `${cld(url, { width: w })} ${w}w`).join(', ');
}
