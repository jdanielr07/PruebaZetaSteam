'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      setError('Todos los campos son obligatorios');
      return;
    }

    try {
      await axios.post('http://localhost:4000/api/auth/register', {
        username: form.username,
        password: form.password,
        role: 'user',
      });

      router.push('/login');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error al registrar');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded space-y-4">
      <h1 className="text-xl font-bold text-blue-600">Registro de usuario</h1>
      {error && <p className="text-red-600">{error}</p>}

      <input
        type="text"
        placeholder="Nombre de usuario"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        className="w-full border p-2"
        required
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="w-full border p-2"
        required
      />

      <button type="submit" className="bg-green-600 text-white w-full py-2 rounded">
        Registrarse
      </button>
    </form>
  );
}