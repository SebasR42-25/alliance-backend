'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSocket } from '@/hooks/useSocket';
import { Bell, Home, User, Briefcase, MessageSquare } from 'lucide-react';

// 1. Definimos la interfaz para cumplir con el tipado (Premisa 3)
interface NotificationPayload {
    type: string;
    message: string;
    payload?: {
        senderId?: string;
        senderName?: string;
        jobId?: string;
    };
}

const navItems = [
    { name: 'Feed', href: '/feed', icon: Home },
    { name: 'Networking', href: '/network', icon: User },
    { name: 'Empleos', href: '/jobs', icon: Briefcase },
    { name: 'Mensajes', href: '/chat', icon: MessageSquare },
];

export default function Navbar() {
    const pathname = usePathname();
    const [hasNotifications, setHasNotifications] = useState(false);
    // 2. Usamos la interfaz en el estado para evitar el error de 'any'
    const [notifications, setNotifications] = useState<NotificationPayload[]>([]);

    // Obtenemos el ID del usuario logueado
    const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null;
    const socket = useSocket(userId || '');

    useEffect(() => {
        if (!socket) return;

        // 3. Escuchamos el evento de tiempo real (Premisa 6)
        socket.on('newNotification', (data: NotificationPayload) => {
            console.log('¡Nueva notificación!', data);
            setNotifications((prev) => [data, ...prev]);
            setHasNotifications(true);

            // Feedback visual inmediato
            alert(`Alliance: ${data.message}`);
        });

        return () => {
            socket.off('newNotification');
        };
    }, [socket]);

    return (
        <nav className="fixed top-0 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-md z-50">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/feed" className="text-2xl font-bold text-blue-500 tracking-tighter">
                    ALLIANCE
                </Link>

                {/* Links de Navegación */}
                <div className="hidden md:flex space-x-8">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center space-x-2 transition-colors ${
                                    isActive ? 'text-blue-500' : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                <Icon size={20} />
                                <span className="text-sm font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Icono de Notificaciones con Punto Rojo */}
                <div className="flex items-center space-x-4">
                    <div
                        className="relative cursor-pointer p-2 text-slate-400 hover:text-white transition-all"
                        onClick={() => setHasNotifications(false)}
                    >
                        <Bell size={22} className={hasNotifications ? 'text-blue-500 animate-pulse' : ''} />
                        {hasNotifications && (
                            <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900"></span>
                        )}
                    </div>

                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs">
                        DC
                    </div>
                </div>
            </div>
        </nav>
    );
}