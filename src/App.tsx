/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ChevronRight,
  ArrowRight,
  Menu,
  X,
  Instagram,
  Trophy,
  Cpu,
  Globe,
  Zap,
  ExternalLink
} from 'lucide-react';

// --- Types ---
interface Speaker {
  id: string;
  name: string;
  title: string;
  topic: string;
  image: string;
  bio: string;
  socials: { instagram?: string; linkedin?: string; github?: string; twitter?: string };
}

interface ScheduleItem {
  id: string;
  time: string;
  speaker?: string;
  title: string;
  description?: string;
  type: 'talk' | 'break' | 'event';
}

// --- Data ---
const SPEAKERS: Speaker[] = [
  {
    id: '1',
    name: 'Erika Aquino',
    title: 'Full Stack Engineer',
    topic: 'Cómo reinventarse sin empezar desde cero',
    image: '/speakers/erikaaquino.webp',
    bio: 'Full Stack Engineer enfocada en desarrollo web con Vue.js, Nuxt, Python y Django. Especializada en crear aplicaciones escalables con enfoque en experiencia de usuario y diseño centrado en el producto.',
    socials: { instagram: 'https://www.instagram.com/erideveloper/?igsh=MTRwY2FyOGQzbG80MA==', linkedin: 'https://www.linkedin.com/in/erika-aquino-enrique/' }
  },
  {
    id: '2',
    name: 'Benito Ortega Torres',
    title: 'Ingeniero Agrónomo',
    topic: '¿Puede la tecnología humanizar la agricultura?',
    image: '/speakers/benito.webp',
    bio: 'Ingeniero agrónomo e investigador paraguayo, con maestría y candidato a PhD en EE.UU. Su trabajo se centra en desarrollo rural, resiliencia comunitaria y economía social, combinando academia y acción en territorio.',
    socials: { instagram: 'https://www.instagram.com/bentorres33/?igsh=MWNvaXpzNzUybmE3cA==', linkedin: 'https://www.linkedin.com/in/benito-ortega-torres-ab3555242/' }
  },
  {
    id: '3',
    name: 'Teresa Samudio',
    title: 'Ingeniera en Informática',
    topic: 'Cómo pasar de aprender a construir productos reales',
    image: '/speakers/techi.webp',
    bio: 'Ingeniera en Informática especializada en desarrollo móvil con Flutter. Enfocada en ayudar a startups a validar productos, crear MVPs y generar insights mediante herramientas modernas y diseño centrado en el usuario.',
    socials: { instagram: 'https://www.instagram.com/tesamudio/?igsh=MWo1eGF4MnppcmswMA==', linkedin: 'https://www.linkedin.com/in/maria-teresa-samudio/' }
  },
  {
    id: '4',
    name: 'Koki Duré Escobar',
    title: 'Senior Software Engineer',
    topic: 'De junior a senior en la era de la inteligencia artificial',
    image: '/speakers/kokidure.webp',
    bio: 'Senior Software Engineer con más de 15 años de experiencia. Experto en sistemas backend y desarrollo full stack, enfocado en construir soluciones escalables y eficientes para productos de alto impacto.',
    socials: { instagram: 'https://www.instagram.com/kokidure/?igsh=MWdzbmVucHlwNmZscQ==', linkedin: 'https://www.linkedin.com/in/kokidure/' }
  },
  {
    id: '5',
    name: 'Marcelo Elizache Landó',
    title: 'Software Engineer',
    topic: 'Open Source: cuando aprender en comunidad se convierte en tu profesión',
    image: '/speakers/marcelo.webp',
    bio: 'Software Engineer especializado en backend, arquitectura y cloud. Referente en la comunidad tech y contribuidor open source, con experiencia en Python, AWS y liderazgo técnico.',
    socials: { instagram: 'https://www.instagram.com/melizeche/?igsh=MXVtaHAzNTd3dmZucQ==', linkedin: 'https://www.linkedin.com/in/melizeche/' }
  },
  {
    id: '6',
    name: 'Katya Vázquez',
    title: 'Desarrolladora y Mentora',
    topic: 'La comunidad como punto de entrada a la industria',
    image: '/speakers/katyavazquez.webp',
    bio: 'Desarrolladora y mentora en programación. Fundadora de comunidades tecnológicas y embajadora de Women Techmakers, impulsa la inclusión y el crecimiento del talento en tecnología en Paraguay.',
    socials: { instagram: 'https://www.instagram.com/vazquez.katya/?igsh=YzFpdW82aWhjeHh0', linkedin: 'https://www.linkedin.com/in/katyavazquezdev/' }
  }
];

