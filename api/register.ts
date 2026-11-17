import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Metodo no permitido' });
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      message: 'Falta configurar RESEND_API_KEY en las variables de entorno',
    });
  }

  const { firstName, lastName, idNumber, email, phone } = req.body || {};

  if (!firstName || !lastName || !idNumber || !email || !phone) {
    return res.status(400).json({
      message: 'Faltan datos del formulario',
    });
  }

  try {
    const resend = new Resend(apiKey);

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

Te mantendremos informado sobre las proximas novedades,
la agenda completa y los oradores confirmados.

Seminario Tecnologico Informatico
San Ignacio Guazu, Paraguay
      `,
    });

    if (error) {
      return res.status(500).json({
        message: error.message || 'Resend rechazo el envio',
        error,
      });
    }

    return res.status(200).json({
      message: 'Correo enviado correctamente',
      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error?.message || 'Error inesperado enviando correo',
      error,
    });
  }
}