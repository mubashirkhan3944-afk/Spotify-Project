import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import {
  Music2,
  Play,
  ListMusic,
  User,
  ArrowLeft,
  Music,
} from 'lucide-react'
import axios from 'axios'
import Musicpic from '../assets/music.jpg'
import Loading from '../components/Loading'
import Userpic from '../assets/user.jpg'

const Playlist = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [playlist, setPlaylist] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true
    async function fetchPlaylistDetails() {
      setLoading(true)
      try {
        const res = await axios.get(`http://localhost:3000/api/playlist/playlist/${id}`, {
          withCredentials: true,
        })
        if (isMounted && res.data && res.data.playList) {
          setPlaylist(res.data.playList)
        }
      } catch (err) {
        console.warn('Error fetching playlist details:', err?.response?.data || err.message)
        if (isMounted) {
          setErrorMessage(err?.response?.data?.message || 'Could not load playlist details.')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    if (id) fetchPlaylistDetails()
    return () => {
      isMounted = false
    }
  }, [id])

  if (loading) {
    return (
      <Loading/>
    )
  }

  if (errorMessage || !playlist) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
          <ListMusic className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Playlist Not Found</h1>
        <p className="text-sm text-[#888] max-w-md mb-6">
          {errorMessage || 'The requested playlist could not be loaded or may have been removed.'}
        </p>
        <Link
          to="/"
          className="px-6 py-2.5 rounded-full bg-[#1DB954] text-black font-bold text-xs hover:scale-105 transition-transform"
        >
          Return to Home
        </Link>
      </div>
    )
  }

  const creatorName = playlist.creator?.username || playlist.creator?.name || 'User'
  const musics = playlist.musics || []
  const userPic = playlist.creator.image || Userpic

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans selection:bg-[#1DB954] selection:text-black">
      {/* Dynamic Background Glow */}
      <div className="fixed top-0 right-1/4 w-[600px] h-[500px] bg-[#1DB954]/15 rounded-full blur-[160px] pointer-events-none z-0" />

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

        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#242424] hover:bg-[#2a2a2a] border border-[#383838] text-xs font-semibold text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back Home
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 px-4 sm:px-6 lg:px-12 py-8 max-w-7xl mx-auto space-y-10">
        {/* Playlist Hero Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#1e3a2b]/80 via-[#181818] to-[#141414] border border-[#282828] p-6 sm:p-10 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
            {/* Playlist Icon Cover Box */}
            <div className="shrink-0 w-48 h-48 sm:w-56 sm:h-56 rounded-2xl bg-gradient-to-br from-[#1DB954] via-[#168a3f] to-[#144f28] flex items-center justify-center shadow-2xl border-2 border-[#333]">
              <ListMusic className="w-24 h-24 text-black stroke-[2.5]" />
            </div>

            {/* Playlist Information */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <span className="inline-flex items-center gap-1.5 text-md font-extrabold uppercase tracking-widest text-[#1DB954]  px-3 py-1 rounded-full">
                <ListMusic className="w-5 h-5" /> Playlist
              </span>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                {playlist.title}
              </h1>

              {/* Creator Info */}
              <div className="flex items-center justify-center md:justify-start gap-2 pt-1">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <span className="w-6 h-6 rounded-full bg-[#1DB954] flex items-center justify-center text-black font-extrabold text-xs">
                    <img src={userPic} alt={creatorName} className='w-6 h-6 rounded-full' />
                  </span>
                  <span>{creatorName}</span>
                </div>
                <span className="text-xs text-[#777]">•</span>
                <span className="text-xs font-semibold text-[#b3b3b3]">
                  {musics.length} {musics.length === 1 ? 'Track' : 'Tracks'}
                </span>
              </div>

              {/* Action Play Button */}
              {musics.length > 0 && (
                <div className="pt-4 flex justify-center md:justify-start">
                  <button
                    onClick={() => {
                      if (musics[0]?._id) navigate(`/playlistplay/${id}`)
                    }}
                    className="px-8 py-3.5 rounded-full bg-[#1DB954] hover:bg-[#1ed760] hover:scale-105 active:scale-95 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#1DB954]/30 flex items-center gap-2.5 transition-all cursor-pointer"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    <span>Play Playlist</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Playlist Tracklist Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Music className="w-6 h-6 text-[#1DB954]" /> Playlist Tracks
            </h2>
            <span className="text-xs text-[#888] font-mono">{musics.length} items</span>
          </div>

          <div className="bg-[#181818]/60 backdrop-blur-md rounded-2xl p-4 border border-[#282828] divide-y divide-[#282828]">
            {musics.length === 0 ? (
              <p className="text-center text-[#888] text-sm py-12">No tracks in this playlist yet.</p>
            ) : (
              musics.map((track, idx) => (
                <div
                  key={track._id || idx}
                  onClick={() => navigate(`/music/${track._id}`)}
                  className="flex items-center justify-between py-3.5 px-4 hover:bg-[#282828]/60 rounded-xl transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-6 text-center text-sm font-mono text-[#888] group-hover:text-[#1DB954]">
                      <span className="group-hover:hidden">{idx + 1}</span>
                      <Play className="w-4 h-4 text-[#1DB954] hidden group-hover:block mx-auto fill-current" />
                    </div>

                    <img
                      src={track.image || Musicpic}
                      alt={track.title}
                      className="w-11 h-11 rounded-lg object-cover shadow-md shrink-0"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-white group-hover:text-[#1DB954] transition-colors truncate">
                        {track.title}
                      </p>
                      <p className="text-xs text-[#b3b3b3] truncate">
                        {track.artist?.username || 'Artist'} • {track.type || 'Track'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#242424] text-[#b3b3b3] border border-[#333]">
                      {track.type || 'Single'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default Playlist
