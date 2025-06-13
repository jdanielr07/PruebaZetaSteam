'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import BookCard from '@/components/BookCard';

export default function Home() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/api/books')
      .then(res => setBooks(res.data))
      .catch(err => console.error('Error al obtener libros', err));
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Catálogo de libros</h1>
      {books.length === 0 ? (
        <p>No hay libros disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
