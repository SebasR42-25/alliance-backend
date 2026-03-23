'use client';
import { useEffect, useState, useRef, ChangeEvent } from 'react';
import { apiClient } from '@/core/api/api.client';
import { User } from '@/types/user.types';
import { userService } from '@/core/services/user.service';
import { Camera, Save, Tag, Loader2 } from 'lucide-react';

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    // Referencia para el input de archivos oculto
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await apiClient.get<User>('/users/me');
                setUser(data);
            } catch (error) {
                console.error("Error al cargar perfil", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    // Lógica para subir la imagen a Cloudinary a través del Backend
    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            // Usamos el servicio de usuario que creamos
            const updatedUser = await userService.uploadAvatar(file);
            setUser(updatedUser);
            alert('¡Imagen subida a Cloudinary con éxito!');
        } catch (error) {
            console.error("Error al subir imagen", error);
            alert('Error al subir la imagen. Verifica el formato.');
        } finally {
            setUploading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        try {
            await apiClient.patch('/users/me', {
                bio: user.bio,
                skills: user.skills
            });
            alert('Perfil actualizado correctamente');
        } catch (error) {
            alert('Error al actualizar');
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="animate-spin text-blue-500" size={40} />
            <p className="text-slate-400 font-medium">Cargando perfil de ingeniero...</p>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                {/* Banner Decorativo */}
                <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-700 to-slate-900"></div>

                <div className="px-8 pb-8">
                    <div className="relative -mt-16 mb-6 flex justify-between items-end">
                        <div className="relative group">
                            <div className={`w-32 h-32 bg-slate-800 rounded-2xl border-4 border-slate-900 overflow-hidden shadow-xl transition-all ${uploading ? 'opacity-50' : 'group-hover:ring-4 ring-blue-500/30'}`}>
                                {user?.profilePicture ? (
                                    <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold bg-blue-600 text-white">
                                        {user?.name.charAt(0)}
                                    </div>
                                )}
                                {uploading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                        <Loader2 className="animate-spin text-white" />
                                    </div>
                                )}
                            </div>

                            {/* Input de archivo oculto */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="absolute bottom-2 right-2 p-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-all shadow-lg active:scale-90 disabled:bg-slate-600"
                            >
                                <Camera size={18} className="text-white" />
                            </button>
                        </div>

                        <button
                            onClick={handleUpdateProfile}
                            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-6 py-2 rounded-xl font-bold transition-all shadow-lg shadow-green-900/20 active:scale-95"
                        >
                            <Save size={18} />
                            <span>Guardar Cambios</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <h1 className="text-3xl font-bold text-white">{user?.name}</h1>
                                <p className="text-blue-400 font-medium">Ingeniería de Sistemas - Javeriana Cali</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Biografía Técnica</label>
                                <textarea
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-sm focus:border-blue-500 outline-none h-32 text-slate-200 transition-colors"
                                    value={user?.bio || ''}
                                    onChange={(e) => setUser(user ? {...user, bio: e.target.value} : null)}
                                    placeholder="Describe tu stack tecnológico y experiencia..."
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6">
                                <h3 className="font-bold mb-4 flex items-center text-slate-100">
                                    <Tag size={18} className="mr-2 text-blue-500" />
                                    Habilidades (Stack)
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {user?.skills && user.skills.length > 0 ? (
                                        user.skills.map(skill => (
                                            <span key={skill} className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-bold">
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-500 italic">No has añadido habilidades aún.</p>
                                    )}
                                    <button className="px-3 py-1 border border-dashed border-slate-600 text-slate-500 rounded-lg text-xs hover:border-slate-400 hover:text-slate-400 transition-all">
                                        + Gestionar Skills
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}