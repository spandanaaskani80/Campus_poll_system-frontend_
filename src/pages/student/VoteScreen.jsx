import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmationModal from '../../components/ConfirmationModal';
import { studentApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Vote,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Send,
  BarChart3,
  ShieldCheck,
  Check,
} from 'lucide-react';

const VoteScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [poll, setPoll] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [voteSubmitted, setVoteSubmitted] = useState(false);

  const fetchPollDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await studentApi.getPollById(id);
      setPoll(res.data);
      if (res.data.hasVoted) {
        setVoteSubmitted(true);
        setSelectedOptionId(res.data.userVotedOptionId);
      }
    } catch (err) {
      console.error('Failed to load poll details:', err);
      const msg = err.response?.data?.message || 'Failed to load ballot details.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPollDetails();
  }, [id]);

  const handleOpenConfirm = (e) => {
    e.preventDefault();
    if (!selectedOptionId) {
      setError('Please select one answer choice to submit your vote.');
      return;
    }
    setError('');
    setModalOpen(true);
  };

  const handleVoteSubmit = async () => {
    setModalOpen(false);
    setIsSubmitting(true);
    setError('');

    try {
      const res = await studentApi.submitVote(id, selectedOptionId);
      setSuccessMessage(res.data.message || 'Vote submitted successfully!');
      setVoteSubmitted(true);
      fetchPollDetails();
    } catch (err) {
      const msg = err.response?.data?.message || 'Vote submission failed.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedOptionObj = poll?.options?.find((o) => o.id === selectedOptionId);

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="BALLOT CASTING SCREEN" subtitle="Official student vote submission interface" />

        <main className="page-content">
          <div style={{ maxWidth: '780px', margin: '0 auto' }}>
            <div style={{ marginBottom: '20px' }}>
              <button onClick={() => navigate('/student/polls/active')} className="btn btn-secondary btn-sm">
                <ArrowLeft size={16} />
                <span>Back to Active Polls</span>
              </button>
            </div>

            {error && (
              <div className="alert alert-error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="alert alert-success">
                <CheckCircle2 size={18} />
                <span>{successMessage}</span>
              </div>
            )}

            {loading ? (
              <LoadingSpinner message="Loading ballot options..." />
            ) : poll ? (
              <>
                {/* Already Voted Banner */}
                {poll.hasVoted && (
                  <div style={{
                    backgroundColor: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    borderRadius: '16px',
                    padding: '20px',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                  }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#10b981', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CheckCircle2 size={28} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ color: '#065f46', fontSize: '1.1rem', fontWeight: 700 }}>
                        You have already voted in this poll.
                      </h4>
                      <p style={{ color: '#047857', fontSize: '0.88rem', marginTop: '2px' }}>
                        Your ballot has been securely counted and recorded in the university database.
                      </p>
                    </div>
                    {poll.canViewResults && (
                      <Link to={`/student/polls/${poll.id}/results`} className="btn btn-secondary btn-sm">
                        <BarChart3 size={15} color="#059669" />
                        <span>View Results</span>
                      </Link>
                    )}
                  </div>
                )}

                {/* Ballot Card */}
                <div className="card">
                  <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '20px', marginBottom: '24px' }}>
                    <div style={{ display: 'inline-block', padding: '4px 10px', background: '#dbeafe', color: '#1e40af', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px' }}>
                      Official Ballot
                    </div>
                    <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '8px' }}>
                      {poll.title}
                    </h2>
                    <h3 style={{ fontSize: '1.15rem', color: '#334155', fontWeight: 600, marginBottom: '10px' }}>
                      {poll.question}
                    </h3>
                    {poll.description && (
                      <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.6 }}>
                        {poll.description}
                      </p>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '14px', fontSize: '0.82rem', color: '#64748b' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Calendar size={14} color="#3b82f6" />
                        <span>Closes: {new Date(poll.endTime).toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <ShieldCheck size={14} color="#059669" />
                        <span>Voter: {user?.fullName} ({user?.studentId})</span>
                      </div>
                    </div>
                  </div>

                  {/* Form & Option Selection Cards */}
                  <form onSubmit={handleOpenConfirm}>
                    <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginBottom: '14px' }}>
                      Select one choice below:
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                      {poll.options.map((option) => {
                        const isSelected = selectedOptionId === option.id;
                        const isUserChoice = poll.userVotedOptionId === option.id;

                        return (
                          <div
                            key={option.id}
                            onClick={() => !poll.hasVoted && setSelectedOptionId(option.id)}
                            style={{
                              padding: '16px 20px',
                              borderRadius: '12px',
                              border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                              backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                              cursor: poll.hasVoted ? 'default' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              transition: 'all 0.2s ease',
                              boxShadow: isSelected ? '0 4px 12px rgba(37, 99, 235, 0.15)' : 'none',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                              <div
                                style={{
                                  width: '22px',
                                  height: '22px',
                                  borderRadius: '50%',
                                  border: isSelected ? '6px solid #2563eb' : '2px solid #cbd5e1',
                                  backgroundColor: '#ffffff',
                                  transition: 'all 0.15s ease',
                                }}
                              />
                              <span style={{ fontSize: '1rem', fontWeight: isSelected ? 700 : 500, color: '#1e293b' }}>
                                {option.optionText}
                              </span>
                            </div>

                            {isUserChoice && (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                background: '#ecfdf5',
                                color: '#059669',
                                padding: '4px 10px',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                              }}>
                                <Check size={14} />
                                Your Vote
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {!poll.hasVoted ? (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <button
                          type="button"
                          onClick={() => navigate('/student/polls/active')}
                          className="btn btn-secondary"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={!selectedOptionId || isSubmitting}
                          className="btn btn-primary"
                          style={{ padding: '12px 28px' }}
                        >
                          <Send size={18} />
                          <span>Submit Official Vote</span>
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        {poll.canViewResults ? (
                          <Link to={`/student/polls/${poll.id}/results`} className="btn btn-primary">
                            <BarChart3 size={18} />
                            <span>View Poll Results</span>
                          </Link>
                        ) : (
                          <Link to="/student/dashboard" className="btn btn-secondary">
                            <span>Return to Dashboard</span>
                          </Link>
                        )}
                      </div>
                    )}
                  </form>
                </div>
              </>
            ) : null}
          </div>
        </main>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleVoteSubmit}
        title="Confirm Your Vote"
        message={`You are submitting your vote for: "${selectedOptionObj?.optionText}". You cannot alter or cast another vote after submission.`}
        confirmText="Confirm & Submit"
        confirmStyle="btn-primary"
      />
    </div>
  );
};

export default VoteScreen;
