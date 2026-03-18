"use client"

import { URLEncoderDecoder } from "@/components/tools/url-encoder-decoder"
import { Base64EncoderDecoder } from "@/components/tools/base64-encoder-decoder"
import { JSONFormatter } from "@/components/tools/json-formatter"
import { HashGenerator } from "@/components/tools/hash-generator"
import { JWTDecoder } from "@/components/tools/jwt-decoder"
import { UUIDGenerator } from "@/components/tools/uuid-generator"
import { TextCaseConverter } from "@/components/tools/text-case-converter"
import { WhitespaceCleaner } from "@/components/tools/whitespace-cleaner"
import { QRCodeGenerator } from "@/components/tools/qr-code-generator"
import { JWTSecretKeyGenerator } from "@/components/tools/jwt-secret-key-generator"
import Link from "next/link"
import type { ComponentType } from "react"
import { ALL_TOOLS } from "@/lib/constants"
import type { ToolId } from "@/lib/constants"
import { notFound } from "next/navigation"

const TOOL_COMPONENTS = {
  url: URLEncoderDecoder,
  base64: Base64EncoderDecoder,
  jwt: JWTDecoder,
  json: JSONFormatter,
  case: TextCaseConverter,
  whitespace: WhitespaceCleaner,
  hash: HashGenerator,
  uuid: UUIDGenerator,
  qr: QRCodeGenerator,
  "jwt-secret": JWTSecretKeyGenerator,
} satisfies Record<ToolId, ComponentType>

export function ToolRenderer({ slug }: { slug: string }) {
  const toolInfo = ALL_TOOLS.find((tool) => tool.id === slug)

  if (!toolInfo) return notFound()

  const ActiveComponent = TOOL_COMPONENTS[slug as ToolId]

  if (!ActiveComponent) return notFound()

  const relatedLinks =
    slug === "jwt"
      ? [
          { href: "/tools/jwt-encoder", label: "JWT Encoder" },
          { href: "/tools/jwt-encoder-online", label: "JWT Encoder Online" },
          { href: "/tools/jwt-token-encoder", label: "JWT Token Encoder" },
          { href: "/tools/encode-jwt-online", label: "Encode JWT Online" },
          { href: "/tools/jwt-secret-key-generator-base64", label: "JWT Secret Key Generator (Base64)" },
          { href: "/tools/jwt-secret-key-generator", label: "JWT Secret Key Generator" },
        ]
      : slug === "qr"
        ? [{ href: "/tools/base64-qr-code-generator", label: "Base64 QR Code Generator" }]
        : slug === "jwt-secret"
          ? [
              { href: "/tools/jwt-encoder", label: "JWT Encoder" },
              { href: "/tools/jwt-secret-key-generator-base64", label: "JWT Secret Key Generator (Base64)" },
            ]
        : []

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b">
        <h1 className="text-3xl font-bold tracking-tight">{toolInfo.name}</h1>
        <p className="text-muted-foreground mt-2">{toolInfo.description}</p>
      </div>
      {relatedLinks.length > 0 && (
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          {relatedLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </div>
      )}
      <div className="pt-4">
        <ActiveComponent />
      </div>
    </div>
  )
}
