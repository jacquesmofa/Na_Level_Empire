/** Tests for the CMS login relay (api/auth.ts, api/callback.ts). */
import { afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { GET as auth } from './auth.ts';
import { GET as callback, originMatchers } from './callback.ts';

const SITE = 'https://na-level-empire.example.app';
const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
  delete process.env.GITHUB_OAUTH_ID;
  delete process.env.GITHUB_OAUTH_SECRET;
  delete process.env.CMS_ALLOWED_ORIGINS;
});

test('auth: explains clearly when the OAuth App is not configured', () => {
  const res = auth(new Request(`${SITE}/api/auth?provider=github`));
  assert.equal(res.status, 500);
});

test('auth: redirects to GitHub with a state cookie', () => {
  process.env.GITHUB_OAUTH_ID = 'client123';
  const res = auth(new Request(`${SITE}/api/auth?provider=github&scope=repo&site_id=x`));
  assert.equal(res.status, 302);
  const loc = new URL(res.headers.get('location')!);
  assert.equal(loc.origin + loc.pathname, 'https://github.com/login/oauth/authorize');
  assert.equal(loc.searchParams.get('client_id'), 'client123');
  assert.equal(loc.searchParams.get('redirect_uri'), `${SITE}/api/callback`);
  assert.equal(loc.searchParams.get('scope'), 'repo');
  const state = loc.searchParams.get('state')!;
  assert.match(res.headers.get('set-cookie')!, new RegExp(`cms_oauth_state=${state};.*HttpOnly; Secure`));
});

test('auth: rejects other providers and unknown scopes', () => {
  process.env.GITHUB_OAUTH_ID = 'client123';
  assert.equal(auth(new Request(`${SITE}/api/auth?provider=gitlab`)).status, 400);
  const loc = new URL(auth(new Request(`${SITE}/api/auth?provider=github&scope=admin:org`)).headers.get('location')!);
  assert.equal(loc.searchParams.get('scope'), 'repo');
});

test('callback: refuses a login that did not start here (state mismatch)', async () => {
  process.env.GITHUB_OAUTH_ID = 'client123';
  process.env.GITHUB_OAUTH_SECRET = 'shh-secret';
  globalThis.fetch = (() => assert.fail('must not call GitHub')) as typeof fetch;
  const res = await callback(new Request(`${SITE}/api/callback?code=c&state=evil`, { headers: { cookie: 'cms_oauth_state=good' } }));
  assert.equal(res.status, 400);
  assert.match(await res.text(), /authorization:github:error/);
});

test('callback: exchanges the code and hands the token only to allowed sites', async () => {
  process.env.GITHUB_OAUTH_ID = 'client123';
  process.env.GITHUB_OAUTH_SECRET = 'shh-secret';
  process.env.CMS_ALLOWED_ORIGINS = 'https://na-level-empire-*-jacques15.vercel.app';
  let sent: any;
  globalThis.fetch = (async (_url: string, init: RequestInit) => {
    sent = JSON.parse(String(init.body));
    return new Response(JSON.stringify({ access_token: 'gho_token123' }), { status: 200 });
  }) as typeof fetch;
  const res = await callback(new Request(`${SITE}/api/callback?code=abc&state=s1`, { headers: { cookie: 'a=1; cms_oauth_state=s1' } }));
  const html = await res.text();
  assert.equal(res.status, 200);
  assert.deepEqual(sent, { client_id: 'client123', client_secret: 'shh-secret', code: 'abc', redirect_uri: `${SITE}/api/callback` });
  assert.match(html, /authorization:github:success:.*gho_token123/);
  assert.doesNotMatch(html, /shh-secret/, 'the secret must never reach the browser');
  assert.match(res.headers.get('set-cookie')!, /cms_oauth_state=;.*Max-Age=0/);
});

test('callback: origin rules allow this site and its previews only', () => {
  const m = originMatchers('https://na-level-empire-*-jacques15.vercel.app', SITE);
  const ok = (o: string) => m.some((r) => r.test(o));
  assert.ok(ok(SITE));
  assert.ok(ok('https://na-level-empire-git-phase-c-cms-jacques15.vercel.app'));
  assert.ok(!ok('https://evil.example.com'));
  assert.ok(!ok('https://na-level-empire-x-jacques15.vercel.app.evil.com'));
  assert.ok(!ok('https://na-level-empire-a.b-jacques15.vercel.app'));
});
