import React, { useEffect, useState } from 'react';
import { Container, Grid, CircularProgress, Box, Typography } from '@mui/material';

import PostCard, { type PostData } from '../components/post/CardPost';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import CreatePost from '../components/post/CreatePost';
import api from '../api/api';

export default function HomePage() {
  const [posts, setPosts] = useState<PostData[]>([]);
  // ⭐️ ĐÃ XÓA: const [user, setUser]
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleRemovePost = (deletedPostId: number) => {
      setPosts(prev => prev.filter(p => p.id !== deletedPostId));
  };

  useEffect(() => {
    // ⭐️ ĐÃ XÓA: fetchUserProfile
    
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/feed');
        console.log("Fetched feed response:", response);
        setPosts(response.data.content || []); 
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
    <Container maxWidth="xl" sx={{ mt: 3, px: { xs: 1, md: 5 } }}> 
      <Grid container spacing={2} justifyContent="center">
        {/* LEFT SIDEBAR */}
        <Grid item xs={12} md={3} lg={2} sx={{ display: { xs: 'none', md: 'block' }}}>
          <Box sx={{ position: 'sticky', top: 80 }}>
            <LeftSidebar />
          </Box>
        </Grid>

        {/* NEWSFEED */}
        <Grid item xs={12} md={6} lg={8}>
          <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
          
            {/* CreatePost bây giờ tự lo liệu dữ liệu user của nó */}
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

        {/* RIGHT SIDEBAR */}
        <Grid item xs={12} md={3} lg={2} sx={{ display: { xs: 'none', md: 'block' }}}>
          <Box sx={{ position: 'sticky', top: 80 }}>
             <RightSidebar />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}