'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function AdminProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/books');
      setProducts(res.data);
    } catch (err) {
      console.error('Error al obtener productos', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este libro?')) return;
    try {
      await axios.delete(`http://localhost:4000/api/books/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchProducts();
    } catch (err) {
      console.error('Error al eliminar', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filtro de búsqueda
  const filteredProducts = products.filter(book =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

  // Paginación
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <ProtectedRoute onlyAdmin>
      <div>
        <h1 className="text-2xl font-bold mb-4 text-blue-600">Panel de Administración - Libros</h1>
        <div className="flex justify-between mb-4">
          <Link href="/admin/create" className="bg-green-600 text-white px-4 py-2 rounded">
            + Nuevo libro
          </Link>
          <input
            type="text"
            placeholder="Buscar libro..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded"
          />
        </div>

        {currentProducts.length === 0 ? (
          <p>No hay libros.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Nombre</th>
                  <th className="p-2 border">Precio</th>
                  <th className="p-2 border">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map(book => (
                  <tr key={book.id} className="hover:bg-gray-50">
                    <td className="p-2 border">{book.title}</td>
                    <td className="p-2 border">${book.price}</td>
                    <td className="p-2 border space-x-2">
                      <Link
                        href={`/admin/books/${book.id}/edit`}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded ${page === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
