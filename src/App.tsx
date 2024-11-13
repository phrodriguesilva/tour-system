import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { AuthGuard } from './components/AuthGuard';
import { Dashboard } from './pages/Dashboard';
import { Bookings } from './pages/Bookings';
import { BookingDetails } from './pages/BookingDetails';
import { Drivers } from './pages/Drivers';
import { DriverProfile } from './pages/DriverProfile';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Unauthorized } from './pages/Unauthorized';
import { DriversMap } from './pages/DriversMap';
import { VehicleManagement } from './pages/VehicleManagement';
//import { VehicleDetails } from './pages/VehicleDetails';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route element={<AuthGuard><Navigation /></AuthGuard>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/bookings/:id" element={<BookingDetails />} />
            <Route
              path="/drivers"
              element={
                <AuthGuard allowedRoles={['admin', 'manager']}>
                  <Drivers />
                </AuthGuard>
              }
            />
            <Route
              path="/drivers/:id"
              element={
                <AuthGuard allowedRoles={['admin', 'manager']}>
                  <DriverProfile />
                </AuthGuard>
              }
            />
            <Route
              path="/vehicles"
              element={
                <AuthGuard allowedRoles={['admin', 'manager']}>
                  <VehicleManagement />
                </AuthGuard>
              }
            />
            <Route
              path="/vehicles/:id"
              element={
                <AuthGuard allowedRoles={['admin', 'manager']}>
                  
                </AuthGuard>
              }
            />
            <Route
              path="/map"
              element={
                <AuthGuard>
                  <DriversMap />
                </AuthGuard>
              }
            />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;