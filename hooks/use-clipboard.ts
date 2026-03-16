"use client"

import { useState, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import { COPY_FEEDBACK_DURATION } from "@/lib/constants"

export function useClipboard() {
  const [copied, setCopied] = useState<string>("")
  const { toast } = useToast()

  const copyToClipboard = useCallback(
    async (text: string, label = "Text") => {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(label)
        toast({
          title: "Copied!",
          description: `${label} copied to clipboard.`,
        })

        setTimeout(() => {
          setCopied("")
        }, COPY_FEEDBACK_DURATION)
      } catch (error) {
        toast({
          title: "Copy Failed",
          description: "Failed to copy to clipboard.",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  const copyImageToClipboard = useCallback(
    async (canvas: HTMLCanvasElement, label = "Image") => {
      try {
        await new Promise<void>((resolve, reject) => {
          canvas.toBlob(async (blob) => {
            if (blob) {
              try {
                await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
                setCopied(label)
                toast({
                  title: "Copied!",
                  description: `${label} copied to clipboard.`,
                })
                setTimeout(() => setCopied(""), COPY_FEEDBACK_DURATION)
                resolve()
              } catch (error) {
                reject(error)
              }
            } else {
              reject(new Error("Failed to create blob"))
            }
          })
        })
      } catch (error) {
        toast({
          title: "Copy Failed",
          description: "Failed to copy image to clipboard.",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  return {
    copied,
    copyToClipboard,
    copyImageToClipboard,
  }
}
