import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import axiosClient from '../../api/axiosClient';
import type { User } from '../../types';
import { useChat } from '../../context/ChatContext';
import './ChatBox.css';

// 🔴 IMPORT COMPONENT AVATAR MA THUẬT
import AvatarWithFrame from '../AvatarWithFrame';
import ColoredName from '../ColoredName'; // (Sửa đường dẫn cho đúng từng file)

interface Message {
  id?: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp?: string;
}

interface Props {
  currentUser: User;
}

const ChatBox: React.FC<Props> = ({ currentUser }) => {
  const { chatTarget, closeChat, isMinimized, setIsMinimized } = useChat();
  const targetUser = chatTarget;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const stompClientRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* ================= MAP MESSAGE ================= */
  const mapMessage = (data: any): Message => ({
    id: data.id,
    content: data.content,
    timestamp: data.timestamp || data.createdAt,
    senderId: data.senderId || data.sender?.id,
    receiverId: data.receiverId || data.receiver?.id
  });

  /* ================= LOAD HISTORY ================= */
  useEffect(() => {
    if (!targetUser) return;

    setMessages([]);
    axiosClient
      .get(`/messages/${currentUser.id}/${targetUser.id}`)
      .then(res => setMessages(res.data.map(mapMessage)))
      .catch(console.error);
  }, [currentUser.id, targetUser]);

  /* ================= WEBSOCKET ================= */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!targetUser || !token) return;

    const socket = new SockJS('http://localhost:8080/ws');
    const client = Stomp.over(socket);
    client.debug = () => {};

    client.connect(
      { Authorization: `Bearer ${token}` },
      () => {
        client.subscribe('/user/queue/messages', payload => {
          const newMsg = mapMessage(JSON.parse(payload.body));
          setMessages(prev => [...prev, newMsg]);
        });
      }
    );

    stompClientRef.current = client;
    return () => client.disconnect();
  }, [currentUser.id, targetUser]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isMinimized]);

  /* ================= SEND MESSAGE ================= */
  const sendMessage = () => {
    if (!input.trim() || !stompClientRef.current || !targetUser) return;

    stompClientRef.current.send(
      '/app/chat',
      {},
      JSON.stringify({
        senderId: currentUser.id,
        receiverId: targetUser.id,
        content: input
      })
    );
    setInput('');
  };

  /* ================= GUARD ================= */
  if (!targetUser) return null;

  /* ================= MINIMIZED ================= */
  if (isMinimized) {
    return (
      <div
        className="chat-bubble-container"
        onClick={() => setIsMinimized(false)}
      >
        {/* 🔴 AVATAR KHI THU NHỎ (Bong bóng chat) */}
        <AvatarWithFrame 
          src={targetUser.avatarUrl || `https://ui-avatars.com/api/?name=${targetUser.fullName}`}
          frameClass={(targetUser as any).currentAvatarFrame}
          size={56} // Vừa khít với .chat-bubble-container
        />
        <div
          className="chat-bubble-close"
          onClick={(e) => {
            e.stopPropagation();
            closeChat();
          }}
        >
          ✖
        </div>
      </div>
    );
  }

  /* ================= FULL CHAT ================= */
  return (
    <div className="fb-chat-container">

      {/* ===== HEADER ===== */}
      <div className="fb-chat-header">
        <div className="fb-chat-user">
          <div style={{ position: 'relative' }}>
            {/* 🔴 AVATAR KHI MỞ KHUNG CHAT */}
            <AvatarWithFrame 
              src={targetUser.avatarUrl || `https://ui-avatars.com/api/?name=${targetUser.fullName}`}
              frameClass={(targetUser as any).currentAvatarFrame}
              size={36} // Vừa khít với .fb-chat-avatar
            />
            <span className="fb-online-dot" />
          </div>
          <div>
<div className="fb-chat-name">
    <ColoredName name={targetUser.fullName} colorClass={(targetUser as any).currentNameColor} />
</div>            <div className="fb-chat-status">Đang hoạt động</div>
          </div>
        </div>

        <div className="fb-chat-actions">
          <i className="fb-icon" onClick={() => setIsMinimized(true)}>─</i>
          <i className="fb-icon" onClick={closeChat}>✖</i>
        </div>
      </div>

      {/* ===== BODY ===== */}
      <div className="fb-chat-body">
        {messages.map((msg, index) => {
          const isMe = msg.senderId === currentUser.id;
          return (
            <div
              key={index}
              className={`fb-message-row ${isMe ? 'fb-my-row' : 'fb-their-row'}`}
            >
              <div
                className={`fb-message-bubble ${
                  isMe ? 'fb-my-bubble' : 'fb-their-bubble'
                }`}
              >
                {msg.content}
                <div className="fb-message-time">
                  {msg.timestamp &&
                    new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* ===== FOOTER ===== */}
      <div className="fb-chat-footer">
        <div className="fb-input-container">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Aa"
            className="fb-chat-input"
          />
        </div>

        <div
          className={`fb-footer-icons-right ${
            stompClientRef.current?.connected ? '' : 'fb-send-disabled'
          }`}
          onClick={sendMessage}
        >
          <i className="fb-send-btn">➤</i>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;