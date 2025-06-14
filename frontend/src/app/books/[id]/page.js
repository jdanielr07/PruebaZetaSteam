'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function BookDetailPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchBook(id);
    }
  }, [id]);

  const fetchBook = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/books/${id}`);
      setBook(res.data);
    } catch (err) {
      console.error('Error al obtener libro', err);
    }
  };  

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Cargando libro...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  if (!book) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start md:space-x-8">
        {/* Imagen */}
        {book.image && (
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <img
              src={book.image}
              alt={book.title}
              className="rounded shadow w-full object-cover"
            />
          </div>
        )}

        {/* Información */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{book.title}</h1>
          <p className="text-gray-700 text-lg mb-2">
            <span className="font-semibold">Autor:</span> {book.author}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Género:</span> {book.genre || 'N/A'}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">ISBN:</span> {book.isbn}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Fecha de publicación:</span>{' '}
            {book.publication_date ? new Date(book.publication_date).toLocaleDateString() : 'N/A'}
          </p>
          <p className="text-gray-700 mb-4">
            <span className="font-semibold">Stock:</span> {book.stock}
          </p>
          <p className="text-2xl text-blue-600 font-bold mb-6">${book.price}</p>

          {/* Descripción */}
          <div className="text-gray-800 leading-relaxed">
            {book.description || 'Sin descripción disponible.'}
          </div>
        </div>
      </div>
    </div>
  );
}