import './globals.css';
import Navbar from '@/components/layout/Navbar';

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es">
        <body className="bg-slate-950 text-slate-50 antialiased">
        <Navbar />
        <main className="pt-20 min-h-screen max-w-6xl mx-auto px-4">
            {children}
        </main>
        </body>
        </html>
    );
}