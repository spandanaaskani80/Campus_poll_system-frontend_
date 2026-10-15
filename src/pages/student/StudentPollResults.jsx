import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import ResultsChart from '../../components/ResultsChart';
import LoadingSpinner from '../../components/LoadingSpinner';
import { studentApi } from '../../services/api';
import { ArrowLeft, RefreshCw, AlertCircle, Lock } from 'lucide-react';

const StudentPollResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await studentApi.getPollResults(id);
      setResults(res.data);
    } catch (err) {
      console.error('Failed to load results:', err);
      const msg = err.response?.data?.message || 'Results are not available for this poll.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [id]);

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="CAMPUS POLL RESULTS" subtitle="Official tally and vote percentages computed by MySQL backend" />

        <main className="page-content">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm">
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>

            <button onClick={fetchResults} className="btn btn-secondary btn-sm" disabled={loading}>
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>

          {error && (
            <div className="card" style={{ textAlign: 'center', padding: '40px 20px', maxWidth: '600px', margin: '20px auto' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Lock size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '8px' }}>
                Results Restricted
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '20px' }}>
                {error}
              </p>
              <button onClick={() => navigate('/student/dashboard')} className="btn btn-primary btn-sm">
                Return to Dashboard
              </button>
            </div>
          )}

          {loading ? (
            <LoadingSpinner message="Calculating database results..." />
          ) : results ? (
            <ResultsChart results={results} />
          ) : null}
        </main>
      </div>
    </div>
  );
};

export default StudentPollResults;
