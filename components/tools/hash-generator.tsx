"use client"

import { useState, useEffect, useCallback } from "react"
import type { ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Copy, Check, Zap, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useDebounce } from "@/hooks/use-debounce"
import SparkMD5 from "spark-md5"

const ALGORITHMS = [
  { name: "MD5", id: "md5" },
  { name: "SHA-1", id: "sha1" },
  { name: "SHA-256", id: "sha256" },
  { name: "SHA-384", id: "sha384" },
  { name: "SHA-512", id: "sha512" },
] as const

export function HashGenerator() {
  const [input, setInput] = useState("")
  const [hashes, setHashes] = useState<Record<string, string>>({})
  const [liveMode, setLiveMode] = useState(true)
  const [copiedHash, setCopiedHash] = useState<string>("")
  const [inputSource, setInputSource] = useState<"text" | "file">("text")
  const [fileInfo, setFileInfo] = useState("")
  const { toast } = useToast()

  // Debounce input for live mode
  const debouncedInput = useDebounce(input, 300)

  const bytesToArrayBuffer = useCallback((bytes: Uint8Array): ArrayBuffer => {
    return Uint8Array.from(bytes).buffer
  }, [])

  // Generate hash using real MD5 (SparkMD5) and Web Crypto algorithms.
  const generateHash = useCallback(
    async (bytes: Uint8Array, algorithm: string) => {
      if (bytes.length === 0) return ""

      try {
        if (algorithm === "md5") {
          return SparkMD5.ArrayBuffer.hash(bytesToArrayBuffer(bytes))
        }

        let hashBuffer: ArrayBuffer

        switch (algorithm) {
          case "sha1":
            hashBuffer = await crypto.subtle.digest("SHA-1", bytes)
            break
          case "sha256":
            hashBuffer = await crypto.subtle.digest("SHA-256", bytes)
            break
          case "sha384":
            hashBuffer = await crypto.subtle.digest("SHA-384", bytes)
            break
          case "sha512":
            hashBuffer = await crypto.subtle.digest("SHA-512", bytes)
            break
          default:
            return ""
        }

        const hashArray = Array.from(new Uint8Array(hashBuffer))
        return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("")
      } catch (error) {
        console.error(`Error generating ${algorithm} hash:`, error)
        return ""
      }
    },
    [bytesToArrayBuffer],
  )

  const generateAllHashesFromBytes = useCallback(
    async (bytes: Uint8Array) => {
      if (bytes.length === 0) {
        setHashes({})
        return
      }

      const newHashes: Record<string, string> = {}

      for (const algorithm of ALGORITHMS) {
        newHashes[algorithm.id] = await generateHash(bytes, algorithm.id)
      }

      setHashes(newHashes)
    },
    [generateHash],
  )

  // Generate all hashes for text input.
  const generateAllHashes = useCallback(
    async (text: string) => {
      if (!text) {
        setHashes({})
        return
      }

      const textBytes = new TextEncoder().encode(text)
      await generateAllHashesFromBytes(textBytes)
    },
    [generateAllHashesFromBytes],
  )

  // Handle live mode processing - fixed dependencies
  useEffect(() => {
    if (inputSource !== "text") {
      return
    }

    if (liveMode) {
      generateAllHashes(debouncedInput)
    } else if (!debouncedInput) {
      setHashes({})
    }
  }, [debouncedInput, inputSource, liveMode, generateAllHashes])

  // Manual processing
  const handleManualProcess = useCallback(() => {
    if (inputSource !== "text") return
    generateAllHashes(input)
  }, [generateAllHashes, input, inputSource])

  const handleCopy = useCallback(
    async (hash: string, algorithm: string) => {
      try {
        await navigator.clipboard.writeText(hash)
        setCopiedHash(algorithm)
        toast({
          title: "Copied!",
          description: `${algorithm.toUpperCase()} hash copied to clipboard.`,
        })

        setTimeout(() => {
          setCopiedHash("")
        }, 2000)
      } catch {
        toast({
          title: "Copy Failed",
          description: "Failed to copy hash to clipboard.",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(2)} KB`
    if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(2)} MB`
    return `${(bytes / 1024 ** 3).toFixed(2)} GB`
  }, [])

  // File upload handler (binary-safe hashing)
  const handleFileUpload = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = async (loadEvent) => {
        if (!(loadEvent.target?.result instanceof ArrayBuffer)) return

        setInputSource("file")
        setFileInfo(`${file.name} (${formatFileSize(file.size)})`)
        await generateAllHashesFromBytes(new Uint8Array(loadEvent.target.result))

        toast({
          title: "File hashed",
          description: `Computed hashes for ${file.name}.`,
        })
      }
      reader.onerror = () => {
        toast({
          title: "Error",
          description: "Failed to read file for hashing.",
          variant: "destructive",
        })
      }
      reader.readAsArrayBuffer(file)
    },
    [formatFileSize, generateAllHashesFromBytes, toast],
  )

  const handleClear = () => {
    setInput("")
    setInputSource("text")
    setFileInfo("")
    setHashes({})
  }

  const loadSampleText = () => {
    setInputSource("text")
    setFileInfo("")
    setInput("The quick brown fox jumps over the lazy dog")
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center space-x-2">
          <Switch checked={liveMode} onCheckedChange={setLiveMode} id="live-mode" />
          <label htmlFor="live-mode" className="flex items-center space-x-1">
            <Zap className="h-4 w-4" />
            <span>Live Mode</span>
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="file-upload" className="cursor-pointer">
            <Button variant="outline" size="sm" asChild>
              <span>
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </span>
            </Button>
          </label>
          <input id="file-upload" type="file" onChange={handleFileUpload} className="hidden" />
          <Button variant="outline" size="sm" onClick={loadSampleText}>
            Sample
          </Button>
        </div>
      </div>
      {fileInfo && <p className="text-sm text-muted-foreground">Loaded file: {fileInfo}</p>}

      {/* Input Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Input Text</h3>
          <Button variant="ghost" size="sm" onClick={handleClear}>
            Clear
          </Button>
        </div>
        <Textarea
          value={input}
          onChange={(e) => {
            setInputSource("text")
            setFileInfo("")
            setInput(e.target.value)
          }}
          placeholder="Enter text to generate hashes..."
          className="min-h-[150px] resize-none font-mono text-sm"
        />
        {!liveMode && (
          <Button onClick={handleManualProcess} className="w-full">
            Generate Hashes
          </Button>
        )}
      </div>

      {/* Hash Results */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Generated Hashes</h3>
        <div className="space-y-3">
          {ALGORITHMS.map((algorithm) => (
            <div key={algorithm.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{algorithm.name}</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(hashes[algorithm.id] || "", algorithm.name)}
                  disabled={!hashes[algorithm.id]}
                >
                  {copiedHash === algorithm.name ? (
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
              <div className="bg-muted p-3 rounded font-mono text-sm break-all">
                {hashes[algorithm.id] || "Hash will appear here..."}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-muted/30 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Hash Algorithms:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>
            • <strong>MD5:</strong> 128-bit hash (not cryptographically secure, use for checksums only)
          </li>
          <li>
            • <strong>SHA-1:</strong> 160-bit hash (deprecated for security, use for legacy compatibility)
          </li>
          <li>
            • <strong>SHA-256:</strong> 256-bit hash (recommended for most security applications)
          </li>
          <li>
            • <strong>SHA-384:</strong> 384-bit hash (higher security variant of SHA-2)
          </li>
          <li>
            • <strong>SHA-512:</strong> 512-bit hash (highest security variant of SHA-2)
          </li>
        </ul>
      </div>
    </div>
  )
}
