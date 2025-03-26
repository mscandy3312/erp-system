'use client';

import { useState, useEffect } from 'react';

interface Venta {
  id: number;
  numeroFactura: string;
  fecha: string;
  cliente: string;
  productos: {
    id: number;
    nombre: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
  }[];
  subtotal: number;
  impuesto: number;
  total: number;
  estado: 'pendiente' | 'pagada' | 'cancelada';
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';
}

const ventasIniciales: Venta[] = [
  {
    id: 1,
    numeroFactura: 'FAC-001',
    fecha: '2024-03-15',
    cliente: 'Empresa ABC',
    productos: [
      {
        id: 1,
        nombre: 'Laptop HP ProBook',
        cantidad: 2,
        precioUnitario: 899.99,
        subtotal: 1799.98
      }
    ],
    subtotal: 1799.98,
    impuesto: 288.00,
    total: 2087.98,
    estado: 'pagada',
    metodoPago: 'transferencia'
  },
  {
    id: 2,
    numeroFactura: 'FAC-002',
    fecha: '2024-03-16',
    cliente: 'Corporación XYZ',
    productos: [
      {
        id: 2,
        nombre: 'Monitor Dell 24"',
        cantidad: 3,
        precioUnitario: 249.99,
        subtotal: 749.97
      }
    ],
    subtotal: 749.97,
    impuesto: 120.00,
    total: 869.97,
    estado: 'pendiente',
    metodoPago: 'efectivo'
  }
];

