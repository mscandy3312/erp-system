'use client';

import { useRouter } from 'next/navigation';

export default function TopNav() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', {
        method: 'DELETE',
      });
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">ERP System</h1>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 