'use client';

import { useState, useEffect } from 'react';

interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
  costo: number;
  stock: number;
  stockMinimo: number;
  proveedor: string;
  ubicacion: string;
  estado: 'activo' | 'descontinuado' | 'agotado';
}

const productosIniciales: Producto[] = [
  {
    id: 1,
    codigo: 'PROD001',
    nombre: 'Laptop HP ProBook',
    descripcion: 'Laptop empresarial con procesador i5',
    categoria: 'Electrónicos',
    precio: 899.99,
    costo: 650.00,
    stock: 15,
    stockMinimo: 5,
    proveedor: 'HP Distribuidores',
    ubicacion: 'Almacén A-12',
    estado: 'activo'
  },
  {
    id: 2,
    codigo: 'PROD002',
    nombre: 'Monitor Dell 24"',
    descripcion: 'Monitor LED Full HD',
    categoria: 'Electrónicos',
    precio: 249.99,
    costo: 180.00,
    stock: 8,
    stockMinimo: 3,
    proveedor: 'Dell Solutions',
    ubicacion: 'Almacén B-03',
    estado: 'activo'
  }
];

export default function InventarioPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    categoria: '',
    precio: '',
    costo: '',
    stock: '',
    stockMinimo: '',
    proveedor: '',
    ubicacion: '',
    estado: 'activo' as Producto['estado']
  });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoEditando, setProductoEditando] = useState<number | null>(null);
  const [filtro, setFiltro] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');

  useEffect(() => {
    const productosGuardados = localStorage.getItem('productos');
    if (productosGuardados) {
      setProductos(JSON.parse(productosGuardados));
    } else {
      setProductos(productosIniciales);
      localStorage.setItem('productos', JSON.stringify(productosIniciales));
    }
  }, []);

  useEffect(() => {
    if (productos.length > 0) {
      localStorage.setItem('productos', JSON.stringify(productos));
    }
  }, [productos]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modoEdicion && productoEditando) {
      setProductos(productos.map(prod => 
        prod.id === productoEditando 
          ? {
              ...nuevoProducto,
              id: prod.id,
              precio: Number(nuevoProducto.precio),
              costo: Number(nuevoProducto.costo),
              stock: Number(nuevoProducto.stock),
              stockMinimo: Number(nuevoProducto.stockMinimo)
            }
          : prod
      ));
      setModoEdicion(false);
      setProductoEditando(null);
    } else {
      const producto: Producto = {
        id: Date.now(),
        ...nuevoProducto,
        precio: Number(nuevoProducto.precio),
        costo: Number(nuevoProducto.costo),
        stock: Number(nuevoProducto.stock),
        stockMinimo: Number(nuevoProducto.stockMinimo)
      };
      setProductos([...productos, producto]);
    }
    setNuevoProducto({
      codigo: '',
      nombre: '',
      descripcion: '',
      categoria: '',
      precio: '',
      costo: '',
      stock: '',
      stockMinimo: '',
      proveedor: '',
      ubicacion: '',
      estado: 'activo'
    });
  };

  const editarProducto = (producto: Producto) => {
    setModoEdicion(true);
    setProductoEditando(producto.id);
    setNuevoProducto({
      codigo: producto.codigo,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      categoria: producto.categoria,
      precio: producto.precio.toString(),
      costo: producto.costo.toString(),
      stock: producto.stock.toString(),
      stockMinimo: producto.stockMinimo.toString(),
      proveedor: producto.proveedor,
      ubicacion: producto.ubicacion,
      estado: producto.estado
    });
  };

  const eliminarProducto = (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      setProductos(productos.filter(prod => prod.id !== id));
    }
  };

  const categorias = ['Electrónicos', 'Oficina', 'Mobiliario', 'Software', 'Redes', 'Consumibles'];
  const estados: Producto['estado'][] = ['activo', 'descontinuado', 'agotado'];

  const productosFiltrados = productos.filter(prod => {
    const cumpleFiltroTexto = 
      prod.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      prod.codigo.toLowerCase().includes(filtro.toLowerCase()) ||
      prod.descripcion.toLowerCase().includes(filtro.toLowerCase());
    const cumpleFiltroCategoria = !categoriaFiltro || prod.categoria === categoriaFiltro;
    return cumpleFiltroTexto && cumpleFiltroCategoria;
  });

  const calcularValorInventario = () => {
    return productosFiltrados.reduce((total, prod) => total + (prod.precio * prod.stock), 0);
  };

  const calcularProductosBajoStock = () => {
    return productosFiltrados.filter(prod => prod.stock <= prod.stockMinimo).length;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gestión de Inventario</h1>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Productos</h3>
          <p className="text-2xl text-indigo-600">{productosFiltrados.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Valor del Inventario</h3>
          <p className="text-2xl text-indigo-600">
            ${calcularValorInventario().toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Productos Bajo Stock</h3>
          <p className="text-2xl text-red-600">{calcularProductosBajoStock()}</p>
        </div>
      </div>

      {/* Formulario */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {modoEdicion ? 'Editar Producto' : 'Nuevo Producto'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Código</label>
              <input
                type="text"
                value={nuevoProducto.codigo}
                onChange={(e) => setNuevoProducto({ ...nuevoProducto, codigo: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                value={nuevoProducto.nombre}
                onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Categoría</label>
              <select
                value={nuevoProducto.categoria}
                onChange={(e) => setNuevoProducto({ ...nuevoProducto, categoria: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                value={nuevoProducto.descripcion}
                onChange={(e) => setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })}
                rows={2}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Precio</label>
              <input
                type="number"
                step="0.01"
                value={nuevoProducto.precio}
                onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Costo</label>
              <input
                type="number"
                step="0.01"
                value={nuevoProducto.costo}
                onChange={(e) => setNuevoProducto({ ...nuevoProducto, costo: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock</label>
              <input
                type="number"
                value={nuevoProducto.stock}
                onChange={(e) => setNuevoProducto({ ...nuevoProducto, stock: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock Mínimo</label>
              <input
                type="number"
                value={nuevoProducto.stockMinimo}
                onChange={(e) => setNuevoProducto({ ...nuevoProducto, stockMinimo: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Proveedor</label>
              <input
                type="text"
                value={nuevoProducto.proveedor}
                onChange={(e) => setNuevoProducto({ ...nuevoProducto, proveedor: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ubicación</label>
              <input
                type="text"
                value={nuevoProducto.ubicacion}
                onChange={(e) => setNuevoProducto({ ...nuevoProducto, ubicacion: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Estado</label>
              <select
                value={nuevoProducto.estado}
                onChange={(e) => setNuevoProducto({ ...nuevoProducto, estado: e.target.value as Producto['estado'] })}
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
          </div>
          <div className="flex justify-end space-x-3">
            {modoEdicion && (
              <button
                type="button"
                onClick={() => {
                  setModoEdicion(false);
                  setProductoEditando(null);
                  setNuevoProducto({
                    codigo: '',
                    nombre: '',
                    descripcion: '',
                    categoria: '',
                    precio: '',
                    costo: '',
                    stock: '',
                    stockMinimo: '',
                    proveedor: '',
                    ubicacion: '',
                    estado: 'activo'
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
              {modoEdicion ? 'Guardar Cambios' : 'Crear Producto'}
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
              placeholder="Buscar por código, nombre o descripción..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Filtrar por Categoría</label>
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Todas las categorías</option>
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
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
            {productosFiltrados.map((producto) => (
              <tr key={producto.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {producto.nombre}
                      </div>
                      <div className="text-sm text-gray-500">
                        {producto.codigo}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {producto.categoria}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {producto.stock}
                    {producto.stock <= producto.stockMinimo && (
                      <span className="ml-2 text-red-600">⚠️</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    Min: {producto.stockMinimo}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${producto.precio.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    producto.estado === 'activo' ? 'bg-green-100 text-green-800' :
                    producto.estado === 'descontinuado' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {producto.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => editarProducto(producto)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => eliminarProducto(producto.id)}
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