import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useSession from '../hooks/useSession';

export default function ProtectedRoute({ children }) {
  const session = useSession();
  const location = useLocation();

  // sementara loading: jangan render apa‑apa
  if (session === undefined) return null;

  // jika belum login, redirect ke /login
  if (!session) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // kalau sudah ada session, render children
  return children;
}
