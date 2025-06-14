#!/bin/bash

# Deployment script for AI Marketing Platform
echo "🚀 Preparing AI Marketing Platform for deployment..."

# Create production build
echo "📦 Building client application..."
cd client
npm run build
cd ..

# Create production server directory
echo "🔧 Preparing server files..."
mkdir -p production
cp -r server/* production/
cp -r shared production/
cp -r client/dist production/public
cp package.json production/
cp drizzle.config.ts production/

# Create simplified production package.json
cat > production/package.json << 'EOF'
{
  "name": "ai-marketing-platform",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "tsx index.ts"
  },
  "dependencies": {
    "@neondatabase/serverless": "^0.10.3",
    "drizzle-orm": "^0.36.1",
    "express": "^4.21.1",
    "openai": "^4.73.1",
    "stripe": "^17.3.1",
    "ws": "^8.18.0",
    "zod": "^3.23.8"
  }
}
EOF

echo "✅ Production build ready in ./production directory"
echo "📋 Deployment options:"
echo "   1. Railway: Upload ./production folder"
echo "   2. Render: Connect GitHub repository"
echo "   3. Heroku: Git push deployment"
echo ""
echo "🔑 Environment variables needed:"
echo "   DATABASE_URL=your_postgresql_url"
echo "   OPENAI_API_KEY=your_openai_key"
echo "   STRIPE_SECRET_KEY=your_stripe_secret"
echo "   VITE_STRIPE_PUBLIC_KEY=your_stripe_public"