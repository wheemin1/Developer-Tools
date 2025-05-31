"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Copy, Check, Zap, Info, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useDebounce } from "@/hooks/use-debounce"

export function Base64EncoderDecoder() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState<"encode" | "decode">("encode")
  const [liveMode, setLiveMode] = useState(true)
  const [copied, setCopied] = useState(false)
  const [autoDetected, setAutoDetected] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const { toast } = useToast()

  // Debounce input for live mode
  const debouncedInput = useDebounce(input, 300)

  // Auto-detect Base64 encoding - removed mode dependency
  const detectMode = useCallback((text: string): "encode" | "decode" => {
    if (!text) return "encode"

    // Check if text looks like Base64
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/
    const isBase64Like = base64Regex.test(text) && text.length % 4 === 0 && text.length > 4

    if (isBase64Like) {
      return "decode"
    }

    return "encode"
  }, [])

  // Process encoding/decoding - stabilized
  const processText = useCallback(
    (text: string, operation: "encode" | "decode") => {
      if (!text) {
        setOutput("")
        return
      }

      try {
        if (operation === "encode") {
          setOutput(btoa(unescape(encodeURIComponent(text))))
        } else {
          // Add validation for Base64 string before decoding
          const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
          if (!base64Regex.test(text) || text.length % 4 !== 0) {
            throw new Error("Invalid Base64 string");
          }
          setOutput(decodeURIComponent(escape(atob(text))))
        }
      } catch (error) {
        toast({
          title: "Processing Error",
          description: `Failed to ${operation} the text. ${error instanceof Error ? error.message : "Please check your input."}`,
          variant: "destructive",
        })
        setOutput("")
      }
    },
    [toast],
  )

  // Handle live mode processing - fixed dependencies
  useEffect(() => {
    if (!liveMode) return

    if (debouncedInput) {
      const detectedMode = detectMode(debouncedInput)
      const wasAutoDetected = detectedMode === "decode"

      setAutoDetected(wasAutoDetected)
      setMode(detectedMode)
      processText(debouncedInput, detectedMode)
    } else {
      setOutput("")
      setAutoDetected(false)
    }
  }, [debouncedInput, liveMode, detectMode, processText])

  // Manual processing
  const handleManualProcess = useCallback(() => {
    processText(input, mode)
  }, [input, mode, processText])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "Text copied to clipboard.",
      })

      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy text to clipboard.",
        variant: "destructive",
      })
    }
  }, [output, toast])

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result
      if (typeof result === "string") {
        setInput(result)
      } else if (result instanceof ArrayBuffer) {
        // Improved ArrayBuffer to base64 conversion
        const bytes = new Uint8Array(result)
        let binary = '';
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64 = btoa(binary);
        setInput(base64)
        setMode("decode")
      }
    }

    if (file.type.startsWith("text/")) {
      reader.readAsText(file)
    } else {
      reader.readAsArrayBuffer(file)
    }
  }, [])

  // Handle drag events
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result
      if (typeof result === "string") {
        setInput(result)
      } else if (result instanceof ArrayBuffer) {
        // Convert ArrayBuffer to base64
        const bytes = new Uint8Array(result)
        let binary = '';
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64 = btoa(binary);
        setInput(base64)
        setMode("decode")
      }
    }

    if (file.type.startsWith("text/")) {
      reader.readAsText(file)
    } else {
      reader.readAsArrayBuffer(file)
    }
  }, [])

  const handleClear = useCallback(() => {
    setInput("")
    setOutput("")
    setAutoDetected(false)
  }, [])

  const handleModeChange = useCallback(
    (newMode: "encode" | "decode") => {
      setMode(newMode)
      setAutoDetected(false)
      if (input && !liveMode) {
        processText(input, newMode)
      }
    },
    [input, liveMode, processText],
  )

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch checked={liveMode} onCheckedChange={setLiveMode} id="live-mode" />
            <label htmlFor="live-mode" className="flex items-center space-x-1">
              <Zap className="h-4 w-4" />
              <span>Live Mode</span>
            </label>
          </div>

          {autoDetected && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Info className="h-3 w-3" />
              <span>Auto-detected: {mode}</span>
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={mode === "encode" ? "default" : "outline"}
            size="sm"
            onClick={() => handleModeChange("encode")}
          >
            Encode
          </Button>
          <Button
            variant={mode === "decode" ? "default" : "outline"}
            size="sm"
            onClick={() => handleModeChange("decode")}
          >
            Decode
          </Button>
        </div>
      </div>

      {/* Main Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Input</h3>
            <div className="flex items-center space-x-2">
              <label htmlFor="file-upload" className="cursor-pointer">
                <Button variant="ghost" size="sm" asChild>
                  <span>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload File
                  </span>
                </Button>
              </label>
              <input
                id="file-upload"
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept="text/*,image/*,application/*"
              />
              <Button variant="ghost" size="sm" onClick={handleClear}>
                Clear
              </Button>
            </div>
          </div>
          <div 
            className={`relative ${dragActive ? 'border-2 border-primary border-dashed' : ''}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {dragActive && (
              <div className="absolute inset-0 bg-primary/5 flex items-center justify-center rounded-md z-10">
                <div className="text-center text-primary font-medium">
                  <Upload className="mx-auto h-8 w-8 mb-2" />
                  <p>Drop file to encode/decode</p>
                </div>
              </div>
            )}
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                mode === "encode" ? "Enter text to encode to Base64..." : "Enter Base64 encoded text to decode..."
              }
              className="min-h-[300px] resize-none font-mono text-sm"
            />
          </div>
          {!liveMode && (
            <Button onClick={handleManualProcess} className="w-full">
              {mode === "encode" ? "Encode to Base64" : "Decode from Base64"}
            </Button>
          )}
        </div>

        {/* Output Panel */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Output</h3>
            <Button variant="outline" size="sm" onClick={handleCopy} disabled={!output}>
              {copied ? (
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
          <Textarea
            value={output}
            readOnly
            placeholder="Result will appear here..."
            className="min-h-[300px] resize-none bg-muted font-mono text-sm"
          />
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-muted/30 p-4 rounded-lg">
        <h4 className="font-medium mb-2">How it works:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>
            • <strong>Encode:</strong> Converts text or binary data to Base64 format for safe transmission
          </li>
          <li>
            • <strong>Decode:</strong> Converts Base64 encoded data back to original text
          </li>
          <li>
            • <strong>File Upload:</strong> Upload files to encode them to Base64 format
          </li>
          <li>
            • <strong>Auto-detection:</strong> Automatically detects Base64 encoded strings
          </li>
        </ul>
      </div>
    </div>
  )
}
