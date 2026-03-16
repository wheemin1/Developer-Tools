import { ToolLanding } from "@/components/seo/tool-landing"

export const metadata = {
  title: "JWT Encoder Online | Encode JWT Tokens",
  description:
    "Encode JWT online with HS256/384/512. Build headers, payloads, and signatures instantly.",
  keywords: ["jwt encoder online", "jwt encode online", "encode jwt online"],
  openGraph: {
    title: "JWT Encoder Online",
    description: "Encode JWT online with HS256/384/512.",
    images: ["/og/og-jwt-encoder-online.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "JWT Encoder Online",
    description: "Encode JWT online with HS256/384/512.",
    images: ["/og/og-jwt-encoder-online.svg"],
  },
}

export default function Page() {
  return (
    <ToolLanding
      title="JWT Encoder Online"
      description="Encode JWT tokens online in your browser. Build header and payload JSON, then sign with a secret."
      slug="jwt"
      highlights={["No uploads", "Instant output", "Decode + verify included"]}
      relatedLinks={[
        { href: "/tools/jwt-encoder", label: "JWT Encoder" },
        { href: "/tools/jwt-token-encoder", label: "JWT Token Encoder" },
        { href: "/tools/encode-jwt-online", label: "Encode JWT Online" },
        { href: "/tools/jwt-secret-key-generator-base64", label: "JWT Secret Key Generator (Base64)" },
      ]}
      faqs={[
        {
          question: "Is this JWT encoder online free?",
          answer: "Yes. All tools are free and run locally in your browser.",
        },
        {
          question: "Does it verify signatures?",
          answer: "Yes. Enter a secret to verify HS256/384/512 tokens.",
        },
      ]}
    />
  )
}
