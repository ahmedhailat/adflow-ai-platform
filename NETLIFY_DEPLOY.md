# Netlify Deployment - Step by Step

## 5-Minute Netlify Deployment

### Step 1: Build Your Application
```bash
cd client
npm run build
```

### Step 2: Deploy to Netlify
1. Go to [netlify.com](https://netlify.com) and sign up
2. Click "Add new site" → "Deploy manually"
3. Drag and drop your `client/dist` folder
4. Your site is live instantly!

### Step 3: Add Environment Variables (for API features)
In Netlify dashboard:
- Go to Site Settings → Environment Variables
- Add:
  ```
  VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
  OPENAI_API_KEY=your_openai_api_key
  DATABASE_URL=your_database_url
  STRIPE_SECRET_KEY=your_stripe_secret_key
  ```

### Step 4: Connect GitHub (Optional)
- Go to Site Settings → Build & Deploy
- Connect your GitHub repository
- Set build command: `cd client && npm run build`
- Set publish directory: `client/dist`

## Alternative: Vercel (Also 5 minutes)

### Step 1: Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import from GitHub
4. Select your repository

### Step 2: Configure Build
- Framework: React
- Build Command: `cd client && npm run build`
- Output Directory: `client/dist`
- Root Directory: `/`

### Step 3: Add Environment Variables
Same as Netlify - add your API keys in project settings.

## Files Ready for Deployment
- `netlify.toml` - Netlify configuration
- `netlify/functions/api.js` - Serverless API
- `vercel.json` - Vercel configuration

## Your Application Features
✅ Arabic/English language toggle
✅ AI ad generation interface
✅ Campaign management dashboard
✅ Pricing pages with Stripe integration
✅ Professional UI/UX

The frontend will work immediately. API features will work once you add environment variables.