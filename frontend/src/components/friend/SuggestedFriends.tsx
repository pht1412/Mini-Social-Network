import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import type { User } from '../../types';
import FriendButton from './FriendButton';

interface Props {
    currentUserId: number;
}

const SuggestedFriends: React.FC<Props> = ({ currentUserId }) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    axiosClient.get('/friends/suggested')
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ background: 'white', borderRadius: '8px', padding: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
      <h3 style={{ marginBottom: '16px', color: '#65676b', fontSize: '16px', fontWeight: 'bold' }}>Gợi ý kết bạn</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {users.map(u => (
          <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* VÙNG 1: AVATAR & INFO (flex: 1 để chiếm không gian còn lại) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
              <img 
                src={u.avatarUrl || `https://ui-avatars.com/api/?name=${u.fullName}`} 
                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} 
                alt="ava"
              />
              <div style={{ overflow: 'hidden' }}>
                <div style={{ 
                    fontWeight: '600', 
                    fontSize: '14px', 
                    color: '#050505',
                    whiteSpace: 'nowrap', 
                    textOverflow: 'ellipsis', 
                    overflow: 'hidden' 
                }}>
                  {u.fullName}
                </div>
                <div style={{ fontSize: '12px', color: '#65676b' }}>{u.studentCode}</div>
              </div>
            </div>

            {/* VÙNG 2: BUTTON (flexShrink: 0 và width cố định để không bao giờ bị scale) */}
            <div style={{ flexShrink: 0, width: '120px' }}>
              <FriendButton targetUserId={u.id} currentUserId={currentUserId} />
            </div>
          </div>
        ))}
        {users.length === 0 && <div style={{ fontSize: '13px', color: '#888', textAlign: 'center' }}>Không có gợi ý mới.</div>}
      </div>
    </div>
  );
};

export default SuggestedFriends;