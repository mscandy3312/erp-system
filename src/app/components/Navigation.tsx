'use client';

import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="w-64 bg-gray-800 text-white p-4 min-h-screen">
      <h1 className="text-xl font-bold mb-8">ERP System</h1>
      <ul className="space-y-2">
        <li>
          <Link href="/dashboard" className="block p-2 rounded hover:bg-gray-700">
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/proyectos" className="block p-2 rounded hover:bg-gray-700">
            Proyectos
          </Link>
        </li>
        <li>
          <Link href="/tareas" className="block p-2 rounded hover:bg-gray-700">
            Tareas
          </Link>
        </li>
      </ul>
    </nav>
  );
} 