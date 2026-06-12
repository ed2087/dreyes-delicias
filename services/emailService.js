/* ============================================
   EMAIL SERVICE
   Purpose: Nodemailer — send contact form notifications
   ============================================ */

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Send contact form notification to D'Reyes Delicias
 * @param {Object} data - { name, email, phone, subject, message }
 */
exports.sendContactNotification = async (data) => {
  const { name, email, phone, subject, message } = data;

  await transporter.sendMail({
    from: `"D'Reyes Delicias Website" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject: `Nuevo mensaje de contacto: ${subject || 'Sin asunto'}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #C9A227;">Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
        <p><strong>Asunto:</strong> ${subject || 'No proporcionado'}</p>
        <hr style="border-color: #eee;">
        <p><strong>Mensaje:</strong></p>
        <p style="background:#f9f9f9; padding:16px; border-radius:8px;">${message}</p>
        <hr style="border-color: #eee;">
        <p style="color:#999; font-size:12px;">Enviado desde dreyesdelicias.com</p>
      </div>
    `
  });
};
