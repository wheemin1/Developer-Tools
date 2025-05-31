"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Copy, Check, Zap, Eraser } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useDebounce } from "@/hooks/use-debounce"
import { WhitespaceProcessor } from "@/lib/utils/text-processors"

interface CleaningOptions {
  trimOnly: boolean
  removeLineBreaks: boolean
  removeExtraSpaces: boolean
  removeTabs: boolean
  convertToSingleSpace: boolean
  removeAllWhitespace?: boolean
}

export function WhitespaceCleaner() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [liveMode, setLiveMode] = useState(true)
  const [copied, setCopied] = useState(false)
  const [options, setOptions] = useState<CleaningOptions>({
    trimOnly: false,
    removeLineBreaks: false,
    removeExtraSpaces: true,
    removeTabs: true,
    convertToSingleSpace: false,
    removeAllWhitespace: false
  })
  const { toast } = useToast()

  // Debounce input for live mode
  const debouncedInput = useDebounce(input, 300)

  // Clean whitespace based on options
  const cleanWhitespace = useCallback((text: string, cleaningOptions: CleaningOptions) => {
    if (!text) return ""
    
    return WhitespaceProcessor.clean(text, cleaningOptions)
  }, [])

  // Handle live mode processing
  useEffect(() => {
    if (liveMode) {
      setOutput(cleanWhitespace(debouncedInput, options))
    }
  }, [debouncedInput, liveMode, options, cleanWhitespace])

  // Manual processing
  const handleManualProcess = useCallback(() => {
    setOutput(cleanWhitespace(input, options))
  }, [input, options, cleanWhitespace])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "Cleaned text copied to clipboard.",
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

  const handleClear = useCallback(() => {
    setInput("")
    setOutput("")
  }, [])

  const loadSampleText = useCallback(() => {
    setInput(`   This    is   a   sample   text   with   
    
    multiple    line    breaks    
    
    	and	tabs	and	extra	spaces.   
    
    It needs cleaning!   `)
  }, [])

  const handleOptionChange = useCallback((option: keyof CleaningOptions, checked: boolean) => {
    setOptions((prev) => {
      const newOptions = { ...prev, [option]: checked }

      // Handle mutual exclusivity for some options
      if (option === "trimOnly" && checked) {
        newOptions.removeLineBreaks = false
        newOptions.removeExtraSpaces = false
        newOptions.removeTabs = false
        newOptions.convertToSingleSpace = false
      } else if (option !== "trimOnly" && checked) {
        newOptions.trimOnly = false
      }

      return newOptions
    })
  }, [])

  const presetConfigs = [
    {
      name: "Trim Only",
      config: {
        trimOnly: true,
        removeLineBreaks: false,
        removeExtraSpaces: false,
        removeTabs: false,
        convertToSingleSpace: false,
      },
    },
    {
      name: "Compact (No Spaces)",
      config: {
        trimOnly: false,
        removeLineBreaks: false,
        removeExtraSpaces: false,
        removeTabs: false,
        convertToSingleSpace: false,
        removeAllWhitespace: true
      },
    },
    {
      name: "Remove All Whitespace",
      config: {
        trimOnly: false,
        removeLineBreaks: true,
        removeExtraSpaces: true,
        removeTabs: true,
        convertToSingleSpace: true,
        removeAllWhitespace: false
      },
    },
    {
      name: "Single Line",
      config: {
        trimOnly: false,
        removeLineBreaks: true,
        removeExtraSpaces: true,
        removeTabs: true,
        convertToSingleSpace: false,
      },
    },
    {
      name: "Clean Spaces Only",
      config: {
        trimOnly: false,
        removeLineBreaks: false,
        removeExtraSpaces: true,
        removeTabs: true,
        convertToSingleSpace: false,
      },
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Eraser className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Whitespace Cleaner</h2>
        </div>
        <p className="text-muted-foreground">Remove line breaks, extra spaces, and tabs from text</p>
      </div>

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
          <Button variant="outline" size="sm" onClick={loadSampleText}>
            Sample Text
          </Button>
        </div>
      </div>

      {/* Cleaning Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Cleaning Options</h3>

        {/* Preset Configurations */}
        <div className="flex flex-wrap gap-2">
          {presetConfigs.map((preset) => (
            <Button key={preset.name} variant="outline" size="sm" onClick={() => setOptions(preset.config)}>
              {preset.name}
            </Button>
          ))}
        </div>

        {/* Individual Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="trim-only"
              checked={options.trimOnly}
              onCheckedChange={(checked) => handleOptionChange("trimOnly", checked as boolean)}
            />
            <label htmlFor="trim-only" className="text-sm font-medium">
              Trim only (start/end)
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="remove-line-breaks"
              checked={options.removeLineBreaks}
              onCheckedChange={(checked) => handleOptionChange("removeLineBreaks", checked as boolean)}
              disabled={options.trimOnly}
            />
            <label htmlFor="remove-line-breaks" className="text-sm font-medium">
              Remove line breaks
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="remove-extra-spaces"
              checked={options.removeExtraSpaces}
              onCheckedChange={(checked) => handleOptionChange("removeExtraSpaces", checked as boolean)}
              disabled={options.trimOnly}
            />
            <label htmlFor="remove-extra-spaces" className="text-sm font-medium">
              Remove extra spaces
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="remove-tabs"
              checked={options.removeTabs}
              onCheckedChange={(checked) => handleOptionChange("removeTabs", checked as boolean)}
              disabled={options.trimOnly}
            />
            <label htmlFor="remove-tabs" className="text-sm font-medium">
              Remove tabs
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="convert-to-single-space"
              checked={options.convertToSingleSpace}
              onCheckedChange={(checked) => handleOptionChange("convertToSingleSpace", checked as boolean)}
              disabled={options.trimOnly || options.removeAllWhitespace}
            />
            <label htmlFor="convert-to-single-space" className="text-sm font-medium">
              Convert to single space
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="remove-all-whitespace"
              checked={options.removeAllWhitespace}
              onCheckedChange={(checked) => {
                setOptions(prev => ({
                  ...prev,
                  removeAllWhitespace: checked as boolean,
                  trimOnly: false,
                  removeLineBreaks: false,
                  removeExtraSpaces: false,
                  removeTabs: false,
                  convertToSingleSpace: false
                }))
              }}
            />
            <label htmlFor="remove-all-whitespace" className="text-sm font-medium">
              Remove all whitespace
            </label>
          </div>
        </div>
      </div>

      {/* Main Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
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
            placeholder="Enter text with whitespace to clean..."
            className="min-h-[300px] resize-none font-mono text-sm"
          />
          {!liveMode && (
            <Button onClick={handleManualProcess} className="w-full">
              Clean Whitespace
            </Button>
          )}
        </div>

        {/* Output Panel */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Cleaned Text</h3>
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
            placeholder="Cleaned text will appear here..."
            className="min-h-[300px] resize-none bg-muted font-mono text-sm"
          />
          {input && output && (
            <div className="text-xs text-muted-foreground">
              Original: {input.length} characters → Cleaned: {output.length} characters ({input.length - output.length}{" "}
              characters removed)
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-muted/30 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Cleaning Options:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>
            • <strong>Trim Only:</strong> Removes whitespace from start and end only
          </li>
          <li>
            • <strong>Remove Line Breaks:</strong> Converts line breaks to spaces
          </li>
          <li>
            • <strong>Remove Extra Spaces:</strong> Collapses multiple spaces into single spaces
          </li>
          <li>
            • <strong>Remove Tabs:</strong> Converts tabs to spaces
          </li>
          <li>
            • <strong>Convert to Single Space:</strong> Normalizes all whitespace to single spaces
          </li>
          <li>
            • <strong>Remove All Whitespace:</strong> Removes all spaces, tabs, and line breaks completely
          </li>
        </ul>
      </div>
    </div>
  )
}
