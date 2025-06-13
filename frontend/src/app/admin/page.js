'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

export default function AdminPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute onlyAdmin>
      <div>
        <h1 className="text-2xl font-bold text-red-600">Panel de Administración</h1>
        <p>Hola, {user?.role === 'admin' ? 'Admin' : 'Usuario'}.</p>
      </div>
    </ProtectedRoute>
  );
}