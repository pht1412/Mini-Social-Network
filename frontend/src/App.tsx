import { Box } from '@mui/material';
<<<<<<< HEAD
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'; // Bỏ import BrowserRouter
import type { JSX } from 'react';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { AdminLayout } from './components/layout/AdminLayout';

import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import  AdminDashboard  from './pages/admin/AdminDashboard';
import { PostManager } from './pages/admin/PostManager';
import { UserManager } from './pages/admin/UserManager';

import { AuthProvider, useAuth } from './context/AuthContext';

/* ================= PRIVATE ROUTE ================= */
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

/* ================= APP ================= */
function App() {
  return (
    // AuthProvider sẽ nằm trong BrowserRouter của main.tsx
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
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                }
              />

              <Route
                path="/profile/:userId"
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                }
              />

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
=======
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// 1. Import Routes và Route
import { Routes, Route } from 'react-router-dom';

// 2. Import các trang
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}
    >
      {/* Header và Footer sẽ hiển thị trên mọi trang */}
      <Header />

      {/* 3. Phần nội dung chính (thay đổi theo URL) */}
      <main style={{ flexGrow: 1 }}>
        <Routes>
          {/* Route cho Trang chủ */}
          <Route path="/" element={<HomePage />} />
          
          {/* Route cho Trang cá nhân (ví dụ: /profile/lehuynhphat) */}
          <Route path="/profile/:userId" element={<ProfilePage />} />
          
          {/* Route dự phòng (ví dụ: /profile trỏ về trang của mình) */}
          {/* Tạm thời chúng ta cũng cho nó trỏ về ProfilePage */}
          <Route path="/profile" element={<ProfilePage />} />
          
          {/* TODO: Thêm các route khác (Login, Register...) */}
        </Routes>
      </main>
      
      <Footer />
    </Box>
>>>>>>> origin/tphat
  );
}

export default App;