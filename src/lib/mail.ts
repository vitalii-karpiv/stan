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

type ContactFormInfo = {
  name: string;
  phone: string;
  message: string;
};

export async function notifyAdminsContactForm(info: ContactFormInfo) {
  const admins = await db.user.findMany({
    where: { role: "ADMIN" },
    select: { email: true },
  });

  if (admins.length === 0) return;

  const emails = admins.map((a) => a.email);

  const subject = `Повідомлення з форми контактів від ${info.name}`;

  const html = `
    <h2>Нове повідомлення з форми контактів</h2>
    <table style="border-collapse:collapse">
      <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Ім'я</td><td>${info.name}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;font-weight:bold">Телефон</td><td>${info.phone}</td></tr>
    </table>
    <h3 style="margin-top:16px">Повідомлення</h3>
    <p style="white-space:pre-wrap">${info.message}</p>
  `;

  await sendMail(emails, subject, html);
}
