import React from 'react';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import type { User } from '../../types';

// 🔴 IMPORT MA THUẬT CSS VÀO ĐÂY
import AvatarWithFrame from './AvatarWithFrame';
import ColoredName from './ColoredName'; // (Sửa đường dẫn cho đúng từng file)

interface RightSidebarProps {
  friends: User[];
  onFriendClick: (friend: User) => void;
}

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

                {/* 🟢 TỰ CODE WRAPPER CHO CHẤM XANH ONLINE ĐỂ KHÔNG BỊ LỖI VIỀN */}
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <AvatarWithFrame
                    src={friend.avatarUrl || `https://ui-avatars.com/api/?name=${friend.fullName}`}
                    frameClass={(friend as any).currentAvatarFrame}
                    size={36}
                  />
                  {/* Chấm xanh Online Custom */}
                  <Box sx={{
                    position: 'absolute',
                    bottom: -2,
                    right: -2,
                    width: 11,
                    height: 11,
                    backgroundColor: '#31a24c',
                    borderRadius: '50%',
                    border: '2px solid #fff',
                    zIndex: 10
                  }} />
                </Box>

              </ListItemIcon>
              <ListItemText
                primary={<ColoredName name={friend.fullName} colorClass={(friend as any).currentNameColor} />}
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