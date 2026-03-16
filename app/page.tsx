import { EncodingToolsApp } from "@/components/encoding-tools-app"
import { TopBannerAd } from "@/components/ads/top-banner-ad"
import { SkyscraperAd } from "@/components/ads/skyscraper-ad"
import { MobileBannerAd } from "@/components/ads/mobile-banner-ad"

export default function Home() {
  return (
    <>
      {/* SEO Content Header */}
      <section className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Free Developer Tools Suite - URL Encoder, Base64, JWT & More
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
          Professional-grade online developer tools for encoding, decoding, formatting, and data conversion. 
          9 essential utilities including URL encoder/decoder, Base64 converter, JWT token decoder, JSON formatter, 
          hash generators, UUID generator, and QR code creator. All tools work instantly in your browser with no signup required.
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">URL Encoder/Decoder</span>
          <span className="bg-green-100 dark:bg-green-900 px-2 py-1 rounded">Base64 Encoder/Decoder</span>
          <span className="bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded">JWT Decoder</span>
          <span className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">JSON Formatter</span>
          <span className="bg-red-100 dark:bg-red-900 px-2 py-1 rounded">Hash Generator</span>
          <span className="bg-indigo-100 dark:bg-indigo-900 px-2 py-1 rounded">UUID Generator</span>
          <span className="bg-pink-100 dark:bg-pink-900 px-2 py-1 rounded">QR Code Generator</span>
        </div>
      </section>

      {/* Top Banner Ad */}
      <TopBannerAd />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1">
            <EncodingToolsApp />

            {/* Mobile Banner Ad - Shows between components on mobile */}
            <div className="lg:hidden mt-6">
              <MobileBannerAd />
            </div>
            
            {/* SEO Content Footer */}
            <section className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">About Developer Tools Suite</h2>
              <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600 dark:text-gray-300">
                <div>
                  <h3 className="font-medium mb-2">Encoding & Decoding Tools</h3>
                  <ul className="space-y-1">
                    <li>• URL Encoder/Decoder - Convert special characters for web URLs</li>
                    <li>• Base64 Encoder/Decoder - Encode/decode text and files to Base64</li>
                    <li>• JWT Token Decoder - Decode JSON Web Tokens and view claims</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Formatting & Generation Tools</h3>
                  <ul className="space-y-1">
                    <li>• JSON Formatter - Format, validate and beautify JSON data</li>
                    <li>• Hash Generator - Generate MD5, SHA256 hashes from text/files</li>
                    <li>• UUID Generator - Generate unique identifiers in various formats</li>
                    <li>• QR Code Generator - Create QR codes for text, URLs, and more</li>
                  </ul>
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                All tools are client-side only - your data never leaves your browser. Free to use with no registration required.
              </p>
            </section>

            {/* Additional SEO Content */}
            <section className="mt-8 text-sm text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Why Choose Our Developer Tools Suite?
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2 text-gray-800 dark:text-gray-200">🔒 Privacy & Security</h3>
                  <p>All processing happens locally in your browser. No data is sent to servers, ensuring complete privacy and security for sensitive information.</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2 text-gray-800 dark:text-gray-200">⚡ Instant Results</h3>
                  <p>Real-time processing with live preview. See results as you type without delays or waiting for server responses.</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2 text-gray-800 dark:text-gray-200">📱 Cross-Platform</h3>
                  <p>Works on desktop, tablet, and mobile devices. Responsive design adapts to any screen size for optimal usability.</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2 text-gray-800 dark:text-gray-200">🆓 Completely Free</h3>
                  <p>No registration, no subscriptions, no hidden fees. Professional-grade tools available to everyone without restrictions.</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-medium mb-2 text-gray-800 dark:text-gray-200">Popular Use Cases:</h3>
                <p className="text-xs leading-relaxed">
                  Web developers use our URL encoder for handling special characters in URLs and query parameters. 
                  API developers rely on our Base64 encoder for data transmission and JWT decoder for token analysis. 
                  Frontend developers use our JSON formatter for debugging API responses and QR code generator for mobile app integration. 
                  Security professionals utilize our hash generators for data integrity verification and UUID generator for unique identifier creation.
                </p>
              </div>
            </section>
          </div>

          {/* Skyscraper Ad - Desktop only */}
          <div className="hidden lg:block">
            <SkyscraperAd />
          </div>
        </div>
      </div>
    </>
  )
}
