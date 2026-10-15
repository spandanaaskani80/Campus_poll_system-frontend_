import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Vote,
  LayoutDashboard,
  PlusCircle,
  ListOrdered,
  Users,
  LogOut,
  Clock,
  History,
  Archive,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

const Sidebar = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isAdmin = role === 'ADMIN';

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand-icon">
          <Vote size={24} />
        </div>
        <div className="brand-text">
          <h1>CAMPUS POLL</h1>
          <span>{isAdmin ? 'Admin Portal' : 'Student Voting'}</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {isAdmin ? (
          <>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/admin/create-poll"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <PlusCircle size={20} />
              <span>Create Poll</span>
            </NavLink>

            <NavLink
              to="/admin/manage-polls"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <ListOrdered size={20} />
              <span>Manage Polls</span>
            </NavLink>

            <NavLink
              to="/admin/users"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Users size={20} />
              <span>User Management</span>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              to="/student/dashboard"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/student/polls/active"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <CheckCircle2 size={20} />
              <span>Active Polls</span>
            </NavLink>

            <NavLink
              to="/student/polls/upcoming"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Clock size={20} />
              <span>Upcoming Polls</span>
            </NavLink>

            <NavLink
              to="/student/polls/closed"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Archive size={20} />
              <span>Closed Polls</span>
            </NavLink>

            <NavLink
              to="/student/history"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <History size={20} />
              <span>My Voting History</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* Sidebar Footer: User Profile & Logout */}
      <div className="sidebar-footer">
        <div className="user-profile-summary">
          <div className="user-avatar">
            {isAdmin ? <ShieldCheck size={20} /> : <GraduationCap size={20} />}
          </div>
          <div className="user-info-text">
            <p className="user-name" title={user?.fullName || user?.name}>
              {user?.fullName || user?.name || 'Campus User'}
            </p>
            <span className="user-role-badge">
              {isAdmin ? 'ADMINISTRATOR' : user?.studentId || 'STUDENT'}
            </span>
          </div>
        </div>

        <button onClick={handleLogout} className="logout-btn" title="Sign out of system">
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
