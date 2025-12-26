import React, { useState } from 'react';
import { 
  IconButton, Badge, Menu, MenuItem, 
  Typography, Box, Avatar, ListItemText, Divider 
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../../context/WebSocketContext';

export default function NotificationBell() {
  const { notifications, unreadCount, markAllAsRead } = useWebSocket();
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    
    if (unreadCount > 0) {
      markAllAsRead(); 
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (targetUrl: string) => {
    handleClose();
    if (targetUrl) {
      navigate(targetUrl);
    }
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
         <Box sx={{ p: 2, pb: 1 }}>
            <Typography variant="h6">Thông báo</Typography>
        </Box>
        <Divider />
        
        {notifications.length === 0 ? (
           <MenuItem disabled><Typography variant="body2">Không có thông báo</Typography></MenuItem>
        ) : (
          notifications.map((notif, index) => (
            <MenuItem 
                key={notif.id || index} 
                onClick={() => handleNotificationClick(notif.targetUrl)}
                sx={{ 
                    bgcolor: !notif.isRead ? 'rgba(25, 118, 210, 0.08)' : 'inherit',
                    whiteSpace: 'normal',
                    maxWidth: '300px'
                }} 
            >
              <Avatar src={notif.senderAvatar} sx={{ mr: 2 }} />
              <ListItemText
                primary={
                    <Typography variant="subtitle2">
                        <strong>{notif.senderName}</strong> {notif.message}
                    </Typography>
                }
                secondary={
                    <Typography variant="caption" color="text.secondary">
                        {new Date(notif.createdAt).toLocaleString()}
                    </Typography>
                }
              />
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
}