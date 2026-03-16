"use client"

import { useState, useEffect } from "react"
import { jwtVerify, SignJWT, decodeJwt, decodeProtectedHeader } from "jose"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, AlertCircle, ShieldCheck, ShieldAlert, Check } from "lucide-react"

export function JWTDecoder() {
  const [activeTab, setActiveTab] = useState("decode")

  // Decode State
  const [tokenInput, setTokenInput] = useState("")
  const [decodedHeader, setDecodedHeader] = useState("")
  const [decodedPayload, setDecodedPayload] = useState("")
  const [decodeSecret, setDecodeSecret] = useState("")
  const [verifyStatus, setVerifyStatus] = useState<"none" | "valid" | "invalid">("none")
  const [decodeError, setDecodeError] = useState("")
  const [copied, setCopied] = useState(false)

  // Encode State
  const [selectedAlgo, setSelectedAlgo] = useState("HS256")
  const [encodeHeader, setEncodeHeader] = useState(`{\n  "alg": "HS256",\n  "typ": "JWT"\n}`)
  const [encodePayload, setEncodePayload] = useState(`{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}`)
  const [encodeSecret, setEncodeSecret] = useState("your-256-bit-secret")
  const [generatedToken, setGeneratedToken] = useState("")
  const [encodeError, setEncodeError] = useState("")
    const [generatedSecret, setGeneratedSecret] = useState("")

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

      if (decodeSecret.trim() && header.alg && header.alg.startsWith("HS")) {
        verifyToken(tokenInput, decodeSecret)
      } else if (decodeSecret.trim()) {
         setVerifyStatus("invalid")
      } else {
        setVerifyStatus("none")
      }
    } catch (err: any) {
      setDecodeError("Invalid JWT Format")
      setDecodedHeader("")
      setDecodedPayload("")
      setVerifyStatus("none")
    }
  }, [tokenInput, decodeSecret])

  const verifyToken = async (token: string, secret: string) => {
    try {
      const secretKey = new TextEncoder().encode(secret)
      await jwtVerify(token, secretKey)
      setVerifyStatus("valid")
    } catch (err) {
      setVerifyStatus("invalid")
    }
  }

  // ENCODE LOGIC
  useEffect(() => {
    const generateToken = async () => {
      try {
        if (!encodeHeader.trim() || !encodePayload.trim()) return

        const pHeader = JSON.parse(encodeHeader)
        const pPayload = JSON.parse(encodePayload)

        if (!pHeader.alg || !pHeader.alg.startsWith("HS")) {
            setEncodeError("Algorithm not supported for symmetric signing. Use HS256, HS384, or HS512.")
            setGeneratedToken("")
            return
        }

         const secretKey = new TextEncoder().encode(encodeSecret)
         
         const jwt = await new SignJWT(pPayload)
            .setProtectedHeader(pHeader)
            .sign(secretKey)
            
         setGeneratedToken(jwt)
         setEncodeError("")

      } catch (err: any) {
        setEncodeError("Invalid JSON or Encoding Error: " + err.message)
        setGeneratedToken("")
      }
    }

    generateToken()
  }, [encodeHeader, encodePayload, encodeSecret, selectedAlgo])

  const handleAlgoChange = (val: string) => {
    setSelectedAlgo(val)
    try {
        const h = JSON.parse(encodeHeader)
        h.alg = val
        setEncodeHeader(JSON.stringify(h, null, 2))
    } catch {}
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

    const generateBase64Secret = () => {
        const bytes = new Uint8Array(32)
        crypto.getRandomValues(bytes)
        let binary = ""
        bytes.forEach((b) => {
            binary += String.fromCharCode(b)
        })
        const secret = btoa(binary)
        setGeneratedSecret(secret)
        setEncodeSecret(secret)
    }

  const loadSampleToken = () => {
      const sample = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
      setTokenInput(sample)
      setDecodeSecret("your-256-bit-secret")
  }

  return (
    <div className="w-full h-full max-w-none">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                                                        onClick={() => generatedSecret && copyToClipboard(generatedSecret)}
                                                        disabled={!generatedSecret}
                                                    >
                                                        Copy
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
                            onClick={() => copyToClipboard(generatedToken)}
                            disabled={!generatedToken}
                        >
                            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            {copied ? "Copied!" : "Copy Token"}
                        </Button>
                    </div>
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
