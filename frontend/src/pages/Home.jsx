import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import {
  Music2,
  Play,
  Pause,
  Disc,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Heart,
  BadgeCheck,
  Sparkles,
  Cookie,
  Music,
} from 'lucide-react'
import axios from 'axios'
import Musicpic from '../assets/music.jpg'
import Userpic from '../assets/user.jpg'
import Albumpic from '../assets/album.jpg'
import Loading from '../components/Loading'

const Home = () => {

  const [token, settoken] = useState(null)


  const [artist, setartist] = useState([])
  const [Music, setMusic] = useState([])
  const [album, setalbum] = useState([])
  const [loading, setloading] = useState(true)
  const [artistMusic, setartistMusic] = useState([])

  const navigate = useNavigate();

  
  useEffect(()=>{

    
    async function checkAuth(){
      setloading(true);

      await axios.get('https://spotify-project-7nhp.onrender.com/api/auth/me',{withCredentials:true})
      .then((res)=>{
        settoken(true);
      })
      .catch((err)=>{
        settoken(false);
      })

        setloading(false);
    }
    checkAuth();
    
    async function getData(){
      setloading(true);

      await axios.get('https://spotify-project-7nhp.onrender.com/api/user/artist',{withCredentials:true})
      .then((res)=>{
        setartist(res.data.artists);
        setartistMusic(res.data.musics);
      })
      .catch((err)=>{
        console.log(err)
      })

      await axios.get('https://spotify-project-7nhp.onrender.com/api/music/',{withCredentials:true})
      .then((res)=>{
        setMusic(res.data.musics);
      })
      .catch((err)=>{
        console.log(err)
      })

      await axios.get('https://spotify-project-7nhp.onrender.com/api/album/album',{withCredentials:true})
      .then((res)=>{
        setalbum(res.data.albums);
      })
      .catch((err)=>{
        console.log(err)
      })
      setloading(false);
    }
    getData();


  },[])

if(loading){
  return (
    <Loading/>
  )
}


  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans selection:bg-[#1DB954] selection:text-black">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-[#121212]/90 backdrop-blur-md px-6 py-4 border-b border-[#282828] flex items-center justify-between">
        {/* App Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-full bg-[#1DB954] flex items-center justify-center shadow-lg shadow-[#1DB954]/20 group-hover:scale-105 transition-transform">
            <Music2 className="w-5 h-5 text-black" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-[#1DB954] transition-colors">
            Spotify<span className="text-[#1DB954]">.</span>
          </span>
        </Link>

        {/* Navbar Action Buttons */}
        <nav className="flex items-center gap-3">

          {token ? (
            <>
            <Link
            to="/profile"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#242424] hover:bg-[#2a2a2a] border border-[#383838] hover:border-[#555] text-xs font-semibold text-white transition-all duration-200"
          >
            <User className="w-4 h-4 text-[#1DB954]" />
            <span>Profile</span>
          </Link>
          
            <Link
              to="/logout"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#242424] hover:bg-[#2a2a2a] border border-[#383838] hover:border-[#555] text-xs font-semibold text-white transition-all duration-200"
            >
              <LogOut className="w-4 h-4 text-[#1DB954]" />
              <span>Log Out</span>
            </Link>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#242424] hover:bg-[#2a2a2a] border border-[#383838] text-xs font-semibold text-white transition-all duration-200"
            >
              <LogIn className="w-4 h-4 text-[#b3b3b3]" />
              <span>Log In</span>
            </Link>
          )}
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="px-6 lg:px-12 py-8 max-w-7xl mx-auto space-y-12">
        {/* Welcome Hero Banner */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1e3a2b] to-[#181818] p-8 sm:p-10 border border-[#282828] shadow-2xl">
          <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-[#1DB954]/10 rounded-full blur-3xl pointer-events-none" />
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#1DB954]  px-3 py-1 rounded-full  mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Welcome Back
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3">
            Listen to Unlimited Music
          </h1>
          <p className="text-[#b3b3b3] text-sm sm:text-base max-w-xl mb-6">
            Discover trending tracks, explore top artist albums, and enjoy high quality audio streaming anytime.
          </p>
        </section>

        {/* Featured Artists Section */}
        <section className="space-y-4 overflow-x-auto">
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <BadgeCheck className="w-6 h-6 text-[#1DB954]" />
            Featured Artists
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {artist?.map((artist,idx) => (
              <div
                key={idx}
                className="bg-[#181818] hover:bg-[#282828] p-5 rounded-xl transition-all duration-300 border border-[#282828] flex items-center gap-4 group cursor-pointer"
                onClick={()=>{
                  navigate(`/user-profile/${artist._id}`)
                }}
              >
                <img
                  src={artist.image?artist.image:Userpic}
                  alt={artist.name}
                  className="w-16 h-16 rounded-full object-cover shadow-md group-hover:scale-105 transition-transform"
                />
                <div>
                  <h3 className="font-bold text-white text-base flex items-center gap-1.5">
                    {artist.name}
                    <BadgeCheck className="w-4 h-4 text-[#1DB954] shrink-0" />
                  </h3>
                  <p className="text-xs text-[#b3b3b3]">{artistMusic[idx].length} Tracks</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trending Musics Section */}
        <section className="space-y-4 overflow-x-auto">
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Music2 className="w-6 h-6 text-[#1DB954]" />
            Trending Musics
          </h2>

          <div className="bg-[#181818]/60 backdrop-blur-md rounded-xl p-4 border border-[#282828] divide-y divide-[#282828]">
            {Music?.map((track, idx) => {

              return (
                <div
                  key={idx}
                  onClick={() => navigate(`/music/${track._id}`)}
                  className="flex items-center justify-between py-3 px-3 hover:bg-[#282828]/60 rounded-lg transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-6 text-center text-sm font-semibold text-[#b3b3b3]">
                        <span className="group-hover:hidden">{idx + 1}</span>
                      <Play className="w-4 h-4 text-white hidden group-hover:block mx-auto fill-current" />
                    </div>

                    <img
                      src={track.image?track.image:Musicpic}
                      alt={track.title}
                      className="w-11 h-11 rounded-md object-cover shadow-md"
                    />

                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-semibold truncate text-white`}
                      >
                        {track.title}
                      </p>
                      <p className="text-xs text-[#b3b3b3] truncate">
                        {track.artist.username} • {track.type}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pl-4">
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Artist Albums Section */}
        <section className="space-y-4 overflow-x-auto">
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Disc className="w-6 h-6 text-[#1DB954]" />
            Popular Albums
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {album?.map((album,idx) => (
              <div
                key={idx}
                onClick={() => navigate(`/album/${album._id}`)}
                className="bg-[#181818] hover:bg-[#282828] p-4 rounded-xl transition-all duration-300 group cursor-pointer border border-[#282828]"
              >
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
                <p className="text-xs text-[#b3b3b3] mb-1">{album.artist.username}</p>
                <div className="flex items-center gap-2 text-xs text-[#727272]">
                  <span>Album</span>
                  <span>•</span>
                  <span>{album.musics.length} tracks</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default Home