import React from 'react';
import '../assets/css/AvatarFrames.css'; // Đường dẫn file CSS của bạn

interface AvatarProps {
    src?: string | null;
    name?: string | null; // 🟢 MỚI: Bổ sung prop name để tự tạo ảnh chữ
    frameClass?: string | null;
    size?: number; 
}

const AvatarWithFrame: React.FC<AvatarProps> = ({ 
    src, 
    name, // 🟢 Nhận name
    frameClass, 
    size = 50 
}) => {
    // 🟢 LOGIC XỬ LÝ ẢNH THÔNG MINH
    const getAvatarUrl = () => {
        if (src) return src; // Ưu tiên ảnh thật nếu có
        if (name) return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e0f2fe&color=0284c7`; // Tự tạo ảnh chữ theo tên
        return "https://ui-avatars.com/api/?name=U&background=e0f2fe&color=0284c7"; // Fallback cuối cùng nếu không có gì
    };

    return (
        <div 
            className="avatar-wrapper" 
            style={{ width: size, height: size }}
        >
            {frameClass && (
                <div className={frameClass}></div>
            )}

            <img 
                src={getAvatarUrl()} // 🟢 Gọi hàm xử lý ảnh ở đây
                alt="User Avatar"
                className="avatar-image"
                style={{ 
                    width: '100%', 
                    height: '100%',
                    padding: frameClass === 'css-frame-golden-glow' ? '4px' : '0px'
                }}
            />
        </div>
    );
};

export default AvatarWithFrame;