import { useEffect, useState, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Heart,
  Share2,
  ListPlus,
  Music2,
  ArrowLeft,
  BadgeCheck,
  Disc,
  Radio,
  Repeat,
  Shuffle,
  Sparkles,
  User,
  Clock,
  Flame,
} from 'lucide-react'
import axios from 'axios'
import Musicpic from '../assets/music.jpg'
import Userpic from '../assets/user.jpg'
import Loading from '../components/Loading'

const PlayAlbum = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const audioRef = useRef(null)

  // Track & Artist state
  const [track, setTrack] = useState({
    _id: id,
    title: 'Loading Track...',
    genre: 'POP',
    url: null,
    image: '',
    artist: {
      _id: '',
      username: 'Artist',
      name: 'Artist Name',
      image: '',
    },
  })

  // Player States
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [loading, setLoading] = useState(true)
  const [relatedTracks, setRelatedTracks] = useState([])

  const [albumTitle, setAlbumTitle] = useState('')

  // Fetch Album & Tracks Details
  useEffect(() => {
    let isMounted = true
    async function fetchAlbumData() {
      setLoading(true)
      try {
        const res = await axios.get(`http://localhost:3000/api/album/album/${id}`, {
          withCredentials: true,
        })
        if (isMounted && res.data && res.data.album) {
          const albumObj = res.data.album
          setAlbumTitle(albumObj.title || 'Album')
          const musics = albumObj.musics || []
          if (musics.length > 0) {
            setTrack(musics[0])
            setRelatedTracks(musics)
          } else {
            alert('This album has no tracks.')
            navigate('/')
          }
        }
      } catch (err) {
        console.warn('Backend fetch status:', err?.response?.data?.message || err.message)
        if (isMounted) {
          alert(err?.response?.data?.message || 'Could not fetch album details.')
          navigate('/')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    if (id) fetchAlbumData()
    return () => {
      isMounted = false
    }
  }, [id])

  // Sync Volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  // Toggle Play / Pause
  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log('Playback error:', err))
    }
  }

  // Audio Time Update Handler
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  // Loaded Metadata
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0)
    }
  }

  // Scrubber Change
  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value)
    setCurrentTime(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  // Rewind / Fast-forward 10s
  const skipTime = (seconds) => {
    if (audioRef.current) {
      const nextTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds))
      audioRef.current.currentTime = nextTime
      setCurrentTime(nextTime)
    }
  }

  // Format Time Helper
  const formatTime = (timeInSec) => {
    if (isNaN(timeInSec) || timeInSec === 0) return '0:00'
    const mins = Math.floor(timeInSec / 60)
    const secs = Math.floor(timeInSec % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  const trackCover = track.image || Musicpic
  const artistPic = track.artist?.image || Userpic
  const audioSrc = track.url

  if (loading) {
    return (
      <Loading/>
    )
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans selection:bg-[#1DB954] selection:text-black">
      {/* Dynamic Ambient Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#1DB954]/15 rounded-full blur-[160px] opacity-70 transition-all duration-700"
        />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-[#1e3a2b]/20 rounded-full blur-[140px]" />
      </div>

      {/* HTML5 Audio Element */}
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          if (!isLooping) setIsPlaying(false)
          
        }}
        loop={isLooping}
      />

      {/* Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#121212]/80 backdrop-blur-md px-6 py-4 border-b border-[#282828] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full bg-[#1DB954] flex items-center justify-center shadow-lg shadow-[#1DB954]/20 group-hover:scale-105 transition-transform">
            <Music2 className="w-5 h-5 text-black" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-[#1DB954] transition-colors">
            Spotify<span className="text-[#1DB954]">.</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#242424] hover:bg-[#2a2a2a] border border-[#383838] text-xs font-semibold text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <Link
            to="/create-music"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1DB954] text-black text-xs font-extrabold hover:scale-105 transition-transform"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Create Music</span>
          </Link>
        </div>
      </header>

      {/* Main Music Player Area */}
      <main className="relative z-10 px-4 sm:px-6 lg:px-12 py-8 max-w-7xl mx-auto space-y-10">
        {/* Main Track Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#1e3a2b]/80 via-[#181818] to-[#141414] border border-[#282828] p-6 sm:p-10 shadow-2xl backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Cover Art Display (5 cols) */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="relative group aspect-square w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-[#383838]">
                <img
                  src={trackCover}
                  alt={track.title}
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    isPlaying ? 'scale-105' : 'scale-100'
                  }`}
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />

                {/* Animated Waveform Overlay when Playing */}
                {isPlaying && (
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-1 bg-black/60 backdrop-blur-md py-2 px-4 rounded-full border border-white/10">
                    {[40, 70, 30, 90, 60, 100, 50, 85, 45, 75, 35, 95].map((h, i) => (
                      <div
                        key={i}
                        style={{ height: `${h}%` }}
                        className="w-1 bg-[#1DB954] rounded-full animate-pulse"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Track Details & Interactive Player (7 cols) */}
            <div className="md:col-span-7 space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[20px] font-extrabold uppercase tracking-widest text-[#1DB954]  px-3 py-1 rounded-full">
                  <Disc className="w-5 h-5" /> {track.type || 'POP'}
                </span>
                {track.genre && (
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#b3b3b3] bg-[#242424] px-3 py-1 rounded-full border border-[#383838]">
                    {track.genre}
                  </span>
                )}
              </div>

              {/* Title & Artist */}
              <div>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-2 leading-tight">
                  {track.title}
                </h1>

                <div
                  onClick={() => {
                    if (track.artist?._id) navigate(`/user-profile/${track.artist._id}`)
                  }}
                  className="flex items-center gap-3 group cursor-pointer w-fit py-1"
                >
                  <img
                    src={artistPic}
                    alt={track.artist?.username || 'Artist'}
                    className="w-9 h-9 rounded-full object-cover border border-[#1DB954]/50 group-hover:scale-105 transition-transform"
                  />
                  <span className="text-base font-bold text-white group-hover:text-[#1DB954] transition-colors flex items-center gap-1.5">
                    {track.artist?.username || track.artist?.name || 'Unknown Artist'}
                    <BadgeCheck className="w-4 h-4 text-[#1DB954]" />
                  </span>
                </div>
              </div>

              {/* Interactive Player Controls */}
              <div className="bg-[#181818]/90 rounded-2xl p-6 border border-[#282828] space-y-5 shadow-xl">
                {/* Progress Bar & Timers */}
                <div className="space-y-2">
                  <div className="relative group">
                    <input
                      type="range"
                      min={0}
                      max={duration || 100}
                      step={0.1}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-2 bg-[#333] rounded-lg appearance-none cursor-pointer accent-[#1DB954] focus:outline-none"
                    />
                  </div>
                  <div className="flex justify-between text-xs font-mono text-[#b3b3b3]">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Control Buttons Bar */}
                <div className="flex items-center justify-center gap-8 relative">
                  {/* Left Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => skipTime(-10)}
                      className="p-2.5 rounded-full text-[#b3b3b3] hover:text-white hover:bg-[#282828] transition-colors"
                      title="Rewind 10s"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Play / Pause Main Button */}
                  <button
                    onClick={togglePlay}
                    className="w-14 h-14 rounded-full bg-[#1DB954] hover:bg-[#1ed760] hover:scale-105 active:scale-95 text-black flex items-center justify-center shadow-lg shadow-[#1DB954]/30 transition-all cursor-pointer shrink-0"
                  >
                    {isPlaying ? (
                      <Pause className="w-7 h-7 fill-current" />
                    ) : (
                      <Play className="w-7 h-7 fill-current translate-x-0.5" />
                    )}
                  </button>

                  {/* Right Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => skipTime(10)}
                      className="p-2.5 rounded-full text-[#b3b3b3] hover:text-white hover:bg-[#282828] transition-colors"
                      title="Forward 10s"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setIsLooping(!isLooping)}
                      className={`p-2.5 rounded-full transition-colors absolute right-8 ${
                        isLooping
                          ? 'text-[#1DB954] bg-[#1DB954]/10'
                          : 'text-[#b3b3b3] hover:text-white hover:bg-[#282828]'
                      }`}
                      title="Repeat track"
                    >
                      <Repeat className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Secondary Row: Volume & Utility buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-[#282828]">
                  {/* Volume Controls */}
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-[#b3b3b3] hover:text-white transition-colors"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-4 h-4 text-red-400" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-[#1DB954]" />
                      )}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={isMuted ? 0 : volume}
                      onChange={(e) => {
                        setVolume(parseFloat(e.target.value))
                        if (isMuted) setIsMuted(false)
                      }}
                      className="w-24 h-1.5 bg-[#333] rounded-lg appearance-none cursor-pointer accent-[#1DB954]"
                    />
                  </div>

                  {/* Share */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(window.location.href)
                        alert('Copied to clipboard!')
                      }}
                      className="p-2.5 rounded-full bg-[#242424] border border-[#383838] text-[#b3b3b3] hover:text-white transition-colors"
                      title="Share Track"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Two Column Layout: Related Tracks & Track Meta Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Up Next / Recommended (7 cols) */}
          <section className="lg:col-span-7 space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-[#1DB954]" /> Up Next & Recommended
            </h2>

            <div className="bg-[#181818]/60 backdrop-blur-md rounded-2xl p-4 border border-[#282828] divide-y divide-[#282828]">
              {relatedTracks.length === 0 ? (
                <p className="text-sm text-[#888] text-center py-6">No other tracks found</p>
              ) : (
                relatedTracks.map((relTrack, idx) => (
                  <div
                    key={relTrack._id || idx}
                    onClick={() => {
                      setTrack(relTrack)
                      setIsPlaying(true)
                    }}
                    className={`flex items-center justify-between py-3 px-3 rounded-xl transition-all group cursor-pointer ${
                      track._id === relTrack._id
                        ? 'bg-[#1DB954]/20 border border-[#1DB954]/40'
                        : 'hover:bg-[#282828]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span className="text-xs font-mono text-[#777] group-hover:text-[#1DB954] w-4 text-center">
                        {idx + 1}
                      </span>
                      <img
                        src={relTrack.image || Musicpic}
                        alt={relTrack.title}
                        className="w-11 h-11 rounded-lg object-cover shadow-md shrink-0"
                      />
                      <div className="truncate">
                        <p className="text-sm font-bold text-white group-hover:text-[#1DB954] transition-colors truncate">
                          {relTrack.title}
                        </p>
                        <p className="text-xs text-[#b3b3b3] truncate">
                          {relTrack.artist?.username || 'Artist'} • {relTrack.type || 'Single'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button className="w-8 h-8 rounded-full bg-[#242424] group-hover:bg-[#1DB954] text-[#b3b3b3] group-hover:text-black flex items-center justify-center transition-colors">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Right Column: Track Metadata & Production Info (5 cols) */}
          <section className="lg:col-span-5 space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#1DB954]" /> About This Release
            </h2>

            <div className="bg-[#181818]/60 backdrop-blur-md rounded-2xl p-6 border border-[#282828] space-y-4 text-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#282828]">
                <span className="text-[#b3b3b3]">Release Type</span>
                <span className="font-semibold text-white">{track.type || 'Single'}</span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-[#282828]">
                <span className="text-[#b3b3b3]">Primary Genre</span>
                <span className="font-semibold text-white">{track.genre || 'Music'}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#b3b3b3]">Artist</span>
                <span className="font-semibold text-white">
                  {track.artist.username}
                </span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default PlayAlbum