import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Calendar, DollarSign, User } from 'lucide-react';
import { useStore } from '../store/useStore';

const bookingSchema = z.object({
  pickupLocation: z.object({
    address: z.string().min(1, 'Pickup location is required'),
    lat: z.number(),
    lng: z.number(),
  }),
  dropoffLocation: z.object({
    address: z.string().min(1, 'Dropoff location is required'),
    lat: z.number(),
    lng: z.number(),
  }),
  pickupTime: z.string().min(1, 'Pickup time is required'),
  driverId: z.string().optional(),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  onClose: () => void;
}

export function BookingForm({ onClose }: BookingFormProps) {
  const drivers = useStore((state) => state.drivers);
  const addBooking = useStore((state) => state.addBooking);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = async (data: BookingFormData) => {
    try {
      const newBooking = {
        id: Math.random().toString(36).substr(2, 9),
        clientId: '1', // In a real app, this would come from the authenticated user
        status: 'pending',
        pickupLocation: {
          address: data.pickupLocation.address,
          lat: data.pickupLocation.lat || 0,
          lng: data.pickupLocation.lng || 0,
        },
        dropoffLocation: {
          address: data.dropoffLocation.address,
          lat: data.dropoffLocation.lat || 0,
          lng: data.dropoffLocation.lng || 0,
        },
        pickupTime: new Date(data.pickupTime),
        price: 35.00, // In a real app, this would be calculated based on distance
        paymentStatus: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        driverId: data.driverId,
      };

      addBooking(newBooking);
      onClose();
    } catch (error) {
      console.error('Failed to create booking:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Pickup Location</label>
        <div className="mt-1 relative">
          <input
            type="text"
            {...register('pickupLocation.address')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter pickup address"
          />
          <MapPin className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        {errors.pickupLocation?.address && (
          <p className="mt-1 text-sm text-red-600">{errors.pickupLocation.address.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Dropoff Location</label>
        <div className="mt-1 relative">
          <input
            type="text"
            {...register('dropoffLocation.address')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter dropoff address"
          />
          <MapPin className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        {errors.dropoffLocation?.address && (
          <p className="mt-1 text-sm text-red-600">{errors.dropoffLocation.address.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Pickup Time</label>
        <div className="mt-1 relative">
          <input
            type="datetime-local"
            {...register('pickupTime')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        {errors.pickupTime && (
          <p className="mt-1 text-sm text-red-600">{errors.pickupTime.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Preferred Driver (Optional)</label>
        <select
          {...register('driverId')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select a driver</option>
          {drivers
            .filter((driver) => driver.isAvailable)
            .map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name} - {driver.vehicleType}
              </option>
            ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
        <textarea
          {...register('notes')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Any special requirements?"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Booking'}
        </button>
      </div>
    </form>
  );
}