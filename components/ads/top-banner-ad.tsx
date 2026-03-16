"use client"

export function TopBannerAd() {
  return (
    <div className="w-full bg-muted/30 border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg text-center max-w-4xl w-full">
            <div className="text-sm font-medium">Advertisement</div>
            <div className="text-lg font-bold mt-1">🚀 Boost Your Development Workflow - Premium Tools Available</div>
            <div className="text-sm mt-1 opacity-90">
              Professional URL encoding tools with advanced features and API access
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
