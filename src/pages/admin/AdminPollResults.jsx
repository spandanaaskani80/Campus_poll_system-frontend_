import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import ResultsChart from '../../components/ResultsChart';
import LoadingSpinner from '../../components/LoadingSpinner';
import { adminApi } from '../../services/api';
import { ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';

const AdminPollResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminApi.getPollResults(id);
      setResults(res.data);
    } catch (err) {
      console.error('Failed to load poll results:', err);
      const msg = err.response?.data?.message || 'Failed to retrieve poll results.';
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
        <Navbar title="POLL RESULTS & ANALYTICS" subtitle={`Administrator vote tally and distribution for Poll #${id}`} />

        <main className="page-content">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <button onClick={() => navigate('/admin/manage-polls')} className="btn btn-secondary btn-sm">
              <ArrowLeft size={16} />
              <span>Back to Polls</span>
            </button>

            <button onClick={fetchResults} className="btn btn-secondary btn-sm" disabled={loading}>
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              <span>Refresh Tallies</span>
            </button>
          </div>

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <LoadingSpinner message="Calculating real-time database vote tallies..." />
          ) : results ? (
            <ResultsChart results={results} />
          ) : (
            <div className="alert alert-warning">
              <span>No results available for this poll.</span>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPollResults;
