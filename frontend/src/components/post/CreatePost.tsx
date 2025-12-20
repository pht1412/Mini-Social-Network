<<<<<<< HEAD
import React, { useState } from 'react';
import {
  Box, Paper, Avatar, Button, Divider, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography,
  Tooltip
=======
import React, { useState, useRef } from 'react';
import {
  Box, Paper, Avatar, Button, Divider, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography,
  Tooltip, CircularProgress, ImageList, ImageListItem
>>>>>>> origin/tphat
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Import Icons
<<<<<<< HEAD
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary'; // Icon Ảnh
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt'; // Icon Cảm xúc
import CloseIcon from '@mui/icons-material/Close';

// Mock data cho người dùng đang đăng nhập
const currentUser = {
  name: "Lê Hông Phát",
  avatarUrl: "https://placehold.co/40x40/EFEFEF/333?text=LHP",
};

// --- Styled Component cho ô input giả ---
const FakeInputButton = styled(Button)(({ theme }) => ({
  flexGrow: 1,
  borderRadius: '20px',
  backgroundColor: theme.palette.background.default, // Màu nền xám nhạt
=======
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete'; // Icon xóa ảnh

// Mock data (Sau này bạn có thể lấy từ Context/Redux)
const currentUser = {
  name: "Nguyễn Văn Mock",
  avatarUrl: "https://i.pravatar.cc/150?u=999",
  id: 1 // Giả sử ID user
};

// --- Styled Components ---
const FakeInputButton = styled(Button)(({ theme }) => ({
  flexGrow: 1,
  borderRadius: '20px',
  backgroundColor: theme.palette.background.default,
>>>>>>> origin/tphat
  color: theme.palette.text.secondary,
  justifyContent: 'flex-start',
  padding: '8px 16px',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

<<<<<<< HEAD
// ------------------------------------------

export default function CreatePost() {
  // State để quản lý việc Bật/Tắt Modal
  const [open, setOpen] = useState(false);
  // State để lưu nội dung bài đăng
  const [postContent, setPostContent] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPostContent(''); // Xóa nội dung khi đóng
  };

  const handlePost = () => {
    // TODO: Xử lý logic đăng bài (gọi API)
    console.log('Đăng bài:', postContent);
    handleClose(); // Đóng modal sau khi đăng
=======
export default function CreatePost() {
  const [open, setOpen] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]); // State lưu file thực tế
  const [previewUrls, setPreviewUrls] = useState([]);     // State lưu URL để hiển thị preview
  const [isLoading, setIsLoading] = useState(false);      // State loading khi gọi API

  // Ref để trigger input file ẩn
  const fileInputRef = useRef(null);

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => {
    if (isLoading) return; // Không cho đóng khi đang upload
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setPostContent('');
    setSelectedFiles([]);
    // Revoke các object URL để tránh leak memory
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setPreviewUrls([]);
  };

  // Xử lý khi chọn file
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Cập nhật list file để gửi lên server
    setSelectedFiles(prev => [...prev, ...files]);

    // Tạo URL preview cho ảnh
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  // Xử lý xóa ảnh khỏi danh sách chờ
  const handleRemoveImage = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    
    // Revoke URL của ảnh bị xóa
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  // Logic gọi API
  const handlePost = async () => {
    if (!postContent.trim() && selectedFiles.length === 0) return;

    setIsLoading(true);

    try {
      // 1. Tạo FormData (Bắt buộc khi gửi file)
      const formData = new FormData();
      formData.append('content', postContent);
      formData.append('visibility', 'PUBLIC'); // Default visibility
      
      // Append từng file vào key 'mediaFiles' (giống tên biến trong DTO Java)
      selectedFiles.forEach((file) => {
        formData.append('mediaFiles', file);
      });

      // 2. Gọi API
      // Lưu ý: Không set 'Content-Type': 'multipart/form-data' thủ công.
      // Trình duyệt sẽ tự làm việc này để thêm boundary.
      const response = await fetch('http://localhost:8080/api/posts', {
        method: 'POST',
        headers: {
            // 'Authorization': `Bearer ${token}`, // Nếu bạn có xác thực JWT thì bỏ comment dòng này
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Post created success:', data);
        handleClose();
        // TODO: Gọi hàm callback để reload newsfeed ở component cha (nếu có)
      } else {
        console.error('Upload failed');
        alert('Có lỗi xảy ra khi đăng bài!');
      }

    } catch (error) {
      console.error('Error:', error);
      alert('Lỗi kết nối server!');
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger click input file
  const onClickPickImage = () => {
    fileInputRef.current.click();
>>>>>>> origin/tphat
  };

  return (
    <>
<<<<<<< HEAD
      {/* PHẦN 1: KHUNG TẠO BÀI VIẾT (NHƯ ẢNH 1)
        Đây là component 'Paper' đã được style
      */}
      <Paper 
        elevation={0} 
        sx={{ 
          border: '1px solid #E0E0E0', 
          p: 2, 
          mb: 3,
          cursor: 'pointer',
          '&:hover': { bgcolor: 'action.hover' }
        }}
        onClick={handleClickOpen} // Click vào đâu cũng mở modal
      >
        {/* Hàng trên: Avatar và Input giả */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <Avatar src={currentUser.avatarUrl} alt={currentUser.name} sx={{ mr: 1.5 }} />
          <FakeInputButton fullWidth>
            Phát ơi, bạn đang nghĩ gì thế?
          </FakeInputButton>
        </Box>
        
        <Divider />
        
        {/* Hàng dưới: 2 Icon (Ảnh, Cảm xúc) */}
=======
      {/* INPUT FILE ẨN: Để xử lý chọn ảnh */}
      <input
        type="file"
        multiple
        accept="image/*,video/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      {/* PHẦN 1: TRIGGER BUTTON */}
      <Paper 
        elevation={0} 
        sx={{ border: '1px solid #E0E0E0', p: 2, mb: 3, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' }}}
        onClick={handleClickOpen}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <Avatar src={currentUser.avatarUrl} alt={currentUser.name} sx={{ mr: 1.5 }} />
          <FakeInputButton fullWidth>Mock ơi, bạn đang nghĩ gì thế?</FakeInputButton>
        </Box>
        <Divider />
>>>>>>> origin/tphat
        <Box sx={{ display: 'flex', justifyContent: 'space-around', pt: 1 }}>
          <Button startIcon={<PhotoLibraryIcon sx={{ color: '#45bd62' }} />} sx={{ color: 'text.secondary' }}>
            Ảnh
          </Button>
          <Button startIcon={<SentimentSatisfiedAltIcon sx={{ color: '#f7b928' }} />} sx={{ color: 'text.secondary' }}>
            Cảm xúc
          </Button>
        </Box>
      </Paper>

<<<<<<< HEAD

      {/* PHẦN 2: MODAL TẠO BÀI VIẾT (POPUP NHƯ ẢNH 2)
      */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        {/* Tiêu đề Modal */}
=======
      {/* PHẦN 2: MODAL */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
>>>>>>> origin/tphat
        <DialogTitle>
          <Typography variant="h6" component="span" sx={{ fontWeight: 'bold', textAlign: 'center', display: 'block' }}>
            Tạo bài viết
          </Typography>
          <IconButton
<<<<<<< HEAD
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
=======
            onClick={handleClose}
            disabled={isLoading}
            sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
>>>>>>> origin/tphat
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <Divider />
        
<<<<<<< HEAD
        {/* Nội dung Modal */}
        <DialogContent>
          {/* Thông tin người dùng */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar src={currentUser.avatarUrl} alt={currentUser.name} />
            <Box sx={{ ml: 1.5 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {currentUser.name}
              </Typography>
              {/* Đã loại bỏ phần "Công khai" theo yêu cầu */}
            </Box>
          </Box>
          
          {/* Khung nhập text */}
=======
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar src={currentUser.avatarUrl} alt={currentUser.name} />
            <Box sx={{ ml: 1.5 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{currentUser.name}</Typography>
              <Typography variant="caption" color="text.secondary">Công khai</Typography>
            </Box>
          </Box>
          
>>>>>>> origin/tphat
          <TextField
            autoFocus
            fullWidth
            multiline
<<<<<<< HEAD
            rows={5}
            variant="standard" // Dùng 'standard' để không có viền
            InputProps={{ disableUnderline: true }} // Bỏ gạch chân
            placeholder="Phát ơi, bạn đang nghĩ gì thế?"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            sx={{ fontSize: '1.5rem' }} // Chữ to
          />
          
          {/* Phần "Thêm vào bài viết" (đã giản lược) */}
          <Paper 
            variant="outlined" 
            sx={{ mt: 2, p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Typography variant="body2" sx={{ ml: 1, fontWeight: 500 }}>
              Thêm vào bài viết
            </Typography>
            <Box>
              <Tooltip title="Ảnh">
                <IconButton sx={{ color: '#45bd62' }}>
=======
            rows={3}
            variant="standard"
            InputProps={{ disableUnderline: true }}
            placeholder="Mock ơi, bạn đang nghĩ gì thế?"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            sx={{ fontSize: '1.2rem', mb: 2 }}
          />

          {/* PREVIEW ẢNH ĐÃ CHỌN */}
          {previewUrls.length > 0 && (
            <Paper variant="outlined" sx={{ p: 1, mb: 2, maxHeight: 200, overflowY: 'auto' }}>
                <ImageList cols={3} rowHeight={100} gap={8}>
                    {previewUrls.map((url, index) => (
                        <ImageListItem key={index}>
                            <img src={url} alt={`Preview ${index}`} loading="lazy" style={{ height: '100px', objectFit: 'cover', borderRadius: 4 }} />
                            <IconButton 
                                size="small"
                                sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'rgba(0,0,0,0.5)', color: 'white' }}
                                onClick={() => handleRemoveImage(index)}
                            >
                                <CloseIcon fontSize="small"/>
                            </IconButton>
                        </ImageListItem>
                    ))}
                </ImageList>
            </Paper>
          )}

          {/* TOOLBAR */}
          <Paper variant="outlined" sx={{ mt: 2, p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ ml: 1, fontWeight: 500 }}>Thêm vào bài viết</Typography>
            <Box>
              <Tooltip title="Ảnh/Video">
                <IconButton sx={{ color: '#45bd62' }} onClick={onClickPickImage}>
>>>>>>> origin/tphat
                  <PhotoLibraryIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Cảm xúc">
                <IconButton sx={{ color: '#f7b928' }}>
                  <SentimentSatisfiedAltIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Paper>
        </DialogContent>
        
<<<<<<< HEAD
        {/* Nút Đăng */}
=======
>>>>>>> origin/tphat
        <DialogActions sx={{ p: 2 }}>
          <Button 
            fullWidth 
            variant="contained" 
            onClick={handlePost}
<<<<<<< HEAD
            disabled={!postContent.trim()} // Vô hiệu hóa nút khi chưa nhập gì
          >
            Đăng
=======
            disabled={(!postContent.trim() && selectedFiles.length === 0) || isLoading}
          >
            {isLoading ? <CircularProgress size={24} color="inherit"/> : "Đăng"}
>>>>>>> origin/tphat
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}