import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Serif_Text, Geist_Mono } from 'next/font/google'
import Nav from '@/components/Nav'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-tiempos',
  display: 'swap',
})

const dmSerif = DM_Serif_Text({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-sohne',
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'RECVR — AI Recovery Protocols for Serious Athletes',
    template: '%s — RECVR',
  },
  description:
    'The AI recovery coach for serious athletes. Tell us how you\'re training — we\'ll build your personalised weekly recovery programme and match you to the best venues.',
  metadataBase: new URL('https://recvr.uk'),
  openGraph: {
    type: 'website',
    siteName: 'RECVR',
    title: 'RECVR — AI Recovery Coach for Serious Athletes',
    description:
      'Tell us how you\'re training — we\'ll build your personalised weekly recovery programme and match you to the best venues.',
    url: 'https://recvr.uk',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RECVR — AI Recovery Coach for Serious Athletes',
    description: 'Personalised recovery programmes. Vetted venues. AI-powered.',
  },
  alternates: {
    canonical: 'https://recvr.uk',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSerif.variable} ${geistMono.variable} dark antialiased`}
    >
      <body className="min-h-screen bg-recvr-void text-recvr-text">
        <Nav />
        <div className="pt-[72px]">{children}</div>
      </body>
    </html>
  )
}
