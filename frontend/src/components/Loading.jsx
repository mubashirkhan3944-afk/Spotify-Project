import React from 'react'
import { Music2, Disc, Sparkles } from 'lucide-react'

const Loading = ({ text = 'Tuning into Spotify...', fullScreen = true }) => {
  const content = (
    <div className="relative flex flex-col items-center justify-center p-8 text-center select-none">
      {/* Background Glow */}
      <div className="absolute w-[400px] h-[400px] bg-[#1DB954]/15 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Main Animated Icon Centerpiece */}
      <div className="relative mb-8 group">
        {/* Pulsing Outer Ring */}
        <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#1DB954]/40 via-[#1DB954]/10 to-[#1DB954]/40 blur-md animate-pulse" />
        
        {/* Spinning Disc Badge */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#181818] border-2 border-[#1DB954]/50 flex items-center justify-center shadow-2xl shadow-[#1DB954]/30">
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#1DB954] flex items-center justify-center text-black shadow-lg animate-spin-slow">
            <Disc className="w-10 h-10 stroke-[2.5]" />
          </div>
          {/* Inner Brand Logo */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Music2 className="w-6 h-6 text-black stroke-[3] translate-x-[0.5px]" />
          </div>
        </div>
      </div>

      {/* Equalizer Soundwave Bars Animation */}
      <div className="flex items-center gap-1.5 h-8 mb-6">
        {[40, 75, 45, 95, 60, 100, 50, 85, 35, 70].map((height, idx) => (
          <div
            key={idx}
            style={{
              height: `${height}%`,
              animationDelay: `${(idx % 5) * 0.15}s`,
            }}
            className="w-1.5 bg-gradient-to-t from-[#1DB954]/40 to-[#1DB954] rounded-full animate-bounce duration-700"
          />
        ))}
      </div>

      {/* Shimmer Line Progress Bar */}
      <div className="w-48 sm:w-64 h-1 bg-[#282828] rounded-full overflow-hidden mt-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1DB954] to-transparent w-full animate-shimmer" />
      </div>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-[#121212] text-white font-sans flex items-center justify-center overflow-hidden">
        {content}
      </div>
    )
  }

  return content
}

export default Loading
