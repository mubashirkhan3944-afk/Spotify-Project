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
  Check,
} from 'lucide-react'
import axios from 'axios'


const Login = () => {


  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })


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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!formData.username || !formData.email || !formData.password) {
      setErrorMessage('Please fill in all required fields.')
      return
    }

    setIsLoading(true)


    //API call here - TO-DO
    axios.post('https://spotify-project-7nhp.onrender.com/api/auth/login',{username:formData.username,email:formData.email,password:formData.password},{withCredentials:true})
    .then((res)=>{
      setIsLoading(false);
      navigate('/');
    })
    .catch((err)=>{
      setErrorMessage(err.response.data.message);
      setIsLoading(false);
    })
    
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
            Stopify<span className="text-[#1DB954]">.</span>
          </span>
        </Link>
      </header>

      {/* Main Login Box */}
      <main className="w-full max-w-md my-auto z-10">
        <div className="bg-[#181818]/90 backdrop-blur-md rounded-2xl p-8 sm:p-10 shadow-2xl border border-[#282828]">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-white">
              Log in to Stopify
            </h1>
            <p className="text-[#b3b3b3] text-sm">
              Welcome back! Please enter your details.
            </p>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-6">
            <div className="w-full border-t border-[#292929]" />
            <span className="absolute bg-[#181818] px-4 text-xs uppercase tracking-widest text-[#727272]">
              or
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
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-bold uppercase tracking-wider text-white mb-2"
              >
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#727272]" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className="w-full bg-[#242424] hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] text-white placeholder-[#727272] rounded-md py-3 pl-11 pr-4 text-sm border border-transparent focus:border-[#1DB954] focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-white mb-2"
              >
                Email
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
                  className="w-full bg-[#242424] hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] text-white placeholder-[#727272] rounded-md py-3 pl-11 pr-4 text-sm border border-transparent focus:border-[#1DB954] focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-white mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#727272]" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
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
                  Log In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Register Link */}
          <div className="mt-8 pt-6 border-t border-[#282828] text-center">
            <p className="text-sm text-[#b3b3b3]">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-white font-bold hover:text-[#1DB954] transition-colors underline underline-offset-4 ml-1"
              >
                Sign up for Stopify
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Login
