export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'driver' | 'client';
  phone?: string;
  avatar?: string;
}

export interface Vehicle {
  id: string;
  driverId: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vehicleType: 'sedan' | 'suv' | 'van' | 'truck';
  capacity: number;
  status: 'active' | 'maintenance' | 'inactive';
  lastMaintenance?: Date;
  insuranceExpiry: Date;
  registrationExpiry: Date;
  currentLocation?: {
    lat: number;
    lng: number;
    lastUpdated: Date;
  };
}

export interface Driver extends User {
  vehicleId?: string;
  licenseNumber: string;
  licenseExpiry: Date;
  rating: number;
  isAvailable: boolean;
  status: 'active' | 'inactive' | 'suspended';
  totalTrips: number;
  joinedAt: Date;
  currentLocation?: {
    lat: number;
    lng: number;
    lastUpdated: Date;
  };
}

export interface Booking {
  id: string;
  clientId: string;
  driverId?: string;
  vehicleId?: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  pickupLocation: {
    address: string;
    lat: number;
    lng: number;
  };
  dropoffLocation: {
    address: string;
    lat: number;
    lng: number;
  };
  pickupTime: Date;
  estimatedDuration: number;
  estimatedDistance: number;
  price: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
}