import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Unauthorized = () => {
  const { role } = useAuth();
  const dashboardLink = role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard';

  return (
    <div className="auth-page-container">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: '#fef2f2',
          color: '#ef4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <ShieldAlert size={36} />
        </div>

        <h1 style={{ fontSize: '1.6rem', color: '#0f172a', marginBottom: '8px' }}>Access Denied (403)</h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '28px', lineHeight: 1.5 }}>
          You do not have administrative clearance to access this page. This action has been logged by the security subsystem.
        </p>

        <Link to={dashboardLink} className="btn btn-primary" style={{ display: 'inline-flex' }}>
          <ArrowLeft size={18} />
          <span>Return to Your Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
