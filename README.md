<div align="center">

# STI 2026 — Seminario Tecnológico Informático

**Sitio oficial del seminario, con inscripción en línea y panel de administración**

[![Sitio en vivo](https://img.shields.io/badge/en%20vivo-seminarioucsi.com-0A84FF?style=for-the-badge&logo=vercel&logoColor=white)](https://www.seminarioucsi.com)

![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)

<img src="docs/screenshot.jpg" alt="Página principal del STI 2026" width="100%">

</div>

---

## Sobre el proyecto

Sitio web del **Seminario Tecnológico Informático 2026**: presenta el evento, sus speakers,
el cronograma y los auspiciantes, y gestiona la inscripción de los asistentes de punta a punta,
desde el formulario hasta el correo de confirmación y la administración de los registros.

## Funcionalidades

### Sitio público
- 🚀 Portada con cuenta regresiva al evento, fecha, horario y lugar.
- 🎤 Sección de **speakers** con sus perfiles.
- 🗓️ **Cronograma** completo de la jornada.
- 🤝 Muro de **auspiciantes**.
- 📍 Ubicación del evento.

### Inscripción (`/registros`)
- 📝 Formulario de registro con validación de datos.
- ✉️ Correo de **confirmación automático** al inscribirse (Resend), enviado desde una función serverless.
- 🔒 La cédula es única: no se permiten inscripciones duplicadas.

### Panel de administración (`/admin`)
- 📋 Listado de inscriptos con búsqueda.
- 🗑️ Eliminación de registros.
- 📤 Exportación de los inscriptos a **CSV**.

## Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | React · TypeScript · React Router · Motion · Lucide |
| Estilos | Tailwind CSS |
| Build | Vite |
| Base de datos | Supabase (PostgreSQL) |
| Correo | Resend |
| Backend | Función serverless en `api/` (Vercel) · servidor Express para desarrollo local |
| Hosting | Vercel |

## Estructura

```
├── api/register.ts          # Función serverless: registro + correo de confirmación
├── server.ts                # Servidor Express equivalente para desarrollo local
├── src/
│   ├── App.tsx              # Landing: hero, speakers, cronograma, auspiciantes
│   ├── pages/
│   │   ├── RegistrationPage.tsx
│   │   └── AdminPage.tsx
│   └── lib/supabase.ts      # Cliente de Supabase
├── supabase/migrations/     # Esquema de la tabla de inscripciones
└── public/                  # Fotos de speakers y logos de auspiciantes
```

## Cómo ejecutarlo

**Requisitos:** Node.js 20+ y un proyecto de Supabase.

```bash
git clone https://github.com/Zephixd/seminarioucsi.git
cd seminarioucsi
npm install
cp .env.example .env        # completar las variables
```

Crear la tabla ejecutando `supabase/migrations/create_registrations_table.sql` en el SQL Editor de
Supabase (detalles en [`SUPABASE_SETUP.md`](SUPABASE_SETUP.md)). Luego:

```bash
npm run dev:all             # frontend (puerto 3000) + API local
```

### Variables de entorno

| Variable | Uso |
|---|---|
| `VITE_SUPABASE_URL` | URL del proyecto de Supabase |
| `VITE_SUPABASE_ANON_KEY` | Clave pública (anon) de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Solo para `setup-db.ts`; nunca se expone al cliente |
| `RESEND_API_KEY` | Envío de correos de confirmación |

## Autor

**Mathias Sebastian Britos Griffith** — *GreenKnow*
Estudiante de Ingeniería Informática · Universidad Católica «Nuestra Señora de la Asunción», Unidad Pedagógica San Ignacio Guazú

[![Portfolio](https://img.shields.io/badge/Portfolio-greenknow-00ff9c?style=flat-square&logo=vercel&logoColor=white)](https://greenknow-portfolio.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Zephixd-181717?style=flat-square&logo=github)](https://github.com/Zephixd)
