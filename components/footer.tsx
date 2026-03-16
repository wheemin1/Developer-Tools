export function Footer() {
  return (
    <footer className="border-t bg-gradient-to-r from-muted/30 to-muted/20 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-bold">Developer Utility Tools</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              Complete suite of encoding, decoding, formatting, and utility tools with real-time processing and advanced
              features designed specifically for developers.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-base">Encoding Tools</h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• URL Encoder/Decoder</li>
              <li>• Base64 Encoder/Decoder</li>
              <li>• JWT Decoder</li>
              <li>• Real-time processing</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-base">Text Tools</h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• JSON Formatter</li>
              <li>• Text Case Converter</li>
              <li>• Whitespace Cleaner</li>
              <li>• Hash Generator</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-base">Generators</h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• UUID Generator</li>
              <li>• QR Code Generator</li>
              <li>• Hash Generator</li>
              <li>• Crypto-secure random</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Developer Utility Tools. Built for developers, by developers.
          </p>
        </div>
      </div>
    </footer>
  )
}
