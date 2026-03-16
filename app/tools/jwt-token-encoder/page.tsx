import { ToolLanding } from "@/components/seo/tool-landing"

export const metadata = {
  title: "JWT Token Encoder | Generate Tokens",
  description:
    "JWT token encoder with HS256/384/512 signing. Generate secure tokens from JSON payloads.",
  keywords: ["jwt token encoder", "jwt encoder", "encode jwt"],
  openGraph: {
    title: "JWT Token Encoder",
    description: "JWT token encoder with HS256/384/512 signing.",
    images: ["/og/og-jwt-token-encoder.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "JWT Token Encoder",
    description: "JWT token encoder with HS256/384/512 signing.",
    images: ["/og/og-jwt-token-encoder.svg"],
  },
}

export default function Page() {
  return (
    <ToolLanding
      title="JWT Token Encoder"
      description="Generate JWT tokens from header and payload JSON. Sign with a secret and verify instantly."
      slug="jwt"
      highlights={["Header + payload JSON", "Signature verification", "Client-side only"]}
      relatedLinks={[
        { href: "/tools/jwt-encoder", label: "JWT Encoder" },
        { href: "/tools/jwt-encoder-online", label: "JWT Encoder Online" },
        { href: "/tools/encode-jwt-online", label: "Encode JWT Online" },
        { href: "/tools/jwt-secret-key-generator-base64", label: "JWT Secret Key Generator (Base64)" },
      ]}
      faqs={[
        {
          question: "Can I decode the token here?",
          answer: "Yes. The decoder is built into the same tool.",
        },
        {
          question: "What token types are supported?",
          answer: "HS256/384/512 are supported in this tool.",
        },
      ]}
    />
  )
}
