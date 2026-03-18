import Link from "next/link"
import { ToolsGrid } from "@/components/tools-grid"
import Script from "next/script"

export const metadata = {
  title: "Developer Tools Directory | Privacy-First Encoding & JWT Workspace",
  description:
    "Privacy-first developer tools for JWT, Base64, URL, JSON, hashing, UUID, and QR workflows. 100% browser-side processing with no prompts or account required.",
  keywords: [
    "developer tools directory",
    "jwt encoder online",
    "jwt decoder",
    "base64 encoder decoder",
    "url encoder decoder",
    "json formatter",
    "privacy first developer tools",
  ],
}

const faqItems = [
  {
    question: "Why use this instead of AI for JWT and encoding tasks?",
    answer:
      "For repetitive debugging work, this is faster than prompting. Paste input, validate output, and move on. It is optimized for immediate utility workflows.",
  },
  {
    question: "Are secrets sent to a server?",
    answer:
      "No. Token parsing, encoding, decoding, and helper utilities are handled in-browser. Your payloads and secrets stay on your device.",
  },
  {
    question: "Who is this directory for?",
    answer:
      "Backend developers, frontend engineers, QA engineers, DevOps, and students who need quick, trustworthy utility workflows without account friction.",
  },
]

export default function ToolsDirectoryPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }

  return (
    <div className="space-y-8">
      <Script
        id="tools-directory-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-semibold text-foreground">Developer Tools Directory</h1>
        <p className="text-muted-foreground max-w-2xl">
          A privacy-first workspace for encoding, decoding, and debugging tasks. Built for developers who want
          immediate results without prompt loops.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/tools/jwt"
            className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Open JWT Workspace
          </Link>
          <Link href="/tools/base64" className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium">
            Base64 Encoder / Decoder
          </Link>
          <Link href="/tools/json" className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium">
            JSON Formatter
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border p-5">
          <h2 className="text-xl font-semibold">Privacy First</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sensitive payloads and secrets stay in your browser. Useful when token data should not be copied into chat tools.
          </p>
        </article>
        <article className="rounded-xl border p-5">
          <h2 className="text-xl font-semibold">Faster Than Prompting</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Bookmark, paste, inspect, and copy. No conversational setup required for repetitive engineering tasks.
          </p>
        </article>
        <article className="rounded-xl border p-5">
          <h2 className="text-xl font-semibold">Built for Daily Flow</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            JWT, Base64, URL, JSON, hashing, UUID, and QR tools in one place with consistent UX and instant feedback.
          </p>
        </article>
      </section>

      <ToolsGrid />

      <section className="space-y-4 rounded-xl border p-6">
        <h2 className="text-2xl font-semibold">Why Developers Keep This Open</h2>
        <p className="text-muted-foreground">
          AI is excellent for generating code and explanations. This directory is built for fast deterministic utilities where
          you want exact transformations, quick verification, and minimal context switching.
        </p>
        <div className="space-y-3">
          {faqItems.map((item) => (
            <article key={item.question} className="rounded-lg bg-muted/30 p-4">
              <h3 className="text-base font-semibold">{item.question}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
