import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set')
}

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email: string, code: string) {
  console.log('Attempting to send email to:', email)
  
  try {
    console.log('Creating email with Resend...')
    const { data, error } = await resend.emails.send({
      from: 'LinkShare <onboarding@resend.dev>',
      to: email,
      subject: 'Your verification code for LinkShare',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a; text-align: center;">Your verification code</h1>
          <p style="color: #444; font-size: 16px;">Here's your verification code for LinkShare:</p>
          <div style="background: #f4f4f4; padding: 16px; border-radius: 4px; text-align: center; font-size: 24px; font-weight: bold; margin: 16px 0;">
            ${code}
          </div>
          <p style="color: #444; font-size: 16px;">This code will expire in 15 minutes. If you didn't request this code, you can safely ignore this email.</p>
        </div>
      `,
    })

    if (error) {
      console.error('Resend API error:', error)
      throw error
    }

    console.log('Resend API response:', data)
    return data
  } catch (error) {
    console.error('Error in sendVerificationEmail:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
    }
    throw error
  }
} 