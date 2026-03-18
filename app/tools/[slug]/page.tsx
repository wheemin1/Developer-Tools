import { ALL_TOOLS, TOOL_CATEGORIES } from "@/lib/constants"
import { notFound } from "next/navigation"

import { ToolRenderer } from "@/components/tool-renderer"

const SEO_OVERRIDES: Record<string, { title: string; description: string; keywords: string[] }> = {
  jwt: {
    title: "JWT Encoder Online | Decode & Sign Tokens",
    description:
      "Create, decode, and verify JSON Web Tokens in your browser. Supports HS256/384/512 signing and instant token decoding.",
    keywords: ["jwt encoder online", "jwt token encoder", "jwt encode online", "jwt decoder", "jwt signer"],
  },
  qr: {
    title: "QR Code Generator | Base64 QR Code Generator",
    description:
      "Generate QR codes for URLs, text, or Base64 strings. Download PNG instantly with error correction options.",
    keywords: ["qr code generator", "base64 qr code generator", "qr code creator", "qr code online"],
  },
  base64: {
    title: "Base64 Encoder Online | Encode & Decode",
    description:
      "Encode or decode Base64 instantly. Works with text and files directly in your browser.",
    keywords: ["base64 encoder", "base64 decoder", "base64 encode online", "base64 converter"],
  },
}

// Static generation for all tool routes
export function generateStaticParams() {
  const routes: { slug: string }[] = []
  TOOL_CATEGORIES.forEach((category) => {
    category.tools.forEach((tool) => {
      routes.push({ slug: tool.id })
    })
  })
  return routes
}

type ToolPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ToolPageProps) {
  const { slug } = await params
  const tool = ALL_TOOLS.find((item) => item.id === slug)

  if (!tool) {
    return {
      title: "Tool Not Found | Developer Tools",
      description: "The requested developer tool could not be found.",
    }
  }

  const override = SEO_OVERRIDES[tool.id]
  if (override) {
    return override
  }

  // Use custom SEO fields if they exist, fallback to generated standard SEO
  return {
    title: `${tool.name} | Developer Tools`,
    description: tool.description,
    keywords: [tool.name.toLowerCase(), "developer tool", "online tool", "free tool"],
  }
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params
  const tool = ALL_TOOLS.find((item) => item.id === slug)

  if (!tool) {
    notFound()
  }

  return (
    <div className="flex flex-col w-full h-full">
      <ToolRenderer slug={slug} />
    </div>
  )
}
