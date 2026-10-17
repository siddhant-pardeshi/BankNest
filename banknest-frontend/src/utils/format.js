/** Format amount in Indian Rupees — used across all pages */
export const formatCurrency = (amount) => {
  const value = Number(amount) || 0;
  return value.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatDate = (dateString, withTime = false) => {
  if (!dateString) return 'N/A';
  const options = withTime
    ? { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    : { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-IN', options);
};
