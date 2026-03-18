"use client"

import { useEffect } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import type { ComponentType } from "react"
import { ALL_TOOLS } from "@/lib/constants"
import type { ToolId } from "@/lib/constants"
import { notFound } from "next/navigation"
import { TOOL_FAILURE_CASES, TOOL_WORKFLOW_GRAPH } from "@/lib/seo/tool-content"
import { trackEvent } from "@/lib/analytics"

function ToolLoadingState() {
  return <div className="rounded-xl border p-6 text-sm text-muted-foreground">Loading tool module...</div>
}

const TOOL_COMPONENTS = {
  url: dynamic(() => import("@/components/tools/url-encoder-decoder").then((module) => module.URLEncoderDecoder), {
    loading: ToolLoadingState,
  }),
  base64: dynamic(() => import("@/components/tools/base64-encoder-decoder").then((module) => module.Base64EncoderDecoder), {
    loading: ToolLoadingState,
  }),
  jwt: dynamic(() => import("@/components/tools/jwt-decoder").then((module) => module.JWTDecoder), {
    loading: ToolLoadingState,
  }),
  json: dynamic(() => import("@/components/tools/json-formatter").then((module) => module.JSONFormatter), {
    loading: ToolLoadingState,
  }),
  case: dynamic(() => import("@/components/tools/text-case-converter").then((module) => module.TextCaseConverter), {
    loading: ToolLoadingState,
  }),
  whitespace: dynamic(() => import("@/components/tools/whitespace-cleaner").then((module) => module.WhitespaceCleaner), {
    loading: ToolLoadingState,
  }),
  hash: dynamic(() => import("@/components/tools/hash-generator").then((module) => module.HashGenerator), {
    loading: ToolLoadingState,
  }),
  uuid: dynamic(() => import("@/components/tools/uuid-generator").then((module) => module.UUIDGenerator), {
    loading: ToolLoadingState,
  }),
  qr: dynamic(() => import("@/components/tools/qr-code-generator").then((module) => module.QRCodeGenerator), {
    loading: ToolLoadingState,
  }),
  "jwt-secret": dynamic(
    () => import("@/components/tools/jwt-secret-key-generator").then((module) => module.JWTSecretKeyGenerator),
    {
      loading: ToolLoadingState,
    },
  ),
} satisfies Record<ToolId, ComponentType>

const TOOL_USE_CASES: Record<ToolId, string> = {
  url: "Quick URL encode/decode for redirect and query debugging.",
  base64: "Fast Base64 checks for payloads, headers, and files.",
  jwt: "Token decode/verify/sign flow without leaving the browser.",
  json: "Validate and format payloads before shipping requests.",
  case: "Convert naming styles for API and code conventions.",
  whitespace: "Clean copied logs and multiline text in one pass.",
  hash: "Generate stable digests for integrity checks.",
  uuid: "Create IDs quickly for test and fixture workflows.",
  qr: "Generate scan-ready QR codes for links and handoff.",
  "jwt-secret": "Create strong Base64 secrets for HS signing.",
}

export function ToolRenderer({ slug }: { slug: string }) {
  const toolInfo = ALL_TOOLS.find((tool) => tool.id === slug)
  const currentToolId = slug as ToolId

  useEffect(() => {
    if (!toolInfo) return
    trackEvent("tool_view", { tool: currentToolId })
  }, [currentToolId, toolInfo])

  if (!toolInfo) return notFound()

  const ActiveComponent = TOOL_COMPONENTS[slug as ToolId]

  if (!ActiveComponent) return notFound()

  const relatedToolIds = TOOL_WORKFLOW_GRAPH[currentToolId] ?? []
  const relatedLinks = relatedToolIds
    .map((toolId) => ALL_TOOLS.find((tool) => tool.id === toolId))
    .filter((tool): tool is (typeof ALL_TOOLS)[number] => Boolean(tool))
    .map((tool) => ({ href: `/tools/${tool.id}`, label: tool.name }))

  const failureCases = TOOL_FAILURE_CASES[currentToolId] ?? []

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b">
        <h1 className="text-3xl font-bold tracking-tight">{toolInfo.name}</h1>
        <p className="text-muted-foreground mt-2">{toolInfo.description}</p>
      </div>
      {relatedLinks.length > 0 && (
        <section className="rounded-xl border p-4 bg-card/40 space-y-2">
          <h2 className="text-base font-semibold">Related Workflow</h2>
          <div className="flex flex-wrap gap-2 text-sm">
            {relatedLinks.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-full border px-3 py-1.5 hover:bg-muted">
                {link.label}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-xl border p-4 bg-card/50 space-y-1.5">
        <h2 className="text-base font-semibold">Quick Note</h2>
        <p className="text-sm text-muted-foreground">{TOOL_USE_CASES[slug as ToolId]}</p>
        <p className="text-xs text-muted-foreground">Local processing. No prompt loop.</p>
      </section>

      {failureCases.length > 0 && (
        <section className="rounded-xl border p-4">
          <details>
            <summary className="cursor-pointer text-sm font-semibold">Failure Cases (quick fixes)</summary>
            <div className="mt-3 space-y-3">
              {failureCases.map((failureCase) => (
                <article key={failureCase.issue} className="rounded-lg bg-muted/30 p-3">
                  <h3 className="text-sm font-semibold">{failureCase.issue}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">Cause: {failureCase.reason}</p>
                  <p className="mt-1 text-xs">Fix: {failureCase.fix}</p>
                </article>
              ))}
            </div>
          </details>
        </section>
      )}

      <div className="pt-4">
        <ActiveComponent />
      </div>
    </div>
  )
}
