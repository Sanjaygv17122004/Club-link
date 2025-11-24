# ClubLink

Short: ClubLink is a clubs & events platform (frontend + Node/Express + Prisma + MySQL).  
This README explains how to run the project locally, seed an admin, and upload files.

## Prerequisites
- Node.js 18+ (recommended)
- npm
- MySQL or compatible DB
- Git

## Setup

1. Clone
```bash
git clone https://github.com/Sanjaygv17122004/Club-link.git
cd Club-link
```

2. Backend (.env and DB)
- Copy a sample .env (create `server/.env`) and set `DATABASE_URL`:
```
# server/.env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/your_db_name"
JWT_SECRET="your_jwt_secret"
```
- Install and migrate:
```powershell
cd server
npm install
# generate/prisma client (if needed)
npx prisma generate
# run migrations (creates schema)
npx prisma migrate dev --name init
# seed default data (if provided)
node prisma/seed.ts
```

3. Add an admin (optional)
```powershell
# from project root
npm --prefix .\server run add-admin -- --email=admin2@example.com --password='Admin2Pass123!' --name="Admin Two"
```

4. Start backend
```powershell
cd server
npm run dev
# defaults: backend runs at http://localhost:4000
```

5. Frontend
- Set frontend env (create `.env` in project root or add `VITE_API_URL`):
```
VITE_API_URL=http://localhost:4000
```
- Install and run:
```powershell
cd ..
npm install
npm run dev
# opens at http://localhost:5173 (Vite) by default
```

6. Uploads
- Uploaded files are saved under `server/uploads` and served at `http://localhost:4000/uploads/<file>`.

## Notes and troubleshooting
- If images don't display: confirm `post.mediaUrl` is a full URL or set `VITE_API_URL` so frontend resolves relative paths.
- If you see `-tagger` or other malformed imports after a find/replace, restore `vite.config.ts` from git or re-install the original plugin packages.
- Do not commit `.env` files. Ensure `server/.env` is in `.gitignore`.

## Changing bundled "Lovable" branding
This project was created from a template that included references to the "Lovable" generator and the `lovable-tagger` package. To remove or rename those references follow the steps below.

- Search for occurrences (PowerShell):
```powershell
Get-ChildItem -Recurse -File | Select-String -Pattern "lovable|loveable" -CaseSensitive:$false | Select-Object -ExpandProperty Path -Unique
```

- Common places to update:
	- `vite.config.ts` — remove or replace `import { componentTagger } from "lovable-tagger";` if you don't need the plugin. Remove or adjust the plugin usage in the `plugins` array.
	- `package.json` — remove the `lovable-tagger` dependency and run `npm install` to update `package-lock.json`.
	- `index.html` — update meta tags in the `<head>` (author, og:description, og:image, twitter site/image) to your project's name and images.
	- Any README or other docs that still mention "Lovable".

- To remove the dependency and clean lockfile:
```powershell
cd Club-link
npm uninstall lovable-tagger
rm -Force package-lock.json # or delete manually on Windows Explorer
npm install
```

- If `vite.config.ts` used `componentTagger` and you removed the package, open `vite.config.ts` and either remove that import and plugin entry or replace the plugin with an alternative.

- If you accidentally replaced text and broke imports (e.g. `-tagger` remains), restore from git if available:
```powershell
# restore the file from the last commit
git restore --source=HEAD -- vite.config.ts
```

CAUTION: If you want to remove all historical occurrences from git history, that requires a history rewrite (git-filter-repo or BFG). Do not run those on a shared repository without coordinating with collaborators.

## Pushing this project to GitHub (frontend + server)
1. Create a GitHub repository (empty) at `https://github.com/<your-username>/<repo>.git`

2. From project root (`Club-link`) set remote and push:
```powershell
cd C:\Users\user\OneDrive\Pictures\projects\club\Club-link
git add -A
git commit -m "chore: initial import"
git remote remove origin 2>$null
git remote add origin https://github.com/<your-username>/<repo>.git
git push -u origin HEAD
```

If pushing fails due to unrelated remote history, push to a new branch:
```powershell
git checkout -b import-branch
git push -u origin import-branch
```

If you want me to perform the search-and-replace for the "Lovable" tokens or remove the dependency automatically, tell me and I can apply the edits and run `npm install` for you (I will not force-rewrite git history unless you explicitly ask).

## Contributing
- Work on feature branches and open PRs.