const SCHEDULE: ScheduleItem[] = [
  { id: '1', time: '07:30', title: 'Acreditación', description: 'Registro de asistentes', type: 'event' },
  { id: '2', time: '08:00', title: 'Palabras Inaugurales', description: 'Bienvenida al evento', type: 'event' },
  { id: '3', time: '08:10', speaker: 'Benito Ortega Torres', title: '¿Puede la tecnología humanizar la agricultura?', description: '', type: 'talk' },
  { id: '4', time: '09:00', speaker: 'Teresa Samudio', title: 'Cómo pasar de aprender a construir productos reales', description: '', type: 'talk' },
  { id: '5', time: '09:50', title: 'Coffee Break', description: 'Receso y networking', type: 'break' },
  { id: '6', time: '10:10', speaker: 'Katya Vázquez', title: 'La comunidad como punto de entrada a la industria', description: '', type: 'talk' },
  { id: '7', time: '11:00', speaker: 'Marcelo Elizache', title: 'Open Source: cuando aprender en comunidad se convierte en tu profesión', description: '', type: 'talk' },
  { id: '8', time: '11:50', title: 'Descanso', description: 'Pausa breve', type: 'break' },
  { id: '9', time: '12:00', title: 'Almuerzo', description: 'Pausa para almorzar', type: 'break' },
  { id: '10', time: '13:00', speaker: 'Erika Aquino', title: 'Cómo reinventarse sin empezar desde cero', description: '', type: 'talk' },
  { id: '11', time: '14:00', speaker: 'Koki Duré', title: 'De junior a senior en la era de la inteligencia artificial', description: '', type: 'talk' },
  { id: '12', time: '15:00', title: 'Cierre y Entrega de Certificados', description: 'Conclusión del evento', type: 'event' },
];

