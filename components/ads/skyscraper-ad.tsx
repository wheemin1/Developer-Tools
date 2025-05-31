"use client"

export function SkyscraperAd() {
  return (
    <div className="w-48 space-y-4">
      <div className="bg-gradient-to-b from-green-500 to-blue-600 text-white p-4 rounded-lg text-center">
        <div className="text-xs font-medium mb-2">Advertisement</div>
        <div className="text-sm font-bold mb-2">🔧 Developer Tools</div>
        <div className="text-xs mb-3">Complete suite of encoding, formatting, and validation tools</div>
        <button className="bg-white text-blue-600 px-3 py-1 rounded text-xs font-medium hover:bg-gray-100 transition-colors">
          Learn More
        </button>
      </div>

      <div className="bg-gradient-to-b from-purple-500 to-pink-600 text-white p-4 rounded-lg text-center">
        <div className="text-xs font-medium mb-2">Advertisement</div>
        <div className="text-sm font-bold mb-2">📊 Analytics Pro</div>
        <div className="text-xs mb-3">Track and analyze your URL encoding patterns</div>
        <button className="bg-white text-purple-600 px-3 py-1 rounded text-xs font-medium hover:bg-gray-100 transition-colors">
          Try Free
        </button>
      </div>

      <div className="bg-gradient-to-b from-orange-500 to-red-600 text-white p-4 rounded-lg text-center">
        <div className="text-xs font-medium mb-2">Advertisement</div>
        <div className="text-sm font-bold mb-2">🎯 API Access</div>
        <div className="text-xs mb-3">Integrate URL encoding into your applications</div>
        <button className="bg-white text-orange-600 px-3 py-1 rounded text-xs font-medium hover:bg-gray-100 transition-colors">
          Get API Key
        </button>
      </div>
    </div>
  )
}
