import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Our Links',
  description: 'Share and organize links with friends',
  manifest: '/manifest.json',
  icons: {
    apple: '/icon-512x512.png',
  },
  themeColor: '#ffffff',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon-512x512.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <Toaster position="bottom-center" />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
