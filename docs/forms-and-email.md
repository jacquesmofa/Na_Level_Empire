# Forms and email: how they work, and how to switch to the official email

Every form on the site emails its answers through **Web3Forms** to one inbox.

> **Right now (temporary, Oct 2026):** the Web3Forms key belongs to
> **levelempiremedia@gmail.com**. It will be replaced by the company's
> official email. Section 3 says exactly how; it takes about 10 minutes.

## 1. The forms

| Form | Where on the site | Email subject you receive |
| --- | --- | --- |
| Contact / quote / inquiry | `/contact` and `/fr/contact` | depends on the team chosen, see below |
| Job application | **Apply Now** on `/careers` (opens a form with the job already chosen) | `[CAREERS] New application — <job> — <name>` |
| Newsletter (News page) | `/news` sidebar | `[NEWSLETTER] New subscription — <email>` |
| Newsletter (footer) | bottom of every page | `[NEWSLETTER] New subscription — <email>` |

The contact form asks **"Which team should this reach?"**:

| Choice | Email subject |
| --- | --- |
| Media & Production | `[PRODUCTION] New project inquiry — Jane Smith` |
| Partnerships | `[PARTNERSHIPS] New partnership inquiry — Jane Smith` |
| Careers / Academy | `[CAREERS] New careers inquiry — Jane Smith` |
| General | `[GENERAL] New website inquiry — Jane Smith` |

Subjects stay in English on the French site too, so inbox filters work for both.

**What every email contains:** the visitor's answers, the page language
(EN/FR), and for newsletters the page they signed up on. **Reply** in your
inbox answers the visitor directly (their email is set as reply-to).

**Links that pick a team:** `/contact?team=partnerships` opens the contact
form with Partnerships chosen (also `production`, `careers`, `general`).
Editors can use these links in any button in the CMS.

**Spam:** each form has a hidden trap checkbox (`botcheck`). People never
see it; bots tick it, get a normal "thank you", and nothing is sent. It must
stay a checkbox: an earlier hidden *text* field was filled in by browser
autofill, so real visitors saw "Message Sent!" while nothing was sent.

**Honest results:** the "Message Sent!" / "Thank you" message only appears
when Web3Forms confirms it accepted the message. Otherwise the visitor sees
an error with the contact email to write to instead.

## 2. Where things live

| What | Where | Who changes it |
| --- | --- | --- |
| Web3Forms key (decides which inbox gets the emails) | `src/site.config.ts` → `forms.web3formsAccessKey` | developer / owner (code) |
| Email subjects and tags | `src/site.config.ts` → `forms.subjects` | developer / owner (code) |
| Contact email **shown to visitors** (contact panel, error messages, Google listing) | CMS → **Site settings → Site → Contact details → Email address** (both languages) | editors |
| Form labels, team names, buttons, thank-you and error messages | CMS → **Pages → Contact** (form section), **Pages → Careers** (Jobs list → Application form), **Site settings → Site → Footer → Newsletter strip**, **Pages → News** (News feed) | editors |

Search the code for `CHANGE THIS` to land on the only line that ever needs
editing for the switch.

## 3. Switching to the official company email (step by step)

**A. Create the new Web3Forms key** (5 minutes)

1. Go to <https://web3forms.com>, sign in (or sign up) **with the official
   company email**, and create a new form / access key.
2. Copy the access key (looks like `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`).
   It is public by design; it is fine to paste it in chat or in the code.

**B. Put the key on the site** (2 minutes, no tools needed)

1. On GitHub, open `src/site.config.ts` in the repository and click the
   pencil (Edit).
2. Find the line under `↓↓↓ CHANGE THIS ...` and replace the old key
   between the quotes with the new one.
3. Update the comment above it ("TEMPORARY … levelempiremedia@gmail.com")
   to the official address, so the next person knows.
4. **Commit changes** → choose "Create a new branch and start a pull
   request" → open the pull request. When the checks are green, **Squash and
   merge**. Vercel rebuilds; the live site uses the new key about 2 minutes
   later. (Or ask Claude: "switch the forms key to `<new key>`".)

**C. Show the official address to visitors** (2 minutes, in the CMS)

1. `/admin` → **Site settings → Site → Contact details → Email address**.
2. Type the official address in **English**, switch to **French**: it is
   shared, so it is already the same. **Save**.

**D. Test** (1 minute)

Send the contact form once on the live site. You should see "Message
Sent!" and the email should arrive in the official inbox within a minute.
Also try **Apply Now** on `/careers` and the footer newsletter.

**E. Tidy up**

- In the old Web3Forms account (levelempiremedia@gmail.com) you can delete
  the old key once the new one works.
- Update `PLACEHOLDERS.md` (remove the temporary-email line).
- Recreate the inbox filters (section 4) in the new mailbox.

## 4. Optional: inbox filters (Gmail)

Gmail → search box → **Show search options** → *Subject*: `[PARTNERSHIPS]`
→ **Create filter** → apply a label (and forward to a colleague if you
like). Repeat for `[PRODUCTION]`, `[CAREERS]`, `[GENERAL]`, `[NEWSLETTER]`.

More recipients: add them in the Web3Forms dashboard (if your plan allows)
or with a Gmail forwarding filter. Never in the code.

## 5. If emails do not arrive

1. Check the spam folder, and mark the first one "Not spam".
2. Send the form yourself and watch the page: an error message means
   Web3Forms refused it (wrong key, or a domain restriction set in the
   Web3Forms dashboard). Open the browser console (F12) for the exact reason
   (`Form rejected by Web3Forms: …`).
3. In the Web3Forms dashboard, check the key is active and its email is the
   one you expect.
4. If the Web3Forms dashboard has **domain restriction** turned on, add the
   site's domain there.

## 6. For developers

- Sending: `src/lib/forms.ts` (`submitForm`: only `success: true` from
  Web3Forms counts as sent; 15-second timeout; honeypot short-circuit).
- Config: `src/site.config.ts` (`SITE_CONFIG.forms`, `fillSubject`).
- Forms: `src/blocks/FormBlock.tsx` (contact), `src/blocks/JobsListBlock.tsx`
  (application dialog), `src/components/ui/NewsletterForm.tsx` (news +
  footer), `src/components/ui/Honeypot.tsx`.
- Adding a team to the contact form: add a line to `forms.subjects.inquiry`
  in `src/site.config.ts`, run `npm run cms:config`, then add the choice
  to the Contact page form in both languages (CMS or JSON).
- Real CV file uploads need a paid Web3Forms plan; the application form
  asks for a CV/portfolio **link** so it works on the free plan.
- Tests: `scripts/forms-config.test.ts`.
