import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import UploadManager from './components/uploads/UploadManager';
import Profile from './components/profile/Profile';
import AdminManagement from './components/admin/AdminManagement';
import NotFound from './components/common/NotFound';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const checkAuthStatus = () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        // For demo: In a real app, verify token with backend
        try {
          // Mock user data - replace with actual API call
          const userData = JSON.parse(localStorage.getItem('userData'));
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Authentication error:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const loginUser = (userData, token) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logoutUser = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedUserData) => {
    localStorage.setItem('userData', JSON.stringify(updatedUserData));
    setUser(updatedUserData);
  };

  if (loading) {
    return (
      <div className="app-loading d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app d-flex flex-column min-vh-100">
        <Header isAuthenticated={isAuthenticated} user={user} onLogout={logoutUser} />
        <main className="flex-grow-1">
          <Routes>
            <Route 
              path="/" 
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={loginUser} />} 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute isAuth={isAuthenticated}>
                  <Dashboard user={user} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/uploads" 
              element={
                <ProtectedRoute isAuth={isAuthenticated}>
                  <UploadManager user={user} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute isAuth={isAuthenticated}>
                  <Profile user={user} setUser={updateUser} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/manage" 
              element={
                <ProtectedRoute isAuth={isAuthenticated}>
                  <AdminManagement user={user} />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;