# STI 2026 — Seminario Tecnológico Informático

Sitio oficial del seminario: **[seminarioucsi.com](https://www.seminarioucsi.com)**

## Funcionalidades

- Presentación del evento: speakers, cronograma y auspiciantes.
- Formulario de inscripción con confirmación por correo.
- Panel de administración de inscriptos.

## Tecnologías

React · TypeScript · Vite · Tailwind CSS · Supabase · Resend · Vercel

## Cómo ejecutarlo

```bash
cp .env.example .env   # completar las variables
npm install
npm run dev
```

La tabla de inscripciones se crea con `supabase/migrations/create_registrations_table.sql`
(ver `SUPABASE_SETUP.md`).

---
Desarrollado por **Mathias Britos Griffith (GreenKnow)**.
