import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Calendar, MapPin } from 'lucide-react';
import { Modal } from '../components/Modal';
import { BookingForm } from '../components/BookingForm';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export function Bookings() {
  const bookings = useStore((state) => state.bookings);
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        <button
          onClick={() => setIsNewBookingModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
        >
          New Booking
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        {bookings.length === 0 ? (
          <div className="p-6 text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new booking.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <li key={booking.id} className="p-6">
                <Link
                  to={`/bookings/${booking.id}`}
                  className="block hover:bg-gray-50 -m-6 p-6 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Booking #{booking.id}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <MapPin className="h-4 w-4" />
                          <span>{booking.pickupLocation.address}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {format(new Date(booking.pickupTime), 'PPp')}
                        </p>
                      </div>
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
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal
        isOpen={isNewBookingModalOpen}
        onClose={() => setIsNewBookingModalOpen(false)}
        title="Create New Booking"
      >
        <BookingForm onClose={() => setIsNewBookingModalOpen(false)} />
      </Modal>
    </div>
  );
}