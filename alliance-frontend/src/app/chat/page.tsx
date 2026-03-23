'use client';
import { useState, useEffect, FormEvent } from 'react';
import { useChat } from '@/hooks/useChat';
import { apiClient } from '@/core/api/api.client';
import { Message } from '@/types/chat.types';
import { User } from '@/types/user.types'; // Importamos la interfaz de Usuario
import {MessageSquare, Send} from 'lucide-react';

export default function ChatPage() {
    // Definimos los estados con sus tipos correspondientes
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [contacts, setContacts] = useState<User[]>([]);
    const [input, setInput] = useState<string>('');

    // Obtenemos mi ID desde el localStorage
    const myId = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null;
    const { messages, sendMessage, setMessages } = useChat(myId);

    // 1. Cargar contactos (Conexiones aceptadas)
    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const { data } = await apiClient.get<User[]>('/users/connections');
                setContacts(data);
            } catch (error) {
                console.error("Error al cargar contactos", error);
            }
        };
        fetchContacts();
    }, []);

    // 2. Cargar historial al seleccionar un contacto
    useEffect(() => {
        if (selectedUser) {
            apiClient.get<Message[]>(`/chat/history/${selectedUser._id}`)
                .then(({ data }) => {
                    setMessages(data);
                })
                .catch(err => console.error("Error de historial", err));
        }
    }, [selectedUser, setMessages]);

    const handleSend = (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !selectedUser) return;

        sendMessage(selectedUser._id, input);
        setInput('');
    };

    return (
        <div className="flex h-[calc(100vh-160px)] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* Sidebar de Contactos */}
            <div className="w-1/3 border-r border-slate-800 flex flex-col bg-slate-900/50">
                <div className="p-4 border-b border-slate-800 font-bold text-blue-500">
                    Mensajes Directos
                </div>
                <div className="overflow-y-auto flex-1">
                    {contacts.length > 0 ? (
                        contacts.map((contact) => (
                            <div
                                key={contact._id}
                                onClick={() => setSelectedUser(contact)}
                                className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-slate-800/50 transition-all ${
                                    selectedUser?._id === contact._id ? 'bg-slate-800 border-l-4 border-blue-500' : ''
                                }`}
                            >
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center font-bold text-white shadow-md">
                                    {contact.profilePicture ? (
                                        <img src={contact.profilePicture} alt={contact.name} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        contact.name.charAt(0)
                                    )}
                                </div>
                                <div className="text-sm font-semibold text-slate-200">{contact.name}</div>
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-xs text-slate-500 text-center">No tienes conexiones aún.</div>
                    )}
                </div>
            </div>

            {/* Ventana de Chat */}
            <div className="flex-1 flex flex-col bg-slate-950/20">
                {selectedUser ? (
                    <>
                        <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                <span className="font-bold text-slate-100">{selectedUser.name}</span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg._id}
                                    className={`flex ${msg.sender._id === myId ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[75%] p-3 px-4 rounded-2xl text-sm shadow-sm ${
                                        msg.sender._id === myId
                                            ? 'bg-blue-600 text-white rounded-tr-none'
                                            : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                                    }`}>
                                        {msg.content}
                                        <div className={`text-[10px] mt-1 opacity-50 ${msg.sender._id === myId ? 'text-right' : 'text-left'}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleSend} className="p-4 bg-slate-900/50 border-t border-slate-800 flex space-x-2">
                            <input
                                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 outline-none focus:border-blue-500 text-white placeholder:text-slate-500 transition-all"
                                placeholder="Escribe un mensaje..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-900/40"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-4">
                        <div className="p-6 bg-slate-900 rounded-full border border-slate-800">
                            <MessageSquare size={48} className="text-slate-700" />
                        </div>
                        <p className="font-medium text-slate-400">Selecciona un ingeniero para iniciar la conversación</p>
                    </div>
                )}
            </div>
        </div>
    );
}