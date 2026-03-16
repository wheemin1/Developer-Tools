"use client"

import { useState } from "react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

interface CharacterTooltipProps {
  text: string
}

export function CharacterTooltip({ text }: CharacterTooltipProps) {
  const [hoveredChar, setHoveredChar] = useState<string | null>(null)

  const commonEncodings = {
    "%20": "Space",
    "%21": "! (Exclamation mark)",
    "%22": '" (Quotation mark)',
    "%23": "# (Hash/Pound)",
    "%24": "$ (Dollar sign)",
    "%25": "% (Percent)",
    "%26": "& (Ampersand)",
    "%27": "' (Apostrophe)",
    "%28": "( (Left parenthesis)",
    "%29": ") (Right parenthesis)",
    "%2A": "* (Asterisk)",
    "%2B": "+ (Plus sign)",
    "%2C": ", (Comma)",
    "%2D": "- (Hyphen)",
    "%2E": ". (Period)",
    "%2F": "/ (Forward slash)",
    "%3A": ": (Colon)",
    "%3B": "; (Semicolon)",
    "%3C": "< (Less than)",
    "%3D": "= (Equal sign)",
    "%3E": "> (Greater than)",
    "%3F": "? (Question mark)",
    "%40": "@ (At symbol)",
    "%5B": "[ (Left bracket)",
    "%5C": "\\ (Backslash)",
    "%5D": "] (Right bracket)",
    "%5E": "^ (Caret)",
    "%5F": "_ (Underscore)",
    "%60": "` (Backtick)",
    "%7B": "{ (Left brace)",
    "%7C": "| (Pipe)",
    "%7D": "} (Right brace)",
    "%7E": "~ (Tilde)",
  }

  const renderTextWithTooltips = () => {
    const parts = text.split(/(%[0-9A-Fa-f]{2})/g)

    return parts.map((part, index) => {
      const upperPart = part.toUpperCase()
      if (commonEncodings[upperPart as keyof typeof commonEncodings]) {
        return (
          <HoverCard key={index}>
            <HoverCardTrigger asChild>
              <span
                className="bg-primary/20 px-1 rounded cursor-help hover:bg-primary/30 transition-colors"
                onMouseEnter={() => setHoveredChar(upperPart)}
                onMouseLeave={() => setHoveredChar(null)}
              >
                {part}
              </span>
            </HoverCardTrigger>
            <HoverCardContent className="w-auto p-2">
              <div className="text-sm">
                <strong>{upperPart}</strong> = {commonEncodings[upperPart as keyof typeof commonEncodings]}
              </div>
            </HoverCardContent>
          </HoverCard>
        )
      }
      return <span key={index}>{part}</span>
    })
  }

  return (
    <div className="p-3 font-mono text-sm pointer-events-auto overflow-hidden text-transparent bg-transparent select-none">
      {renderTextWithTooltips()}
    </div>
  )
}
