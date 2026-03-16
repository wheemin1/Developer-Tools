import { ToolLanding } from "@/components/seo/tool-landing"

export const metadata = {
  title: "Base64 QR Code Generator",
  description:
    "Generate QR codes from Base64 strings or URLs. Download PNG instantly with error correction options.",
  keywords: ["base64 qr code generator", "qr code generator", "base64 to qr"],
  openGraph: {
    title: "Base64 QR Code Generator",
    description: "Generate QR codes from Base64 strings or URLs.",
    images: ["/og/og-base64-qr.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Base64 QR Code Generator",
    description: "Generate QR codes from Base64 strings or URLs.",
    images: ["/og/og-base64-qr.svg"],
  },
}

export default function Page() {
  return (
    <ToolLanding
      title="Base64 QR Code Generator"
      description="Create QR codes from Base64 strings, text, or URLs. Instant preview and PNG download."
      slug="qr"
      highlights={["Base64 input supported", "Download PNG", "Error correction levels"]}
      relatedLinks={[
        { href: "/tools/qr", label: "QR Code Generator" },
        { href: "/tools/base64", label: "Base64 Encoder" },
      ]}
      faqs={[
        {
          question: "Can I generate a QR from Base64?",
          answer: "Yes. Paste any Base64 string and generate a QR code instantly.",
        },
        {
          question: "Can I download the QR code?",
          answer: "Yes. Use the Download PNG button in the preview panel.",
        },
      ]}
    />
  )
}
