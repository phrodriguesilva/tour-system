import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Car, Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VehicleForm } from '../components/VeichleForm';
import { Modal } from '../components/Modal';

export function VehicleManagement() {
  const [isNewVehicleModalOpen, setIsNewVehicleModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const vehicles = useStore((state) => state.vehicles);
  const drivers = useStore((state) => state.drivers);

  const filteredVehicles = vehicles.filter((vehicle) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      vehicle.make.toLowerCase().includes(searchLower) ||
      vehicle.model.toLowerCase().includes(searchLower) ||
      vehicle.licensePlate.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Vehicle Management</h1>
        <button
          onClick={() => setIsNewVehicleModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Vehicle
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search vehicles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-12">
            <Car className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No vehicles</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new vehicle.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredVehicles.map((vehicle) => {
              const assignedDriver = drivers.find((d) => d.id === vehicle.driverId);
              return (
                <li key={vehicle.id}>
                  <Link
                    to={`/vehicles/${vehicle.id}`}
                    className="block hover:bg-gray-50"
                  >
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Car className="h-6 w-6 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-blue-600 truncate">
                              {vehicle.make} {vehicle.model} ({vehicle.year})
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              {vehicle.licensePlate}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              vehicle.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : vehicle.status === 'maintenance'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            Type: {vehicle.vehicleType.charAt(0).toUpperCase() + vehicle.vehicleType.slice(1)}
                          </p>
                        </div>
                        {assignedDriver && (
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <p>Assigned to: {assignedDriver.name}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Modal
        isOpen={isNewVehicleModalOpen}
        onClose={() => setIsNewVehicleModalOpen(false)}
        title="Add New Vehicle"
      >
        <VehicleForm onClose={() => setIsNewVehicleModalOpen(false)} />
      </Modal>
    </div>
  );
}