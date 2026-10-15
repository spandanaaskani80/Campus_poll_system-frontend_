import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { adminApi } from '../../services/api';
import { Users, Search, ShieldCheck, GraduationCap, Calendar, Mail, Hash } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await adminApi.getAllUsers();
        setUsers(res.data);
      } catch (err) {
        setError('Failed to load registered users directory.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const term = search.toLowerCase();
    return (
      (u.fullName && u.fullName.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term)) ||
      (u.studentId && u.studentId.toLowerCase().includes(term))
    );
  });

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar title="USER MANAGEMENT" subtitle="Directory of registered university students and administrators" />

        <main className="page-content">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px' }}>
            <div style={{ position: 'relative', width: '340px' }}>
              <input
                type="text"
                placeholder="Search by name, email, or Student ID..."
                className="form-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '38px' }}
              />
              <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#ffffff', padding: '8px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <Users size={18} color="#1e40af" />
              <span style={{ fontSize: '0.88rem', color: '#64748b' }}>Total Users: <strong>{users.length}</strong></span>
            </div>
          </div>

          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <LoadingSpinner message="Fetching user directory from MySQL..." />
          ) : (
            <div className="card">
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>User Details</th>
                      <th>Student ID / Code</th>
                      <th>Role</th>
                      <th>Registered On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '50%',
                              backgroundColor: u.role === 'ADMIN' ? '#dbeafe' : '#f1f5f9',
                              color: u.role === 'ADMIN' ? '#1e40af' : '#475569',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '0.9rem',
                            }}>
                              {u.fullName?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, color: '#0f172a' }}>{u.fullName}</div>
                              <div style={{ fontSize: '0.82rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Mail size={12} />
                                <span>{u.email}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'monospace', fontWeight: 600, color: '#1e293b' }}>
                            <Hash size={14} color="#94a3b8" />
                            <span>{u.studentId || 'N/A'}</span>
                          </div>
                        </td>
                        <td>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '4px 10px',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            backgroundColor: u.role === 'ADMIN' ? '#dbeafe' : '#ecfdf5',
                            color: u.role === 'ADMIN' ? '#1e40af' : '#047857',
                          }}>
                            {u.role === 'ADMIN' ? <ShieldCheck size={14} /> : <GraduationCap size={14} />}
                            {u.role}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={14} color="#94a3b8" />
                            <span>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                          No users found matching your search.
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
    </div>
  );
};

export default UserManagement;
