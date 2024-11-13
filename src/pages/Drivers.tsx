import React from 'react';
import { useStore } from '../store/useStore';
import { Car, Star } from 'lucide-react';

export function Drivers() {
  const drivers = useStore((state) => state.drivers);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Drivers</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
          Add Driver
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        {drivers.length === 0 ? (
          <div className="p-6 text-center">
            <Car className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No drivers</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new driver.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {drivers.map((driver) => (
              <li key={driver.id} className="p-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={driver.avatar || `https://ui-avatars.com/api/?name=${driver.name}`}
                    alt={driver.name}
                    className="h-12 w-12 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{driver.name}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Car className="h-4 w-4" />
                      <span>{driver.vehicleType}</span>
                      <span>•</span>
                      <span>{driver.licensePlate}</span>
                    </div>
                  </div>
                  <div className="ml-auto flex items-center space-x-4">
                    <div className="flex items-center text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1 text-sm font-medium">{driver.rating.toFixed(1)}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      driver.isAvailable
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {driver.isAvailable ? 'Available' : 'Busy'}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}