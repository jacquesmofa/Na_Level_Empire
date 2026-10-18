/**
 * CMS login, step 2 (Vercel function at /api/callback).
 * GitHub sends the editor back here with a one-time code. We exchange it for
 * an access token using the OAuth App secret (GITHUB_OAUTH_SECRET, stored only
 * in Vercel) and hand the token to the CMS window that opened the popup, but
 * only if that window is on one of this site's own addresses
 * (CMS_ALLOWED_ORIGINS, plus the address this function runs on).
 */
type Result = { ok: true; token: string } | { ok: false; message: string };

function cookie(request: Request, name: string): string | undefined {
  const raw = request.headers.get('cookie') ?? '';
  for (const part of raw.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return v.join('=');
  }
  return undefined;
}

/** "https://site.vercel.app,https://site-*-team.vercel.app" -> matchers; "*" matches one address part. */
export function originMatchers(list: string, own: string): RegExp[] {
  const items = [own, ...list.split(',').map((s) => s.trim()).filter(Boolean)];
  return items.map((o) => new RegExp(`^${o.replace(/[.+?^${}()|[\]\\/]/g, '\\$&').replace(/\*/g, '[a-z0-9-]+')}$`, 'i'));
}

function page(result: Result, matchers: RegExp[]): Response {
  const message = result.ok
    ? `authorization:github:success:${JSON.stringify({ token: result.token, provider: 'github' })}`
    : `authorization:github:error:${JSON.stringify({ message: result.message })}`;
  // JSON inside <script>: escape "<" so the data can never close the tag.
  const data = JSON.stringify({ message, origins: matchers.map((m) => m.source) }).replace(/</g, '\\u003c');
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Signing in…</title></head>
<body><p>${result.ok ? 'Signed in. You can close this window.' : 'Sign-in failed. Close this window and try again.'}</p>
<script>
(function () {
  var d = ${data};
  var allowed = d.origins.map(function (s) { return new RegExp(s, 'i'); });
  function ok(o) { return allowed.some(function (r) { return r.test(o); }); }
  function receive(e) {
    if (!ok(e.origin) || !window.opener) return;
    window.opener.postMessage(d.message, e.origin);
    window.removeEventListener('message', receive);
  }
  window.addEventListener('message', receive);
  if (window.opener) window.opener.postMessage('authorizing:github', '*');
})();
</script></body></html>`;
  return new Response(html, {
    status: result.ok ? 200 : 400,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'set-cookie': 'cms_oauth_state=; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
    },
  });
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const matchers = originMatchers(process.env.CMS_ALLOWED_ORIGINS ?? '', url.origin);
  const clientId = process.env.GITHUB_OAUTH_ID;
  const clientSecret = process.env.GITHUB_OAUTH_SECRET;
  if (!clientId || !clientSecret) return page({ ok: false, message: 'CMS login is not set up yet (missing GitHub OAuth settings in Vercel).' }, matchers);

  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  if (url.searchParams.get('error')) return page({ ok: false, message: url.searchParams.get('error_description') ?? 'GitHub refused the sign-in.' }, matchers);
  if (!code || !state || state !== cookie(request, 'cms_oauth_state')) {
    return page({ ok: false, message: 'The sign-in expired or did not start here. Please try again.' }, matchers);
  }

  try {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { accept: 'application/json', 'content-type': 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code, redirect_uri: `${url.origin}/api/callback` }),
    });
    const data = (await res.json()) as { access_token?: string; error_description?: string };
    if (!res.ok || !data.access_token) return page({ ok: false, message: data.error_description ?? 'GitHub did not return a token.' }, matchers);
    return page({ ok: true, token: data.access_token }, matchers);
  } catch {
    return page({ ok: false, message: 'Could not reach GitHub. Please try again.' }, matchers);
  }
}
