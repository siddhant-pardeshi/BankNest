import React, { useState, useContext } from 'react';
import { login, extractMessage } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login({ email: email.trim(), password });
      await loginAuth(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(extractMessage(err, 'Invalid credentials or server error. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid auth-split">
      <div className="row h-100">
        <div className="col-lg-5 d-none d-lg-flex auth-side-panel">
          <div>
            <h2>Welcome back to BankNest</h2>
            <p className="opacity-75 mt-3">
              Access your account, check your balance, transfer funds, and review your
              transaction history — all in one place.
            </p>
            <ul className="list-unstyled mt-4 opacity-75">
              <li className="mb-2"><i className="bi bi-check-circle me-2"></i> Secure login</li>
              <li className="mb-2"><i className="bi bi-check-circle me-2"></i> Real-time balance</li>
              <li className="mb-2"><i className="bi bi-check-circle me-2"></i> Transaction history</li>
            </ul>
          </div>
        </div>
        <div className="col-lg-7 d-flex align-items-center justify-content-center py-5">
          <div className="auth-card bn-card p-4 p-md-5">
            <div className="text-center mb-4">
              <div className="page-header-icon d-inline-flex mb-3">
                <i className="bi bi-bank2 text-primary fs-4"></i>
              </div>
              <h2 className="fw-bold mb-1">Sign In</h2>
              <p className="text-muted">Enter your credentials to continue</p>
            </div>
            {error && <div className="alert alert-danger rounded-3">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-floating mb-3">
                <input
                  className="form-control rounded-3"
                  id="inputEmail"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="inputEmail">Email address</label>
              </div>
              <div className="form-floating mb-4">
                <input
                  className="form-control rounded-3"
                  id="inputPassword"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label htmlFor="inputPassword">Password</label>
              </div>
              <button className="btn btn-bn-primary w-100 py-3 fs-6" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Signing in...
                  </>
                ) : 'Log In'}
              </button>
            </form>
            <p className="text-center mt-4 mb-0 small text-muted">
              New here? <Link to="/register" className="fw-semibold text-decoration-none">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
