"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Copy, Check, Zap, Info } from "lucide-react"
import { CharacterTooltip } from "@/components/character-tooltip"
import { useDebounce } from "@/hooks/use-debounce"
import { useClipboard } from "@/hooks/use-clipboard"
import { useProcessing } from "@/hooks/use-processing"
import { TextProcessor } from "@/lib/utils/text-processors"
import { DetectionUtils } from "@/lib/utils/detection-utils"
import { DEBOUNCE_DELAY } from "@/lib/constants"

export function URLEncoderDecoder() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState<"encode" | "decode">("encode")
  const [liveMode, setLiveMode] = useState(true)
  const [autoDetected, setAutoDetected] = useState(false)

  const debouncedInput = useDebounce(input, DEBOUNCE_DELAY)
  const { copied, copyToClipboard } = useClipboard()
  const { process } = useProcessing()

  const processText = useCallback(
    async (text: string, operation: "encode" | "decode") => {
      if (!text) {
        setOutput("")
        return
      }

      await process(
        () => {
          if (operation === "encode") {
            return TextProcessor.encodeURL(text)
          } else {
            return TextProcessor.decodeURL(text)
          }
        },
        {
          onSuccess: (result) => setOutput(result),
          onError: () => setOutput(""),
        },
      )
    },
    [process],
  )

  useEffect(() => {
    if (!liveMode) return

    if (debouncedInput) {
      const detectedMode = DetectionUtils.detectURLEncoding(debouncedInput)
      const wasAutoDetected = detectedMode !== "encode" || debouncedInput.includes(" ")

      setAutoDetected(wasAutoDetected)
      setMode(detectedMode)
      processText(debouncedInput, detectedMode)
    } else {
      setOutput("")
      setAutoDetected(false)
    }
  }, [debouncedInput, liveMode, processText])

  const handleManualProcess = useCallback(() => {
    processText(input, mode)
  }, [input, mode, processText])

  const handleCopy = useCallback(() => {
    copyToClipboard(output, "Text")
  }, [output, copyToClipboard])

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

          {autoDetected && (
            <Badge variant="secondary" className="flex items-center space-x-2 px-3 py-1">
              <Info className="h-3 w-3" />
              <span className="text-xs font-medium">Auto-detected: {mode}</span>
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={mode === "encode" ? "default" : "outline"}
            size="sm"
            onClick={() => handleModeChange("encode")}
            className="min-w-[80px]"
          >
            Encode
          </Button>
          <Button
            variant={mode === "decode" ? "default" : "outline"}
            size="sm"
            onClick={() => handleModeChange("decode")}
            className="min-w-[80px]"
          >
            Decode
          </Button>
        </div>
      </div>

      {/* Main Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Input</h3>
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
            placeholder={mode === "encode" ? "Enter text or URL to encode..." : "Enter URL-encoded text to decode..."}
            className="min-h-[320px] resize-none font-mono text-sm leading-relaxed"
          />
          {!liveMode && (
            <Button onClick={handleManualProcess} className="w-full h-11 text-base font-medium">
              {mode === "encode" ? "Encode" : "Decode"}
            </Button>
          )}
        </div>

        {/* Output Panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Output</h3>
            <Button variant="outline" size="sm" onClick={handleCopy} disabled={!output}>
              {copied === "Text" ? (
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
          <div className="relative">
            <Textarea
              value={output}
              readOnly
              placeholder="Result will appear here..."
              className="min-h-[320px] resize-none bg-muted/50 font-mono text-sm leading-relaxed"
            />
            {output && mode === "encode" && output.includes("%") && (
              <div className="absolute inset-0 pointer-events-none">
                <CharacterTooltip text={output} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-gradient-to-r from-muted/30 to-muted/20 p-6 rounded-xl border">
        <h4 className="text-lg font-semibold mb-4">How it works:</h4>
        <ul className="text-sm text-muted-foreground space-y-2 leading-relaxed">
          <li className="flex items-start space-x-2">
            <span className="font-semibold text-foreground mt-0.5">•</span>
            <span>
              <strong className="text-foreground">Encode:</strong> Converts special characters to URL-safe format (e.g.,
              space → %20)
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="font-semibold text-foreground mt-0.5">•</span>
            <span>
              <strong className="text-foreground">Decode:</strong> Converts URL-encoded characters back to original text
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="font-semibold text-foreground mt-0.5">•</span>
            <span>
              <strong className="text-foreground">Live Mode:</strong> Processes text automatically as you type with
              smart debouncing
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="font-semibold text-foreground mt-0.5">•</span>
            <span>
              <strong className="text-foreground">Auto-detection:</strong> Automatically detects whether to encode or
              decode based on input
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}
