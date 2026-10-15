import React from 'react';

const PollStatusBadge = ({ status }) => {
  const normStatus = (status || 'DRAFT').toUpperCase();

  switch (normStatus) {
    case 'ACTIVE':
      return (
        <span className="badge badge-active">
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10b981' }} />
          Active
        </span>
      );
    case 'SCHEDULED':
      return (
        <span className="badge badge-scheduled">
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#f59e0b' }} />
          Scheduled
        </span>
      );
    case 'CLOSED':
      return (
        <span className="badge badge-closed">
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#64748b' }} />
          Closed
        </span>
      );
    case 'DRAFT':
    default:
      return (
        <span className="badge badge-draft">
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#94a3b8' }} />
          Draft
        </span>
      );
  }
};

export default PollStatusBadge;
