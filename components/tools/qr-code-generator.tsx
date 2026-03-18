"use client"

import { useMemo, useRef, useState } from "react"
import { QRCodeCanvas } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ERROR_CORRECTION_LEVELS, QR_SIZES } from "@/lib/constants"
import { Download, RotateCcw } from "lucide-react"
import { trackEvent } from "@/lib/analytics"

export function QRCodeGenerator() {
	const [text, setText] = useState("")
	const [size, setSize] = useState("256")
	const [level, setLevel] = useState("M")
	const canvasRef = useRef<HTMLCanvasElement | null>(null)

	const value = useMemo(() => {
		return text.trim() ? text.trim() : "https://example.com"
	}, [text])

	const handleDownload = () => {
		const canvas = canvasRef.current
		if (!canvas) return

		const url = canvas.toDataURL("image/png")
		const link = document.createElement("a")
		link.href = url
		link.download = "qr-code.png"
		link.click()
		trackEvent("process_success", { eventName: "qr_download" })
	}

	const loadSample = () => {
		setText("https://example.com/docs?ref=developer-tools")
		trackEvent("sample_load", { tool: "qr" })
	}

	const handleClear = () => {
		setText("")
	}

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
			<div className="space-y-6">
				<div className="space-y-2">
					<Label htmlFor="qr-text">Text or URL</Label>
					<Textarea
						id="qr-text"
						placeholder="Enter text or a URL to generate a QR code"
						value={text}
						onChange={(e) => setText(e.target.value)}
						className="min-h-[160px] font-mono"
					/>
					<div className="flex gap-2">
						<Button variant="outline" size="sm" onClick={loadSample}>
							Load Sample
						</Button>
						<Button variant="ghost" size="sm" onClick={handleClear}>
							Clear
						</Button>
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label>Size</Label>
						<Select value={size} onValueChange={setSize}>
							<SelectTrigger>
								<SelectValue placeholder="Select size" />
							</SelectTrigger>
							<SelectContent>
								{QR_SIZES.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label>Error Correction</Label>
						<Select value={level} onValueChange={setLevel}>
							<SelectTrigger>
								<SelectValue placeholder="Correction level" />
							</SelectTrigger>
							<SelectContent>
								{ERROR_CORRECTION_LEVELS.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<Label>Preview</Label>
					<Button size="sm" className="gap-2" onClick={handleDownload}>
						<Download className="h-4 w-4" />
						Download PNG
					</Button>
				</div>
				<div className="flex items-center justify-center rounded-lg border bg-background p-6 min-h-[320px]">
					<QRCodeCanvas
						value={value}
						size={Number(size)}
						level={level as "L" | "M" | "Q" | "H"}
						includeMargin
						ref={canvasRef}
					/>
				</div>
				<div className="flex items-center text-xs text-muted-foreground gap-2">
					<RotateCcw className="h-3 w-3" />
					Updates live as you type.
				</div>
			</div>
		</div>
	)
}
