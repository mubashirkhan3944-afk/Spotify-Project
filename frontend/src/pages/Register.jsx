import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Music2,
  ArrowRight,
  AlertCircle,
  Camera,
  Quote,
  Sparkles,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react'
import axios from 'axios'


const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: '',
    caption: '',
    image:''
  })


  const [profilePic, setProfilePic] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')


  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')


  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errorMessage) setErrorMessage('')
  }


  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    console.log(file)
    if (file) {
      setProfilePic(file)
      setPreviewUrl(URL.createObjectURL(file))
      setFormData((prev) => ({
        ...prev,
        image: file,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (
      !formData.name.trim() ||
      !formData.username.trim() ||
      !formData.email.trim() ||
      !formData.password
    ) {
      setErrorMessage('Please fill in all required fields.')
      return
    }


    setIsLoading(true)

    // API call here - TO-DO
    await axios.post('https://spotify-project-7nhp.onrender.com/api/auth/register',formData,{withCredentials:true,headers:{
      'Content-Type':'multipart/form-data'
    }})
    .then((res)=>{
      setIsLoading(false)
      navigate('/')
    })
    .catch((err)=>{
      setIsLoading(false)
      setErrorMessage(err.response.data.message);
    })


  }

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col justify-between items-center px-4 py-8 relative overflow-hidden font-sans">
      {/* Background Ambient Glow */}
      <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[650px] h-[450px] bg-[#1DB954]/15 rounded-full blur-[140px] pointer-events-none" />

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

      {/* Main Register Box */}
      <main className="w-full max-w-lg my-auto z-10 py-6">
        <div className="bg-[#181818]/90 backdrop-blur-md rounded-2xl p-8 sm:p-10 shadow-2xl border border-[#282828]">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-white">
              Sign up for Spotify
            </h1>
            <p className="text-[#b3b3b3] text-sm">
              Create your account to start listening & creating
            </p>
          </div>

          {/* Profile Picture Upload (Optional) */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative group cursor-pointer">
              <div className="w-24 h-24 rounded-full bg-[#242424] border-2 border-dashed border-[#383838] group-hover:border-[#1DB954] flex items-center justify-center overflow-hidden transition-all shadow-md">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-[#727272] group-hover:text-white transition-colors" />
                )}
              </div>
              <label
                htmlFor="profilePic"
                className="absolute bottom-0 right-0 bg-[#1DB954] hover:bg-[#1ed760] text-black p-2 rounded-full shadow-lg cursor-pointer transition-transform active:scale-95"
                title="Upload Profile Picture"
              >
                <Camera className="w-4 h-4" />
                <input
                  id="profilePic"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            <span className="text-xs text-[#727272] mt-2 font-medium">
              Profile Picture <span className="text-[#b3b3b3]">(Optional)</span>
            </span>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-400 text-sm animate-fade-in">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name (Required) */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-bold uppercase tracking-wider text-white mb-2"
              >
                Full Name <span className="text-[#1DB954]">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#727272]" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full bg-[#242424] hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] text-white placeholder-[#727272] rounded-md py-3 pl-11 pr-4 text-sm border border-transparent focus:border-[#1DB954] focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Username (Required) */}
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-bold uppercase tracking-wider text-white mb-2"
              >
                Username <span className="text-[#1DB954]">*</span>
              </label>
              <div className="relative">
                <Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#727272]" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a unique username"
                  required
                  className="w-full bg-[#242424] hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] text-white placeholder-[#727272] rounded-md py-3 pl-11 pr-4 text-sm border border-transparent focus:border-[#1DB954] focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Email (Required) */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-white mb-2"
              >
                Email Address <span className="text-[#1DB954]">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#727272]" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@domain.com"
                  required
                  className="w-full bg-[#242424] hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] text-white placeholder-[#727272] rounded-md py-3 pl-11 pr-4 text-sm border border-transparent focus:border-[#1DB954] focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password (Required) */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-white mb-2"
              >
                Password <span className="text-[#1DB954]">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#727272]" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password (min 8 chars)"
                  required
                  minLength={8}
                  className="w-full bg-[#242424] hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] text-white placeholder-[#727272] rounded-md py-3 pl-11 pr-11 text-sm border border-transparent focus:border-[#1DB954] focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#727272] hover:text-white transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Role Dropdown (Required - USER or ARTIST) */}
            <div>
              <label
                htmlFor="role"
                className="block text-xs font-bold uppercase tracking-wider text-white mb-2"
              >
                Account Type <span className="text-[#1DB954]">*</span>
              </label>
              <div className="relative">
                <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#727272]" />
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#242424] hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] text-white rounded-md py-3 pl-11 pr-10 text-sm border border-transparent focus:border-[#1DB954] focus:outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="USER">USER (Listener)</option>
                  <option value="ARTIST">ARTIST (Creator / Musician)</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#727272] pointer-events-none" />
              </div>
            </div>

            {/* Caption (Optional) */}
            <div>
              <label
                htmlFor="caption"
                className="block text-xs font-bold uppercase tracking-wider text-white mb-2"
              >
                Bio / Caption <span className="text-[#b3b3b3]">(Optional)</span>
              </label>
              <div className="relative">
                <Quote className="absolute left-3.5 top-3.5 w-5 h-5 text-[#727272]" />
                <textarea
                  id="caption"
                  name="caption"
                  value={formData.caption}
                  onChange={handleChange}
                  placeholder="Tell us a bit about yourself..."
                  rows={2}
                  className="w-full bg-[#242424] hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] text-white placeholder-[#727272] rounded-md py-3 pl-11 pr-4 text-sm border border-transparent focus:border-[#1DB954] focus:outline-none transition-all resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-[#1DB954] hover:bg-[#1ed760] disabled:bg-[#1DB954]/50 text-black font-bold py-3.5 rounded-full text-sm uppercase tracking-wider transition-all duration-200 shadow-md shadow-[#1DB954]/20 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Login Link */}
          <div className="mt-8 pt-6 border-t border-[#282828] text-center">
            <p className="text-sm text-[#b3b3b3]">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-white font-bold hover:text-[#1DB954] transition-colors underline underline-offset-4 ml-1"
              >
                Log in to Spotify
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Register