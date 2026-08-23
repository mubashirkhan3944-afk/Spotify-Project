const userModel = require('../models/user.model');
const musicModel = require('../models/music.model')
const albumModel = require('../models/album.model')
const playListModel = require('../models/playList.model')


async function getUser(req,res){
    const user = req.user._id;

    try{

        const userExists = await userModel.findById(user);

        if(!userExists){
            return res.status(404).json({
                message:'User not found!'
            })
        }
        const musics = await musicModel.find({artist:user});
        const albums = await albumModel.find({artist:user});
        const playLists = await playListModel.find({creator:user});

        res.status(200).json({
            message:'User Data fetched!',
            user:userExists,
            musics,
            albums,
            playLists
        })

    }catch(error){
        return res.status(404).json({
            message:'Error Founding User!',
            error
        })
    }
} 

async function getUserData(req,res){
    const userID = req.params.id;

    try{

        const user = await userModel.findById(userID);

        if(!user){
            return res.status(404).json({
                message:'User not found!'
            })
        }

        const musics = await musicModel.find({artist:user});
        const albums = await albumModel.find({artist:user});


        res.status(200).json({
            message:'User fetched Successfully!',
            user,
            musics,
            albums
        })

    }catch(error){
        return res.status(409).json({
            message:'Error finding user',
            error
        })
    }
}

async function getArtists(req,res){
    const artists = await userModel.find({role:'ARTIST'});

    let musics = [];
    for(const artist of artists){
        const music = await musicModel.find({artist:artist._id});
        musics.push(music);
    }


    if(artists.length === 0){
        return res.status(409).json({
            message:'No artist available!'
        })
    }

    res.status(200).json({
        message:'artists fetched!',
        artists,
        musics
    })
} 



module.exports = {
    getUser,
    getUserData,
    getArtists,
}