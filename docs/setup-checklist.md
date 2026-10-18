# Setup checklist (owner)

One-time setup for hosting, forms and the CMS login. Nothing here is ever
committed: keys and secrets go only into Vercel's environment variables.

## 1. Host the site on Vercel

1. Go to <https://vercel.com/new> and sign in with GitHub.
2. Under **Import Git Repository**, choose `jacquesmofa/Na_Level_Empire`
   (click **Adjust GitHub App Permissions** if it isn't listed).
3. Leave the settings Vercel detects; `vercel.json` already sets the build
   command, output folder and routing. Production branch: `main`.
4. Click **Deploy**. Note the address Vercel gives the project, e.g.
   `https://na-level-empire.vercel.app`. Every pull request now gets its
   own preview link, posted on the pull request.

## 2. Forms: Web3Forms access key

1. Go to <https://web3forms.com>, enter `levelempiremedia@gmail.com`, click
   **Create Access Key**. The key arrives by email.
2. In Vercel: **Project → Settings → Environment Variables → Add**.
   - Name: `VITE_WEB3FORMS_ACCESS_KEY`
   - Value: the access key from the email
   - Environments: Production, Preview and Development
3. **Redeploy** (Deployments → latest → ⋯ → Redeploy). The key is built
   into the site, so it only takes effect on the next build.
4. Test: send the quote form on the site; the message should arrive at
   levelempiremedia@gmail.com and the page should say "Message Sent!".

The Web3Forms "programmatic access" API (`api.web3forms.com/v1`) is only
for reading submissions back; the site doesn't need it.

## 3. CMS login: GitHub OAuth App (phase c)

Do this once the Vercel address from step 1 exists.

1. Go to <https://github.com/settings/developers> → **OAuth Apps** →
   **New OAuth App**.
2. Fill in:
   - Application name: `Na Level Empire CMS`
   - Homepage URL: `https://<your-project>.vercel.app`
   - Authorization callback URL: `https://<your-project>.vercel.app/api/callback`
   - Enable Device Flow: leave unticked
3. Click **Register application**. Copy the **Client ID**.
4. Click **Generate a new client secret** and copy it immediately (GitHub
   shows it once). Never paste it into chat, email or the repository.
5. In Vercel (**Settings → Environment Variables**), add for Production and
   Preview:
   - `GITHUB_OAUTH_ID` = the Client ID
   - `GITHUB_OAUTH_SECRET` = the client secret (tick **Sensitive**)
   - `CMS_ALLOWED_ORIGINS` = `https://<your-project>.vercel.app` plus your
     preview domain pattern, comma-separated (the exact value is given in
     the phase (c) pull request)
6. Redeploy.

When a custom domain is added later, update the Homepage and callback URLs
in the OAuth App and `CMS_ALLOWED_ORIGINS` to match.

### Fallback login (no OAuth App needed)

1. GitHub → **Settings → Developer settings → Personal access tokens →
   Fine-grained tokens → Generate new token**.
2. Repository access: **Only select repositories** → `Na_Level_Empire`.
   Permissions: **Contents: Read and write**. Set an expiry date.
3. On `/admin`, choose **Sign in with access token** and paste it there
   (it stays in that browser only).

## 4. Editors

- Repo access: GitHub → repository **Settings → Collaborators → Add
  people** → the editor's GitHub username → role **Write**.
- Images: each editor also needs a login to the Cloudinary account
  (cloud `beavj5sp`), because the CMS image picker is Cloudinary's own
  widget. Invite them in Cloudinary under **Settings → Users**. The API
  secret is never needed by editors or by the site.
