'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import BookCard from '@/components/BookCard';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (query && query.trim().length >= 2) {
      searchBooks(query);
    } else {
      setBooks([]);
    }
  }, [query]);

  const searchBooks = async (searchTerm) => {
    try {
      setLoading(true);
      setError(null);
      
      // Llamada a tu API de búsqueda
      const response = await fetch(`http://localhost:4000/api/books?search=${encodeURIComponent(searchTerm.trim())}`);

      if (!response.ok) {
        throw new Error('Error en la búsqueda');
      }
      
      const data = await response.json();
      setBooks(data || []);
    } catch (err) {
      setError(err.message);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Buscando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Resultados de búsqueda
        </h1>
        {query && (
          <p className="text-gray-600">
            Mostrando resultados para: <span className="font-semibold">"{query}"</span>
          </p>
        )}
        {!loading && (
          <p className="text-sm text-gray-500 mt-1">
            {books.length} resultado{books.length !== 1 ? 's' : ''} encontrado{books.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>Error: {error}</p>
        </div>
      )}

      {!loading && !error && books.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">
            No se encontraron resultados para "{query}"
          </div>
          <div className="text-gray-400">
            Intenta con otros términos de búsqueda
          </div>
        </div>
      )}

      {!loading && !error && books.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}