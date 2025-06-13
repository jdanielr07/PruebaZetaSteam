'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

export default function EditBookPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [form, setForm] = useState({
    title: '',
    author: '',
    image: '',
    isbn: '',
    genre: '',
    publication_date: '',
    stock: 0,
    price: '',
    description: '',
  });

  const [error, setError] = useState('');

  const fetchBook = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/books`);
      const book = res.data.find(b => b.id === parseInt(id));
      if (book) {
        setForm({
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          genre: book.genre || '',
          publication_date: book.publication_date ? book.publication_date.substring(0, 10) : '',
          stock: book.stock,
          price: book.price,
          description: book.description || '',
        });
      }
    } catch (err) {
      console.error('Error al obtener libro', err);
    }
  };

  useEffect(() => {
    fetchBook();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:4000/api/books/${id}`, form, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      router.push('/admin/books');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error al actualizar libro');
    }
  };

  return (
    <ProtectedRoute onlyAdmin>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded space-y-4">
        <h1 className="text-xl font-bold text-blue-600">Editar libro</h1>
        {error && <p className="text-red-600">{error}</p>}

        <input
          type="text"
          placeholder="Título"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border p-2"
          required
        />

        <input
          type="text"
          placeholder="Autor"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
          className="w-full border p-2"
          required
        />

        <input
          type="text"
          placeholder="URL de la imagen"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          className="w-full border p-2"
        />

        <input
          type="text"
          placeholder="ISBN"
          value={form.isbn}
          onChange={(e) => setForm({ ...form, isbn: e.target.value })}
          className="w-full border p-2"
          required
        />

        <input
          type="text"
          placeholder="Género"
          value={form.genre}
          onChange={(e) => setForm({ ...form, genre: e.target.value })}
          className="w-full border p-2"
        />

        <input
          type="date"
          placeholder="Fecha de publicación"
          value={form.publication_date}
          onChange={(e) => setForm({ ...form, publication_date: e.target.value })}
          className="w-full border p-2"
        />

        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) })}
          className="w-full border p-2"
        />

        <input
          type="number"
          step="0.01"
          placeholder="Precio"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="w-full border p-2"
        />

        <textarea
          placeholder="Descripción"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border p-2"
        />

        <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded">
          Actualizar libro
        </button>
      </form>
    </ProtectedRoute>
  );
}
