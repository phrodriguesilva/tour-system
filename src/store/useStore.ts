import { create } from 'zustand';
import type { User, Driver, Booking } from '../types';

interface State {
  user: User | null;
  bookings: Booking[];
  drivers: Driver[];
  setUser: (user: User | null) => void;
  addBooking: (booking: Booking) => void;
  updateBooking: (bookingId: string, updates: Partial<Booking>) => void;
  setDrivers: (drivers: Driver[]) => void;
  updateDriver: (driverId: string, updates: Partial<Driver>) => void;
}

// Mock data for testing
const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'admin',
  phone: '+1 234 567 8900',
};

const mockDrivers: Driver[] = [
  {
    id: '1',
    name: 'Alice Smith',
    email: 'alice@example.com',
    role: 'driver',
    vehicleType: 'Sedan',
    licensePlate: 'ABC123',
    rating: 4.8,
    isAvailable: true,
  },
  {
    id: '2',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'driver',
    vehicleType: 'SUV',
    licensePlate: 'XYZ789',
    rating: 4.5,
    isAvailable: false,
  },
];

const mockBookings: Booking[] = [
  {
    id: '1',
    clientId: '1',
    driverId: '1',
    status: 'confirmed',
    pickupLocation: {
      address: '123 Main St, City',
      lat: 40.7128,
      lng: -74.0060,
    },
    dropoffLocation: {
      address: '456 Park Ave, City',
      lat: 40.7580,
      lng: -73.9855,
    },
    pickupTime: new Date('2024-03-20T10:00:00'),
    price: 35.00,
    paymentStatus: 'paid',
    createdAt: new Date('2024-03-19T15:00:00'),
    updatedAt: new Date('2024-03-19T15:00:00'),
  },
];

export const useStore = create<State>((set) => ({
  user: mockUser,
  bookings: mockBookings,
  drivers: mockDrivers,
  setUser: (user) => set({ user }),
  addBooking: (booking) =>
    set((state) => ({ bookings: [...state.bookings, booking] })),
  updateBooking: (bookingId, updates) =>
    set((state) => ({
      bookings: state.bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, ...updates } : booking
      ),
    })),
  setDrivers: (drivers) => set({ drivers }),
  updateDriver: (driverId, updates) =>
    set((state) => ({
      drivers: state.drivers.map((driver) =>
        driver.id === driverId ? { ...driver, ...updates } : driver
      ),
    })),
}));