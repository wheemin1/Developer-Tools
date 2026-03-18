import type { Tool, ToolId } from "@/lib/constants"

export const TOOL_WORKFLOW_GRAPH: Record<ToolId, ToolId[]> = {
  url: ["base64", "json", "jwt"],
  base64: ["url", "json", "jwt"],
  jwt: ["jwt-secret", "base64", "json"],
  json: ["jwt", "url", "hash"],
  case: ["whitespace", "json", "url"],
  whitespace: ["case", "json", "url"],
  hash: ["uuid", "json", "jwt"],
  uuid: ["hash", "json", "jwt"],
  qr: ["url", "base64", "json"],
  "jwt-secret": ["jwt", "hash", "base64"],
}

export const TOOL_FAILURE_CASES: Record<ToolId, Array<{ issue: string; reason: string; fix: string }>> = {
  url: [
    {
      issue: "Double-encoded URL",
      reason: "Input was encoded more than once in a redirect chain.",
      fix: "Decode once, inspect the result, then re-encode only if transport requires it.",
    },
    {
      issue: "Malformed percent sequence",
      reason: "Input has incomplete hex escape values like %2 without final digit.",
      fix: "Locate broken percent sequences and correct to full escapes like %20.",
    },
  ],
  base64: [
    {
      issue: "Malformed Base64 input",
      reason: "Invalid characters or wrong padding length.",
      fix: "Ensure only Base64 characters are present and length is divisible by 4.",
    },
    {
      issue: "Unreadable decoded output",
      reason: "Input represents binary content, not plain UTF-8 text.",
      fix: "Treat decoded output as bytes or reprocess as file data.",
    },
  ],
  jwt: [
    {
      issue: "Invalid signature",
      reason: "Secret mismatch or token tampering.",
      fix: "Verify HS algorithm and secret source, then re-sign token.",
    },
    {
      issue: "Unsupported algorithm",
      reason: "Header uses asymmetric alg where current flow expects HS variants.",
      fix: "Use HS256/384/512 for symmetric signing in this workflow.",
    },
  ],
  json: [
    {
      issue: "Trailing comma parse error",
      reason: "JSON standard does not allow trailing commas.",
      fix: "Remove trailing commas in arrays and objects before formatting.",
    },
    {
      issue: "Comment syntax in JSON",
      reason: "Raw payload includes JavaScript-style comments.",
      fix: "Enable comment stripping or remove comments before parsing.",
    },
  ],
  case: [
    {
      issue: "Unexpected underscore or hyphen output",
      reason: "Input includes punctuation that affects token splitting.",
      fix: "Normalize punctuation first, then apply target case conversion.",
    },
    {
      issue: "Acronym casing inconsistency",
      reason: "Mixed uppercase words are interpreted as separate tokens.",
      fix: "Decide acronym style first and convert from a normalized base string.",
    },
  ],
  whitespace: [
    {
      issue: "Content collapsed too aggressively",
      reason: "Preset removed line breaks and extra spaces at once.",
      fix: "Use selective options or trim-only mode for safer cleanup.",
    },
    {
      issue: "Formatting lost in logs",
      reason: "Convert-to-single-space removed structural spacing.",
      fix: "Disable single-space conversion when preserving line context matters.",
    },
  ],
  hash: [
    {
      issue: "Hash mismatch between systems",
      reason: "Different algorithm or newline handling.",
      fix: "Confirm exact algorithm and canonicalize line endings before hashing.",
    },
    {
      issue: "Unexpected MD5 value",
      reason: "Input bytes differ from displayed text due to encoding assumptions.",
      fix: "Hash raw file bytes for binary inputs or normalize text encoding to UTF-8.",
    },
  ],
  uuid: [
    {
      issue: "UUID format rejected by downstream API",
      reason: "API expects specific format variant (hyphens, uppercase, braces).",
      fix: "Switch formatter to the API-required UUID representation.",
    },
    {
      issue: "Duplicate-like confusion in tests",
      reason: "Copied value from history did not refresh after generation.",
      fix: "Generate a fresh batch and copy from the latest visible item.",
    },
  ],
  qr: [
    {
      issue: "QR not scannable",
      reason: "Low size or high data density at weak error correction.",
      fix: "Increase canvas size and adjust error correction level.",
    },
    {
      issue: "Wrong destination after scan",
      reason: "Input contained hidden whitespace or stale sample text.",
      fix: "Trim input and re-generate after clearing previous content.",
    },
  ],
  "jwt-secret": [
    {
      issue: "Weak secret in signing workflow",
      reason: "Manual secret was short or predictable.",
      fix: "Generate at least 32-byte random Base64 secrets and rotate periodically.",
    },
    {
      issue: "Verification fails after secret generation",
      reason: "Different environments used different generated keys.",
      fix: "Use a single source of truth for signing keys across services.",
    },
  ],
}

