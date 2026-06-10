#!/bin/bash

# Rahva Raamat Documentation Deployment Script
# This script handles the deployment process and fixes common EISDIR issues

echo "🚀 Starting Rahva Raamat Documentation Deployment..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf build/
rm -rf .docusaurus/
rm -rf node_modules/.cache/

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Clear Docusaurus cache
echo "🗑️ Clearing Docusaurus cache..."
npm run clear

# Build the documentation
echo "🔨 Building documentation..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Build files created in 'build/' directory"
    
    # List build contents for verification
    echo "📋 Build contents:"
    ls -la build/
    
    echo "🎉 Deployment preparation complete!"
    echo "💡 Next steps:"
    echo "   1. Upload the contents of 'build/' to your web server"
    echo "   2. Ensure your web server serves index.html for all routes"
    echo "   3. Check that all static assets are accessible"
else
    echo "❌ Build failed!"
    echo "🔍 Check the error messages above for details"
    exit 1
fi
