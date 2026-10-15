import React from 'react';

const DashboardCard = ({ title, value, icon: Icon, color = '#2563eb', bg = '#eff6ff' }) => {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ backgroundColor: bg, color: color }}>
        {Icon && <Icon size={26} />}
      </div>
      <div className="stat-info">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{title}</div>
      </div>
    </div>
  );
};

export default DashboardCard;
