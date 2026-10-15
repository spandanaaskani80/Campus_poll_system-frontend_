import React from 'react';

const LoadingSpinner = ({ message = 'Loading campus information...' }) => {
  return (
    <div style={{ padding: '60px 20px', textAlign: 'center' }}>
      <div
        style={{
          width: '42px',
          height: '42px',
          border: '4px solid #dbeafe',
          borderTopColor: '#1d4ed8',
          borderRadius: '50%',
          animation: 'spin 0.9s linear infinite',
          margin: '0 auto 16px',
        }}
      />
      <p style={{ color: '#64748b', fontSize: '0.92rem', fontWeight: 500 }}>
        {message}
      </p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
