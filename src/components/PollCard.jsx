import React from 'react';
import { Link } from 'react-router-dom';
import PollStatusBadge from './PollStatusBadge';
import { Calendar, Users, BarChart3, CheckCircle, ArrowRight } from 'lucide-react';

const PollCard = ({ poll, isAdmin = false }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return dateStr;
    }
  };

  const isClosed = poll.status === 'CLOSED';
  const isActive = poll.status === 'ACTIVE' && poll.active;
  const isScheduled = poll.status === 'SCHEDULED';

  return (
    <div className="poll-card">
      <div className="poll-card-header">
        <h3 className="poll-card-title">{poll.title}</h3>
        <PollStatusBadge status={poll.status} />
      </div>

      <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
        {poll.question}
      </p>

      {poll.description && (
        <p className="poll-card-desc">{poll.description}</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: '#64748b', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Calendar size={14} color="#3b82f6" />
          <span>Ends: {formatDate(poll.endTime)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Users size={14} color="#10b981" />
          <span>Total Votes: <strong>{poll.totalVotes}</strong></span>
        </div>
      </div>

      <div className="poll-card-meta">
        {isAdmin ? (
          <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
            <Link to={`/admin/polls/${poll.id}/results`} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
              <BarChart3 size={15} />
              <span>Results</span>
            </Link>
            <Link to={`/admin/polls/${poll.id}/edit`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
              <span>Edit</span>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '8px', width: '100%', alignItems: 'center' }}>
            {poll.hasVoted ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontWeight: 600, fontSize: '0.88rem', flex: 1 }}>
                <CheckCircle size={18} />
                <span>You Voted</span>
              </div>
            ) : isActive ? (
              <Link to={`/student/polls/${poll.id}`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                <span>Cast Vote</span>
                <ArrowRight size={15} />
              </Link>
            ) : isScheduled ? (
              <span style={{ fontSize: '0.82rem', color: '#d97706', fontWeight: 500, flex: 1 }}>
                Opens {formatDate(poll.startTime)}
              </span>
            ) : (
              <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500, flex: 1 }}>
                Poll Ended
              </span>
            )}

            {poll.canViewResults && (
              <Link to={`/student/polls/${poll.id}/results`} className="btn btn-secondary btn-sm" title="View Results">
                <BarChart3 size={15} />
                <span>Results</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PollCard;
