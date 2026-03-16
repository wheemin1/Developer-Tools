import { ToolLanding } from "@/components/seo/tool-landing"

export const metadata = {
  title: "JWT Encode Online | Fast JWT Token Encoder",
  description:
    "Fast JWT encode online tool. Create, sign, and verify JWT tokens in seconds.",
  keywords: ["jwt encode online", "jwt encoder", "jwt token encoder"],
  openGraph: {
    title: "JWT Encode Online",
    description: "Fast JWT encode online tool for HS256/384/512.",
    images: ["/og/og-jwt-encode-online.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "JWT Encode Online",
    description: "Fast JWT encode online tool for HS256/384/512.",
    images: ["/og/og-jwt-encode-online.svg"],
  },
}

export default function Page() {
  return (
    <ToolLanding
      title="JWT Encode Online"
      description="Fast JWT encoding with HS256/384/512. Create and verify tokens without leaving your browser."
      slug="jwt"
      highlights={["HS256/384/512", "Copy token output", "Decode built in"]}
      relatedLinks={[
        { href: "/tools/jwt-encoder", label: "JWT Encoder" },
        { href: "/tools/jwt-encoder-online", label: "JWT Encoder Online" },
        { href: "/tools/jwt-token-encoder", label: "JWT Token Encoder" },
        { href: "/tools/jwt-secret-key-generator-base64", label: "JWT Secret Key Generator (Base64)" },
      ]}
      faqs={[
        {
          question: "Which algorithms are supported?",
          answer: "HS256, HS384, and HS512.",
        },
        {
          question: "Do you store tokens?",
          answer: "No. Everything stays in your browser.",
        },
      ]}
    />
  )
}
