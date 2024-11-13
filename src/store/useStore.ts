import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Driver, Booking, Vehicle } from '../types';

interface State {
  drivers: Driver[];
  vehicles: Vehicle[];
  bookings: Booking[];
  setDrivers: (drivers: Driver[]) => void;
  addDriver: (driver: Driver) => void;
  updateDriver: (id: string, updates: Partial<Driver>) => void;
  deleteDriver: (id: string) => void;
  addVehicle: (vehicle: Vehicle) => void;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
}

export const useStore = create<State>()(
  persist(
    (set) => ({
      drivers: [],
      vehicles: [],
      bookings: [],
      setDrivers: (drivers) => set({ drivers }),
      addDriver: (driver) =>
        set((state) => ({ drivers: [...state.drivers, driver] })),
      updateDriver: (id, updates) =>
        set((state) => ({
          drivers: state.drivers.map((driver) =>
            driver.id === id ? { ...driver, ...updates } : driver
          ),
        })),
      deleteDriver: (id) =>
        set((state) => ({
          drivers: state.drivers.filter((driver) => driver.id !== id),
        })),
      addVehicle: (vehicle) =>
        set((state) => ({ vehicles: [...state.vehicles, vehicle] })),
      updateVehicle: (id, updates) =>
        set((state) => ({
          vehicles: state.vehicles.map((vehicle) =>
            vehicle.id === id ? { ...vehicle, ...updates } : vehicle
          ),
        })),
      deleteVehicle: (id) =>
        set((state) => ({
          vehicles: state.vehicles.filter((vehicle) => vehicle.id !== id),
        })),
      addBooking: (booking) =>
        set((state) => ({ bookings: [...state.bookings, booking] })),
      updateBooking: (id, updates) =>
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === id ? { ...booking, ...updates } : booking
          ),
        })),
    }),
    {
      name: 'driver-booking-storage',
    }
  )
);