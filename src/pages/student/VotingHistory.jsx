import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { studentApi } from '../../services/api';
import { History, CheckCircle2, Calendar, BarChart3 } from 'lucide-react';

const VotingHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await studentApi.getVotingHistory();
        setHistory(res.data);
      } catch (err) {
        setError('Failed to load voting history.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="MY VOTING HISTORY" subtitle="Your verified voting record across past and current campus polls" />

        <main className="page-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: '#1e40af', fontWeight: 600 }}>
            <History size={18} />
            <span>{history.length} Total Ballots Cast</span>
          </div>

          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <LoadingSpinner message="Retrieving your voting ledger..." />
          ) : history.length > 0 ? (
            <div className="card">
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Poll Reference</th>
                      <th>Ballot Status</th>
                      <th>Recorded Timestamp</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item) => (
                      <tr key={item.voteId}>
                        <td>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{item.message}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                            Ballot Reference ID: #{item.voteId}
                          </div>
                        </td>
                        <td>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: '#ecfdf5',
                            color: '#047857',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                          }}>
                            <CheckCircle2 size={14} />
                            Valid Vote Saved
                          </span>
                        </td>
                        <td style={{ fontSize: '0.85rem', color: '#475569' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={14} color="#94a3b8" />
                            <span>{new Date(item.votedAt).toLocaleString()}</span>
                          </div>
                        </td>
                        <td>
                          <Link to={`/student/polls/${item.pollId}/results`} className="btn btn-secondary btn-sm">
                            <BarChart3 size={14} />
                            <span>Results</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <EmptyState
              title="No Voting History Yet"
              message="You have not participated in any polls yet. Browse active polls to make your voice heard!"
              actionLink="/student/polls/active"
              actionText="Browse Active Polls"
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default VotingHistory;
