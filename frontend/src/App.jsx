import {BrowserRouter,Route, Routes} from 'react-router'
import Login from './pages/Login'
import Logout from './pages/Logout'
import Register from './pages/Register'
import Home from './pages/Home'
import Profile from './pages/Profile'
import UserProfile from './pages/UserProfile'
import CreateMusic from './pages/CreateMusic'
import Music from './pages/Music'
import CreateAlbum from './pages/CreateAlbum'
import CreatePlaylist from './pages/CreatePlaylist'
import Album from './pages/Album'
import Playlist from './pages/Playlist'
import Albumplay from './pages/Albumplay'
import Playlistplay from './pages/Playlistplaay'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/login' element={<Login/>} />
      <Route path='/logout' element={<Logout/>} />
      <Route path='/register' element={<Register/>} />
      <Route path='/' element={<Home/>} />
      <Route path='/profile' element={<Profile/>} />
      <Route path='/user-profile/:id' element={<UserProfile />} />
      <Route path='/create-music' element={<CreateMusic />} />
      <Route path='/music/:id' element={<Music />} />
      <Route path='/create-album' element={<CreateAlbum />} />
      <Route path='/create-playlist' element={<CreatePlaylist />} />
      <Route path='/album/:id' element={<Album />} />
      <Route path='/playlist/:id' element={<Playlist />} />
      <Route path='/albumplay/:id' element={<Albumplay />} />
      <Route path='/playlistplay/:id' element={<Playlistplay />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
