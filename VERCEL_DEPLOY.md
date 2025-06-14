# Vercel Deployment - AI Marketing Platform

## Step-by-Step Deployment

### 1. Import to Vercel
- Go to [vercel.com](https://vercel.com) and sign in
- Click "New Project"
- Import from GitHub (connect your repository)
- Select your AI marketing platform repository

### 2. Project Settings
- **Framework Preset**: Other
- **Root Directory**: Leave blank (/)
- **Build Command**: `cd client && npm run build`
- **Output Directory**: `client/dist`
- **Install Command**: `npm install`

### 3. Environment Variables
Add these in Vercel project settings:

```
DATABASE_URL=your_postgresql_connection_string
OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
NODE_ENV=production
```

### 4. Database Setup Options

**Option A: Use Current Database**
Your Replit PostgreSQL can work with Vercel if accessible externally.

**Option B: New Database (Recommended)**
- **Neon.tech**: Free PostgreSQL hosting
- **Supabase**: Free tier with dashboard
- **PlanetScale**: MySQL alternative

For new database, run: `npm run db:push` to create tables.

### 5. Deploy
- Click "Deploy"
- Vercel builds and deploys automatically
- Your app will be live at `yourproject.vercel.app`

## Files Configured
- `vercel.json` - Optimized for your stack
- Environment variables documented
- Build process configured for React + Express

## Post-Deployment
1. Test Arabic/English language toggle
2. Verify AI ad generation works
3. Check database connections
4. Test payment flow (use Stripe test mode)

Your application is production-ready with all features functional.