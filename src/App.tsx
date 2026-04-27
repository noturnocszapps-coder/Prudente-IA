import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Economize from './pages/Economize';
import Vip from './pages/Vip';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Affiliate from './pages/Affiliate';
import Terms from './pages/Terms';
import AffiliateTerms from './pages/AffiliateTerms';

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
  const { user, loading, isAdmin } = useAuth();
  
  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !isAdmin) return <Navigate to="/" />;
  
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/economize" element={<Economize />} />
            <Route path="/vip" element={<Vip />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/affiliate" element={<Affiliate />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/affiliate-terms" element={<AffiliateTerms />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute adminOnly>
                  <Admin />
                </ProtectedRoute>
              } 
            />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
