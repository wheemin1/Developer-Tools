"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Copy, Check, Zap, Type } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useDebounce } from "@/hooks/use-debounce"

interface CaseConversion {
  name: string
  id: string
  convert: (text: string) => string
  example: string
}

export function TextCaseConverter() {
  const [input, setInput] = useState("")
  const [liveMode, setLiveMode] = useState(true)
  const [copied, setCopied] = useState<string>("")
  const [autoDetected, setAutoDetected] = useState<string>("")
  const { toast } = useToast()

  // Debounce input for live mode
  const debouncedInput = useDebounce(input, 300)

  // Case conversion functions
  const conversions: CaseConversion[] = [
    {
      name: "camelCase",
      id: "camel",
      convert: (text: string) => {
        return text
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
            return index === 0 ? word.toLowerCase() : word.toUpperCase()
          })
          .replace(/\s+/g, "")
      },
      example: "helloWorldExample",
    },
    {
      name: "PascalCase",
      id: "pascal",
      convert: (text: string) => {
        return text
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => {
            return word.toUpperCase()
          })
          .replace(/\s+/g, "")
      },
      example: "HelloWorldExample",
    },
    {
      name: "snake_case",
      id: "snake",
      convert: (text: string) => {
        return text
          .replace(/\W+/g, " ")
          .split(/ |\B(?=[A-Z])/)
          .map((word) => word.toLowerCase())
          .join("_")
      },
      example: "hello_world_example",
    },
    {
      name: "kebab-case",
      id: "kebab",
      convert: (text: string) => {
        return text
          .replace(/\W+/g, " ")
          .split(/ |\B(?=[A-Z])/)
          .map((word) => word.toLowerCase())
          .join("-")
      },
      example: "hello-world-example",
    },
    {
      name: "UPPER_CASE",
      id: "upper",
      convert: (text: string) => {
        return text
          .replace(/\W+/g, " ")
          .split(/ |\B(?=[A-Z])/)
          .map((word) => word.toUpperCase())
          .join("_")
      },
      example: "HELLO_WORLD_EXAMPLE",
    },
    {
      name: "lowercase",
      id: "lower",
      convert: (text: string) => {
        return text.toLowerCase()
      },
      example: "hello world example",
    },
    {
      name: "UPPERCASE",
      id: "upperall",
      convert: (text: string) => {
        return text.toUpperCase()
      },
      example: "HELLO WORLD EXAMPLE",
    },
    {
      name: "Title Case",
      id: "title",
      convert: (text: string) => {
        return text.replace(/\w\S*/g, (txt) => {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        })
      },
      example: "Hello World Example",
    },
    {
      name: "Sentence case",
      id: "sentence",
      convert: (text: string) => {
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
      },
      example: "Hello world example",
    },
  ]

  // Auto-detect current case
  const detectCase = useCallback((text: string): string => {
    if (!text) return ""

    if (/^[a-z]+([A-Z][a-z]*)*$/.test(text)) return "camelCase"
    if (/^[A-Z][a-z]*([A-Z][a-z]*)*$/.test(text)) return "PascalCase"
    if (/^[a-z]+(_[a-z]+)*$/.test(text)) return "snake_case"
    if (/^[a-z]+(-[a-z]+)*$/.test(text)) return "kebab-case"
    if (/^[A-Z]+(_[A-Z]+)*$/.test(text)) return "UPPER_CASE"
    if (/^[a-z\s]+$/.test(text)) return "lowercase"
    if (/^[A-Z\s]+$/.test(text)) return "UPPERCASE"
    if (/^[A-Z][a-z]*(\s[A-Z][a-z]*)*$/.test(text)) return "Title Case"

    return ""
  }, [])

  // Handle auto-detection
  useEffect(() => {
    if (debouncedInput) {
      const detected = detectCase(debouncedInput.trim())
      setAutoDetected(detected)
    } else {
      setAutoDetected("")
    }
  }, [debouncedInput, detectCase])

  const handleCopy = useCallback(
    async (text: string, caseName: string) => {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(caseName)
        toast({
          title: "Copied!",
          description: `${caseName} text copied to clipboard.`,
        })

        setTimeout(() => {
          setCopied("")
        }, 2000)
      } catch (error) {
        toast({
          title: "Copy Failed",
          description: "Failed to copy text to clipboard.",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  const handleClear = useCallback(() => {
    setInput("")
    setAutoDetected("")
  }, [])

  const loadSampleText = useCallback(() => {
    setInput("Hello World Example Text")
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Type className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Text Case Converter</h2>
        </div>
        <p className="text-muted-foreground">Convert text between different case formats</p>
      </div>

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
              <span>Detected: {autoDetected}</span>
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={loadSampleText}>
            Sample Text
          </Button>
        </div>
      </div>

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
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to convert between different cases..."
          className="min-h-[120px] resize-none text-sm"
        />
      </div>

      {/* Conversion Results */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Converted Text</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {conversions.map((conversion) => {
            const convertedText = input ? conversion.convert(input) : ""
            return (
              <div key={conversion.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{conversion.name}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(convertedText, conversion.name)}
                    disabled={!convertedText}
                  >
                    {copied === conversion.name ? (
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

                <div className="space-y-2">
                  <div className="bg-muted p-3 rounded font-mono text-sm min-h-[60px] break-all">
                    {convertedText || "Converted text will appear here..."}
                  </div>
                  <div className="text-xs text-muted-foreground">Example: {conversion.example}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-muted/30 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Case Formats:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>
            • <strong>camelCase:</strong> First word lowercase, subsequent words capitalized
          </li>
          <li>
            • <strong>PascalCase:</strong> All words capitalized, no spaces
          </li>
          <li>
            • <strong>snake_case:</strong> All lowercase with underscores
          </li>
          <li>
            • <strong>kebab-case:</strong> All lowercase with hyphens
          </li>
          <li>
            • <strong>UPPER_CASE:</strong> All uppercase with underscores
          </li>
          <li>
            • <strong>Title Case:</strong> First letter of each word capitalized
          </li>
        </ul>
      </div>
    </div>
  )
}
