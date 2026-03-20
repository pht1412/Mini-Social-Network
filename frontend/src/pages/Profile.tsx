import React, { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import axiosClient from '../api/axiosClient';
import axios from 'axios';
import { CircularProgress, Box, Typography, Button } from '@mui/material';

// Import Types & Components
import type { User, UpdateProfileData } from '../types';
import PostCard from '../components/post/CardPost';
import type { PostData } from '../components/post/CardPost';
import FriendButton from '../components/friend/FriendButton';
import './Profile.css';
import api from '../api/api';

// 🔴 IMPORT MA THUẬT CSS VÀO ĐÂY
import AvatarWithFrame from '../components/AvatarWithFrame';
import ColoredName from '../components/ColoredName'; // (Sửa đường dẫn cho đúng từng file)

const Profile: React.FC = () => {
  // --- STATE QUẢN LÝ DỮ LIỆU ---
  const [user, setUser] = useState<User | null>(null);
  const [friends, setFriends] = useState<User[]>([]);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  // --- STATE EDIT PROFILE ---
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<UpdateProfileData>({});
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // --- 1. CÁC HÀM API ---
  const fetchMyPosts = async () => {
    try {
      setLoadingPosts(true);
      const res = await api.get('/api/posts/my-posts');
      setPosts(res.data.content || []);
    } catch (error) {
      console.error("Lỗi tải bài viết:", error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleRemovePost = (deletedPostId: number) => {
    setPosts(prev => prev.filter(p => p.id !== deletedPostId));
  };

  // --- 2. USE EFFECT (CHẠY 1 LẦN KHI MOUNT) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resUser, resFriends] = await Promise.all([
          axiosClient.get('/profile'),
          axiosClient.get('/friends/list')
        ]);

        setUser(resUser.data);
        setFriends(resFriends.data);

        setEditFormData({
          fullName: resUser.data.fullName,
          className: resUser.data.className,
          bio: resUser.data.bio,
          avatarUrl: resUser.data.avatarUrl
        });

      } catch (error) {
        console.error("Lỗi tải profile:", error);
      }
    };

    fetchData();
    fetchMyPosts();
  }, []);

  // --- 3. CÁC HÀM XỬ LÝ SỰ KIỆN EDIT ---
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewAvatar(URL.createObjectURL(file));
    }
  };

  const uploadAvatarFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const token = localStorage.getItem("token");

    const res = await axios.post("http://localhost:8080/api/upload/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`
      }
    });
    return res.data.url;
  };

  const handleSaveProfile = async () => {
    try {
      let finalAvatarUrl = editFormData.avatarUrl;
      if (selectedFile) {
        finalAvatarUrl = await uploadAvatarFile(selectedFile);
      }

      const updatedData = { ...editFormData, avatarUrl: finalAvatarUrl };
      const res = await axiosClient.put('/profile', updatedData);

      setUser(res.data);
      setIsEditing(false);
      alert("Cập nhật thành công!");
    } catch (error) {
      console.error(error);
      alert("Lỗi cập nhật!");
    }
  };

  // 🔴 MỚI: HÀM GỠ VIỀN AVATAR
  const handleUnequipFrame = async () => {
    try {
      const res = await api.put('/api/shop/items/unequip');
      // Cập nhật lại state ảo để UI mất viền ngay lập tức
      if (user) {
        setUser({ ...user, currentAvatarFrame: undefined } as any);
      }
      alert(res.data.message || "Đã tháo viền Avatar thành công!");
    } catch (error) {
      console.error("Lỗi tháo viền:", error);
      alert("Không thể tháo viền lúc này.");
    }
  };

  if (!user) return <div style={{ textAlign: 'center', marginTop: 100 }}>Đang tải...</div>;

  return (
    <>
      <div className="profile-page">
        {/* --- HEADER PROFILE (COVER + AVATAR) --- */}
        <div className="cover-section">
          <div className="cover-photo"></div>
          <div className="profile-header-content">

            {/* 🔴 THAY THẾ ẢNH AVATAR CHÍNH BẰNG COMPONENT CÓ VIỀN */}
            <div className="profile-avatar-xl" style={{ border: 'none', background: 'transparent', padding: 0 }}>
              <AvatarWithFrame
                src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.fullName}`}
                frameClass={(user as any).currentAvatarFrame}
                size={140}
              />
            </div>

            <div className="profile-details" style={{ marginTop: '10px' }}>
              <h1 className="profile-fullname">
                <ColoredName name={user.fullName} colorClass={(user as any).currentNameColor} />
              </h1>              <div className="profile-bio">{user.bio || "Người dùng MiniSocial"}</div>
            </div>

            <button className="btn-edit-profile" onClick={() => setIsEditing(true)}>
              ✏️ Chỉnh sửa trang cá nhân
            </button>
          </div>
        </div>

        {/* --- BODY (2 CỘT) --- */}
        <div className="profile-body">
          <div className="profile-container">

            {/* CỘT TRÁI (40%): GIỚI THIỆU & BẠN BÈ */}
            <div style={{ flex: '4', display: 'flex', flexDirection: 'column', gap: '20px' }}>

              <div className="profile-card">
                <div className="card-title">Giới thiệu</div>
                <div className="info-row">🎓 Sinh viên lớp <b>{user.className}</b></div>
                <div className="info-row">🆔 Mã SV: <b>{user.studentCode}</b></div>
                <div className="info-row">📧 Email: {user.email}</div>
                <div className="info-row">📅 Tham gia: {new Date(user.createdAt).toLocaleDateString()}</div>
              </div>

              {/* Box Bạn bè */}
              <div className="profile-card">
                <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Bạn bè</span>
                  <span style={{ color: 'var(--text-sub)', fontSize: '16px', fontWeight: 'normal' }}>{friends.length} người bạn</span>
                </div>

                {friends.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                    {friends.slice(0, 9).map(f => (
                      <div key={f.id} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* 🔴 ÁP DỤNG VIỀN CHO AVATAR BẠN BÈ */}
                        <AvatarWithFrame
                          src={f.avatarUrl || `https://ui-avatars.com/api/?name=${f.fullName}`}
                          frameClass={(f as any).currentAvatarFrame}
                          size={80}
                        />
                        <div style={{ fontSize: '12px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '5px', width: '100%' }}>
                          <ColoredName name={f.fullName} colorClass={(f as any).currentNameColor} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#888', fontStyle: 'italic' }}>Chưa có bạn bè nào.</p>
                )}

                <button style={{ width: '100%', padding: '8px', marginTop: '15px', background: '#e4e6eb', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>
                  Xem tất cả bạn bè
                </button>
              </div>
            </div>

            {/* CỘT PHẢI (60%): DANH SÁCH BÀI VIẾT */}
            <div style={{ flex: '6' }}>
              <div className="profile-card" style={{ padding: '15px', marginBottom: '20px', fontWeight: 'bold', fontSize: '18px' }}>
                Bài viết
              </div>

              {loadingPosts ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <CircularProgress />
                </Box>
              ) : posts.length > 0 ? (
                posts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onDeleteSuccess={handleRemovePost}
                  />
                ))
              ) : (
                <div className="profile-card" style={{ textAlign: 'center', padding: '40px', color: '#65676b' }}>
                  <Typography variant="body1">Bạn chưa đăng bài viết nào.</Typography>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* --- MODAL EDIT PROFILE --- */}
      {isEditing && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close-btn" onClick={() => setIsEditing(false)}>✖</span>
            <div className="modal-header">Chỉnh sửa trang cá nhân</div>

            {/* 🔴 ÁP DỤNG VIỀN TRONG MODAL & THÊM NÚT GỠ VIỀN */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
              <div className="avatar-upload-box" style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto' }}>
                <AvatarWithFrame
                  src={previewAvatar || editFormData.avatarUrl || `https://ui-avatars.com/api/?name=${user.fullName}`}
                  frameClass={(user as any).currentAvatarFrame}
                  size={100}
                />
                <label htmlFor="file-upload" className="camera-icon" style={{ zIndex: 10 }}>📷</label>
                <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
              </div>

              {/* NÚT THÁO VIỀN */}
              {(user as any).currentAvatarFrame && (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  sx={{ mt: 2, borderRadius: '50px', textTransform: 'none', fontWeight: 'bold' }}
                  onClick={handleUnequipFrame}
                >
                  🚫 Tháo viền Avatar
                </Button>
              )}
            </div>

            <div className="modal-form-group">
              <label className="modal-label">Họ và tên</label>
              <input name="fullName" className="modern-input" value={editFormData.fullName || ''} onChange={handleEditChange} />
            </div>
            <div className="modal-form-group">
              <label className="modal-label">Lớp</label>
              <input name="className" className="modern-input" value={editFormData.className || ''} onChange={handleEditChange} />
            </div>
            <div className="modal-form-group">
              <label className="modal-label">Tiểu sử (Bio)</label>
              <textarea name="bio" className="modern-input" style={{ height: '80px', resize: 'none', fontFamily: 'inherit' }} value={editFormData.bio || ''} onChange={handleEditChange} />
            </div>

            <div className="btn-actions">
              <button className="btn-cancel" onClick={() => setIsEditing(false)}>Hủy</button>
              <button className="btn-save" onClick={handleSaveProfile}>Lưu thay đổi</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;