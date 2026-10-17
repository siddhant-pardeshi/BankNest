import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="container mt-5 text-center py-5">
        <div className="spinner-border text-primary bn-spinner" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted mt-3">Loading your account...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
