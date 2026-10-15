import React from 'react';
import { Inbox, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({ title = 'No polls available', message = 'There are currently no polls found in this category.', actionLink, actionText }) => {
  return (
    <div style={{
      padding: '48px 24px',
      textAlign: 'center',
      background: '#ffffff',
      borderRadius: '16px',
      border: '1px dashed #cbd5e1',
      maxWidth: '520px',
      margin: '20px auto',
    }}>
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '16px',
        backgroundColor: '#f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px',
        color: '#64748b',
      }}>
        <Inbox size={28} />
      </div>

      <h3 style={{ fontSize: '1.15rem', color: '#1e293b', marginBottom: '6px' }}>{title}</h3>
      <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: actionLink ? '20px' : '0' }}>{message}</p>

      {actionLink && actionText && (
        <Link to={actionLink} className="btn btn-primary btn-sm" style={{ display: 'inline-flex', marginTop: '10px' }}>
          <Plus size={16} />
          <span>{actionText}</span>
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
