import React from 'react';
import { useStore } from '../store/useStore';
import { Calendar, Users, DollarSign, Car } from 'lucide-react';

export function Dashboard() {
  const bookings = useStore((state) => state.bookings);
  const drivers = useStore((state) => state.drivers);

  const stats = [
    {
      name: 'Total Bookings',
      value: bookings.length,
      icon: Calendar,
      change: '+4.75%',
      changeType: 'positive',
    },
    {
      name: 'Active Drivers',
      value: drivers.filter((d) => d.isAvailable).length,
      icon: Car,
      change: '+2.02%',
      changeType: 'positive',
    },
    {
      name: 'Total Revenue',
      value: '$12,545.00',
      icon: DollarSign,
      change: '+54.02%',
      changeType: 'positive',
    },
    {
      name: 'Total Customers',
      value: '2,300',
      icon: Users,
      change: '+12.05%',
      changeType: 'positive',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <select className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
            Download Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
                <div className={`text-sm ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h2>
          <div className="space-y-4">
            {bookings.slice(0, 5).map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Booking #{booking.id}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(booking.pickupTime).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  booking.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : booking.status === 'cancelled'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Drivers</h2>
          <div className="space-y-4">
            {drivers
              .filter((d) => d.isAvailable)
              .slice(0, 5)
              .map((driver) => (
                <div key={driver.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={driver.avatar || `https://ui-avatars.com/api/?name=${driver.name}`}
                    alt={driver.name}
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{driver.name}</p>
                    <p className="text-sm text-gray-600">{driver.vehicleType}</p>
                  </div>
                  <div className="ml-auto flex items-center">
                    <span className="flex items-center text-sm text-yellow-600">
                      ★ {driver.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}