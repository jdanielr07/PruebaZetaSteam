'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import BookCard from '@/components/BookCard';
import {  
  Filter,
  X
} from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [totalBooks, setTotalBooks] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [availableGenres, setAvailableGenres] = useState([]);
  const [genre, setGenre] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const booksPerPage = 8;

  const fetchBooks = async (page) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (genre) params.append('genre', genre);

      const response = await axios.get(`http://localhost:4000/api/books?page=${page}&limit=${booksPerPage}&${params.toString()}`);

      setBooks(response.data.books);
      setCurrentPage(page);
      
      setTotalPages(response.data.totalPages || Math.ceil(response.data.total / booksPerPage));
      setTotalBooks(response.data.total || response.data.books.length);
    } catch (err) {
      console.error('Error al obtener libros:', err);
      setError('Error al cargar los libros. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setGenre('');
    setSearch('');
    setCurrentPage(1);
  };

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      setCurrentPage(1); // Reset a la primera página cuando se busca
      fetchBooks(1);
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [search]);

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

  useEffect(() => {
    fetchBooks(1);
  }, [genre, user]);

  useEffect(() => {
    fetchGenres();
  }, [user]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      fetchBooks(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error al cargar</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => fetchBooks(currentPage)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              📚 Catálogo de Libros
            </h1>
            <p className="text-gray-600">
              Descubre tu próxima gran lectura
            </p>
            {totalBooks > 0 && (
              <div className="mt-4 inline-flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                {totalBooks} libros disponibles
              </div>
            )}
          </div>
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
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">Cargando libros...</p>
          </div>
        )}

        {/* Books Grid */}
        {!loading && books.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">📖</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">No hay libros disponibles</h2>
            <p className="text-gray-500">Vuelve más tarde para ver nuevos títulos.</p>
          </div>
        ) : (
          !loading && (
            <>
              {/* Books Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
                {books.map((book) => (
                  <div
                    key={book.id}
                    className="transform hover:scale-105 transition-transform duration-200"
                  >
                    <BookCard book={book} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Page Info */}
                    <div className="text-sm text-gray-600">
                      Página <span className="font-semibold text-gray-900">{currentPage}</span> de{' '}
                      <span className="font-semibold text-gray-900">{totalPages}</span>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center space-x-2">
                      {/* Previous Button */}
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                          currentPage === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Anterior
                      </button>

                      {/* Page Numbers */}
                      <div className="hidden sm:flex items-center space-x-1">
                        {currentPage > 3 && (
                          <>
                            <button
                              onClick={() => handlePageChange(1)}
                              className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                            >
                              1
                            </button>
                            {currentPage > 4 && (
                              <span className="px-2 text-gray-400">...</span>
                            )}
                          </>
                        )}

                        {generatePageNumbers().map((pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-2 rounded-lg font-medium transition-colors duration-200 ${
                              pageNum === currentPage
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}

                        {currentPage < totalPages - 2 && (
                          <>
                            {currentPage < totalPages - 3 && (
                              <span className="px-2 text-gray-400">...</span>
                            )}
                            <button
                              onClick={() => handlePageChange(totalPages)}
                              className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                            >
                              {totalPages}
                            </button>
                          </>
                        )}
                      </div>

                      {/* Mobile Page Input */}
                      <div className="sm:hidden flex items-center space-x-2">
                        <input
                          type="number"
                          min="1"
                          max={totalPages}
                          value={currentPage}
                          onChange={(e) => {
                            const page = parseInt(e.target.value);
                            if (page >= 1 && page <= totalPages) {
                              handlePageChange(page);
                            }
                          }}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                        />
                        <span className="text-sm text-gray-600">de {totalPages}</span>
                      </div>

                      {/* Next Button */}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                          currentPage === totalPages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        Siguiente
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )
        )}
      </div>
    </div>
  );
}