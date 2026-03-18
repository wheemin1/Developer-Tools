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
  url: "Use this for redirect debugging, query normalization, and quickly testing encoded URL parameters.",
  base64: "Useful for API payload checks, auth header inspection, and safe binary-to-text conversion during debugging.",
  jwt: "Best for token debugging, local signature checks, and verifying claims without exposing secrets to third-party chat systems.",
  json: "Use this when validating payload shape, pretty-printing logs, or minifying JSON for transport tests.",
  case: "Handy for naming conversions across APIs, database fields, and frontend code conventions.",
  whitespace: "Great for cleanup of copied logs, CSV fragments, and multiline text before processing.",
  hash: "Generate deterministic fingerprints for integrity checks, fixtures, and quick content comparison.",
  uuid: "Generate UUIDs for test fixtures, id placeholders, and reproducible local QA scenarios.",
  qr: "Create scannable QR codes for links, auth bootstrapping, and quick mobile handoff flows.",
  "jwt-secret": "Generate strong Base64 secrets for HS256/384/512 signing in local development and staging.",
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
        <section className="rounded-xl border p-5 bg-card/40 space-y-3">
          <h2 className="text-xl font-semibold">Suggested Workflow Links</h2>
          <p className="text-sm text-muted-foreground">
            Move through related tools in one flow to debug faster without switching context.
          </p>
          <div className="flex flex-wrap gap-2 text-sm">
            {relatedLinks.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-full border px-3 py-1.5 hover:bg-muted">
                {link.label}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-xl border p-5 bg-card/50">
        <h2 className="text-xl font-semibold">Why Use This Tool Instead of AI Chat?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This workflow is optimized for immediate utility work: paste input, get deterministic output, and continue coding.
          No prompt engineering, no conversation overhead, and no ambiguity in repeated transformations.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Privacy-first design keeps data processing in-browser, which matters when handling tokens, secrets, or internal payloads.
        </p>
        <p className="mt-3 text-sm">{TOOL_USE_CASES[slug as ToolId]}</p>
      </section>

      {failureCases.length > 0 && (
        <section className="rounded-xl border p-5 space-y-3">
          <h2 className="text-xl font-semibold">Failure Case Library</h2>
          <p className="text-sm text-muted-foreground">
            Common failure patterns and direct fixes for this tool&apos;s workflow.
          </p>
          <div className="space-y-3">
            {failureCases.map((failureCase) => (
              <article key={failureCase.issue} className="rounded-lg bg-muted/30 p-4">
                <h3 className="text-base font-semibold">{failureCase.issue}</h3>
                <p className="mt-1 text-sm text-muted-foreground">Cause: {failureCase.reason}</p>
                <p className="mt-1 text-sm">Fix: {failureCase.fix}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <div className="pt-4">
        <ActiveComponent />
      </div>
    </div>
  )
}
