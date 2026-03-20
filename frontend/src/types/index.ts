// ==========================================
// THÔNG TIN NGƯỜI DÙNG (USER)
// ==========================================
export interface User {
  id: number;
  studentCode: string;
  email: string;
  fullName: string;
  className: string;
  role: string;
  avatarUrl?: string; // Có dấu ? vì có thể user chưa có ảnh
  bio?: string;
  active: boolean;
  
  // 🟢 Đã sửa thành vptlPoints cho khớp với ShopPage
  vptlPoints?: number; 
  
  // 🟢 Viền Avatar hiện tại
  currentAvatarFrame?: string | null; 
  currentNameColor?: string | null; // Màu tên hiện tại
  
  createdAt: string;
  lastLogin: string;
}

export interface UserSummary {
  id: number;
  fullName: string;
  avatarUrl?: string;
  studentCode: string;
}

export interface UpdateProfileData {
  fullName?: string;
  className?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  token: string;
}

// ==========================================
// BÀI VIẾT & BÌNH LUẬN (POST & COMMENT)
// ==========================================
export interface CommentData {
  id: number;
  content: string;
  author: UserSummary;
  createdAt: string;
  likeCount: number;
  replyCount: number;
  parentId: number | null;
  likedByCurrentUser: boolean;
  replies?: CommentData[]; // Dùng cho UI logic
}

// ==========================================
// NHẮN TIN (CHAT)
// ==========================================
export interface Conversation {
  partnerId: number;
  partnerName: string;
  partnerAvatar?: string;
  lastMessage: string;
  timestamp: string;
  isRead: boolean;
}