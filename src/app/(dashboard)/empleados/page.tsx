'use client';

import { useState, useEffect } from 'react';

interface Empleado {
  id: number;
  nombre: string;
  email: string;
  cargo: string;
  departamento: string;
  fechaIngreso: string;
  salario: number;
  telefono: string;
  direccion: string;
  estado: 'activo' | 'inactivo' | 'vacaciones';
  asistencias?: {
    fecha: string;
    horaEntrada: string;
    horaSalida: string;
    estado: 'presente' | 'ausente' | 'tardanza' | 'permiso';
  }[];
}

const empleadosIniciales: Empleado[] = [
  {
    id: 1,
    nombre: 'Juan Pérez',
    email: 'juan@empresa.com',
    cargo: 'Desarrollador Frontend',
    departamento: 'Tecnología',
    fechaIngreso: '2024-01-15',
    salario: 45000,
    telefono: '555-0123',
    direccion: 'Calle Principal 123',
    estado: 'activo'
  },
  {
    id: 2,
    nombre: 'María García',
    email: 'maria@empresa.com',
    cargo: 'Diseñadora UX',
    departamento: 'Diseño',
    fechaIngreso: '2024-02-01',
    salario: 42000,
    telefono: '555-0124',
    direccion: 'Avenida Central 456',
    estado: 'activo'
  }
];

