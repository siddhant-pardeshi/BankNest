import React, { useState, useContext } from 'react';
import { deposit, extractMessage } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';

const Deposit = () => {
  const { refreshUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({ amount: '', description: '' });
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
    setSuccess('');
    setLoading(true);
    try {
      const res = await deposit({
        amount: parseFloat(formData.amount),
        description: formData.description
      });
      refreshUser();
      setSuccess(res.data.message || 'Deposit successful!');
      setFormData({ amount: '', description: '' });
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(extractMessage(err, 'Deposit failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4 py-md-5">
      <div className="row justify-content-center">
        <div className="col-md-7">
          <PageHeader title="Deposit Funds" subtitle="Add money to your account" icon={<i className="bi bi-plus-circle text-success"></i>} />
          <div className="bn-card p-4">
              {error && <div className="alert alert-danger rounded-3">{error}</div>}
              {success && <div className="alert alert-success rounded-3">{success}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-semibold text-muted small text-uppercase">Amount (₹)</label>
                  <div className="input-group input-group-lg">
                    <span className="input-group-text bg-light border-end-0 rounded-start-3">₹</span>
                    <input type="number" step="0.01" min="1" className="form-control border-start-0 rounded-end-3 fs-4 fw-bold text-success"
                           name="amount" value={formData.amount} onChange={handleChange} placeholder="0.00" required />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold text-muted small text-uppercase">Description (Optional)</label>
                  <input type="text" className="form-control rounded-3" name="description"
                         value={formData.description} onChange={handleChange} placeholder="e.g. Cash deposit, Salary" />
                </div>
                <div className="d-grid mt-5">
                  <button type="submit" className="btn btn-success btn-lg rounded-pill fw-bold shadow-sm" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Processing...
                      </>
                    ) : 'Deposit Funds'}
                  </button>
                </div>
              </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deposit;
