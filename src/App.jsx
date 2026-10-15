import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import CreatePoll from './pages/admin/CreatePoll';
import EditPoll from './pages/admin/EditPoll';
import ManagePolls from './pages/admin/ManagePolls';
import AdminPollResults from './pages/admin/AdminPollResults';
import UserManagement from './pages/admin/UserManagement';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import ActivePolls from './pages/student/ActivePolls';
import UpcomingPolls from './pages/student/UpcomingPolls';
import ClosedPolls from './pages/student/ClosedPolls';
import VoteScreen from './pages/student/VoteScreen';
import StudentPollResults from './pages/student/StudentPollResults';
import VotingHistory from './pages/student/VotingHistory';

const RootRedirect = () => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/student/dashboard" replace />;
};

function App() {
  return (
    <Routes>
      {/* Root Route */}
      <Route path="/" element={<RootRedirect />} />

      {/* Public Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/create-poll"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <CreatePoll />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/manage-polls"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <ManagePolls />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/polls/:id/edit"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <EditPoll />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/polls/:id/results"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminPollResults />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <UserManagement />
          </ProtectedRoute>
        }
      />

      {/* Protected Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute requiredRole="STUDENT">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/polls/active"
        element={
          <ProtectedRoute requiredRole="STUDENT">
            <ActivePolls />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/polls/upcoming"
        element={
          <ProtectedRoute requiredRole="STUDENT">
            <UpcomingPolls />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/polls/closed"
        element={
          <ProtectedRoute requiredRole="STUDENT">
            <ClosedPolls />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/polls/:id"
        element={
          <ProtectedRoute requiredRole="STUDENT">
            <VoteScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/polls/:id/results"
        element={
          <ProtectedRoute requiredRole="STUDENT">
            <StudentPollResults />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/history"
        element={
          <ProtectedRoute requiredRole="STUDENT">
            <VotingHistory />
          </ProtectedRoute>
        }
      />

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
