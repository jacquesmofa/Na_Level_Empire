/**
 * Which fields are the same in every language (images, links, settings,
 * numbers) and which are translated (text). Used by the validator (English
 * and French must match on shared fields) and by the CMS config (shared
 * fields are copied to French automatically).
 */
export const SHARED_KEYS = new Set([
  'url', 'link', 'icon', 'style', 'kind', 'size', 'type', 'imageSide', 'background', 'width', 'form',
  'showFilters', 'showChannelCard', 'cardLink', 'embedUrl', 'youtubeUrl', 'key', 'platform', 'order',
  'status', 'date', 'duration', 'featured', 'published', 'open', 'placeholder', 'slug', 'readMinutes',
  'showInNav', 'navOrder', 'value', 'suffix', 'watermark', 'initials',
]);

/**
 * @param key     field name
 * @param parent  name of the containing field ("contact", "fields", …)
 * @param collection  "pages", "videos", "settings", … (or a file path containing it)
 */
export function isSharedField(key: string, parent: string | undefined, collection: string): boolean {
  // A few names are also used for translatable labels elsewhere.
  if (key === 'email' || key === 'phone') return parent === 'contact';
  if (key === 'source') return collection.includes('videos');
  if (key === 'topic') return parent === 'topics';
  return SHARED_KEYS.has(key);
}
