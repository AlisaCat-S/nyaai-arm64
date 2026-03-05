import { SMTP_USER, SMTP_PASSWORD, SMTP_HOST, SMTP_PORT, SMTP_SECURE, SITE_NAME, SMTP_FROM } from '../utils/config'
import type { User } from 'better-auth'
import nodemailer from 'nodemailer'

const transport = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
})

export async function sendVerificationEmail(user: User, url: string) {
  const html = `
  <p>Thank you for signing up for <strong>${SITE_NAME}</strong>. Please click the link below to verify your email:</p>
  <p><a href="${url}" target="_blank" rel="noopener">Verify Email</a></p>
  <p>If you did not sign up for ${SITE_NAME}, please ignore this email.</p>
  `

  await transport.sendMail({
    from: SMTP_FROM,
    to: `${user.name} <${user.email}>`,
    subject: 'Verify your email',
    html,
  })
}

export async function sendResetPassword(user: User, url: string) {
  const html = `
  <p>We received a request to reset the password for your <strong>${SITE_NAME}</strong> account.</p>
  <p>If you made this request, please click the link below to set a new password:</p>

  <p><a href="${url}" target="_blank" rel="noopener">Reset Password</a></p>
  `

  await transport.sendMail({
    from: SMTP_FROM,
    to: `${user.name} <${user.email}>`,
    subject: 'Reset your password',
    html,
  })
}
