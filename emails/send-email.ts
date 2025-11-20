import { env } from '@/lib/env';
import { Session } from '@/lib/auth-client';
import { Resend } from 'resend';
import { VerificationEmailTemplate } from '@/mails/verification-template';

interface SendEmailProps {
  user: Session;
  url: string;
}

const resend = new Resend(env.RESEND_API_KEY);
export const SendEmail = async ({ user, url }: SendEmailProps) => {
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: user.email,
    subject: 'Email Verification',
    react: VerificationEmailTemplate({ url, name: user.name })
  })
}