export const TOOL_HOWTO_STEPS: Record<ToolId, Array<{ name: string; text: string }>> = {
  url: [
    { name: "Choose operation", text: "Select encode or decode mode based on your input." },
    { name: "Paste text", text: "Insert URL or plain text and review auto-detected mode if live mode is enabled." },
    { name: "Copy output", text: "Use the transformed value in requests, redirects, or debug logs." },
  ],
  base64: [
    { name: "Select mode", text: "Switch between encode and decode operations." },
    { name: "Add input", text: "Paste text or upload file content for conversion." },
    { name: "Use result", text: "Copy converted output for API calls, headers, or payload checks." },
  ],
  jwt: [
    { name: "Decode token", text: "Paste JWT to inspect header and payload claims." },
    { name: "Verify signature", text: "Provide secret for HS algorithms to validate token integrity." },
    { name: "Encode token", text: "Set JSON header and payload, then sign locally." },
  ],
  json: [
    { name: "Insert JSON", text: "Paste JSON payload from logs or API responses." },
    { name: "Validate and format", text: "Run formatter to inspect structure and syntax issues." },
    { name: "Copy cleaned output", text: "Copy pretty or minified JSON for the next debugging step." },
  ],
  case: [
    { name: "Input text", text: "Provide source text to convert." },
    { name: "Compare formats", text: "Review generated case variants side by side." },
    { name: "Copy target case", text: "Copy the exact casing style used in your codebase or API." },
  ],
  whitespace: [
    { name: "Paste raw text", text: "Insert text, logs, or copied content with inconsistent spacing." },
    { name: "Choose cleanup options", text: "Apply preset or toggle specific whitespace rules." },
    { name: "Copy cleaned content", text: "Export cleaned text for stable parsing and storage." },
  ],
  hash: [
    { name: "Provide input", text: "Paste text or upload file for hashing." },
    { name: "Review algorithms", text: "Compare MD5, SHA-1, SHA-256, SHA-384, and SHA-512 outputs." },
    { name: "Copy digest", text: "Use selected hash for integrity checks and fixtures." },
  ],
  uuid: [
    { name: "Generate UUID", text: "Create UUIDs instantly in your preferred format." },
    { name: "Batch generation", text: "Generate multiple UUIDs for test or seed workflows." },
    { name: "Copy values", text: "Copy one UUID or entire batch for implementation." },
  ],
  qr: [
    { name: "Paste URL or text", text: "Enter destination content for QR encoding." },
    { name: "Tune output", text: "Adjust size and error correction for scan reliability." },
    { name: "Download PNG", text: "Export QR code for docs, onboarding flows, or handoff screens." },
  ],
  "jwt-secret": [
    { name: "Select key size", text: "Choose desired secret length for HS signing." },
    { name: "Generate secure key", text: "Create random Base64 key in browser." },
    { name: "Copy and apply", text: "Copy secret and use it in JWT encode/verify workflows." },
  ],
}

