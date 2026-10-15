import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts';
import { Award, BarChart2, PieChart as PieIcon, Table as TableIcon } from 'lucide-react';

const COLORS = [
  '#2563eb', // Royal blue
  '#059669', // Emerald
  '#d97706', // Amber
  '#7c3aed', // Purple
  '#db2777', // Pink
  '#0891b2', // Cyan
  '#dc2626', // Red
  '#4f46e5', // Indigo
];

const ResultsChart = ({ results }) => {
  const [activeTab, setActiveTab] = useState('bar');

  if (!results || !results.options || results.options.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: '12px' }}>
        <p style={{ color: '#64748b' }}>No options or votes recorded for this poll yet.</p>
      </div>
    );
  }

  const chartData = results.options.map((opt, idx) => ({
    name: opt.optionText,
    votes: opt.votesCount,
    percentage: opt.percentage,
    color: COLORS[idx % COLORS.length],
  }));

  return (
    <div className="card" style={{ marginTop: '20px' }}>
      {/* Summary Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px' }}>
        <div>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b' }}>
            Live Poll Results
          </span>
          <h2 style={{ fontSize: '1.4rem', color: '#0f172a', marginTop: '4px' }}>
            {results.pollTitle || results.question}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>
            {results.question}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block' }}>TOTAL VOTES</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1e40af', fontFamily: 'Outfit' }}>
              {results.totalVotes}
            </span>
          </div>

          {results.totalVotes > 0 && results.highestVotedOption && results.highestVotedOption !== 'None' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#ecfdf5', padding: '8px 16px', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
              <Award size={22} color="#059669" />
              <div>
                <span style={{ fontSize: '0.72rem', color: '#047857', fontWeight: 700, display: 'block' }}>LEADING OPTION</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#065f46' }}>
                  {results.highestVotedOption}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chart View Toggle */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('bar')}
          className={`btn btn-sm ${activeTab === 'bar' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <BarChart2 size={16} />
          <span>Bar Chart</span>
        </button>
        <button
          onClick={() => setActiveTab('pie')}
          className={`btn btn-sm ${activeTab === 'pie' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <PieIcon size={16} />
          <span>Pie Distribution</span>
        </button>
        <button
          onClick={() => setActiveTab('table')}
          className={`btn btn-sm ${activeTab === 'table' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <TableIcon size={16} />
          <span>Breakdown Table</span>
        </button>
      </div>

      {/* Chart Render Area */}
      {activeTab === 'bar' && (
        <div style={{ height: '320px', width: '100%', marginTop: '10px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} tickLine={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div style={{ background: '#ffffff', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                        <p style={{ fontWeight: 700, color: '#0f172a' }}>{data.name}</p>
                        <p style={{ color: '#2563eb', fontWeight: 600 }}>Votes: {data.votes}</p>
                        <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Share: {data.percentage}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="votes" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeTab === 'pie' && (
        <div style={{ height: '320px', width: '100%', marginTop: '10px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="votes"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={105}
                paddingAngle={4}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`pie-cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div style={{ background: '#ffffff', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                        <p style={{ fontWeight: 700, color: '#0f172a' }}>{data.name}</p>
                        <p style={{ color: '#2563eb', fontWeight: 600 }}>Votes: {data.votes}</p>
                        <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Share: {data.percentage}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Results Breakdown Table */}
      <div style={{ marginTop: '24px' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
          Detailed Vote Breakdown
        </h4>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '45%' }}>Answer Option</th>
                <th style={{ width: '20%' }}>Vote Count</th>
                <th style={{ width: '15%' }}>Percentage</th>
                <th style={{ width: '20%' }}>Visual Progress</th>
              </tr>
            </thead>
            <tbody>
              {results.options.map((opt, idx) => {
                const color = COLORS[idx % COLORS.length];
                const isLeading = results.totalVotes > 0 && opt.optionText === results.highestVotedOption;
                return (
                  <tr key={opt.optionId}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: color }} />
                        <span style={{ fontWeight: 600, color: '#1e293b' }}>{opt.optionText}</span>
                        {isLeading && (
                          <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: '#ecfdf5', color: '#059669', borderRadius: '6px', fontWeight: 700 }}>
                            Leading
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <strong>{opt.votesCount}</strong>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: '#1e40af' }}>{opt.percentage}%</span>
                    </td>
                    <td>
                      <div style={{ height: '8px', width: '100%', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${opt.percentage}%`,
                            backgroundColor: color,
                            borderRadius: '4px',
                            transition: 'width 0.5s ease',
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResultsChart;
