/**
 * CMS login, step 1 (Vercel function at /api/auth).
 * Sveltia CMS opens this in a popup; we send the editor to GitHub to approve
 * access. Needs the GITHUB_OAUTH_ID environment variable (not secret).
 */
const ALLOWED_SCOPES = new Set(['repo', 'public_repo', 'repo,user', 'public_repo,user']);

export function GET(request: Request): Response {
  const clientId = process.env.GITHUB_OAUTH_ID;
  if (!clientId) {
    return new Response('CMS login is not set up yet: GITHUB_OAUTH_ID is missing in Vercel.', {
      status: 500,
      headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' },
    });
  }
  const url = new URL(request.url);
  const provider = url.searchParams.get('provider') ?? 'github';
  if (provider !== 'github') {
    return new Response('Only GitHub login is supported.', { status: 400, headers: { 'content-type': 'text/plain; charset=utf-8' } });
  }
  const requested = url.searchParams.get('scope') ?? 'repo';
  const scope = ALLOWED_SCOPES.has(requested) ? requested : 'repo';
  const state = crypto.randomUUID();

  const authorize = new URL('https://github.com/login/oauth/authorize');
  authorize.searchParams.set('client_id', clientId);
  authorize.searchParams.set('redirect_uri', `${url.origin}/api/callback`);
  authorize.searchParams.set('scope', scope);
  authorize.searchParams.set('state', state);

  return new Response(null, {
    status: 302,
    headers: {
      location: authorize.toString(),
      'cache-control': 'no-store',
      // Checked in /api/callback to make sure the login was started here.
      'set-cookie': `cms_oauth_state=${state}; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    },
  });
}
