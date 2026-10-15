import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import PollCard from '../../components/PollCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { studentApi } from '../../services/api';
import { Archive } from 'lucide-react';

const ClosedPolls = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClosed = async () => {
      try {
        setLoading(true);
        const res = await studentApi.getClosedPolls();
        setPolls(res.data);
      } catch (err) {
        setError('Failed to load closed polls.');
      } finally {
        setLoading(false);
      }
    };

    fetchClosed();
  }, []);

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="CONCLUDED CAMPUS POLLS" subtitle="Historical voting records and finalized election outcomes" />

        <main className="page-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: '#64748b', fontWeight: 600 }}>
            <Archive size={18} />
            <span>{polls.length} Concluded Polls</span>
          </div>

          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <LoadingSpinner message="Retrieving concluded campus polls..." />
          ) : polls.length > 0 ? (
            <div className="polls-grid">
              {polls.map((poll) => (
                <PollCard key={poll.id} poll={poll} isAdmin={false} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Concluded Polls"
              message="No polls have ended yet."
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default ClosedPolls;
