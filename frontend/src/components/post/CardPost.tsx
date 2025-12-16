import React, { useState } from 'react';
import {
  Card, CardHeader, CardContent, CardMedia, CardActions,
  Avatar, IconButton, Typography, Box, Divider, Button, Link,
  Menu, MenuItem, ListItemIcon
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

// Import Icons
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Import Component Edit mà bạn đã tạo ở bước trước
import EditPost from './EditPost'; // Đảm bảo đường dẫn đúng
import PostMediaGrid from './PostMediaGrid';

// --- Types (Giữ nguyên của bạn) ---
export interface PostMedia {
  id: number;
  url: string;
  type: string;
}

export interface PostAuthor {
  id: number;
  username: string;
  fullName: string;
  avatarUrl: string;
}

export interface PostData {
  id: number;
  content: string;
  createdAt: string;
  author: PostAuthor;
  media: PostMedia[];
  likeCount: number;
  commentCount: number;
  likedByCurrentUser: boolean;
  visibility?: string; // Thêm field này nếu cần dùng trong Edit
}

interface PostCardProps {
  post: PostData;
  onDeleteSuccess: (id: number) => void; // Callback để báo cho cha xóa card này khỏi list
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', { 
    day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' 
  }).format(date);
};

// ⭐️ MAIN COMPONENT
export default function PostCard({ post: initialPost, onDeleteSuccess }: PostCardProps) {
  
  // 1. STATE QUẢN LÝ DỮ LIỆU LOCAL
  // Tại sao cần? Vì props là read-only. Khi sửa xong, ta update state này để UI thay đổi ngay.
  const [post, setPost] = useState<PostData>(initialPost);

  // 2. STATE MENU & DIALOG
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const isMenuOpen = Boolean(anchorEl);

  // Giả định User ID hiện tại (Trong thực tế bạn lấy từ Context/Redux)
  const currentUserId = 1; 
  // Chỉ hiện menu nếu là bài của chính mình
  const isOwner = post.author.id === currentUserId; 

  // --- HANDLERS ---
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    setIsEditDialogOpen(true);
    handleMenuClose();
  };

  // Logic Xóa bài viết
  const handleDeleteClick = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) {
        try {
            const response = await fetch(`http://localhost:8080/api/posts/${post.id}`, {
                method: 'DELETE',
                // headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                onDeleteSuccess(post.id); // Gọi lên cha để xóa khỏi DOM
            } else {
                alert("Xóa thất bại!");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Lỗi kết nối server!");
        }
    }
    handleMenuClose();
  };

  // Callback khi sửa thành công từ Dialog
  const handleUpdateSuccess = (updatedPost: PostData) => {
      setPost(updatedPost); // Cập nhật lại UI của Card này bằng data mới
  };

  // Lấy ảnh đầu tiên (Dùng logic của bạn)
  const firstImage = post.media && post.media.length > 0 ? post.media[0].url : null;

  return (
    <>
      <Card sx={{ maxWidth: '100%', margin: 'auto', mb: 3 }}>
        
        {/* HEADER */}
        <CardHeader
          avatar={
            <Link component={RouterLink} to={`/profile/${post.author.id}`}>
              <Avatar src={post.author.avatarUrl} alt={post.author.fullName} />
            </Link>
          }
          action={
            // Chỉ hiện nút 3 chấm nếu là chủ bài viết (Optional)
            // isOwner && (
              <IconButton aria-label="settings" onClick={handleMenuClick}>
                <MoreVertIcon />
              </IconButton>
            // )
          }
          title={
            <Link component={RouterLink} to={`/profile/${post.author.id}`}
              variant="h6"
              sx={{ fontWeight: 'bold', textDecoration: 'none', color: 'text.primary', '&:hover': { textDecoration: 'underline' }}}
            >
              {post.author.fullName}
            </Link>
          }
          subheader={
            <Typography variant="body2" color="text.secondary">
              {formatDate(post.createdAt)}
            </Typography>
          }
        />

        {/* MENU OPTIONS (ẨN/HIỆN) */}
        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleEditClick}>
            <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
            Chỉnh sửa bài viết
          </MenuItem>
          <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
            <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
            Xóa bài viết
          </MenuItem>
        </Menu>

        {/* CONTENT */}
        <CardContent sx={{ pt: 0 }}>
          <Typography variant="body1" color="text.primary" style={{ whiteSpace: 'pre-line' }}>
            {post.content}
          </Typography>
        </CardContent>

        {/* MEDIA */}
        {post.media && post.media.length > 0 && (
          <PostMediaGrid media={post.media} />
        )}

        {/* STATS */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, pb: 1 }}>
          <Typography variant="body2" color="text.secondary">👍 {post.likeCount}</Typography>
          <Typography variant="body2" color="text.secondary">{post.commentCount} bình luận</Typography>
        </Box>

        <Divider variant="middle" />

        {/* ACTIONS */}
        <CardActions sx={{ justifyContent: 'space-around', p: 1 }}>
          <Button fullWidth startIcon={<ThumbUpOutlinedIcon />} sx={{ color: post.likedByCurrentUser ? 'primary.main' : 'text.secondary' }}>
            Thích
          </Button>
          <Button fullWidth startIcon={<ChatBubbleOutlineOutlinedIcon />} sx={{ color: 'text.secondary' }}>
            Bình luận
          </Button>
          <Button fullWidth startIcon={<ShareOutlinedIcon />} sx={{ color: 'text.secondary' }}>
            Chia sẻ
          </Button>
        </CardActions>
      </Card>

      {/* COMPONENT EDIT DIALOG (Sẽ hiện lên khi bấm Sửa) */}
      {isEditDialogOpen && (
        <EditPost
          open={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          post={post} // Truyền data hiện tại vào form
          onUpdateSuccess={handleUpdateSuccess} // Hứng data mới sau khi API trả về
        />
      )}
    </>
  );
}