export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'driver' | 'client';
  phone?: string;
  avatar?: string;
}

export interface Driver extends User {
  vehicleType: string;
  licensePlate: string;
  rating: number;
  isAvailable: boolean;
  currentLocation?: {
    lat: number;
    lng: number;
  };
}

export interface Booking {
  id: string;
  clientId: string;
  driverId?: string;
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
  price: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}