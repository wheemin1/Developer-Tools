"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Copy, RefreshCw } from "lucide-react"

const SECRET_SIZES = [
  { label: "128-bit (16 bytes)", value: 16 },
  { label: "256-bit (32 bytes)", value: 32 },
  { label: "512-bit (64 bytes)", value: 64 },
] as const

export function JWTSecretKeyGenerator() {
  const [size, setSize] = useState("32")
  const [secret, setSecret] = useState("")
  const [copyState, setCopyState] = useState<"idle" | "success" | "error">("idle")

  const bytesToBase64 = (bytes: Uint8Array) => {
    let binary = ""
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte)
    })
    return btoa(binary)
  }

  const generateSecret = () => {
    const bytes = new Uint8Array(Number(size))
    crypto.getRandomValues(bytes)
    setSecret(bytesToBase64(bytes))
    setCopyState("idle")
  }

  const copySecret = async () => {
    if (!secret) return
    try {
      await navigator.clipboard.writeText(secret)
      setCopyState("success")
      setTimeout(() => setCopyState("idle"), 2000)
    } catch {
      setCopyState("error")
    }
  }

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">JWT Secret Key Generator</h2>
        <p className="text-sm text-muted-foreground">
          Generate Base64-encoded secrets for HS256/384/512 signing. Keys are generated locally.
        </p>
      </section>

      <div className="grid gap-4">
        <div className="grid gap-2 max-w-sm">
          <Label>Secret size</Label>
          <Select value={size} onValueChange={setSize}>
            <SelectTrigger>
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {SECRET_SIZES.map((item) => (
                <SelectItem key={item.value} value={String(item.value)}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" className="gap-2" onClick={generateSecret}>
            <RefreshCw className="h-4 w-4" />
            Generate
          </Button>
          <Button type="button" variant="outline" className="gap-2" onClick={copySecret} disabled={!secret}>
            <Copy className="h-4 w-4" />
            {copyState === "success" ? "Copied!" : "Copy"}
          </Button>
        </div>
        {copyState === "error" && (
          <p className="text-xs text-rose-600 dark:text-rose-400">
            Clipboard access failed. Use HTTPS and allow clipboard permissions.
          </p>
        )}

        <div className="space-y-2">
          <Label>Generated Base64 secret</Label>
          <Textarea
            readOnly
            value={secret}
            placeholder="Generate a secret to see it here"
            className="font-mono text-xs min-h-[120px] bg-muted/30"
          />
        </div>
      </div>
    </div>
  )
}
