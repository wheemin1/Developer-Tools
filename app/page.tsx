import Link from "next/link"
import { ToolsGrid } from "@/components/tools-grid"

export const metadata = {
  title: "Free Developer Tools Suite - URL Encoder, Base64, JWT & More",
  description:
    "Professional-grade online developer tools. 9 essential utilities including URL encoder, Base64 converter, JWT decoder, JSON formatter, and hash generators.",
}

export default function Home() {
  return (
    <div className="w-full">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-grid-soft opacity-30" />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-16 pb-10">
          <div className="flex flex-col gap-10">
            <section className="grid gap-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground">
                Free offline developer tools
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
                Fast, private, and in-browser utilities for encoding, formatting, and generating.
              </p>
              <div>
                <Link
                  href="#tools"
                  className="inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                >
                  Browse tools
                </Link>
              </div>
            </section>

            <div className="rounded-3xl border border-border/70 bg-card/70 p-6">
              <div className="text-sm text-muted-foreground">
                Privacy-first, in-browser tools. No uploads. No tracking. Just fast utilities.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col gap-10">
          <div className="min-w-0" id="tools">
            <ToolsGrid />

            <section className="mt-10 rounded-2xl border border-border/60 bg-card/60 p-6">
              <h2 className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Popular searches</h2>
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <Link className="text-foreground hover:text-muted-foreground" href="/tools/jwt-encoder">
                  JWT Encoder
                </Link>
                <Link className="text-foreground hover:text-muted-foreground" href="/tools/jwt-encoder-online">
                  JWT Encoder Online
                </Link>
                <Link className="text-foreground hover:text-muted-foreground" href="/tools/jwt-token-encoder">
                  JWT Token Encoder
                </Link>
                <Link className="text-foreground hover:text-muted-foreground" href="/tools/encode-jwt-online">
                  Encode JWT Online
                </Link>
                <Link className="text-foreground hover:text-muted-foreground" href="/tools/jwt-secret-key-generator-base64">
                  JWT Secret Key Generator (Base64)
                </Link>
                <Link className="text-foreground hover:text-muted-foreground" href="/tools/jwt-secret-key-generator">
                  JWT Secret Key Generator
                </Link>
                <Link className="text-foreground hover:text-muted-foreground" href="/tools/base64-qr-code-generator">
                  Base64 QR Code Generator
                </Link>
              </div>
            </section>

            <section className="mt-12 p-8 bg-muted/30 rounded-2xl">
              <h2 className="text-lg font-semibold mb-4">About the tools</h2>
              <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
                <div>
                  <h3 className="font-medium mb-2 text-foreground">Encoding & Decoding</h3>
                  <ul className="space-y-1">
                    <li>• URL Encoder/Decoder - Convert special characters for web URLs</li>
                    <li>• Base64 Encoder/Decoder - Encode/decode text and files to Base64</li>
                    <li>• JWT Token Encoder/Decoder - Encode/decode JSON Web Tokens and view claims</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2 text-foreground">Formatting & Generation</h3>
                  <ul className="space-y-1">
                    <li>• JSON Formatter - Format, validate and beautify JSON data</li>
                    <li>• Hash Generator - Generate MD5, SHA256 hashes from text/files</li>
                    <li>• UUID Generator - Generate unique identifiers in various formats</li>
                    <li>• QR Code Generator - Create QR codes for text, URLs, and more</li>
                  </ul>
                </div>
              </div>
              <p className="mt-4 text-xs">
                All tools are client-side only - your data never leaves your browser. Free to use with no registration required.
              </p>
            </section>
          </div>

        </div>
      </div>
    </div>
  )
}
