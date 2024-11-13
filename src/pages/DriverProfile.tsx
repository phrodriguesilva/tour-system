import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Car, MapPin, Calendar, Phone, Mail, User, Star } from 'lucide-react';
import { useStore } from '../store/useStore';
import * as api from '../services/api';

const driverSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  licenseNumber: z.string().min(5, 'License number is required'),
  licenseExpiry: z.string().min(1, 'License expiry date is required'),
  status: z.enum(['active', 'inactive', 'suspended']),
});

type DriverFormData = z.infer<typeof driverSchema>;

export function DriverProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  const driver = useStore(state => state.drivers.find(d => d.id === id));
  const updateDriver = useStore(state => state.updateDriver);
  const vehicles = useStore(state => state.vehicles.filter(v => v.driverId === id));

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<DriverFormData>({
    resolver: zodResolver(driverSchema),
    defaultValues: driver ? {
      name: driver.name,
      email: driver.email,
      phone: driver.phone || '',
      licenseNumber: driver.licenseNumber,
      licenseExpiry: driver.licenseExpiry.toISOString().split('T')[0],
      status: driver.status,
    } : undefined
  });

  if (!driver) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Driver not found</h2>
        <button
          onClick={() => navigate('/drivers')}
          className="mt-4 text-blue-600 hover:text-blue-700"
        >
          Back to Drivers
        </button>
      </div>
    );
  }

  const onSubmit = async (data: DriverFormData) => {
    try {
      setError(null);
      const updatedDriver = await api.updateDriver(driver.id, {
        ...data,
        licenseExpiry: new Date(data.licenseExpiry),
      });
      updateDriver(driver.id, updatedDriver);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update driver');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Driver Profile</h1>
        <div className="flex space-x-3">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg">
            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    {...register('name')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    {...register('email')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">License Number</label>
                  <input
                    type="text"
                    {...register('licenseNumber')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.licenseNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.licenseNumber.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">License Expiry</label>
                  <input
                    type="date"
                    {...register('licenseExpiry')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.licenseExpiry && (
                    <p className="mt-1 text-sm text-red-600">{errors.licenseExpiry.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    {...register('status')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                  {errors.status && (
                    <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                  )}
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      reset();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6 space-y-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={driver.avatar || `https://ui-avatars.com/api/?name=${driver.name}`}
                    alt={driver.name}
                    className="h-16 w-16 rounded-full"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{driver.name}</h2>
                    <div className="flex items-center mt-1">
                      <Star className="h-5 w-5 text-yellow-400" />
                      <span className="ml-1 text-sm text-gray-600">{driver.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 flex items-center text-sm text-gray-900">
                      <Mail className="h-4 w-4 mr-2" />
                      {driver.email}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="mt-1 flex items-center text-sm text-gray-900">
                      <Phone className="h-4 w-4 mr-2" />
                      {driver.phone}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">License Number</dt>
                    <dd className="mt-1 flex items-center text-sm text-gray-900">
                      <User className="h-4 w-4 mr-2" />
                      {driver.licenseNumber}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">License Expiry</dt>
                    <dd className="mt-1 flex items-center text-sm text-gray-900">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(driver.licenseExpiry).toLocaleDateString()}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        driver.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : driver.status === 'suspended'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
                      </span>
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">Total Trips</dt>
                    <dd className="mt-1 text-sm text-gray-900">{driver.totalTrips}</dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Assigned Vehicle */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Assigned Vehicle</h3>
            {vehicles.length > 0 ? (
              vehicles.map(vehicle => (
                <div key={vehicle.id} className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Car className="h-6 w-6 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {vehicle.make} {vehicle.model} ({vehicle.year})
                      </p>
                      <p className="text-sm text-gray-500">{vehicle.licensePlate}</p>
                    </div>
                  </div>
                  {vehicle.currentLocation && (
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Current Location</p>
                        <p className="text-sm text-gray-500">
                          Last updated: {new Date(vehicle.currentLocation.lastUpdated).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <Car className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">No vehicle assigned</p>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {/* Add recent activity items here */}
              <p className="text-sm text-gray-500">No recent activity</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}