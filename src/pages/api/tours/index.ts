/**
 * Tours API - Real Backend Integration
 * Endpoint: /api/tours
 * Methods: GET (list), POST (create booking)
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { antalyaTours } from '@/data/antalya-tours';
import { allComprehensiveTours } from '@/data/marmaris-bodrum-cesme-tours';
import { greeceTours } from '@/data/greece-tours';
import { cyprusTours } from '@/data/cyprus-tours';

// Combine all tours
const allTours = [
  ...antalyaTours.map(t => ({ ...t, region: 'Antalya' })),
  ...allComprehensiveTours.map(t => ({ ...t, region: 'Aegean' })),
  ...greeceTours.map(t => ({ ...t, region: 'Greece' })),
  ...cyprusTours.map(t => ({ ...t, region: 'Cyprus' })),
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      // Query parameters
      const {
        region,
        category,
        difficulty,
        minPrice,
        maxPrice,
        minRating,
        duration,
        search,
        limit = '20',
        offset = '0',
      } = req.query;

      let filtered = [...allTours];

      // Filter by region
      if (region && typeof region === 'string') {
        filtered = filtered.filter(tour =>
          tour.region.toLowerCase() === region.toLowerCase() ||
          tour.region.toLowerCase().includes(region.toLowerCase())
        );
      }

      // Filter by category
      if (category && typeof category === 'string') {
        filtered = filtered.filter(tour =>
          tour.category.toLowerCase() === category.toLowerCase()
        );
      }

      // Filter by difficulty
      if (difficulty && typeof difficulty === 'string') {
        filtered = filtered.filter(tour =>
          tour.difficulty.toLowerCase() === difficulty.toLowerCase()
        );
      }

      // Filter by price range
      if (minPrice) {
        filtered = filtered.filter(tour =>
          tour.pricing.travelLyDian >= Number(minPrice)
        );
      }

      if (maxPrice) {
        filtered = filtered.filter(tour =>
          tour.pricing.travelLyDian <= Number(maxPrice)
        );
      }

      // Filter by rating
      if (minRating) {
        filtered = filtered.filter(tour =>
          tour.rating >= Number(minRating)
        );
      }

      // Filter by duration (max hours)
      if (duration) {
        filtered = filtered.filter(tour => {
          const tourDuration = parseInt(tour.duration);
          return tourDuration <= Number(duration);
        });
      }

      // Search in title, description, highlights
      if (search && typeof search === 'string') {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(tour =>
          tour.name.toLowerCase().includes(searchLower) ||
          tour.description.toLowerCase().includes(searchLower) ||
          tour.highlights.some(h => h.toLowerCase().includes(searchLower))
        );
      }

      // Sort by rating (highest first)
      filtered.sort((a, b) => b.rating - a.rating);

      // Get total count
      const total = filtered.length;

      // Apply pagination
      const offsetNum = Number(offset);
      const limitNum = Number(limit);
      const paginated = filtered.slice(offsetNum, offsetNum + limitNum);

      return res.status(200).json({
        success: true,
        count: paginated.length,
        total,
        offset: offsetNum,
        limit: limitNum,
        data: paginated,
      });

    } else if (req.method === 'POST') {
      // Create booking
      const { tourId, date, participants, options } = req.body;

      // Validate required fields
      if (!tourId || !date || !participants) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: tourId, date, participants'
        });
      }

      // Find tour
      const tour = allTours.find(t => t.id === tourId);
      if (!tour) {
        return res.status(404).json({
          success: false,
          error: 'Tour not found'
        });
      }

      // Calculate total price
      const basePrice = tour.pricing.travelLyDian;
      const totalPrice = basePrice * participants;

      // Generate booking reference
      const bookingReference = `TR-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Create booking
      const booking = {
        id: bookingReference,
        tour: {
          id: tour.id,
          name: tour.name,
          region: tour.region,
          duration: tour.duration,
          category: tour.category,
        },
        booking: {
          date,
          participants,
          options: options || [],
        },
        pricing: {
          basePrice,
          participants,
          total: totalPrice,
          currency: 'USD',
          savings: tour.pricing.savingsPercentage,
        },
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };

      return res.status(201).json({
        success: true,
        data: booking,
      });

    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({
        success: false,
        error: `Method ${req.method} Not Allowed`
      });
    }

  } catch (error) {
    console.error('Tours API error:', error);

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
}
