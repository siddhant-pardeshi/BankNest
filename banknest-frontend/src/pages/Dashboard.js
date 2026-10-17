import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useCountUp } from '../utils/animations';
import { formatCurrency, formatDate } from '../utils/format';

const quickActions = [
  { to: '/deposit', icon: 'bi-plus-circle', color: 'text-success', label: 'Deposit', desc: 'Add funds' },
  { to: '/withdraw', icon: 'bi-dash-circle', color: 'text-danger', label: 'Withdraw', desc: 'Cash out' },
  { to: '/transfer', icon: 'bi-send', color: 'text-primary', label: 'Transfer', desc: 'Send money' },
  { to: '/history', icon: 'bi-clock-history', color: 'text-info', label: 'History', desc: 'View all' },
];

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const animatedBalance = useCountUp(user ? user.balance : 0);

  if (!user) {
    return (
      <div className="container mt-5 text-center py-5">
        <div className="spinner-border text-primary bn-spinner" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4 py-md-5">
      <div className="mb-4 anim-item">
        <h2 className="fw-bold mb-1">Hello, {user.ownerName}!</h2>
        <p className="text-muted mb-0">Here is your account overview</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-4 anim-item">
          <div className="card border-0 rounded-4 text-white h-100 balance-card shadow">
            <div className="card-body p-4 d-flex flex-column justify-content-between">
              <div>
                <p className="text-white-50 small text-uppercase fw-semibold mb-2">Available Balance</p>
                <h1 className="display-5 fw-bold mb-0">{formatCurrency(animatedBalance)}</h1>
              </div>
              <div className="mt-4 pt-3 border-top border-white border-opacity-25">
                <p className="mb-1 text-white-50 small">Account Number</p>
                <p className="fs-5 font-monospace mb-0">{user.accountNumber}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-8 anim-item">
          <div className="bn-card p-4 h-100">
            <h5 className="fw-bold mb-3">Quick Actions</h5>
            <div className="row g-3">
              {quickActions.map((action) => (
                <div className="col-6 col-md-3" key={action.to}>
                  <Link to={action.to} className="text-decoration-none">
                    <div className="p-3 rounded-4 bg-light text-center action-card h-100">
                      <i className={`bi ${action.icon} fs-3 ${action.color} mb-2 d-block`}></i>
                      <h6 className="fw-bold text-dark mb-0">{action.label}</h6>
                      <p className="text-muted small mb-0">{action.desc}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-1 anim-item">
        <div className="col-12">
          <div className="bn-card p-4">
            <h5 className="fw-bold mb-3">Account Details</h5>
            <div className="row g-3">
              <div className="col-sm-6 col-md-3">
                <div className="stat-pill">
                  <p className="text-muted small mb-1">Type</p>
                  <span className="badge bg-primary">{user.accountType}</span>
                </div>
              </div>
              <div className="col-sm-6 col-md-5">
                <div className="stat-pill">
                  <p className="text-muted small mb-1">Email</p>
                  <p className="fw-semibold mb-0 small">{user.email}</p>
                </div>
              </div>
              <div className="col-sm-6 col-md-2">
                <div className="stat-pill">
                  <p className="text-muted small mb-1">Status</p>
                  <span className="badge bg-success-subtle text-success">Active</span>
                </div>
              </div>
              <div className="col-sm-6 col-md-2">
                <div className="stat-pill">
                  <p className="text-muted small mb-1">Since</p>
                  <p className="fw-semibold mb-0 small">{formatDate(user.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
