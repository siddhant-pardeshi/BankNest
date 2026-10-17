import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transfer from './pages/Transfer';
import Deposit from './pages/Deposit';
import Withdraw from './pages/Withdraw';
import History from './pages/History';
import Beneficiaries from './pages/Beneficiaries';
import Profile from './pages/Profile';

/* Re-mounts on navigation so each route animates in.
   HashRouter keeps deep links working on any static host. */
const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <div className="page-enter" key={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/transfer" element={<ProtectedRoute><Transfer /></ProtectedRoute>} />
        <Route path="/deposit" element={<ProtectedRoute><Deposit /></ProtectedRoute>} />
        <Route path="/withdraw" element={<ProtectedRoute><Withdraw /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="/beneficiaries" element={<ProtectedRoute><Beneficiaries /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1">
            <AnimatedRoutes />
          </main>

          <footer className="bn-footer mt-auto">
            <div className="container text-center text-muted">
              <p className="mb-0 small">
                &copy; {new Date().getFullYear()} BankNest — Modern Digital Banking
              </p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
