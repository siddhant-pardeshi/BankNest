import React, { useState, useEffect } from 'react';
import { getHistory, extractMessage } from '../services/api';
import { formatCurrency, formatDate } from '../utils/format';
import PageHeader from '../components/PageHeader';

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getHistory();
        setTransactions(res.data);
      } catch (err) {
        setError(extractMessage(err, 'Failed to fetch transaction history.'));
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getTypeBadge = (type) => {
    switch (type) {
      case 'DEPOSIT':
        return <span className="badge bg-success-subtle text-success rounded-pill px-3 py-2">Deposit</span>;
      case 'WITHDRAWAL':
        return <span className="badge bg-danger-subtle text-danger rounded-pill px-3 py-2">Withdrawal</span>;
      case 'TRANSFER':
        return <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2">Transfer</span>;
      default:
        return <span className="badge bg-secondary-subtle text-secondary rounded-pill px-3 py-2">{type}</span>;
    }
  };

  const getAmountColor = (type) => {
    if (type === 'DEPOSIT') return 'text-success';
    if (type === 'WITHDRAWAL') return 'text-danger';
    return 'text-dark';
  };

  const getAmountPrefix = (type) => {
    if (type === 'DEPOSIT') return '+';
    if (type === 'WITHDRAWAL') return '-';
    return '';
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary bn-spinner" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4 py-md-5">
      <PageHeader
        title="Transaction History"
        subtitle="All your deposits, withdrawals, and transfers"
        icon={<i className="bi bi-clock-history text-primary"></i>}
      />

      {error && <div className="alert alert-danger rounded-3">{error}</div>}

      <div className="bn-card overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="text-uppercase text-muted small fw-semibold py-3 ps-4">Date</th>
                <th className="text-uppercase text-muted small fw-semibold py-3">Type</th>
                <th className="text-uppercase text-muted small fw-semibold py-3">Description</th>
                <th className="text-uppercase text-muted small fw-semibold py-3 text-end pe-4">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-5">
                    <i className="bi bi-inbox text-muted fs-1 d-block mb-2"></i>
                    <span className="text-muted">No transactions yet. Your activity will appear here.</span>
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="anim-item">
                    <td className="ps-4 fw-medium">{formatDate(tx.timestamp, true)}</td>
                    <td>{getTypeBadge(tx.type)}</td>
                    <td className="text-muted">{tx.description || 'N/A'}</td>
                    <td className={`text-end pe-4 fw-bold ${getAmountColor(tx.type)}`}>
                      {getAmountPrefix(tx.type)}{formatCurrency(tx.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;
