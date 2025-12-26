// WebSocketContext.tsx
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';

interface WebSocketContextType {
    notifications: any[];
    unreadCount: number;
    setUnreadCount: (count: number) => void;
    markAllAsRead: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const clientRef = useRef<Client | null>(null);
    const token = localStorage.getItem('token'); 

    useEffect(() => {
        const fetchHistory = async () => {
            if (!token) return;
            try {
                const response = await axios.get('http://localhost:8080/api/notifications', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                console.log(">>> [API HISTORY]", response.data);
                
                const list = Array.isArray(response.data) ? response.data : [];
                setNotifications(list);
                
                const unread = list.filter((n: any) => !n.isRead).length;
                setUnreadCount(unread);
            } catch (error) {
                console.error("Lỗi fetch notification:", error);
            }
        };
        fetchHistory();
    }, [token]);

    useEffect(() => {
        if (!token) return;
        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'), 
            connectHeaders: { Authorization: `Bearer ${token}` },
            reconnectDelay: 5000,
            onConnect: () => {
                client.subscribe('/user/queue/notifications', (message) => {
                    if (message.body) {
                        const newNoti = JSON.parse(message.body);
                        setNotifications((prev) => [newNoti, ...prev]);
                        setUnreadCount((prev) => prev + 1);
                    }
                });
            }
        });
        client.activate();
        clientRef.current = client;
        return () => { if (clientRef.current) clientRef.current.deactivate(); };
    }, [token]);

    const markAllAsRead = () => {
        setUnreadCount(0);
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    return (
        <WebSocketContext.Provider value={{ notifications, unreadCount, setUnreadCount, markAllAsRead }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext)!;