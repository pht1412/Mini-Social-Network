import { Box } from '@mui/material';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { PostManager } from './pages/admin/PostManager';
import { UserManager } from './pages/admin/UserManager';

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
      <Header />

      <main style={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          
          {/* Admin routes */}
          <Route path="/admin/*" element={
            <AdminLayout>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="posts" element={<PostManager />} />
                <Route path="users" element={<UserManager />} />
                {/* Redirect mặc định về dashboard */}
                <Route path="*" element={<AdminDashboard />} />
              </Routes>
            </AdminLayout>
          } />
          
          {/* TODO: Thêm các route khác (Login, Register...) */}
        </Routes>
      </main>      <Footer />
    </Box>
  );
}

export default App;