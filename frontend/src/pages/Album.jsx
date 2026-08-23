import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import {
  Music2,
  Play,
  Disc,
  ArrowLeft,
  BadgeCheck,
  Music,
} from 'lucide-react'
import axios from 'axios'
import Albumpic from '../assets/album.jpg'
import Musicpic from '../assets/music.jpg'
import Userpic from '../assets/user.jpg'
import Loading from '../components/Loading'

const Album = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [album, setAlbum] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true
    async function fetchAlbumDetails() {
      setLoading(true)
      try {
        const res = await axios.get(`http://localhost:3000/api/album/album/${id}`, {
          withCredentials: true,
        })
        if (isMounted && res.data && res.data.album) {
          setAlbum(res.data.album)
        }
      } catch (err) {
        console.warn('Error fetching album details:', err?.response?.data || err.message)
        if (isMounted) {
          setErrorMessage(err?.response?.data?.message || 'Could not load album details.')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    if (id) fetchAlbumDetails()
    return () => {
      isMounted = false
    }
  }, [id])

  if (loading) {
    return (
      <Loading/>
    )
  }

  if (errorMessage || !album) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
          <Disc className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Album Not Found</h1>
        <p className="text-sm text-[#888] max-w-md mb-6">
          {errorMessage || 'The requested album could not be loaded or may have been removed.'}
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

  const artistName = album.artist?.username || album.artist?.name || 'Artist'
  const musics = album.musics || []
  const coverImage = album.image || Albumpic
  const userImage = album.artist?.image || Userpic

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans selection:bg-[#1DB954] selection:text-black">
      {/* Dynamic Background Glow */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[500px] bg-[#1DB954]/15 rounded-full blur-[160px] pointer-events-none z-0" />

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
        {/* Album Hero Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#1e3a2b]/80 via-[#181818] to-[#141414] border border-[#282828] p-6 sm:p-10 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
            {/* Album Cover Artwork */}
            <div className="relative group shrink-0 w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shadow-2xl border-2 border-[#333]">
              <img
                src={coverImage}
                alt={album.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Album Information */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-[#1DB954]  px-3 py-1 rounded-full">
                <Disc className="w-3.5 h-3.5" /> Official Album
              </span>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                {album.title}
              </h1>

              {/* Artist Link */}
              <div className="flex items-center justify-center md:justify-start gap-2 pt-1">
                {album.artist && (
                  <Link
                    to={`/user-profile/${album.artist._id}`}
                    className="flex items-center gap-2 group/artist text-sm font-bold text-white hover:text-[#1DB954] transition-colors"
                  >
                    <span className="w-6 h-6 rounded-full bg-[#1DB954] flex items-center justify-center text-black font-extrabold text-xs">
                      <img src={userImage} alt={artistName} className='w-full h-full object-cover rounded-full' />
                    </span>
                    <span>{artistName}</span>
                    <BadgeCheck className="w-4 h-4 text-[#1DB954]" />
                  </Link>
                )}
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
                      if (musics[0]?._id) navigate(`/albumplay/${id}`)
                    }}
                    className="px-8 py-3.5 rounded-full bg-[#1DB954] hover:bg-[#1ed760] hover:scale-105 active:scale-95 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#1DB954]/30 flex items-center gap-2.5 transition-all cursor-pointer"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    <span>Play Album</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Album Tracklist Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Music className="w-6 h-6 text-[#1DB954]" /> Album Tracklist
            </h2>
            <span className="text-xs text-[#888] font-mono">{musics.length} items</span>
          </div>

          <div className="bg-[#181818]/60 backdrop-blur-md rounded-2xl p-4 border border-[#282828] divide-y divide-[#282828]">
            {musics.length === 0 ? (
              <p className="text-center text-[#888] text-sm py-12">No tracks added to this album yet.</p>
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
                        {track.artist?.username || artistName} • {track.type || 'Track'}
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

export default Album