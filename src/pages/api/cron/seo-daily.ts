/**
 * Cron Job: Daily SEO Content Generation
 * Runs every day at 2 AM UTC
 * Endpoint: /api/cron/seo-daily
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { AutonomousSEOAgent } from '@/lib/autonomous/seo-agent';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Verify cron secret (recommended for production)
  const cronSecret = req.headers['x-vercel-cron-secret'] || req.query.secret;

  if (cronSecret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🚀 Starting daily SEO content generation...');

    // Initialize SEO agent
    const seoAgent = new AutonomousSEOAgent({
      zaiApiKey: process.env.ZAI_API_KEY || '',
      enabled: true,
    });

    // Run daily content generation
    const results = await seoAgent.runDailyContentGeneration();

    const successCount = results.filter(r => r.status === 'success').length;
    const failCount = results.filter(r => r.status === 'failed').length;

    console.log(`✅ Daily SEO generation complete: ${successCount} success, ${failCount} failed`);

    return res.status(200).json({
      success: true,
      message: 'Daily SEO content generation completed',
      stats: {
        total: results.length,
        success: successCount,
        failed: failCount,
      },
      results: results,
    });

  } catch (error) {
    console.error('❌ Daily SEO cron failed:', error);

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
}
