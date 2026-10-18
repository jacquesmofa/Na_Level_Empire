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

## 3. Move the images to Cloudinary (one time)

1. Cloudinary → **Settings → Upload → Upload presets → Add upload preset**.
2. Name `nlem_migration`, Signing mode **Unsigned**, Asset folder `nlem`. Save.
3. Tell Claude it exists. Claude runs the move from your computer's browser
   (Cloudinary copies each image from Readdy itself; no API secret).
4. After Claude confirms the move, delete the preset again.

## 4. CMS login: GitHub OAuth App

Uses the site's public production address from Vercel → Settings → Domains
(written `<site>` below).

1. Go to <https://github.com/settings/applications/new>.
2. Fill in:
   - Application name: `Na Level Empire CMS`
   - Homepage URL: `https://<site>`
   - Authorization callback URL: `https://<site>/api/callback`
   - Enable Device Flow: leave unticked
3. Click **Register application**, then copy the **Client ID**.
4. Click **Generate a new client secret** and copy it immediately (GitHub
   shows it once). Never paste it into chat, email or the repository.
5. Vercel → Settings → Environment Variables, for Production and Preview:
   - `GITHUB_OAUTH_ID` = the Client ID
   - `GITHUB_OAUTH_SECRET` = the client secret (tick **Sensitive**)
   - `CMS_ALLOWED_ORIGINS` = `https://na-level-empire-*-jacques15.vercel.app`
     (lets you sign in on pull-request previews too)
6. Redeploy (Deployments → latest → ⋯ → Redeploy), open `https://<site>/admin`
   and choose **Sign In with GitHub**.

When a custom domain is added later, update the two URLs in the OAuth App.

### Fallback login (no OAuth App needed)

1. GitHub → **Settings → Developer settings → Personal access tokens →
   Fine-grained tokens → Generate new token**.
2. Repository access: **Only select repositories** → `Na_Level_Empire`.
   Permissions: **Contents: Read and write**. Set an expiry date.
3. On `/admin`, choose **Sign In Using Access Token** and paste it there
   (it stays in that browser only).

## 5. Editors

- Repo access: GitHub → repository **Settings → Collaborators → Add
  people** → the editor's GitHub username → role **Write**.
- Images: each editor also needs a login to the Cloudinary account
  (cloud `beavj5sp`), because the CMS image picker is Cloudinary's own
  widget. Invite them in Cloudinary under **Settings → Users**. The API
  secret is never needed by editors or by the site.
