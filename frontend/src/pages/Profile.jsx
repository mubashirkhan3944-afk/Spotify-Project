import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import {
  Music2,
  Play,
  Pause,
  BadgeCheck,
  Disc,
  ListMusic,
  Plus,
  Trash2,
  AlertTriangle,
  X,
} from 'lucide-react'
import Userpic from '../assets/user.jpg'
import Musicpic from '../assets/music.jpg'
import Albumpic from '../assets/album.jpg'
import axios from 'axios'
import Loading from '../components/Loading'




const Profile = () => {

  const [loading, setloading] = useState(true)
  const [deleteModal, setDeleteModal] = useState(null)
  // deleteModal shape: { type: 'music'|'playlist'|'album', id: string, title: string }

  const navigate = useNavigate()

  const handleDeleteClick = (e, type, id, title) => {
    e.stopPropagation()
    setDeleteModal({ type, id, title })
  }

  const handleCancelDelete = () => setDeleteModal(null)

  const handleConfirmDelete = async () => {
    if (!deleteModal) return
    const { type, id } = deleteModal
    const endpoints = {
      music: `http://localhost:3000/api/music/delete/${id}`,
      playlist: `http://localhost:3000/api/playlist/delete/${id}`,
      album: `http://localhost:3000/api/album/delete/${id}`,
    }
    try {
      await axios.delete(endpoints[type], { withCredentials: true })
      // Remove deleted item from local state
      if (type === 'music') {
        setUserData(prev => ({ ...prev, musics: prev.musics.filter(m => m._id !== id) }))
      } else if (type === 'playlist') {
        setUserData(prev => ({ ...prev, playlists: prev.playlists.filter(p => p._id !== id) }))
      } else if (type === 'album') {
        setUserData(prev => ({ ...prev, albums: prev.albums.filter(a => a._id !== id) }))
      }
    } catch (err) {
      console.error('Delete failed:', err?.response?.data?.message || err.message)
      alert(err?.response?.data?.message || 'Could not delete. Please try again.')
    } finally {
      setDeleteModal(null)
      // window.location.reload();
    }
  }

  const [userData, setUserData] = useState({
  name: '',
  username: '',
  email: '',
  role: '',
  image: '',
  caption:'',
  musics:[],
  playlists:[],
  albums:[]
  })


  useEffect(()=>{
    async function getProfile(){

      setloading(true);

      await axios.get('http://localhost:3000/api/user/',{withCredentials:true})
      .then((res)=>{

        setUserData({
          name:res.data.user.name,
          username:res.data.user.username,
          email:res.data.user.email,
          role:res.data.user.role,
          image:res.data.user.image,
          caption:res.data.user.caption,
          musics:res.data.musics,
          playlists:res.data.playLists,
          albums:res.data.albums
        })
        console.log(userData.musics)
        setloading(false);
      })
      .catch((err)=>{
        console.log(err)
        setloading(false);
      })

    }
    getProfile()
  },[])

if(loading){
  return (
    <Loading/>
  )
}

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans selection:bg-[#1DB954] selection:text-black">

      {/* ── Delete Confirmation Modal ── */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleCancelDelete}
          />
          {/* Modal Card */}
          <div className="relative z-10 w-full max-w-sm bg-[#181818] border border-[#333] rounded-2xl p-7 shadow-2xl shadow-black/60 animate-fade-in">
            {/* Close button */}
            <button
              onClick={handleCancelDelete}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#282828] hover:bg-[#333] flex items-center justify-center text-[#888] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Warning Icon */}
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-7 h-7 text-red-400" />
            </div>

            <h2 className="text-xl font-bold text-white text-center mb-2">Delete {deleteModal.type.charAt(0).toUpperCase() + deleteModal.type.slice(1)}?</h2>
            <p className="text-sm text-[#b3b3b3] text-center mb-7 leading-relaxed">
              Are you sure you want to permanently delete this?
              <br />
              <span className="text-red-400 text-xs">This action cannot be undone.</span>
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 py-2.5 rounded-full bg-[#282828] hover:bg-[#333] text-white text-sm font-bold transition-colors border border-[#383838]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-full bg-red-500 hover:bg-red-600 active:scale-95 text-white text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-[#121212]/80 backdrop-blur-md px-6 py-4 border-b border-[#282828] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full bg-[#1DB954] flex items-center justify-center shadow-lg shadow-[#1DB954]/20 group-hover:scale-105 transition-transform">
            <Music2 className="w-5 h-5 text-black" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-[#1DB954] transition-colors">
            Spotify<span className="text-[#1DB954]">.</span>
          </span>
        </Link>

        <div className="flex items-center gap-8">
          <Link to="/" className='text-xs font-bold uppercase tracking-wider text-[#b3b3b3] hover:text-white transition-colors'>
          Home</Link>
          <Link
            to="/logout"
            className="text-xs font-bold uppercase tracking-wider text-[#b3b3b3] hover:text-white transition-colors"
          >
            Log Out
          </Link>
        </div>
      </header>

      {/* Hero Profile Banner */}
      <section className="relative pt-12 pb-8 px-6 lg:px-12 bg-gradient-to-b from-[#1e3a2b] via-[#15251c] to-[#121212] flex flex-col md:flex-row items-center md:items-end gap-8 border-b border-[#282828]">
        {/* Profile Picture */}
        <div className="relative group shrink-0">
          <img
            src={userData.image?userData.image:Userpic}
            alt={userData.name}
            className="w-44 h-44 sm:w-52 sm:h-52 rounded-full object-cover shadow-2xl border-4 border-[#121212] group-hover:scale-102 transition-transform duration-300"
          />
          {userData.role === 'ARTIST' && (
            <div
              className="absolute bottom-2 right-2 bg-[#1DB954] text-black p-2 rounded-full shadow-lg"
              title="Verified Artist"
            >
              <BadgeCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#1DB954]  px-3 py-1 rounded-full border ">
                <BadgeCheck className="w-3.5 h-3.5" />  {userData.role}
              </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-3">
            {userData.username}
          </h1>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[#b3b3b3] mb-5 mt-3">
            {userData.name}
          </h3>

          {/* Bio / Caption */}
          {userData.caption && (
            <p className="text-sm sm:text-base text-[#b3b3b3] max-w-2xl mt-4 font-normal leading-relaxed">
              "{userData.caption}"
            </p>
          )}       
        </div>
      </section>



      {/* Main Tab Contents */}
      <main className="px-6 lg:px-12 py-8 max-w-7xl mx-auto space-y-12">
        {/* OVERVIEW TAB */}


            {/* Tracks List */}
            {userData.role === 'ARTIST'?(
              <section className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <Music2 className="w-6 h-6 text-[#1DB954]" />
                Uploaded Musics
              </h2>
                <Link
                to="/create-music"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black text-xs font-extrabold shadow-md shadow-[#1DB954]/20 hover:scale-105 transition-all"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Create Music</span>
              </Link>
            </div>
              <div className="bg-[#181818]/60 backdrop-blur-md rounded-xl p-4 border border-[#282828] divide-y divide-[#282828]">
              {userData.musics.length === 0 ? (
                <h1 className="text-center text-white">No songs uploaded yet</h1>
              ) : 
              (
                userData.musics.map((music, idx) => {

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-3 px-3 hover:bg-[#282828]/60 rounded-lg transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0"
                    onClick={()=>{
                      navigate(`/music/${music._id}`)
                    }}>
                      {/* Track index / Play icon */}
                      <div className="w-6 text-center text-sm font-semibold text-[#b3b3b3]">
                        <span className="group-hover:hidden">{idx + 1}</span>
                        <Play className="w-4 h-4 text-white hidden group-hover:block mx-auto fill-current" />
                      </div>

                      {/* Track Cover Image */}
                      <img
                        src={music.image?music.image:Musicpic}
                        alt={music.title}
                        className="w-11 h-11 rounded-md object-cover shadow-md"
                      />

                      {/* Title & Album */}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold truncate text-white">
                          {music.title}
                        </p>
                        <span className='text-xs text-[#b3b3b3]'>{music.type}</span>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => handleDeleteClick(e, 'music', music._id, music.title)}
                      className="ml-3 w-8 h-8 rounded-full bg-red-500/10 hover:bg-red-500 border border-red-500/30 hover:border-red-500 text-red-400 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shrink-0"
                      title="Delete track"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )
}))}
            </div>
          </section>
            ):(
              null
            )}

        {/* PLAYLISTS SECTION */}
          <section className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <ListMusic className="w-6 h-6 text-[#1DB954]" />
                Playlists
              </h2>
              <Link
                to="/create-playlist"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black text-xs font-extrabold shadow-md shadow-[#1DB954]/20 hover:scale-105 transition-all"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Create Playlist</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-x-auto">
              {userData.playlists.map((playlist,idx) => (
                <div
                  key={idx}
                  onClick={() => navigate(`/playlist/${playlist._id}`)}
                  className="bg-[#181818] hover:bg-[#282828] p-4 rounded-xl transition-all duration-300 group cursor-pointer border border-[#282828] relative"
                >
                  {/* Playlist Delete Bin */}
                  <button
                    onClick={(e) => handleDeleteClick(e, 'playlist', playlist._id, playlist.title)}
                    className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-black/60 hover:bg-red-500 border border-white/10 hover:border-red-400 text-white/60 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm"
                    title="Delete playlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="relative mb-4 aspect-square rounded-lg overflow-hidden shadow-lg">
                    <img
                      src={Musicpic}
                      alt={playlist.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button className="absolute bottom-3 right-3 w-12 h-12 rounded-full bg-[#1DB954] text-black flex items-center justify-center shadow-xl opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 cursor-pointer">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </button>
                  </div>

                  <h3 className="font-bold text-white text-base truncate mb-1">
                    {playlist.title}
                  </h3>
                  <span className='text-xs text-[#b3b3b3]'>Playlist • {playlist.musics?.length || 0} tracks</span>
                </div>
              ))}
            </div>
          </section>

        {/* ALBUMS SECTION */}
          {userData.role === 'ARTIST'?(
            <section className="space-y-4 overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <Disc className="w-6 h-6 text-[#1DB954]" />
                 Albums
              </h2>
              <Link
                to="/create-album"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black text-xs font-extrabold shadow-md shadow-[#1DB954]/20 hover:scale-105 transition-all"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Create Album</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {userData.albums.map((album,idx) => (
                <div
                  key={idx}
                  onClick={() => navigate(`/album/${album._id}`)}
                  className="bg-[#181818] hover:bg-[#282828] p-4 rounded-xl transition-all duration-300 group cursor-pointer border border-[#282828] relative"
                >
                  {/* Album Delete Bin */}
                  <button
                    onClick={(e) => handleDeleteClick(e, 'album', album._id, album.title)}
                    className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-black/60 hover:bg-red-500 border border-white/10 hover:border-red-400 text-white/60 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm"
                    title="Delete album"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="relative mb-4 aspect-square rounded-lg overflow-hidden shadow-lg">
                    <img
                      src={Albumpic}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button className="absolute bottom-3 right-3 w-12 h-12 rounded-full bg-[#1DB954] text-black flex items-center justify-center shadow-xl opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 cursor-pointer">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </button>
                  </div>

                  <h3 className="font-bold text-white text-base truncate mb-1">
                    {album.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[#b3b3b3]">
                    <span>Album</span>
                    <span>•</span>
                    <span>{album.musics.length} tracks</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
          ):(
            null
          )}


      </main>
    </div>
  )
}

export default Profile