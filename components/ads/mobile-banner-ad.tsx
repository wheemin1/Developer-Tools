"use client"

export function MobileBannerAd() {
  return (
    <div className="w-full">
      <div className="bg-gradient-to-r from-indigo-500 to-cyan-600 text-white p-4 rounded-lg text-center">
        <div className="text-xs font-medium mb-1">Advertisement</div>
        <div className="text-base font-bold mb-1">📱 Mobile Developer Tools</div>
        <div className="text-sm mb-2 opacity-90">Optimize your mobile app URLs with our advanced encoding suite</div>
        <button className="bg-white text-indigo-600 px-4 py-2 rounded text-sm font-medium hover:bg-gray-100 transition-colors">
          Download App
        </button>
      </div>
    </div>
  )
}
