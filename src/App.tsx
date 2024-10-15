import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import { UserProvider, useUser } from './contexts/UserContext';
import ErrorBoundary from './components/ErrorBoundary';
import Loading from './components/Loading';

const Dashboard = lazy(() => import('./components/Dashboard'));
const EmployeeProfiles = lazy(() => import('./components/EmployeeProfiles'));
const UpcomingProfiles = lazy(() => import('./components/UpcomingProfiles'));
const InterviewScheduler = lazy(() => import('./components/InterviewScheduler'));

const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { user } = useUser();
  return user ? element : <Navigate to="/login" replace />;
};

const AppContent: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useUser();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  if (!user) {
    return <Login />;
  }

  return (
    <div className={`flex h-screen ${isDarkMode ? 'dark' : ''}`}>
      <Sidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
      <main className={`flex-1 p-6 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'} bg-gray-100 dark:bg-gray-800`}>
        <ErrorBoundary>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<ProtectedRoute element={<EmployeeProfiles />} />} />
              <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
              <Route path="/upcoming-profiles" element={<ProtectedRoute element={<UpcomingProfiles />} />} />
              <Route path="/interview-scheduler" element={<ProtectedRoute element={<InterviewScheduler />} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <button
        onClick={toggleDarkMode}
        className="fixed bottom-4 right-4 bg-gray-200 dark:bg-gray-700 p-2 rounded-full"
      >
        {isDarkMode ? '🌞' : '🌙'}
      </button>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  );
};

export default App;