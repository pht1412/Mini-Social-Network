import React from 'react';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Avatar, Typography, Badge, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import type { User } from '../../types';

interface RightSidebarProps {
  friends: User[];
  onFriendClick: (friend: User) => void;
}

const OnlineBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#31a24c',
    color: '#31a24c',
    boxShadow: `0 0 0 2px #F0F2F5`,
    '&::after': {
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
      borderRadius: '50%', animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor', content: '""',
    },
  },
  '@keyframes ripple': { '0%': { transform: 'scale(.8)', opacity: 1 }, '100%': { transform: 'scale(2.4)', opacity: 0 } },
}));

export default function RightSidebar({ friends, onFriendClick }: RightSidebarProps) {
  return (
    <Box sx={{ position: 'sticky', top: '76px', height: 'calc(100vh - 76px)', overflowY: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 1, mb: 1, color: '#65676B' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Người liên hệ</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Tìm kiếm"><SearchIcon sx={{ fontSize: 20, cursor: 'pointer' }} /></Tooltip>
          <Tooltip title="Tùy chọn"><MoreHorizIcon sx={{ fontSize: 20, cursor: 'pointer' }} /></Tooltip>
        </Box>
      </Box>

      <List disablePadding>
        {friends.length > 0 ? (
          friends.map((friend) => (
            <ListItemButton 
              key={friend.id} 
              onClick={() => onFriendClick(friend)}
              sx={{ borderRadius: 2, p: 1, '&:hover': { backgroundColor: '#E4E6E9' } }}
            >
              <ListItemIcon sx={{ minWidth: 44 }}>
                <OnlineBadge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot">
                  <Avatar 
                    src={friend.avatarUrl || `https://ui-avatars.com/api/?name=${friend.fullName}`} 
                    sx={{ width: 36, height: 36 }} 
                  />
                </OnlineBadge>
              </ListItemIcon>
              <ListItemText 
                primary={friend.fullName} 
                primaryTypographyProps={{ fontWeight: 500, fontSize: '14px', color: '#050505' }} 
              />
            </ListItemButton>
          ))
        ) : (
          <Typography variant="body2" sx={{ px: 2, py: 1, color: '#65676B', fontStyle: 'italic' }}>
            Chưa có người liên hệ.
          </Typography>
        )}
      </List>
    </Box>
  );
}