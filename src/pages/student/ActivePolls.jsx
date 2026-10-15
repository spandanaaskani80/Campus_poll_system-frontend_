import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import PollCard from '../../components/PollCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { studentApi } from '../../services/api';
import { CheckCircle2, Search } from 'lucide-react';

const ActivePolls = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchActivePolls = async () => {
      try {
        setLoading(true);
        const res = await studentApi.getActivePolls();
        setPolls(res.data);
      } catch (err) {
        setError('Failed to fetch active polls.');
      } finally {
        setLoading(false);
      }
    };

    fetchActivePolls();
  }, []);

  const filteredPolls = polls.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="ACTIVE CAMPUS POLLS" subtitle="Select a poll below to cast your verified student vote" />

        <main className="page-content">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div style={{ position: 'relative', width: '320px' }}>
              <input
                type="text"
                placeholder="Search active polls..."
                className="form-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '38px' }}
              />
              <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontWeight: 600, fontSize: '0.9rem' }}>
              <CheckCircle2 size={18} />
              <span>{polls.length} Polls Open Now</span>
            </div>
          </div>

          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <LoadingSpinner message="Retrieving open student ballots..." />
          ) : filteredPolls.length > 0 ? (
            <div className="polls-grid">
              {filteredPolls.map((poll) => (
                <PollCard key={poll.id} poll={poll} isAdmin={false} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Active Polls"
              message={searchTerm ? 'No polls match your search.' : 'There are currently no polls open for voting.'}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default ActivePolls;
