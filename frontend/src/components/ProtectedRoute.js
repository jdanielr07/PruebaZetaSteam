'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children, onlyAdmin = false }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/login');
    } else if (onlyAdmin && user.role !== 'admin') {
      router.replace('/');
    }
  }, [user]);

  if (!user || (onlyAdmin && user.role !== 'admin')) return null;

  return children;
}