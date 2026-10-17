import React, { useState, useEffect } from 'react';
import { getBeneficiaries, addBeneficiary, deleteBeneficiary, extractMessage } from '../services/api';
import PageHeader from '../components/PageHeader';

const Beneficiaries = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', accountNumber: '', bankName: '', ifscCode: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchBeneficiaries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBeneficiaries = async () => {
    try {
      const res = await getBeneficiaries();
      setBeneficiaries(res.data);
    } catch (err) {
      console.error('Failed to fetch beneficiaries', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await addBeneficiary(formData);
      setSuccess('Beneficiary added successfully!');
      setFormData({ name: '', accountNumber: '', bankName: '', ifscCode: '' });
      fetchBeneficiaries();
    } catch (err) {
      setError(extractMessage(err, 'Failed to add beneficiary.'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this beneficiary?')) return;
    try {
      await deleteBeneficiary(id);
      fetchBeneficiaries();
    } catch (err) {
      setError(extractMessage(err, 'Failed to remove beneficiary.'));
    }
  };

  return (
    <div className="container py-4 py-md-5">
      <PageHeader
        title="Beneficiaries"
        subtitle="Manage your trusted recipients for quick transfers"
        icon={<i className="bi bi-people text-primary"></i>}
      />

      <div className="row">
        <div className="col-md-4 mb-4 mb-md-0 anim-item">
          <div className="bn-card p-4 h-100">
            <h5 className="fw-bold mb-3">Add Beneficiary</h5>
            {error && <div className="alert alert-danger rounded-3">{error}</div>}
            {success && <div className="alert alert-success rounded-3">{success}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold text-muted small text-uppercase">Name</label>
                <input type="text" className="form-control" value={formData.name}
                       onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold text-muted small text-uppercase">Account Number</label>
                <input type="text" className="form-control font-monospace" value={formData.accountNumber}
                       onChange={(e) => setFormData({...formData, accountNumber: e.target.value})} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold text-muted small text-uppercase">Bank Name</label>
                <input type="text" className="form-control" value={formData.bankName}
                       onChange={(e) => setFormData({...formData, bankName: e.target.value})} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold text-muted small text-uppercase">IFSC Code</label>
                <input type="text" className="form-control font-monospace" value={formData.ifscCode}
                       onChange={(e) => setFormData({...formData, ifscCode: e.target.value})} required />
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-bn-primary rounded-pill fw-bold">Add Beneficiary</button>
              </div>
            </form>
          </div>
        </div>

        <div className="col-md-8 anim-item">
          <div className="bn-card p-4 h-100">
            <h5 className="fw-bold mb-3">Saved Beneficiaries</h5>
            {loading ? (
              <div className="text-center py-4"><div className="spinner-border text-primary"></div></div>
            ) : beneficiaries.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-person-plus text-muted fs-1 d-block mb-2"></i>
                <p className="text-muted mb-0">No beneficiaries saved yet. Add one to transfer faster.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th className="text-uppercase text-muted small fw-semibold">Name</th>
                      <th className="text-uppercase text-muted small fw-semibold">Account Number</th>
                      <th className="text-uppercase text-muted small fw-semibold">Bank</th>
                      <th className="text-uppercase text-muted small fw-semibold">IFSC</th>
                      <th className="text-uppercase text-muted small fw-semibold text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {beneficiaries.map((b) => (
                      <tr key={b.id} className="anim-item">
                        <td className="fw-bold">{b.name}</td>
                        <td className="font-monospace">{b.accountNumber}</td>
                        <td>{b.bankName}</td>
                        <td className="font-monospace small">{b.ifscCode}</td>
                        <td className="text-end">
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(b.id)}>Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Beneficiaries;
