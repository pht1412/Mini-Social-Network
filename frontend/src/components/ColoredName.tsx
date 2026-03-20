import React from 'react';
import '../assets/css/AvatarFrames.css'; // Mượn luôn file CSS của viền Avatar để chứa code màu tên

interface ColoredNameProps {
    name?: string | null;
    colorClass?: string | null;
}

const ColoredName: React.FC<ColoredNameProps> = ({ name, colorClass }) => {
    if (!name) return null;

    // Nếu user có mua màu, thẻ <span> sẽ nhận class màu. Nếu không, nó là text bình thường.
    if (colorClass) {
        return <span className={colorClass}>{name}</span>;
    }

    return <span>{name}</span>;
};

export default ColoredName;