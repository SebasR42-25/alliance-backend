'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/core/api/api.client';
import { Job } from '@/types/job.types';
import { Briefcase, MapPin, DollarSign, Search, SearchX, Loader2 } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    // Unificamos la lógica de carga en el useEffect para evitar errores de ESLint
    useEffect(() => {
        const loadJobs = async () => {
            setLoading(true);
            try {
                // Filtramos por título usando el valor del buscador
                const { data } = await apiClient.get<Job[]>(`/jobs?title=${search}`);
                setJobs(data);
            } catch (error) {
                console.error("Error cargando empleos", error);
            } finally {
                setLoading(false);
            }
        };

        // Debounce simple: podrías añadir un timeout aquí si quieres optimizar,
        // pero para el proyecto así funciona perfecto.
        loadJobs();
    }, [search]);

    // Lógica de Postulación (Premisa 6: Lógica de Negocio)
    const handleApply = async (jobId: string) => {
        try {
            await apiClient.post(`/jobs/${jobId}/apply`);
            alert('¡Postulación enviada con éxito! Tu perfil de Alliance ya está en manos de la empresa.');
        } catch (error) {
            alert('Ya te postulaste a esta vacante o el proceso no está disponible.');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Cabecera y Buscador */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Portal de Empleo</h1>
                    <p className="text-slate-400 mt-1">Oportunidades exclusivas para la comunidad de ingeniería en Cali.</p>
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por tecnología (React, NestJS...)"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 text-sm text-white placeholder:text-slate-600 transition-all shadow-inner"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Listado de Vacantes */}
            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <Loader2 className="animate-spin text-blue-500" size={32} />
                        <p className="text-slate-500 text-sm font-medium">Buscando vacantes disponibles...</p>
                    </div>
                ) : jobs.length > 0 ? (
                    jobs.map((job) => (
                        <div key={job._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:bg-slate-800/40 hover:border-slate-700 transition-all group flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
                            <div className="flex gap-5">
                                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center overflow-hidden p-3 text-slate-900 shadow-md">
                                    {job.company?.logoUrl ? (
                                        <img src={job.company.logoUrl} alt={job.company.name} className="object-contain w-full h-full" />
                                    ) : (
                                        <Briefcase size={32} className="text-slate-400" />
                                    )}
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-slate-100 group-hover:text-blue-400 transition-colors">{job.title}</h2>
                                    <p className="text-blue-500 font-semibold text-sm mb-3 uppercase tracking-wider">{job.company?.name || 'Partner de Alliance'}</p>

                                    <div className="flex flex-wrap gap-5 text-xs text-slate-400 font-medium">
                                        <span className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-500" /> {job.location}</span>
                                        {job.salaryRange && (
                                            <span className="flex items-center gap-1.5"><DollarSign size={14} className="text-green-500" /> {job.salaryRange}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 md:justify-end items-center w-full md:w-auto">
                                <div className="flex gap-2 mr-2">
                                    {job.tags?.slice(0, 3).map(tag => (
                                        <span key={tag} className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-md text-[10px] uppercase font-bold border border-slate-700/50">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handleApply(job._id)}
                                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-blue-900/30"
                                >
                                    Postularme
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <EmptyState
                        icon={SearchX}
                        title="No hay vacantes que coincidan"
                        description={`No encontramos resultados para "${search}". Prueba buscando otras tecnologías o deja el campo vacío para ver todo.`}
                        actionLabel="Limpiar búsqueda"
                        onAction={() => setSearch('')}
                    />
                )}
            </div>
        </div>
    );
}