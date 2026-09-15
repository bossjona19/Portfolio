import { config } from '../config.js';
import type { Message } from '../db/schema.js';

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

/** Avisa por correo de un mensaje nuevo. Si Resend no está configurado, no hace nada. */
export async function notifyNewMessage(msg: Message): Promise<boolean> {
  if (!config.RESEND_API_KEY || !config.CONTACT_TO_EMAIL) return false;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: config.CONTACT_FROM_EMAIL,
      to: [config.CONTACT_TO_EMAIL],
      reply_to: msg.email,
      subject: `Portafolio: mensaje de ${msg.name}`,
      html: `<p><strong>${escapeHtml(msg.name)}</strong> &lt;${escapeHtml(msg.email)}&gt; (${msg.lang})</p>
<p style="white-space:pre-wrap">${escapeHtml(msg.body)}</p>`,
    }),
  });
  if (!res.ok) {
    console.error('Resend falló', res.status, await res.text());
    return false;
  }
  return true;
}
