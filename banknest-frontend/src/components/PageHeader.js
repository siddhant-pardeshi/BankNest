import React from 'react';

const PageHeader = ({ title, subtitle, icon }) => (
  <div className="page-header mb-4">
    <div className="d-flex align-items-center gap-3">
      {icon && <div className="page-header-icon">{icon}</div>}
      <div>
        <h2 className="fw-bold mb-1">{title}</h2>
        {subtitle && <p className="text-muted mb-0">{subtitle}</p>}
      </div>
    </div>
  </div>
);

export default PageHeader;
