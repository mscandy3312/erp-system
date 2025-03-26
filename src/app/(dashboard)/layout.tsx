'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/tareas', label: 'Tareas', icon: '✓' },
  { href: '/proyectos', label: 'Proyectos', icon: '📁' },
  { href: '/empleados', label: 'Empleados', icon: '👥' },
  { href: '/servicios', label: 'Servicios', icon: '🔧' },
  { href: '/inventario', label: 'Inventario', icon: '📦' },
  { href: '/ventas', label: 'Ventas', icon: '💰' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Barra lateral */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b">
            <h1 className="text-xl font-bold text-gray-800">ERP System</h1>
          </div>

          {/* Navegación */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Perfil */}
          <div className="p-4 border-t">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white">
                U
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">Usuario</p>
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                  }}
                  className="text-xs text-gray-500 hover:text-indigo-500"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="pl-64">
        <main className="min-h-screen bg-gray-100 p-8">{children}</main>
      </div>
    </div>
  );
} 