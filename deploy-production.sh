#!/bin/bash

echo "🚀 Deploying to Vercel - holiday.ailydian.com"
echo "======================================"

# Check if build succeeded
if [ ! -d ".next" ]; then
  echo "❌ Build not found. Please run: npm run build"
  exit 1
fi

echo "✅ Build found"
echo "📦 Deploying to Vercel..."

# Deploy to production
vercel --prod \
  --yes \
  --env ZAI_API_KEY="0b998f08ad254651add417cd88aad5d1.e8ETrtii1Ag5AYvT" \
  --env ENABLE_MULTI_PROVIDER_ROUTING="true" \
  --env DEFAULT_AI_PROVIDER="zai" \
  --env ENABLE_COST_OPTIMIZATION="true" \
  --env CRON_SECRET="0b998f08ad254651add417cd88aad5d1" \
  --env NEXT_PUBLIC_SITE_URL="https://holiday.ailydian.com"

echo ""
echo "✅ Deployment initiated!"
echo "🔗 Check progress: https://vercel.com/lydian-projects/travel-ailydian-holiday/H9h1ZZFvJiNyYWJ7bUN4bRVJYpTu"
echo ""
echo "⏳ Waiting for deployment to complete..."
sleep 10
echo "📊 Deployment status: Check Vercel dashboard"
