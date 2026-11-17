import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  IdCard,
  Send,
  CheckCircle2,
  AlertCircle,
  Zap,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

import { supabase, type Registration } from '../lib/supabase';

interface FormData {
  firstName: string;
  lastName: string;
  idNumber: string;
}

export default function RegistrationPage() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    idNumber: '',
  });

  const [status, setStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const registrationData: Registration = {
        nombre: formData.firstName,
        apellido: formData.lastName,
        cedula: formData.idNumber,
      };

      const { error } = await supabase
        .from('registrations')
        .insert([registrationData]);

      if (error) {
        if (error.code === '23505') {
          throw new Error('Esta cedula ya fue registrada anteriormente.');
        }
        throw new Error(error.message);
      }

      setSuccessMessage('Tus datos fueron registrados correctamente.');
      setStatus('success');
      setFormData({ firstName: '', lastName: '', idNumber: '' });
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Ocurrio un error inesperado.',
      );
    }
  };

  return (
    <div className="min-h-screen bg-surface font-sans text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand opacity-[0.05] blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-secondary opacity-[0.05] blur-[120px]" />
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
      </div>

      <nav className="relative z-10 px-6 py-8 flex justify-between items-center max-w-7xl mx-auto">
        <motion.a
          href="/"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-brand rounded flex items-center justify-center border border-white/10 neon-glow">
            <Zap className="w-6 h-6 text-black fill-current" />
          </div>
          <span className="font-display text-2xl font-bold tracking-tighter neon-text">
            STI<span className="text-brand">2026</span>
          </span>
        </motion.a>

        <motion.a
          href="/"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden sm:inline-flex items-center gap-2 px-5 py-2 border border-white/10 text-white/60 hover:text-brand hover:border-brand/40 font-display font-bold text-xs uppercase tracking-widest transition-colors"
        >
          Sitio principal
          <ArrowRight className="w-4 h-4" />
        </motion.a>
      </nav>

      <main className="relative z-10 max-w-2xl mx-auto px-6 pt-16 pb-32">
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-center glass-card p-8 md:p-12 rounded-lg neon-glow"
            >
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-3xl font-display font-bold mb-4 tracking-tight uppercase">
                Registro completado
              </h2>
              <p className="text-white/60 mb-8 max-w-sm mx-auto font-sans">
                {successMessage}
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="text-brand font-display font-bold text-sm uppercase tracking-widest flex items-center gap-2 mx-auto hover:gap-3 transition-all"
              >
                Volver al formulario
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <header className="mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-brand/10 border border-brand/20 text-[10px] font-display font-bold uppercase tracking-[0.2em] text-brand mb-4">
                  <ShieldCheck className="w-3 h-3" />
                  Inscripciones abiertas
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight mb-4 uppercase">
                  Registrate ahora
                  <br />
                  <span className="text-brand neon-text">
                    Seminario Tecnologico Informatico 2026
                  </span>
                </h1>
                <p className="text-white/50 max-w-lg font-sans">
                  Completa tus datos para asegurar tu participacion en el evento tecnologico del anio.
                </p>
              </header>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    icon={<User className="w-4 h-4" />}
                    label="Nombre"
                    name="firstName"
                    placeholder="Ej. Juan"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  <InputField
                    icon={<User className="w-4 h-4" />}
                    label="Apellido"
                    name="lastName"
                    placeholder="Ej. Perez"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>

                <InputField
                  icon={<IdCard className="w-4 h-4" />}
                  label="Numero de cedula"
                  name="idNumber"
                  placeholder="Ej. 1234567"
                  value={formData.idNumber}
                  onChange={handleChange}
                />

                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-red-500 text-sm font-sans"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>{errorMessage}</p>
                  </motion.div>
                )}

                <button
                  disabled={status === 'submitting'}
                  type="submit"
                  className="w-full relative group overflow-hidden bg-brand text-black font-display font-black p-5 uppercase tracking-widest hover:shadow-[0_0_30px_rgba(0,136,255,0.4)] neon-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12 pointer-events-none" />
                  {status === 'submitting' ? (
                    <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      Enviar registro
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              <footer className="mt-12 text-center text-[10px] text-white/30 font-display uppercase tracking-[0.2em]">
                2026 Seminario Tecnologico Informatico
              </footer>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

interface InputFieldProps {
  icon: React.ReactNode;
  label: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

function InputField({
  icon,
  label,
  name,
  placeholder,
  value,
  onChange,
  type = 'text',
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-display font-bold uppercase tracking-widest text-white/40 ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-brand transition-colors">
          {icon}
        </div>
        <input
          required
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-12 py-4 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/20 transition-all font-sans font-medium placeholder:text-white/10"
        />
      </div>
    </div>
  );
}
