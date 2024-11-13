import React from 'react';
import { useStore } from '../store/useStore';
import { User, Mail, Phone } from 'lucide-react';

export function Profile() {
  const user = useStore((state) => state.user);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Not signed in</h3>
          <p className="mt-1 text-sm text-gray-500">Sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
          Edit Profile
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center space-x-6">
          <img
            src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`}
            alt={user.name}
            className="h-24 w-24 rounded-full"
          />
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <div className="mt-2 space-y-2">
              <div className="flex items-center text-gray-500">
                <Mail className="h-4 w-4 mr-2" />
                {user.email}
              </div>
              {user.phone && (
                <div className="flex items-center text-gray-500">
                  <Phone className="h-4 w-4 mr-2" />
                  {user.phone}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}