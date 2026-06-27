import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import SyllabusDashboard from './pages/SyllabusDashboard';
import SyllabusUnits from './pages/SyllabusUnits';
import TopicDetail from './pages/TopicDetail';
import QuizMocks from './pages/QuizMocks';
import FlashcardsUI from './pages/FlashcardsUI';
import AttendancePage from './pages/AttendancePage';
import LoginPage from './pages/LoginPage';

function Layout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <Navbar />
        <main className="content">{children}</main>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  const { user } = useApp();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/syllabus" element={<ProtectedRoute><SyllabusDashboard /></ProtectedRoute>} />
      <Route path="/syllabus/:subjectId" element={<ProtectedRoute><SyllabusUnits /></ProtectedRoute>} />
      <Route path="/syllabus/:subjectId/unit/:unitId" element={<ProtectedRoute><TopicDetail /></ProtectedRoute>} />
      <Route path="/quiz" element={<ProtectedRoute><QuizMocks /></ProtectedRoute>} />
      <Route path="/flashcards" element={<ProtectedRoute><FlashcardsUI /></ProtectedRoute>} />
      <Route path="/attendance" element={<ProtectedRoute><AttendancePage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
