import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  FileText, 
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';

export function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const booking = useStore((state) => state.bookings.find(b => b.id === id));
  const driver = useStore((state) => 
    booking?.driverId ? state.drivers.find(d => d.id === booking.driverId) : null
  );
  const updateBooking = useStore((state) => state.updateBooking);

  if (!booking) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Booking not found</h3>
          <p className="mt-1 text-sm text-gray-500">
            The booking you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/bookings')}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  const handleStatusUpdate = (newStatus: typeof booking.status) => {
    updateBooking(booking.id, { status: newStatus });
  };

  const getStatusIcon = () => {
    switch (booking.status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/bookings')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Booking #{booking.id}
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          {booking.status !== 'completed' && booking.status !== 'cancelled' && (
            <>
              <button
                onClick={() => handleStatusUpdate('cancelled')}
                className="px-4 py-2 border border-red-300 text-red-700 rounded-md text-sm font-medium hover:bg-red-50"
              >
                Cancel Booking
              </button>
              <button
                onClick={() => navigate(`/bookings/${id}/edit`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Edit Booking
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Booking Status */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getStatusIcon()}
                <span className="font-medium text-gray-900">
                  Status: {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>
              {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                <select
                  value={booking.status}
                  onChange={(e) => handleStatusUpdate(e.target.value as typeof booking.status)}
                  className="rounded-md border-gray-300 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              )}
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Trip Details</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Pickup Location</p>
                  <p className="text-gray-900">{booking.pickupLocation.address}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Dropoff Location</p>
                  <p className="text-gray-900">{booking.dropoffLocation.address}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Pickup Time</p>
                  <p className="text-gray-900">
                    {format(new Date(booking.pickupTime), 'PPp')}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <DollarSign className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Price</p>
                  <p className="text-gray-900">${booking.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">
                    Payment Status: {booking.paymentStatus}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {booking.notes && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Additional Notes</p>
                  <p className="text-gray-900 mt-1">{booking.notes}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Driver Details */}
        <div className="space-y-6">
          {driver ? (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Driver</h2>
              <div className="flex items-center space-x-4">
                <img
                  src={driver.avatar || `https://ui-avatars.com/api/?name=${driver.name}`}
                  alt={driver.name}
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-900">{driver.name}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{driver.vehicleType}</span>
                    <span>•</span>
                    <span>{driver.licensePlate}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1 text-sm text-gray-600">
                      {driver.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Driver</h2>
              <p className="text-gray-500">No driver assigned yet</p>
            </div>
          )}

          {/* Booking Timeline */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Booking Created</p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(booking.createdAt), 'PPp')}
                  </p>
                </div>
              </div>
              {booking.updatedAt !== booking.createdAt && (
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Last Updated</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(booking.updatedAt), 'PPp')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}