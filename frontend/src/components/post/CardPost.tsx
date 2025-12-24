import React, { useState } from 'react';
import {
  Card, CardHeader, CardContent, CardActions,
  Avatar, IconButton, Typography, Box, Divider, Button, Link,
  Menu, MenuItem, ListItemIcon,
  Collapse
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

// Import Icons
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined'; // Like rỗng
import ThumbUpIcon from '@mui/icons-material/ThumbUp'; // ⭐️ Thêm: Like đặc (đã like)
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Import API & Components
import api from '../../api/api'; // ⭐️ Sử dụng axios instance thay vì fetch trần
import EditPost from './EditPost';
import PostMediaGrid from './PostMediaGrid';
import CommentSection from '../comment/CommentSection';

// --- Types ---
export interface PostMedia {
  id: number;
  url: string;
  type: string;
}

export interface PostAuthor {
  id: number;
  username: string; // hoặc studentCode tùy backend
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
  likedByCurrentUser: boolean; // ⭐️ Backend phải trả về field này
  visibility?: string;
}

interface PostCardProps {
  post: PostData;
  onDeleteSuccess: (id: number) => void;
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
  const [post, setPost] = useState<PostData>(initialPost);

  // 2. STATE MENU & DIALOG
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  
  const isMenuOpen = Boolean(anchorEl);

  // Giả định User ID (Thực tế nên lấy từ Context/Redux)
  // const currentUserId = 1; 
  // const isOwner = post.author.id === currentUserId; 
  // ⭐️ Tạm thời cho hiện menu luôn để test, sau này uncomment dòng trên
  const isOwner = true; 

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

  // ⭐️ LOGIC LIKE (QUAN TRỌNG)
  const handleLikeClick = async () => {
    // 1. Snapshot: Lưu lại trạng thái cũ phòng khi API lỗi
    const previousPostState = { ...post };

    // 2. Optimistic Update: Cập nhật giao diện NGAY LẬP TỨC
    const isCurrentlyLiked = post.likedByCurrentUser;
    
    setPost(prev => ({
        ...prev,
        likedByCurrentUser: !isCurrentlyLiked, // Đảo trạng thái
        likeCount: isCurrentlyLiked ? prev.likeCount - 1 : prev.likeCount + 1 // Tăng/Giảm số lượng
    }));

    try {
        // 3. Gọi API ngầm (Fire and Forget)
        // Endpoint: POST /api/posts/{id}/like
        await api.post(`/api/posts/${post.id}/like`);
        // Nếu thành công thì thôi, không cần làm gì vì UI đã đúng rồi
    } catch (error) {
        console.error("Lỗi khi like bài viết:", error);
        // 4. Nếu lỗi: Revert (Hoàn tác) lại giao diện như cũ
        setPost(previousPostState);
    }
  };

  // Logic Xóa bài viết
  const handleDeleteClick = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) {
        try {
            // ⭐️ Dùng api instance thay cho fetch để code gọn hơn
            await api.delete(`/api/posts/${post.id}`);
            onDeleteSuccess(post.id); // Báo cha xóa khỏi list
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Lỗi khi xóa bài viết!");
        }
    }
    handleMenuClose();
  };

  // Callback khi sửa thành công
  const handleUpdateSuccess = (updatedPost: PostData) => {
      setPost(updatedPost);
  };

  const handleCommentClick = () => {
    setShowComments(!showComments);
  };

  return (
    <>
      <Card sx={{ maxWidth: '100%', margin: 'auto', mb: 3, boxShadow: 3, borderRadius: 2 }}>
        
        {/* HEADER */}
        <CardHeader
          avatar={
            <Link component={RouterLink} to={`/profile/${post.author.id}`}>
              <Avatar src={post.author.avatarUrl} alt={post.author.fullName} />
            </Link>
          }
          action={
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

        {/* MENU OPTIONS */}
        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
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

        {/* MEDIA GRID */}
        {post.media && post.media.length > 0 && (
          <PostMediaGrid media={post.media} />
        )}

        {/* STATS */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
             {/* Icon nhỏ hiển thị cạnh số like */}
             <ThumbUpIcon sx={{ width: 16, height: 16, color: 'primary.main', mr: 0.5 }} />
             <Typography variant="body2" color="text.secondary">{post.likeCount}</Typography>
          </Box>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            onClick={handleCommentClick}
          >
            {post.commentCount} bình luận
          </Typography>
        </Box>

        <Divider variant="middle" sx={{ my: 0.5 }} />

        {/* ACTIONS */}
        <CardActions sx={{ justifyContent: 'space-around', p: 1 }}>
          
          {/* ⭐️ NÚT LIKE ĐÃ GẮN HÀM XỬ LÝ */}
          <Button 
            fullWidth 
            onClick={handleLikeClick}
            startIcon={post.likedByCurrentUser ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />} 
            sx={{ 
                color: post.likedByCurrentUser ? 'primary.main' : 'text.secondary',
                fontWeight: post.likedByCurrentUser ? 'bold' : 'normal',
                textTransform: 'none'
            }}
          >
            Thích
          </Button>

          <Button 
            fullWidth 
            onClick={handleCommentClick}
            startIcon={<ChatBubbleOutlineOutlinedIcon />} 
            sx={{ color: 'text.secondary', textTransform: 'none' }}
          >
            Bình luận
          </Button>
          <Button fullWidth startIcon={<ShareOutlinedIcon />} sx={{ color: 'text.secondary', textTransform: 'none' }}>
            Chia sẻ
          </Button>
        </CardActions>

        <Collapse in={showComments} timeout="auto" unmountOnExit>
            <Divider />
            <Box sx={{ p: 2 }}>
                <CommentSection 
                    postId={post.id} 
                    // Nếu bạn có thông tin user hiện tại ở context thì truyền vào đây để hiện avatar cạnh ô input
                    currentUserAvatar="https://via.placeholder.com/150" 
                />
            </Box>
        </Collapse>
      </Card>

      {/* EDIT COMPONENT */}
      {isEditDialogOpen && (
        <EditPost
          open={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          post={post}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </>
  );
}