/** Turns any YouTube link (watch, youtu.be, shorts, embed) into an embeddable URL. */
export function toYouTubeEmbed(url: string): string {
  if (url.includes('/embed')) return url;
  const m = url.match(/(?:v=|youtu\.be\/|shorts\/)([\w-]{11})/);
  return m ? `https://www.youtube-nocookie.com/embed/${m[1]}` : url;
}
