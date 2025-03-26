'use client';

import { useState, useEffect } from 'react';

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  costo: number;
  duracion: string;
  estado: 'disponible' | 'no_disponible' | 'mantenimiento';
  categoria: string;
  mantenimientos?: {
    id: number;
    fecha: string;
    descripcion: string;
    costo: number;
    estado: 'pendiente' | 'en_proceso' | 'completado';
  }[];
}

const serviciosIniciales: Servicio[] = [
  {
    id: 1,
    nombre: 'Desarrollo Web',
    descripcion: 'Desarrollo de sitios web personalizados',
    costo: 5000,
    duracion: '2-4 semanas',
    estado: 'disponible',
    categoria: 'Desarrollo',
    mantenimientos: [
      {
        id: 1,
        fecha: '2024-03-15',
        descripcion: 'Actualización de dependencias',
        costo: 500,
        estado: 'completado'
      }
    ]
  }
];

export default function ServiciosPage() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [nuevoServicio, setNuevoServicio] = useState({
    nombre: '',
    descripcion: '',
    costo: '',
    duracion: '',
    estado: 'disponible',
    categoria: ''
  });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [servicioEditando, setServicioEditando] = useState<number | null>(null);

  useEffect(() => {
    const serviciosGuardados = localStorage.getItem('servicios');
    if (serviciosGuardados) {
      setServicios(JSON.parse(serviciosGuardados));
    } else {
      setServicios(serviciosIniciales);
      localStorage.setItem('servicios', JSON.stringify(serviciosIniciales));
    }
  }, []);

  const guardarServicios = (nuevosServicios: Servicio[]) => {
    setServicios(nuevosServicios);
    localStorage.setItem('servicios', JSON.stringify(nuevosServicios));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modoEdicion && servicioEditando) {
      const serviciosActualizados = servicios.map(serv => 
        serv.id === servicioEditando
          ? {
              ...serv,
              nombre: nuevoServicio.nombre,
              descripcion: nuevoServicio.descripcion,
              costo: Number(nuevoServicio.costo),
              duracion: nuevoServicio.duracion,
              estado: nuevoServicio.estado as 'disponible' | 'no_disponible' | 'mantenimiento',
              categoria: nuevoServicio.categoria
            }
          : serv
      );
      guardarServicios(serviciosActualizados);
      setModoEdicion(false);
      setServicioEditando(null);
    } else {
      const nuevoServicioObj: Servicio = {
        id: Date.now(),
        nombre: nuevoServicio.nombre,
        descripcion: nuevoServicio.descripcion,
        costo: Number(nuevoServicio.costo),
        duracion: nuevoServicio.duracion,
        estado: nuevoServicio.estado as 'disponible' | 'no_disponible' | 'mantenimiento',
        categoria: nuevoServicio.categoria,
        mantenimientos: []
      };
      guardarServicios([...servicios, nuevoServicioObj]);
    }
    setNuevoServicio({
      nombre: '',
      descripcion: '',
      costo: '',
      duracion: '',
      estado: 'disponible',
      categoria: ''
    });
  };

  const eliminarServicio = (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
      guardarServicios(servicios.filter(serv => serv.id !== id));
    }
  };

  const editarServicio = (servicio: Servicio) => {
    setModoEdicion(true);
    setServicioEditando(servicio.id);
    setNuevoServicio({
      nombre: servicio.nombre,
      descripcion: servicio.descripcion,
      costo: servicio.costo.toString(),
      duracion: servicio.duracion,
      estado: servicio.estado,
      categoria: servicio.categoria
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const estados = ['disponible', 'no_disponible', 'mantenimiento'];
  const categorias = ['Desarrollo', 'Diseño', 'Marketing', 'Consultoría', 'Soporte', 'Mantenimiento'];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gestión de Servicios</h1>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Servicios</h3>
          <p className="text-2xl text-indigo-600">{servicios.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Servicios Disponibles</h3>
          <p className="text-2xl text-green-600">
            {servicios.filter(s => s.estado === 'disponible').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">En Mantenimiento</h3>
          <p className="text-2xl text-yellow-600">
            {servicios.filter(s => s.estado === 'mantenimiento').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Ingresos Potenciales</h3>
          <p className="text-2xl text-indigo-600">
            ${servicios.reduce((total, s) => total + s.costo, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {modoEdicion ? 'Editar Servicio' : 'Nuevo Servicio'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre del Servicio</label>
              <input
                type="text"
                required
                value={nuevoServicio.nombre}
                onChange={(e) => setNuevoServicio({ ...nuevoServicio, nombre: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Categoría</label>
              <select
                required
                value={nuevoServicio.categoria}
                onChange={(e) => setNuevoServicio({ ...nuevoServicio, categoria: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Costo</label>
              <input
                type="number"
                required
                value={nuevoServicio.costo}
                onChange={(e) => setNuevoServicio({ ...nuevoServicio, costo: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Duración Estimada</label>
              <input
                type="text"
                required
                value={nuevoServicio.duracion}
                onChange={(e) => setNuevoServicio({ ...nuevoServicio, duracion: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Ej: 2-4 semanas"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Estado</label>
              <select
                required
                value={nuevoServicio.estado}
                onChange={(e) => setNuevoServicio({ ...nuevoServicio, estado: e.target.value as any })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                {estados.map(estado => (
                  <option key={estado} value={estado}>
                    {estado.charAt(0).toUpperCase() + estado.slice(1).replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                required
                value={nuevoServicio.descripcion}
                onChange={(e) => setNuevoServicio({ ...nuevoServicio, descripcion: e.target.value })}
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
                  setServicioEditando(null);
                  setNuevoServicio({
                    nombre: '',
                    descripcion: '',
                    costo: '',
                    duracion: '',
                    estado: 'disponible',
                    categoria: ''
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
              {modoEdicion ? 'Guardar Cambios' : 'Crear Servicio'}
            </button>
          </div>
        </form>
      </div>

      {/* Lista de Servicios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicios.map(servicio => (
          <div key={servicio.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{servicio.nombre}</h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  servicio.estado === 'disponible' ? 'bg-green-100 text-green-800' :
                  servicio.estado === 'mantenimiento' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {servicio.estado.charAt(0).toUpperCase() + servicio.estado.slice(1).replace('_', ' ')}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{servicio.descripcion}</p>
              <div className="space-y-2">
                <p className="text-sm"><span className="font-medium">Categoría:</span> {servicio.categoria}</p>
                <p className="text-sm"><span className="font-medium">Costo:</span> ${servicio.costo.toLocaleString()}</p>
                <p className="text-sm"><span className="font-medium">Duración:</span> {servicio.duracion}</p>
              </div>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => editarServicio(servicio)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminarServicio(servicio.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Eliminar
                </button>
              </div>
            </div>
            {servicio.mantenimientos && servicio.mantenimientos.length > 0 && (
              <div className="border-t border-gray-200 px-6 py-4">
                <h4 className="font-medium mb-2">Historial de Mantenimiento</h4>
                <ul className="space-y-2">
                  {servicio.mantenimientos.map(mant => (
                    <li key={mant.id} className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">{mant.descripcion}</p>
                        <p className="text-xs text-gray-500">{mant.fecha}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        mant.estado === 'completado' ? 'bg-green-100 text-green-800' :
                        mant.estado === 'en_proceso' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {mant.estado}
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