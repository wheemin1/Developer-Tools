import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Space_Grotesk, Manrope } from "next/font/google"

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
})

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://developertoolss.netlify.app'),
  title: 'Free Developer Tools Suite | URL Encoder, Base64, JWT Decoder & 9 Essential Online Tools',
  description: 'Privacy-first online developer tools for URL, Base64, JWT, JSON, hash, UUID, QR, and text processing. 100% browser-side workflows with no registration and no prompt overhead.',
  keywords: 'URL encoder, URL decoder, Base64 encoder, Base64 decoder, JWT encoder, JWT decoder, JSON formatter, hash generator, MD5, SHA256, SHA1, UUID generator, QR code generator, text converter, case converter, whitespace cleaner, developer tools, online tools, encoding tools, decoding tools, privacy first developer tools, client-side tools',
  authors: [{ name: 'Developer Tools Suite' }],
  creator: 'Developer Tools Suite',
  publisher: 'Developer Tools Suite',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://developertoolss.netlify.app',
    title: 'Free Developer Tools Suite | URL Encoder, Base64, JWT Decoder & Essential Online Tools',
    description: 'Privacy-first developer tools for JWT, Base64, URL, JSON, hashing, UUID, and QR workflows. Fast, deterministic, and fully browser-side.',
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
    description: 'Privacy-first developer tools: JWT, Base64, URL, JSON, hash, UUID, QR, and text utilities with instant browser-side processing.',
    images: ['/og-image.png'],
  },
  verification: {
    google: 'CXwW2ROvezFAamVFZYXX26sxDGQ9YjNOHBPFGM7LA6U',
  },
  alternates: {
    canonical: 'https://developertoolss.netlify.app',
  },
  category: 'technology',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${displayFont.variable} ${bodyFont.variable}`}
    >
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
              "url": "https://developertoolss.netlify.app",
              "description": "Privacy-first online developer tools including URL encoder/decoder, Base64 encoder/decoder, JWT encode/decode workflows, JSON formatter, hash generator, UUID generator, QR code generator, text case converter, and whitespace cleaner.",
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
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 w-full">
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
