#!/bin/bash

# Fix GitHub EISDIR Error Script
# This script helps remove duplicate files that cause EISDIR errors

echo "🔧 Fixing GitHub EISDIR Error..."

# Check for duplicate intro.md files
echo "Checking for duplicate intro.md files..."

if [ -f "docs/setup-guide/intro.md" ]; then
    echo "❌ Found duplicate intro.md in docs/setup-guide/"
    echo "Removing duplicate file..."
    rm "docs/setup-guide/intro.md"
    echo "✅ Duplicate file removed"
else
    echo "✅ No duplicate intro.md files found locally"
fi

# Check if intro.md exists in main docs directory
if [ -f "docs/intro.md" ]; then
    echo "✅ Main intro.md file exists"
else
    echo "❌ Main intro.md file missing"
    exit 1
fi

# Test build
echo "Testing build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "🚀 Ready to push to GitHub"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

echo "📝 Next steps:"
echo "1. git add ."
echo "2. git commit -m 'Fix EISDIR error - remove duplicate files'"
echo "3. git push origin main" 