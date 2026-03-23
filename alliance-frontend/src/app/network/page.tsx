'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/core/api/api.client';
import { User } from '@/types/user.types';
import { UserPlus, Check, MapPin, Users2 } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';

export default function NetworkPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [sentRequests, setSentRequests] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await apiClient.get<User[]>('/users/network/suggested');
                setUsers(data);
            } catch (error) {
                console.error("Error cargando red", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleConnect = async (targetUserId: string) => {
        try {
            await apiClient.post(`/users/connect/${targetUserId}`);
            setSentRequests([...sentRequests, targetUserId]);
        } catch (error) {
            alert('Error al enviar solicitud de conexión.');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="border-b border-slate-800 pb-6">
                <h1 className="text-3xl font-bold text-white tracking-tight">Networking</h1>
                <p className="text-slate-400 mt-2">Expande tu red con ingenieros de la Pontificia Universidad Javeriana Cali.</p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-slate-900/50 border border-slate-800 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : users.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.map((user) => (
                        <div key={user._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 hover:bg-slate-800/30 transition-all group relative overflow-hidden">
                            <div className="flex flex-col items-center text-center relative z-10">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full mb-4 flex items-center justify-center text-2xl font-bold text-white shadow-xl group-hover:scale-105 transition-transform">
                                    {user.profilePicture ? (
                                        <img src={user.profilePicture} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        user.name.charAt(0)
                                    )}
                                </div>

                                <h2 className="text-lg font-bold text-slate-100">{user.name}</h2>
                                <div className="flex items-center text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-3">
                                    <MapPin size={12} className="mr-1 text-blue-500" />
                                    {user.location || 'Cali, Colombia'}
                                </div>

                                <p className="text-sm text-slate-400 line-clamp-2 mb-4 h-10 leading-relaxed">
                                    {user.bio || 'Ingeniero de Sistemas enfocado en soluciones innovadoras.'}
                                </p>

                                <div className="flex flex-wrap justify-center gap-1 mb-6">
                                    {user.skills?.slice(0, 3).map((skill) => (
                                        <span key={skill} className="text-[10px] bg-slate-800 text-blue-400 px-2 py-0.5 rounded-md border border-slate-700 font-bold">
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handleConnect(user._id)}
                                    disabled={sentRequests.includes(user._id)}
                                    className={`w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                                        sentRequests.includes(user._id)
                                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20 active:scale-95'
                                    }`}
                                >
                                    {sentRequests.includes(user._id) ? (
                                        <><Check size={16} /> Conexión Enviada</>
                                    ) : (
                                        <><UserPlus size={16} /> Conectar</>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={Users2}
                    title="No hay sugerencias nuevas"
                    description="Parece que ya estás conectado con todos los ingenieros disponibles por ahora."
                />
            )}
        </div>
    );
}