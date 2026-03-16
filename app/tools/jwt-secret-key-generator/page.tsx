import { ToolLanding } from "@/components/seo/tool-landing"

export const metadata = {
  title: "JWT Secret Key Generator | Base64 Keys",
  description:
    "Generate Base64 JWT secrets for HS256/384/512 signing. Fast, private, and client-side only.",
  keywords: ["jwt secret key generator", "jwt secret", "base64 jwt key"],
  openGraph: {
    title: "JWT Secret Key Generator",
    description: "Generate Base64 JWT secrets for HS256/384/512 signing.",
    images: ["/og/og-jwt-secret-key.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "JWT Secret Key Generator",
    description: "Generate Base64 JWT secrets for HS256/384/512 signing.",
    images: ["/og/og-jwt-secret-key.svg"],
  },
}

export default function Page() {
  return (
    <ToolLanding
      title="JWT Secret Key Generator"
      description="Generate Base64 JWT secrets for HS256/384/512 signing. Runs locally in your browser."
      slug="jwt-secret"
      highlights={["Base64 output", "Selectable key sizes", "Client-side only"]}
      relatedLinks={[
        { href: "/tools/jwt-encoder", label: "JWT Encoder" },
        { href: "/tools/jwt-secret-key-generator-base64", label: "JWT Secret Key Generator (Base64)" },
      ]}
      faqs={[
        {
          question: "Which algorithm sizes are supported?",
          answer: "Use 256-bit for HS256, 384-bit for HS384, and 512-bit for HS512.",
        },
        {
          question: "Is the key generated on the server?",
          answer: "No. Keys are generated locally in your browser.",
        },
      ]}
    />
  )
}
