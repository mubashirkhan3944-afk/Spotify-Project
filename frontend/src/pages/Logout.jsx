import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Music2, LogOut, ArrowLeft } from 'lucide-react'
import axios from 'axios'


const Logout = () => {
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)

    // TODO: Connect to backend logout API & clear auth tokens/state
    //api goes here--->
    axios.get('https://spotify-project-7nhp.onrender.com/api/auth/logout',{withCredentials:true})
    .then(()=>{
      setIsLoggingOut(false);
      navigate('/login');
    })
    .catch((err)=>{
      setIsLoggingOut(false);
      console.error(err.response.data.message);
    })


  }

  const handleCancel = () => {
    navigate(-1)
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col justify-between items-center px-4 py-8 relative overflow-hidden font-sans">
      {/* Background Ambient Glow */}
      <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#1DB954]/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Navigation Header / Logo */}
      <header className="w-full max-w-5xl py-4 flex items-center justify-between z-10">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-full bg-[#1DB954] flex items-center justify-center shadow-lg shadow-[#1DB954]/20 group-hover:scale-105 transition-transform">
            <Music2 className="w-5 h-5 text-black" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-[#1DB954] transition-colors">
            Spotify<span className="text-[#1DB954]">.</span>
          </span>
        </Link>
      </header>

      {/* Main Logout Confirmation Card */}
      <main className="w-full max-w-md my-auto z-10">
        <div className="bg-[#181818]/90 backdrop-blur-md rounded-2xl p-8 sm:p-10 shadow-2xl border border-[#282828] text-center">
          {/* Logout Icon Graphic */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 mb-6 text-red-400">
            <LogOut className="w-8 h-8 ml-1" />
          </div>

          {/* Heading & Subtitle */}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3">
            Log out of Spotify?
          </h1>
          <p className="text-[#b3b3b3] text-sm leading-relaxed mb-8">
            Are you sure you want to log out? You will need to log back in to access your playlists, saved tracks, and account settings.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Confirm Logout Button */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full bg-red-600 hover:bg-red-500 disabled:bg-red-600/50 text-white font-bold py-3.5 rounded-full text-sm uppercase tracking-wider transition-all duration-200 shadow-md shadow-red-600/20 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoggingOut ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogOut className="w-4 h-4" />
                  Log Out
                </>
              )}
            </button>

            {/* Cancel Button */}
            <button
              onClick={handleCancel}
              disabled={isLoggingOut}
              className="w-full bg-[#242424] hover:bg-[#2a2a2a] border border-[#383838] hover:border-[#555] text-white font-semibold py-3.5 rounded-full text-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Stay Logged In
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Logout