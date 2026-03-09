import { Resend } from "resend"

export const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail(params: {
  to: string
  subject: string
  html: string
}) {
  const from = process.env.EMAIL_FROM

  if (!from) {
    throw new Error("EMAIL_FROM is not configured")
  }

  return resend.emails.send({
    from,
    to: params.to,
    subject: params.subject,
    html: params.html
  })
}
