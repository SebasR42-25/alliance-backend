'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/core/api/api.client';
import { Post } from '@/types/post.types';
import { Newspaper, Send, Image as ImageIcon } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';

export default function FeedPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data } = await apiClient.get<Post[]>('/posts');
                setPosts(data);
            } catch (error) {
                console.error("Error cargando el feed", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPostContent.trim()) return;

        try {
            const { data } = await apiClient.post<Post>('/posts', {
                content: newPostContent
            });
            setPosts([data, ...posts]);
            setNewPostContent('');
        } catch (error) {
            alert('No se pudo publicar el post.');
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Columna Izquierda: Perfil Mini */}
            <div className="hidden md:block">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sticky top-24">
                    <div className="w-16 h-16 bg-blue-600 rounded-full mb-4 mx-auto flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-blue-900/20">
                        DC
                    </div>
                    <h2 className="text-center font-bold text-white">Derik Camilo Muñoz</h2>
                    <p className="text-center text-xs text-slate-400">Ingeniería de Sistemas - Javeriana</p>
                </div>
            </div>

            {/* Columna Central: Feed */}
            <div className="md:col-span-2 space-y-6">
                {/* Caja de Creación */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
                    <form onSubmit={handleCreatePost}>
                        <textarea
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-sm focus:outline-none focus:border-blue-500 transition-all resize-none text-slate-200"
                            placeholder="¿En qué proyecto de ingeniería trabajas hoy?"
                            rows={3}
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                        />
                        <div className="flex justify-between items-center mt-3">
                            <button type="button" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 text-xs font-medium">
                                <ImageIcon size={18} /> Añadir imagen
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 active:scale-95"
                            >
                                <Send size={16} /> Publicar
                            </button>
                        </div>
                    </form>
                </div>

                {/* Listado con Empty State */}
                {loading ? (
                    <div className="text-center py-10 text-slate-500 animate-pulse font-medium">Sincronizando feed...</div>
                ) : posts.length > 0 ? (
                    <div className="space-y-6">
                        {posts.map((post) => (
                            <div key={post._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-10 h-10 bg-slate-800 rounded-full overflow-hidden flex items-center justify-center border border-slate-700">
                                        {post.author?.profilePicture ? (
                                            <img src={post.author.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-xs font-bold text-slate-500">{post.author?.name.charAt(0)}</span>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-slate-100">{post.author?.name || 'Ingeniero Alliance'}</p>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Cali, Colombia</p>
                                    </div>
                                </div>
                                <p className="text-slate-300 text-sm leading-relaxed">{post.content}</p>
                                {post.imageUrl && (
                                    <img src={post.imageUrl} className="mt-4 rounded-xl w-full object-cover max-h-80 border border-slate-800" alt="Post content" />
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={Newspaper}
                        title="Tu feed está vacío"
                        description="Sé el primero de tu red en publicar un avance técnico o una noticia de ingeniería."
                        actionLabel="Empezar a escribir"
                        onAction={() => document.querySelector('textarea')?.focus()}
                    />
                )}
            </div>
        </div>
    );
}