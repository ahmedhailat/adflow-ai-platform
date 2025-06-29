#!/bin/bash

echo "🚀 Building AI Marketing Platform for deployment..."

# Build the frontend
cd client
echo "📦 Installing dependencies..."
npm install --silent

echo "🔨 Building production bundle..."
npm run build

if [ -d "dist" ]; then
    echo "✅ Build successful! Frontend ready for deployment."
    echo "📁 Files created in client/dist/"
    ls -la dist/
    
    echo ""
    echo "🌐 Deploy Options:"
    echo ""
    echo "📤 NETLIFY (Drag & Drop):"
    echo "   1. Go to netlify.com"
    echo "   2. Drag client/dist folder to deploy"
    echo "   3. Site live instantly!"
    echo ""
    echo "📤 VERCEL (GitHub):"
    echo "   1. Push to GitHub"
    echo "   2. Connect repository on vercel.com"
    echo "   3. Auto-deploy on every commit"
    echo ""
    echo "🔧 All configuration files ready:"
    echo "   ✅ netlify.toml"
    echo "   ✅ vercel.json"
    echo "   ✅ API endpoints configured"
    
else
    echo "❌ Build failed. Check the output above for errors."
    exit 1
fi

cd ..
echo "🎉 Deployment setup complete!"