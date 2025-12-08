import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import PeopleIcon from '@mui/icons-material/People';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

interface DashboardStats {
  totalPosts: number;
  // Các field khác có thể mở rộng sau nếu Backend hỗ trợ
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // ⭐️ SỬA LỖI: Thêm tiền tố http://localhost:8080 để gọi đúng vào Backend Java
      // Nếu không có, Vite sẽ gọi vào chính nó và trả về file HTML (gây lỗi giao diện)
      const postCountResponse = await axios.get('http://localhost:8080/api/admin/posts-count');
      
      // ⭐️ SỬA LỖI: Kiểm tra dữ liệu trả về phải là số
      if (typeof postCountResponse.data === 'number') {
        setStats({
          totalPosts: postCountResponse.data,
        });
      } else {
        console.error("API trả về dữ liệu không phải số:", postCountResponse.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;

  // Component Card thống kê nhỏ
  const StatCard = ({ title, value, icon, color }: { title: string, value: number, icon: React.ReactNode, color: string }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h4">
              {value}
            </Typography>
          </Box>
          <Box sx={{ p: 1.5, borderRadius: '50%', bgcolor: `${color}20`, color: color }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Tổng quan hệ thống
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard 
            title="TỔNG BÀI VIẾT" 
            value={stats.totalPosts} 
            icon={<ArticleIcon fontSize="large"/>}
            color="#1976d2" // Blue
          />
        </Grid>
        
        {/* Placeholder cho User Stats (Chờ Backend update API đếm user) */}
        <Grid item xs={12} sm={6} md={4}>
          <StatCard 
            title="NGƯỜI DÙNG CHỜ DUYỆT" 
            value={0} // Placeholder
            icon={<PeopleIcon fontSize="large"/>}
            color="#ed6c02" // Orange
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
           <StatCard 
            title="NGƯỜI DÙNG HOẠT ĐỘNG" 
            value={0} // Placeholder
            icon={<VerifiedUserIcon fontSize="large"/>}
            color="#2e7d32" // Green
          />
        </Grid>
      </Grid>
    </Box>
  );
};