import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.post('/api/register', async (req, res) => {
  const { firstName, lastName, idNumber, email, phone } = req.body;

  if (!firstName || !lastName || !idNumber || !email || !phone) {
    return res.status(400).json({
      message: 'Faltan datos del formulario',
    });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'STI2026 <onboarding@resend.dev>',
      to: email,
      subject: 'Confirmacion de registro - STI2026',
      text: `
Hola ${firstName} ${lastName},

¡Gracias por tu interes en el Seminario Tecnologico Informatico 2026!
Hemos recibido tu registro correctamente.

Detalles del registro:
Cedula: ${idNumber}
Telefono: ${phone}

Seminario Tecnologico Informatico
San Ignacio Guazu, Paraguay
      `,
    });

    if (error) {
      return res.status(500).json({
        message: error.message,
        error,
      });
    }

    return res.json({
      message: 'Correo enviado correctamente',
      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || 'Error enviando correo',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});