import { Box } from '@mui/material';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import type { JSX } from 'react';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { AdminLayout } from './components/layout/AdminLayout';

import HomePage from './pages/HomePage';
// ⭐️ THAY ĐỔI QUAN TRỌNG: Dùng ProfilePage mới thay vì Profile cũ
import ProfilePage from './pages/Profile'; 

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import  AdminDashboard  from './pages/admin/AdminDashboard';
import { PostManager } from './pages/admin/PostManager';
import { UserManager } from './pages/admin/UserManager';

import { AuthProvider, useAuth } from './context/AuthContext';
import { WebSocketProvider } from './context/WebSocketContext';
import { ChatProvider } from './context/ChatContext';
import PostDetailPage from './pages/PostDetailPage';

/* ================= PRIVATE ROUTE ================= */
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

/* ================= APP ================= */
function App() {
  return (
    <WebSocketProvider>
      <ChatProvider>
        <AuthProvider>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                bgcolor: 'background.default',
              }}
            >
              <Header />

              <main style={{ flexGrow: 1 }}>
                <Routes>
                  {/* ===== PUBLIC ROUTES ===== */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* ===== PROTECTED USER ROUTES ===== */}
                  
                  {/* Trường hợp 1: Xem Profile của chính mình */}
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <ProfilePage />
                      </PrivateRoute>
                    }
                  />

                  {/* Trường hợp 2: Xem Profile người khác */}
                  <Route
                    path="/profile/:userId"
                    element={
                      <PrivateRoute>
                        <ProfilePage />
                      </PrivateRoute>
                    }
                  />

                  <Route path="/posts/:postId" element={<PostDetailPage />} />

                  {/* ===== ADMIN ROUTES ===== */}
                  <Route
                    path="/admin"
                    element={
                      <PrivateRoute>
                        <AdminLayout>
                            <Outlet />
                        </AdminLayout>
                      </PrivateRoute>
                    }
                  >
                    <Route index element={<AdminDashboard />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="posts" element={<PostManager />} />
                    <Route path="users" element={<UserManager />} />
                    <Route path="*" element={<Navigate to="dashboard" replace />} />
                  </Route>

                  {/* ===== FALLBACK ===== */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              <Footer />
            </Box>
        </AuthProvider>
      </ChatProvider>
    </WebSocketProvider>
  );
}

export default App;