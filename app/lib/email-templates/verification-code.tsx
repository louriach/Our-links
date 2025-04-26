import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface VerificationEmailProps {
  code: string
}

export const VerificationEmail = ({
  code,
}: VerificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your verification code for LinkShare</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Your verification code</Heading>
          <Text style={text}>
            Here's your verification code for LinkShare:
          </Text>
          <Text style={codeStyle}>{code}</Text>
          <Text style={text}>
            This code will expire in 15 minutes. If you didn't request this code, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
}

const h1 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.25',
  padding: '16px 0',
  textAlign: 'center' as const,
}

const text = {
  color: '#444',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
}

const codeStyle = {
  background: '#f4f4f4',
  borderRadius: '4px',
  color: '#1a1a1a',
  display: 'block',
  fontSize: '24px',
  fontWeight: 'bold',
  lineHeight: '1.4',
  margin: '16px 0',
  padding: '16px',
  textAlign: 'center' as const,
}

export default VerificationEmail 