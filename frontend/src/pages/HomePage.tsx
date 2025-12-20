<<<<<<< HEAD
import React from 'react';
import { Container, Grid } from '@mui/material';

import PostCard from '../components/post/CardPost';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';

// ⭐️ BƯỚC 1: Import component CreatePost
import CreatePost from '../components/post/CreatePost';

export default function HomePage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      <Grid container spacing={3}>

        {/* CỘT BÊN TRÁI (3/12) */}
        <Grid xs={12} md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
          <LeftSidebar />
        </Grid>

        {/* CỘT Ở GIỮA (6/12) */}
        <Grid xs={12} md={6}>
          
          {/* ⭐️ BƯỚC 2: Thêm component CreatePost vào đây */}
          <CreatePost />
          
          {/* Hiển thị các bài đăng */}
          <PostCard />
          <PostCard />
          <PostCard />
        </Grid>

        {/* CỘT BÊN PHẢI (3/12) */}
        <Grid xs={12} md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
          <RightSidebar />
=======
import React, { useEffect, useState } from 'react';
import { Container, Grid, CircularProgress, Box, Typography } from '@mui/material';

// Import Component
import PostCard, { type PostData } from '../components/post/CardPost';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import CreatePost from '../components/post/CreatePost';

export default function HomePage() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleRemovePost = (deletedPostId: number) => {
      setPosts(prev => prev.filter(p => p.id !== deletedPostId));
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8080/api/feed'); 
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setPosts(data.content || []); 
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setError("Không thể tải bảng tin. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    // ⭐️ THAY ĐỔI 1: Dùng maxWidth="xl" để mở rộng ra 2 bên màn hình to
    // Nếu muốn sát sạt lề luôn thì dùng: maxWidth={false}
    <Container maxWidth="xl" sx={{ mt: 3, px: { xs: 1, md: 5 } }}> 
      
      {/* ⭐️ THAY ĐỔI 2: Giảm spacing từ 3 xuống 2 để tiết kiệm khoảng trắng thừa */}
      <Grid container spacing={2} justifyContent="center">

        {/* CỘT BÊN TRÁI */}
        {/* lg={2}: Màn hình to thì chiếm 2 phần. md={3}: Màn hình laptop thì chiếm 3 phần */}
        <Grid item xs={12} md={3} lg={2} sx={{ display: { xs: 'none', md: 'block' }}}>
          <Box sx={{ position: 'sticky', top: 80 }}> {/* Giữ sidebar khi cuộn */}
            <LeftSidebar />
          </Box>
        </Grid>

        {/* CỘT Ở GIỮA (NEWSFEED) */}
        {/* lg={8}: Màn hình to chiếm 8 phần (Rất rộng). md={6}: Laptop chiếm 6 phần */}
        <Grid item xs={12} md={6} lg={8}>
          <Box sx={{ maxWidth: '800px', mx: 'auto' }}> {/* Giới hạn max-width để bài viết không bị bè quá mức trên màn hình siêu rộng */}
          
            <CreatePost />
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
               <Box sx={{ textAlign: 'center', mt: 4, color: 'error.main' }}><Typography>{error}</Typography></Box>
            ) : posts.length === 0 ? (
              <Box sx={{ textAlign: 'center', mt: 4 }}><Typography color="text.secondary">Chưa có bài đăng nào.</Typography></Box>
            ) : (
              posts.map((post) => (
                <PostCard key={post.id} post={post} onDeleteSuccess={handleRemovePost} />
              ))
            )}
          
          </Box>
        </Grid>

        {/* CỘT BÊN PHẢI */}
        {/* Tương tự cột trái: lg={2}, md={3} */}
        <Grid item xs={12} md={3} lg={2} sx={{ display: { xs: 'none', md: 'block' }}}>
          <Box sx={{ position: 'sticky', top: 80 }}>
             <RightSidebar />
          </Box>
>>>>>>> origin/tphat
        </Grid>

      </Grid>
    </Container>
  );
}