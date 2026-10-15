import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NotFound = () => {
  const { isAuthenticated, role } = useAuth();
  const homeLink = !isAuthenticated ? '/login' : role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard';

  return (
    <div className="auth-page-container">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: '#eff6ff',
          color: '#2563eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <AlertTriangle size={36} />
        </div>

        <h1 style={{ fontSize: '1.6rem', color: '#0f172a', marginBottom: '8px' }}>Page Not Found (404)</h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '28px', lineHeight: 1.5 }}>
          The requested campus resource or page does not exist or may have been moved.
        </p>

        <Link to={homeLink} className="btn btn-primary" style={{ display: 'inline-flex' }}>
          <Home size={18} />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
