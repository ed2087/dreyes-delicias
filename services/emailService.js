/* ============================================
   EMAIL SERVICE
   Purpose: Nodemailer — contact form notifications
   ============================================ */

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_HOST,
  port:   parseInt(process.env.EMAIL_PORT) || 465,
  secure: parseInt(process.env.EMAIL_PORT) === 465, // true for port 465 (SSL), false for 587 (STARTTLS)
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

  const safeMsg = (message || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  await transporter.sendMail({
    from:    `"D'Reyes Delicias" <${process.env.EMAIL_USER}>`,
    to:      process.env.EMAIL_TO,
    replyTo: email,
    subject: `Nuevo mensaje: ${subject || 'Contacto desde el sitio web'}`,
    html: `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:48px 16px;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

      <!-- Logo strip -->
      <tr>
        <td align="center" style="padding-bottom:24px;">
          <p style="margin:0;font-size:13px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#C9A227;">D'Reyes Delicias</p>
        </td>
      </tr>

      <!-- Card -->
      <tr>
        <td style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08);">

          <!-- Gold top bar -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="background:#C9A227;height:4px;font-size:0;line-height:0;">&nbsp;</td></tr>
          </table>

          <!-- Header -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:32px 40px 24px;border-bottom:1px solid #f0f0f0;">
                <p style="margin:0 0 4px;font-size:12px;color:#999;font-weight:500;">Formulario de contacto</p>
                <h1 style="margin:0;font-size:22px;font-weight:700;color:#111;letter-spacing:-0.3px;">Nuevo mensaje recibido</h1>
              </td>
            </tr>
          </table>

          <!-- Fields -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:28px 40px 0;">

                <!-- Row 1 -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                  <tr>
                    <td width="48%" style="vertical-align:top;">
                      <p style="margin:0 0 3px;font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#999;">Nombre</p>
                      <p style="margin:0;font-size:15px;font-weight:600;color:#111;">${name}</p>
                    </td>
                    <td width="4%"></td>
                    <td width="48%" style="vertical-align:top;">
                      <p style="margin:0 0 3px;font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#999;">Email</p>
                      <p style="margin:0;font-size:15px;font-weight:600;word-break:break-all;">
                        <a href="mailto:${email}" style="color:#C9A227;text-decoration:none;">${email}</a>
                      </p>
                    </td>
                  </tr>
                </table>

                <!-- Divider -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                  <tr><td style="border-top:1px solid #f0f0f0;height:1px;font-size:0;">&nbsp;</td></tr>
                </table>

                <!-- Row 2 -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                  <tr>
                    <td width="48%" style="vertical-align:top;">
                      <p style="margin:0 0 3px;font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#999;">Teléfono</p>
                      <p style="margin:0;font-size:15px;font-weight:600;color:#111;">
                        ${phone ? phone : '<span style="color:#bbb;">No proporcionado</span>'}
                      </p>
                    </td>
                    <td width="4%"></td>
                    <td width="48%" style="vertical-align:top;">
                      <p style="margin:0 0 3px;font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#999;">Asunto</p>
                      <p style="margin:0;font-size:15px;font-weight:600;color:#111;">
                        ${subject || '<span style="color:#bbb;">No proporcionado</span>'}
                      </p>
                    </td>
                  </tr>
                </table>

                <!-- Divider -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                  <tr><td style="border-top:1px solid #f0f0f0;height:1px;font-size:0;">&nbsp;</td></tr>
                </table>

                <!-- Message -->
                <p style="margin:0 0 8px;font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#999;">Mensaje</p>
                <div style="background:#fafafa;border-left:3px solid #C9A227;border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:32px;">
                  <p style="margin:0;font-size:15px;line-height:1.75;color:#333;white-space:pre-wrap;">${safeMsg}</p>
                </div>

                <!-- CTA -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                  <tr>
                    <td align="center">
                      <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject || "Tu mensaje a D'Reyes Delicias")}"
                         style="display:inline-block;background:#111;color:#ffffff;font-size:14px;font-weight:600;padding:13px 32px;border-radius:8px;text-decoration:none;letter-spacing:0.02em;">
                        Responder a ${name}
                      </a>
                    </td>
                  </tr>
                </table>

              </td>
            </tr>
          </table>

        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td align="center" style="padding:24px 0 0;">
          <p style="margin:0 0 4px;font-size:12px;color:#aaa;">Enviado desde <strong style="color:#888;">dreyesdelicias.com</strong></p>
          <p style="margin:0;font-size:11px;color:#bbb;">
            Powered by <a href="https://www.codedevhub.com" style="color:#888;font-weight:600;text-decoration:none;">CodeDevHub</a>
          </p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>
    `
  });
};
