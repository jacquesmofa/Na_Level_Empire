import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fillSubject, INQUIRY_TOPICS, SITE_CONFIG } from '../src/site.config.ts';

test('the Web3Forms key looks like a Web3Forms key', () => {
  assert.match(SITE_CONFIG.forms.web3formsAccessKey, /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
});

test('subject lines are filled in, and empty values leave no stray dashes', () => {
  const s = SITE_CONFIG.forms.subjects;
  assert.equal(fillSubject(s.inquiry.partnerships, { name: 'Jane Smith' }), '[PARTNERSHIPS] New partnership inquiry — Jane Smith');
  assert.equal(fillSubject(s.application, { role: 'AV Apprentice', name: 'Jane' }), '[CAREERS] New application — AV Apprentice — Jane');
  assert.equal(fillSubject(s.application, { name: 'Jane' }), '[CAREERS] New application — Jane');
  assert.equal(fillSubject(s.newsletter, { email: 'a@b.ca' }), '[NEWSLETTER] New subscription — a@b.ca');
  assert.equal(fillSubject(s.newsletter, {}), '[NEWSLETTER] New subscription');
});

test('every subject starts with a [TAG] for inbox filters', () => {
  const all = [...Object.values(SITE_CONFIG.forms.subjects.inquiry), SITE_CONFIG.forms.subjects.application, SITE_CONFIG.forms.subjects.newsletter];
  for (const subj of all) assert.match(subj, /^\[[A-Z]+\] /);
});

test('the contact page offers only teams that have a subject line', () => {
  for (const locale of ['en', 'fr']) {
    const page = JSON.parse(readFileSync(resolve(import.meta.dirname, `../src/content/pages/${locale}/contact.json`), 'utf8'));
    const form = page.sections.find((s: { type: string }) => s.type === 'form');
    for (const t of form.topics) assert.ok(INQUIRY_TOPICS.includes(t.topic), `${locale}: ${t.topic}`);
  }
});

test('no old form endpoint or old inbox address anywhere in the site code', () => {
  const files = ['src/lib/forms.ts', 'src/blocks/FormBlock.tsx', 'src/blocks/JobsListBlock.tsx', 'src/components/ui/NewsletterForm.tsx'];
  for (const f of files) {
    const code = readFileSync(resolve(import.meta.dirname, '..', f), 'utf8');
    assert.doesNotMatch(code, /readdy\.ai\/api\/form|formspree|emailjs|hello@nalevelempire/i, f);
  }
});
