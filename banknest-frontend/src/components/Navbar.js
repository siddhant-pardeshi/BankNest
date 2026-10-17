import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeMobileMenu = () => {
    const toggler = document.getElementById('navbarNav');
    if (toggler?.classList.contains('show')) {
      window.bootstrap?.Collapse?.getOrCreateInstance(toggler)?.hide();
    }
  };

  const navLinkClass = ({ isActive }) => `nav-link fw-semibold${isActive ? ' active' : ''}`;

  return (
    <header>
      <div className="bg-light py-1 d-none d-lg-block border-bottom" style={{ fontSize: '0.8rem' }}>
        <div className="container d-flex justify-content-end">
          <ul className="nav mb-0">
            <li className="nav-item"><span className="nav-link text-muted px-2 py-0">Personal</span></li>
            <li className="nav-item"><span className="nav-link text-muted px-2 py-0">Business</span></li>
            <li className="nav-item"><span className="nav-link text-muted px-2 py-0"><i className="bi bi-headset me-1"></i>Customer Care</span></li>
          </ul>
        </div>
      </div>

      <nav className="navbar navbar-expand-lg navbar-light bn-navbar shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold bn-brand d-flex align-items-center" to={user ? '/dashboard' : '/'}>
            <span className="bn-brand-icon"><i className="bi bi-bank2"></i></span>
            BankNest
          </Link>
          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1">
              {user ? (
                <>
                  <li className="nav-item" onClick={closeMobileMenu}>
                    <NavLink className={navLinkClass} to="/dashboard">
                      <i className="bi bi-grid me-1"></i> Dashboard
                    </NavLink>
                  </li>
                  <li className="nav-item dropdown">
                    <span className="nav-link dropdown-toggle fw-semibold" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <i className="bi bi-arrow-left-right me-1"></i> Transactions
                    </span>
                    <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3">
                      <li><Link className="dropdown-item" to="/deposit" onClick={closeMobileMenu}><i className="bi bi-plus-circle me-2 text-success"></i>Deposit</Link></li>
                      <li><Link className="dropdown-item" to="/withdraw" onClick={closeMobileMenu}><i className="bi bi-dash-circle me-2 text-danger"></i>Withdraw</Link></li>
                      <li><Link className="dropdown-item" to="/transfer" onClick={closeMobileMenu}><i className="bi bi-send me-2 text-primary"></i>Transfer</Link></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><Link className="dropdown-item" to="/history" onClick={closeMobileMenu}><i className="bi bi-clock-history me-2"></i>History</Link></li>
                    </ul>
                  </li>
                  <li className="nav-item" onClick={closeMobileMenu}>
                    <NavLink className={navLinkClass} to="/beneficiaries">
                      <i className="bi bi-people me-1"></i> Beneficiaries
                    </NavLink>
                  </li>
                  <li className="nav-item" onClick={closeMobileMenu}>
                    <NavLink className={navLinkClass} to="/profile">
                      <i className="bi bi-person-circle me-1"></i> Profile
                    </NavLink>
                  </li>
                  <li className="nav-item ms-lg-2">
                    <button className="btn btn-bn-outline rounded-pill px-4" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink className={navLinkClass} to="/" end>Home</NavLink>
                  </li>
                  <li className="nav-item ms-lg-2">
                    <Link className="btn btn-bn-outline rounded-pill px-4" to="/login">Login</Link>
                  </li>
                  <li className="nav-item ms-lg-2">
                    <Link className="btn btn-bn-primary rounded-pill px-4" to="/register">
                      Open Account
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
