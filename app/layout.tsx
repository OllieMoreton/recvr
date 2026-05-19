import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Nav from '@/components/Nav'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'RECVR — AI Recovery Protocols for Serious Athletes',
    template: '%s — RECVR',
  },
  description:
    'The AI recovery protocol platform for serious athletes. Tell us how you\'re training — we\'ll build your personalised 7-day recovery protocol and match you to the best venues.',
  metadataBase: new URL('https://recvr.uk'),
  openGraph: {
    type: 'website',
    siteName: 'RECVR',
    title: 'RECVR — AI Recovery Protocols for Serious Athletes',
    description:
      'Tell us how you\'re training — we\'ll build your personalised 7-day recovery protocol and match you to the best venues.',
    url: 'https://recvr.uk',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'RECVR' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RECVR — AI Recovery Protocols for Serious Athletes',
    description: 'Personalised recovery protocols. Vetted venues. AI-powered.',
    images: ['/og-image.png'],
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
      className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}
    >
      <body className="min-h-screen bg-recvr-bg text-recvr-text">
        <Nav />
        <div className="pt-16">{children}</div>
      </body>
    </html>
  )
}
