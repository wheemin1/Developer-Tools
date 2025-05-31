"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Check, RefreshCw, Fingerprint } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function UUIDGenerator() {
  const [uuid, setUuid] = useState("")
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const [uuidFormat, setUuidFormat] = useState<"standard" | "no-hyphens" | "braces" | "uppercase">("standard")
  const [batchSize, setBatchSize] = useState<5 | 10 | 25 | 50>(5)
  const { toast } = useToast()

  // Format UUID based on selected format
  const formatUUID = useCallback((rawUuid: string): string => {
    switch (uuidFormat) {
      case "no-hyphens":
        return rawUuid.replace(/-/g, "");
      case "braces":
        return `{${rawUuid}}`;
      case "uppercase":
        return rawUuid.toUpperCase();
      case "standard":
      default:
        return rawUuid;
    }
  }, [uuidFormat]);

  // Get original UUID from formatted UUID
  const getOriginalUUID = useCallback((formattedUuid: string): string => {
    // Remove braces if present
    let original = formattedUuid.replace(/^\{|\}$/g, "");
    
    // Ensure lowercase
    original = original.toLowerCase();
    
    // Add hyphens if they're missing
    if (!original.includes("-") && original.length === 32) {
      original = original.replace(
        /^(.{8})(.{4})(.{4})(.{4})(.{12})$/,
        "$1-$2-$3-$4-$5"
      );
    }
    
    return original;
  }, []);

  // Generate new UUID
  const generateUUID = useCallback(() => {
    try {
      const newRawUuid = crypto.randomUUID()
      const formattedUuid = formatUUID(newRawUuid)
      setUuid(formattedUuid)
      setHistory((prev) => [formattedUuid, ...prev.slice(0, 9)]) // Keep last 10
    } catch (error) {
      // Fallback for browsers that don't support crypto.randomUUID()
      const fallbackUuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0
        const v = c === "x" ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
      const formattedFallback = formatUUID(fallbackUuid)
      setUuid(formattedFallback)
      setHistory((prev) => [formattedFallback, ...prev.slice(0, 9)])
    }
  }, [formatUUID])

  // Generate multiple UUIDs
  const generateMultipleUUIDs = useCallback((count: number) => {
    const uuids: string[] = [];
    
    for (let i = 0; i < count; i++) {
      try {
        const newRawUuid = crypto.randomUUID();
        const formattedUuid = formatUUID(newRawUuid);
        uuids.push(formattedUuid);
      } catch (error) {
        // Fallback
        const fallbackUuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          const v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
        uuids.push(formatUUID(fallbackUuid));
      }
    }
    
    // Add all to history (limit to 10)
    setHistory((prev) => [...uuids, ...prev].slice(0, 10));
    
    // Set the most recent one as current
    if (uuids.length > 0) {
      setUuid(uuids[0]);
    }
    
    // If more than one, offer to copy all
    if (uuids.length > 1) {
      const allUuids = uuids.join('\n');
      
      // Create a button that copies all generated UUIDs
      const copyAllButton = document.createElement('button');
      copyAllButton.textContent = `Copy all ${uuids.length} UUIDs`;
      copyAllButton.className = 'copy-all-button';
      copyAllButton.onclick = async () => {
        try {
          await navigator.clipboard.writeText(allUuids);
          toast({
            title: "Copied!",
            description: `${uuids.length} UUIDs copied to clipboard.`,
          });
        } catch (error) {
          toast({
            title: "Copy Failed",
            description: "Failed to copy UUIDs to clipboard.",
            variant: "destructive",
          });
        }
      };
      
      // Show toast with the button
      toast({
        title: `Generated ${uuids.length} UUIDs`,
        description: "You can copy individual UUIDs from history or copy all at once.",
        action: (
          <Button size="sm" variant="default" onClick={async () => {
            try {
              await navigator.clipboard.writeText(allUuids);
              toast({
                title: "Copied!",
                description: `${uuids.length} UUIDs copied to clipboard.`,
              });
            } catch (error) {
              toast({
                title: "Copy Failed",
                description: "Failed to copy UUIDs to clipboard.",
                variant: "destructive",
              });
            }
          }}>
            Copy All
          </Button>
        ),
      });
    }
  }, [formatUUID, toast]);

  // Generate initial UUID on component mount
  useEffect(() => {
    generateUUID()
  }, [generateUUID])

  const handleCopy = useCallback(
    async (uuidToCopy?: string) => {
      const targetUuid = uuidToCopy || uuid
      try {
        await navigator.clipboard.writeText(targetUuid)
        setCopied(true)
        toast({
          title: "Copied!",
          description: "UUID copied to clipboard.",
        })

        setTimeout(() => {
          setCopied(false)
        }, 2000)
      } catch (error) {
        toast({
          title: "Copy Failed",
          description: "Failed to copy UUID to clipboard.",
          variant: "destructive",
        })
      }
    },
    [uuid, toast],
  )

  const handleClear = useCallback(() => {
    setHistory([])
    generateUUID()
  }, [generateUUID])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="p-3 bg-primary/10 rounded-full">
            <Fingerprint className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">UUID v4 Generator</h2>
        </div>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Generate cryptographically secure UUID v4 identifiers using the Web Crypto API
        </p>
      </div>

      {/* Main Generator */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Generated UUID</h3>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={generateUUID} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Generate New
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Input
            value={uuid}
            readOnly
            className="font-mono text-base h-12 bg-muted/50 border-2"
            placeholder="UUID will appear here..."
          />
          <Button onClick={() => handleCopy()} disabled={!uuid} size="lg" className="px-6">
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

        {/* UUID Details */}
        {uuid && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg bg-gradient-to-br from-background to-muted/20">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-1">Version</h4>
              <p className="text-base font-medium">4 (Random)</p>
            </div>
            <div className="p-4 border rounded-lg bg-gradient-to-br from-background to-muted/20">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-1">Length</h4>
              <p className="text-base font-medium">{uuid.length} characters</p>
            </div>
            <div className="p-4 border rounded-lg bg-gradient-to-br from-background to-muted/20">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-1">Format</h4>
              <p className="text-base font-medium">8-4-4-4-12</p>
            </div>
            <div className="p-4 border rounded-lg bg-gradient-to-br from-background to-muted/20">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-1">Entropy</h4>
              <p className="text-base font-medium">122 bits</p>
            </div>
          </div>
        )}
      </div>

      {/* Format and Batch Size Options */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Options</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* UUID Format */}
          <div className="p-4 border rounded-lg bg-gradient-to-br from-background to-muted/20">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-1">UUID Format</h4>
            <div className="flex gap-2">
              <Button
                variant={uuidFormat === "standard" ? "default" : "outline"}
                onClick={() => setUuidFormat("standard")}
                className="flex-1"
              >
                Standard
              </Button>
              <Button
                variant={uuidFormat === "no-hyphens" ? "default" : "outline"}
                onClick={() => setUuidFormat("no-hyphens")}
                className="flex-1"
              >
                No Hyphens
              </Button>
              <Button
                variant={uuidFormat === "braces" ? "default" : "outline"}
                onClick={() => setUuidFormat("braces")}
                className="flex-1"
              >
                Braces
              </Button>
              <Button
                variant={uuidFormat === "uppercase" ? "default" : "outline"}
                onClick={() => setUuidFormat("uppercase")}
                className="flex-1"
              >
                Uppercase
              </Button>
            </div>
          </div>

          {/* Batch Size */}
          <div className="p-4 border rounded-lg bg-gradient-to-br from-background to-muted/20">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-1">Batch Size</h4>
            <div className="flex gap-2">
              <Button
                variant={batchSize === 5 ? "default" : "outline"}
                onClick={() => setBatchSize(5)}
                className="flex-1"
              >
                5
              </Button>
              <Button
                variant={batchSize === 10 ? "default" : "outline"}
                onClick={() => setBatchSize(10)}
                className="flex-1"
              >
                10
              </Button>
              <Button
                variant={batchSize === 25 ? "default" : "outline"}
                onClick={() => setBatchSize(25)}
                className="flex-1"
              >
                25
              </Button>
              <Button
                variant={batchSize === 50 ? "default" : "outline"}
                onClick={() => setBatchSize(50)}
                className="flex-1"
              >
                50
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Generator */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Bulk Generator</h3>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            onClick={() => {
              for (let i = 0; i < batchSize; i++) {
                generateUUID()
              }
            }}
            className="gap-2"
          >
            Generate {batchSize} UUIDs
          </Button>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Recent UUIDs</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear History
            </Button>
          </div>

          <div className="space-y-3">
            {history.map((historyUuid, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-4 border rounded-lg bg-gradient-to-r from-background to-muted/10 hover:to-muted/20 transition-colors"
              >
                <span className="font-mono text-sm flex-1 break-all">{historyUuid}</span>
                <Button variant="ghost" size="sm" onClick={() => handleCopy(historyUuid)} className="flex-shrink-0">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="bg-gradient-to-r from-muted/30 to-muted/20 p-6 rounded-xl border">
        <h4 className="text-lg font-semibold mb-4">About UUID v4:</h4>
        <ul className="text-sm text-muted-foreground space-y-2 leading-relaxed">
          <li className="flex items-start space-x-2">
            <span className="font-semibold text-foreground mt-0.5">•</span>
            <span>
              <strong className="text-foreground">Version 4:</strong> Generated using cryptographically secure random
              numbers
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="font-semibold text-foreground mt-0.5">•</span>
            <span>
              <strong className="text-foreground">Uniqueness:</strong> Extremely low probability of collision (1 in 5.3
              x 10³⁶)
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="font-semibold text-foreground mt-0.5">•</span>
            <span>
              <strong className="text-foreground">Format:</strong> 32 hexadecimal digits in 8-4-4-4-12 pattern
            </span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="font-semibold text-foreground mt-0.5">•</span>
            <span>
              <strong className="text-foreground">Use Cases:</strong> Database primary keys, session IDs, unique
              identifiers
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}
