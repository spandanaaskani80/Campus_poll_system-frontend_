import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import DashboardCard from '../../components/DashboardCard';
import PollStatusBadge from '../../components/PollStatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { adminApi } from '../../services/api';
import {
  Users,
  Vote,
  CheckCircle2,
  Clock,
  Archive,
  BarChart3,
  PlusCircle,
  ListOrdered,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, pollsRes] = await Promise.all([
        adminApi.getDashboardStats(),
        adminApi.getAllPolls(),
      ]);
      setStats(statsRes.data);
      setPolls(pollsRes.data);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
      setError('Failed to fetch dashboard metrics. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="ADMINISTRATOR DASHBOARD" subtitle="Live campus voting analytics & poll control center" />

        <main className="page-content">
          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <LoadingSpinner message="Querying campus database for live statistics..." />
          ) : (
            <>
              {/* Live Statistics Cards */}
              <div className="stats-grid">
                <DashboardCard
                  title="Total Registered Users"
                  value={stats?.totalUsers || 0}
                  icon={Users}
                  color="#1e40af"
                  bg="#eff6ff"
                />
                <DashboardCard
                  title="Total Polls Created"
                  value={stats?.totalPolls || 0}
                  icon={Vote}
                  color="#2563eb"
                  bg="#eff6ff"
                />
                <DashboardCard
                  title="Active Open Polls"
                  value={stats?.activePolls || 0}
                  icon={CheckCircle2}
                  color="#059669"
                  bg="#ecfdf5"
                />
                <DashboardCard
                  title="Scheduled Polls"
                  value={stats?.scheduledPolls || 0}
                  icon={Clock}
                  color="#d97706"
                  bg="#fffbeb"
                />
                <DashboardCard
                  title="Closed Polls"
                  value={stats?.closedPolls || 0}
                  icon={Archive}
                  color="#475569"
                  bg="#f1f5f9"
                />
                <DashboardCard
                  title="Total Valid Votes"
                  value={stats?.totalValidVotes || 0}
                  icon={TrendingUp}
                  color="#7c3aed"
                  bg="#f5f3ff"
                />
              </div>

              {/* Quick Actions Panel */}
              <div className="card" style={{ marginBottom: '32px' }}>
                <div className="card-header">
                  <h3 className="card-title">Administrative Quick Actions</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                  <Link
                    to="/admin/create-poll"
                    className="btn btn-primary"
                    style={{ padding: '14px', justifyContent: 'flex-start' }}
                  >
                    <PlusCircle size={20} />
                    <span>Create New Campus Poll</span>
                  </Link>

                  <Link
                    to="/admin/manage-polls"
                    className="btn btn-secondary"
                    style={{ padding: '14px', justifyContent: 'flex-start' }}
                  >
                    <ListOrdered size={20} />
                    <span>Manage All Polls</span>
                  </Link>

                  <Link
                    to="/admin/users"
                    className="btn btn-secondary"
                    style={{ padding: '14px', justifyContent: 'flex-start' }}
                  >
                    <Users size={20} />
                    <span>View Registered Students</span>
                  </Link>
                </div>
              </div>

              {/* Recent Polls Overview */}
              <div className="card">
                <div className="card-header">
                  <div>
                    <h3 className="card-title">Recent Polls Status</h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
                      Real-time view of active, scheduled, and concluded student ballots
                    </p>
                  </div>
                  <Link to="/admin/manage-polls" className="btn btn-secondary btn-sm">
                    <span>View All</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>

                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Title & Question</th>
                        <th>Status</th>
                        <th>Voting Window</th>
                        <th>Votes</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {polls.slice(0, 5).map((poll) => (
                        <tr key={poll.id}>
                          <td>
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>{poll.title}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{poll.question}</div>
                          </td>
                          <td>
                            <PollStatusBadge status={poll.status} />
                          </td>
                          <td style={{ fontSize: '0.85rem', color: '#475569' }}>
                            <div>Start: {new Date(poll.startTime).toLocaleDateString()}</div>
                            <div>End: {new Date(poll.endTime).toLocaleDateString()}</div>
                          </td>
                          <td>
                            <span style={{ fontWeight: 700, color: '#1e40af' }}>{poll.totalVotes}</span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <Link to={`/admin/polls/${poll.id}/results`} className="btn btn-secondary btn-sm" title="View Results">
                                <BarChart3 size={14} />
                                <span>Results</span>
                              </Link>
                              <Link to={`/admin/polls/${poll.id}/edit`} className="btn btn-secondary btn-sm" title="Edit Poll">
                                <span>Edit</span>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {polls.length === 0 && (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                            No polls created yet. Click "Create New Campus Poll" to start.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
