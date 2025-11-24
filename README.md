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


