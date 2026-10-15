import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import PollCard from '../../components/PollCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { studentApi } from '../../services/api';
import { Clock } from 'lucide-react';

const UpcomingPolls = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        setLoading(true);
        const res = await studentApi.getUpcomingPolls();
        setPolls(res.data);
      } catch (err) {
        setError('Failed to load upcoming polls.');
      } finally {
        setLoading(false);
      }
    };

    fetchUpcoming();
  }, []);

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="UPCOMING CAMPUS POLLS" subtitle="Scheduled elections and surveys opening soon for students" />

        <main className="page-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: '#d97706', fontWeight: 600 }}>
            <Clock size={18} />
            <span>{polls.length} Polls Opening Soon</span>
          </div>

          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <LoadingSpinner message="Checking schedule calendar..." />
          ) : polls.length > 0 ? (
            <div className="polls-grid">
              {polls.map((poll) => (
                <PollCard key={poll.id} poll={poll} isAdmin={false} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Upcoming Polls Scheduled"
              message="No future polls are currently scheduled. Check back later for updates from campus administration."
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default UpcomingPolls;