const SPONSORS = [
  { name: 'Auspiciante 1', logo: '/auspicios/1.jpeg' },
  { name: 'Auspiciante 2', logo: '/auspicios/39.PNG' },
  { name: 'Auspiciante 3', logo: '/auspicios/3.JPG' },
  { name: 'Auspiciante 4', logo: '/auspicios/4.JPG' },
  { name: 'Auspiciante 5', logo: '/auspicios/5.JPG' },
  { name: 'Auspiciante 6', logo: '/auspicios/6.JPG' },
  { name: 'Auspiciante 7', logo: '/auspicios/7.JPG' },
  { name: 'Auspiciante 8', logo: '/auspicios/8.JPG' },
  { name: 'Auspiciante 9', logo: '/auspicios/9.JPG' },
  { name: 'Auspiciante 10', logo: '/auspicios/10.JPG' },
  { name: 'Auspiciante 11', logo: '/auspicios/11.JPG' },
  { name: 'Auspiciante 12', logo: '/auspicios/12.JPG' },
  { name: 'Auspiciante 13', logo: '/auspicios/13.JPG' },
  { name: 'Auspiciante 14', logo: '/auspicios/14.JPG' },
  { name: 'Auspiciante 15', logo: '/auspicios/15.JPG' },
  { name: 'Auspiciante 16', logo: '/auspicios/16.JPG' },
  { name: 'Auspiciante 17', logo: '/auspicios/17.JPG' },
  { name: 'Auspiciante 18', logo: '/auspicios/18.JPG' },
  { name: 'Auspiciante 19', logo: '/auspicios/19.JPG' },
  { name: 'Auspiciante 20', logo: '/auspicios/20.JPG' },
  { name: 'Auspiciante 21', logo: '/auspicios/21.JPG' },
  { name: 'Auspiciante 22', logo: '/auspicios/22.JPG' },
  { name: 'Auspiciante 23', logo: '/auspicios/23.JPG' },
  { name: 'Auspiciante 24', logo: '/auspicios/24.JPG' },
  { name: 'Auspiciante 25', logo: '/auspicios/45.jpeg' },
  { name: 'Auspiciante 26', logo: '/auspicios/46.jpeg' },
  { name: 'Auspiciante 27', logo: '/auspicios/27.png' },
  { name: 'Auspiciante 28', logo: '/auspicios/28.png' },
  { name: 'Auspiciante 29', logo: '/auspicios/29.png' },
  { name: 'Auspiciante 30', logo: '/auspicios/30.png' },
  { name: 'Auspiciante 31', logo: '/auspicios/31.jpeg' },
  { name: 'Auspiciante 32', logo: '/auspicios/32.jpeg' },
  { name: 'Auspiciante 33', logo: '/auspicios/33.jpeg' },
  { name: 'Auspiciante 34', logo: '/auspicios/34.jpeg' },
  { name: 'Auspiciante 35', logo: '/auspicios/35.jpeg' },
  { name: 'Auspiciante 36', logo: '/auspicios/36.jpeg' },
  { name: 'Auspiciante 37', logo: '/auspicios/37.jpeg' },
  { name: 'Auspiciante 38', logo: '/auspicios/38.png' },
  { name: 'Auspiciante 39', logo: '/auspicios/2.jpeg' },
  { name: 'Auspiciante 40', logo: '/auspicios/40.jpeg' },
  { name: 'Auspiciante 41', logo: '/auspicios/41.jpeg' },
  { name: 'Auspiciante 42', logo: '/auspicios/42.png' },
  { name: 'Auspiciante 43', logo: '/auspicios/43.jpeg' },
  { name: 'Auspiciante 44', logo: '/auspicios/44.jpeg' },

];

const sponsorRows = Array.from({ length: 4 }, (_, carouselIndex) =>
  SPONSORS.map((sponsor, index) => ({ ...sponsor, sponsorNumber: index + 1 }))
    .filter((_, index) => index % 4 === carouselIndex)
);

// --- Components ---

