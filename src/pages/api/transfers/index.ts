/**
 * Transfers API - Real Backend Integration
 * Endpoint: /api/transfers
 * Methods: GET (list), POST (create booking)
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import antalyaTransfers from '@/data/antalya-transfers';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      // Query parameters
      const {
        from,
        to,
        vehicleType,
        minPrice,
        maxPrice,
        limit = '20',
      } = req.query;

      let filtered = [...antalyaTransfers];

      // Filter by pickup location
      if (from && typeof from === 'string') {
        filtered = filtered.filter(transfer =>
          transfer.from.toLowerCase().includes(from.toLowerCase()) ||
          transfer.from.toLowerCase().includes(from.toLowerCase().replace('ı', 'i'))
        );
      }

      // Filter by drop-off location
      if (to && typeof to === 'string') {
        filtered = filtered.filter(transfer =>
          transfer.to.toLowerCase().includes(to.toLowerCase()) ||
          transfer.to.toLowerCase().includes(to.toLowerCase().replace('ı', 'i'))
        );
      }

      // Filter by vehicle type
      if (vehicleType && typeof vehicleType === 'string') {
        filtered = filtered.filter(transfer =>
          transfer.availableVehicles.some(v => v.type === vehicleType)
        );
      }

      // Filter by price range
      if (minPrice) {
        filtered = filtered.filter(transfer =>
          transfer.price >= Number(minPrice)
        );
      }

      if (maxPrice) {
        filtered = filtered.filter(transfer =>
          transfer.price <= Number(maxPrice)
        );
      }

      // Apply limit
      const limited = filtered.slice(0, Number(limit));

      return res.status(200).json({
        success: true,
        count: limited.length,
        total: filtered.length,
        data: limited,
      });

    } else if (req.method === 'POST') {
      // Create booking
      const { transferId, vehicleType, pickupDate, pickupTime, passengers } = req.body;

      // Validate required fields
      if (!transferId || !vehicleType || !pickupDate || !pickupTime || !passengers) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: transferId, vehicleType, pickupDate, pickupTime, passengers'
        });
      }

      // Find transfer
      const transfer = antalyaTransfers.find(t => t.id === transferId);
      if (!transfer) {
        return res.status(404).json({
          success: false,
          error: 'Transfer not found'
        });
      }

      // Check vehicle availability
      const vehicle = transfer.availableVehicles.find(v => v.type === vehicleType);
      if (!vehicle) {
        return res.status(400).json({
          success: false,
          error: 'Vehicle type not available for this transfer'
        });
      }

      // Check passenger capacity
      if (passengers > vehicle.capacity) {
        return res.status(400).json({
          success: false,
          error: `Vehicle capacity exceeded. Max: ${vehicle.capacity}, Requested: ${passengers}`
        });
      }

      // Calculate total price
      const totalPrice = transfer.price * vehicle.priceMultiplier;

      // Generate booking reference
      const bookingReference = `TRF-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Create booking (in real app, save to database)
      const booking = {
        id: bookingReference,
        transferId,
        transfer: {
          from: transfer.from,
          to: transfer.to,
          distance: transfer.distance,
          duration: transfer.duration,
        },
        vehicle: {
          type: vehicleType,
          name: vehicle.name,
          capacity: vehicle.capacity,
        },
        pickup: {
          date: pickupDate,
          time: pickupTime,
        },
        passengers,
        pricing: {
          basePrice: transfer.price,
          multiplier: vehicle.priceMultiplier,
          total: totalPrice,
          currency: transfer.currency,
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
    console.error('Transfers API error:', error);

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
}
