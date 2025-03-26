'use client';

import { useState, useEffect } from 'react';

interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  estado: 'pendiente' | 'en_progreso' | 'completada';
  fechaCreacion: string;
}

const tareasIniciales: Tarea[] = [
  {
    id: 1,
    titulo: 'Desarrollar nueva funcionalidad',
    descripcion: 'Implementar el módulo de reportes',
    estado: 'pendiente',
    fechaCreacion: '2024-03-25'
  },
  {
    id: 2,
    titulo: 'Corregir bugs',
    descripcion: 'Resolver problemas reportados en el sistema',
    estado: 'en_progreso',
    fechaCreacion: '2024-03-25'
  }
];

export default function TareasPage() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [nuevaTarea, setNuevaTarea] = useState({
    titulo: '',
    descripcion: ''
  });

  // Cargar tareas del localStorage al montar el componente
  useEffect(() => {
    const tareasGuardadas = localStorage.getItem('tareas');
    if (tareasGuardadas) {
      setTareas(JSON.parse(tareasGuardadas));
    } else {
      setTareas(tareasIniciales);
      localStorage.setItem('tareas', JSON.stringify(tareasIniciales));
    }
  }, []);

  // Guardar tareas en localStorage cada vez que cambien
  useEffect(() => {
    if (tareas.length > 0) {
      localStorage.setItem('tareas', JSON.stringify(tareas));
    }
  }, [tareas]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tarea: Tarea = {
      id: Date.now(), // Usar timestamp como ID único
      titulo: nuevaTarea.titulo,
      descripcion: nuevaTarea.descripcion,
      estado: 'pendiente',
      fechaCreacion: new Date().toISOString().split('T')[0]
    };
    setTareas([...tareas, tarea]);
    setNuevaTarea({ titulo: '', descripcion: '' });
  };

  const getEstadoColor = (estado: Tarea['estado']) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'en_progreso':
        return 'bg-blue-100 text-blue-800';
      case 'completada':
        return 'bg-green-100 text-green-800';
    }
  };

  const cambiarEstado = (id: number) => {
    setTareas(tareas.map(tarea => {
      if (tarea.id === id) {
        const estados: Tarea['estado'][] = ['pendiente', 'en_progreso', 'completada'];
        const currentIndex = estados.indexOf(tarea.estado);
        const nextIndex = (currentIndex + 1) % estados.length;
        return { ...tarea, estado: estados[nextIndex] };
      }
      return tarea;
    }));
  };

  const eliminarTarea = (id: number) => {
    setTareas(tareas.filter(tarea => tarea.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gestión de Tareas</h1>

      {/* Formulario para nueva tarea */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Nueva Tarea</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Título</label>
            <input
              type="text"
              value={nuevaTarea.titulo}
              onChange={(e) => setNuevaTarea({ ...nuevaTarea, titulo: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              value={nuevaTarea.descripcion}
              onChange={(e) => setNuevaTarea({ ...nuevaTarea, descripcion: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              rows={3}
              required
            />
          </div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Crear Tarea
          </button>
        </form>
      </div>

      {/* Lista de tareas */}
      <div className="bg-white shadow-md rounded-lg">
        <div className="grid gap-4 p-6">
          {tareas.map((tarea) => (
            <div
              key={tarea.id}
              className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{tarea.titulo}</h3>
                  <p className="text-gray-600 mt-1">{tarea.descripcion}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Creada el: {tarea.fechaCreacion}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => cambiarEstado(tarea.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(
                      tarea.estado
                    )}`}
                  >
                    {tarea.estado.replace('_', ' ')}
                  </button>
                  <button
                    onClick={() => eliminarTarea(tarea.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    ❌
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 