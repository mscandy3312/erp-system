'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/empleados', label: 'Empleados', icon: '👥' },
  { href: '/proyectos', label: 'Proyectos', icon: '📁' },
  { href: '/tareas', label: 'Tareas', icon: '✓' },
  { href: '/activos', label: 'Activos', icon: '💼' },
  { href: '/mantenimiento', label: 'Mantenimiento', icon: '🔧' },
  { href: '/servicios', label: 'Servicios', icon: '🛠️' },
  { href: '/asistencias', label: 'Asistencias', icon: '📅' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="h-screen w-64 bg-gray-800 text-white p-4">
      <div className="text-xl font-bold mb-8">ERP System</div>
      <nav>
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center p-2 mb-2 rounded-lg hover:bg-gray-700 ${
              pathname === item.href ? 'bg-gray-700' : ''
            }`}
          >
            <span className="mr-2">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
} 