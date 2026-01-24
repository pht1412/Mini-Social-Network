import React, { useEffect, useState } from 'react';
import { Container, Grid, Box, CircularProgress, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

// Import Context & API
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import type { User } from '../types';

// Import Components giao diện
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileIntro from '../components/profile/ProfileIntro';
import CreatePost from '../components/post/CreatePost';
import PostCard, { type PostData } from '../components/post/CardPost';

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>(); // Lấy ID từ URL (nếu có)
  const { user: currentUser } = useAuth(); // Lấy user đang đăng nhập
  
  // State dữ liệu
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);

  // Kiểm tra xem đây có phải là profile của chính mình không
  // Là mình khi: URL không có userId HOẶC userId trên URL trùng với ID của mình
  const isOwnProfile = !userId || (currentUser && Number(userId) === currentUser.id);

  // --- 1. FETCH THÔNG TIN USER (PROFILE HEADER) ---
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        let userRes;
        
        if (isOwnProfile) {
          // Gọi API lấy thông tin bản thân (Auth Controller)
          userRes = await api.get('/api/auth/profile');
        } else {
          // Gọi API lấy thông tin người khác (Cần endpoint /api/users/{id})
          // Lưu ý: Backend cần có endpoint này, nếu chưa có tui sẽ dùng tạm search hoặc bạn cần bổ sung
          userRes = await api.get(`/api/users/${userId}`); 
        }
        
        setProfileUser(userRes.data);
      } catch (error) {
        console.error("Lỗi tải thông tin user:", error);
      } 
    };

    fetchProfileData();
  }, [userId, isOwnProfile]);

  // --- 2. FETCH BÀI VIẾT (TIMELINE) ---
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let postsRes;
        if (isOwnProfile) {
            // Lấy bài viết của chính mình
            postsRes = await api.get('/api/posts/my-posts');
        } else {
            // Lấy bài viết của user khác
            postsRes = await api.get(`/api/posts/user/${userId}`);
        }
        setPosts(postsRes.data.content || []);
      } catch (error) {
        console.error("Lỗi tải bài viết:", error);
      } finally {
        setLoading(false);
      }
    };

    if (profileUser) { // Chỉ fetch posts khi đã xác định được user
        fetchPosts();
    }
  }, [profileUser, isOwnProfile, userId]);

  // Hàm xử lý xóa bài viết (truyền xuống PostCard)
  const handleRemovePost = (deletedPostId: number) => {
    setPosts(prev => prev.filter(p => p.id !== deletedPostId));
  };

  if (loading && !profileUser) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress />
        </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 4 }}>
      {/* 1. HEADER (Ảnh bìa, Avatar, Menu chỉnh sửa) */}
      {/* Truyền key để component re-mount khi đổi user */}
      <ProfileHeader key={profileUser?.id} />

      {/* 2. BODY (Layout 2 cột: Intro - Posts) */}
      <Container maxWidth="md" sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          
          {/* 2a. CỘT TRÁI: GIỚI THIỆU */}
          <Grid item xs={12} md={5}>
            <Box sx={{ position: 'sticky', top: '80px' }}>
                <ProfileIntro 
                    user={profileUser} 
                    onEditClick={() => {
                        // Logic mở Edit Dialog đã nằm trong ProfileHeader
                        // Ở đây chỉ hiển thị thông tin
                    }} 
                />
                
                {/* Có thể thêm List Bạn Bè (Friends) ở đây sau này */}
            </Box>
          </Grid>

          {/* 2b. CỘT PHẢI: BÀI VIẾT */}
          <Grid item xs={12} md={7}>
            {/* Chỉ hiển thị khung Đăng bài nếu là Profile của chính mình */}
            {isOwnProfile && <CreatePost />}
            
            {/* Danh sách bài viết */}
            {posts.length > 0 ? (
                posts.map((post) => (
                    <PostCard 
                        key={post.id} 
                        post={post} 
                        onDeleteSuccess={handleRemovePost} 
                    />
                ))
            ) : (
                <Box sx={{ 
                    p: 4, 
                    bgcolor: 'background.paper', 
                    borderRadius: 2, 
                    textAlign: 'center',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}>
                    <Typography variant="body1" color="text.secondary">
                        Chưa có bài viết nào.
                    </Typography>
                </Box>
            )}
          </Grid>
          
        </Grid>
      </Container>
    </Box>
  );
}