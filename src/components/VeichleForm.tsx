import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useStore } from '../store/useStore';
import * as api from '../services/api';

const vehicleSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.string().regex(/^\d{4}$/, 'Must be a valid year'),
  licensePlate: z.string().min(1, 'License plate is required'),
  vehicleType: z.enum(['sedan', 'suv', 'van', 'truck']),
  capacity: z.string().min(1, 'Capacity is required'),
  status: z.enum(['active', 'maintenance', 'inactive']),
  insuranceExpiry: z.string().min(1, 'Insurance expiry date is required'),
  registrationExpiry: z.string().min(1, 'Registration expiry date is required'),
  driverId: z.string().optional(),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface VehicleFormProps {
  vehicleId?: string;
  onClose: () => void;
}

export function VehicleForm({ vehicleId, onClose }: VehicleFormProps) {
  const [error, setError] = React.useState<string | null>(null);
  const addVehicle = useStore((state) => state.addVehicle);
  const updateVehicle = useStore((state) => state.updateVehicle);
  const vehicles = useStore((state) => state.vehicles);
  const drivers = useStore((state) => 
    state.drivers.filter((d) => d.status === 'active' && !d.vehicleId)
  );

  const vehicle = vehicleId ? vehicles.find((v) => v.id === vehicleId) : null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: vehicle
      ? {
          ...vehicle,
          year: vehicle.year.toString(),
          capacity: vehicle.capacity.toString(),
          insuranceExpiry: vehicle.insuranceExpiry.toISOString().split('T')[0],
          registrationExpiry: vehicle.registrationExpiry.toISOString().split('T')[0],
        }
      : undefined,
  });

  const onSubmit = async (data: VehicleFormData) => {
    try {
      setError(null);
      const vehicleData = {
        ...data,
        year: parseInt(data.year),
        capacity: parseInt(data.capacity),
        insuranceExpiry: new Date(data.insuranceExpiry),
        registrationExpiry: new Date(data.registrationExpiry),
      };

      if (vehicle) {
        const updatedVehicle = await api.updateVehicle(vehicle.id, vehicleData);
        updateVehicle(vehicle.id, updatedVehicle);
      } else {
        const newVehicle = await api.createVehicle(vehicleData);
        addVehicle(newVehicle);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save vehicle');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Make</label>
          <input
            type="text"
            {...register('make')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.make && (
            <p className="mt-1 text-sm text-red-600">{errors.make.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Model</label>
          <input
            type="text"
            {...register('model')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.model && (
            <p className="mt-1 text-sm text-red-600">{errors.model.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Year</label>
          <input
            type="text"
            {...register('year')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.year && (
            <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">License Plate</label>
          <input
            type="text"
            {...register('licensePlate')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.licensePlate && (
            <p className="mt-1 text-sm text-red-600">{errors.licensePlate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
          <select
            {...register('vehicleType')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="van">Van</option>
            <option value="truck">Truck</option>
          </select>
          {errors.vehicleType && (
            <p className="mt-1 text-sm text-red-600">{errors.vehicleType.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Capacity</label>
          <input
            type="number"
            {...register('capacity')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.capacity && (
            <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Insurance Expiry</label>
          <input
            type="date"
            {...register('insuranceExpiry')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.insuranceExpiry && (
            <p className="mt-1 text-sm text-red-600">{errors.insuranceExpiry.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Registration Expiry</label>
          <input
            type="date"
            {...register('registrationExpiry')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.registrationExpiry && (
            <p className="mt-1 text-sm text-red-600">{errors.registrationExpiry.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            {...register('status')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
            <option value="inactive">Inactive</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Assign Driver (Optional)</label>
          <select
            {...register('driverId')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select a driver</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name}
              </option>
            ))}
          </select>
        </div>
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
          {isSubmitting ? 'Saving...' : vehicle ? 'Update Vehicle' : 'Add Vehicle'}
        </button>
      </div>
    </form>
  );
}