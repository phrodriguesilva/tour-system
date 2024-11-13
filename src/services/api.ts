import { User, Driver, Vehicle, Booking } from '../types';
import * as mockApi from './mockApi';

const IS_MOCK = true;

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'An error occurred');
  }
  return response.json();
}

// Auth endpoints
export async function register(data: {
  email: string;
  password: string;
  name: string;
  inviteCode: string;
}) {
  if (IS_MOCK) return mockApi.register(data);

  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<{ user: User; token: string }>(response);
}

export async function login(credentials: { email: string; password: string }) {
  if (IS_MOCK) return mockApi.login(credentials);

  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return handleResponse<{ user: User; token: string }>(response);
}

// Driver endpoints
export async function getDrivers() {
  if (IS_MOCK) return mockApi.getDrivers();

  const response = await fetch(`${import.meta.env.VITE_API_URL}/drivers`);
  return handleResponse<Driver[]>(response);
}

export async function createDriver(data: Omit<Driver, 'id'>) {
  if (IS_MOCK) return mockApi.createDriver(data);

  const response = await fetch(`${import.meta.env.VITE_API_URL}/drivers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Driver>(response);
}

export async function updateDriver(id: string, data: Partial<Driver>) {
  if (IS_MOCK) return mockApi.updateDriver(id, data);

  const response = await fetch(`${import.meta.env.VITE_API_URL}/drivers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Driver>(response);
}

// Vehicle endpoints
export async function getVehicles() {
  if (IS_MOCK) return mockApi.getVehicles();

  const response = await fetch(`${import.meta.env.VITE_API_URL}/vehicles`);
  return handleResponse<Vehicle[]>(response);
}

export async function createVehicle(data: Omit<Vehicle, 'id'>) {
  if (IS_MOCK) return mockApi.createVehicle(data);

  const response = await fetch(`${import.meta.env.VITE_API_URL}/vehicles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Vehicle>(response);
}

export async function updateVehicle(id: string, data: Partial<Vehicle>) {
  if (IS_MOCK) return mockApi.updateVehicle(id, data);

  const response = await fetch(`${import.meta.env.VITE_API_URL}/vehicles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Vehicle>(response);
}

// Booking endpoints
export async function getBookings() {
  if (IS_MOCK) return mockApi.getBookings();

  const response = await fetch(`${import.meta.env.VITE_API_URL}/bookings`);
  return handleResponse<Booking[]>(response);
}

export async function createBooking(data: Omit<Booking, 'id'>) {
  if (IS_MOCK) return mockApi.createBooking(data);

  const response = await fetch(`${import.meta.env.VITE_API_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Booking>(response);
}

export async function updateBooking(id: string, data: Partial<Booking>) {
  if (IS_MOCK) return mockApi.updateBooking(id, data);

  const response = await fetch(`${import.meta.env.VITE_API_URL}/bookings/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Booking>(response);
}