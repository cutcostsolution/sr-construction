# SR Construction — Full-Stack Website

## What this is
Complete website for SR Construction with public pages, admin dashboard, consultation booking, payment evidence workflow, and content management system.

## Public Pages
- Home, About, Services, Projects, Our Network, The Founder, Contact, Blogs
- Book Your Consultation form (free or paid, admin-configurable)
- Floating WhatsApp to 0707 112 2510

## Admin Dashboard
- Kimi OAuth login (admin-only)
- Service / Project / Blog CRUD
- Consultation management with payment verification
- Client records, application review, enquiry inbox
- Settings (contact info, bank account, consultation fee)
- Activity log and notifications

## Tech Stack
- React 19 + TypeScript + Vite + Tailwind CSS
- Hono server + tRPC 11 + Drizzle ORM + MySQL
- Kimi OAuth authentication

## Deploy to Render (Free Tier)

1. Create a Render account at render.com
2. Click "New +" → "Blueprint"
3. Connect your GitHub repo OR use "Upload from ZIP"
4. If using ZIP:
   - Go to "New +" → "Web Service"
   - Upload this project folder as ZIP
   - Set runtime: Node
   - Build command: `npm install && npm run build`
   - Start command: `NODE_ENV=production node dist/boot.js`
5. Add a MySQL database:
   - "New +" → "PostgreSQL" (or use external MySQL like TiDB Cloud)
   - Copy the database connection string
6. Add environment variables in Render dashboard:
   - `DATABASE_URL` (from your database)
   - `APP_ID`, `APP_SECRET`, `OWNER_UNION_ID` (from Kimi project)
   - `KIMI_AGENTGW_API_KEY`, `KIMI_STORAGE_RESOURCE_ID` (from Kimi project)
   - `KIMI_AUTH_URL=https://auth.kimi.ai`
   - `KIMI_OPEN_URL=https://open.kimi.com`
   - `NODE_ENV=production`
7. Click "Create Web Service"

## First Admin Setup
After deployment, the first user to log in via Kimi OAuth becomes the admin. Make sure your Kimi account's union ID matches `OWNER_UNION_ID` in the environment variables.

## Database Setup
After first deploy, run migrations and seed:
```bash
npx drizzle-kit push
npx tsx db/seed.ts
```

## Local Development
```bash
npm install
npm run dev        # Vite dev server (frontend)
npm run db:push    # Push schema to database
npx tsx db/seed.ts # Seed initial content
```

## Bank Account (Admin-Configurable)
Default: SunTrust Bank / Spark Realty And Construction Ltd / 0025929213
Change anytime in Admin → Settings → Bank Account.
