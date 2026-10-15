import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { adminApi } from '../../services/api';
import { ArrowLeft, Save, AlertCircle, CheckCircle, Info, Plus, Trash2 } from 'lucide-react';

const EditPoll = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVotes, setHasVotes] = useState(false);

  const formatDateTimeLocal = (dStr) => {
    if (!dStr) return '';
    const d = new Date(dStr);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    question: '',
    startTime: '',
    endTime: '',
    resultVisibility: 'ALWAYS',
    published: false,
    status: 'ACTIVE',
  });
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        setLoading(true);
        const res = await adminApi.getPollById(id);
        const poll = res.data;
        setFormData({
          title: poll.title || '',
          description: poll.description || '',
          question: poll.question || '',
          startTime: formatDateTimeLocal(poll.startTime),
          endTime: formatDateTimeLocal(poll.endTime),
          resultVisibility: poll.resultVisibility || 'ALWAYS',
          published: poll.published,
          status: poll.status,
        });
        setOptions(poll.options.map((o) => o.optionText));
        setHasVotes(poll.totalVotes > 0);
      } catch (err) {
        setError('Failed to load poll details for editing.');
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [id]);

  const handleAddOption = () => {
    setOptions((prev) => [...prev, '']);
  };

  const handleRemoveOption = (index) => {
    if (options.length <= 2) {
      setError('A poll must have at least two answer options.');
      return;
    }
    setOptions((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);
    if (end <= start) {
      setError('Closing date/time must be strictly after the start date/time.');
      return;
    }

    const validOptions = options.map((o) => o.trim()).filter((o) => o.length > 0);
    if (!hasVotes && validOptions.length < 2) {
      setError('A poll requires at least two valid options.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        question: formData.question,
        startTime: formData.startTime,
        endTime: formData.endTime,
        resultVisibility: formData.resultVisibility,
        published: formData.published,
        status: formData.status,
        options: validOptions,
      };

      await adminApi.updatePoll(id, payload);
      setSuccess('Poll updated successfully!');
      setTimeout(() => {
        navigate('/admin/manage-polls');
      }, 1000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update poll.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="EDIT CAMPUS POLL" subtitle={`Modifying configuration for Poll #${id}`} />

        <main className="page-content">
          <div style={{ maxWidth: '840px', margin: '0 auto' }}>
            <div style={{ marginBottom: '20px' }}>
              <button onClick={() => navigate('/admin/manage-polls')} className="btn btn-secondary btn-sm">
                <ArrowLeft size={16} />
                <span>Back to Polls</span>
              </button>
            </div>

            {error && (
              <div className="alert alert-error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="alert alert-success">
                <CheckCircle size={18} />
                <span>{success}</span>
              </div>
            )}

            {hasVotes && (
              <div className="alert alert-warning" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <Info size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>Ballot Integrity Lock Active:</strong> Votes have already been cast in this poll. Question wording and answer choices cannot be modified to protect election validity. You can still adjust the closing time, description, and visibility rules.
                </span>
              </div>
            )}

            {loading ? (
              <LoadingSpinner message="Retrieving poll details..." />
            ) : (
              <div className="card">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="title">
                      Poll Title *
                    </label>
                    <input
                      id="title"
                      type="text"
                      required
                      className="form-input"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="question">
                      Poll Question *
                    </label>
                    <input
                      id="question"
                      type="text"
                      required
                      disabled={hasVotes}
                      className="form-input"
                      value={formData.question}
                      onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                      style={{ backgroundColor: hasVotes ? '#f8fafc' : '#ffffff' }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="description">
                      Context / Description
                    </label>
                    <textarea
                      id="description"
                      rows={3}
                      className="form-textarea"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  {/* Options */}
                  <div className="form-group" style={{ marginTop: '24px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <label className="form-label">
                        Answer Options {hasVotes ? '(Locked)' : ''}
                      </label>
                      {!hasVotes && (
                        <button type="button" onClick={handleAddOption} className="btn btn-secondary btn-sm">
                          <Plus size={16} />
                          <span>Add Option</span>
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {options.map((option, index) => (
                        <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <span style={{ width: '28px', fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>
                            #{index + 1}
                          </span>
                          <input
                            type="text"
                            required
                            disabled={hasVotes}
                            className="form-input"
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            style={{ backgroundColor: hasVotes ? '#f8fafc' : '#ffffff' }}
                          />
                          {!hasVotes && (
                            <button
                              type="button"
                              onClick={() => handleRemoveOption(index)}
                              disabled={options.length <= 2}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '8px 10px', color: options.length <= 2 ? '#cbd5e1' : '#ef4444' }}
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Schedule */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '24px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="startTime">
                        Voting Opens *
                      </label>
                      <input
                        id="startTime"
                        type="datetime-local"
                        required
                        disabled={hasVotes}
                        className="form-input"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        style={{ backgroundColor: hasVotes ? '#f8fafc' : '#ffffff' }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="endTime">
                        Voting Closes *
                      </label>
                      <input
                        id="endTime"
                        type="datetime-local"
                        required
                        className="form-input"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Visibility */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="resultVisibility">
                      Results Visibility Policy
                    </label>
                    <select
                      id="resultVisibility"
                      className="form-select"
                      value={formData.resultVisibility}
                      onChange={(e) => setFormData({ ...formData, resultVisibility: e.target.value })}
                    >
                      <option value="ALWAYS">Live Results (Visible immediately)</option>
                      <option value="AFTER_CLOSE">Final Only (Visible after close)</option>
                      <option value="ADMIN_ONLY">Restricted (Admin only)</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '30px' }}>
                    <button type="button" onClick={() => navigate('/admin/manage-polls')} className="btn btn-secondary">
                      Cancel
                    </button>
                    <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                      <Save size={18} />
                      <span>{isSubmitting ? 'Saving Changes...' : 'Save Changes'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditPoll;
