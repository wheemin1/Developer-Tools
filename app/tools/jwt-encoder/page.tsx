import { ToolLanding } from "@/components/seo/tool-landing"

export const metadata = {
  title: "JWT Encoder | Create & Sign Tokens Online",
  description:
    "JWT encoder for HS256/384/512. Create, sign, and verify JSON Web Tokens instantly in your browser.",
  keywords: ["jwt encoder", "jwt token encoder", "encode jwt online", "jwt signer"],
  openGraph: {
    title: "JWT Encoder",
    description: "Create and sign JWT tokens with HS256/384/512.",
    images: ["/og/og-jwt-encoder.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "JWT Encoder",
    description: "Create and sign JWT tokens with HS256/384/512.",
    images: ["/og/og-jwt-encoder.svg"],
  },
}

export default function Page() {
  return (
    <ToolLanding
      title="JWT Encoder"
      description="Create and sign JSON Web Tokens in the browser. Supports HS256/384/512 and instant verification."
      slug="jwt"
      highlights={["HS256/384/512 signing", "Client-side only", "Paste payload JSON and generate"]}
      relatedLinks={[
        { href: "/tools/jwt-encoder-online", label: "JWT Encoder Online" },
        { href: "/tools/jwt-token-encoder", label: "JWT Token Encoder" },
        { href: "/tools/encode-jwt-online", label: "Encode JWT Online" },
        { href: "/tools/jwt-secret-key-generator-base64", label: "JWT Secret Key Generator (Base64)" },
      ]}
      faqs={[
        {
          question: "How do I encode a JWT?",
          answer: "Paste header and payload JSON, enter a secret, and copy the generated token.",
        },
        {
          question: "Does this support HS256?",
          answer: "Yes. HS256/384/512 are supported.",
        },
      ]}
    />
  )
}
