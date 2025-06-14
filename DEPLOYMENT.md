# Vercel Deployment Guide - AI Marketing Platform

## Quick Deploy Steps

### 1. Create Vercel Account
- Go to [vercel.com](https://vercel.com)
- Sign up with GitHub (recommended)

### 2. Connect Your Repository
- Push your code to GitHub first
- In Vercel dashboard: "New Project" → Import from GitHub
- Select your repository

### 3. Configure Environment Variables
In Vercel project settings, add these environment variables:

```
DATABASE_URL=your_postgresql_connection_string
OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

### 4. Deploy Settings
- **Framework Preset**: Other
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `client/dist`
- **Install Command**: `npm install`

### 5. Database Setup
Your PostgreSQL database from Replit can be used, or create a new one:
- **Neon** (recommended): Free PostgreSQL hosting
- **Supabase**: Free tier with dashboard
- **PlanetScale**: MySQL alternative

## Alternative: Railway Deployment

Railway is simpler for full-stack apps:

1. Go to [railway.app](https://railway.app)
2. "Deploy from GitHub"
3. Connect repository
4. Add environment variables
5. Deploy automatically

## Files Already Configured

✅ `vercel.json` - Vercel configuration
✅ `build.sh` - Build script
✅ Environment variables documented
✅ Database schema ready

## Production Checklist

- [ ] GitHub repository created
- [ ] Environment variables copied
- [ ] Database accessible from internet
- [ ] Stripe keys are production keys (when ready)
- [ ] Domain configured (optional)

## Support

Your app is production-ready with:
- PostgreSQL database integration
- Stripe payment processing
- Arabic/English language support
- AI ad generation capabilities
- Professional UI/UX

The deployment process takes 5-10 minutes once environment variables are configured.