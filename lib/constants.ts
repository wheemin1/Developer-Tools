export const TOOL_CATEGORIES = [
  {
    name: "Encoding & Decoding",
    tools: [
      {
        id: "url",
        name: "URL Encoder",
        shortName: "URL",
        description: "Encode and decode URLs with real-time processing",
      },
      {
        id: "base64",
        name: "Base64 Encoder",
        shortName: "Base64",
        description: "Encode and decode Base64 strings",
      },
      {
        id: "jwt",
        name: "JWT Decoder",
        shortName: "JWT",
        description: "Decode and validate JSON Web Tokens",
      },
    ],
  },
  {
    name: "Text Processing",
    tools: [
      {
        id: "json",
        name: "JSON Formatter",
        shortName: "JSON",
        description: "Format, validate, and minify JSON data",
      },
      {
        id: "case",
        name: "Case Converter",
        shortName: "Case",
        description: "Convert between camelCase, snake_case, kebab-case, etc.",
      },
      {
        id: "whitespace",
        name: "Whitespace Cleaner",
        shortName: "Clean",
        description: "Remove line breaks, extra spaces, or tabs from text",
      },
    ],
  },
  {
    name: "Generators & Security",
    tools: [
      {
        id: "hash",
        name: "Hash Generator",
        shortName: "Hash",
        description: "Generate MD5, SHA-1, SHA-256, and other hashes",
      },
      {
        id: "uuid",
        name: "UUID Generator",
        shortName: "UUID",
        description: "Generate UUID v4 with crypto.randomUUID()",
      },
      {
        id: "qr",
        name: "QR Code Generator",
        shortName: "QR Code",
        description: "Generate scannable QR codes from text or URLs",
      },
    ],
  },
] as const

export const DEBOUNCE_DELAY = 300
export const COPY_FEEDBACK_DURATION = 2000
export const MAX_HISTORY_ITEMS = 10

export const HASH_ALGORITHMS = [
  { name: "MD5", id: "md5" },
  { name: "SHA-1", id: "sha1" },
  { name: "SHA-256", id: "sha256" },
  { name: "SHA-384", id: "sha384" },
  { name: "SHA-512", id: "sha512" },
] as const

export const CASE_CONVERSIONS = [
  {
    name: "camelCase",
    id: "camel",
    example: "helloWorldExample",
  },
  {
    name: "PascalCase",
    id: "pascal",
    example: "HelloWorldExample",
  },
  {
    name: "snake_case",
    id: "snake",
    example: "hello_world_example",
  },
  {
    name: "kebab-case",
    id: "kebab",
    example: "hello-world-example",
  },
  {
    name: "UPPER_CASE",
    id: "upper",
    example: "HELLO_WORLD_EXAMPLE",
  },
  {
    name: "lowercase",
    id: "lower",
    example: "hello world example",
  },
  {
    name: "UPPERCASE",
    id: "upperall",
    example: "HELLO WORLD EXAMPLE",
  },
  {
    name: "Title Case",
    id: "title",
    example: "Hello World Example",
  },
  {
    name: "Sentence case",
    id: "sentence",
    example: "Hello world example",
  },
] as const

export const QR_SIZES = [
  { label: "128x128", value: "128" },
  { label: "256x256", value: "256" },
  { label: "512x512", value: "512" },
  { label: "1024x1024", value: "1024" },
] as const

export const ERROR_CORRECTION_LEVELS = [
  { label: "Low (7%)", value: "L" },
  { label: "Medium (15%)", value: "M" },
  { label: "Quartile (25%)", value: "Q" },
  { label: "High (30%)", value: "H" },
] as const
