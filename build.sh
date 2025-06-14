#!/bin/bash

# Build script for Vercel deployment
echo "Building AI Marketing Platform for production..."

# Install dependencies
npm install

# Build the client
echo "Building frontend..."
cd client
npm run build
cd ..

# Copy client build to root for Vercel
cp -r client/dist ./dist

echo "Build completed successfully!"
echo "Ready for Vercel deployment"