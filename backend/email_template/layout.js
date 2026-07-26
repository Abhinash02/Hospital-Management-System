// Shared building blocks for all email templates: the branded shell, CTA button,
// detail table, and date formatter. Templates in ./index.js compose these.

const BRAND = '#0f4c81';
const BRAND_2 = '#1e88a8';

const shell = ({ heading, intro, bodyHtml, footNote }) => `
  <div style="margin:0;padding:32px 16px;background:linear-gradient(160deg,#eef4fb 0%,#e4edfb 100%);font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 16px 44px rgba(15,76,129,.14);">
      <div style="background:linear-gradient(135deg,${BRAND} 0%,${BRAND_2} 100%);padding:36px 32px 30px;text-align:center;">
        <div style="display:inline-block;width:64px;height:64px;line-height:64px;border-radius:18px;background:rgba(255,255,255,.15);font-size:32px;">🐾</div>
        <div style="color:#ffffff;font-size:22px;font-weight:800;letter-spacing:.4px;margin-top:14px;">Pet Hospital Portal</div>
        <div style="color:#cfe3f5;font-size:13px;margin-top:5px;">Modern care management for veterinary teams</div>
      </div>
      <div style="height:4px;background:linear-gradient(90deg,#38bdf8,${BRAND},#38bdf8);"></div>
      <div style="padding:34px 34px 8px;color:#1e293b;">
        <h1 style="margin:0 0 10px;color:#0f172a;font-size:23px;font-weight:800;">${heading}</h1>
        ${intro ? `<p style="margin:0 0 18px;color:#475569;font-size:15px;line-height:1.7;">${intro}</p>` : ''}
        ${bodyHtml}
      </div>
      <div style="padding:22px 34px 30px;">
        <div style="border-top:1px solid #eef2f7;padding-top:18px;color:#94a3b8;font-size:12px;line-height:1.7;text-align:center;">
          ${footNote || 'You are receiving this because you engaged with the Pet Hospital Portal.'}
          <div style="margin-top:10px;font-size:16px;">🐶 🐱 🐾</div>
          <div style="margin-top:6px;">© ${new Date().getFullYear()} Pet Hospital Portal · All rights reserved.</div>
        </div>
      </div>
    </div>
  </div>
`;

const button = (href, label) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:18px 0 8px;">
     <tr><td style="border-radius:999px;background:linear-gradient(135deg,${BRAND} 0%,${BRAND_2} 100%);box-shadow:0 8px 20px rgba(15,76,129,.28);">
       <a href="${href}" style="display:inline-block;padding:14px 34px;color:#fff;text-decoration:none;font-weight:700;font-size:15px;border-radius:999px;">${label} →</a>
     </td></tr>
   </table>`;

const detailRows = (rows) => `
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:8px 0 18px;background:#f8fafc;border:1px solid #eef2f7;border-radius:12px;">
    ${rows
      .filter((r) => r && r[1])
      .map(
        ([k, v]) => `<tr>
          <td style="padding:11px 16px;color:#64748b;font-size:13px;border-bottom:1px solid #eef2f7;width:38%;">${k}</td>
          <td style="padding:11px 16px;color:#0f172a;font-size:14px;font-weight:600;border-bottom:1px solid #eef2f7;">${v}</td>
        </tr>`
      )
      .join('')}
  </table>`;

const fmtWhen = (d) =>
  d ? new Date(d).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' }) : null;

module.exports = { shell, button, detailRows, fmtWhen, BRAND, BRAND_2 };
