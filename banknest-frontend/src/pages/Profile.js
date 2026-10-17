import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { formatCurrency, formatDate } from '../utils/format';
import PageHeader from '../components/PageHeader';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="container mt-5 text-center py-5">
        <div className="spinner-border text-primary bn-spinner" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container py-4 py-md-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <PageHeader
            title="My Profile"
            subtitle="Your account details and settings"
            icon={<i className="bi bi-person-circle text-primary"></i>}
          />
          <div className="bn-card p-4 anim-item">
            <div className="row mb-4">
              <div className="col-md-6 mb-3">
                <p className="text-muted small mb-1">Full Name</p>
                <p className="fw-bold fs-5 mb-0">{user.ownerName}</p>
              </div>
              <div className="col-md-6 mb-3">
                <p className="text-muted small mb-1">Email</p>
                <p className="fw-bold fs-5 mb-0">{user.email}</p>
              </div>
              <div className="col-md-6 mb-3">
                <p className="text-muted small mb-1">Account Number</p>
                <p className="fw-bold fs-5 mb-0 font-monospace">{user.accountNumber}</p>
              </div>
              <div className="col-md-6 mb-3">
                <p className="text-muted small mb-1">Account Type</p>
                <p className="fw-bold fs-5 mb-0"><span className="badge bg-primary">{user.accountType}</span></p>
              </div>
              <div className="col-md-6 mb-3">
                <p className="text-muted small mb-1">Current Balance</p>
                <p className="fw-bold fs-5 mb-0 text-success">{formatCurrency(user.balance)}</p>
              </div>
              <div className="col-md-6 mb-3">
                <p className="text-muted small mb-1">Member Since</p>
                <p className="fw-bold fs-5 mb-0">{formatDate(user.createdAt)}</p>
              </div>
            </div>

            <hr className="my-4" />

            <h5 className="fw-bold mb-3">Quick Actions</h5>
            <div className="row g-3">
              <div className="col-md-3 col-6">
                <Link to="/deposit" className="btn btn-success w-100 rounded-pill fw-bold">Deposit</Link>
              </div>
              <div className="col-md-3 col-6">
                <Link to="/withdraw" className="btn btn-danger w-100 rounded-pill fw-bold">Withdraw</Link>
              </div>
              <div className="col-md-3 col-6">
                <Link to="/transfer" className="btn btn-primary w-100 rounded-pill fw-bold">Transfer</Link>
              </div>
              <div className="col-md-3 col-6">
                <button className="btn btn-outline-dark w-100 rounded-pill fw-bold" onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
