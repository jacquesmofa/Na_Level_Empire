/**
 * Accounts this site is tied to. When reusing the repository as a template
 * for another client, change these values first (see docs/template-repo.md).
 * Nothing here is secret.
 */
export const SITE_CONFIG = {
  /** GitHub repository the CMS saves to (owner/name). */
  repo: 'jacquesmofa/Na_Level_Empire',
  /** Cloudinary cloud name and public API key (the API secret never goes in the repo). */
  cloudinary: { cloud: 'beavj5sp', apiKey: '255915537921357', folder: 'nlem' },
} as const;
