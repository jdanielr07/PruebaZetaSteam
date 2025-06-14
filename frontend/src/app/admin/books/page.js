'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios'; // Se mantiene para referencia, reemplazar con fetch nativo
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  BookOpen, 
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Eye,
  Settings,
  AlertTriangle,
  X
} from 'lucide-react';

export default function AdminProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, bookId: null, bookTitle: '' });
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [genre, setGenre] = useState('');
  const [availableGenres, setAvailableGenres] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const productsPerPage = 5;

  // Obtener géneros disponibles
  const fetchGenres = async () => {
    try {
      if (!user) return;
      
      const res = await axios.get('http://localhost:4000/api/books/genres', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setAvailableGenres(res.data || []);
    } catch (err) {
      console.error('Error al obtener géneros', err);
      setAvailableGenres([]);
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      let searchQuery = '';
      if (search) {
        searchQuery += `&search=${encodeURIComponent(search)}`;
      }
      if (genre) {
        searchQuery += `&genre=${encodeURIComponent(genre)}`;
      }
      if (!user) return;

      const res = await axios.get(`http://localhost:4000/api/books?page=${currentPage}&limit=${productsPerPage}${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = res.data;
      setProducts(data.books || []);
      setTotalProducts(data.total || 0);
      setTotalPages(data.totalPages || Math.ceil((data.total || 0) / productsPerPage));
    } catch (err) {
      console.error('Error al obtener productos', err);
      setProducts([]);
      setTotalProducts(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:4000/api/books/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
      });
      fetchProducts();
      setDeleteModal({ show: false, bookId: null, bookTitle: '' });
    } catch (err) {
      console.error('Error al eliminar', err);
    }
  };

  const openDeleteModal = (id, title) => {
    setDeleteModal({ show: true, bookId: id, bookTitle: title });
  };

  const clearFilters = () => {
    setGenre('');
    setSearch('');
    setCurrentPage(1);
  };

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      setCurrentPage(1);
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [search]);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, genre]);

  useEffect(() => {
    fetchGenres();
  }, [user]);

  const currentProducts = products;

  // Componente de Loading
  const LoadingRow = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
          <div className="ml-4">
            <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex space-x-2">
          <div className="h-8 w-16 bg-gray-200 rounded"></div>
          <div className="h-8 w-16 bg-gray-200 rounded"></div>
        </div>
      </td>
    </tr>
  );

  return (
    <ProtectedRoute onlyAdmin>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-blue-600 p-2 rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Libros</h1>
                <p className="text-gray-600">Administra tu catálogo de libros</p>
              </div>
            </div>
          </div>

          {/* Barra de acciones */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              {/* Búsqueda */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por título o autor..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Botones de acción */}
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors duration-200 ${
                    showFilters || genre 
                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span>Filtros</span>
                  {genre && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">1</span>
                  )}
                </button>
                <Link
                  href="/admin/create"
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
                >
                  <Plus className="w-5 h-5" />
                  <span>Nuevo Libro</span>
                </Link>
              </div>
            </div>

            {/* Panel de filtros */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Género</label>
                    <select
                      value={genre}
                      onChange={(e) => {
                        setGenre(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Todos los géneros</option>
                      {availableGenres.map((g) => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                      <X className="w-4 h-4" />
                      <span>Limpiar filtros</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Filtros activos */}
            {(genre || search) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Filtros activos:</span>
                  {genre && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      Género: {genre}
                      <button
                        onClick={() => setGenre('')}
                        className="ml-2 hover:text-blue-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {search && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                      Búsqueda: {search}
                      <button
                        onClick={() => setSearch('')}
                        className="ml-2 hover:text-green-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{totalProducts}</div>
                <div className="text-sm text-gray-600">Total de libros</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{currentProducts.length}</div>
                <div className="text-sm text-gray-600">Mostrando</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{totalPages}</div>
                <div className="text-sm text-gray-600">Páginas</div>
              </div>
            </div>
          </div>

          {/* Tabla de productos */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {totalProducts === 0 && !isLoading ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay libros</h3>
                <p className="text-gray-600 mb-6">Comienza agregando tu primer libro al catálogo</p>
                <Link
                  href="/admin/create"
                  className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors duration-200"
                >
                  <Plus className="w-5 h-5" />
                  <span>Agregar Libro</span>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Libro
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Género
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Precio
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                      Array.from({ length: 3 }).map((_, index) => <LoadingRow key={index} />)
                    ) : (
                      currentProducts.map(book => (
                        <tr key={book.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12">
                                {book.image ? (
                                  <img
                                    className="h-12 w-12 rounded-lg object-cover"
                                    src={book.image}
                                    alt={book.title}
                                  />
                                ) : (
                                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                    <BookOpen className="w-6 h-6 text-blue-600" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-semibold text-gray-900 max-w-xs truncate">
                                  {book.title}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {book.author || 'Autor no especificado'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                              {book.Genre?.name || 'Sin género'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-bold text-green-600">
                              ${book.price}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {book.active ? (
                            <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              Activo
                            </span>
                            ) : (
                              <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                              inactivo
                            </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                                <Eye className="w-4 h-4" />
                              </button>
                              <Link
                                href={`/admin/books/${book.id}/edit`}
                                className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors duration-200"
                              >
                                <Edit className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => openDeleteModal(book.id, book.title)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Paginación mejorada */}
            {totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Mostrando {((currentPage - 1) * productsPerPage) + 1} a {Math.min(currentPage * productsPerPage, totalProducts)} de {totalProducts} resultados
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors duration-200"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    {/* Paginación inteligente */}
                    {totalPages <= 7 ? (
                      // Mostrar todas las páginas si son 7 o menos
                      Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                            page === currentPage
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      ))
                    ) : (
                      // Paginación inteligente para muchas páginas
                      <>
                        {currentPage > 3 && (
                          <>
                            <button
                              onClick={() => setCurrentPage(1)}
                              className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                            >
                              1
                            </button>
                            {currentPage > 4 && <span className="px-2 text-gray-500">...</span>}
                          </>
                        )}
                        
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let page;
                          if (currentPage <= 3) {
                            page = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            page = totalPages - 4 + i;
                          } else {
                            page = currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                                page === currentPage
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                        
                        {currentPage < totalPages - 2 && (
                          <>
                            {currentPage < totalPages - 3 && <span className="px-2 text-gray-500">...</span>}
                            <button
                              onClick={() => setCurrentPage(totalPages)}
                              className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                            >
                              {totalPages}
                            </button>
                          </>
                        )}
                      </>
                    )}
                    
                    <button
                      onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors duration-200"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal de confirmación de eliminación */}
        {deleteModal.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 transform transition-all duration-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Confirmar eliminación</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que quieres eliminar el libro <strong>"{deleteModal.bookTitle}"</strong>? 
                Esta acción no se puede deshacer.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setDeleteModal({ show: false, bookId: null, bookTitle: '' })}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(deleteModal.bookId)}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors duration-200"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}