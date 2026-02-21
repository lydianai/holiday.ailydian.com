/**
 * Rentals API - Real Backend Integration
 * Endpoint: /api/rentals
 * Methods: GET (list), POST (create booking)
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import rentalProperties from '@/data/rental-properties';
import antalyaRentals from '@/data/antalya-rentals';

// Combine all rental properties
const allRentals = [
  ...rentalProperties,
  ...antalyaRentals,
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      // Query parameters
      const {
        location,
        type,
        minPrice,
        maxPrice,
        bedrooms,
        minRating,
        amenities,
        limit = '20',
        offset = '0',
      } = req.query;

      let filtered = [...allRentals];

      // Filter by location
      if (location && typeof location === 'string') {
        filtered = filtered.filter(rental =>
          rental.location.city.toLowerCase().includes(location.toLowerCase()) ||
          rental.location.region.toLowerCase().includes(location.toLowerCase()) ||
          rental.location.country.toLowerCase().includes(location.toLowerCase())
        );
      }

      // Filter by property type
      if (type && typeof type === 'string') {
        filtered = filtered.filter(rental =>
          rental.type.toLowerCase() === type.toLowerCase()
        );
      }

      // Filter by price range (per night)
      if (minPrice) {
        filtered = filtered.filter(rental =>
          rental.pricing.perNight >= Number(minPrice)
        );
      }

      if (maxPrice) {
        filtered = filtered.filter(rental =>
          rental.pricing.perNight <= Number(maxPrice)
        );
      }

      // Filter by bedrooms
      if (bedrooms) {
        filtered = filtered.filter(rental =>
          rental.specifications.bedrooms >= Number(bedrooms)
        );
      }

      // Filter by rating
      if (minRating) {
        filtered = filtered.filter(rental =>
          rental.rating >= Number(minRating)
        );
      }

      // Filter by amenities
      if (amenities && typeof amenities === 'string') {
        const requiredAmenities = amenities.split(',').map(a => a.trim().toLowerCase());
        filtered = filtered.filter(rental =>
          requiredAmenities.every(required =>
            rental.amenities.some(amenity =>
              amenity.toLowerCase().includes(required)
            )
          )
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
      const { rentalId, checkIn, checkOut, guests } = req.body;

      // Validate required fields
      if (!rentalId || !checkIn || !checkOut || !guests) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: rentalId, checkIn, checkOut, guests'
        });
      }

      // Find rental
      const rental = allRentals.find(r => r.id === rentalId);
      if (!rental) {
        return res.status(404).json({
          success: false,
          error: 'Rental property not found'
        });
      }

      // Calculate nights
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

      if (nights <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Check-out date must be after check-in date'
        });
      }

      // Calculate total price
      const perNight = rental.pricing.perNight;
      const subtotal = perNight * nights;
      const cleaningFee = rental.pricing.cleaningFee || 50;
      const serviceFee = Math.round(subtotal * 0.1); // 10% service fee
      const totalPrice = subtotal + cleaningFee + serviceFee;

      // Check guest capacity
      if (guests > rental.specifications.maxGuests) {
        return res.status(400).json({
          success: false,
          error: `Guest count exceeded. Max: ${rental.specifications.maxGuests}, Requested: ${guests}`
        });
      }

      // Generate booking reference
      const bookingReference = `RNT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Create booking
      const booking = {
        id: bookingReference,
        rental: {
          id: rental.id,
          name: rental.name,
          type: rental.type,
          location: rental.location,
        },
        stay: {
          checkIn,
          checkOut,
          nights,
          guests,
        },
        pricing: {
          perNight,
          subtotal,
          cleaningFee,
          serviceFee,
          total: totalPrice,
          currency: rental.pricing.currency,
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
    console.error('Rentals API error:', error);

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
}
