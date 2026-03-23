'use client';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (userId: string | undefined) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        // Si no hay ID de usuario, no intentamos conectar
        if (!userId) return;

        // Creamos la conexión al namespace de notificaciones
        const newSocket = io('http://localhost:3000/notifications', {
            transports: ['websocket'],
            autoConnect: true
        });

        // Escuchamos cuando la conexión esté lista para guardar el estado y unirnos a la sala
        newSocket.on('connect', () => {
            console.log('✅ Conectado al servidor de notificaciones');
            newSocket.emit('joinNotifications', userId); //
            setSocket(newSocket);
        });

        // Limpieza al desmontar el componente
        return () => {
            if (newSocket) {
                newSocket.off('connect');
                newSocket.disconnect();
            }
        };
    }, [userId]);

    return socket;
};