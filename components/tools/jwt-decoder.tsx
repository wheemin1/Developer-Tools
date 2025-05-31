"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Copy, Check, Zap, AlertTriangle, CheckCircle, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useDebounce } from "@/hooks/use-debounce"

interface JWTParts {
  header: string
  payload: string
  signature: string
  headerDecoded: any
  payloadDecoded: any
}

export function JWTDecoder() {
  const [input, setInput] = useState("")
  const [jwtParts, setJwtParts] = useState<JWTParts | null>(null)
  const [liveMode, setLiveMode] = useState(true)
  const [copied, setCopied] = useState<string>("")
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [warnings, setWarnings] = useState<string[]>([])
  const { toast } = useToast()

  // Debounce input for live mode
  const debouncedInput = useDebounce(input, 300)

  // Decode JWT token
  const decodeJWT = useCallback((token: string) => {
    if (!token.trim()) {
      setJwtParts(null)
      setIsValid(null)
      setWarnings([])
      return
    }

    try {
      const parts = token.split(".")
      if (parts.length !== 3) {
        throw new Error("JWT must have exactly 3 parts separated by dots")
      }

      const [headerB64, payloadB64, signature] = parts

      // Decode header and payload - handle padding issues
      const decodeBase64 = (str: string) => {
        // Add padding if needed
        const padding = str.length % 4
        const paddedStr = padding ? str + "=".repeat(4 - padding) : str

        return atob(paddedStr.replace(/-/g, "+").replace(/_/g, "/"))
      }

      try {
        const headerDecoded = JSON.parse(decodeBase64(headerB64))
        const payloadDecoded = JSON.parse(decodeBase64(payloadB64))

        setJwtParts({
          header: headerB64,
          payload: payloadB64,
          signature,
          headerDecoded,
          payloadDecoded,
        })

        setIsValid(true)

        // Check for warnings
        const newWarnings: string[] = []

        // Check expiration
        if (payloadDecoded.exp) {
          const expDate = new Date(payloadDecoded.exp * 1000)
          const now = new Date()
          if (expDate < now) {
            newWarnings.push(`Token expired on ${expDate.toLocaleString()}`)
          } else {
            // Add expiry time remaining
            const diff = expDate.getTime() - now.getTime()
            const days = Math.floor(diff / (1000 * 60 * 60 * 24))
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

            if (days > 0) {
              newWarnings.push(`Token expires in ${days}d ${hours}h ${minutes}m`)
            } else if (hours > 0) {
              newWarnings.push(`Token expires in ${hours}h ${minutes}m`)
            } else {
              newWarnings.push(`Token expires in ${minutes}m`)
            }
          }
        } else {
          newWarnings.push("Token has no expiration date (exp)")
        }

        // Check not before
        if (payloadDecoded.nbf) {
          const nbfDate = new Date(payloadDecoded.nbf * 1000)
          if (nbfDate > new Date()) {
            newWarnings.push(`Token not valid until ${nbfDate.toLocaleString()} (nbf)`)
          }
        }

        // Check algorithm
        if (headerDecoded.alg === "none") {
          newWarnings.push("Token uses 'none' algorithm (not secure)")
        } else if (headerDecoded.alg === "HS256") {
          // This is a secure algorithm, but we can't verify the signature without the secret
          newWarnings.push("Token uses HS256 algorithm (cannot verify signature without secret)")
        }

        setWarnings(newWarnings)
      } catch (error) {
        throw new Error("Failed to parse JWT content: Invalid Base64 or JSON format")
      }
    } catch (error) {
      setJwtParts(null)
      setIsValid(false)
      setWarnings([error instanceof Error ? error.message : "Invalid JWT token"])
    }
  }, [])

  // Handle live mode processing
  useEffect(() => {
    if (liveMode) {
      decodeJWT(debouncedInput)
    }
  }, [debouncedInput, liveMode, decodeJWT])

  // Manual processing
  const handleManualProcess = useCallback(() => {
    decodeJWT(input)
  }, [input, decodeJWT])

  const handleCopy = useCallback(
    async (text: string, type: string) => {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(type)
        toast({
          title: "Copied!",
          description: `${type} copied to clipboard.`,
        })

        setTimeout(() => {
          setCopied("")
        }, 2000)
      } catch (error) {
        toast({
          title: "Copy Failed",
          description: "Failed to copy to clipboard.",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  const handleClear = useCallback(() => {
    setInput("")
    setJwtParts(null)
    setIsValid(null)
    setWarnings([])
  }, [])

  const loadSampleJWT = useCallback(() => {
    // Sample JWT token (header.payload.signature)
    const sampleJWT =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3MzM5NzEyMDB9.signature"
    setInput(sampleJWT)
  }, [])

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center space-x-3">
            <Switch checked={liveMode} onCheckedChange={setLiveMode} id="live-mode" />
            <label htmlFor="live-mode" className="flex items-center space-x-2 text-sm font-medium">
              <Zap className="h-4 w-4" />
              <span>Live Mode</span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            {isValid !== null && (
              <Badge variant={isValid ? "default" : "destructive"} className="flex items-center space-x-2 px-3 py-1">
                {isValid ? <CheckCircle className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                <span className="text-xs font-medium">{isValid ? "Valid JWT" : "Invalid JWT"}</span>
              </Badge>
            )}

            {warnings.length > 0 && (
              <Badge variant="secondary" className="flex items-center space-x-2 px-3 py-1">
                <AlertTriangle className="h-3 w-3" />
                <span className="text-xs font-medium">
                  {warnings.length} Warning{warnings.length > 1 ? "s" : ""}
                </span>
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={loadSampleJWT}>
            Sample JWT
          </Button>
        </div>
      </div>

      {/* Input Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">JWT Token</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear
          </Button>
        </div>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your JWT token here..."
          className="min-h-[140px] resize-none font-mono text-sm leading-relaxed"
        />
        {!liveMode && (
          <Button onClick={handleManualProcess} className="w-full h-11 text-base font-medium">
            Decode JWT
          </Button>
        )}
      </div>

      {/* JWT Details */}
      {jwtParts && (
        <div className="space-y-8 mt-8">
          {/* Header Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="text-blue-500 bg-blue-500/10 hover:bg-blue-500/20 border-blue-200">
                  HEADER
                </Badge>
                <h3 className="text-lg font-medium">Header</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(JSON.stringify(jwtParts.headerDecoded, null, 2), "Header")}
                className="text-muted-foreground"
              >
                {copied === "Header" ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="relative rounded-md overflow-hidden">
              <pre className="p-4 bg-muted/50 font-mono text-sm overflow-x-auto max-h-60 rounded-md">
                {JSON.stringify(jwtParts.headerDecoded, null, 2)}
              </pre>
              {/* Algorithm highlight */}
              {jwtParts.headerDecoded.alg && (
                <div className="absolute top-2 right-2">
                  <Badge
                    variant={jwtParts.headerDecoded.alg === "none" ? "destructive" : "secondary"}
                    className="font-mono text-xs"
                  >
                    {jwtParts.headerDecoded.alg}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Payload Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="text-purple-500 bg-purple-500/10 hover:bg-purple-500/20 border-purple-200">
                  PAYLOAD
                </Badge>
                <h3 className="text-lg font-medium">Payload</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(JSON.stringify(jwtParts.payloadDecoded, null, 2), "Payload")}
                className="text-muted-foreground"
              >
                {copied === "Payload" ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="relative rounded-md overflow-hidden">
              <pre className="p-4 bg-muted/50 font-mono text-sm overflow-x-auto max-h-60 rounded-md">
                {JSON.stringify(jwtParts.payloadDecoded, null, 2)}
              </pre>

              {/* Time-related claims */}
              <div className="absolute top-2 right-2 flex flex-col gap-2">
                {jwtParts.payloadDecoded.exp && (
                  <Badge
                    variant={new Date(jwtParts.payloadDecoded.exp * 1000) < new Date() ? "destructive" : "outline"}
                    className="font-mono text-xs"
                  >
                    exp: {formatTimestamp(jwtParts.payloadDecoded.exp)}
                  </Badge>
                )}
                {jwtParts.payloadDecoded.iat && (
                  <Badge variant="outline" className="font-mono text-xs">
                    iat: {formatTimestamp(jwtParts.payloadDecoded.iat)}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Signature Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="text-green-500 bg-green-500/10 hover:bg-green-500/20 border-green-200">
                  SIGNATURE
                </Badge>
                <h3 className="text-lg font-medium">Signature</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(jwtParts.signature, "Signature")}
                className="text-muted-foreground"
              >
                {copied === "Signature" ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="rounded-md overflow-hidden">
              <pre className="p-4 bg-muted/50 font-mono text-sm overflow-x-auto max-h-60 rounded-md">
                {jwtParts.signature}
              </pre>
            </div>
          </div>

          {/* Warnings and Verification */}
          {warnings.length > 0 && (
            <div className="rounded-md border border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-900/50 p-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mr-3 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-400">Verification Notes</h4>
                  <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
                    {warnings.map((warning, index) => (
                      <li key={index}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Info Section */}
      <div className="bg-gradient-to-r from-muted/30 to-muted/20 p-6 rounded-xl border">
        <h4 className="text-lg font-semibold mb-4">About JWT Tokens:</h4>
        <ul className="text-sm text-muted-foreground space-y-2 leading-relaxed">
          <li className="flex items-start space-x-2">
            <span className="font-semibold text-foreground mt-0.5">•</span>
            <span>
              <strong className="text-foreground">Header:</strong> Contains token type and signing algorithm
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="font-semibold text-foreground mt-0.5">•</span>
            <span>
              <strong className="text-foreground">Payload:</strong> Contains claims (user data, expiration, etc.)
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="font-semibold text-foreground mt-0.5">•</span>
            <span>
              <strong className="text-foreground">Signature:</strong> Verifies token integrity (requires secret key)
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="font-semibold text-foreground mt-0.5">•</span>
            <span>
              <strong className="text-foreground">Structure:</strong> header.payload.signature (Base64 encoded)
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}