const SpeakerCard = ({ speaker, idx }: { speaker: Speaker; idx: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isExpanded]);

  return (
    <motion.div
      ref={cardRef}
      key={speaker.id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1 }}
      onClick={() => setIsExpanded(!isExpanded)}
      className={`group relative overflow-hidden rounded-3xl glass-card aspect-[4/5] cursor-pointer transition-all ${isExpanded ? 'ring-2 ring-brand' : ''
        }`}
    >
      <img
        src={speaker.image}
        alt={speaker.name}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${isExpanded ? 'grayscale-0 scale-105' : 'grayscale group-hover:grayscale-0 group-hover:scale-105'
          }`}
      />
      <div className={`absolute inset-0 transition-colors duration-300 ${isExpanded
        ? 'bg-gradient-to-t from-surface via-surface/60 to-transparent'
        : 'bg-gradient-to-t from-surface via-surface/40 to-transparent group-hover:via-surface/60'
        }`} />

      <div className={`absolute bottom-0 left-0 w-full p-8 transition-transform duration-500 ${isExpanded ? 'translate-y-0' : 'translate-y-4 group-hover:translate-y-0'
        }`}>
        <div className={`text-brand font-mono text-[10px] uppercase tracking-widest mb-1 transition-opacity ${isExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}>
          {speaker.title}
        </div>
        <h3 className={`text-2xl font-black mb-2 transition-colors ${isExpanded || false ? 'text-brand' : 'group-hover:text-brand'
          }`}>{speaker.name}</h3>
        <p className="text-gray-300 text-sm font-medium leading-tight mb-4">{speaker.topic}</p>

        <div className={`transition-all duration-500 overflow-hidden ${isExpanded
          ? 'h-20 opacity-100'
          : 'h-0 opacity-0 group-hover:h-20 group-hover:opacity-100'
          }`}>
          <p className="text-gray-400 text-xs line-clamp-3 mb-4">{speaker.bio}</p>
          <div className="flex gap-4">
            {speaker.socials.instagram && <a href={speaker.socials.instagram} target="_blank" rel="noopener noreferrer"><Instagram size={14} className="text-gray-500 hover:text-brand cursor-pointer" /></a>}
            {speaker.socials.twitter && <a href={speaker.socials.twitter} target="_blank" rel="noopener noreferrer"><ExternalLink size={14} className="text-gray-500 hover:text-brand cursor-pointer" /></a>}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CountDown = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    const calculate = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const diff = target - now;

      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      };
    };

    const timer = setInterval(() => setTimeLeft(calculate()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { label: 'DÍAS', value: timeLeft.days },
    { label: 'HORAS', value: timeLeft.hours },
    { label: 'MINUTOS', value: timeLeft.minutes },
    { label: 'SEGUNDOS', value: timeLeft.seconds },
  ];

  return (
    <div className="flex gap-4 md:gap-8 justify-center mt-8">
      {units.map((u) => (
        <div key={u.label} className="text-center group">
          <div className="text-3xl md:text-5xl font-display font-bold text-brand group-hover:scale-110 transition-transform duration-300">
            {u.value.toString().padStart(2, '0')}
          </div>
          <div className="text-[10px] md:text-xs font-mono tracking-widest text-gray-500 mt-1">{u.label}</div>
        </div>
      ))}
    </div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Speakers', href: '#speakers' },
    { name: 'Cronograma', href: '#schedule' },
    { name: 'Auspiciantes', href: '#sponsors' },
    { name: 'Ubicación', href: 'https://maps.app.goo.gl/xR8f6JBZAe4SfUHe8' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-surface/80 backdrop-blur-md py-4 border-b border-white/5' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href="#" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform">
            <Cpu className="text-surface font-bold" />
          </div>
          <span className="font-display font-bold text-xl tracking-tighter">
            STI<span className="text-brand">2026</span>
          </span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <a
              key={l.name}
              href={l.href}
              className="font-mono text-sm uppercase tracking-widest text-gray-400 hover:text-brand transition-colors"
            >
              {l.name}
            </a>
          ))}
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="https://api.whatsapp.com/send/?phone=595971341222&text=Hola%2C%20me%20gustaria%20adquirir%20una%20entrada"
            className="bg-brand text-surface px-6 py-2.5 rounded-full font-display text-sm font-bold neon-glow"
          >
            ADQUIRIR ENTRADAS
          </motion.a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-surface border-b border-white/10 p-6 md:hidden flex flex-col gap-6"
          >
            {links.map((l) => (
              <a
                key={l.name}
                href={l.href}
                onClick={() => setIsOpen(false)}
                className="font-mono text-lg uppercase tracking-widest text-gray-400 hover:text-brand"
              >
                {l.name}
              </a>
            ))}
            <a
              href="https://api.whatsapp.com/send/?phone=595971341222&text=Hola%2C%20me%20gustaria%20adquirir%20una%20entrada"
              className="bg-brand text-surface px-6 py-4 rounded-xl font-display text-center font-bold"
            >
              ADQUIRIR ENTRADAS
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default function App() {
  const [currentSponsorIndex, setCurrentSponsorIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSponsorIndex((prev) => (prev >= sponsorRows[0].length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen selection:bg-brand selection:text-surface">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-secondary/10 blur-[120px] rounded-full animate-pulse delay-700" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

          {/* Grid lines */}
          <div className="absolute inset-0 bg-grid-white/[0.02]" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand/20 bg-brand/5 text-brand font-mono text-[10px] md:text-sm uppercase tracking-widest mb-8">
              <Zap size={14} className="fill-brand" />
              El evento tecnológico del año
            </div>

            <h1 className="text-5xl md:text-8xl font-black mb-6 leading-[0.9] tracking-tighter">
              SEMINARIO <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-secondary">
                TECNOLÓGICO
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 mb-10 font-light leading-relaxed">
              Únete a los mejores expertos de la industria para explorar las fronteras de la informática,
              la inteligencia artificial y la innovación comunitaria.
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://api.whatsapp.com/send/?phone=595975769938&text=Hola%2C%20me%20gustaria%20adquirir%20una%20entrada"
                className="w-full md:w-auto px-10 py-5 bg-brand text-surface font-display font-black text-lg rounded-2xl flex items-center justify-center gap-3 neon-glow shadow-2xl shadow-brand/20"
              >
                ASEGURA TU LUGAR
                <ArrowRight size={20} />
              </motion.a>
              <a
                href="#speakers"
                className="w-full md:w-auto px-10 py-5 border border-white/10 hover:bg-white/5 transition-colors rounded-2xl font-display font-bold text-lg"
              >
                CONOCE A LOS SPEAKERS
              </a>
            </div>

            <CountDown targetDate="2026-06-06T07:30:00" />

            <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16 opacity-50">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-brand" />
                <span className="font-mono text-sm uppercase">6 JUNIO, 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-brand" />
                <span className="font-mono text-sm uppercase">08:00 - 18:00</span>
              </div>
              <div className="flex items-center gap-2">
                <a href="https://maps.app.goo.gl/xR8f6JBZAe4SfUHe8" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-brand transition-colors">
                  <MapPin size={18} className="text-brand" />
                  <span className="font-mono text-sm uppercase">Salón Auditorio</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- SPEAKERS SECTION --- */}
      <section id="speakers" className="py-24 px-6 bg-surface relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <div className="text-brand font-mono text-xs uppercase tracking-[0.3em] mb-4">Mentes Brillantes</div>
              <h2 className="text-4xl md:text-6xl font-black">NUESTROS <span className="text-white/40 italic">SPEAKERS</span></h2>
            </div>
            <p className="max-w-md text-gray-400 font-light text-right">
              Líderes de opinión y constructores de tecnología que están definiendo el futuro hoy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SPEAKERS.map((s, idx) => (
              <SpeakerCard key={s.id} speaker={s} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* --- SCHEDULE SECTION --- */}
      <section id="schedule" className="py-24 px-6 relative overflow-hidden">
        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-96 bg-brand/5 blur-[150px] rounded-full" />

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-4">CRONOGRAMA</h2>
            <div className="flex items-center justify-center gap-4 text-brand font-mono text-sm uppercase">
              <Calendar size={16} /> 6 de Junio, 2026
            </div>
          </div>

          <div className="space-y-4">
            {SCHEDULE.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-start md:items-center transition-all ${item.type === 'talk'
                  ? 'glass-card hover:border-brand/30 group cursor-default'
                  : 'bg-white/2 border border-white/5 opacity-60'
                  }`}
              >
                <div className="text-brand font-mono text-sm font-bold min-w-[100px]">
                  {item.time}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {item.type === 'talk' && <Zap size={14} className="text-brand fill-brand" />}
                    {item.type === 'break' && <Clock size={14} className="text-gray-400" />}
                    <h3 className={`font-display text-lg ${item.type === 'talk' ? 'text-white' : 'text-gray-500'}`}>
                      {item.title}
                    </h3>
                  </div>
                  {item.speaker && (
                    <div className="text-sm text-gray-400 group-hover:text-brand transition-colors">
                      Con <span className="font-bold">{item.speaker}</span>
                    </div>
                  )}
                  {item.description && (
                    <div className="text-xs text-gray-500 mt-1">
                      {item.description}
                    </div>
                  )}
                </div>

                {item.type === 'talk' && (
                  <div className="hidden md:block">
                    <div className="text-[10px] font-mono border border-brand/40 text-brand px-3 py-1 rounded-full uppercase">
                      Ponencia Principal
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SPONSORS SECTION --- */}
      <section id="sponsors" className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4">AUSPICIANTES</h2>
            <p className="text-gray-500 max-w-xl mx-auto italic">
              Gracias a las organizaciones que apostan por la innovación y el desarrollo tecnológico regional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {sponsorRows.map((row, rowIndex) => (
              <div key={rowIndex} className="relative overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSponsorIndex * 100}%)` }}
                >
                  {row.map((s) => (
                    <div
                      key={s.name}
                      className="w-full flex-shrink-0 flex items-center justify-center"
                    >
                      <motion.div
                        whileHover={{ y: -5 }}
                        className="glass-card w-full min-h-[220px] p-6 md:p-8 rounded-3xl flex flex-col items-center justify-center gap-4 group mx-2"
                      >
                        <div className="w-40 h-28 md:w-48 md:h-32 flex items-center justify-center">
                          <img
                            src={s.logo}
                            alt={s.name}
                            className={`max-h-full max-w-full object-contain opacity-50 group-hover:opacity-100 transition-opacity ${s.name === 'Auspiciante 1' ? 'scale-150' : ''}`}
                          />
                        </div>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-gray-600 group-hover:text-brand transition-colors">{s.name}</span>
                      </motion.div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center gap-2 mt-6">
                  {row.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() =>
                        setCurrentSponsorIndex(idx)
                      }
                      className={`h-2 rounded-full transition-all ${idx === currentSponsorIndex ? 'bg-brand w-8' : 'bg-white/20 w-2'}`}
                      aria-label={`Ir al grupo de auspiciantes ${idx * 4 + 1} al ${idx * 4 + 4}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 px-6 border-t border-white/5 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                  <Cpu className="text-surface size-5" />
                </div>
                <span className="font-display font-bold text-lg tracking-tighter">
                  STI<span className="text-brand">2026</span>
                </span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                El evento tecnológico más importante del departamento de Misiones, reuniendo a expertos, estudiantes y empresas
                bajo un mismo techo para inspirar la próxima década de innovación.
              </p>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/seminarioucsi" target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-brand hover:text-surface transition-all">
                  <Instagram size={18} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-display text-sm mb-6 uppercase tracking-widest text-brand">Navegación</h4>
              <ul className="space-y-4 font-mono text-xs uppercase tracking-widest text-gray-500">
                <li><a href="#speakers" className="hover:text-white transition-colors">Speakers</a></li>
                <li><a href="#schedule" className="hover:text-white transition-colors">Cronograma</a></li>
                <li><a href="#sponsors" className="hover:text-white transition-colors">Auspiciantes</a></li>
                <li><a href="https://maps.app.goo.gl/xR8f6JBZAe4SfUHe8" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Ubicación</a></li>
              </ul>
            </div>

            <div className="glass-card p-8 rounded-3xl flex flex-col justify-between">
              <div>
                <h4 className="font-display text-sm mb-4 uppercase tracking-widest text-brand">Ponte en contacto</h4>
                <p className="text-gray-400 text-sm mb-6">¿Interesado en auspiciar o tienes alguna duda?</p>
              </div>
              <motion.a
                whileHover={{ x: 5 }}
                href="https://api.whatsapp.com/send/?phone=595975769938"
                className="flex items-center gap-2 text-brand font-bold uppercase tracking-widest text-xs"
              >
                ESCRIBIR POR WHATSAPP
                <ArrowRight size={14} />
              </motion.a>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 gap-6">
            <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
              © 2026 SEMINARIO TECNOLÓGICO INFORMÁTICO. TODO EL CÓDIGO ABIERTO.
            </div>
            <div className="flex gap-8 text-[10px] font-mono text-gray-600 uppercase tracking-widest">
              <a href="#" className="hover:text-brand">Políticas de Privacidad</a>
              <a href="#" className="hover:text-brand">Términos y Condiciones</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

