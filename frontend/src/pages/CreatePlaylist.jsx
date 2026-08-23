import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import {
  Music2,
  ListMusic,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Search,
  CheckSquare,
  Square,
  Plus,
  Music,
  User,
  ListPlus,
} from 'lucide-react'
import axios from 'axios'
import Musicpic from '../assets/music.jpg'

const CreatePlaylist = () => {
  const navigate = useNavigate()

  // Form & Track state
  const [title, setTitle] = useState('')
  const [allMusics, setAllMusics] = useState([])
  const [selectedMusicIds, setSelectedMusicIds] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  // UI state
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Fetch all public musics
  useEffect(() => {
    let isMounted = true
    async function fetchAllMusics() {
      setLoading(true)
      try {
        const res = await axios.get('https://spotify-project-7nhp.onrender.com/api/music/', {
          withCredentials: true,
        })
        if (isMounted && res.data && res.data.musics) {
          setAllMusics(res.data.musics)
        }
      } catch (err) {
        console.warn('Error fetching musics:', err?.response?.data || err.message)
        if (isMounted) {
          setErrorMessage(err?.response?.data?.message || 'Could not fetch music tracks.')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchAllMusics()
    return () => {
      isMounted = false
    }
  }, [])

  // Toggle track selection
  const toggleTrackSelection = (id) => {
    if (selectedMusicIds.includes(id)) {
      setSelectedMusicIds(selectedMusicIds.filter((trackId) => trackId !== id))
    } else {
      setSelectedMusicIds([...selectedMusicIds, id])
    }
  }

  // Select / Deselect All
  const handleSelectAll = () => {
    if (selectedMusicIds.length === filteredMusics.length) {
      setSelectedMusicIds([])
    } else {
      setSelectedMusicIds(filteredMusics.map((m) => m._id))
    }
  }

  // Filtered tracks list based on search
  const filteredMusics = allMusics.filter(
    (m) =>
      m.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.artist?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!title.trim()) {
      setErrorMessage('Playlist Title is required.')
      return
    }
    if (selectedMusicIds.length === 0) {
      setErrorMessage('Please select at least one track for your playlist.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await axios.post(
        'http://localhost:3000/api/playlist/create-playlist',
        {
          title: title.trim(),
          musics: selectedMusicIds,
        },
        { withCredentials: true }
      )
      console.log('Playlist creation response:', res.data)
      setIsSubmitting(false)
      setSubmitSuccess(true)
    } catch (err) {
      console.warn('Create playlist error:', err?.response?.data || err.message)
      setIsSubmitting(false)
      const msg = err?.response?.data?.message || 'Failed to create playlist.'
      setErrorMessage(msg)
      alert(msg)
    }
  }

  const handleResetForm = () => {
    setTitle('')
    setSelectedMusicIds([])
    setSearchQuery('')
    setSubmitSuccess(false)
    setErrorMessage('')
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans selection:bg-[#1DB954] selection:text-black">
      {/* Background Ambient Glow */}
      <div className="fixed top-0 right-1/3 w-[500px] h-[500px] bg-[#1DB954]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navbar */}
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
            <ListMusic className="w-3.5 h-3.5" /> Playlist Studio
          </span>
          <Link
            to="/profile"
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#b3b3b3] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Profile
          </Link>
        </div>
      </header>

      {/* Main Studio Area */}
      <main className="relative z-10 px-4 sm:px-6 lg:px-12 py-8 max-w-7xl mx-auto space-y-8">
        {/* Studio Hero Banner */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1e3a2b] via-[#162a1f] to-[#181818] p-6 sm:p-8 border border-[#282828] shadow-2xl">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#1DB954] bg-[#1DB954]/10 px-3 py-1 rounded-full border border-[#1DB954]/30 mb-3">
              <ListPlus className="w-3.5 h-3.5" /> Spotify Library
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
              Create Custom Playlist
            </h1>
            <p className="text-[#b3b3b3] text-sm max-w-xl">
              Curate your favorite music tracks into a personalized playlist for listening and sharing.
            </p>
          </div>
        </section>

        {/* Success Banner */}
        {submitSuccess && (
          <div className="bg-[#1DB954]/15 border border-[#1DB954] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1DB954] flex items-center justify-center text-black shrink-0 shadow-lg shadow-[#1DB954]/30">
                <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Playlist Created Successfully!</h3>
                <p className="text-sm text-[#b3b3b3]">
                  Your playlist <strong className="text-white">"{title}"</strong> has been created with {selectedMusicIds.length} tracks.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleResetForm}
                className="px-4 py-2 rounded-full bg-[#1DB954] text-black font-bold text-xs hover:scale-105 transition-transform"
              >
                Create Another Playlist
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

        {/* Main Grid: Left Form, Right Live Playlist Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form Column (7 cols) */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
            {/* Playlist Title Card */}
            <div className="bg-[#181818]/90 backdrop-blur-md rounded-2xl p-6 border border-[#282828] shadow-xl space-y-4">
              <label className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <ListMusic className="w-4 h-4 text-[#1DB954]" /> Playlist Title <span className="text-[#1DB954]">*</span>
              </label>
              <input
                type="text"
                maxLength={80}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Chill Vibes & Weekend Hits"
                className="w-full bg-[#242424] border border-[#383838] focus:border-[#1DB954] focus:ring-1 focus:ring-[#1DB954] text-white rounded-xl px-4 py-3 text-sm placeholder-[#555] outline-none transition-all"
              />
            </div>

            {/* Select Music Tracks Card */}
            <div className="bg-[#181818]/90 backdrop-blur-md rounded-2xl p-6 border border-[#282828] shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <Music className="w-4 h-4 text-[#1DB954]" /> Select Tracks <span className="text-[#1DB954]">*</span>
                  </h2>
                  <p className="text-xs text-[#888] mt-0.5">
                    Browse and select tracks from Spotify catalog ({allMusics.length} total)
                  </p>
                </div>

                {filteredMusics.length > 0 && (
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-xs font-semibold text-[#1DB954] hover:underline self-start sm:self-auto"
                  >
                    {selectedMusicIds.length === filteredMusics.length ? 'Deselect All' : 'Select All'}
                  </button>
                )}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-[#777] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tracks or artists..."
                  className="w-full bg-[#242424] border border-[#383838] focus:border-[#1DB954] text-white rounded-xl pl-10 pr-4 py-2.5 text-xs placeholder-[#555] outline-none"
                />
              </div>

              {/* Tracks Selection List */}
              <div className="bg-[#202020] rounded-xl border border-[#333] max-h-80 overflow-y-auto divide-y divide-[#2a2a2a] p-2 space-y-1">
                {loading ? (
                  <p className="text-xs text-[#888] text-center py-8">Loading music tracks...</p>
                ) : filteredMusics.length === 0 ? (
                  <p className="text-xs text-[#888] text-center py-8">No tracks match your search</p>
                ) : (
                  filteredMusics.map((track, idx) => {
                    const isSelected = selectedMusicIds.includes(track._id)
                    return (
                      <div
                        key={track._id || idx}
                        onClick={() => toggleTrackSelection(track._id)}
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#1DB954]/15 border border-[#1DB954]/50'
                            : 'hover:bg-[#282828] border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {isSelected ? (
                            <CheckSquare className="w-5 h-5 text-[#1DB954] shrink-0" />
                          ) : (
                            <Square className="w-5 h-5 text-[#555] shrink-0" />
                          )}
                          <img
                            src={track.image || Musicpic}
                            alt={track.title}
                            className="w-10 h-10 rounded-md object-cover shrink-0"
                          />
                          <div className="truncate">
                            <p className="text-xs font-bold text-white truncate">{track.title}</p>
                            <p className="text-[10px] text-[#888] truncate">
                              {track.artist?.username || 'Artist'} • {track.type || 'Track'}
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono text-[#777] shrink-0 ml-2">
                          #{idx + 1}
                        </span>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={handleResetForm}
                className="px-6 py-3 rounded-full bg-[#242424] hover:bg-[#2a2a2a] border border-[#383838] text-xs font-bold uppercase tracking-wider text-white transition-all"
              >
                Clear
              </button>

              <button
                type="submit"
                disabled={isSubmitting || allMusics.length === 0}
                className="px-8 py-3.5 rounded-full bg-[#1DB954] hover:bg-[#1ed760] hover:scale-105 active:scale-95 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#1DB954]/25 transition-all flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <ListMusic className="w-4 h-4 animate-spin" /> Creating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-current" /> Create Playlist
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Right Live Preview Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#1DB954]" /> Live Playlist Preview
              </h2>
              <span className="text-xs text-[#888]">
                {selectedMusicIds.length} {selectedMusicIds.length === 1 ? 'Track' : 'Tracks'} Selected
              </span>
            </div>

            {/* Playlist Mock Card */}
            <div className="bg-[#181818] border border-[#282828] rounded-2xl p-6 shadow-2xl space-y-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#1DB954]/10 rounded-full blur-2xl pointer-events-none" />

              {/* Cover Grid Container */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-[#242424] border border-[#333] shadow-xl flex items-center justify-center p-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1DB954] to-[#144f28] flex items-center justify-center shadow-2xl">
                  <ListMusic className="w-10 h-10 text-black stroke-[2.5]" />
                </div>
              </div>

              {/* Playlist Details */}
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white truncate leading-tight">
                  {title.trim() || 'My Playlist'}
                </h3>
                <p className="text-xs font-semibold text-[#b3b3b3]">
                  Personal Playlist • {selectedMusicIds.length} tracks
                </p>
              </div>

              {/* Tracks List Preview */}
              <div className="space-y-2 pt-2 border-t border-[#282828]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#777]">
                  Playlist Items ({selectedMusicIds.length})
                </p>
                <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                  {selectedMusicIds.length === 0 ? (
                    <p className="text-xs text-[#555] italic">No tracks added to playlist yet</p>
                  ) : (
                    allMusics
                      .filter((m) => selectedMusicIds.includes(m._id))
                      .map((t, idx) => (
                        <div
                          key={t._id}
                          className="flex items-center justify-between text-xs py-1.5 px-2 rounded bg-[#222] text-[#b3b3b3]"
                        >
                          <div className="truncate min-w-0 pr-2">
                            <p className="truncate text-white font-medium">{idx + 1}. {t.title}</p>
                            <p className="text-[10px] text-[#888] truncate">{t.artist?.username || 'Artist'}</p>
                          </div>
                          <span className="text-[10px] text-[#1DB954] shrink-0 font-mono">Added</span>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CreatePlaylist
