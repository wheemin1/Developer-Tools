import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  metadataBase: new URL('https://developer-tools-suite.netlify.app'),
  title: 'Free Developer Tools Suite | URL Encoder, Base64, JWT Decoder & 9 Essential Online Tools',
  description: 'Free online developer tools including URL encoder/decoder, Base64 encoder/decoder, JWT token decoder, JSON formatter, hash generator, UUID generator, QR code generator & more. No registration required - instant access to essential coding utilities.',
  keywords: 'URL encoder, URL decoder, Base64 encoder, Base64 decoder, JWT decoder, JSON formatter, hash generator, MD5, SHA256, SHA1, UUID generator, QR code generator, text converter, case converter, whitespace cleaner, developer tools, online tools, encoding tools, decoding tools, web development tools, programming utilities, coding tools, free online tools, developer utilities, web developer tools',
  authors: [{ name: 'Developer Tools Suite' }],
  creator: 'Developer Tools Suite',
  publisher: 'Developer Tools Suite',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://developer-tools-suite.netlify.app',
    title: 'Free Developer Tools Suite | URL Encoder, Base64, JWT Decoder & Essential Online Tools',
    description: 'Free online developer tools including URL encoder/decoder, Base64 encoder/decoder, JWT decoder, JSON formatter, hash generator, UUID generator, QR code generator & text utilities. No registration required - instant access to 9 essential coding tools.',
    siteName: 'Developer Tools Suite',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Developer Tools Suite - Free Online Encoding, Decoding & Development Utilities',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Developer Tools Suite | URL Encoder, Base64, JWT Decoder & Essential Online Tools',
    description: 'Free online developer tools: URL encoder/decoder, Base64 encoder/decoder, JWT decoder, JSON formatter, hash generator, UUID generator, QR code generator & more. No signup required!',
    images: ['/og-image.png'],
  },
  verification: {
    google: 'CXwW2ROvezFAamVFZYXX26sxDGQ9YjNOHBPFGM7LA6U',
  },
  alternates: {
    canonical: 'https://developer-tools-suite.netlify.app',
  },
  category: 'technology',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Developer Tools Suite",
              "url": "https://developer-tools-suite.netlify.app",
              "description": "Free online developer tools including URL encoder/decoder, Base64 encoder/decoder, JWT decoder, JSON formatter, hash generator, UUID generator, QR code generator, text case converter, and whitespace cleaner. Essential utilities for web developers and programmers.",
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Organization",
                "name": "Developer Tools Suite"
              },
              "featureList": [
                "URL Encoder/Decoder",
                "Base64 Encoder/Decoder",
                "JWT Token Decoder",
                "JSON Formatter",
                "Hash Generator (MD5, SHA256)",
                "UUID Generator",
                "QR Code Generator",
                "Text Case Converter",
                "Whitespace Cleaner"
              ]
            })
          }}
        />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
