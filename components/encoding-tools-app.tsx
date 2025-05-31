"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { URLEncoderDecoder } from "@/components/tools/url-encoder-decoder"
import { Base64EncoderDecoder } from "@/components/tools/base64-encoder-decoder"
import { JSONFormatter } from "@/components/tools/json-formatter"
import { HashGenerator } from "@/components/tools/hash-generator"
import { JWTDecoder } from "@/components/tools/jwt-decoder"
import { UUIDGenerator } from "@/components/tools/uuid-generator"
import { TextCaseConverter } from "@/components/tools/text-case-converter"
import { WhitespaceCleaner } from "@/components/tools/whitespace-cleaner"
import { QRCodeGenerator } from "@/components/tools/qr-code-generator"
import { TOOL_CATEGORIES } from "@/lib/constants"
import { Link, FileText, Hash, Code, Key, Fingerprint, Type, Eraser, QrCode } from "lucide-react"

const TOOL_ICONS = {
  url: Link,
  base64: FileText,
  jwt: Key,
  json: Code,
  case: Type,
  whitespace: Eraser,
  hash: Hash,
  uuid: Fingerprint,
  qr: QrCode,
} as const

const TOOL_COMPONENTS = {
  url: URLEncoderDecoder,
  base64: Base64EncoderDecoder,
  jwt: JWTDecoder,
  json: JSONFormatter,
  case: TextCaseConverter,
  whitespace: WhitespaceCleaner,
  hash: HashGenerator,
  uuid: UUIDGenerator,
  qr: QRCodeGenerator,
} as const

export function EncodingToolsApp() {
  const [activeTab, setActiveTab] = useState("url")

  const allTools = TOOL_CATEGORIES.flatMap((category) => category.tools)
  const activeToolInfo = allTools.find((tool) => tool.id === activeTab)
  const ActiveComponent = TOOL_COMPONENTS[activeTab as keyof typeof TOOL_COMPONENTS]

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Developer Utility Tools
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Complete suite of encoding, decoding, formatting, and utility tools for developers with real-time processing
        </p>
      </div>

      {/* Tools Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Tool Categories */}
        <div className="space-y-6">
          {TOOL_CATEGORIES.map((category) => (
            <div key={category.name} className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-2">
                {category.name}
              </h3>
              <TabsList className="grid w-full grid-cols-3 h-auto p-1.5 bg-muted/50">
                {category.tools.map((tool) => {
                  const Icon = TOOL_ICONS[tool.id as keyof typeof TOOL_ICONS]
                  return (
                    <TabsTrigger
                      key={tool.id}
                      value={tool.id}
                      className="flex flex-col items-center space-y-2 p-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200 hover:bg-muted/80 min-h-[80px]"
                    >
                      <Icon className="h-5 w-5 md:h-6 md:w-6 flex-shrink-0" />
                      <span className="text-xs md:text-sm font-medium text-center leading-tight">{tool.shortName}</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </div>
          ))}
        </div>

        {/* Active Tool Description */}
        {activeToolInfo && (
          <div className="text-center py-6 bg-gradient-to-r from-muted/20 to-muted/10 rounded-lg border mt-6">
            <div className="flex items-center justify-center space-x-3 mb-2">
              {(() => {
                const Icon = TOOL_ICONS[activeToolInfo.id as keyof typeof TOOL_ICONS]
                return <Icon className="h-5 w-5 text-primary" />
              })()}
              <h2 className="text-xl font-semibold">{activeToolInfo.name}</h2>
            </div>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">{activeToolInfo.description}</p>
          </div>
        )}

        {/* Tool Content */}
        <TabsContent value={activeTab} className="mt-8">
          {ActiveComponent && <ActiveComponent />}
        </TabsContent>
      </Tabs>
    </div>
  )
}
