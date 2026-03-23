'use client';
import { useState } from 'react';
import { authService } from '@/core/services/auth.service';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await authService.login({ email, password });
            // Guardamos el token para que el interceptor de Axios lo use
            localStorage.setItem('auth_token', data.access_token);
            alert('¡Bienvenido a Alliance!');
            router.push('/feed'); // Redirigir al muro principal
        } catch (error) {
            alert('Error al iniciar sesión. Revisa tus credenciales.');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <form onSubmit={handleLogin} className="w-full max-w-md space-y-6 rounded-xl bg-slate-900 p-8 shadow-2xl border border-slate-800">
                <h1 className="text-3xl font-bold text-center text-blue-500">Alliance</h1>
                <p className="text-center text-slate-400">Red social para ingenieros</p>

                <input
                    type="email"
                    placeholder="Correo Javeriana"
                    className="w-full p-3 rounded bg-slate-800 border border-slate-700 focus:outline-none focus:border-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Contraseña"
                    className="w-full p-3 rounded bg-slate-800 border border-slate-700 focus:outline-none focus:border-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit" className="w-full py-3 font-bold bg-blue-600 hover:bg-blue-700 rounded transition-colors">
                    Iniciar Sesión
                </button>
            </form>
        </div>
    );
}