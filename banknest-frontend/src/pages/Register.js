import React, { useState } from 'react';
import { register, extractMessage } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    accountType: 'SAVINGS',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ ...formData, email: formData.email.trim() });
      setSuccess('Account created! A ₹1,000 welcome bonus has been credited. Redirecting to login...');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(extractMessage(err, 'Failed to register. The email might already be in use.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid auth-split">
      <div className="row h-100">
        <div className="col-lg-5 d-none d-lg-flex auth-side-panel">
          <div>
            <h2>Join BankNest Today</h2>
            <p className="opacity-75 mt-3">
              Open a Savings or Current account in seconds. Every new account starts with a
              ₹1,000 welcome bonus to explore the platform.
            </p>
            <div className="mt-4 p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <p className="mb-1 small opacity-75">What happens on signup?</p>
              <p className="mb-0 fw-semibold">1 User + 1 Bank Account + ₹1,000 balance</p>
            </div>
          </div>
        </div>
        <div className="col-lg-7 d-flex align-items-center justify-content-center py-5">
          <div className="auth-card bn-card p-4 p-md-5">
            <div className="text-center mb-4">
              <div className="page-header-icon d-inline-flex mb-3">
                <i className="bi bi-person-plus text-primary fs-4"></i>
              </div>
              <h2 className="fw-bold mb-1">Create Account</h2>
              <p className="text-muted">Fill in your details below</p>
            </div>
            {error && <div className="alert alert-danger rounded-3">{error}</div>}
            {success && <div className="alert alert-success rounded-3">{success}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-floating mb-3">
                <input
                  className="form-control rounded-3"
                  id="inputName"
                  type="text"
                  placeholder="John Doe"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="inputName">Full Name</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  className="form-control rounded-3"
                  id="inputEmail"
                  type="email"
                  placeholder="name@example.com"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="inputEmail">Email address</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  className="form-control rounded-3"
                  id="inputPassword"
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
                <label htmlFor="inputPassword">Password (min. 6 characters)</label>
              </div>
              <div className="form-floating mb-4">
                <select
                  className="form-select rounded-3"
                  id="accountType"
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleChange}
                >
                  <option value="SAVINGS">Savings Account</option>
                  <option value="CURRENT">Current Account</option>
                </select>
                <label htmlFor="accountType">Account Type</label>
              </div>
              <button className="btn btn-bn-primary w-100 py-3 fs-6" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating account...
                  </>
                ) : 'Register'}
              </button>
            </form>
            <p className="text-center mt-4 mb-0 small text-muted">
              Already have an account? <Link to="/login" className="fw-semibold text-decoration-none">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
