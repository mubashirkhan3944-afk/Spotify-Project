const express = require('express');
const { model } = require('mongoose');
const app = express();
const authRoutes = require('./routes/auth.routes')
const musicRoutes = require('./routes/music.routes')
const playListRoutes = require('./routes/playlist.routes');
const albumRoutes = require('./routes/album.routes')
const userRoutes = require('./routes/user.routes')
const cookieParser = require('cookie-parser')
const cors = require('cors')


app.use(cors({
    origin:'https://spotify-project-wuy3.vercel.app/',
    credentials:true
}))
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());


app.use('/api/auth',authRoutes);
app.use('/api/music',musicRoutes);
app.use('/api/album',albumRoutes);
app.use('/api/playlist',playListRoutes);
app.use('/api/user',userRoutes);



module.exports = app;