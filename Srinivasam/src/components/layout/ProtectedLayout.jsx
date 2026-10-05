import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Connecting to Srinivasam...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export function AdminLayout() {
  const { user, profile, loading } = useAuth();
  const isSessionAdmin = sessionStorage.getItem('srinivasam_admin') === 'true';

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;
  if (isSessionAdmin || (user && profile?.role === 'admin')) {
    return <Outlet />;
  }
  return <Navigate to="/admin/login" replace />;
}

export function OrphanageLayout() {
  const { user, profile, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function VolunteerLayout() {
  const { user, profile, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (profile?.role !== 'volunteer') return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

export function PublicOnlyLayout() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading Srinivasam...</p>
      </div>
    );
  }

  if (user) {
    if (profile?.role === 'orphanage') {
      return <Navigate to="/orphanage/dashboard" replace />;
    }
    if (profile?.role === 'volunteer') {
      return <Navigate to="/volunteer/dashboard" replace />;
    }
    if (profile?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
