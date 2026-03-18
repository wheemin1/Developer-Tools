"use client"

import { useEffect, useRef, useState } from "react"
import { jwtVerify, SignJWT, decodeJwt, decodeProtectedHeader } from "jose"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, AlertCircle, ShieldCheck, ShieldAlert, Check } from "lucide-react"
import { trackEvent } from "@/lib/analytics"

export function JWTDecoder() {
  const [activeTab, setActiveTab] = useState("decode")
    const verifyRequestIdRef = useRef(0)
    const encodeRequestIdRef = useRef(0)

  // Decode State
  const [tokenInput, setTokenInput] = useState("")
  const [decodedHeader, setDecodedHeader] = useState("")
  const [decodedPayload, setDecodedPayload] = useState("")
  const [decodeSecret, setDecodeSecret] = useState("")
  const [verifyStatus, setVerifyStatus] = useState<"none" | "valid" | "invalid">("none")
  const [decodeError, setDecodeError] = useState("")
    const [copiedToken, setCopiedToken] = useState(false)
    const [copiedSecret, setCopiedSecret] = useState(false)
    const [copyError, setCopyError] = useState("")

  // Encode State
  const [selectedAlgo, setSelectedAlgo] = useState("HS256")
  const [encodeHeader, setEncodeHeader] = useState(`{\n  "alg": "HS256",\n  "typ": "JWT"\n}`)
  const [encodePayload, setEncodePayload] = useState(`{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}`)
  const [encodeSecret, setEncodeSecret] = useState("your-256-bit-secret")
  const [generatedToken, setGeneratedToken] = useState("")
  const [encodeError, setEncodeError] = useState("")
    const [generatedSecret, setGeneratedSecret] = useState("")

    const handleTabChange = (value: string) => {
        setActiveTab(value)
        trackEvent("tool_switch", { tool: "jwt", tab: value })
    }

    const bytesToBase64 = (bytes: Uint8Array) => {
        let binary = ""
        bytes.forEach((byte) => {
            binary += String.fromCharCode(byte)
        })
        return btoa(binary)
    }

  // DECODE LOGIC
  useEffect(() => {
    if (!tokenInput.trim()) {
      setDecodedHeader("")
      setDecodedPayload("")
      setVerifyStatus("none")
      setDecodeError("")
      return
    }

    try {
      const header = decodeProtectedHeader(tokenInput)
      const payload = decodeJwt(tokenInput)

      setDecodedHeader(JSON.stringify(header, null, 2))
      setDecodedPayload(JSON.stringify(payload, null, 2))
      setDecodeError("")
            setCopyError("")

      if (decodeSecret.trim() && header.alg && header.alg.startsWith("HS")) {
        verifyToken(tokenInput, decodeSecret)
      } else if (decodeSecret.trim()) {
                setVerifyStatus("invalid")
      } else {
        setVerifyStatus("none")
      }
        } catch {
      setDecodeError("Invalid JWT Format")
      setDecodedHeader("")
      setDecodedPayload("")
      setVerifyStatus("none")
    }
  }, [tokenInput, decodeSecret])

  const verifyToken = async (token: string, secret: string) => {
        const requestId = ++verifyRequestIdRef.current
    try {
      const secretKey = new TextEncoder().encode(secret)
      await jwtVerify(token, secretKey)
            if (requestId !== verifyRequestIdRef.current) return
      setVerifyStatus("valid")
    trackEvent("process_success", { eventName: "jwt_verify" })
        } catch {
            if (requestId !== verifyRequestIdRef.current) return
      setVerifyStatus("invalid")
    trackEvent("process_failure", { eventName: "jwt_verify" })
    }
  }

  // ENCODE LOGIC
  useEffect(() => {
        const requestId = ++encodeRequestIdRef.current

    const generateToken = async () => {
      try {
        if (!encodeHeader.trim() || !encodePayload.trim()) return

        const pHeader = JSON.parse(encodeHeader)
        const pPayload = JSON.parse(encodePayload)

        if (!pHeader.alg || !pHeader.alg.startsWith("HS")) {
                    if (requestId !== encodeRequestIdRef.current) return
                    setEncodeError("Algorithm not supported for symmetric signing. Use HS256, HS384, or HS512.")
                    setGeneratedToken("")
                    return
        }

                const secretKey = new TextEncoder().encode(encodeSecret)

                const jwt = await new SignJWT(pPayload).setProtectedHeader(pHeader).sign(secretKey)

                if (requestId !== encodeRequestIdRef.current) return
                setGeneratedToken(jwt)
                setEncodeError("")
                                trackEvent("process_success", { eventName: "jwt_encode" })
            } catch (err: unknown) {
                if (requestId !== encodeRequestIdRef.current) return
                const message = err instanceof Error ? err.message : "Unknown error"
                setEncodeError("Invalid JSON or Encoding Error: " + message)
                                trackEvent("process_failure", { eventName: "jwt_encode" })
        setGeneratedToken("")
      }
    }

    generateToken()
  }, [encodeHeader, encodePayload, encodeSecret, selectedAlgo])

  const handleAlgoChange = (val: string) => {
    setSelectedAlgo(val)
    try {
            const header = JSON.parse(encodeHeader)
            header.alg = val
            setEncodeHeader(JSON.stringify(header, null, 2))
            setEncodeError("")
        } catch {
            setEncodeHeader(JSON.stringify({ alg: val, typ: "JWT" }, null, 2))
            setEncodeError("Header JSON was reset to match selected algorithm.")
        }
  }

    const copyToClipboard = async (text: string, type: "token" | "secret") => {
        if (!text) return

        try {
            await navigator.clipboard.writeText(text)
            setCopyError("")
            trackEvent("copy_success", { tool: "jwt", type })

            if (type === "token") {
                setCopiedToken(true)
                setTimeout(() => setCopiedToken(false), 2000)
                return
            }

            setCopiedSecret(true)
            setTimeout(() => setCopiedSecret(false), 2000)
        } catch {
            setCopyError("Clipboard access failed. Use a secure context (HTTPS) and allow permissions.")
            trackEvent("copy_failure", { tool: "jwt", type })
        }
  }

    const generateBase64Secret = () => {
        const bytes = new Uint8Array(32)
        crypto.getRandomValues(bytes)
        const secret = bytesToBase64(bytes)
        setGeneratedSecret(secret)
        setEncodeSecret(secret)
        setCopyError("")
        trackEvent("process_success", { eventName: "jwt_secret_generate" })
    }

  const loadSampleToken = () => {
        const sample =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
        setTokenInput(sample)
        setDecodeSecret("your-256-bit-secret")
        trackEvent("sample_load", { tool: "jwt" })
  }

  return (
    <div className="w-full h-full max-w-none">
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-6 grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="decode">Decode JWT</TabsTrigger>
          <TabsTrigger value="encode">Encode / Generate</TabsTrigger>
        </TabsList>

        <TabsContent value="decode" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Decode Left: Input */}
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <Label htmlFor="token-input" className="text-base">JWT String</Label>
                            <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground" onClick={loadSampleToken}>
                                Load Sample Token
                            </Button>
                        </div>
                        <Textarea 
                            id="token-input"
                            value={tokenInput}
                            onChange={(e) => setTokenInput(e.target.value)}
                            placeholder="Paste your JWT (ey...) here"
                            className="font-mono text-sm min-h-[400px] break-all whitespace-pre-wrap focus-visible:ring-1"
                        />
                    </div>
                </div>

                {/* Decode Right: Output */}
                <div className="space-y-6">
                    {decodeError && (
                        <Alert variant="destructive" className="py-3">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle className="text-sm font-semibold">Error</AlertTitle>
                            <AlertDescription className="text-xs">{decodeError}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label>Header <span className="text-muted-foreground text-xs font-normal ml-2">(Algorithm & Token Type)</span></Label>
                        <Textarea 
                            readOnly
                            value={decodedHeader}
                            className="font-mono text-sm bg-muted/30 text-rose-500 dark:text-rose-400 min-h-[120px] focus-visible:ring-0"
                            placeholder="Decoded header..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Payload <span className="text-muted-foreground text-xs font-normal ml-2">(Data Claims)</span></Label>
                        <Textarea 
                            readOnly
                            value={decodedPayload}
                            className="font-mono text-sm bg-muted/30 text-indigo-600 dark:text-indigo-400 min-h-[160px] focus-visible:ring-0"
                            placeholder="Decoded payload..."
                        />
                    </div>

                    <div className="space-y-2 pt-2 border-t">
                         <Label>Verify Signature</Label>
                         <div className="flex gap-4">
                             <Input 
                                type="text"
                                placeholder="Enter secret (for HS256/384/512)"
                                value={decodeSecret}
                                onChange={(e) => setDecodeSecret(e.target.value)}
                                className="font-mono focus-visible:ring-1"
                             />
                         </div>
                         <div className="h-6 mt-1 flex items-center">
                            {verifyStatus === "valid" && (
                                <span className="flex items-center text-teal-600 dark:text-teal-500 text-sm font-medium">
                                    <ShieldCheck className="h-4 w-4 mr-1.5" /> Signature Verified
                                </span>
                            )}
                            {verifyStatus === "invalid" && (
                                <span className="flex items-center text-rose-600 dark:text-rose-500 text-sm font-medium">
                                    <ShieldAlert className="h-4 w-4 mr-1.5" /> Invalid Signature
                                </span>
                            )}
                         </div>
                    </div>
                </div>
            </div>
        </TabsContent>

        <TabsContent value="encode" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Encode Left: Inputs */}
                <div className="space-y-6">
                    <div className="space-y-2">
                         <div className="flex justify-between items-center mb-1">
                            <Label>Header <span className="text-muted-foreground text-xs font-normal ml-2">(JSON)</span></Label>
                            <Select value={selectedAlgo} onValueChange={handleAlgoChange}>
                                <SelectTrigger className="w-[120px] h-8 text-xs font-mono">
                                    <SelectValue placeholder="Algorithm" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="HS256">HS256</SelectItem>
                                    <SelectItem value="HS384">HS384</SelectItem>
                                    <SelectItem value="HS512">HS512</SelectItem>
                                </SelectContent>
                            </Select>
                         </div>
                         <Textarea 
                            value={encodeHeader}
                            onChange={(e) => setEncodeHeader(e.target.value)}
                            className="font-mono text-sm text-rose-500 dark:text-rose-400 min-h-[120px] focus-visible:ring-1"
                            spellCheck={false}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Payload <span className="text-muted-foreground text-xs font-normal ml-2">(JSON Claims)</span></Label>
                         <Textarea 
                            value={encodePayload}
                            onChange={(e) => setEncodePayload(e.target.value)}
                            className="font-mono text-sm text-indigo-600 dark:text-indigo-400 min-h-[180px] focus-visible:ring-1"
                            spellCheck={false}
                        />
                    </div>

                     <div className="space-y-2 pt-2 border-t">
                        <Label>Sign with Secret</Label>
                         <Input 
                            value={encodeSecret}
                            onChange={(e) => setEncodeSecret(e.target.value)}
                            className="font-mono border-blue-200 dark:border-blue-900 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400"
                        />
                    </div>

                                        <div className="space-y-2 pt-2 border-t">
                                            <Label>JWT Secret Key Generator (Base64)</Label>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex gap-2">
                                                    <Button type="button" variant="outline" size="sm" onClick={generateBase64Secret}>
                                                        Generate
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => copyToClipboard(generatedSecret, "secret")}
                                                        disabled={!generatedSecret}
                                                    >
                                                        {copiedSecret ? "Copied!" : "Copy"}
                                                    </Button>
                                                </div>
                                                <Textarea
                                                    readOnly
                                                    value={generatedSecret}
                                                    placeholder="Generated Base64 secret will appear here"
                                                    className="font-mono text-xs min-h-[80px] bg-muted/30"
                                                />
                                            </div>
                                        </div>
                </div>

                {/* Encode Right: Output Token */}
                <div className="space-y-4 max-h-[600px] flex flex-col">
                    <div className="flex justify-between items-center mb-1">
                        <Label>Encoded JWT</Label>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 gap-2 bg-background hover:bg-muted"
                            onClick={() => copyToClipboard(generatedToken, "token")}
                            disabled={!generatedToken}
                        >
                            {copiedToken ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            {copiedToken ? "Copied!" : "Copy Token"}
                        </Button>
                    </div>
                    {copyError && <p className="text-xs text-rose-600 dark:text-rose-400">{copyError}</p>}
                    {encodeError ? (
                         <Alert variant="destructive" className="py-3">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle className="text-sm font-semibold">Encoding Error</AlertTitle>
                            <AlertDescription className="text-xs">{encodeError}</AlertDescription>
                        </Alert>
                    ) : (
                        <div className="relative flex-1 min-h-[400px]">
                            <Textarea 
                                readOnly
                                value={generatedToken}
                                className="absolute inset-0 font-mono text-sm bg-muted/30 break-all whitespace-pre-wrap h-full resize-none focus-visible:ring-0"
                                placeholder="Encoded token will appear here..."
                            />
                        </div>
                    )}
                </div>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
