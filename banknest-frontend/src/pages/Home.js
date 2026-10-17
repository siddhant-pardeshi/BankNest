import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useReveal } from '../utils/animations';

const quickActions = [
  { title: 'Accounts', icon: 'bi-wallet2' },
  { title: 'Cards', icon: 'bi-credit-card' },
  { title: 'Loans', icon: 'bi-cash-coin' },
  { title: 'Invest', icon: 'bi-graph-up-arrow' },
  { title: 'Insure', icon: 'bi-shield-check' },
  { title: 'Pay', icon: 'bi-phone-vibrate' }
];

const features = [
  {
    icon: 'bi-box-arrow-in-down',
    color: 'blue',
    title: 'Instant Deposits & Withdrawals',
    desc: 'Manage your cash flow with real-time balance updates and zero hassle.',
  },
  {
    icon: 'bi-send-fill',
    color: 'green',
    title: 'Lightning Fast Transfers',
    desc: 'Send money securely to any BankNest account using just their account number.',
  },
  {
    icon: 'bi-person-lines-fill',
    color: 'purple',
    title: 'Manage Beneficiaries',
    desc: 'Save your trusted contacts and family members for quick, one-tap transfers.',
  },
  {
    icon: 'bi-clock-history',
    color: 'orange',
    title: 'Detailed Transaction History',
    desc: 'Keep track of all your banking activity in one consolidated place.',
  },
];

const FeatureCard = ({ feature }) => {
  const ref = useReveal();
  return (
    <div className="col-md-6 col-lg-3" ref={ref}>
      <div className="feature-card text-center h-100 p-4 border-0 shadow-sm reveal" style={{ borderRadius: '12px' }}>
        <div className={`feature-icon mx-auto mb-3 ${feature.color}`} style={{ width: '60px', height: '60px', fontSize: '1.8rem' }}>
          <i className={`bi ${feature.icon}`}></i>
        </div>
        <h5 className="fw-bold text-dark mb-3">{feature.title}</h5>
        <p className="text-muted small mb-0">{feature.desc}</p>
      </div>
    </div>
  );
};

const Home = () => {
  const { user } = useContext(AuthContext);
  const ctaRef = useReveal();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <section className="hero-section">
        <div className="container position-relative">
          <div className="row align-items-center">
            <div className="col-lg-7 py-5">
              <span className="hero-badge"><i className="bi bi-star-fill text-warning me-2"></i>Premium Banking</span>
              <h1 className="hero-title mb-4">
                Welcome to BankNest<br />
                <span style={{ color: 'var(--bn-primary)' }}>Your Trusted Financial Partner</span>
              </h1>
              <p className="hero-subtitle mb-4 text-dark">
                Experience seamless banking, intelligent investments, and secure transactions.
                Open a digital savings account today and take control of your financial future.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/register" className="btn btn-bn-primary btn-lg px-5 shadow-sm">
                  Open Savings Account
                </Link>
                <button type="button" className="btn btn-outline-dark btn-lg px-4 bg-white text-dark border-0 shadow-sm"
                        onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                  Know More
                </button>
              </div>
            </div>

            <div className="col-lg-5 d-none d-lg-block">
              <div className="bn-card p-4 text-start shadow-lg border-0" style={{ background: '#ffffff', borderRadius: '12px' }}>
                <h4 className="fw-bold text-dark mb-4">Secure Login</h4>

                <div className="mb-3">
                  <label className="form-label text-muted small fw-semibold">Login using</label>
                  <div className="d-flex gap-2 mb-3">
                    <button className="btn btn-outline-dark btn-sm flex-grow-1 active">Password</button>
                    <button className="btn btn-outline-dark btn-sm flex-grow-1" disabled title="Coming soon">OTP</button>
                  </div>
                </div>

                <Link to="/login" className="btn btn-bn-primary w-100 mb-3 py-2 fw-bold" style={{ fontSize: '1.1rem' }}>
                  Login to Internet Banking <i className="bi bi-arrow-right ms-2"></i>
                </Link>

                <div className="mt-4 pt-3 border-top">
                  <p className="text-muted small mb-2">New to BankNest?</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="fw-bold text-dark mb-0">Get a Starting Balance of</h6>
                    <h5 className="fw-bold text-success mb-0">₹1,000.00</h5>
                  </div>
                  <Link to="/register" className="text-decoration-none fw-semibold mt-2 d-inline-block" style={{ color: 'var(--bn-primary)' }}>
                    Register Now <i className="bi bi-chevron-right small"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-bottom shadow-sm position-relative" style={{ zIndex: 10 }}>
        <div className="container">
          <div className="row text-center py-3">
            {quickActions.map((action) => (
              <div className="col-4 col-md-2 mb-3 mb-md-0" key={action.title}>
                <div className="text-dark d-block action-link-hover" style={{ cursor: 'default' }}>
                  <div className="mb-2">
                    <i className={`bi ${action.icon}`} style={{ fontSize: '1.8rem', color: 'var(--bn-accent)' }}></i>
                  </div>
                  <span className="fw-semibold small">{action.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5" id="features" style={{ backgroundColor: 'var(--bn-bg)' }}>
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="fw-bold" style={{ color: 'var(--bn-primary)' }}>Banking made beautiful</h2>
            <p className="text-muted">Explore our suite of financial tools designed for modern living.</p>
          </div>
          <div className="row g-4">
            {features.map((f) => (
              <FeatureCard feature={f} key={f.title} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 bg-white border-top">
        <div className="container">
          <div className="row align-items-center bg-light rounded-4 p-4 p-md-5 border reveal" ref={ctaRef}>
            <div className="col-lg-8 text-center text-lg-start mb-4 mb-lg-0">
              <h3 className="fw-bold text-dark mb-2">Ready to start your journey?</h3>
              <p className="text-muted mb-0">Join thousands of customers who trust BankNest with their finances.</p>
            </div>
            <div className="col-lg-4 text-center text-lg-end">
              <Link to="/register" className="btn btn-bn-primary btn-lg px-4 py-3 rounded-pill fw-bold">
                Open Account Instantly
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
