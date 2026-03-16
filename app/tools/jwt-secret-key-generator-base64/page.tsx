import { ToolLanding } from "@/components/seo/tool-landing"

export const metadata = {
  title: "JWT Secret Key Generator (Base64)",
  description:
    "Generate and verify JWT secrets in Base64. Create JWT tokens with HS256/384/512 securely in your browser.",
  keywords: ["jwt secret key generator base64", "jwt secret key", "jwt encoder"],
  openGraph: {
    title: "JWT Secret Key Generator (Base64)",
    description: "Generate Base64 JWT secrets for HS256/384/512.",
    images: ["/og/og-jwt-secret-key-base64.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "JWT Secret Key Generator (Base64)",
    description: "Generate Base64 JWT secrets for HS256/384/512.",
    images: ["/og/og-jwt-secret-key-base64.svg"],
  },
}

export default function Page() {
  return (
    <ToolLanding
      title="JWT Secret Key Generator (Base64)"
      description="Generate JWT secrets and create tokens with HS256/384/512. All processing happens locally in your browser."
      slug="jwt-secret"
      highlights={["Base64-friendly secrets", "HS256/384/512", "Decode + verify"]}
      relatedLinks={[
        { href: "/tools/jwt-secret-key-generator", label: "JWT Secret Key Generator" },
        { href: "/tools/jwt-encoder", label: "JWT Encoder" },
        { href: "/tools/encode-jwt-online", label: "Encode JWT Online" },
      ]}
      faqs={[
        {
          question: "What is a JWT secret key?",
          answer: "A secret key signs HS256/384/512 tokens. Keep it private.",
        },
        {
          question: "Is this Base64-safe?",
          answer: "Yes. The generated key is Base64-encoded.",
        },
      ]}
    />
  )
}
