import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Button, IconButton, Avatar, Chip, Tooltip
} from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Interface User (Giả định dựa trên AdminController)
interface User {
  id: number;
  fullName: string;
  email: string;
  avatarUrl?: string;
  status: 'ACTIVE' | 'BANNED' | 'PENDING'; // Giả định trạng thái
}

// ⭐️ QUAN TRỌNG: Export đúng tên 'UserManager'
export const UserManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Gọi API lấy danh sách user khi component được mount
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
        // Lưu ý: Bạn cần bổ sung API @GetMapping("/users") vào AdminController java
        // const response = await axios.get('/api/admin/users');
        // setUsers(response.data);
    } catch (error) {
        console.error("Lỗi tải danh sách người dùng", error);
    }
  };

  const handleApproveUser = async (userId: number) => {
    try {
        await axios.post(`/api/admin/approve-user/${userId}`);
        alert("Đã duyệt người dùng thành công.");
        fetchUsers();
    } catch (error) {
        alert("Lỗi khi duyệt người dùng.");
    }
  };

  const handleBanUser = async (userId: number) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn khóa tài khoản này?");
    if(confirm) {
        try {
            await axios.post(`/api/admin/ban-user/${userId}`);
            alert("Đã khóa người dùng thành công.");
            fetchUsers();
        } catch (error) {
            alert("Lỗi khi khóa người dùng.");
        }
    }
  };

  return (
    <Box>
       <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>Quản lý Người dùng</Typography>
       
       <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Thông tin cá nhân</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
             {users.length > 0 ? users.map((user) => (
               <TableRow key={user.id} hover>
                 <TableCell>{user.id}</TableCell>
                 <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar src={user.avatarUrl} />
                        <Typography variant="body2">{user.fullName}</Typography>
                    </Box>
                 </TableCell>
                 <TableCell>{user.email}</TableCell>
                 <TableCell>
                    <Chip 
                        label={user.status} 
                        color={user.status === 'ACTIVE' ? 'success' : user.status === 'BANNED' ? 'error' : 'warning'}
                        size="small"
                    />
                 </TableCell>
                 <TableCell align="right">
                    <Tooltip title="Duyệt / Mở khóa">
                        <IconButton size="small" color="success" onClick={() => handleApproveUser(user.id)}>
                            <CheckCircleIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Khóa tài khoản">
                        <IconButton size="small" color="error" onClick={() => handleBanUser(user.id)}>
                            <BlockIcon />
                        </IconButton>
                    </Tooltip>
                 </TableCell>
               </TableRow>
             )) : (
                <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                        <Typography variant="body2" color="textSecondary">
                            Chưa có dữ liệu hoặc chưa kết nối API lấy danh sách User.
                        </Typography>
                    </TableCell>
                </TableRow>
             )}
          </TableBody>
        </Table>
       </TableContainer>
    </Box>
  );
};