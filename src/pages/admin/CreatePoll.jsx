import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { adminApi } from '../../services/api';
import { Plus, Trash2, AlertCircle, CheckCircle, ArrowLeft, Send, Save } from 'lucide-react';

const CreatePoll = () => {
  const navigate = useNavigate();

  // Helper for default dates: start now, end in 7 days
  const now = new Date();
  const formatDateTimeLocal = (d) => {
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    question: '',
    startTime: formatDateTimeLocal(now),
    endTime: formatDateTimeLocal(nextWeek),
    resultVisibility: 'ALWAYS',
    published: true,
  });

  const [options, setOptions] = useState(['', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e, shouldPublish) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Date validation
    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);
    if (end <= start) {
      setError('Poll closing time must be strictly after the opening time.');
      return;
    }

    // Options validation
    const validOptions = options.map((o) => o.trim()).filter((o) => o.length > 0);
    if (validOptions.length < 2) {
      setError('Please provide at least two valid, non-empty answer options.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        question: formData.question.trim(),
        startTime: formData.startTime,
        endTime: formData.endTime,
        resultVisibility: formData.resultVisibility,
        published: shouldPublish !== undefined ? shouldPublish : formData.published,
        options: validOptions,
      };

      const res = await adminApi.createPoll(payload);
      setSuccess('Poll created and scheduled successfully!');
      setTimeout(() => {
        navigate('/admin/manage-polls');
      }, 1200);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create poll. Please check input parameters.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="CREATE CAMPUS POLL" subtitle="Configure ballot questions, options, schedule, and visibility rules" />

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

            <div className="card">
              <form onSubmit={(e) => handleSubmit(e, true)}>
                {/* Title */}
                <div className="form-group">
                  <label className="form-label" htmlFor="title">
                    Poll Title *
                  </label>
                  <input
                    id="title"
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Student Council President 2026 / Campus Shuttle Service Survey"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                {/* Question */}
                <div className="form-group">
                  <label className="form-label" htmlFor="question">
                    Primary Question for Students *
                  </label>
                  <input
                    id="question"
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Which candidate would you select for the 2026-2027 Student Council President?"
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  />
                </div>

                {/* Description */}
                <div className="form-group">
                  <label className="form-label" htmlFor="description">
                    Context / Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    className="form-textarea"
                    placeholder="Provide background info, voter eligibility details, or instructions..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {/* Dynamic Answer Options */}
                <div className="form-group" style={{ marginTop: '28px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div>
                      <label className="form-label" style={{ marginBottom: '2px' }}>
                        Answer Options (Minimum 2 required) *
                      </label>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        Add all choices students can select from on their ballots.
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="btn btn-secondary btn-sm"
                    >
                      <Plus size={16} />
                      <span>Add Option</span>
                    </button>
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
                          className="form-input"
                          placeholder={`Option ${index + 1} (e.g. ${index === 0 ? 'Candidate A' : index === 1 ? 'Candidate B' : 'Candidate C'})`}
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(index)}
                          disabled={options.length <= 2}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '8px 10px', color: options.length <= 2 ? '#cbd5e1' : '#ef4444' }}
                          title="Remove this option"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Schedule Dates */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '24px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="startTime">
                      Voting Opens (Start Date & Time) *
                    </label>
                    <input
                      id="startTime"
                      type="datetime-local"
                      required
                      className="form-input"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="endTime">
                      Voting Closes (End Date & Time) *
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

                {/* Result Visibility Policy */}
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
                    <option value="ALWAYS">Live Results (Visible to students immediately after voting)</option>
                    <option value="AFTER_CLOSE">Final Only (Visible to students only after poll closes)</option>
                    <option value="ADMIN_ONLY">Restricted (Visible only to Campus Administrators)</option>
                  </select>
                </div>

                {/* Submit Actions */}
                <div style={{ display: 'flex', gap: '14px', justifyContent: 'flex-end', marginTop: '32px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e, false)}
                    disabled={isSubmitting}
                    className="btn btn-secondary"
                  >
                    <Save size={18} />
                    <span>Save as Draft</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary"
                  >
                    <Send size={18} />
                    <span>{isSubmitting ? 'Publishing...' : 'Publish & Schedule Poll'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreatePoll;
