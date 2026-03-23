'use client';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message } from '@/types/chat.types';

export const useChat = (userId: string | null) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        if (!userId) return;

        const newSocket = io('http://localhost:3000/chat', {
            transports: ['websocket'],
            query: { userId } // Pasamos el ID para que el backend nos identifique
        });

        newSocket.on('receiveMessage', (message: Message) => {
            setMessages((prev) => [...prev, message]);
        });

        setSocket(newSocket);

        return () => { newSocket.close(); };
    }, [userId]);

    const sendMessage = (receiverId: string, content: string) => {
        if (socket) {
            socket.emit('sendMessage', { receiverId, content });
        }
    };

    return { messages, sendMessage, setMessages };
};