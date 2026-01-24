import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

interface Props { 
  targetUserId: number; 
  currentUserId: number; 
  className?: string; 
}

const FriendButton: React.FC<Props> = ({ targetUserId, currentUserId, className }) => {
  const [status, setStatus] = useState<string>('NONE');
  const [actionUserId, setActionUserId] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await axiosClient.get(`/friends/status/${targetUserId}`);
        setStatus(res.data.status);
        setActionUserId(res.data.actionUserId);
      } catch (err) { console.error(err); }
    };
    checkStatus();
  }, [targetUserId]);

  const handleAction = async (action: 'add' | 'accept' | 'remove') => {
    if (action === 'remove' && status === 'ACCEPTED') {
       if (!window.confirm("Bạn có chắc chắn muốn hủy kết bạn không?")) return;
    }

    try {
      if (action === 'add') {
        await axiosClient.post(`/friends/add/${targetUserId}`);
        setStatus('PENDING'); setActionUserId(currentUserId);
      } else if (action === 'accept') {
        await axiosClient.post(`/friends/accept/${targetUserId}`);
        setStatus('ACCEPTED');
      } else {
        await axiosClient.delete(`/friends/remove/${targetUserId}`);
        setStatus('NONE'); setActionUserId(null);
      }
    } catch(e) { console.error(e); }
  };

  // --- STYLE ĐÃ ĐƯỢC TỐI ƯU CỐ ĐỊNH KÍCH THƯỚC ---
  const baseStyle: React.CSSProperties = { 
    padding: '8px 4px', // Giảm padding ngang một chút để chữ không bị tràn nút 120px
    borderRadius: '6px', 
    border: 'none', 
    fontWeight: '600', 
    cursor: 'pointer', 
    fontSize: '13px', 
    transition: 'all 0.2s', 
    width: '100%', // Sẽ chiếm trọn 120px của container cha
    height: '36px', // Cố định chiều cao cho đồng đều
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: '4px'
  };
  
  if (status === 'ACCEPTED') {
    return (
      <button 
        onClick={() => handleAction('remove')}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        style={{
          ...baseStyle, 
          background: isHovering ? '#ffebee' : '#e4e6eb', 
          color: isHovering ? '#d32f2f' : '#050505'
        }}
        className={className}
      >
        {isHovering ? 'Hủy' : '✔ Bạn bè'}
      </button>
    );
  }

  if (status === 'PENDING') {
    if (actionUserId === currentUserId) {
      return (
        <button onClick={() => handleAction('remove')} style={{...baseStyle, background: '#e4e6eb', color: '#050505'}} className={className}>
           Hủy lời mời
        </button>
      );
    } 
    return (
      <div style={{display:'flex', gap:'4px', width: '100%'}}>
        <button onClick={() => handleAction('accept')} style={{...baseStyle, background: '#1877F2', color: 'white', flex: 1}}>Nhận</button>
        <button onClick={() => handleAction('remove')} style={{...baseStyle, background: '#e4e6eb', color: '#050505', flex: 1}}>Xóa</button>
      </div>
    );
  }

  return (
    <button onClick={() => handleAction('add')} style={{...baseStyle, background: '#e7f3ff', color: '#1877F2'}} className={className}>
      + Thêm bạn
    </button>
  );
};
export default FriendButton;