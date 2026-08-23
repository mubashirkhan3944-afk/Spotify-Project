import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import {
  Music2,
  Play,
  Pause,
  BadgeCheck,
  Disc,
  ListMusic,
  Heart,
  Share2,
  MoreHorizontal,
  Clock,
  Sparkles,
  Users,
  Calendar,
} from 'lucide-react'
import axios from 'axios'
import Userpic from '../assets/user.jpg'
import Musicpic from '../assets/music.jpg'
import Albumpic from '../assets/album.jpg'
import Loading from '../components/Loading'





const UserProfile = () => {


  const [loading, setloading] = useState(true)


  const navigate = useNavigate()

  const [userData, setUserData] = useState({
  name: '',
  username: '',
  email: '',
  role: '',
  image: '',
  caption:'',
  musics:[],
  albums:[]
  })

  const {id} = useParams();

  useEffect(()=>{

    async function getData(){

      setloading(true);

      await axios.get(`https://spotify-project-7nhp.onrender.com/api/user/user/${id}`,{withCredentials:true})
      .then((res)=>{
        console.log(res.data)
        setUserData({
          name:res.data.user.name,
          username:res.data.user.username,
          email:res.data.user.email,
          role:res.data.user.role,
          image:res.data.user.image,
          caption:res.data.user.caption,
          musics:res.data.musics,
          albums:res.data.albums
        })
        setloading(false);
      })
      .catch((err)=>{
        console.log(err)
        setloading(false);
      })

    }
    getData();

  },[])


  const profile = userData;

  if(loading){
    return (
      <Loading/>
    )
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans selection:bg-[#1DB954] selection:text-black">
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
          <Link to={'/'}
          className='text-xs font-bold uppercase tracking-wider text-[#b3b3b3] hover:text-white transition-colors'>Home
          </Link>
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
            alt={userData.username}
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
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#1DB954]  px-3 py-1 rounded-full border border">
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
          {profile.caption && (
            <p className="text-sm sm:text-base text-[#b3b3b3] max-w-2xl mt-4 font-normal leading-relaxed">
              {userData.caption}
            </p>
          )}       
        </div>
      </section>


      {/* Main Tab Contents */}
      <main className="px-6 lg:px-12 py-8 max-w-7xl mx-auto space-y-12">
        {/* OVERVIEW TAB */}

          <section className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <Music2 className="w-6 h-6 text-[#1DB954]" />
                Uploaded Musics
              </h2>
            </div>

            {/* Tracks List */}
            <div className="bg-[#181818]/60 backdrop-blur-md rounded-xl p-4 border border-[#282828] divide-y divide-[#282828]">
              {userData.musics.length === 0 ? (
                <div className="text-center text-[#b3b3b3]">
                  No musics uploaded yet.
                </div>
              ) : (
                userData.musics.map((track, idx) => {

                return (
                  <div
                    key={idx}
                    onClick={()=>{
                      navigate(`/music/${track._id}`)
                    }}
                    className="flex items-center justify-between py-3 px-3 hover:bg-[#282828]/60 rounded-lg transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Track index / Play icon */}
                      <div className="w-6 text-center text-sm font-semibold text-[#b3b3b3]">
                          <span className="group-hover:hidden">{idx + 1}</span>
                        <Play className="w-4 h-4 text-white hidden group-hover:block mx-auto fill-current" />
                      </div>

                      {/* Track Cover Image */}
                      <img
                        src={track.image?track.image:Musicpic}
                        alt={track.title}
                        className="w-11 h-11 rounded-md object-cover shadow-md"
                      />

                      {/* Title & Album */}
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-sm font-semibold truncate text-white`}
                        >
                          {track.title}
                        </p>
                        <span className='text-xs text-[#b3b3b3]'>song type</span>
                      </div>
                    </div>
                  </div>
                )
              })
              )}
            </div>
          </section>

        {/* ALBUMS SECTION */}
          <section className="space-y-4 overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <Disc className="w-6 h-6 text-[#1DB954]" />
                Albums
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {userData.albums.length === 0 ?(
                <div className="text-center text-[#b3b3b3]">
                  No albums uploaded yet.
                </div>
              ):(
                userData.albums.map((album,idx) => (
                <div
                  key={idx}
                  onClick={()=>{
                    navigate(`/album/${album._id}`)
                  }}
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
                  <div className="flex items-center gap-2 text-xs text-[#b3b3b3]">
                    <span>Album</span>
                    <span>•</span>
                    <span>{album.musics.length} tracks</span>
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

export default UserProfile