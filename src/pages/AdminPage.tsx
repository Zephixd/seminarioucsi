import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  ShieldCheck,
  Users,
  Download,
  FileJson,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  LogOut,
  Search,
  RefreshCw,
  AlertCircle,
  Pencil,
  Trash2,
  X,
  Save,
} from 'lucide-react';
import { supabase, type Registration } from '../lib/supabase';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('sti_admin_logged') === 'true';
  });

  const [password, setPassword] = useState('');
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [search, setSearch] = useState('');

  // Edit modal
  const [editingItem, setEditingItem] = useState<Registration | null>(null);
  const [editForm, setEditForm] = useState({ nombre: '', apellido: '', cedula: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  // Delete modal
  const [deletingItem, setDeletingItem] = useState<Registration | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const presentes = useMemo(() => {
    return registrations.filter((item) => item.presente);
  }, [registrations]);

  const filteredRegistrations = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return registrations;
    return registrations.filter((item) => {
      return (
        item.nombre.toLowerCase().includes(term) ||
        item.apellido.toLowerCase().includes(term) ||
        item.cedula.toLowerCase().includes(term)
      );
    });
  }, [registrations, search]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('sti_admin_logged', 'true');
      setIsLoggedIn(true);
      setPassword('');
      return;
    }
    setErrorMessage('Contraseña incorrecta.');
  };

  const handleLogout = () => {
    localStorage.removeItem('sti_admin_logged');
    setIsLoggedIn(false);
  };

  const fetchRegistrations = async () => {
    setStatus('loading');
    setErrorMessage('');
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      setStatus('error');
      setErrorMessage(error.message);
      return;
    }
    setRegistrations(data || []);
    setStatus('idle');
  };

  const togglePresente = async (registration: Registration) => {
    if (!registration.id) return;
    const newValue = !registration.presente;
    setRegistrations((prev) =>
      prev.map((item) =>
        item.id === registration.id ? { ...item, presente: newValue } : item,
      ),
    );
    const { error } = await supabase
      .from('registrations')
      .update({ presente: newValue })
      .eq('id', registration.id);
    if (error) {
      setErrorMessage(error.message);
      setRegistrations((prev) =>
        prev.map((item) =>
          item.id === registration.id
            ? { ...item, presente: registration.presente }
            : item,
        ),
      );
    }
  };

  const openEdit = (item: Registration) => {
    setEditingItem(item);
    setEditForm({ nombre: item.nombre, apellido: item.apellido, cedula: item.cedula });
    setEditError('');
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.id) return;
    setEditLoading(true);
    setEditError('');
    const { error } = await supabase
      .from('registrations')
      .update({ nombre: editForm.nombre, apellido: editForm.apellido, cedula: editForm.cedula })
      .eq('id', editingItem.id);
    setEditLoading(false);
    if (error) {
      setEditError(error.message);
      return;
    }
    setRegistrations((prev) =>
      prev.map((item) =>
        item.id === editingItem.id ? { ...item, ...editForm } : item,
      ),
    );
    setEditingItem(null);
  };

  const handleDelete = async () => {
    if (!deletingItem?.id) return;
    setDeleteLoading(true);
    const { error } = await supabase
      .from('registrations')
      .delete()
      .eq('id', deletingItem.id);
    setDeleteLoading(false);
    if (error) {
      setErrorMessage(error.message);
      setDeletingItem(null);
      return;
    }
    setRegistrations((prev) => prev.filter((item) => item.id !== deletingItem.id));
    setDeletingItem(null);
  };

  const downloadFile = (filename: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportJson = () => {
    downloadFile('presentes-sti2026.json', JSON.stringify(presentes, null, 2), 'application/json;charset=utf-8');
  };

  const exportCsv = () => {
    const headers = ['nombre', 'apellido', 'cedula', 'created_at'];
    const rows = presentes.map((item) =>
      headers.map((key) => `"${String((item as any)[key] ?? '').replace(/"/g, '""')}"`).join(','),
    );
    downloadFile('presentes-sti2026.csv', [headers.join(','), ...rows].join('\n'), 'text/csv;charset=utf-8');
  };

  useEffect(() => {
    if (isLoggedIn) fetchRegistrations();
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-surface font-sans text-white overflow-hidden flex items-center justify-center px-6">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand opacity-[0.05] blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-secondary opacity-[0.05] blur-[120px]" />
          <div className="absolute inset-0 bg-grid-white/[0.02]" />
        </div>
        <motion.form
          onSubmit={handleLogin}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md glass-card rounded-lg p-8 neon-glow"
        >
          <div className="w-16 h-16 bg-brand/20 rounded-full border border-brand/30 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-brand" />
          </div>
          <h1 className="text-3xl font-display font-black uppercase tracking-tight text-center mb-3">Panel Admin</h1>
          <p className="text-white/50 text-center mb-8">Acceso administrativo para controlar los registros del seminario.</p>
          <label className="text-[10px] font-display font-bold uppercase tracking-widest text-white/40 ml-1">Contraseña</label>
          <input
            required
            type="password"
            placeholder="Ingrese la contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/20 transition-all font-sans font-medium placeholder:text-white/10"
          />
          {errorMessage && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-red-500 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{errorMessage}</p>
            </div>
          )}
          <button type="submit" className="mt-6 w-full bg-brand text-black font-display font-black p-4 uppercase tracking-widest neon-glow">
            Ingresar
          </button>
        </motion.form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface font-sans text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand opacity-[0.05] blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-secondary opacity-[0.05] blur-[120px]" />
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setEditingItem(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="glass-card rounded-lg p-8 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-black uppercase tracking-tight">Editar registro</h2>
                <button onClick={() => setEditingItem(null)} className="text-white/40 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleEdit} className="flex flex-col gap-4">
                <div>
                  <label className="text-[10px] font-display font-bold uppercase tracking-widest text-white/40 ml-1">Nombre</label>
                  <input
                    required
                    type="text"
                    value={editForm.nombre}
                    onChange={(e) => setEditForm((f) => ({ ...f, nombre: e.target.value }))}
                    className="mt-2 w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/20 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-display font-bold uppercase tracking-widest text-white/40 ml-1">Apellido</label>
                  <input
                    required
                    type="text"
                    value={editForm.apellido}
                    onChange={(e) => setEditForm((f) => ({ ...f, apellido: e.target.value }))}
                    className="mt-2 w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/20 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-display font-bold uppercase tracking-widest text-white/40 ml-1">Cedula</label>
                  <input
                    required
                    type="text"
                    value={editForm.cedula}
                    onChange={(e) => setEditForm((f) => ({ ...f, cedula: e.target.value }))}
                    className="mt-2 w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/20 transition-all"
                  />
                </div>
                {editError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>{editError}</p>
                  </div>
                )}
                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="flex-1 px-4 py-3 border border-white/10 text-white/60 hover:text-white rounded-lg font-display text-xs uppercase tracking-widest transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-brand text-black rounded-lg font-display font-black text-xs uppercase tracking-widest disabled:opacity-50 transition-opacity"
                  >
                    <Save className="w-4 h-4" />
                    {editLoading ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {deletingItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setDeletingItem(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="glass-card rounded-lg p-8 w-full max-w-sm"
            >
              <div className="w-14 h-14 bg-red-500/10 rounded-full border border-red-500/20 flex items-center justify-center mx-auto mb-5">
                <Trash2 className="w-7 h-7 text-red-400" />
              </div>
              <h2 className="text-xl font-display font-black uppercase tracking-tight text-center mb-2">Eliminar registro</h2>
              <p className="text-white/50 text-center text-sm mb-6">
                ¿Estas seguro que deseas eliminar el registro de{' '}
                <span className="text-white font-bold">{deletingItem.nombre} {deletingItem.apellido}</span>?
                Esta accion no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeletingItem(null)}
                  className="flex-1 px-4 py-3 border border-white/10 text-white/60 hover:text-white rounded-lg font-display text-xs uppercase tracking-widest transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 rounded-lg font-display font-black text-xs uppercase tracking-widest disabled:opacity-50 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  {deleteLoading ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="relative z-10 px-6 py-8 flex justify-between items-center max-w-7xl mx-auto">
        <a href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand rounded flex items-center justify-center border border-white/10 neon-glow">
            <ShieldCheck className="w-6 h-6 text-black" />
          </div>
          <span className="font-display text-2xl font-bold tracking-tighter neon-text">
            ADMIN<span className="text-brand"> STI2026</span>
          </span>
        </a>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-5 py-2 border border-white/10 text-white/60 hover:text-brand hover:border-brand/40 font-display font-bold text-xs uppercase tracking-widest transition-colors"
        >
          Salir
          <LogOut className="w-4 h-4" />
        </button>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-32">
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-brand/10 border border-brand/20 text-[10px] font-display font-bold uppercase tracking-[0.2em] text-brand mb-4">
            <Users className="w-3 h-3" />
            Registros administrativos
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight mb-4 uppercase">Lista de registros</h1>
          <p className="text-white/50 max-w-2xl">Marca los asistentes como presente o ausente, edita o elimina registros, y exporta los presentes.</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard title="Total registros" value={registrations.length} />
          <StatCard title="Presentes" value={presentes.length} />
          <StatCard title="Ausentes" value={registrations.length - presentes.length} />
        </section>

        <section className="glass-card rounded-lg p-4 md:p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Buscar por nombre, apellido o cedula"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-4 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/20 transition-all placeholder:text-white/20"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchRegistrations}
                className="px-4 py-3 border border-white/10 hover:border-brand/40 text-white/70 hover:text-brand rounded-lg flex items-center gap-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Actualizar
              </button>
              <button
                onClick={exportJson}
                className="px-4 py-3 bg-white/5 border border-white/10 hover:border-brand/40 text-white/70 hover:text-brand rounded-lg flex items-center gap-2 transition-colors"
              >
                <FileJson className="w-4 h-4" />
                JSON
              </button>
              <button
                onClick={exportCsv}
                className="px-4 py-3 bg-white/5 border border-white/10 hover:border-brand/40 text-white/70 hover:text-brand rounded-lg flex items-center gap-2 transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4" />
                CSV
              </button>
            </div>
          </div>
        </section>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-red-500 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{errorMessage}</p>
          </div>
        )}

        <section className="glass-card rounded-lg overflow-hidden">
          {status === 'loading' ? (
            <div className="p-10 text-center text-white/50">Cargando registros...</div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="p-10 text-center text-white/50">No hay registros para mostrar.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-white/5 text-white/40 uppercase font-display text-[10px] tracking-widest">
                  <tr>
                    <th className="text-left p-4">Nombre</th>
                    <th className="text-left p-4">Cedula</th>
                    <th className="text-left p-4">Estado</th>
                    <th className="text-right p-4">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistrations.map((item) => (
                    <tr key={item.id} className="border-t border-white/10 hover:bg-white/[0.03] transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white">{item.nombre} {item.apellido}</div>
                        <div className="text-white/30 text-xs">
                          {item.created_at ? new Date(item.created_at).toLocaleString() : 'Sin fecha'}
                        </div>
                      </td>
                      <td className="p-4 text-white/70">{item.cedula}</td>
                      <td className="p-4">
                        {item.presente ? (
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                            <CheckCircle2 className="w-4 h-4" />
                            Presente
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                            <XCircle className="w-4 h-4" />
                            Ausente
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => togglePresente(item)}
                            className={`px-3 py-2 rounded-lg font-display text-xs uppercase tracking-widest transition-all ${
                              item.presente
                                ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                                : 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20'
                            }`}
                          >
                            {item.presente ? 'Marcar ausente' : 'Marcar presente'}
                          </button>
                          <button
                            onClick={() => openEdit(item)}
                            title="Editar registro"
                            className="p-2 rounded-lg border border-white/10 text-white/40 hover:text-brand hover:border-brand/40 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingItem(item)}
                            title="Eliminar registro"
                            className="p-2 rounded-lg border border-white/10 text-white/40 hover:text-red-400 hover:border-red-500/40 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
}

function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="glass-card rounded-lg p-6">
      <p className="text-white/40 text-[10px] font-display uppercase tracking-widest mb-2">{title}</p>
      <p className="text-4xl font-display font-black text-brand neon-text">{value}</p>
    </div>
  );
}
