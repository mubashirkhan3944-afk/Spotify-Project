import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import {
  Music2,
  Upload,
  Music,
  Image as ImageIcon,
  Play,
  Pause,
  Sparkles,
  Disc,
  Tag,
  FileAudio,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Trash2,
  Volume2,
  Sliders,
  Plus,
  X,
  Radio,
  FolderPlus,
  Flame,
} from 'lucide-react'
import axios from 'axios'

const GENRES = [
  'POP',
  'RAP',
  'ROCK',
  'LOFI',
  'CLASSIC',
  'ELECTRONIC',
  'HIP-HOP',
  'R&B',
  'JAZZ',
  'ACOUSTIC',
  'DANCE',
  'AMBIENT',  
]



const CreateMusic = () => {
  const navigate = useNavigate()
  const audioRef = useRef(null) 

  // Form State
  const [title, setTitle] = useState('')    
  const [genre, setGenre] = useState('POP')

  // Files & Previews
  const [audioFile, setAudioFile] = useState(null)
  const [audioPreviewUrl, setAudioPreviewUrl] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null)

  // Drag States
  const [isDraggingAudio, setIsDraggingAudio] = useState(false)
  const [isDraggingImage, setIsDraggingImage] = useState(false)

  // Player State for Preview
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioDuration, setAudioDuration] = useState('0:00')

  // UI Status
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Clean up Object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl)
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl)
    }
  }, [audioPreviewUrl, imagePreviewUrl])

  // Handle Audio File Selection
  const handleAudioSelect = (file) => {
    if (!file) return
    if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|wav|ogg|flac|m4a)$/i)) {
      setErrorMessage('Please select a valid audio file (.mp3, .wav, .ogg, .flac).')
      return
    }
    setErrorMessage('')
    if (audioPreviewUrl){
        URL.revokeObjectURL(audioPreviewUrl)
    }
    setAudioFile(file)
    const url = URL.createObjectURL(file)
    setAudioPreviewUrl(url)
    setIsPlaying(false)
  }

  // Handle Image File Selection
  const handleImageSelect = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (.png, .jpg, .webp).')
      return
    }
    setErrorMessage('')
    if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl)
    }
    setImageFile(file)
    const url = URL.createObjectURL(file)
    setImagePreviewUrl(url)
  }

  // Drag and Drop Handlers for Audio
  const handleAudioDrop = (e) => {
    e.preventDefault()
    setIsDraggingAudio(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleAudioSelect(e.dataTransfer.files[0])
    }
  }

  // Drag and Drop Handlers for Image
  const handleImageDrop = (e) => {
    e.preventDefault()
    setIsDraggingImage(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageSelect(e.dataTransfer.files[0])
    }
  }



  // Audio preview play/pause handler
  const togglePlayPreview = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log('Audio playback error:', err))
    }
  }

  // Format Duration string
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const dur = audioRef.current.duration
      if (!isNaN(dur)) {
        const mins = Math.floor(dur / 60)
        const secs = Math.floor(dur % 60)
        setAudioDuration(`${mins}:${secs < 10 ? '0' : ''}${secs}`)
      }
    }
  }

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!title.trim()) {
      setErrorMessage('Track Title is required.')
      return
    }
    if (!audioFile) {
      setErrorMessage('Please upload an audio file for your track.')
      return
    }

    setIsSubmitting(true)

    // Construct Form Data
    const formData = new FormData()
    formData.append('title', title)
    formData.append('type', genre)
    formData.append('music', audioFile)
    if (imageFile) {
      formData.append('image', imageFile)
    }

    try {
      const res = await axios.post('https://spotify-project-7nhp.onrender.com/api/music/create-music', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      })
      setIsSubmitting(false)
      setSubmitSuccess(true)
    } catch (err) {
        setIsSubmitting(false)
        setErrorMessage(err.response.data.message)
    }
  }

  const handleResetForm = () => {
    setTitle('')
    setGenre('Pop')
    setAudioFile(null)
    setAudioPreviewUrl(null)
    setImageFile(null)
    setImagePreviewUrl(null)
    setIsPlaying(false)
    setSubmitSuccess(false)
    setErrorMessage('')
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans selection:bg-[#1DB954] selection:text-black">
      {/* Background Ambient Glow */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-[#1DB954]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-[#1e3a2b]/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Header Navigation */}
      <header className="sticky top-0 z-40 bg-[#121212]/80 backdrop-blur-md px-6 py-4 border-b border-[#282828] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full bg-[#1DB954] flex items-center justify-center shadow-lg shadow-[#1DB954]/20 group-hover:scale-105 transition-transform">
            <Music2 className="w-5 h-5 text-black" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-[#1DB954] transition-colors">
            Spotify<span className="text-[#1DB954]">.</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#242424] text-xs font-semibold text-[#1DB954] border border-[#1DB954]/30">
            <Sparkles className="w-3.5 h-3.5" /> Creator Studio
          </span>
          <Link
            to="/profile"
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#b3b3b3] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Profile
          </Link>
        </div>
      </header>

      {/* Main Studio Container */}
      <main className="relative z-10 px-4 sm:px-6 lg:px-12 py-8 max-w-7xl mx-auto space-y-8">
        {/* Banner Section */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1e3a2b] via-[#162a1f] to-[#181818] p-6 sm:p-8 border border-[#282828] shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#1DB954] bg-[#1DB954]/10 px-3 py-1 rounded-full border border-[#1DB954]/30 mb-3">
                <Disc className="w-3.5 h-3.5 animate-spin-slow" /> New Release Studio
              </span>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
                Create & Publish Track
              </h1>
              <p className="text-[#b3b3b3] text-sm max-w-xl">
                Upload your latest music track, customize cover artwork, tag your genre, and share your sound with listeners.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetForm}
                className="px-4 py-2.5 rounded-full bg-[#242424] hover:bg-[#2a2a2a] border border-[#383838] hover:border-[#555] text-xs font-semibold text-white transition-all"
              >
                Clear Form
              </button>
            </div>
          </div>
        </section>

        {/* Success Modal / Banner */}
        {submitSuccess && (
          <div className="bg-[#1DB954]/15 border border-[#1DB954] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl backdrop-blur-md animate-fade-in">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1DB954] flex items-center justify-center text-black shrink-0 shadow-lg shadow-[#1DB954]/30">
                <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Track Published Successfully!</h3>
                <p className="text-sm text-[#b3b3b3]">
                  Your track <strong className="text-white">"{title || 'Untitled Track'}"</strong> has been prepared and published to your studio library.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleResetForm}
                className="px-4 py-2 rounded-full bg-[#1DB954] text-black font-bold text-xs hover:scale-105 transition-transform"
              >
                Create Another Track
              </button>
              <Link
                to="/profile"
                className="px-4 py-2 rounded-full bg-[#242424] hover:bg-[#2a2a2a] text-white font-semibold text-xs border border-[#383838] transition-colors"
              >
                Go to Profile
              </Link>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Main Grid: Left Form, Right Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form (7 cols) */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
            {/* Audio Upload Dropzone Card */}
            <div className="bg-[#181818]/90 backdrop-blur-md rounded-2xl p-6 border border-[#282828] shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <FileAudio className="w-4 h-4 text-[#1DB954]" /> Audio Track <span className="text-[#1DB954]">*</span>
                </label>
                <span className="text-xs text-[#b3b3b3]">Supports MP3, WAV, FLAC, OGG</span>
              </div>

              {!audioFile ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDraggingAudio(true)
                  }}
                  onDragLeave={() => setIsDraggingAudio(false)}
                  onDrop={handleAudioDrop}
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer group ${
                    isDraggingAudio
                      ? 'border-[#1DB954] bg-[#1DB954]/10'
                      : 'border-[#333] hover:border-[#1DB954]/60 bg-[#202020]/50 hover:bg-[#242424]'
                  }`}
                >
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => e.target.files && handleAudioSelect(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-14 h-14 rounded-full bg-[#282828] group-hover:bg-[#1DB954] flex items-center justify-center mx-auto mb-3 transition-colors text-[#1DB954] group-hover:text-black shadow-md">
                    <Upload className="w-6 h-6 stroke-[2]" />
                  </div>
                  <p className="text-sm font-bold text-white mb-1">
                    Drag & Drop your audio file here
                  </p>
                  <p className="text-xs text-[#b3b3b3]">
                    or <span className="text-[#1DB954] underline underline-offset-2">browse computer</span> (High Quality recommended)
                  </p>
                </div>
              ) : (
                <div className="bg-[#242424] rounded-xl p-4 border border-[#383838] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-[#1DB954]/20 flex items-center justify-center text-[#1DB954] shrink-0">
                        <Music className="w-5 h-5" />
                      </div>
                      <div className="truncate">
                        <p className="text-sm font-semibold text-white truncate">{audioFile.name}</p>
                        <p className="text-xs text-[#b3b3b3]">
                          {(audioFile.size / (1024 * 1024)).toFixed(2)} MB • {audioDuration}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAudioFile(null)
                        setAudioPreviewUrl(null)
                        setIsPlaying(false)
                      }}
                      className="p-2 text-[#b3b3b3] hover:text-red-400 hover:bg-[#333] rounded-full transition-colors"
                      title="Remove audio file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Hidden HTML5 Audio Element */}
                  {audioPreviewUrl && (
                    <audio
                      ref={audioRef}
                      src={audioPreviewUrl}
                      onLoadedMetadata={handleLoadedMetadata}
                      onEnded={() => setIsPlaying(false)}
                    />
                  )}

                  {/* Custom Mini Wave Player Bar */}
                  <div className="flex items-center gap-3 pt-2 border-t border-[#333]">
                    <button
                      type="button"
                      onClick={togglePlayPreview}
                      className="w-9 h-9 rounded-full bg-[#1DB954] hover:scale-105 flex items-center justify-center text-black transition-transform shrink-0"
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current translate-x-0.5" />
                      )}
                    </button>
                    <div className="flex-1 flex items-center gap-1 h-6">
                      {[40, 70, 30, 90, 50, 80, 60, 100, 45, 75, 35, 85, 65, 95, 50, 80, 40, 70, 30, 90].map(
                        (h, idx) => (
                          <div
                            key={idx}
                            style={{ height: `${isPlaying ? h : 30}%` }}
                            className={`flex-1 rounded-full transition-all duration-300 ${
                              isPlaying ? 'bg-[#1DB954]' : 'bg-[#444]'
                            }`}
                          />
                        )
                      )}
                    </div>
                    <span className="text-xs text-[#b3b3b3] font-mono shrink-0">
                      {isPlaying ? 'Playing...' : 'Audio Ready'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Track Information Card */}
            <div className="bg-[#181818]/90 backdrop-blur-md rounded-2xl p-6 border border-[#282828] shadow-xl space-y-5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#1DB954]" /> Track Details
              </h2>

              {/* Title Field */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#b3b3b3] flex justify-between">
                  <span>Track Title <span className="text-[#1DB954]">*</span></span>
                  <span>{title.length}/100</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={100}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Midnight Memories"
                    className="w-full bg-[#242424] border border-[#383838] focus:border-[#1DB954] focus:ring-1 focus:ring-[#1DB954] text-white rounded-xl px-4 py-3 text-sm placeholder-[#555] outline-none transition-all"
                  />
                </div>
              </div>



              {/* Genre Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#b3b3b3]">Primary Genre</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full bg-[#242424] border border-[#383838] focus:border-[#1DB954] focus:ring-1 focus:ring-[#1DB954] text-white rounded-xl px-4 py-3 text-sm outline-none transition-all cursor-pointer"
                >
                  {GENRES.map((g) => (
                    <option key={g} value={g} className="bg-[#181818] text-white">
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cover Artwork Dropzone Card */}
            <div className="bg-[#181818]/90 backdrop-blur-md rounded-2xl p-6 border border-[#282828] shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#1DB954]" /> Cover Photo
                </label>
                <span className="text-xs text-[#b3b3b3]">JPG, PNG, WEBP (Square recommended)</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                {!imagePreviewUrl ? (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault()
                      setIsDraggingImage(true)
                    }}
                    onDragLeave={() => setIsDraggingImage(false)}
                    onDrop={handleImageDrop}
                    className={`relative w-full sm:w-44 h-44 rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all shrink-0 ${
                      isDraggingImage
                        ? 'border-[#1DB954] bg-[#1DB954]/10'
                        : 'border-[#333] hover:border-[#1DB954]/60 bg-[#202020]/50 hover:bg-[#242424]'
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files && handleImageSelect(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <ImageIcon className="w-8 h-8 text-[#1DB954] mb-2" />
                    <p className="text-xs font-bold text-white mb-1">Upload Cover Photo</p>
                    <p className="text-[10px] text-[#888]">1400 x 1400 px minimum</p>
                  </div>
                ) : (
                  <div className="relative group w-44 h-44 rounded-xl overflow-hidden border border-[#383838] shadow-lg shrink-0">
                    <img
                      src={imagePreviewUrl}
                      alt="Cover Preview"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null)
                          setImagePreviewUrl(null)
                        }}
                        className="p-2 rounded-full bg-red-600 text-white hover:scale-110 transition-transform"
                        title="Remove artwork"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                <div className="text-xs text-[#b3b3b3] space-y-2">
                  <p className="font-semibold text-white">Cover Art Guidelines:</p>
                  <ul className="list-disc list-inside space-y-1 text-[#888]">
                    <li>Must be a square image (1:1 ratio)</li>
                    <li>High resolution (1400x1400px or larger)</li>
                    <li>Do not include blurred text or website URLs</li>
                    <li>Ensure you hold standard artwork rights</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={handleResetForm}
                className="px-6 py-3 rounded-full bg-[#242424] hover:bg-[#2a2a2a] border border-[#383838] text-xs font-bold uppercase tracking-wider text-white transition-all"
              >
                Discard
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3.5 rounded-full bg-[#1DB954] hover:bg-[#1ed760] hover:scale-105 active:scale-95 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#1DB954]/25 transition-all flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Disc className="w-4 h-4 animate-spin" /> Publishing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-current" /> Publish Track
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Right Live Preview Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#1DB954]" /> Studio Live Preview
              </h2>
              <span className="text-xs text-[#888]">Real-time listener view</span>
            </div>

            {/* Spotify Player Mock Card */}
            <div className="bg-[#181818] border border-[#282828] rounded-2xl p-6 shadow-2xl space-y-5 relative overflow-hidden group">
              {/* Subtle card lighting background */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#1DB954]/10 rounded-full blur-2xl pointer-events-none" />

              {/* Card Cover Art */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-[#242424] border border-[#333] shadow-xl flex items-center justify-center">
                {imagePreviewUrl ? (
                  <img
                    src={imagePreviewUrl}
                    alt="Preview Artwork"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center text-[#555] space-y-3">
                    <div className="w-20 h-20 rounded-full bg-[#1c1c1c] border border-[#333] flex items-center justify-center shadow-inner">
                      <Disc className="w-10 h-10 text-[#1DB954]/40" />
                    </div>
                    <span className="text-xs font-semibold text-[#777]">
                      Artwork Preview Box
                    </span>
                  </div>
                )}

                {/* Overlaid Play Button */}
                <button
                  type="button"
                  onClick={togglePlayPreview}
                  disabled={!audioPreviewUrl}
                  className={`absolute bottom-4 right-4 w-12 h-12 rounded-full bg-[#1DB954] text-black flex items-center justify-center shadow-xl shadow-black/50 transition-all ${
                    audioPreviewUrl
                      ? 'hover:scale-110 active:scale-95 opacity-100'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  title={audioPreviewUrl ? 'Play preview' : 'Upload audio first'}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current translate-x-0.5" />
                  )}
                </button>
              </div>

              {/* Track Info Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono text-white">{genre}</span>
                </div>

                <h3 className="text-xl font-extrabold text-white truncate leading-tight">
                  {title.trim() || 'Untitled Track'}
                </h3>
              </div>


              {/* Player Wave Visualizer Bar */}
              <div className="bg-[#222] rounded-xl p-3 flex items-center justify-between border border-[#333]">
                <div className="flex items-center gap-2 text-xs font-mono text-[#b3b3b3]">
                  <Volume2 className="w-4 h-4 text-[#1DB954]" />
                  <span>{audioDuration}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-bold text-[#1DB954]">
                    {audioFile ? 'Ready to stream' : 'Awaiting audio'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Tips Box */}
            <div className="bg-[#181818]/60 backdrop-blur-md border border-[#282828] rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#1DB954]" /> Optimization Tips
              </h4>
              <ul className="text-xs text-[#b3b3b3] space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#1DB954] font-bold">•</span>
                  <span>Use uncompressed WAV or 320kbps MP3 for best audio fidelity on all speaker systems.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1DB954] font-bold">•</span>
                  <span>Choose engaging cover artwork; tracks with vivid artwork get 40% more streams.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1DB954] font-bold">•</span>
                  <span>Adding accurate genre tags helps Spotify algorithm recommend your track to fans.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CreateMusic