import nodemailer from 'nodemailer';
import 'dotenv/config';

const nodemailerConfig = {
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
};
const transport = nodemailer.createTransport(nodemailerConfig);

export const sendEmail = async (payload) => {
  const email = {
    ...payload,
    from: process.env.SMTP_FROM,
  };
  return transport.sendMail(email);
};

