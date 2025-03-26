'use client';

import { useState, useEffect } from 'react';

interface Proyecto {
  id: number;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  presupuesto: number;
  estado: 'planificacion' | 'en_progreso' | 'completado' | 'cancelado';
  responsable: string;
  cliente: string;
  tareas?: {
    id: number;
    titulo: string;
    estado: 'pendiente' | 'en_progreso' | 'completada';
  }[];
  servicios?: {
    id: number;
    nombre: string;
    costo: number;
  }[];
}

const proyectosIniciales: Proyecto[] = [
  {
    id: 1,
    nombre: 'Desarrollo Web E-commerce',
    descripcion: 'Plataforma de comercio electrónico para empresa minorista',
    fechaInicio: '2024-03-01',
    fechaFin: '2024-06-30',
    presupuesto: 50000,
    estado: 'en_progreso',
    responsable: 'Juan Pérez',
    cliente: 'Comercial XYZ',
    tareas: [
      { id: 1, titulo: 'Diseño de UI', estado: 'completada' },
      { id: 2, titulo: 'Desarrollo Backend', estado: 'en_progreso' }
    ]
  }
];

export default function ProyectosPage() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [nuevoProyecto, setNuevoProyecto] = useState({
    nombre: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    presupuesto: '',
    estado: 'planificacion' as const,
    responsable: '',
    cliente: ''
  });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [proyectoEditando, setProyectoEditando] = useState<number | null>(null);

  useEffect(() => {
    const proyectosGuardados = localStorage.getItem('proyectos');
    if (proyectosGuardados) {
      try {
        const proyectosParseados = JSON.parse(proyectosGuardados);
        if (Array.isArray(proyectosParseados) && proyectosParseados.length > 0) {
          setProyectos(proyectosParseados);
        }
      } catch (error) {
        console.error('Error al cargar proyectos:', error);
        setProyectos(proyectosIniciales);
      }
    } else {
      setProyectos(proyectosIniciales);
    }
  }, []);

  useEffect(() => {
    if (proyectos.length > 0) {
      localStorage.setItem('proyectos', JSON.stringify(proyectos));
    }
  }, [proyectos]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modoEdicion && proyectoEditando) {
      const proyectosActualizados = proyectos.map(proy => 
        proy.id === proyectoEditando
          ? {
              ...proy,
              nombre: nuevoProyecto.nombre,
              descripcion: nuevoProyecto.descripcion,
              fechaInicio: nuevoProyecto.fechaInicio,
              fechaFin: nuevoProyecto.fechaFin,
              presupuesto: Number(nuevoProyecto.presupuesto),
              estado: nuevoProyecto.estado,
              responsable: nuevoProyecto.responsable,
              cliente: nuevoProyecto.cliente
            }
          : proy
      );
      setProyectos(proyectosActualizados);
      setModoEdicion(false);
      setProyectoEditando(null);
    } else {
      const nuevoProyectoObj: Proyecto = {
        id: Date.now(),
        nombre: nuevoProyecto.nombre,
        descripcion: nuevoProyecto.descripcion,
        fechaInicio: nuevoProyecto.fechaInicio,
        fechaFin: nuevoProyecto.fechaFin,
        presupuesto: Number(nuevoProyecto.presupuesto),
        estado: nuevoProyecto.estado,
        responsable: nuevoProyecto.responsable,
        cliente: nuevoProyecto.cliente,
        tareas: []
      };
      setProyectos([...proyectos, nuevoProyectoObj]);
    }
    setNuevoProyecto({
      nombre: '',
      descripcion: '',
      fechaInicio: '',
      fechaFin: '',
      presupuesto: '',
      estado: 'planificacion',
      responsable: '',
      cliente: ''
    });
  };

  const eliminarProyecto = (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
      setProyectos(proyectos.filter(proy => proy.id !== id));
    }
  };

  const editarProyecto = (proyecto: Proyecto) => {
    setModoEdicion(true);
    setProyectoEditando(proyecto.id);
    setNuevoProyecto({
      nombre: proyecto.nombre,
      descripcion: proyecto.descripcion,
      fechaInicio: proyecto.fechaInicio,
      fechaFin: proyecto.fechaFin,
      presupuesto: proyecto.presupuesto.toString(),
      estado: proyecto.estado,
      responsable: proyecto.responsable,
      cliente: proyecto.cliente
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const estados = ['planificacion', 'en_progreso', 'completado', 'cancelado'];

  const calcularTotalPresupuesto = () => {
    return proyectos.reduce((total, p) => total + (p.presupuesto || 0), 0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gestión de Proyectos</h1>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Proyectos</h3>
          <p className="text-2xl text-indigo-600">{proyectos.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">En Progreso</h3>
          <p className="text-2xl text-yellow-600">
            {proyectos.filter(p => p.estado === 'en_progreso').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Completados</h3>
          <p className="text-2xl text-green-600">
            {proyectos.filter(p => p.estado === 'completado').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Presupuesto Total</h3>
          <p className="text-2xl text-indigo-600">
            ${calcularTotalPresupuesto().toLocaleString()}
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {modoEdicion ? 'Editar Proyecto' : 'Nuevo Proyecto'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre del Proyecto</label>
              <input
                type="text"
                required
                value={nuevoProyecto.nombre}
                onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, nombre: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cliente</label>
              <input
                type="text"
                required
                value={nuevoProyecto.cliente}
                onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, cliente: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
              <input
                type="date"
                required
                value={nuevoProyecto.fechaInicio}
                onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, fechaInicio: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha de Fin</label>
              <input
                type="date"
                required
                value={nuevoProyecto.fechaFin}
                onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, fechaFin: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Presupuesto</label>
              <input
                type="number"
                required
                value={nuevoProyecto.presupuesto}
                onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, presupuesto: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Estado</label>
              <select
                required
                value={nuevoProyecto.estado}
                onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, estado: e.target.value as any })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                {estados.map(estado => (
                  <option key={estado} value={estado}>
                    {estado.charAt(0).toUpperCase() + estado.slice(1).replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Responsable</label>
              <input
                type="text"
                required
                value={nuevoProyecto.responsable}
                onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, responsable: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                required
                value={nuevoProyecto.descripcion}
                onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, descripcion: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            {modoEdicion && (
              <button
                type="button"
                onClick={() => {
                  setModoEdicion(false);
                  setProyectoEditando(null);
                  setNuevoProyecto({
                    nombre: '',
                    descripcion: '',
                    fechaInicio: '',
                    fechaFin: '',
                    presupuesto: '',
                    estado: 'planificacion',
                    responsable: '',
                    cliente: ''
                  });
                }}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              {modoEdicion ? 'Guardar Cambios' : 'Crear Proyecto'}
            </button>
          </div>
        </form>
      </div>

      {/* Lista de Proyectos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {proyectos.map(proyecto => (
          <div key={proyecto.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{proyecto.nombre}</h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  proyecto.estado === 'completado' ? 'bg-green-100 text-green-800' :
                  proyecto.estado === 'en_progreso' ? 'bg-yellow-100 text-yellow-800' :
                  proyecto.estado === 'cancelado' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {proyecto.estado.charAt(0).toUpperCase() + proyecto.estado.slice(1).replace('_', ' ')}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{proyecto.descripcion}</p>
              <div className="space-y-2">
                <p className="text-sm"><span className="font-medium">Cliente:</span> {proyecto.cliente || 'No especificado'}</p>
                <p className="text-sm"><span className="font-medium">Responsable:</span> {proyecto.responsable || 'No asignado'}</p>
                <p className="text-sm">
                  <span className="font-medium">Presupuesto:</span> 
                  ${(proyecto.presupuesto || 0).toLocaleString()}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Duración:</span> 
                  {proyecto.fechaInicio || 'No especificada'} - {proyecto.fechaFin || 'No especificada'}
                </p>
              </div>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => editarProyecto(proyecto)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminarProyecto(proyecto.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Eliminar
                </button>
              </div>
            </div>
            {proyecto.tareas && proyecto.tareas.length > 0 && (
              <div className="border-t border-gray-200 px-6 py-4">
                <h4 className="font-medium mb-2">Tareas</h4>
                <ul className="space-y-2">
                  {proyecto.tareas.map(tarea => (
                    <li key={tarea.id} className="flex justify-between items-center">
                      <span>{tarea.titulo}</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        tarea.estado === 'completada' ? 'bg-green-100 text-green-800' :
                        tarea.estado === 'en_progreso' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {tarea.estado}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 