'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div>
        <h1 className="text-2xl font-bold">Bienvenido al panel {user?.username}</h1>
        <p>Tu rol: <strong>{user?.role}</strong></p>
        <button onClick={logout} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
          Cerrar sesión
        </button>
      </div>
    </ProtectedRoute>
  );
}