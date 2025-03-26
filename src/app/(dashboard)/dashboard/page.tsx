'use client';

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Tarjetas de estadísticas */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm font-medium text-gray-500 mb-2">Tareas Pendientes</div>
          <div className="text-3xl font-bold text-gray-900">12</div>
          <div className="text-sm text-green-600 mt-2">↑ 2 nuevas hoy</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm font-medium text-gray-500 mb-2">Proyectos Activos</div>
          <div className="text-3xl font-bold text-gray-900">4</div>
          <div className="text-sm text-blue-600 mt-2">En progreso</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm font-medium text-gray-500 mb-2">Empleados</div>
          <div className="text-3xl font-bold text-gray-900">8</div>
          <div className="text-sm text-gray-600 mt-2">Activos</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-sm font-medium text-gray-500 mb-2">Tareas Completadas</div>
          <div className="text-3xl font-bold text-gray-900">45</div>
          <div className="text-sm text-green-600 mt-2">↑ 5 esta semana</div>
        </div>
      </div>

      {/* Actividad Reciente */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Actividad Reciente</h2>
        <div className="space-y-4">
          {[
            {
              tipo: 'tarea',
              accion: 'completada',
              descripcion: 'Implementación de nuevo módulo',
              tiempo: 'Hace 2 horas',
            },
            {
              tipo: 'proyecto',
              accion: 'creado',
              descripcion: 'Sistema de Inventario v2',
              tiempo: 'Hace 4 horas',
            },
            {
              tipo: 'empleado',
              accion: 'actualizado',
              descripcion: 'Actualización de perfil',
              tiempo: 'Hace 6 horas',
            },
          ].map((actividad, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                {actividad.tipo === 'tarea' && '✓'}
                {actividad.tipo === 'proyecto' && '📁'}
                {actividad.tipo === 'empleado' && '👤'}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {actividad.descripcion}
                </p>
                <p className="text-sm text-gray-500">
                  {`${actividad.tipo} ${actividad.accion}`}
                </p>
              </div>
              <div className="text-sm text-gray-500">{actividad.tiempo}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 