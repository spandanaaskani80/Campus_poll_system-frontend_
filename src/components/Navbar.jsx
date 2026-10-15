import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, GraduationCap, Building2, Bell } from 'lucide-react';

const Navbar = ({ title, subtitle }) => {
  const { user, role } = useAuth();
  const isAdmin = role === 'ADMIN';

  return (
    <header className="top-navbar">
      <div className="nav-title">
        <Building2 size={24} color="#1e40af" />
        <div>
          <h2>{title || 'CAMPUS POLL SYSTEM'}</h2>
          {subtitle && <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{subtitle}</p>}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f1f5f9', padding: '6px 14px', borderRadius: '30px' }}>
          {isAdmin ? (
            <ShieldCheck size={18} color="#1e40af" />
          ) : (
            <GraduationCap size={18} color="#059669" />
          )}
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>
            {user?.fullName || user?.name}
          </span>
          <span style={{
            fontSize: '0.72rem',
            padding: '2px 8px',
            borderRadius: '12px',
            background: isAdmin ? '#dbeafe' : '#dcfce7',
            color: isAdmin ? '#1e40af' : '#15803d',
            fontWeight: 700
          }}>
            {isAdmin ? 'ADMIN' : user?.studentId || 'STUDENT'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
