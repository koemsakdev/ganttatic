import React from 'react'
import { Resend } from 'resend';
import { env } from '@/lib/env';

interface SendEmailProps {
  to: string;
  subject: string;
  html: string;
}

const SendEmail = ({to, subject, html}: SendEmailProps) => {
  return (
    <div>SendEmail</div>
  )
}

export default SendEmail