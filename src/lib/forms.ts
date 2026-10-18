/**
 * Sends website form submissions to Web3Forms (https://web3forms.com),
 * which emails them to the inbox tied to the access key.
 *
 * The access key comes from the VITE_WEB3FORMS_ACCESS_KEY environment
 * variable (local: `.env`; live site: a Vercel environment variable).
 * Web3Forms keys are
 * designed to be used in the browser, but we still keep the key out of Git
 * so it can be rotated without a code change.
 *
 * A submission only counts as sent when Web3Forms answers HTTP 2xx with
 * `success: true`. Anything else (missing key, rejection, network error,
 * timeout) is reported as a failure so the page never claims success it
 * didn't get.
 */

const ENDPOINT = 'https://api.web3forms.com/submit';
const TIMEOUT_MS = 15_000;

export type SubmitFailure = 'not-configured' | 'rejected' | 'network';
export type SubmitResult = { ok: true } | { ok: false; reason: SubmitFailure };

export async function submitForm(
  subject: string,
  fields: Record<string, string>,
): Promise<SubmitResult> {
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    console.error('Form not sent: VITE_WEB3FORMS_ACCESS_KEY is not set.');
    return { ok: false, reason: 'not-configured' };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        subject,
        from_name: 'Na Level Empire Media website',
        ...fields,
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
