import { useState, useEffect } from 'react';
import { Proyecto, ProyectoBase } from '@/types/proyecto';

interface ProyectoFormProps {
  proyecto?: Proyecto;
  onSubmit: (data: ProyectoBase) => void;
  onCancel: () => void;
}

export default function ProyectoForm({ proyecto, onSubmit, onCancel }: ProyectoFormProps) {
  const [formData, setFormData] = useState<ProyectoBase>({
    nombre: '',
    descripcion: '',
    estado: 'PENDIENTE',
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: null,
  });

  useEffect(() => {
    if (proyecto) {
      setFormData({
        ...proyecto,
        fechaInicio: new Date(proyecto.fechaInicio).toISOString().split('T')[0],
        fechaFin: proyecto.fechaFin 
          ? new Date(proyecto.fechaFin).toISOString().split('T')[0]
          : null,
      });
    }
  }, [proyecto]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? null : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
          Nombre del Proyecto
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre || ''}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion || ''}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
          Estado
        </label>
        <select
          id="estado"
          name="estado"
          value={formData.estado}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="PENDIENTE">Pendiente</option>
          <option value="EN_PROGRESO">En Progreso</option>
          <option value="COMPLETADO">Completado</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
      </div>

      <div>
        <label htmlFor="fechaInicio" className="block text-sm font-medium text-gray-700">
          Fecha de Inicio
        </label>
        <input
          type="date"
          id="fechaInicio"
          name="fechaInicio"
          value={formData.fechaInicio}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="fechaFin" className="block text-sm font-medium text-gray-700">
          Fecha de Fin (opcional)
        </label>
        <input
          type="date"
          id="fechaFin"
          name="fechaFin"
          value={formData.fechaFin || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {proyecto ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
} 