export default function EmpleadosPage() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre: '',
    email: '',
    cargo: '',
    departamento: '',
    fechaIngreso: '',
    salario: '',
    telefono: '',
    direccion: '',
    estado: 'activo',
    id: ''
  });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [empleadoEditando, setEmpleadoEditando] = useState<number | null>(null);
  const [filtro, setFiltro] = useState('');
  const [departamentoFiltro, setDepartamentoFiltro] = useState('');

  useEffect(() => {
    fetchEmpleados();
  }, []);

  const fetchEmpleados = async () => {
    try {
      const response = await fetch('/api/empleados');
      const data = await response.json();
      setEmpleados(data.length > 0 ? data : empleadosIniciales);
    } catch (error) {
      console.error('Error al obtener empleados:', error);
      setEmpleados(empleadosIniciales);
    }
  };

  // Guardar empleados usando la API
  const guardarEmpleados = (nuevosEmpleados: Empleado[]) => {
    setEmpleados(nuevosEmpleados);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modoEdicion && empleadoEditando) {
      const empleadosActualizados = empleados.map(emp => 
        emp.id === empleadoEditando 
          ? { 
              id: emp.id,
              nombre: nuevoEmpleado.nombre,
              email: nuevoEmpleado.email,
              cargo: nuevoEmpleado.cargo,
              departamento: nuevoEmpleado.departamento,
              fechaIngreso: nuevoEmpleado.fechaIngreso,
              salario: Number(nuevoEmpleado.salario),
              telefono: nuevoEmpleado.telefono,
              direccion: nuevoEmpleado.direccion,
              estado: nuevoEmpleado.estado as 'activo' | 'inactivo' | 'vacaciones'
            }
          : emp
      );
      guardarEmpleados(empleadosActualizados);
      setModoEdicion(false);
      setEmpleadoEditando(null);
    } else {
      const nuevoEmpleadoObj: Empleado = {
        id: Date.now(),
        nombre: nuevoEmpleado.nombre,
        email: nuevoEmpleado.email,
        cargo: nuevoEmpleado.cargo,
        departamento: nuevoEmpleado.departamento,
        fechaIngreso: nuevoEmpleado.fechaIngreso,
        salario: Number(nuevoEmpleado.salario),
        telefono: nuevoEmpleado.telefono,
        direccion: nuevoEmpleado.direccion,
        estado: nuevoEmpleado.estado as 'activo' | 'inactivo' | 'vacaciones'
      };
      guardarEmpleados([...empleados, nuevoEmpleadoObj]);
    }
    setNuevoEmpleado({
      nombre: '',
      email: '',
      cargo: '',
      departamento: '',
      fechaIngreso: '',
      salario: '',
      telefono: '',
      direccion: '',
      estado: 'activo'
    });
  };

  const eliminarEmpleado = (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
      const empleadosActualizados = empleados.filter(emp => emp.id !== id);
      guardarEmpleados(empleadosActualizados);
    }
  };

  const editarEmpleado = (empleado: Empleado) => {
    console.log('Editando empleado:', empleado); // Para debug
    setModoEdicion(true);
    setEmpleadoEditando(empleado.id);
    setNuevoEmpleado({
      nombre: empleado.nombre,
      email: empleado.email,
      cargo: empleado.cargo,
      departamento: empleado.departamento,
      fechaIngreso: empleado.fechaIngreso,
      salario: empleado.salario.toString(),
      telefono: empleado.telefono,
      direccion: empleado.direccion,
      estado: empleado.estado
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const departamentos = ['Tecnología', 'Diseño', 'Marketing', 'Ventas', 'Recursos Humanos', 'Finanzas', 'Operaciones'];
  const estados = ['activo', 'inactivo', 'vacaciones'];
  const estadosAsistencia = ['presente', 'ausente', 'tardanza', 'permiso'];

  const empleadosFiltrados = empleados.filter(emp => {
    const cumpleFiltroTexto = emp.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
                             emp.email.toLowerCase().includes(filtro.toLowerCase()) ||
                             emp.cargo.toLowerCase().includes(filtro.toLowerCase());
    const cumpleFiltroDepartamento = !departamentoFiltro || emp.departamento === departamentoFiltro;
    return cumpleFiltroTexto && cumpleFiltroDepartamento;
  });

  const calcularTotalSalarios = () => {
    return empleadosFiltrados.reduce((total, emp) => total + emp.salario, 0);
  };

  const calcularEmpleadosPorDepartamento = () => {
    return empleadosFiltrados.reduce((acc, emp) => {
      acc[emp.departamento] = (acc[emp.departamento] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gestión de Empleados</h1>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Empleados</h3>
          <p className="text-2xl text-indigo-600">{empleadosFiltrados.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Salarios</h3>
          <p className="text-2xl text-indigo-600">
            ${calcularTotalSalarios().toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Empleados por Estado</h3>
          <div className="space-y-2">
            {estados.map(estado => (
              <div key={estado} className="flex justify-between">
                <span className="capitalize">{estado}</span>
                <span className="font-semibold">
                  {empleadosFiltrados.filter(emp => emp.estado === estado).length}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Control de Asistencia */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Control de Asistencia</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Empleado</label>
            <select
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              onChange={(e) => {
                const empleado = empleados.find(emp => emp.id === Number(e.target.value));
                if (empleado) {
                  setNuevoEmpleado({
                    ...nuevoEmpleado,
                    nombre: empleado.nombre,
                    id: empleado.id
                  });
                }
              }}
            >
              <option value="">Seleccionar empleado</option>
              {empleados.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha</label>
            <input
              type="date"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Estado</label>
            <select
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              {estadosAsistencia.map(estado => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="button"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 w-full"
              onClick={() => {
                // Aquí iría la lógica para registrar la asistencia
                alert('Asistencia registrada');
              }}
            >
              Registrar Asistencia
            </button>
          </div>
        </div>
      </div>

      {/* Resumen de Asistencia */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Resumen de Asistencia</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {estadosAsistencia.map(estado => (
            <div key={estado} className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium capitalize">{estado}</h3>
              <p className="text-2xl font-bold text-indigo-600">0</p>
            </div>
          ))}
        </div>
      </div>

      {/* Formulario */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {modoEdicion ? 'Editar Empleado' : 'Nuevo Empleado'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                required
                value={nuevoEmpleado.nombre}
                onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, nombre: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                value={nuevoEmpleado.email}
                onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, email: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Teléfono</label>
              <input
                type="tel"
                required
                value={nuevoEmpleado.telefono}
                onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, telefono: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cargo</label>
              <input
                type="text"
                required
                value={nuevoEmpleado.cargo}
                onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, cargo: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Departamento</label>
              <select
                required
                value={nuevoEmpleado.departamento}
                onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, departamento: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="">Seleccionar departamento</option>
                {departamentos.map((dep) => (
                  <option key={dep} value={dep}>{dep}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Estado</label>
              <select
                required
                value={nuevoEmpleado.estado}
                onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, estado: e.target.value as 'activo' | 'inactivo' | 'vacaciones' })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                {estados.map((estado) => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Salario</label>
              <input
                type="number"
                required
                value={nuevoEmpleado.salario}
                onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, salario: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha de Ingreso</label>
              <input
                type="date"
                required
                value={nuevoEmpleado.fechaIngreso}
                onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, fechaIngreso: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Dirección</label>
              <input
                type="text"
                required
                value={nuevoEmpleado.direccion}
                onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, direccion: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            {modoEdicion && (
              <button
                type="button"
                onClick={() => {
                  setModoEdicion(false);
                  setEmpleadoEditando(null);
                  setNuevoEmpleado({
                    nombre: '',
                    email: '',
                    cargo: '',
                    departamento: '',
                    fechaIngreso: '',
                    salario: '',
                    telefono: '',
                    direccion: '',
                    estado: 'activo'
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
              {modoEdicion ? 'Guardar Cambios' : 'Agregar Empleado'}
            </button>
          </div>
        </form>
      </div>

      {/* Filtros */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Buscar</label>
            <input
              type="text"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Buscar por nombre, email o cargo..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Filtrar por Departamento</label>
            <select
              value={departamentoFiltro}
              onChange={(e) => setDepartamentoFiltro(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Todos los departamentos</option>
              {departamentos.map(dep => (
                <option key={dep} value={dep}>{dep}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de empleados */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departamento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {empleadosFiltrados.map((empleado) => (
              <tr key={empleado.id}>
                <td className="px-6 py-4 whitespace-nowrap">{empleado.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap">{empleado.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{empleado.cargo}</td>
                <td className="px-6 py-4 whitespace-nowrap">{empleado.departamento}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${empleado.estado === 'activo' ? 'bg-green-100 text-green-800' : 
                      empleado.estado === 'inactivo' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'}`}>
                    {empleado.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => editarEmpleado(empleado)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarEmpleado(empleado.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
