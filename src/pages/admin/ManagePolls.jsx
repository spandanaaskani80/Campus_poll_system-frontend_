import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import PollStatusBadge from '../../components/PollStatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmationModal from '../../components/ConfirmationModal';
import { adminApi } from '../../services/api';
import {
  PlusCircle,
  BarChart3,
  Edit,
  Send,
  Lock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Search,
} from 'lucide-react';

const ManagePolls = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState(null); // 'publish' or 'close'
  const [selectedPoll, setSelectedPoll] = useState(null);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getAllPolls();
      setPolls(res.data);
    } catch (err) {
      console.error('Failed to fetch polls:', err);
      setError('Failed to load campus polls.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const openActionModal = (poll, type) => {
    setSelectedPoll(poll);
    setActionType(type);
    setModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedPoll || !actionType) return;
    setModalOpen(false);
    setError('');
    setSuccess('');

    try {
      if (actionType === 'publish') {
        await adminApi.publishPoll(selectedPoll.id);
        setSuccess(`Poll "${selectedPoll.title}" has been published!`);
      } else if (actionType === 'close') {
        await adminApi.closePoll(selectedPoll.id);
        setSuccess(`Poll "${selectedPoll.title}" has been closed. Final votes preserved.`);
      }
      fetchPolls();
    } catch (err) {
      const msg = err.response?.data?.message || `Failed to ${actionType} poll.`;
      setError(msg);
    }
  };

  const filteredPolls = polls.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="MANAGE CAMPUS POLLS" subtitle="Publish, schedule, close, and review campus elections and surveys" />

        <main className="page-content">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px' }}>
            <div style={{ position: 'relative', width: '320px' }}>
              <input
                type="text"
                placeholder="Search polls by title or question..."
                className="form-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '38px' }}
              />
              <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>

            <Link to="/admin/create-poll" className="btn btn-primary">
              <PlusCircle size={18} />
              <span>Create New Poll</span>
            </Link>
          </div>

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              <CheckCircle2 size={18} />
              <span>{success}</span>
            </div>
          )}

          {loading ? (
            <LoadingSpinner message="Loading all campus polls from database..." />
          ) : (
            <div className="card">
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '30%' }}>Title & Question</th>
                      <th style={{ width: '12%' }}>Status</th>
                      <th style={{ width: '22%' }}>Schedule Window</th>
                      <th style={{ width: '10%' }}>Votes</th>
                      <th style={{ width: '26%' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPolls.map((poll) => {
                      const isClosed = poll.status === 'CLOSED';
                      const isPublished = poll.published;

                      return (
                        <tr key={poll.id}>
                          <td>
                            <div style={{ fontWeight: 700, color: '#0f172a' }}>{poll.title}</div>
                            <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                              {poll.question}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                              Visibility: <strong>{poll.resultVisibility}</strong> • {poll.options?.length || 0} options
                            </div>
                          </td>
                          <td>
                            <PollStatusBadge status={poll.status} />
                          </td>
                          <td style={{ fontSize: '0.82rem', color: '#475569' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Calendar size={13} color="#3b82f6" />
                              <span>Opens: {new Date(poll.startTime).toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                              <Calendar size={13} color="#ef4444" />
                              <span>Closes: {new Date(poll.endTime).toLocaleString()}</span>
                            </div>
                          </td>
                          <td>
                            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e40af', fontFamily: 'Outfit' }}>
                              {poll.totalVotes}
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              <Link
                                to={`/admin/polls/${poll.id}/results`}
                                className="btn btn-secondary btn-sm"
                                title="View Vote Analytics"
                              >
                                <BarChart3 size={14} color="#1e40af" />
                                <span>Results</span>
                              </Link>

                              <Link
                                to={`/admin/polls/${poll.id}/edit`}
                                className="btn btn-secondary btn-sm"
                                title="Edit Poll Details"
                              >
                                <Edit size={14} />
                                <span>Edit</span>
                              </Link>

                              {!isPublished && (
                                <button
                                  onClick={() => openActionModal(poll, 'publish')}
                                  className="btn btn-success btn-sm"
                                  title="Publish this poll immediately"
                                >
                                  <Send size={14} />
                                  <span>Publish</span>
                                </button>
                              )}

                              {!isClosed && (
                                <button
                                  onClick={() => openActionModal(poll, 'close')}
                                  className="btn btn-danger btn-sm"
                                  title="Immediately close poll and finalize results"
                                >
                                  <Lock size={14} />
                                  <span>Close</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {filteredPolls.length === 0 && (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                          No polls matching your filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmAction}
        title={actionType === 'publish' ? 'Publish Poll' : 'Close Poll'}
        message={
          actionType === 'publish'
            ? `Are you sure you want to publish "${selectedPoll?.title}"? Eligible students will be able to cast votes.`
            : `Are you sure you want to close "${selectedPoll?.title}"? Once closed, no further votes will be accepted, and final tallies will be computed.`
        }
        confirmText={actionType === 'publish' ? 'Yes, Publish Poll' : 'Yes, Close Poll'}
        confirmStyle={actionType === 'publish' ? 'btn-success' : 'btn-danger'}
      />
    </div>
  );
};

export default ManagePolls;