export const TOOL_FAQ: Record<ToolId, Array<{ question: string; answer: string }>> = {
  url: [
    {
      question: "Does URL processing run in the browser?",
      answer: "Yes. Encoding and decoding happen locally without sending URL data to a backend.",
    },
    {
      question: "When should I decode before debugging?",
      answer: "Decode when values include percent escapes and look unreadable in query parameters or logs.",
    },
  ],
  base64: [
    {
      question: "Can I process files as Base64 here?",
      answer: "Yes. You can upload file content and convert it directly in-browser.",
    },
    {
      question: "Why does decoded output sometimes look broken?",
      answer: "The input can represent binary bytes rather than plain UTF-8 text.",
    },
  ],
  jwt: [
    {
      question: "Is JWT verification done locally?",
      answer: "Yes. Token decode and HS verification run in your browser.",
    },
    {
      question: "Which signing algorithms are supported?",
      answer: "HS256, HS384, and HS512 are supported in this symmetric signing flow.",
    },
  ],
  json: [
    {
      question: "Can this formatter validate invalid JSON?",
      answer: "It validates syntax and reports parsing errors with immediate feedback.",
    },
    {
      question: "Can I minify after formatting?",
      answer: "Yes. Toggle mode to minify and copy compact output for transport.",
    },
  ],
  case: [
    {
      question: "Which naming styles are supported?",
      answer: "camelCase, PascalCase, snake_case, kebab-case, title case, and uppercase variants.",
    },
    {
      question: "Can this help with API naming conventions?",
      answer: "Yes. Convert quickly between backend and frontend naming styles.",
    },
  ],
  whitespace: [
    {
      question: "Can I remove only extra spaces but keep line breaks?",
      answer: "Yes. Use individual cleanup options instead of aggressive presets.",
    },
    {
      question: "Is there a full compact mode?",
      answer: "Yes. The remove-all-whitespace preset creates the most compact output.",
    },
  ],
  hash: [
    {
      question: "Which hash algorithms are available?",
      answer: "MD5, SHA-1, SHA-256, SHA-384, and SHA-512 are supported.",
    },
    {
      question: "Can I hash binary files?",
      answer: "Yes. File hashing is byte-based and suitable for integrity checks.",
    },
  ],
  uuid: [
    {
      question: "Can I generate UUIDs in batches?",
      answer: "Yes. Batch generation is available for test and fixture workflows.",
    },
    {
      question: "Does generation use secure randomness?",
      answer: "Yes. It uses crypto.randomUUID when available with fallback handling.",
    },
  ],
  qr: [
    {
      question: "Can I generate QR codes for URLs and text?",
      answer: "Yes. Any text payload including URLs can be converted to QR code.",
    },
    {
      question: "How do I improve scan reliability?",
      answer: "Increase size and choose higher error correction when data density is high.",
    },
  ],
  "jwt-secret": [
    {
      question: "What key size should I use for JWT HS256?",
      answer: "Use at least 32 random bytes for HS256-class signing workflows.",
    },
    {
      question: "Is secret generation private?",
      answer: "Yes. Random key generation happens locally in your browser.",
    },
  ],
}

const SEARCH_INTENTS: Partial<Record<ToolId, string[]>> = {
  jwt: ["jwt encoder online", "jwt decoder", "jwt signature verify", "jwt debugger"],
  base64: ["base64 encode online", "base64 decode tool", "base64 converter"],
  json: ["json formatter", "json validator", "json minifier"],
  url: ["url encoder", "url decode", "query parameter encoding"],
  hash: ["hash generator", "sha256 hash", "md5 hash online"],
  uuid: ["uuid generator", "uuid v4 online"],
  qr: ["qr code generator", "qr png download"],
  case: ["case converter", "camel to snake case"],
  whitespace: ["whitespace cleaner", "remove extra spaces"],
  "jwt-secret": ["jwt secret generator", "base64 secret key"],
}

function templateVariant(slug: ToolId) {
  const score = slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return score % 2 === 0 ? "A" : "B"
}

export function buildToolSeo(tool: Tool) {
  const variant = templateVariant(tool.id)
  const intentKeywords = SEARCH_INTENTS[tool.id] ?? []

  const title =
    variant === "A"
      ? `${tool.name} Online | Fast, Privacy-First Developer Tool`
      : `${tool.name} | Free Browser-Based Workflow for Developers`

  const description =
    variant === "A"
      ? `${tool.description}. Run this workflow in your browser for quick, deterministic output without prompt overhead.`
      : `Use ${tool.name} for fast local developer workflows. Privacy-first browser processing with no signup and no server-side payload handling.`

  const keywords = [
    ...intentKeywords,
    tool.name.toLowerCase(),
    `${tool.shortName.toLowerCase()} tool`,
    "developer tools",
    "online developer utility",
    "client-side processing",
  ]

  return { title, description, keywords }
}

export function buildHowToSchemaForTool(tool: Tool) {
  const steps = TOOL_HOWTO_STEPS[tool.id]

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `${tool.name} Workflow`,
    description: tool.description,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  }
}

export function buildFaqSchemaForTool(tool: Tool) {
  const entries = TOOL_FAQ[tool.id]

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer,
      },
    })),
  }
}
