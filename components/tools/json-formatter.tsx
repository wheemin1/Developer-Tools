"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Copy, Check, Zap, AlertCircle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useDebounce } from "@/hooks/use-debounce"

export function JSONFormatter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState<"format" | "minify">("format")
  const [liveMode, setLiveMode] = useState(true)
  const [copied, setCopied] = useState(false)
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [error, setError] = useState<string>("")
  const [indentSize, setIndentSize] = useState(2)
  const [beautifyOptions, setBeautifyOptions] = useState({
    sortKeys: false,
    stripComments: true,
  })
  const { toast } = useToast()

  // Debounce input for live mode
  const debouncedInput = useDebounce(input, 300)

  // Process JSON formatting/minifying - stabilized
  const processJSON = useCallback((text: string, operation: "format" | "minify") => {
    if (!text.trim()) {
      setOutput("")
      setIsValid(null)
      setError("")
      return
    }

    try {
      // Handle and strip JavaScript comments if enabled
      let processedText = text
      if (beautifyOptions.stripComments) {
        // Remove single line comments (//...)
        processedText = processedText.replace(/\/\/.*$/gm, '')
        // Remove multi-line comments (/* ... */)
        processedText = processedText.replace(/\/\*[\s\S]*?\*\//g, '')
      }
      
      const parsed = JSON.parse(processedText)
      setIsValid(true)
      setError("")

      if (operation === "format") {
        // Sort keys if option is enabled
        if (beautifyOptions.sortKeys) {
          const sortObjectKeys = (obj: any): any => {
            // If not an object or is null/array, return as is
            if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
              return obj;
            }
            
            // Create a new object with sorted keys
            return Object.keys(obj)
              .sort()
              .reduce((result: any, key) => {
                // Recursively sort nested objects
                result[key] = sortObjectKeys(obj[key]);
                return result;
              }, {});
          };
          
          const sortedObj = sortObjectKeys(parsed);
          setOutput(JSON.stringify(sortedObj, null, indentSize));
        } else {
          setOutput(JSON.stringify(parsed, null, indentSize));
        }
      } else {
        setOutput(JSON.stringify(parsed));
      }
    } catch (err) {
      setIsValid(false)
      setError(err instanceof Error ? err.message : "Invalid JSON")
      setOutput("")
    }
  }, [beautifyOptions, indentSize])

  // Handle live mode processing - fixed dependencies
  useEffect(() => {
    if (liveMode) {
      processJSON(debouncedInput, mode)
    } else if (!debouncedInput) {
      setOutput("")
      setIsValid(null)
      setError("")
    }
  }, [debouncedInput, liveMode, mode, processJSON])

  // Manual processing
  const handleManualProcess = useCallback(() => {
    processJSON(input, mode)
  }, [input, mode, processJSON])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "JSON copied to clipboard.",
      })

      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy JSON to clipboard.",
        variant: "destructive",
      })
    }
  }, [output, toast])

  const handleClear = useCallback(() => {
    setInput("")
    setOutput("")
    setIsValid(null)
    setError("")
  }, [])

  const loadSampleJSON = useCallback(() => {
    const sample = {
      name: "John Doe",
      age: 30,
      email: "john.doe@example.com",
      address: {
        street: "123 Main St",
        city: "New York",
        zipCode: "10001",
      },
      hobbies: ["reading", "swimming", "coding"],
      isActive: true,
    }
    setInput(JSON.stringify(sample))
  }, [])

  const handleModeChange = useCallback(
    (newMode: "format" | "minify") => {
      setMode(newMode)
      if (input && !liveMode) {
        processJSON(input, newMode)
      }
    },
    [input, liveMode, processJSON],
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

          {isValid !== null && (
            <Badge variant={isValid ? "default" : "destructive"} className="flex items-center space-x-1">
              {isValid ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
              <span>{isValid ? "Valid JSON" : "Invalid JSON"}</span>
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={mode === "format" ? "default" : "outline"}
            size="sm"
            onClick={() => handleModeChange("format")}
          >
            Format
          </Button>
          <Button
            variant={mode === "minify" ? "default" : "outline"}
            size="sm"
            onClick={() => handleModeChange("minify")}
          >
            Minify
          </Button>
        </div>
      </div>
      
      {/* Formatting Options */}
      {mode === "format" && (
        <div className="flex flex-wrap gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="space-y-1">
            <label htmlFor="indent-size" className="text-sm font-medium">Indent Size</label>
            <select 
              id="indent-size" 
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
              value={indentSize}
              onChange={(e) => setIndentSize(Number(e.target.value))}
            >
              <option value="2">2 spaces</option>
              <option value="4">4 spaces</option>
              <option value="8">8 spaces</option>
            </select>
          </div>
          
          <div className="space-y-1">
            <div className="text-sm font-medium">Options</div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={beautifyOptions.sortKeys} 
                  onCheckedChange={(checked) => setBeautifyOptions({...beautifyOptions, sortKeys: checked})}
                  id="sort-keys" 
                />
                <label htmlFor="sort-keys" className="text-sm">Sort Keys</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={beautifyOptions.stripComments} 
                  onCheckedChange={(checked) => setBeautifyOptions({...beautifyOptions, stripComments: checked})}
                  id="strip-comments" 
                />
                <label htmlFor="strip-comments" className="text-sm">Strip Comments</label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formatting Options */}
      {mode === "format" && (
        <div className="flex flex-wrap gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="space-y-1">
            <label htmlFor="indent-size" className="text-sm font-medium">Indent Size</label>
            <select 
              id="indent-size" 
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
              value={indentSize}
              onChange={(e) => setIndentSize(Number(e.target.value))}
            >
              <option value="2">2 spaces</option>
              <option value="4">4 spaces</option>
              <option value="8">8 spaces</option>
            </select>
          </div>
          
          <div className="space-y-1">
            <div className="text-sm font-medium">Options</div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={beautifyOptions.sortKeys} 
                  onCheckedChange={(checked) => setBeautifyOptions({...beautifyOptions, sortKeys: checked})}
                  id="sort-keys" 
                />
                <label htmlFor="sort-keys" className="text-sm">Sort Keys</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={beautifyOptions.stripComments} 
                  onCheckedChange={(checked) => setBeautifyOptions({...beautifyOptions, stripComments: checked})}
                  id="strip-comments" 
                />
                <label htmlFor="strip-comments" className="text-sm">Strip Comments</label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Input JSON</h3>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={loadSampleJSON}>
                Sample
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClear}>
                Clear
              </Button>
            </div>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter JSON to format or minify..."
            className="min-h-[300px] resize-none font-mono text-sm"
          />
          {error && <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">{error}</div>}
          {!liveMode && (
            <Button onClick={handleManualProcess} className="w-full">
              {mode === "format" ? "Format JSON" : "Minify JSON"}
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
            placeholder="Formatted/minified JSON will appear here..."
            className="min-h-[300px] resize-none bg-muted font-mono text-sm"
          />
          {output && (
            <div className="text-xs text-muted-foreground">
              Size: {output.length} characters | Lines: {output.split("\n").length}
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-muted/30 p-4 rounded-lg">
        <h4 className="font-medium mb-2">How it works:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>
            • <strong>Format:</strong> Pretty-prints JSON with proper indentation and line breaks
          </li>
          <li>
            • <strong>Minify:</strong> Removes all unnecessary whitespace to reduce file size
          </li>
          <li>
            • <strong>Validation:</strong> Automatically validates JSON syntax and shows errors
          </li>
          <li>
            • <strong>Live Mode:</strong> Processes JSON automatically as you type
          </li>
        </ul>
      </div>
    </div>
  )
}
