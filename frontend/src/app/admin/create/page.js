'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function CreateBookPage() {
  const { user } = useAuth();
  const router = useRouter();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:4000/api/books', form, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      router.push('/admin/books'); // redirigimos a la lista de libros
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error al crear libro');
    }
  };

  return (
    <ProtectedRoute onlyAdmin>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded space-y-4">
        <h1 className="text-xl font-bold text-blue-600">Crear nuevo libro</h1>
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

        <button type="submit" className="bg-green-600 text-white w-full py-2 rounded">
          Guardar libro
        </button>
      </form>
    </ProtectedRoute>
  );
}
