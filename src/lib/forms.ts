/**
 * Sends website form submissions to Web3Forms (https://web3forms.com),
 * which emails them to the inbox the access key was created with.
 *
 * The key and the email subject lines live in src/site.config.ts (the one
 * place to change them; see docs/forms-and-email.md).
 *
 * A submission only counts as sent when Web3Forms answers HTTP 2xx with
 * `success: true`. Anything else (rejection, network error, timeout) is
 * reported as a failure so the page never claims success it didn't get.
 */
import { SITE_CONFIG } from '@/site.config';

const ENDPOINT = 'https://api.web3forms.com/submit';
const TIMEOUT_MS = 15_000;

export type SubmitFailure = 'not-configured' | 'rejected' | 'network';
export type SubmitResult = { ok: true } | { ok: false; reason: SubmitFailure };

/**
 * Name of the hidden spam-trap checkbox rendered by <Honeypot />
 * (Web3Forms' own spam field name).
 */
export const HONEYPOT_FIELD = 'botcheck';

/** True when the hidden spam-trap checkbox was ticked (only bots do that). */
export function isBot(form: HTMLFormElement): boolean {
  return new FormData(form).get(HONEYPOT_FIELD) !== null;
}

export async function submitForm(
  subject: string,
  fields: Record<string, string>,
  { bot = false }: { bot?: boolean } = {},
): Promise<SubmitResult> {
  // Spam trap: pretend it worked, send nothing.
  if (bot) return { ok: true };

  const accessKey = SITE_CONFIG.forms.web3formsAccessKey;
  if (!accessKey) {
    console.error('Form not sent: no Web3Forms key in src/site.config.ts.');
    return { ok: false, reason: 'not-configured' };
  }

  // Drop empty optional answers so the email stays short.
  const answers = Object.fromEntries(Object.entries(fields).filter(([, v]) => v.trim() !== ''));

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        subject,
        from_name: SITE_CONFIG.forms.fromName,
        // "Reply" in the inbox answers the visitor directly.
        ...(answers.email ? { replyto: answers.email } : {}),
        ...answers,
      }),
      signal: controller.signal,
    });
    const data: unknown = await res.json().catch(() => null);
    const success =
      typeof data === 'object' && data !== null && (data as { success?: unknown }).success === true;
    if (res.ok && success) return { ok: true };
    console.error('Form rejected by Web3Forms:', res.status, data);
    return { ok: false, reason: 'rejected' };
  } catch (err) {
    console.error('Form could not reach Web3Forms:', err);
    return { ok: false, reason: 'network' };
  } finally {
    clearTimeout(timer);
  }
}
