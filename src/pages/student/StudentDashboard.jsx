import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import DashboardCard from '../../components/DashboardCard';
import PollCard from '../../components/PollCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { studentApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Vote,
  Clock,
  Archive,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  History,
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await studentApi.getDashboard();
      setData(res.data);
    } catch (err) {
      console.error('Failed to load student dashboard:', err);
      setError('Could not load student polling data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="STUDENT VOTING PORTAL" subtitle="Cast your voice in university polls, surveys, and representative elections" />

        <main className="page-content">
          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <LoadingSpinner message="Loading your student polling center..." />
          ) : (
            <>
              {/* Personalized University Welcome Banner */}
              <div style={{
                background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 60%, #0f172a 100%)',
                borderRadius: '20px',
                padding: '30px',
                color: '#ffffff',
                marginBottom: '28px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 10px 25px -5px rgba(30, 64, 175, 0.3)',
              }}>
                <div style={{ position: 'relative', zIndex: 1, maxWidth: '650px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.15)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '12px' }}>
                    <Sparkles size={14} color="#93c5fd" />
                    <span>VERIFIED STUDENT VOTER</span>
                  </div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                    Welcome back, {data?.studentName || user?.fullName || 'Student'}!
                  </h2>
                  <p style={{ color: '#bfdbfe', fontSize: '0.95rem', lineHeight: 1.5 }}>
                    Student ID: <strong>{data?.studentId || user?.studentId}</strong> • Verified Campus Email: <strong>{data?.email || user?.email}</strong>.
                    Your vote is strictly authenticated and protected.
                  </p>
                </div>
              </div>

              {/* Statistics Metric Cards */}
              <div className="stats-grid">
                <DashboardCard
                  title="Open Active Polls"
                  value={data?.activePollsCount || 0}
                  icon={CheckCircle2}
                  color="#059669"
                  bg="#ecfdf5"
                />
                <DashboardCard
                  title="Upcoming Polls"
                  value={data?.upcomingPollsCount || 0}
                  icon={Clock}
                  color="#d97706"
                  bg="#fffbeb"
                />
                <DashboardCard
                  title="Closed / Concluded"
                  value={data?.closedPollsCount || 0}
                  icon={Archive}
                  color="#64748b"
                  bg="#f1f5f9"
                />
                <DashboardCard
                  title="Your Submitted Votes"
                  value={data?.votedPollsCount || 0}
                  icon={Vote}
                  color="#2563eb"
                  bg="#eff6ff"
                />
              </div>

              {/* Active Polls Section */}
              <div style={{ marginBottom: '36px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', color: '#0f172a' }}>Active Campus Ballots</h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      Polls currently accepting student votes
                    </p>
                  </div>
                  <Link to="/student/polls/active" className="btn btn-secondary btn-sm">
                    <span>View All Active</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>

                {data?.activePolls && data.activePolls.length > 0 ? (
                  <div className="polls-grid">
                    {data.activePolls.map((poll) => (
                      <PollCard key={poll.id} poll={poll} isAdmin={false} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No Active Polls Open"
                    message="There are currently no active ballots accepting votes. Check back soon for new campus surveys!"
                  />
                )}
              </div>

              {/* Recent Voting Activity */}
              {data?.recentVotes && data.recentVotes.length > 0 && (
                <div className="card">
                  <div className="card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <History size={20} color="#1e40af" />
                      <h3 className="card-title">Your Recent Voting Activity</h3>
                    </div>
                    <Link to="/student/history" className="btn btn-secondary btn-sm">
                      <span>Full History</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>

                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Poll Information</th>
                          <th>Status</th>
                          <th>Recorded Timestamp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.recentVotes.slice(0, 4).map((v) => (
                          <tr key={v.voteId}>
                            <td style={{ fontWeight: 600, color: '#1e293b' }}>
                              {v.message}
                            </td>
                            <td>
                              <span style={{ fontSize: '0.78rem', background: '#ecfdf5', color: '#047857', padding: '4px 10px', borderRadius: '12px', fontWeight: 700 }}>
                                ✓ Vote Confirmed
                              </span>
                            </td>
                            <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                              {new Date(v.votedAt).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