export default function VentasPage() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [nuevaVenta, setNuevaVenta] = useState({
    numeroFactura: '',
    fecha: '',
    cliente: '',
    productos: [] as Venta['productos'],
    subtotal: 0,
    impuesto: 0,
    total: 0,
    estado: 'pendiente' as Venta['estado'],
    metodoPago: 'efectivo' as Venta['metodoPago']
  });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [ventaEditando, setVentaEditando] = useState<number | null>(null);
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [productoTemp, setProductoTemp] = useState({
    id: 0,
    nombre: '',
    cantidad: 1,
    precioUnitario: 0
  });

  useEffect(() => {
    const ventasGuardadas = localStorage.getItem('ventas');
    if (ventasGuardadas) {
      setVentas(JSON.parse(ventasGuardadas));
    } else {
      setVentas(ventasIniciales);
      localStorage.setItem('ventas', JSON.stringify(ventasIniciales));
    }
  }, []);

  useEffect(() => {
    if (ventas.length > 0) {
      localStorage.setItem('ventas', JSON.stringify(ventas));
    }
  }, [ventas]);

  const agregarProducto = () => {
    if (productoTemp.nombre && productoTemp.cantidad > 0 && productoTemp.precioUnitario > 0) {
      const subtotal = productoTemp.cantidad * productoTemp.precioUnitario;
      const nuevoProducto = {
        ...productoTemp,
        subtotal
      };
      
      const nuevosProductos = [...nuevaVenta.productos, nuevoProducto];
      const nuevoSubtotal = nuevosProductos.reduce((acc, prod) => acc + prod.subtotal, 0);
      const nuevoImpuesto = nuevoSubtotal * 0.16; // 16% de impuesto
      const nuevoTotal = nuevoSubtotal + nuevoImpuesto;

      setNuevaVenta({
        ...nuevaVenta,
        productos: nuevosProductos,
        subtotal: nuevoSubtotal,
        impuesto: nuevoImpuesto,
        total: nuevoTotal
      });

      setProductoTemp({
        id: Date.now(),
        nombre: '',
        cantidad: 1,
        precioUnitario: 0
      });
    }
  };

  const eliminarProducto = (index: number) => {
    const nuevosProductos = nuevaVenta.productos.filter((_, i) => i !== index);
    const nuevoSubtotal = nuevosProductos.reduce((acc, prod) => acc + prod.subtotal, 0);
    const nuevoImpuesto = nuevoSubtotal * 0.16;
    const nuevoTotal = nuevoSubtotal + nuevoImpuesto;

    setNuevaVenta({
      ...nuevaVenta,
      productos: nuevosProductos,
      subtotal: nuevoSubtotal,
      impuesto: nuevoImpuesto,
      total: nuevoTotal
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nuevaVenta.productos.length === 0) {
      alert('Debe agregar al menos un producto a la venta');
      return;
    }

    if (modoEdicion && ventaEditando) {
      setVentas(ventas.map(venta => 
        venta.id === ventaEditando 
          ? { ...nuevaVenta, id: venta.id }
          : venta
      ));
      setModoEdicion(false);
      setVentaEditando(null);
    } else {
      const venta: Venta = {
        id: Date.now(),
        ...nuevaVenta
      };
      setVentas([...ventas, venta]);
    }

    setNuevaVenta({
      numeroFactura: '',
      fecha: '',
      cliente: '',
      productos: [],
      subtotal: 0,
      impuesto: 0,
      total: 0,
      estado: 'pendiente',
      metodoPago: 'efectivo'
    });
  };

  const editarVenta = (venta: Venta) => {
    setModoEdicion(true);
    setVentaEditando(venta.id);
    setNuevaVenta({
      numeroFactura: venta.numeroFactura,
      fecha: venta.fecha,
      cliente: venta.cliente,
      productos: venta.productos,
      subtotal: venta.subtotal,
      impuesto: venta.impuesto,
      total: venta.total,
      estado: venta.estado,
      metodoPago: venta.metodoPago
    });
  };

  const eliminarVenta = (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta venta?')) {
      setVentas(ventas.filter(venta => venta.id !== id));
    }
  };

  const estados: Venta['estado'][] = ['pendiente', 'pagada', 'cancelada'];
  const metodosPago: Venta['metodoPago'][] = ['efectivo', 'tarjeta', 'transferencia'];

  const ventasFiltradas = ventas.filter(venta => {
    const cumpleFiltroFecha = !filtroFecha || venta.fecha === filtroFecha;
    const cumpleFiltroEstado = !filtroEstado || venta.estado === filtroEstado;
    return cumpleFiltroFecha && cumpleFiltroEstado;
  });

  const calcularTotalVentas = () => {
    return ventasFiltradas.reduce((total, venta) => total + venta.total, 0);
  };

  const calcularTotalImpuestos = () => {
    return ventasFiltradas.reduce((total, venta) => total + venta.impuesto, 0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gestión de Ventas</h1>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Ventas</h3>
          <p className="text-2xl text-indigo-600">
            ${calcularTotalVentas().toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Impuestos</h3>
          <p className="text-2xl text-green-600">
            ${calcularTotalImpuestos().toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Ventas por Estado</h3>
          <div className="space-y-2">
            {estados.map(estado => (
              <div key={estado} className="flex justify-between">
                <span className="capitalize">{estado}</span>
                <span className="font-semibold">
                  {ventasFiltradas.filter(v => v.estado === estado).length}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {modoEdicion ? 'Editar Venta' : 'Nueva Venta'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Número de Factura</label>
              <input
                type="text"
                value={nuevaVenta.numeroFactura}
                onChange={(e) => setNuevaVenta({ ...nuevaVenta, numeroFactura: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha</label>
              <input
                type="date"
                value={nuevaVenta.fecha}
                onChange={(e) => setNuevaVenta({ ...nuevaVenta, fecha: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cliente</label>
              <input
                type="text"
                value={nuevaVenta.cliente}
                onChange={(e) => setNuevaVenta({ ...nuevaVenta, cliente: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
          </div>

          {/* Agregar Productos */}
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Productos</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
                <input
                  type="text"
                  value={productoTemp.nombre}
                  onChange={(e) => setProductoTemp({ ...productoTemp, nombre: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cantidad</label>
                <input
                  type="number"
                  min="1"
                  value={productoTemp.cantidad}
                  onChange={(e) => setProductoTemp({ ...productoTemp, cantidad: Number(e.target.value) })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Precio Unitario</label>
                <input
                  type="number"
                  step="0.01"
                  value={productoTemp.precioUnitario}
                  onChange={(e) => setProductoTemp({ ...productoTemp, precioUnitario: Number(e.target.value) })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={agregarProducto}
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Agregar Producto
                </button>
              </div>
            </div>

            {/* Lista de Productos */}
            {nuevaVenta.productos.length > 0 && (
              <div className="mt-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Producto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cantidad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Precio Unit.
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subtotal
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {nuevaVenta.productos.map((producto, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {producto.nombre}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {producto.cantidad}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${producto.precioUnitario.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${producto.subtotal.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            type="button"
                            onClick={() => eliminarProducto(index)}
                            className="text-red-600 hover:text-red-900"
                          >
                            ❌
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50">
                      <td colSpan={3} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                        Subtotal:
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${nuevaVenta.subtotal.toLocaleString()}
                      </td>
                      <td></td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td colSpan={3} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                        Impuesto (16%):
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${nuevaVenta.impuesto.toLocaleString()}
                      </td>
                      <td></td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td colSpan={3} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                        Total:
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        ${nuevaVenta.total.toLocaleString()}
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Estado</label>
              <select
                value={nuevaVenta.estado}
                onChange={(e) => setNuevaVenta({ ...nuevaVenta, estado: e.target.value as Venta['estado'] })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              >
                {estados.map(estado => (
                  <option key={estado} value={estado}>
                    {estado.charAt(0).toUpperCase() + estado.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Método de Pago</label>
              <select
                value={nuevaVenta.metodoPago}
                onChange={(e) => setNuevaVenta({ ...nuevaVenta, metodoPago: e.target.value as Venta['metodoPago'] })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              >
                {metodosPago.map(metodo => (
                  <option key={metodo} value={metodo}>
                    {metodo.charAt(0).toUpperCase() + metodo.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            {modoEdicion && (
              <button
                type="button"
                onClick={() => {
                  setModoEdicion(false);
                  setVentaEditando(null);
                  setNuevaVenta({
                    numeroFactura: '',
                    fecha: '',
                    cliente: '',
                    productos: [],
                    subtotal: 0,
                    impuesto: 0,
                    total: 0,
                    estado: 'pendiente',
                    metodoPago: 'efectivo'
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {modoEdicion ? 'Guardar Cambios' : 'Crear Venta'}
            </button>
          </div>
        </form>
      </div>

      {/* Filtros */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Filtrar por Fecha</label>
            <input
              type="date"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Filtrar por Estado</label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Todos los estados</option>
              {estados.map(estado => (
                <option key={estado} value={estado}>
                  {estado.charAt(0).toUpperCase() + estado.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de ventas */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Factura
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ventasFiltradas.map((venta) => (
              <tr key={venta.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {venta.numeroFactura}
                  </div>
                  <div className="text-sm text-gray-500">
                    {venta.metodoPago}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {venta.cliente}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {venta.fecha}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${venta.total.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    venta.estado === 'pagada' ? 'bg-green-100 text-green-800' :
                    venta.estado === 'cancelada' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {venta.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => editarVenta(venta)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => eliminarVenta(venta.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    ❌
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