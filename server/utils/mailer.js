// utils/mailer.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendCancellationEmails = async (emails, classId) => {
  if (!emails.length) return;

  const mailOptions = {
    from: '"מערכת ניהול כיתות" <no-reply@yourdomain.com>',
    to: emails.join(','),
    subject: 'ביטול כיתה',
    text: `שלום רב,\n\nכיתה מספר ${classId} בוטלה.\n\nתודה.`
  };

  await transporter.sendMail(mailOptions);
};
