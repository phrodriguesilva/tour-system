import { User, Driver, Vehicle, Booking } from '../types';
import { SignJWT, jwtVerify } from 'jose';

const INVITE_CODE = 'WTOUR';
const SECRET = new TextEncoder().encode('your-secret-key');

// Mock databases
const users: User[] = [];
const drivers: Driver[] = [];
const vehicles: Vehicle[] = [];
const bookings: Booking[] = [];

export async function generateToken(user: User): Promise<string> {
  return new SignJWT({ sub: user.id, email: user.email, role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('2h')
    .sign(SECRET);
}

export async function register(data: {
  email: string;
  password: string;
  name: string;
  inviteCode: string;
}): Promise<{ user: User; token: string }> {
  await new Promise(resolve => setTimeout(resolve, 500));

  if (data.inviteCode !== INVITE_CODE) {
    throw new Error('Invalid invite code');
  }

  if (users.some(u => u.email === data.email)) {
    throw new Error('Email already registered');
  }

  const user: User = {
    id: Math.random().toString(36).substr(2, 9),
    name: data.name,
    email: data.email,
    role: users.length === 0 ? 'admin' : 'client',
  };

  users.push(user);
  const token = await generateToken(user);

  return { user, token };
}

export async function login(credentials: {
  email: string;
  password: string;
}): Promise<{ user: User; token: string }> {
  await new Promise(resolve => setTimeout(resolve, 500));

  const user = users.find(u => u.email === credentials.email);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const token = await generateToken(user);
  return { user, token };
}

// Driver Management
export async function createDriver(data: Omit<Driver, 'id'>): Promise<Driver> {
  const driver: Driver = {
    ...data,
    id: Math.random().toString(36).substr(2, 9),
  };
  drivers.push(driver);
  return driver;
}

export async function updateDriver(id: string, updates: Partial<Driver>): Promise<Driver> {
  const index = drivers.findIndex(d => d.id === id);
  if (index === -1) throw new Error('Driver not found');

  const updatedDriver = { ...drivers[index], ...updates };
  drivers[index] = updatedDriver;
  return updatedDriver;
}

export async function getDrivers(): Promise<Driver[]> {
  return drivers;
}

// Vehicle Management
export async function createVehicle(data: Omit<Vehicle, 'id'>): Promise<Vehicle> {
  const vehicle: Vehicle = {
    ...data,
    id: Math.random().toString(36).substr(2, 9),
  };
  vehicles.push(vehicle);
  return vehicle;
}

export async function updateVehicle(id: string, updates: Partial<Vehicle>): Promise<Vehicle> {
  const index = vehicles.findIndex(v => v.id === id);
  if (index === -1) throw new Error('Vehicle not found');

  const updatedVehicle = { ...vehicles[index], ...updates };
  vehicles[index] = updatedVehicle;
  return updatedVehicle;
}

export async function getVehicles(): Promise<Vehicle[]> {
  return vehicles;
}

// Booking Management
export async function createBooking(data: Omit<Booking, 'id'>): Promise<Booking> {
  const booking: Booking = {
    ...data,
    id: Math.random().toString(36).substr(2, 9),
  };
  bookings.push(booking);
  return booking;
}

export async function updateBooking(id: string, updates: Partial<Booking>): Promise<Booking> {
  const index = bookings.findIndex(b => b.id === id);
  if (index === -1) throw new Error('Booking not found');

  const updatedBooking = { ...bookings[index], ...updates };
  bookings[index] = updatedBooking;
  return updatedBooking;
}

export async function getBookings(): Promise<Booking[]> {
  return bookings;
}