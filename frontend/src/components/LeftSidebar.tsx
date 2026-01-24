import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Avatar, Divider, Typography } from '@mui/material';
import { 
  People as PeopleIcon, 
  Groups as GroupsIcon, 
  History as HistoryIcon, 
  Event as EventIcon,
  Bookmark as BookmarkIcon
} from '@mui/icons-material';
import type { User } from '../types/index';

interface LeftSidebarProps {
  user: User | null;
}

const menuItems = [
    { text: 'Bạn bè', icon: <PeopleIcon sx={{ color: '#1877F2' }} />, path: '/friends' },
    { text: 'Nhóm', icon: <GroupsIcon sx={{ color: '#2ABBA7' }} />, path: '/groups' },
    { text: 'Kỷ niệm', icon: <HistoryIcon sx={{ color: '#1877F2' }} />, path: '/history' },
    { text: 'Sự kiện', icon: <EventIcon sx={{ color: '#F35E7A' }} />, path: '/events' },
    { text: 'Đã lưu', icon: <BookmarkIcon sx={{ color: '#9360F7' }} />, path: '/saved' },
];

export default function LeftSidebar({ user }: LeftSidebarProps) {
  return (
    <Box sx={{ position: 'sticky', top: '76px', height: 'calc(100vh - 76px)', overflowY: 'auto', pr: 1 }}>
      <List component="nav" sx={{ p: 0 }}>
        {/* THÔNG TIN USER THẬT */}
        <ListItemButton component={RouterLink} to={`/profile/${user?.id}`} sx={{ borderRadius: 2, mb: 0.5 }}>            
          <ListItemIcon>
            <Avatar 
              src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.fullName}`} 
              sx={{ width: 36, height: 36 }} 
            />
          </ListItemIcon>
          <ListItemText 
            primary={user?.fullName || 'Người dùng'} 
            primaryTypographyProps={{ fontWeight: 600, fontSize: '15px' }} 
          />
        </ListItemButton>

        {menuItems.map((item) => (
          <ListItemButton key={item.text} sx={{ borderRadius: 2, mb: 0.5 }}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 500, fontSize: '15px' }} />
          </ListItemButton>
        ))}
        
        <Divider sx={{ my: 1.5, mx: 2 }} />
        <Typography variant="caption" color="text.secondary" sx={{ pl: 2, fontSize: '12px', display: 'block', lineHeight: 1.5 }}>
            Quyền riêng tư  · Điều khoản  · Quảng cáo  · Cookie  · Meta © 2025
        </Typography>
      </List>
    </Box>
  );
}