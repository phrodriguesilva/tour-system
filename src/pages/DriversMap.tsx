import React, { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { MapPin } from 'lucide-react';

declare global {
  interface Window {
    google: any;
  }
}

export function DriversMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  
  const drivers = useStore(state => state.drivers);
  const vehicles = useStore(state => state.vehicles);

  useEffect(() => {
    const loadGoogleMaps = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.defer = true;
      script.addEventListener('load', initializeMap);
      document.body.appendChild(script);
    };

    loadGoogleMaps();

    return () => {
      // Cleanup markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (googleMapRef.current) {
      updateMarkers();
    }
  }, [drivers, vehicles]);

  const initializeMap = () => {
    if (!mapRef.current) return;

    const defaultLocation = { lat: 40.7128, lng: -74.0060 }; // New York
    
    googleMapRef.current = new window.google.maps.Map(mapRef.current, {
      zoom: 12,
      center: defaultLocation,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
      ],
    });

    updateMarkers();
  };

  const updateMarkers = () => {
    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add new markers for each driver with a vehicle
    drivers.forEach(driver => {
      const vehicle = vehicles.find(v => v.driverId === driver.id);
      if (vehicle?.currentLocation) {
        const marker = new window.google.maps.Marker({
          position: {
            lat: vehicle.currentLocation.lat,
            lng: vehicle.currentLocation.lng,
          },
          map: googleMapRef.current,
          title: driver.name,
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          },
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div class="p-2">
              <h3 class="font-semibold">${driver.name}</h3>
              <p class="text-sm">${vehicle.make} ${vehicle.model}</p>
              <p class="text-sm">${vehicle.licensePlate}</p>
              <p class="text-xs text-gray-500">Last updated: ${new Date(vehicle.currentLocation.lastUpdated).toLocaleString()}</p>
            </div>
          `,
        });

        marker.addListener('click', () => {
          infoWindow.open(googleMapRef.current, marker);
        });

        markersRef.current.push(marker);
      }
    });
  };

  return (
    <div className="h-[calc(100vh-4rem)]">
      <div className="p-4 bg-white shadow-sm mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Driver Locations</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100%-5rem)]">
        <div className="lg:col-span-3">
          <div ref={mapRef} className="w-full h-full rounded-lg shadow-sm" />
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Active Drivers</h2>
          <div className="space-y-4">
            {drivers
              .filter(driver => driver.status === 'active')
              .map(driver => {
                const vehicle = vehicles.find(v => v.driverId === driver.id);
                return (
                  <div key={driver.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-blue-500 mt-1" />
                    <div>
                      <p className="font-medium">{driver.name}</p>
                      {vehicle && (
                        <>
                          <p className="text-sm text-gray-600">
                            {vehicle.make} {vehicle.model} • {vehicle.licensePlate}
                          </p>
                          {vehicle.currentLocation && (
                            <p className="text-xs text-gray-500 mt-1">
                              Last updated: {new Date(vehicle.currentLocation.lastUpdated).toLocaleString()}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}