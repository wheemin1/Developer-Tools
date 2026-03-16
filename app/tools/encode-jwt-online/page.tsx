import { ToolLanding } from "@/components/seo/tool-landing"

export const metadata = {
  title: "Encode JWT Online | JWT Encoder",
  description:
    "Encode JWT online using HS256/384/512 signing. Instant JWT creation with browser-only processing.",
  keywords: ["encode jwt online", "jwt encoder online", "jwt encode online"],
  openGraph: {
    title: "Encode JWT Online",
    description: "Encode JWT online using HS256/384/512 signing.",
    images: ["/og/og-encode-jwt-online.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Encode JWT Online",
    description: "Encode JWT online using HS256/384/512 signing.",
    images: ["/og/og-encode-jwt-online.svg"],
  },
}

export default function Page() {
  return (
    <ToolLanding
      title="Encode JWT Online"
      description="Encode JWT online with fast signing and verification. Runs fully in your browser."
      slug="jwt"
      highlights={["Private, in-browser", "No signup", "Fast copy output"]}
      relatedLinks={[
        { href: "/tools/jwt-encoder", label: "JWT Encoder" },
        { href: "/tools/jwt-encoder-online", label: "JWT Encoder Online" },
        { href: "/tools/jwt-token-encoder", label: "JWT Token Encoder" },
        { href: "/tools/jwt-secret-key-generator-base64", label: "JWT Secret Key Generator (Base64)" },
      ]}
      faqs={[
        {
          question: "Is this JWT encoder secure?",
          answer: "All processing happens locally in your browser.",
        },
        {
          question: "Does it support HS512?",
          answer: "Yes. HS256/384/512 are supported.",
        },
      ]}
    />
  )
}
