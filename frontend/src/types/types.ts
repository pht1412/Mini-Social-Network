export interface UserSummary {
    id: number;
    fullName: string;
    avatarUrl: string;
    studentCode: string;
}

export interface CommentData {
    id: number;
    content: string;
    author: UserSummary;
    createdAt: string;
    likeCount: number;
    replyCount: number;
    parentId: number | null;
    likedByCurrentUser: boolean;
    // Dùng cho UI logic
    replies?: CommentData[]; 
}