import nodemailer from "nodemailer";

import { db } from "@/lib/db";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT || 587) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function sendMail(to: string | string[], subject: string, html: string) {
  return transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    html,
  });
}

type NewOrderInfo = {
  id: string;
  customerName: string;
  customerEmail: string;
  totalInCents: number;
  itemCount: number;
};

type CustomerOrderConfirmation = {
  orderId: string;
  customerName: string;
  customerEmail: string;
  totalInCents: number;
  itemCount: number;
  shippingCity: string;
  shippingPostOffice: string;
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatUAH(cents: number): string {
  const uah = (cents / 100).toFixed(2);
  return `${uah} ₴`;
}

export async function notifyAdminsNewOrder(order: NewOrderInfo) {
  const admins = await db.user.findMany({
    where: { role: "ADMIN" },
    select: { email: true },
  });

  if (admins.length === 0) return;

  const emails = admins.map((a) => a.email);

  const subject = `Нове замовлення #${order.id.slice(0, 8)}`;

  const html = `
    <h2>Нове замовлення</h2>
    <table style="border-collapse:collapse">
      <tr><td style="padding:4px 12px 4px 0;font-weight:bold">ID</td><td>${order.id}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Клієнт</td><td>${order.customerName}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Email</td><td>${order.customerEmail}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Товарів</td><td>${order.itemCount}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Сума</td><td>${formatUAH(order.totalInCents)}</td></tr>
    </table>
  `;

  await sendMail(emails, subject, html);
}

export async function notifyCustomerOrderConfirmation(
  order: CustomerOrderConfirmation,
) {
  const shortId = order.orderId.slice(0, 8);
  const subject = `Замовлення #${shortId} — підтвердження`;
  const name = escapeHtml(order.customerName);
  const city = escapeHtml(order.shippingCity);
  const office = escapeHtml(order.shippingPostOffice);

  const html = `
    <p>Вітаємо, ${name}!</p>
    <p>Дякуємо за замовлення. Воно успішно оформлене. Ми зв&apos;яжемося з вами найближчим часом.</p>
    <h2 style="margin:24px 0 12px;font-size:16px">Деталі замовлення</h2>
    <table style="border-collapse:collapse">
      <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Номер замовлення</td><td style="font-family:monospace;font-size:12px">${shortId}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Кількість позицій</td><td>${order.itemCount}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Сума</td><td>${formatUAH(order.totalInCents)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;font-weight:bold;vertical-align:top">Доставка</td><td>м. ${city}, відділення НП №${office}</td></tr>
    </table>
  `;

  await sendMail(order.customerEmail, subject, html);
}
