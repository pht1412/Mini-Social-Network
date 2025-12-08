import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Button, Chip, IconButton, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Avatar, Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';

// ⭐️ CẬP NHẬT INTERFACE KHỚP VỚI ENTITY 'POST' CỦA BACKEND
interface PostMedia {
  id: number;
  url: string; // backend trả về `url`
  type: 'IMAGE' | 'VIDEO';
}

interface Post {
  id: number;
  content: string;
  visibility: 'PUBLIC' | 'FRIENDS' | 'PRIVATE' | 'PENDING'; // Khớp với Enum Visibility
  author: { // Backend trả về 'author', không phải 'user'
    id: number;
    username?: string;
    fullName?: string;
    avatarUrl?: string; // Backend sử dụng `avatarUrl`
  };
  media: PostMedia[]; // Backend trả về list media
  createdAt: string;
}

export const PostManager: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [deleteReason, setDeleteReason] = useState('');
  // Image preview state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      // ⭐️ Gọi đúng API Backend (http://localhost:8080)
      const response = await axios.get('http://localhost:8080/api/admin/posts');
      if (Array.isArray(response.data)) {
         setPosts(response.data);
      }
    } catch (error) {
      console.error("Lỗi tải bài viết:", error);
    }
  };

  const handleApprove = async (postId: number) => {
    try {
      await axios.post(`http://localhost:8080/api/admin/approve-post/${postId}`);
      alert("Đã duyệt bài viết thành công!");
      fetchPosts(); // Load lại danh sách
    } catch (error) {
      alert("Lỗi khi duyệt bài.");
    }
  };

  const handleOpenDelete = (postId: number) => {
    setSelectedPostId(postId);
    setDeleteReason('');
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPostId) return;
    try {
      await axios.delete(`http://localhost:8080/api/admin/delete-post/${selectedPostId}`, {
        params: { reason: deleteReason }
      });
      setOpenDeleteDialog(false);
      alert("Đã xóa bài viết.");
      fetchPosts();
    } catch (error) {
      alert("Lỗi khi xóa bài.");
    }
  };

  // Helper để lấy tên đầy đủ
  const getAuthorName = (post: Post) => {
    if (!post.author) return "Unknown";
    // Backend provides either fullName or username
    return post.author.fullName || post.author.username || "Người dùng";
  };

  // Helper để lấy ảnh đầu tiên
  // Normalize URLs coming from backend. If URL is relative (starts with '/'),
  // prefix with backend host so browser loads the image from the backend server.
  const normalizeUrl = (url?: string | null) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `http://localhost:8080${url}`;
  };

  // Helper để lấy ảnh đầu tiên (normalized)
  const getFirstImage = (post: Post) => {
    if (post.media && post.media.length > 0) {
      return normalizeUrl(post.media[0].url);
    }
    return null;
  };

  // Open preview dialog for given URL (already normalized or relative)
  const openPreview = (url: string | null) => {
    const normalized = normalizeUrl(url);
    if (!normalized) return;
    setPreviewUrl(normalized);
    setPreviewOpen(true);
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>Quản lý Bài viết</Typography>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Người đăng</TableCell>
              <TableCell>Nội dung</TableCell>
              <TableCell>Hình ảnh</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.length > 0 ? posts.map((post) => (
              <TableRow key={post.id} hover>
                <TableCell>{post.id}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {/* Giả định author có trường avatar, nếu không dùng placeholder */}
                    <Avatar
                      src={post.author?.avatarUrl}
                      alt={getAuthorName(post)}
                      sx={{ width: 30, height: 30, cursor: 'pointer' }}
                      onClick={() => openPreview(normalizeUrl(post.author?.avatarUrl))}
                    />
                    <Typography variant="body2">{getAuthorName(post)}</Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ maxWidth: 300 }}>
                   <Typography noWrap variant="body2">{post.content}</Typography>
                </TableCell>
                <TableCell>
                  {getFirstImage(post) ? (
                    <Avatar
                      variant="rounded"
                      src={getFirstImage(post)!}
                      sx={{ width: 50, height: 50, cursor: 'pointer' }}
                      onClick={() => openPreview(getFirstImage(post))}
                    />
                  ) : "Không có"}
                </TableCell>
                <TableCell>
                  {/* Hiển thị Chip màu dựa trên visibility */}
                  <Chip 
                    label={post.visibility} 
                    color={post.visibility === 'PUBLIC' ? 'success' : post.visibility === 'PENDING' ? 'warning' : 'default'} 
                    size="small" 
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Xem chi tiết">
                    <IconButton size="small" color="info"><VisibilityIcon /></IconButton>
                  </Tooltip>
                  {/* Nút duyệt chỉ hiện khi bài viết đang là PENDING */}
                  {post.visibility === 'PENDING' && (
                    <Tooltip title="Duyệt bài">
                      <IconButton size="small" color="success" onClick={() => handleApprove(post.id)}>
                          <CheckCircleIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Xóa bài">
                    <IconButton size="small" color="error" onClick={() => handleOpenDelete(post.id)}>
                        <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={6} align="center">Chưa có bài viết nào.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog Xóa giữ nguyên */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Xác nhận xóa bài viết</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Hành động này không thể hoàn tác. Vui lòng nhập lý do xóa.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Lý do xóa"
            fullWidth
            variant="outlined"
            value={deleteReason}
            onChange={(e) => setDeleteReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Hủy</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Xóa ngay</Button>
        </DialogActions>
      </Dialog>
      {/* Image preview dialog */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="lg">
        <DialogContent sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
          {previewUrl ? (
            // use img to preserve aspect ratio and allow large preview
            <Box component="img" src={previewUrl} alt="Preview" sx={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: 1 }} />
          ) : (
            <Typography>Không có ảnh để xem.</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};