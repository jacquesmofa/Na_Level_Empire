/**
 * ============================================================================
 *  SITE CONFIG: the accounts this website is tied to. Nothing here is secret.
 * ============================================================================
 *
 * This is the ONLY file in the code that holds the form key and the
 * Cloudinary/GitHub account names. Change values here, commit, push: the
 * live site updates after Vercel rebuilds (about 1-2 minutes).
 *
 * Full step-by-step guide for changing the forms email later:
 *   docs/forms-and-email.md
 * Reusing this repository for another client:
 *   docs/template-repo.md
 */
export const SITE_CONFIG = {
  /** GitHub repository the CMS saves to (owner/name). */
  repo: 'jacquesmofa/Na_Level_Empire',

  /** Cloudinary cloud name and public API key (the API secret never goes in the repo). */
  cloudinary: { cloud: 'beavj5sp', apiKey: '255915537921357', folder: 'nlem' },

  /**
   * --------------------------------------------------------------------------
   *  FORMS (Web3Forms): every form on the site sends through this key.
   * --------------------------------------------------------------------------
   *  Contact / quote / inquiry form   /contact  (and /fr/contact)
   *  Job application                  "Apply Now" on /careers
   *  Newsletter                       /news sidebar + footer on every page
   *
   *  Where do the emails go? To the inbox the key was created with in the
   *  Web3Forms dashboard. Delivery is decided by the KEY, not by this file.
   *
   *  ⚠️ TEMPORARY (Oct 2026): key created with levelempiremedia@gmail.com.
   *  TO SWITCH TO THE OFFICIAL COMPANY EMAIL LATER (see docs/forms-and-email.md):
   *    1. web3forms.com → create a form with the official email → copy its key
   *    2. paste the new key below in place of the old one
   *    3. CMS → Site settings → Site → Contact → Email: put the official address
   *       (that is the address visitors see on the site; it is content, not code)
   *  The key is public by design (Web3Forms says it may sit in browser code).
   */
  forms: {
    // ↓↓↓ CHANGE THIS when the official Web3Forms form exists ↓↓↓
    web3formsAccessKey: '8f5cc8e3-b118-4b73-b01b-80c13f0a3d61',

    /** Sender name shown in the inbox. */
    fromName: 'Na Level Empire Media website',

    /**
     * Email subject lines. They stay in English on both language versions so
     * inbox filters keep working. {name}, {email} and {role} are filled in
     * from the visitor's answers.
     */
    subjects: {
      /** Contact form: one per "Which team should this reach?" choice. */
      inquiry: {
        production: '[PRODUCTION] New project inquiry — {name}',
        partnerships: '[PARTNERSHIPS] New partnership inquiry — {name}',
        careers: '[CAREERS] New careers inquiry — {name}',
        general: '[GENERAL] New website inquiry — {name}',
      },
      application: '[CAREERS] New application — {role} — {name}',
      newsletter: '[NEWSLETTER] New subscription — {email}',
    },
  },
} as const;

/** Teams a contact message can be addressed to (keys of the subjects above). */
export type InquiryTopic = keyof typeof SITE_CONFIG.forms.subjects.inquiry;
export const INQUIRY_TOPICS = Object.keys(SITE_CONFIG.forms.subjects.inquiry) as [InquiryTopic, ...InquiryTopic[]];

/** Fills {name}, {email}, {role} in a subject line. Missing values are dropped cleanly. */
export function fillSubject(template: string, values: Partial<Record<'name' | 'email' | 'role', string>>): string {
  return template
    .replace(/\{(name|email|role)\}/g, (_, k: 'name' | 'email' | 'role') => values[k]?.trim() || '')
    .split(' — ')
    .map((part) => part.trim())
    .filter(Boolean)
    .join(' — ');
}
